import { Component } from '@angular/core';
import { BaseSoleTradeClass } from '../../../base-sole-trade.class';
import { ActivatedRoute } from '@angular/router';
import { CommonService, GenericFormConfig, Mode } from 'auro-ui';
import { SoleTradeService } from '../../../services/sole-trade.service';

@Component({
  selector: 'app-total-payment-amount',
  templateUrl: './total-payment-amount.component.html',
  styleUrl: './total-payment-amount.component.scss',
})
export class TotalPaymentAmountComponent extends BaseSoleTradeClass {
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: SoleTradeService
  ) {
    super(route, svc, baseSvc);
  }
  override formConfig: GenericFormConfig = {
    headerTitle: '',
    autoResponsive: true,
    api: '',
    goBackRoute: '',
    cardBgColor: '--background-color-secondary',
    cardType: 'non-border',
    fields: [
      {
        type: 'label-only',
        typeOfLabel: 'inline',
        label: 'Total Monthly Payment',
        name: 'totalPaymentAmountLabel',
        cols: 8,
        className: ' font-bold	',
      },
      {
        type: 'amount',
        // typeOfLabel: 'inline',
        // label: '2300',
        name: 'totalPaymentAmount',
        cols: 3,
        className: 'font-bold',
        mode: Mode.view,

      },
    ],
  };

  override async ngOnInit(): Promise<void> {
    //console.log("Total Payment",this.baseFormData)
    this.baseSvc.totalPaymentAmount.subscribe((value) => {
      if (this.mainForm) {
        this.mainForm.get('totalPaymentAmount')?.setValue(value || 0);
      }
    });
    // await super.ngOnInit();
  }
  
  // override onFormDataUpdate(res: any): void {
    
  //   if(this.baseFormData?.totalPaymentAmount){
  //     this.mainForm.get('totalPaymentAmount')?.setValue(this.baseFormData?.totalPaymentAmount || 0);
  //   }
  //   // super.onFormDataUpdate(res);
  // }
  


  override onFormReady(): void {
  //console.log("Total Payment",this.baseFormData)
  super.onFormReady();
  }
}
