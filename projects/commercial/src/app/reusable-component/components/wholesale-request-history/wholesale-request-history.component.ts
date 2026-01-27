import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { CommonService, GenTableComponent, PrintService } from 'auro-ui';
import {
  RequestHistoryParams,
  SearchRequestParams,
  SwapRequestParams,
} from '../../../utils/common-interface';
import { CommonApiService } from '../../../services/common-api.service';
import {
  FACILITY_TYPE_GROUP_MAP,
  FacilityType,
  Payment_Options,
  SameDayPayout_status,
  Wholesale_Floating_Requests,
  WholesaleRequestHistoryType,
} from '../../../utils/common-enum';
import { WsRequestHistoryActionsComponent } from '../ws-request-history-actions/ws-request-history-actions.component';
import { BailmentSetterGetterService } from '../../../bailments/services/bailment-setter-getter.service';
import { WholesaleViewRequestComponent } from '../wholesale-view-request/wholesale-view-request.component';
import {
  buildSheetData,
  filterWholesaleTaskRequestHistoryData,
  generateColumnDefs,
  mapRowsWithCaptions,
  removeSimpleActionColumn,
  transformHistoryData,
} from '../../../utils/common-utils';
import { TranslateService } from '@ngx-translate/core';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import {
  floatingRepaymentColumnDefs,
  sameDayPayout_requestHistory_ColumnDefs,
} from '../../../bailments/utils/bailment-header.utils';
import { threeDotIcon } from '../../../utils/common-header-definition';
import { fixedDrawdownColumnDefs } from '../../../fixed-floor-plan/utils/fixed-floor-plan-header.utils';
import { DashboardSetterGetterService } from '../../../dashboard/services/dashboard-setter-getter.service';
import config from '../../../../../public/assets/config.json';

@Component({
  selector: 'app-wholesale-request-history',
  //standalone: true,
  //imports: [],
  templateUrl: './wholesale-request-history.component.html',
  styleUrl: './wholesale-request-history.component.scss',
})
export class WholesaleRequestHistoryComponent {
  [x: string]: any;
  @Input() facilityType;
  swapRequestList;
  @ViewChild('dt')
  dt: GenTableComponent;
  FacilityType = FacilityType;
  selectedRequest;
  selectedType = null;
  all_requests;
  requestTypeList: any;
  ws_request_history_datalist = null;
  task_api_response;
  merge_data_list = null;
  ws_request_history_columnDefs;
  transformedSwapRequestList: any;
  originalRequestHistoryDatalist: any;
  partyId: number;
  partyName: any;
  wholesaleFloatingDropdown;
  merge_header_list = null;
  payment_option_list = Payment_Options;
  selectedPaymentOption;
  @Input() selectedSubFacility;
  selectedSubFacilityList;
  facilityContractId;
  contractStatus;
  dropdownSubFacility;

  constructor(
    public commonSvc: CommonService,
    private commonApiService: CommonApiService,
    private bailmentGetterSetter: BailmentSetterGetterService,
    public printSer: PrintService,
    public translateService: TranslateService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public dashboardSetterGetterSvc: DashboardSetterGetterService
  ) {}

  async ngOnInit() {
    // this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
    //   this.partyId = currentParty?.id;
    //   this.partyName = currentParty.name;
    // });
    this.partyId = JSON.parse(sessionStorage.getItem('currentParty'))?.id;
    this.partyName = JSON.parse(sessionStorage.getItem('currentParty'))?.name;
    if (
      this.selectedSubFacility?.facilityName.trim() &&
      this.facilityType === FacilityType.FloatingFloorPlan_Group
    ) {
      this.loadContractsBySubFacility(
        this.selectedSubFacility?.facilityName,
        this.facilityType
      );
      const params = {
        ContractId: this.facilityContractId[0]?.value,
      };
      await this.getContractStatus(params);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['facilityType'] && this.facilityType) {
      this.setRequestOptionsByFacilityType(this.facilityType);
      if (this.facilityType === FacilityType.FloatingFloorPlan_Group) {
        this.wholesaleFloatingDropdown = Wholesale_Floating_Requests;
        this.loadFacilityContractsByType(this.facilityType);
      }
    }
  }

