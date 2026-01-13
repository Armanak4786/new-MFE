import { Component } from '@angular/core';
import { BaseBusinessClass } from '../../base-business.class';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'auro-ui';
import { BusinessService } from '../../services/business';

@Component({
  selector: 'app-business-financial',
  templateUrl: './business-financial.component.html',
  styleUrl: './business-financial.component.scss',
})
export class BusinessFinancialComponent extends BaseBusinessClass {

  formData: any;
  isSharedFinancialPosition: boolean = true;
  showSSOP: boolean = true;

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: BusinessService,
  ) {
    super(route, svc, baseSvc);
  }

  override async ngOnInit(): Promise<void> {
      await super.ngOnInit();
      this.baseSvc
        .getBaseDealerFormData()
        .subscribe((res) => {
          this.formData = res;
          
          if (this.formData?.isSharedFinancialPosition !== undefined) {
            this.isSharedFinancialPosition = this.formData.isSharedFinancialPosition;
          }
        });

        //console.log(this.formData)
      let sessionStorageCustomerSummary = JSON.parse(sessionStorage?.getItem("updatedCustomerSummary"))
      if(sessionStorageCustomerSummary){
      const updateSSOPVisibility = sessionStorageCustomerSummary?.find(
      c => c.customerRole == 1 && c.customerType == "Business"
      )
      if(updateSSOPVisibility?.isPartnership){
        this.showSSOP = false
        this.isSharedFinancialPosition = false
        this.baseSvc.setBaseDealerFormData({
          isSharedFinancialPosition : this.isSharedFinancialPosition
        })
      }
      else{
        this.showSSOP = true
      }
    }
    }
  
    onSharedToggle() {
      // You can add any additional logic here when the switch is toggled
      //console.log('Income shared status changed to:', this.isSharedFinancialPosition);
      this.baseSvc.setBaseDealerFormData({
        isSharedFinancialPosition : this.isSharedFinancialPosition
      })
      //console.log("Business Is shared BaseForm:",this.baseFormData.isSharedFinancialPosition)
    }
  
    shouldShowFinancialPosition(): boolean {
      // Show financial position if:
      // 1. Role is not 2 i.e Co-Borrower, OR
      // 2. Role is 2 and income is NOT shared
      if(this.showSSOP){
      return this.formData?.role !== 2 || !this.isSharedFinancialPosition;
      }
       else{
      return true
      }
    }
}
