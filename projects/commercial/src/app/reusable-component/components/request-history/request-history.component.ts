import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonService, GenTableComponent, PrintService } from 'auro-ui';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import {
  afvProductType,
  FacilityType,
  FacilityTypeDropdown,
  leaseProductType,
  loanProductType,
  optionDataFacilities,
} from '../../../utils/common-enum';
import { ViewRequestComponent } from '../view-request/view-request.component';
import {
  buildSheetData,
  filterByCriteria,
  getUniqueDropdownOptions,
  isValidDateFormat,
  printTable,
  transformHistoryData,
} from '../../../utils/common-utils';
import { CommonApiService } from '../../../services/common-api.service';
import { CreditlineSetterGetterService } from '../../../creditlines/services/creditline-setter-getter.service';
import { NonFacilityGetterSetterService } from '../../../non-facility-loans/services/non-facility-getter-setter.service';
import { RequestHistoryParams } from '../../../utils/common-interface';
import { requestHistoryColumnDefs } from '../../../dashboard/utils/dashboard-header.util';
import { StatusNoteComponent } from '../status-note/status-note.component';
import { TranslateService } from '@ngx-translate/core';

const excludeValues: any = ['OperatingLease', 'BuyBack Facility'];

@Component({
  selector: 'app-request-history',
  templateUrl: './request-history.component.html',
  styleUrl: './request-history.component.scss',
})
export class RequestHistoryComponent {
  @ViewChild('dt')
  dt: GenTableComponent;
  tableId: string = 'requestList';
  @Input() requestHistoryDataList = [];
  @Input() requestHistoryColumnDefs;
  @Input() originalRequestHistoryDatalist;
  @Input() facilityType;
  @Output() dateParamsEmit = new EventEmitter<any>();
  searchFacility;
  selectionMode: any;
  selectedFromDate: any;
  selectedToDate: any;
  requestTypeOptions;
  subFacilityOptions;
  facilityTypeOptions;
  partyId: any;
  fromDate;
  toDate;
  requestType;
  subFacility;
  originalRequestHistoryBackup: any[];
  workingDataList: any[];
  allProducts: any;
  selectedSubFacility: any;
  facility: any;
  notesDataList: any = [];
  notesResponse: any = [];
  facilityDataList: any;
  constructor(
    public svc: CommonService,
    public printSer: PrintService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    private cdr: ChangeDetectorRef,
    private commonApiService: CommonApiService,
    public creditSetterGetter: CreditlineSetterGetterService,
    public nonFacilityService: NonFacilityGetterSetterService,
    public translateService: TranslateService
  ) {}

  ngOnInit() {
    this.partyId = JSON.parse(sessionStorage.getItem('currentParty'))?.id;
    if (!this.partyId) {
      this.svc.router.navigateByUrl('commercial');
    }
    this.commonSetterGetterSvc.facilityList$.subscribe((list: any) => {
      if (!list?.length) return;
      this.facilityDataList = list.filter(
        (item) => !excludeValues.includes(item.value)
      );
      this.facilityTypeOptions = this.facilityDataList.map((item) => ({
        label: FacilityTypeDropdown[item.value],
        value:
          optionDataFacilities[
            item.label as keyof typeof optionDataFacilities
          ],
      }));
      if (this.facilityTypeOptions) {
        sessionStorage.setItem(
          'optionDataFacilities',
          JSON.stringify(this.facilityTypeOptions)
        );
      }
    });

    // Filtered result

    this.commonSetterGetterSvc.allProductsList.subscribe((products) => {
      this.allProducts = products;
    });
    if (!this.facilityType) {
      this.requestHistoryColumnDefs = requestHistoryColumnDefs;
      const param = { partyNo: this.partyId };
      this.fetchRequestHistory(param);
    }
  }