  loadFacilityContractsByType(facilityType: string) {
    // this.dashboardSetterGetterSvc.financialList$.subscribe((list) => {
     const financialList=JSON.parse(sessionStorage.getItem('financialSummaryData')||'[]');
      const facilityMap = {
        [FacilityType.FloatingFloorPlan_Group]:
          financialList?.floatingFloorplanDetails ?? [],
      };

      const details = facilityMap[facilityType];
      if (facilityType === FacilityType.FloatingFloorPlan_Group) {
        this.selectedSubFacilityList = details
          .filter((item) => item.contractId === 0)
          .map((item) => ({
            label: item.facilityName,
            value: item.facilityName,
          }));
      }
    // });
  }

  async fetchTransferRequestList(params: SearchRequestParams) {
    try {
      this.requestTypeList =
        await this.commonApiService.getSearchRequestTypeList(params);
      const data = mapRowsWithCaptions(
        this.swapRequestList,
        this.requestTypeList
      );
      this.ws_request_history_datalist = data;
      this.ws_request_history_columnDefs = generateColumnDefs(
        data,
        this.swapRequestList
      );
      if (this.selectedRequest === 'swap') {
        this.ws_request_history_datalist.forEach((row) => {
          if (
            row['Transfer Request Status (WF)'] === 'Pending Transfer' &&
            row['New Party'] === this.partyName
          ) {
            row.action = threeDotIcon;
          }
        });
        this.ws_request_history_columnDefs.push({
          field: 'action',
          headerName: 'action',
          format: '#icons',
          overlayPanel: WsRequestHistoryActionsComponent,
          actions: 'onCellClick',
        });
      } else if (
        this.selectedType === 'repayment' ||
        this.selectedType === 'drawdown'
      ) {
        const selectedTypeLower = this.selectedType.toLowerCase();

        const filteredItems = this.ws_request_history_datalist.filter(
          (item) => item.Type?.toLowerCase() === selectedTypeLower
        );
        if (this.facilityType === FacilityType.FloatingFloorPlanGroup) {
          const facilityContractId = this.facilityContractId[0]?.value;
          this.ws_request_history_datalist = filteredItems.filter(
            (item) => item['ID Ref'] === facilityContractId
          );
        } else {
          this.ws_request_history_datalist = filteredItems;
        }
      }
      this.ws_request_history_columnDefs = removeSimpleActionColumn(
        this.ws_request_history_columnDefs
      );
    } catch (error) {
      console.log('Error while loading swap list data', error);
    }
  }

  setRequestOptionsByFacilityType(facilityType: string): void {
    this.all_requests = FACILITY_TYPE_GROUP_MAP[facilityType] || [];
  }

  onCellClick(event) {
    let filteredRecord;
    if (this.originalRequestHistoryDatalist) {
      filteredRecord = this.originalRequestHistoryDatalist.find(
        (item) => item.taskId === event.rowData.taskId
      );
    }
    const rowDataToSet = filteredRecord ? filteredRecord : event.rowData;
    this.bailmentGetterSetter.setReqHisSwapRowData(rowDataToSet);
    if (
      event.colName === 'Transfer Request No.' ||
      event.colName === 'taskId' ||
      event.colName === 'Request No.' ||
      event.colName === 'Contract No.'
    ) {
      this.commonSvc.dialogSvc
        .show(WholesaleViewRequestComponent, 'View Request', {
          templates: {
            footer: null,
          },
          data: {
            facilityType: this.facilityType,
            type: event.colName,
            // selectedType: this.selectedType,
            selectedRequest:this.selectedRequest,
            selectedType:
              this.selectedType || event.rowData?.type?.toLowerCase(),
            selectedRowData: rowDataToSet,
            selectedPaymentOption: this.selectedPaymentOption,
          },
          width: '78vw',
          height: '30vw',
          contentStyle: { overflow: 'auto' },
          styleClass: 'dialogue-scroll',
          position: 'center',
        })
        .onClose.subscribe((data: any) => {});
    } else if (event.colName === 'idRef') {
      this.commonSvc.router.navigateByUrl(
        `/bailments/asset-details/${event.rowData.idRef}`
      );
    }
  }

  getRecordIdByNameContains = (data: any[], keyword: string): number | null =>
    data.find((item) => item.name.toLowerCase().includes(keyword.toLowerCase()))
      ?.id ?? null;

