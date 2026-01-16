import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ComponentLoaderService } from '../../services/component-loader.service';
import { CommonService } from 'auro-ui';
import { PrintService } from 'auro-ui';
import { FacilityAssetsService } from '../../services/facility-assets.service';
import { RequestRepaymentComponent } from '../../../reusable-component/components/request-repayment/request-repayment.component';
import { PaymentForcastComponent } from '../../../reusable-component/components/payment-forcast/payment-forcast.component';
import { InterestPaymentForcastComponent } from '../../../reusable-component/components/interest-payment-forcast/interest-payment-forcast.component';
import { TransactionFlowComponent } from '../../../reusable-component/components/transaction-flow/transaction-flow.component';
import {
  buildSheetData,
  calculatePaymentNotYetAllocated,
  filterByFacilityType,
  getCurrentAccountLoans,
  print,
  transformHistoryData,
} from '../../../utils/common-utils';
import { CommonApiService } from '../../../services/common-api.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import {
  loansPaymentColumnDefs,
  paymentForecastColumnDefs,
  loanTransactionsColumnDef,
  paymentForecastInterestOnlyColumnDefs,
} from '../../../utils/common-header-definition';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { isEqual } from 'lodash';
import { requestHistoryColumnDefs } from '../../utils/assetlink-header.util';
import { RequestHistoryParams } from '../../../utils/common-interface';
import { FacilityType } from '../../../utils/common-enum';
import { DashboardSetterGetterService } from '../../../dashboard/services/dashboard-setter-getter.service';
import { DrawdownRequestComponent } from '../../../reusable-component/components/drawdown-request/drawdown-request.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-current-account',
  templateUrl: './current-account.component.html',
  styleUrls: ['./current-account.component.scss'],
})
export class CurrentAccountComponent implements OnInit {
  currentComponent: string | null = null;
  tableId: string;
  facilityType = FacilityType.Assetlink;
  @Input() selectedSubFacility;
  paymentForcastDataList;
  paymentColumnDefs = loansPaymentColumnDefs;
  assetlinkTransactionsColumnDef;
  @ViewChild('PaymentForcast') PaymentForcast: PaymentForcastComponent;
  @ViewChild('InterestPaymentForecast')
  InterestPaymentForecast: InterestPaymentForcastComponent;
  @ViewChild('TransactionFlow') TransactionFlow: TransactionFlowComponent;
  partyId;
  paymentDataList;
  transactionsDataList;
  sumOfPrincipal;
  transactionsColumnDef = loanTransactionsColumnDef;
  paymentForecastColumnDefs;
  date: String;
  toDate: any = new Date();
  fromDate: string;
  frequency: string;
  overDue;
  paymentNotYetAllocated;
  paramChangeSubject = new Subject<any>();
  requestHistoryDataList: any;
  originalRequestHistoryDatalist;
  requestHistoryColumnDefs = requestHistoryColumnDefs;
  currentAccountContract;
  accessGranted;

  constructor(
    public svc: CommonService,
    private componentLoaderService: ComponentLoaderService,
    public printSer: PrintService,
    public facilityAssetsService: FacilityAssetsService,
    private commonApiService: CommonApiService,
    public commonSetterGetterService: CommonSetterGetterService,
    public dashboardSetterGetterSvc: DashboardSetterGetterService,
    public translateService: TranslateService
  ) {}

