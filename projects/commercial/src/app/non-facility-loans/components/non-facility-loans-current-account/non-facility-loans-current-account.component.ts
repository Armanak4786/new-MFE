import { Component, Input, ViewChild } from '@angular/core';
import { CommonService, PrintService } from 'auro-ui';
import { NonFacilityLoansComponentLoaderService } from '../../services/non-facility-loans-component-loader.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { NonFacilityLoanRequestComponent } from '../non-facility-loan-request/non-facility-loan-request.component';
import {
  calculatePaymentNotYetAllocated,
  filterByFacilityType,
  formatDate,
  print,
  transformHistoryData,
} from '../../../utils/common-utils';
import { PaymentForcastComponent } from '../../../reusable-component/components/payment-forcast/payment-forcast.component';
import { InterestPaymentForcastComponent } from '../../../reusable-component/components/interest-payment-forcast/interest-payment-forcast.component';
import { TransactionFlowComponent } from '../../../reusable-component/components/transaction-flow/transaction-flow.component';
import { CommonApiService } from '../../../services/common-api.service';
import {
  loansPaymentColumnDefs,
  loanTransactionsColumnDef,
} from '../../../utils/common-header-definition';
import { isEqual } from 'lodash';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { RequestRepaymentComponent } from '../../../reusable-component/components/request-repayment/request-repayment.component';
import { RequestHistoryParams } from '../../../utils/common-interface';
import { FacilityType } from '../../../utils/common-enum';
import {
  paymentForecastColumnDefs,
  requestHistoryColumnDefs,
} from '../../utils/non-facility-header-definition';
@Component({
  selector: 'app-non-facility-loans-current-account',
  templateUrl: './non-facility-loans-current-account.component.html',
  styleUrls: ['./non-facility-loans-current-account.component.scss'],
})
export class NonFacilityLoansCurrentAccountComponent {
  @Input() facilityType;
  @Input() selectedSubFacility;
  currentComponent: string | null = null;
  tableId: string = '';
  transactionsDataList;
  paymentForecastColumnDefs = paymentForecastColumnDefs;
  paymentForcastDataList;
  paymentDataList;
  @ViewChild('paymentForcast') paymentForcast: PaymentForcastComponent;
  @ViewChild('InterestPaymentForecast')
  InterestPaymentForecast: InterestPaymentForcastComponent;
  @ViewChild('TransactionFlow') TransactionFlow: TransactionFlowComponent;
  transactionDataList;
  paymentColumnDefs = loansPaymentColumnDefs;
  transactionsColumnDef = loanTransactionsColumnDef;
  paymentNotYetAllocated;
  overDue;
  toDate: string;
  fromDate: string;
  frequency: string;
  private fromDateSubject = new Subject<string>();
  private toDateSubject = new Subject<string>();
  private frequencySubject = new Subject<string>();
  partyId;
  paramChangeSubject = new Subject<any>();
  requestHistoryDataList: any;
  originalRequestHistoryDatalist;
  requestHistoryColumnDefs = requestHistoryColumnDefs;
  accessGranted;

  constructor(
    public svc: CommonService,
    private componentLoaderService: NonFacilityLoansComponentLoaderService,
    public printSer: PrintService,
    private commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService
  ) {}

  // ngOnInit() {
  //   this.tableId = 'paymentForcast';
  //   this.currentComponent = 'paymentForcast';
  //   const roleBased = JSON.parse(sessionStorage.getItem('RoleBasedActions'));
  //   if (
  //     roleBased &&
  //     roleBased.functions &&
  //     typeof roleBased.functions === 'object'
  //   ) {
  //     this.accessGranted = Object.keys(roleBased.functions).map((fn) =>
  //       fn.trim()
  //     );
  //   } else {
  //     this.accessGranted = [];
  //   }
  //   this.componentLoaderService.component$.subscribe((componentName) => {
  //     this.currentComponent = componentName;
  //   });
  //   this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
  //     this.partyId = currentParty?.id;
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
    this.tableId = 'paymentForcast';
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

    const storedSubFacility = sessionStorage.getItem(
      'selectedAssetlinkSubFacility'
    );
    this.selectedSubFacility = storedSubFacility
      ? JSON.parse(storedSubFacility)
      : null;

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

    const transactionFlowParams = {
      partyId: this.partyId,
      subFacilityId: this.selectedSubFacility.id,
    };
    this.fetchPaymentsTab(transactionFlowParams);
    this.fetchTransactionsTab(transactionFlowParams);
  }

  hasAccess(key) {
    if (!this.accessGranted || !Array.isArray(this.accessGranted)) {
      return true;
    }
    return !this.accessGranted?.includes(key);
  }

  async fetchPaymentForecast(params) {
    try {
      this.paymentForcastDataList =
        await this.commonApiService.getPaymentForcastData(params);
    } catch (error) {
      console.log('Error while loading payment forcast data', error);
    }
  }

  onParamsChange(eventData) {
    this.paramChangeSubject.next(eventData);
  }

  callPaymentAPI(eventData) {
    this.fetchPaymentForecast(eventData);
  }

  async showTransactionFlow() {
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

  showPaymentForcast() {
    this.componentLoaderService.loadComponent('paymentForcast');
    this.tableId = 'paymentForcast';
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

  showNonFacilityLoansDrawdownRequestDialog() {
    this.svc.dialogSvc
      .show(NonFacilityLoanRequestComponent, 'Drawdown Request', {
        templates: {
          footer: null,
        },
        data: {
          drawdown: 'drawdownRequest',
          facilityType: this.facilityType,
          subFacility: this.selectedSubFacility,
        },
        width: '78vw',
      })
      .onClose.subscribe((data: any) => {});
  }

  onPrint() {
    print();
  }

  getInitPaymentsData() {
    const paymentParams = {
      partyId: this.partyId,
      facilityType: this.facilityType,
      fromDate: this.fromDate,
      toDate: this.toDate,
      frequency: this.frequency,
    };
    this.fromDateSubject
      .pipe(
        debounceTime(300),
        switchMap(async () => this.fetchPaymentForecast(paymentParams))
      )
      .subscribe();

    this.toDateSubject
      .pipe(
        debounceTime(300),
        switchMap(async () => this.fetchPaymentForecast(paymentParams))
      )
      .subscribe();

    this.frequencySubject
      .pipe(
        debounceTime(300),
        switchMap(async () => this.fetchPaymentForecast(paymentParams))
      )
      .subscribe();
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
          FacilityType.NonFacilityLoan
        );
        this.requestHistoryDataList = transformHistoryData(
          this.originalRequestHistoryDatalist
        );
      }
    } catch (error) {
      console.log('Error while loading account forcast data', error);
    }
  }

  export() {
    let dt: any;
    let columns = [];
    let data = [];
    const tableId = this.tableId;
    if (this.tableId == 'InterestPaymentForecast') {
      dt = this.InterestPaymentForecast;
      columns = dt.dt1.columns || [];
      data = dt.dt1.dataList || [];
    }
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

  onToDateChange(event) {
    this.toDateSubject.next(event);
    this.toDate = formatDate(event);
  }

  onFromDateChange(event) {
    this.fromDateSubject.next(event);
    this.fromDate = event;
  }

  onFrequencyChange(event) {
    this.frequencySubject.next(event);
    this.frequency = event;
  }
}
