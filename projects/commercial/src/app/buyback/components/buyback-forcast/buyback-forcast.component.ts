import { Component, Input, ViewChild } from '@angular/core';
import { CommonService, CurrencyService, GenTableComponent } from 'auro-ui';
import { formatDate, getOneMonthPrior } from '../../../utils/common-utils';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import {
  buybackAccountForecastColumnDefs,
  buybackPaymentForecastColumnDefs,
} from '../../utils/buyback-header.utils';
import { CommonApiService } from '../../../services/common-api.service';
import {
  AccountForecastParams,
  PaymentForcastParams,
} from '../../../utils/common-interface';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';

@Component({
  selector: 'app-buyback-forcast',
  //standalone: true,
  //imports: [],
  templateUrl: './buyback-forcast.component.html',
  styleUrls: ['./buyback-forcast.component.scss'],
})
export class BuybackForcastComponent {
  @Input() facilityType: string;
  paymentForcastColumnDefs = buybackPaymentForecastColumnDefs;
  accountForcastColumnDefs = buybackAccountForecastColumnDefs;
  paymentForcastDataList;
  accountForcastDataList;
  @ViewChild('dt1')
  dt1: GenTableComponent;
  @ViewChild('dt1')
  dt2: GenTableComponent;
  optionData = [
    { label: 'Monthly', value: 'monthly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Yearly', value: 'yearly' },
  ];
  frequency: string = 'monthly';
  toDate: any = new Date();
  date: string;
  fromDate: string;
  partyId: number;

  constructor(
    public svc: CommonService,
    public currencyService: CurrencyService,
    private dashSvc: DashboardService,
    private commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService
  ) {}

  ngOnInit() {
    this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
      this.partyId = currentParty?.id;
    });
    //this.partyId = JSON.parse(sessionStorage.getItem('currentParty'));
    this.currencyService.initializeCurrency();
    this.getFromDate();
    this.date = formatDate(this.toDate);
    const paymentParams = {
      partyId: this.partyId,
      facilityType: this.facilityType,
      fromDate: this.fromDate,
      toDate: this.date,
      frequency: this.frequency,
    };
    this.fetchPaymentForecast(paymentParams);
    const params = { partyId: this.partyId, facilityType: this.facilityType };
    this.fetchAccountForecast(params);
  }

  getFromDate() {
    const oneMonthPriorDate = getOneMonthPrior(this.toDate);
    // Format the dates
    this.fromDate = formatDate(oneMonthPriorDate);
  }

  // Function to get the date one month prior

  async fetchPaymentForecast(params: PaymentForcastParams) {
    try {
      this.paymentForcastDataList =
        await this.commonApiService.getPaymentForcastData(params);
    } catch (error) {
      console.log('Error while loading payment forcast data', error);
    }
  }

  async fetchAccountForecast(params: AccountForecastParams) {
    try {
      this.accountForcastDataList =
        await this.commonApiService.getAccountForcastData(params);
    } catch (error) {
      console.log('Error while loading account forcast data', error);
    }
  }

  onFrequencyChange(event) {
    //this.frequencyEmitter.emit(JSON.stringify(this.frequency));
    this.frequency = event.value;
  }

  onFromDateChange(event) {
    //this.fromDateEmitter.emit(this.fromDate);
  }

  onToDateChange(event) {
    //this.toDateEmitter.emit(this.toDate);
  }
}