  ngOnChanges(changes) {
    if (
      changes['originalRequestHistoryDatalist'] &&
      Array.isArray(this.originalRequestHistoryDatalist)
    ) {
      this.originalRequestHistoryBackup = [
        ...this.originalRequestHistoryDatalist,
      ];
      this.requestHistoryDataList = transformHistoryData(
        this.originalRequestHistoryBackup
      );
      this.subFacilityOptions = getUniqueDropdownOptions(
        this.originalRequestHistoryBackup,
        'subFacility',
        this.facility
      );
      this.requestTypeOptions = getUniqueDropdownOptions(
        this.originalRequestHistoryBackup,
        'subject'
      );
    }
  }

  async fetchRequestHistory(params: RequestHistoryParams) {
    try {
      const data = await this.commonApiService.getRequestHistoryList(params);
      if (data) {
        this.originalRequestHistoryDatalist = data;
        this.originalRequestHistoryBackup = data;
        this.requestHistoryDataList = transformHistoryData(
          this.originalRequestHistoryDatalist
        );
        this.subFacilityOptions = getUniqueDropdownOptions(
          this.originalRequestHistoryBackup,
          'subFacility'
        );
        this.requestTypeOptions = getUniqueDropdownOptions(
          this.originalRequestHistoryBackup,
          'subject'
        );
      }
    } catch (error) {
      console.log('Error while loading request history', error);
    }
  }

  onFromDateChange(event) {
    if (!isValidDateFormat(event)) {
      return; // Don't emit if the date format is invalid
    }
    this.fromDate = event;
  }

  onToDateChange(event) {
    if (!isValidDateFormat(event)) {
      return; // Don't emit if the date format is invalid
    }
    this.toDate = event;
  }

  findTaskById(id: number): any {
    return this.originalRequestHistoryDatalist.find(
      (task) => task.taskId === id
    );
  }

  onCellClick(event) {
    if (event.colName == 'taskId') {
      const data = this.findTaskById(event.rowData.taskId);

      this.svc.dialogSvc
        .show(ViewRequestComponent, ' ', {
          templates: {
            footer: null,
          },
          data: { selectedRow: data },
          height: '30vw',
          width: '75vw',
          contentStyle: { overflow: 'auto' },
          styleClass: 'dialogue-scroll',
          position: 'center',
        })
        .onClose.subscribe((data: any) => {});
    } else if (event.colName == 'status' && event.cellData === 'Pending') {
      this.svc.dialogSvc
        .show(StatusNoteComponent, event.cellData, {
          templates: {
            footer: null,
          },
          data: { taskId: event.rowData.taskId },
          height: '15vw',
          width: '20vw',
          contentStyle: { overflow: 'auto' },
          styleClass: 'dialogue-scroll',
          position: 'center',
        })
        .onClose.subscribe((data: any) => {});
    } else if (event.colName == 'loanNo') {
      // if (event.rowData.loanNo == 'new loan') {
      //   return;
      // }
      const param = {
        partyId: this.partyId,
        contractId: event.rowData.loanNo,
      };
      this.fetchLoans(param, event.rowData);
    }
  }

  async fetchNotesByTaskId(params) {
    try {
      this.notesDataList = await this.commonApiService.getNotesByTaskId(params);
    } catch (error) {
      console.log('Error while loading documents data', error);
    }
  }
  async fetchLoans(params, rowData?) {
    try {
      const data = await this.commonApiService.getLoansData(params);
      const loanData = data[0];
      this.checkFacilityAndNavigate(loanData, rowData);
    } catch (error) {
      console.log('Error while loading loans data', error);
    }
  }