  async search() {
    // Clear previous data before fetching new data
    this.ws_request_history_datalist = null;
    this.task_api_response = null;
    this.merge_data_list = null;

    if (this.selectedRequest === 'sameDayPayout') {
      this.ws_request_history_columnDefs =
        sameDayPayout_requestHistory_ColumnDefs;
      const param = { partyNo: this.partyId };
      await this.fetchRequestHistory(param);
    } else if (this.selectedPaymentOption === 'nominated') {
      let params;
      params = {
        inboxViewType: WholesaleRequestHistoryType.DRAWDOWN_REQUEST_INBOX,
      };
      await this.fetchSwapRequestList(params, this.selectedType);
      const params1 = {
        typeId: this.getRecordIdByNameContains(
          this.swapRequestList,
          'repayment'
        ),
      };
      await this.fetchTransferRequestList(params1);
    } else if (this.selectedPaymentOption === 'udc') {
      this.ws_request_history_columnDefs = floatingRepaymentColumnDefs;
      const params3 = { partyNo: this.partyId };
      await this.fetchRequestHistory(params3);
    } else if (
      this.selectedRequest === 'drawdown' &&
      this.facilityType === FacilityType.FixedFloorPlan_Group
    ) {
      this.ws_request_history_columnDefs = fixedDrawdownColumnDefs;
      const param = { partyNo: this.partyId };
      await this.fetchRequestHistory(param);
    } else if (
      this.selectedType === 'drawdown' &&
      this.facilityType === FacilityType.FloatingFloorPlanGroup
    ) {
      let params;
      params = {
        typeId: this.getRecordIdByNameContains(
          this.swapRequestList,
          'drawdown'
        ),
      };
      this.fetchTransferRequestList(params);
    } else {
      const params = { typeId: this.selectedType };
      await this.fetchTransferRequestList(params);
    }
  }

  reset() {
    this.selectedRequest = null;
    this.selectedType = null;
    this.ws_request_history_datalist = null;
    this.task_api_response = null;
    this.merge_data_list = null;
  }

  export() {
    const tableId = this.dt;
    const dt = this.dt;
    // const { tableId, dt } = this.config.data || {};
    if (!tableId || !dt) {
      console.error('Table ID or data is missing');
      return;
    }
    const workbookData = [];
    //const filteredData = cleanDataList(dt.columns, dt.dataList);
    workbookData.push(
      buildSheetData({
        sheetName: 'Sheet 1',
        columns: dt.columns,
        dataList: dt.dataList,
        translateService: this.translateService,
        excludedFields: ['action'],
      })
    );
    this.printSer.export('xlsx', 'Request History', workbookData);
  }

  onRequestChange(event) {
    this.selectedRequest = event.value;
    if (event.value === 'swap' || event.value === 'productTransfer') {
      let params;
      params = {
        inboxViewType: WholesaleRequestHistoryType.TRSANSFER_REQUEST_INBOX,
      };
      this.fetchSwapRequestList(params, event.value);
    } else if (event.value === 'purchaseRequest') {
      this.task_api_response = null;
      let params;
      params = {
        inboxViewType: WholesaleRequestHistoryType.PURCHASE_REQUEST_INBOX,
        clientId: config.environment,
      };
      this.fetchSwapRequestList(params, event.value);
    } else if (
      event.value === 'drawdown' &&
      (this.facilityType === FacilityType.FixedFloorPlan_Group ||
        this.facilityType === FacilityType.FloatingFloorPlanGroup)
    ) {
      let params;
      this.ws_request_history_datalist = null;
      params = {
        inboxViewType: WholesaleRequestHistoryType.CONTRACT_INBOX,
      };
      this.fetchSwapRequestList(params, event.value);
      //this.wholesaleFloatingDropdown = Wholesale_Floating_Requests;
    } else {
      this.transformedSwapRequestList = SameDayPayout_status;
    }
  }

