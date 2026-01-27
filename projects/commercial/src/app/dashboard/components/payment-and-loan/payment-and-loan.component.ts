import { Component, Input } from '@angular/core';
import {
  calculateForecastForOneMonth,
  calculateForecastRangeForYear,
  formatToQuarter,
  isValidDateFormat,
  transformDateToDayMonth,
  updateColumnHeaders,
} from '../../../utils/common-utils';
import { CommonApiService } from '../../../services/common-api.service';
import {
  frequencyOptionData,
  paymentForcastColumnDefs,
} from '../../utils/dashboard-header.util';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment-and-loan',
  templateUrl: './payment-and-loan.component.html',
  styleUrl: './payment-and-loan.component.scss',
})
export class PaymentAndLoanComponent {
  @Input() total;
  toDate: any = new Date();
  fromDate: string;
  frequency: string = 'm';
  disableDate: boolean = false;
  paymentForcastDataList;
  currentDate: string;
  payloadDates = { toDate: '', fromDate: '' };
  frequencyOptionData = frequencyOptionData;
  maxDate = '';

  paymentForcastColumnDefs = paymentForcastColumnDefs;
  partyId: number;
  repayment: any;
  private partySubscription: Subscription;

  constructor(
    private commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService
  ) {}

  ngOnInit() {
    // Subscribe ONCE to party$
    this.partySubscription = this.commonSetterGetterSvc.party$.subscribe(
      (currentParty) => {
        this.partyId = currentParty?.id;
        if (this.partyId) {
          // const dates = calculateForecastRangeForYear(new Date());
          // this.toDate = dates.forecastEnd;
          // this.maxDate = dates.forecastEnd;
          // this.fromDate = dates.today;
          // this.payloadDates = {
          //   toDate: dates.forecastEnd,
          //   fromDate: dates.today,
          // };
          // this.currentDate = dates.today;
          const savedFromDate = sessionStorage.getItem('forecastFromDate');
          const savedToDate = sessionStorage.getItem('forecastToDate');
          const savedFreq = sessionStorage.getItem('forecastFrequency');
          if (savedFromDate && savedToDate) {
            this.fromDate = savedFromDate;
            this.toDate = savedToDate;
            this.frequency = savedFreq || 'm';
          } else {
            const dates = calculateForecastRangeForYear(new Date());
            this.fromDate = dates.today;
            this.toDate = dates.forecastEnd;
            this.maxDate = dates.forecastEnd;
            this.payloadDates = {
              toDate: dates.forecastEnd,
              fromDate: dates.today,
            };
            this.currentDate = dates.today;
            this.frequency = 'm';
          }
          // Load initial forecast
          this.loadPaymentForecastData();
        }
      }
    );
  }

  ngOnChanges(changes) {
    if (changes['total'] && !changes['total'].firstChange) {
      // React to total changes
      if (this.partyId) {
        this.loadPaymentForecastData();
      }
    }
  }
  async onToDateChange(event) {
    if (!isValidDateFormat(event)) return;
    this.toDate = event;
    this.payloadDates.toDate = event;
    await this.loadPaymentForecastData();
  }

  async onFromDateChange(event) {
    if (!isValidDateFormat(event)) return;
    const dates = calculateForecastRangeForYear(event);
    this.fromDate = dates.today;
    this.maxDate = dates.forecastEnd;
    this.payloadDates.fromDate = event;
    await this.loadPaymentForecastData();
  }

  async onFrequencyChange(event) {
    const { value } = event;
    if (!value) return;

    this.frequency = value;
    this.disableDate = value === 'd';
    if (this.disableDate) {
      const dates = calculateForecastForOneMonth(new Date());
      this.toDate = dates.lastDayOfMonth;
      this.fromDate = dates.firstDayOfMonth;
      this.payloadDates = {
        toDate: dates.lastDayOfMonth,
        fromDate: dates.firstDayOfMonth,
      };
    } else {
      const dates = calculateForecastRangeForYear(new Date());
      this.toDate = dates.forecastEnd;
      this.fromDate = dates.today;
      this.payloadDates = {
        toDate: dates.forecastEnd,
        fromDate: dates.today,
      };
    }
    await this.loadPaymentForecastData();
  }
  async loadPaymentForecastData() {
    const params = {
      partyId: this.partyId,
      ...this.payloadDates,
      repaymentFrequency: this.frequency,
    };

    try {
      const response = await this.fetchPaymentForecast(params);

      if (!response || !response.paymentForecasts) {
        // Assign an empty array if response is null or invalid
        this.paymentForcastDataList = [];
        return;
      }

      this.paymentForcastColumnDefs = updateColumnHeaders(
        this.frequency,
        this.paymentForcastColumnDefs
      );

      if (this.frequency === 'q') {
        this.paymentForcastDataList = formatToQuarter(
          response.paymentForecasts
        );
      } else if (this.frequency === 'd') {
        this.paymentForcastDataList = transformDateToDayMonth(
          response.paymentForecasts
        );
      } else {
        this.paymentForcastDataList = response.paymentForecasts;
      }
    } catch (error) {
      console.error('Error fetching forecast:', error);
    }
  }

  async fetchPaymentForecast(params) {
    try {
      return await this.commonApiService.getPaymentForcastData(params);
    } catch (error) {
      console.log('Error while loading payment forecast data', error);
      return null;
    }
  }

  ngOnDestroy() {
    if (this.partySubscription) {
      this.partySubscription.unsubscribe();
    }
  }
}
