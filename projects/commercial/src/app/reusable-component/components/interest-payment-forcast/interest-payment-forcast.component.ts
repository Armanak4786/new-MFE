import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CurrencyService, GenTableComponent } from 'auro-ui';
import { FacilityAssetsService } from '../../../assetlink/services/facility-assets.service';

@Component({
  selector: 'app-interest-payment-forcast',
  templateUrl: './interest-payment-forcast.component.html',
  styleUrl: './interest-payment-forcast.component.scss',
})
export class InterestPaymentForcastComponent implements OnInit {
  @Input() InterestPaymentcolumnDefs;
  @Input() IntersetPaymentdataList;
  @ViewChild('dt1')
  dt1: GenTableComponent;
  // tableId: string = 'interestPaymentForcast';
  constructor(
    public facilityAssetsService: FacilityAssetsService,
    private currencyService: CurrencyService
  ) {
    // this.customEvent.emit('This is a custom event!');
  }

  ngOnInit(): void {
    //this.currencyService.initializeCurrency();
  }
}