  async fetchRequestHistory(params: RequestHistoryParams) {
    try {
      let data = await this.commonApiService.getRequestHistoryList(params);
      if (data) {
        if (this.facilityType === FacilityType.FixedFloorPlan_Group) {
          data = data.map((item) => {
            if (item.externalData?.assetDrawdownRequest) {
              item.externalData.assetDrawdownRequest.type = 'Drawdown';
            }
            return item;
          });
        }
        const filteredData = filterWholesaleTaskRequestHistoryData(
          data,
          this.facilityType,
          this.selectedType
        );
        // this.originalRequestHistoryDatalist = filteredData;
        if (
          (this.dropdownSubFacility &&
            this.facilityType === FacilityType.FloatingFloorPlanGroup &&
            this.selectedPaymentOption === 'udc') ||
          (this.selectedSubFacility?.facilityName?.trim() &&
            this.facilityType === FacilityType.FloatingFloorPlanGroup &&
            this.selectedPaymentOption === 'udc')
        ) {
          const subfacility =
            this.selectedSubFacility?.facilityName?.trim() ||
            this.dropdownSubFacility;
          this.originalRequestHistoryDatalist = this.filterBasedOnSubFacility(
            subfacility,
            filteredData
          );
        } else {
          this.originalRequestHistoryDatalist = filteredData;
        }
        this.task_api_response = transformHistoryData(
          this.originalRequestHistoryDatalist
        );
        if (
          this.selectedRequest === 'sameDayPayout' &&
          this.selectedType === 'pending'
        ) {
          const result = this.task_api_response.filter(
            (x) => x.status !== 'Completed'
          );
          this.task_api_response = result;
        } else if (
          this.selectedRequest === 'sameDayPayout' &&
          this.selectedType === 'Completed'
        ) {
          const result = this.task_api_response.filter(
            (x) => x.status === 'Completed'
          );
          this.task_api_response = result;
        }
      }
    } catch (error) {
      console.log('Error while loading request history', error);
    }
  }
  filterBasedOnSubFacility(subFacility: string, filteredData: any[]) {
    return filteredData.filter(
      (item) =>
        item?.externalData?.floatingFloorPlanRepaymentRequest?.subFacility ===
        subFacility
    );
  }

  async fetchSwapRequestList(params: SwapRequestParams, value) {
    try {
      this.swapRequestList = await this.commonApiService.getSwapRequestTypeList(
        params
      );
      if (this.swapRequestList) {
        if (value === 'swap') {
          this.transformedSwapRequestList = this.swapRequestList
            .filter((item) => item.name?.toLowerCase().includes('swap'))
            .map((item) => ({
              label: item.name,
              value: item.id,
            }));
        } else if (value === 'purchaseRequest') {
          this.transformedSwapRequestList = this.swapRequestList
            ?.filter((x) =>
              this.facilityType
                ?.toLowerCase()
                .includes(x.facility?.toLowerCase())
            )
            ?.map((x) => {
              let label = x.name; // default

              const nameLower = x.name?.toLowerCase() ?? '';

              if (nameLower.includes('pending')) {
                label = 'Pending';
              } else if (nameLower.includes('processed')) {
                label = 'Processed';
              }

              return { label, value: x.id };
            });
        } else {
          // Include items that do NOT contain "swap"
          this.transformedSwapRequestList = this.swapRequestList
            .filter((item) => !item.name?.toLowerCase().includes('swap'))
            .map((item) => ({
              label: item.name,
              value: item.id,
            }));
        }
      }
    } catch (error) {
      console.log('Error while loading swap list data', error);
    }
  }

  onPrint() {
    print();
  }

  onTypeChange(event) {
    this.selectedType = event.value;
    if (event.value === 'drawdown') {
      let params;
      params = {
        inboxViewType: WholesaleRequestHistoryType.DRAWDOWN_REQUEST_INBOX,
      };
      this.fetchSwapRequestList(params, event.value);
    }
  }
  async onSubFacilityChange(event) {
    if (event.value) {
      this.dropdownSubFacility = event?.value;
      this.loadContractsBySubFacility(event.value, this.facilityType);
      const params = {
        ContractId: this.facilityContractId[0]?.value,
      };
      await this.getContractStatus(params);
    }
  }
  async getContractStatus(params) {
    try {
      const response = await this.commonApiService.getContractStatus(params);
      this.contractStatus = response.data.contractStatus;
    } catch (error) {
      console.log('Error getting program defaults:', error);
      return null;
    }
  }

  loadContractsBySubFacility(facility: string, facilityType: string) {
    // this.dashboardSetterGetterSvc.financialList$.subscribe((list) => {
     const financialList=JSON.parse(sessionStorage.getItem('financialSummaryData')||'[]');
      const facilityMap = {
        [FacilityType.FloatingFloorPlan_Group]:
          financialList?.floatingFloorplanDetails ?? [],
      };
      const contracts = facilityMap[facilityType];
      const filteredContracts = contracts.filter(
        (item) =>
          item.facilityName === facility &&
          item.contractId !== 0 &&
          item.facilityType?.trim()
      );

      this.facilityContractId = filteredContracts.map((contract) => ({
        value: contract.contractId,
      }));
    // });
  }

  onPaymentOptionChange(event) {
    this.selectedPaymentOption = event.value;
  }
}
