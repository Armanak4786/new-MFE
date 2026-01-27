import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonService, CurrencyService } from 'auro-ui';
import {
  calculateForecastForOneMonth,
  calculateForecastRangeForYear,
  formatDate,
  getOneMonthPrior,
  isValidDateFormat,
  updateColumnHeaders,
} from '../../../utils/common-utils';
import { frequencyOptionData } from '../../../dashboard/utils/dashboard-header.util';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';

@Component({
  selector: 'app-payment-forcast',
  templateUrl: './payment-forcast.component.html',
  styleUrl: './payment-forcast.component.scss',
})
export class PaymentForcastComponent {
  @Input() paymentForcastDataList;
  @Input() paymentForecastColumnDefs;
  frequencyOptionData = frequencyOptionData;
  toDate: any = new Date();
  fromDate: string;
  date: string;
  currentComponent: string | null = null;
  partyId: number;
  frequency: string = 'm';
  showFilterOptions;
  private firstEmissionDone = false;
  @Input() selectedSubFacility;
  @Input() disableDate;
  @Output() paramsEmit = new EventEmitter<any>();
  previousFromDate: string;
  previousToDate: string;
  currentDate: string;
  maxDate: string;
  payloadDates: { toDate: string; fromDate: string };

  constructor(
    public svc: CommonService,
    public currencyService: CurrencyService,
    public commonSetterGetterSvc: CommonSetterGetterService
  ) {}

  ngOnInit() {
    const sessionData = sessionStorage.getItem('currentParty');
    const savedParty = sessionData ? JSON.parse(sessionData) : null;
    this.partyId = savedParty?.id || null;
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
      this.frequency = 'm';
    }
    this.emitParams();
  }

  public emitParams() {
    this.paramsEmit.emit({
      fromDate: this.fromDate,
      toDate: this.toDate,
      repaymentFrequency: this.frequency,
    });
  }

  getFromDate() {
    const oneMonthPriorDate = getOneMonthPrior(this.toDate);
    // Format the dates
    this.fromDate = formatDate(oneMonthPriorDate);
  }

  onFromDateChange(event) {
    if (!isValidDateFormat(event)) {
      return; // Don't emit if the date format is invalid
    }
    const dates = calculateForecastRangeForYear(event);
    this.maxDate = dates.forecastEnd;
    this.fromDate = event;
    this.emitParams();
  }

  onToDateChange(event) {
    if (!isValidDateFormat(event)) {
      return; // Don't emit if the date format is invalid
    }
    this.toDate = event;
    this.date = event;
    this.emitParams();
  }
  onFrequencyChange(event) {
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
      this.currentDate = dates.today;
      this.payloadDates = {
        toDate: dates.forecastEnd,
        fromDate: dates.today,
      };
    }

    this.paymentForecastColumnDefs = updateColumnHeaders(
      value,
      this.paymentForecastColumnDefs
    );
    this.emitParams();
  }
}