  checkFacilityAndNavigate(loanData, rowData?) {
    let matchedProduct: any;
    matchedProduct = this.allProducts.find(
      (product) => product.name === loanData.productType
    );
    if (matchedProduct) {
      loanData.productType = matchedProduct.extName;
    }
    if (
      this.facilityType === FacilityType.CreditLines ||
      rowData.facilityType === FacilityType.CreditLines
    ) {
      if (loanProductType.includes(matchedProduct?.code)) {
        this.creditSetterGetter.setLoansData({
          currentFacility: this.selectedSubFacility,
        });
        this.svc.router.navigateByUrl(
          `commercial/creditlines/loan/${loanData.contractId}`
        );
      } else if (leaseProductType.includes(matchedProduct?.code)) {
        this.creditSetterGetter.setLeaseData({
          currentFacility: this.selectedSubFacility,
        });
        this.svc.router.navigateByUrl(
          `commercial/creditlines/lease/${loanData.contractId}`
        );
      }
    } else if (
      this.facilityType === FacilityType.NonFacilityLoan ||
      rowData.facilityType === FacilityType.NonFacilityLoan
    ) {
      if (loanProductType.includes(matchedProduct?.code)) {
        this.svc.router.navigateByUrl(
          `commercial/non-facility-loan/loan/${loanData.contractId}`
        );
      } else if (leaseProductType.includes(matchedProduct?.code)) {
        this.nonFacilityService.setLeaseData({
          currentFacility: this.selectedSubFacility,
        });
        this.svc.router.navigateByUrl(
          `commercial/non-facility-loan/lease/${loanData.contractId}`
        );
      } else if (afvProductType.includes(matchedProduct?.code)) {
        this.nonFacilityService.setAfvLoanData({
          currentFacility: this.selectedSubFacility,
        });
        this.svc.router.navigateByUrl(
          `commercial/non-facility-loan/afv-loan/${loanData.contractId}`
        );
      }
    } else if (
      this.facilityType === FacilityType.Assetlink ||
      rowData.facilityType === FacilityType.Assetlink
    ) {
      this.svc.router.navigateByUrl(
        `commercial/assetlink/loan/${loanData.contractId}`
      );
    } else if (
      this.facilityType === FacilityType.Easylink ||
      rowData.facilityType === FacilityType.Easylink
    ) {
      this.svc.router.navigateByUrl(
        `commercial/easylink/loan/${loanData.contractId}`
      );
    }
  }

  onSubFacilityChange(event) {
    this.subFacility = event.value;
    this.requestTypeOptions = getUniqueDropdownOptions(
      this.originalRequestHistoryBackup,
      'subject',
      this.facility,
      this.subFacility
    );
  }

  onFacilityChange(event) {
    this.facility = event.value;
    this.subFacilityOptions = getUniqueDropdownOptions(
      this.originalRequestHistoryBackup,
      'subFacility',
      this.facility
    );
  }

  onRequestTypeChange(event) {
    this.requestType = event.value;
  }

  search() {
    const filters = {
      facility: this.facility,
      subFacility: this.subFacility,
      requestType: this.requestType,
      fromDate: this.fromDate,
      toDate: this.toDate,
    };

    const filtered = filterByCriteria(
      this.originalRequestHistoryBackup,
      filters
    );
    this.requestHistoryDataList = transformHistoryData(filtered);

    // If OnPush strategy is used:
    this.cdr.detectChanges();
  }

  reset() {
    this.subFacility =
      this.requestType =
      this.fromDate =
      this.toDate =
      this.facility =
        null;
    this.requestHistoryDataList = transformHistoryData(
      this.originalRequestHistoryBackup
    );
    this.cdr.detectChanges();
  }

  onPrint() {
    //Default Landscape
    printTable(this.requestHistoryColumnDefs,this.requestHistoryDataList,this.translateService);
  }

  // export() {
  //   const tableId = this.tableId;
  //   const dt = this.dt;

  //   // const { tableId, dt } = this.config.data || {};
  //   if (!tableId || !dt) {
  //     console.error('Table ID or data is missing');
  //     return;
  //   }
  //   let columns = dt.columns || [];
  //   const data = dt.dataList || [];
  //   if (columns) {
  //     columns = columns.filter((column) => column.headerName !== 'Action');
  //   }
  //   this.printSer.export('xlsx', tableId, columns, data);
  // }

  export() {
    const tableId = this.tableId;
    const dt = this.dt;

    if (!tableId || !dt) {
      console.error('Table ID or data is missing');
      return;
    }

    const workbookData = [];
    workbookData.push(
      buildSheetData({
        sheetName: 'Sheet 1',
        columns: dt.columns,
        dataList: dt.dataList,
        translateService: this.translateService,
        excludedFields: ['action'], // exclude action column from export
      })
    );

    this.printSer.export('xlsx', tableId, workbookData);
  }
}
