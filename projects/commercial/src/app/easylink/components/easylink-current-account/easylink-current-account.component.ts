import { Component, Input, ViewChild } from '@angular/core';
import { CommonService, PrintService } from 'auro-ui';
import { PaymentForcastComponent } from '../../../reusable-component/components/payment-forcast/payment-forcast.component';
import { InterestPaymentForcastComponent } from '../../../reusable-component/components/interest-payment-forcast/interest-payment-forcast.component';
import { TransactionFlowComponent } from '../../../reusable-component/components/transaction-flow/transaction-flow.component';
import { EasylinkComponentLoaderService } from '../../services/easylink-component-loader.service';
import { RequestRepaymentComponent } from '../../../reusable-component/components/request-repayment/request-repayment.component';
import {
  calculatePaymentNotYetAllocated,
  filterByFacilityType,
  getCurrentAccountLoans,
  print,
  transformHistoryData,
} from '../../../utils/common-utils';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CommonApiService } from '../../../services/common-api.service';
import {
  loansPaymentColumnDefs,
  loanTransactionsColumnDef,
} from '../../../utils/common-header-definition';
import {
  easylinkInterestOnlyPaymentForecastColumnDefs,
  easylinkPaymentForecastColumnDefs,
  requestHistoryColumnDefs,
} from '../../utils/easylink-header-util';
import { isEqual } from 'lodash';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { DrawdownRequestComponent } from '../../../reusable-component/components/drawdown-request/drawdown-request.component';
import { FacilityType } from '../../../utils/common-enum';
import { RequestHistoryParams } from '../../../utils/common-interface';
import { DashboardSetterGetterService } from '../../../dashboard/services/dashboard-setter-getter.service';
@Component({
  selector: 'app-easylink-current-account',
  templateUrl: './easylink-current-account.component.html',
  styleUrls: ['./easylink-current-account.component.scss'],
})
export class EasylinkCurrentAccountComponent {
  currentComponent: string | null = null;
  tableId: string;
  @ViewChild('paymentForcast') paymentForcast: PaymentForcastComponent;
  @Input() facilityType;
  @Input() selectedSubFacility;
  @ViewChild('InterestPaymentForecast')
  InterestPaymentForecast: InterestPaymentForcastComponent;
  @ViewChild('TransactionFlow') TransactionFlow: TransactionFlowComponent;
  interestPaymentForecast: InterestPaymentForcastComponent;
  toDate: any = new Date();
  fromDate: string;
  frequency: string;
  partyId;
  date: String;
  paymentForcastDataList;
  easylinkPaymentForecastColumnDefs = easylinkPaymentForecastColumnDefs;
  paymentColumnDefs = loansPaymentColumnDefs;
  paymentDataList;
  sumOfPrincipal;
  transactionsDataList;
  transactionsColumnDef = loanTransactionsColumnDef;
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
    private componentLoaderService: EasylinkComponentLoaderService,
    public printSer: PrintService,
    private commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public dashboardSetterGetterSvc: DashboardSetterGetterService
  ) {}

  // ngOnInit() {
  //   this.tableId = 'paymentForcast';
  //   this.commonSetterGetterSvc.roleBasedActionsData.subscribe((data) => {
  //     const roleData = data?.functions ?? [];
  //     this.accessGranted = roleData.map((fn) => fn.functionName.trim());
  //   });
  //   this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
  //     this.partyId = currentParty?.id;
  //   });
  //   this.currentComponent = 'paymentForcast';
  //   this.componentLoaderService.component$.subscribe((componentName) => {
  //     this.currentComponent = componentName;
  //   });
  //   this.paramChangeSubject
  //     .pipe(
  //       debounceTime(300),
  //       distinctUntilChanged((prev, curr) => isEqual(prev, curr))
  //     )
  //     .subscribe((eventData) => {
  //       const updatedParams = {
  //         ...eventData,
  //         partyId: this.partyId,
  //         subFacilityId: this.selectedSubFacility?.id,
  //       };
  //       this.fetchPaymentForecast(updatedParams);
  //     });
  // }

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
    const party = partyData ? JSON.parse(partyData) : null;
    this.partyId = party?.id;

    const stored = sessionStorage.getItem('selectedAssetlinkSubFacility');
    this.selectedSubFacility = stored ? JSON.parse(stored) : null;

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

    if (this.currentAccountContract?.length) {
      const transactionFlowParams = {
        partyId: this.partyId,
        contractId: this.currentAccountContract[0],
      };

      this.fetchPaymentsTab(transactionFlowParams);
      this.fetchTransactionsTab(transactionFlowParams);
    }
  }

  hasAccess(key) {
    if (!this.accessGranted || !Array.isArray(this.accessGranted)) {
      return true;
    }
    return !this.accessGranted?.includes(key);
  }

  onParamsChange(eventData) {
    this.paramChangeSubject.next(eventData);
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
        this.easylinkPaymentForecastColumnDefs =
          easylinkPaymentForecastColumnDefs;
      } else {
        this.easylinkPaymentForecastColumnDefs =
          easylinkInterestOnlyPaymentForecastColumnDefs;
      }
    } catch (error) {
      console.log('Error while loading payment forcast data', error);
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

  showInterestAndForecast() {
    this.componentLoaderService.loadComponent('InterestPaymentForecast');
    this.tableId = 'InterestPaymentForecast';
  }

  showPaymentForcast() {
    this.componentLoaderService.loadComponent('paymentForcast');
    this.tableId = 'paymentForcast';
  }

  showTransactionFlow() {
    // this.dashboardSetterGetterSvc.financialList$.subscribe((list) => {
    //   const facilityMap = {
    //     [FacilityType.Assetlink]: list?.assetLinkDetails ?? [],
    //     [FacilityType.Easylink]: list?.easyLinkDetails ?? [],
    //     [FacilityType.CreditLines]: list?.creditlineDetails ?? [],
    //     default: list?.nonFacilityLoansDetails ?? [],
    //   };

    //   const details = facilityMap[this.facilityType] || facilityMap.default;
    //   this.currentAccountContract = getCurrentAccountLoans(details);
    // });
    // const transactionFlowParams = {
    //   partyId: this.partyId,
    //   contractId: this.currentAccountContract[0],
    // };
    // this.fetchPaymentsTab(transactionFlowParams);
    // this.fetchTransactionsTab(transactionFlowParams);
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

  async fetchRequestHistory(params: RequestHistoryParams) {
    try {
      const data = await this.commonApiService.getRequestHistoryList(params);
      if (data) {
        this.originalRequestHistoryDatalist = filterByFacilityType(
          data,
          FacilityType.Easylink
        );
        this.requestHistoryDataList = transformHistoryData(
          this.originalRequestHistoryDatalist
        );
      }
    } catch (error) {
      console.log('Error while loading account forcast data', error);
    }
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
          // loansDataList: this.loansDataList,
        },
        width: '78vw',
      })
      .onClose.subscribe((data: any) => {});
  }

  onPrint() {
    print();
  }

  export() {
    let dt: any;
    let columns = [];
    let data = [];
    const tableId = this.tableId;
    if (this.tableId == 'paymentForcast') {
      dt = this.paymentForcast;
      columns = dt.paymentForecastColumnDefs || [];
      data = dt.paymentForcastDataList?.paymentForecasts || [];
    }
    if (this.tableId == 'TransactionFlow') {
      if (this.TransactionFlow.dt1) {
        dt = this.TransactionFlow.dt1;
        columns = dt.columns || [];
        data = dt.dataList || [];
      }
      if (this.TransactionFlow.dt2) {
        dt = this.TransactionFlow.dt2;
        columns = dt.columns || [];
        data = dt.dataList || [];
      }
    }

    if (!tableId || !dt) {
      console.error('Table ID or data is missing');
      return;
    }

    if (columns) {
      columns = columns.filter((column) => column.headerName !== 'Action');
    }
    this.printSer.export('xlsx', tableId, columns, data);
  }
}
