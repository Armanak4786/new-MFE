import { Component } from '@angular/core';
import { BaseSoleTradeClass } from '../../base-sole-trade.class';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'auro-ui';
import { IndividualService } from '../../../individual/services/individual.service';
import { SoleTradeService } from '../../services/sole-trade.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-sole-trade-financial',
  templateUrl: './sole-trade-financial.component.html',
  styleUrl: './sole-trade-financial.component.scss',
})
export class SoleTradeFinancialComponent extends BaseSoleTradeClass {

  formData: any;
   IsSharedFinancialPosition: boolean = true;
   showSSOP: boolean = true;

  constructor(
      public override route: ActivatedRoute,
      public override svc: CommonService,
      override baseSvc: SoleTradeService,
      private fb: FormBuilder
    ) {
      super(route, svc, baseSvc);
    }

    override async ngOnInit(): Promise<void> {
        await super.ngOnInit();
        this.baseSvc
          .getBaseDealerFormData()
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            this.formData = res;
    
              if(this.formData?.IsSharedFinancialPosition != undefined){     //this condition is for keeping default value as true for IsSharedFinancialPosition instead of undefined
                this.IsSharedFinancialPosition = this.formData?.IsSharedFinancialPosition;
              }
              
            });
            
          this.onSharedToggle();

          let sessionStorageCustomerSummary = JSON.parse(sessionStorage?.getItem("updatedCustomerSummary"))
          if(sessionStorageCustomerSummary){
          const updateSSOPVisibility = sessionStorageCustomerSummary?.find(
          c => c.customerRole == 1 && c.customerType == "Business"
          )
          if(updateSSOPVisibility?.isPartnership){
            this.showSSOP = false
            this.IsSharedFinancialPosition = false
            this.baseSvc.setBaseDealerFormData({
              IsSharedFinancialPosition : this.IsSharedFinancialPosition
            })
          }
          else{
            this.showSSOP = true
          }
        }
      }
    
      onSharedToggle() {
        // You can add any additional logic here when the switch is toggled
    
        this.baseSvc.setBaseDealerFormData({
          IsSharedFinancialPosition : this.IsSharedFinancialPosition
        })
      }
    
      shouldShowFinancialPosition(): boolean {
        // Show financial position if:
        // 1. Role is not 2 i.e Co-Borrower, OR
        // 2. Role is 2 and income is NOT shared
        if(this.showSSOP){
        return this.formData?.role !== 2 || !this.IsSharedFinancialPosition;
        }
        else{
        return true
        }
    }
      calculateProgressforasset(): any {}
}