  ngOnInit() {
    this.tableId = 'PaymentForcast';
    const current = sessionStorage.getItem('currentComponent');
    this.currentComponent = current ? current : 'PaymentForcast';
    sessionStorage.setItem('currentComponent', this.currentComponent);
    const roleBased = JSON.parse(sessionStorage.getItem('RoleBasedActions'));
    if (
      roleBased &&
      roleBased.functions &&
      typeof roleBased.functions === 'object'
    ) {
      this.accessGranted = Object.keys(roleBased.functions).map((fn) =>
        fn.trim()
      );
    } else {
      this.accessGranted = [];
    }
    const partyData = sessionStorage.getItem('currentParty');
    const partyId = JSON.parse(partyData);
    this.partyId = partyId?.id;
    const stored = sessionStorage.getItem('selectedAssetlinkSubFacility');
    this.selectedSubFacility = stored ? JSON.parse(stored) : [];
    this.componentLoaderService.component$.subscribe((componentName) => {
      this.currentComponent = componentName;
    });

    this.paramChangeSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => isEqual(prev, curr))
      )
      .subscribe((eventData) => {
        const updatedParams = {
          ...eventData,
          partyId: this.partyId,
          subFacilityId: this.selectedSubFacility?.id,
        };
        this.fetchPaymentForecast(updatedParams);
      });
    const sessionData = sessionStorage.getItem('financialSummaryData');
    const facilityData = sessionData ? JSON.parse(sessionData) : null;
    const facilityMap = {
      [FacilityType.Assetlink]: facilityData?.assetLinkDetails ?? [],
      [FacilityType.Easylink]: facilityData?.easyLinkDetails ?? [],
      [FacilityType.CreditLines]: facilityData?.creditlineDetails ?? [],
      default: facilityData?.nonFacilityLoansDetails ?? [],
    };
    const details = facilityMap[this.facilityType] || facilityMap.default;
    this.currentAccountContract = getCurrentAccountLoans(details);
    const transactionFlowParams = {
      partyId: this.partyId,
      contractId: this.currentAccountContract[0],
    };
    this.fetchPaymentsTab(transactionFlowParams);
    this.fetchTransactionsTab(transactionFlowParams);
  }

  onParamsChange(eventData) {
    this.paramChangeSubject.next(eventData);
  }

  hasAccess(key) {
    if (!this.accessGranted || !Array.isArray(this.accessGranted)) {
      return true;
    }
    return !this.accessGranted?.includes(key);
  }

  callPaymentAPI(eventData) {
    this.fetchPaymentForecast(eventData);
  }

  async fetchPaymentForecast(params) {
    try {
      this.paymentForcastDataList =
        await this.commonApiService.getPaymentForcastData(params);
      this.sumOfPrincipal = this.calculateTotalPrincipal();
      if (this.sumOfPrincipal > 0) {
        this.paymentForecastColumnDefs = paymentForecastColumnDefs;
      } else {
        this.paymentForecastColumnDefs = paymentForecastInterestOnlyColumnDefs;
      }
    } catch (error) {
      console.log('Error while loading payment forcast data', error);
    }
  }

  async fetchRequestHistory(params: RequestHistoryParams) {
    try {
      const data = await this.commonApiService.getRequestHistoryList(params);
      if (data) {
        this.originalRequestHistoryDatalist = filterByFacilityType(
          data,
          FacilityType.Assetlink
        );
        this.requestHistoryDataList = transformHistoryData(
          this.originalRequestHistoryDatalist
        );
      }
    } catch (error) {
      console.log('Error while loading account forcast data', error);
    }
  }

  calculateTotalPrincipal() {
    let totalPrincipal = 0;

    // Check if paymentForecasts exists and is an array
    if (
      this.paymentForcastDataList &&
      Array.isArray(this.paymentForcastDataList.paymentForecasts)
    ) {
      // Check if 'principal' key exists in the first object
      const hasPrincipal =
        'principal' in this.paymentForcastDataList.paymentForecasts[0];

      if (hasPrincipal) {
        totalPrincipal = this.paymentForcastDataList.paymentForecasts.reduce(
          (sum, item) => {
            return sum + (item.principal || 0);
          },
          0
        );
      }
    }

    return (totalPrincipal = totalPrincipal); // return totalPrincipal;
  }

  async showPaymentForcast() {
    this.componentLoaderService.loadComponent('PaymentForcast');
    this.tableId = 'PaymentForcast';
  }

  async showTransactionFlow() {
    this.dashboardSetterGetterSvc.financialList$.subscribe((list) => {
      const facilityMap = {
        [FacilityType.Assetlink]: list?.assetLinkDetails ?? [],
        [FacilityType.Easylink]: list?.easyLinkDetails ?? [],
        [FacilityType.CreditLines]: list?.creditlineDetails ?? [],
        default: list?.nonFacilityLoansDetails ?? [],
      };

      const details = facilityMap[this.facilityType] || facilityMap.default;
      this.currentAccountContract = getCurrentAccountLoans(details);
    });

    this.currentComponent = 'TransactionFlow';
    this.componentLoaderService.loadComponent('TransactionFlow');
    this.tableId = 'TransactionFlow';
  }

  async fetchPaymentsTab(params) {
    try {
      this.paymentDataList = await this.commonApiService.getPaymentsTabData(
        params
      );
      if (this.paymentDataList) {
        this.paymentNotYetAllocated = calculatePaymentNotYetAllocated(
          this.paymentDataList
        );
      }
    } catch (error) {
      console.log('Error while loading payment forcast data', error);
    }
  }

  async fetchTransactionsTab(params) {
    try {
      this.transactionsDataList =
        await this.commonApiService.getTransactionsTabData(params);
      if (this.transactionsDataList) {
        this.overDue = this.calculateTotalOutstandingAmount(
          this.transactionsDataList
        );
      }
    } catch (error) {
      console.log('Error while loading payment forcast data', error);
    }
  }

  calculateTotalOutstandingAmount(transactions) {
    let totalOutstanding = 0;

    // Loop through the transactions to sum the outstandingAmount
    transactions.forEach((transaction) => {
      totalOutstanding += transaction.outstandingAmount;
    });

    return totalOutstanding;
  }

  requestHistory() {
    const params = { partyNo: this.partyId };
    this.fetchRequestHistory(params);
    this.componentLoaderService.loadComponent('requestHistory');
  }

  showDialogRepaymentRequest() {
    this.svc.dialogSvc
      .show(RequestRepaymentComponent, 'Repayment Request', {
        templates: {
          footer: null,
        },
        data: {
          facilityType: this.facilityType,
          subfacility: this.selectedSubFacility,
        },
        height: '42vw',
        width: '78vw',
        contentStyle: { overflow: 'auto' },
        styleClass: 'dialogue-scroll',
        position: 'center',
      })
      .onClose.subscribe((data: any) => {});
  }

  showDialogDrawdownRequest() {
    this.svc.dialogSvc
      .show(DrawdownRequestComponent, 'Drawdown Request', {
        templates: {
          footer: null,
        },
        data: {
          facilityType: this.facilityType,
          subfacility: this.selectedSubFacility,
        },
        width: '78vw',
      })
      .onClose.subscribe((data: any) => {});
  }

  onPrint() {
    print();
  }

  export() {
    const tableId = this.tableId;
    if (!tableId) {
      console.error('Table ID is missing');
      return;
    }

    const workbookData = [];

    if (
      tableId === 'InterestPaymentForecast' &&
      this.InterestPaymentForecast?.dt1
    ) {
      const dt1 = this.InterestPaymentForecast.dt1;
      const dataListWithoutMonth = dt1.dataList.map(
        ({ month, ...rest }) => rest
      );
      workbookData.push(
        buildSheetData({
          sheetName: 'Interest Payment Forecast',
          columns: dt1.columns || [],
          dataList: dataListWithoutMonth || [],
          translateService: this.translateService,
          excludedFields: ['Action', 'month'],
        })
      );
    }

    if (tableId === 'PaymentForcast' && this.PaymentForcast) {
      const dataListWithoutMonth =
        this.PaymentForcast.paymentForcastDataList?.paymentForecasts.map(
          ({ month, ...rest }) => rest
        );
      workbookData.push(
        buildSheetData({
          sheetName: 'Payment Forecast',
          columns: this.PaymentForcast.paymentForecastColumnDefs || [],
          dataList: dataListWithoutMonth || [],
          translateService: this.translateService,
          excludedFields: ['Action', 'month'],
        })
      );
    }

    if (tableId === 'TransactionFlow') {
      if (this.TransactionFlow?.dt1) {
        const dt1 = this.TransactionFlow.dt1;
        workbookData.push(
          buildSheetData({
            sheetName: this.currentComponent,
            columns: dt1.columns || [],
            dataList: dt1.dataList || [],
            translateService: this.translateService,
            excludedFields: ['Action'],
          })
        );
      }

      if (this.TransactionFlow?.dt2) {
        const dt2 = this.TransactionFlow.dt2;

        const dataListWithoutMonth =
          dt2.dataList?.map(({ month, ...rest }) => rest) || [];

        workbookData.push(
          buildSheetData({
            sheetName: 'Transaction Flow - dt2',
            columns: dt2.columns || [],
            dataList: dataListWithoutMonth,
            translateService: this.translateService,
            excludedFields: ['Action', 'month'],
          })
        );
      }
    }

    if (workbookData.length === 0) {
      console.error('No valid sheets to export');
      return;
    }

    this.printSer.export('xlsx', tableId, workbookData);
  }
}
