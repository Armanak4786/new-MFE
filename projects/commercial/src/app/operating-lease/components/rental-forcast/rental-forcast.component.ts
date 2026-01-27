import { Component, Input } from '@angular/core';
import { CommonService } from 'auro-ui';
import { paymentForecastColumnDefs } from '../../utils/operatingLease-header-definition';
import {
  calculateForecastForOneMonth,
  calculateForecastRangeForYear,
  formatDate,
  formatToQuarter,
  transformDateToDayMonth,
  updateColumnHeaders,
} from '../../../utils/common-utils';
import { CommonApiService } from '../../../services/common-api.service';
import { frequencyOptionData } from '../../../dashboard/utils/dashboard-header.util';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { FacilityType } from '../../../utils/common-enum';
import { PaymentForcastParams } from '../../../utils/common-interface';

@Component({
  selector: 'app-rental-forcast',
  templateUrl: './rental-forcast.component.html',
  styleUrl: './rental-forcast.component.scss',
})
export class RentalForcastComponent {
  @Input() facilityType;
  paymentForcastColumnDefs = paymentForecastColumnDefs;
  paymentForcastDataList;
  frequencyOptionData = frequencyOptionData;
  frequency: string = 'm';
  toDate;
  fromDate: any;
  date: string;
  partyId: number;
  disableDate: boolean;
  payloadDates: { toDate: any; fromDate: any };
  currentDate: string;
  maxDate: string;

  constructor(
    public svc: CommonService,
    private commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService
  ) {}

  ngOnInit() {
    this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
      this.partyId = currentParty?.id;
      if (this.partyId) {
        const dates = calculateForecastRangeForYear(new Date());
        this.toDate = dates.forecastEnd;
        this.fromDate = dates.today;
        this.payloadDates = {
          toDate: dates.forecastEnd,
          fromDate: dates.today,
        };
        this.currentDate = dates.today;
        this.loadPaymentForecastData();
      }
    });
  }

  async loadPaymentForecastData() {
    const params = {
      partyId: this.partyId,
      ...this.payloadDates,
      frequency: this.frequency,
      facilityTypeCFname: FacilityType.OperatingLease_Group,
      facilityType: FacilityType.FacilityType,
    };

    try {
      const response = await this.fetchPaymentForecast(params);

      if (!response) return;

      this.paymentForcastColumnDefs = updateColumnHeaders(
        this.frequency,
        this.paymentForcastColumnDefs
      );
      if (this.frequency === 'q') {
        this.paymentForcastDataList = formatToQuarter(response);
      } else if (this.frequency === 'd') {
        this.paymentForcastDataList = transformDateToDayMonth(response);
      } else {
        this.paymentForcastDataList = response;
      }
    } catch (error) {
      console.error('Error fetching rental forecast:', error);
    }
  }

  async fetchPaymentForecast(params: PaymentForcastParams) {
    try {
      return await this.commonApiService.getRentalForcastData(params);
    } catch (error) {
      return null;
    }
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

  async onFromDateChange(event: any) {
    const selectedDate = event?.value || event?.target?.value;
    if (!selectedDate) return;
    const dateObj =
      selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
    const formattedDate = formatDate(dateObj);
    this.fromDate = formattedDate;
    this.payloadDates.fromDate = formattedDate;
    const dates = calculateForecastRangeForYear(formattedDate);
    this.maxDate = dates.forecastEnd;
    await this.loadPaymentForecastData();
  }

  async onToDateChange(event: any) {
    const selectedDate = event?.value || event?.target?.value;
    if (!selectedDate) return;

    const dateObj =
      selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
    const formattedDate = formatDate(dateObj);
    this.toDate = formattedDate;
    this.payloadDates.toDate = formattedDate;
    await this.loadPaymentForecastData();
  }
}
