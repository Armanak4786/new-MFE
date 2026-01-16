import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonService, CurrencyService } from 'auro-ui';
import { GenTableComponent } from 'auro-ui';
import { CreditlineDashboardService } from '../../../creditlines/services/creditline-dashboard.service';
import {
  calculateForecastForOneMonth,
  calculateForecastRangeForYear,
  formatToQuarter,
  isValidDateFormat,
  transformDateToDayMonth,
  updateColumnHeaders,
} from '../../../utils/common-utils';
import { facilityFrequencyOptions } from '../../../dashboard/utils/dashboard-header.util';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';

@Component({
  selector: 'app-payment-summary-account-forcast',
  templateUrl: './payment-summary-account-forcast.component.html',
  styleUrls: ['./payment-summary-account-forcast.component.scss'],
})
export class PaymentSummaryAccountForcastComponent {
  @Input() accountForcastColumnDefs;
  @Input() paymentForcastColumnDefs;
  @Input() accountForcastDataList;
  @Input() paymentForcastDataList;
  @Input() disableDate;
  @Input() principalForcastDataList;
  @Output() paramsEmit = new EventEmitter<any>();

  toDate: any = new Date();
  date: string;
  fromDate: string;
  totalPrincipal: number;
  totalPayment: number;
  totalInterest: number;
  frequency: string = 'm';
  frequencyOptionData = facilityFrequencyOptions;
  colors: string[] = ['#FF5733', '#33FF57', '#3357FF'];
  @ViewChild('dt1')
  dt1: GenTableComponent;
  @ViewChild('dt2')
  dt2: GenTableComponent;
  previousFromDate: string;
  previousToDate: string;
  partyId: number;
  payloadDates: { toDate: string; fromDate: string };
  currentDate: string;
  totalAmt = 0;
  maxDate: string;

  constructor(
    public svc: CommonService,
    public fb: FormBuilder,
    public route: ActivatedRoute,
    public credServ: CreditlineDashboardService,
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

    this.totalAmt = this.getTotalAmount();
    this.calculatePrincipalMovement();
    this.calculateInterest();
    this.calculatePayment();
  }

  ngOnChanges(changes) {
    if (changes['paymentForcastDataList']) {
      this.totalAmt = this.getTotalAmount();
      //API not present
      if (this.frequency === 'q') {
        this.paymentForcastDataList.paymentForecasts = formatToQuarter(
          this.paymentForcastDataList.paymentForecasts
        );
      } else if (this.frequency === 'd') {
        this.paymentForcastDataList.paymentForecasts = transformDateToDayMonth(
          this.paymentForcastDataList.paymentForecasts
        );
      } else if (this.frequency === 'm') {
        this.paymentForcastDataList = this.paymentForcastDataList;
      }
    }
  }

  public emitParams() {
    this.paramsEmit.emit({
      partyId: this.partyId,
      fromDate: this.fromDate,
      toDate: this.toDate,
      repaymentFrequency: this.frequency,
    });
  }

  getLabel(): string {
    const formatter = new Intl.DateTimeFormat('en-GB'); // dd/mm/yyyy format
    const from = new Date(this.fromDate);
    const to = new Date(this.toDate);

    const oneMonthPrior = new Date(from.setMonth(from.getMonth() - 1));
    const oneYearPrior = new Date(to.setFullYear(to.getFullYear() - 1));

    return `Last Month (From ${formatter?.format(
      oneMonthPrior
    )} - ${formatter.format(oneYearPrior)})`;
  }

  getTotalAmount() {
    return (
      this.accountForcastDataList?.lastMonthPrincipal +
      this.accountForcastDataList?.lastMonthInterest
    );
  }

  calculatePrincipalMovement() {
    return this.paymentForcastDataList?.paymentForecasts?.reduce(
      (sum, item) => sum + item.principal,
      0
    );
  }

  calculateInterest() {
    return this.paymentForcastDataList?.paymentForecasts?.reduce(
      (total, item) => total + item.interest,
      0
    );
  }

  calculatePayment() {
    return this.paymentForcastDataList?.paymentForecasts?.reduce(
      (total, item) => total + item.amount,
      0
    );
  }

  onFromDateChange(event) {
    if (!isValidDateFormat(event)) {
      return; // Don't emit if the date format is invalid
    }
    sessionStorage.setItem('forecastFromDate', this.fromDate);
    const dates = calculateForecastRangeForYear(event);
    // this.toDate = dates.forecastEnd;
    this.maxDate = dates.forecastEnd;
    this.fromDate = event;
    this.emitParams();
  }

  onToDateChange(event) {
    if (!isValidDateFormat(event)) {
      return; // Don't emit if the date format is invalid
    }
    sessionStorage.setItem('forecastToDate', this.toDate);
    this.toDate = event;
    this.date = event;
    this.emitParams();
  }
  onFrequencyChange(event) {
    const { value } = event;
    if (!value) return;
    this.frequency = value;
    sessionStorage.setItem('forecastFrequency', this.frequency);
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

    this.paymentForcastColumnDefs = updateColumnHeaders(
      value,
      this.paymentForcastColumnDefs
    );
    this.emitParams();
  }
}
