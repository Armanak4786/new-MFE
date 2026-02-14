import { ChangeDetectorRef, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, Mode } from "auro-ui";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { ToasterService, ValidationService } from "auro-ui";
import { DashboardService } from "../../../dashboard/services/dashboard.service";
import configure from "src/assets/configure.json";

@Component({
  selector: "app-other-charges",
  templateUrl: "./other-charges.component.html",
  styleUrls: ["./other-charges.component.scss"],
})
export class OtherChargesComponent extends BaseStandardQuoteClass {
  flag: boolean;
  totalAmountBorrowed: any;
  hideCard: any = false;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef,
    public dashboardSvc: DashboardService
  ) {
    super(route, svc, baseSvc);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    if (this.baseFormData && this.mainForm?.form) {
      // if (this.baseFormData?.data) {
      //   this.mainForm
      //     ?.get("totalAmountBorrowed")
      //     .patchValue(
      //       this.baseFormData?.data?.financialAssetLease?.totalAmountBorrowed ||
      //         0
      //     );
      //   this.mainForm
      //     ?.get("includeGst")
      //     .patchValue(
      //       this.baseFormData?.data?.financialAssets?.[0]?.taxesAmt || 0
      //     );
      //   this.mainForm
      //     ?.get("interestCharges")
      //     .patchValue(
      //       this.baseFormData?.data?.financialAssetLease?.interestCharge || 0
      //     );
      //   this.mainForm
      //     ?.get("loanMaintenceFee")
      //     .patchValue(this.baseFormData?.data?.loanMaintenanceFee || 0);
      // } else {
      //   //   // logic implemented as per format will be changed later
      //   // this.totalAmountBorrowed=this.baseFormData?.totalAmountBorrowed;
      //   this.mainForm
      //     .get("totalAmountBorrowed")
      //     .patchValue(
      //       this.baseFormData?.financialAssetLease?.totalAmountBorrowed || 0
      //     );
      //   this.mainForm
      //     .get("includeGst")
      //     .patchValue(this.baseFormData?.financialAssets?.[0]?.taxesAmt || 0);
      //   this.mainForm
      //     .get("interestCharges")
      //     .patchValue(
      //       this.baseFormData?.financialAssetLease?.interestCharges || 0
      //     );
      //   this.mainForm
      //     .get("loanMaintenceFee")
      //     .patchValue(this.baseFormData?.loanMaintenanceFee || 0);
      // }
    }
    
  
    // if (this.baseFormData?.productId != res?.productId) {
    if (
      this.baseFormData.productCode == "FL" ||
      this.baseFormData.productCode == "OL"
    ) {
      this.hideCard = true;
      this.mainForm?.updateHidden({ loanMaintenceFee: true });
      this.mainForm?.updateHidden({ fixedCheckbox: true });
    } 
    // }

    await this.updateValidation("onInit");
  }
  // override title: string = 'Quote Details';
  override formConfig: GenericFormConfig = {
    autoResponsive: true,
    api: "otherCharges",
    goBackRoute: "otherCharges",
    cardBgColor: "--primary-light-color",
    fields: [
      {
        type: "amount",
        mode: Mode.label,
        label: "Total Amount Borrowed",
        name: "totalAmountBorrowed",
        className: "mt-1",
        cols: 12,
        inputType: "horizontal",
        labelClass: "col-6 pl-0",
        styleType: "labelType",
        inputClass: " font-bold col-3 py-0",
        disabled: true,
      },
      { 
        type: "amount",
        mode: Mode.label,
        label: "Incl. GST of",
        name: "includeGst",
        className: "mt-1",
        cols: 12,
        inputType: "horizontal",
        labelClass: "col-6",
        styleType: "labelType",
        inputClass: " col-3 py-0",
        disabled: true,
        hidden: true,
      },
      {
        type: "amount",
        mode: Mode.label,
        label: "Interest Charge",
        name: "interestCharges",
        className: "mt-0 pt-1",
        cols: 12,
        styleType: "labelType",
        inputType: "horizontal",
        labelClass: "col-6 pl-0",
        inputClass: "  col-3  py-0",
        disabled: true,
      },

      {
        type: "amount",
        mode: Mode.label,
        label: "Loan Maintenance Fee",
        name: "loanMaintenceFee",
        className: "mt-0 pt-1 pb-0",
        cols: 9,
        inputType: "horizontal",
        labelClass: "mr-0 col-6 pl-0",
        inputClass: " text-right ml-0 py-0 col-6",
        disabled: true,
        styleType: "labelType",
        hidden: true,
      },
      {
        type: "checkbox",
        label: "Waive LMF",
        
        name: "fixedCheckbox",
        cols: 3,
        nextLine: false,
        className: "    pl-2 right-100 text-right",
        hidden: true,
      },
    ],
  };

  handleUpdateAmount(amount: any) {}
  override onFormEvent(event: any): void {
    if (event.name == "fixedCheckbox") {
      if (event.value) {
        this.mainForm.get("loanMaintenceFee").patchValue(0);
        this.baseFormData.loanMaintenanceFee = 0;
        this.baseFormData.weiveLMF="1";
      } else {
        this.mainForm.get("loanMaintenceFee").patchValue(this.baseFormData?.apiLoanMaintenceFee);
        this.baseFormData.loanMaintenanceFee = this.baseFormData?.apiLoanMaintenceFee;
         this.baseFormData.weiveLMF="0";
      }
    }
    super.onFormEvent(event);
  }

  override updateData(postData: any): void {}
  override onFormDataUpdate(res: any): void {
    // super.onFormDataUpdate(res);
  }

  pageCode: string = "StandardQuoteComponent";
  modelName: string = "OtherChargesComponent";

  override async onFormReady(): Promise<void> {

      const productCode = sessionStorage.getItem('productCode');

      if(productCode == "FL") {
        this.mainForm.updateProps("totalAmountBorrowed", { inputClass: " font-bold col-3 py-0 pr-5" });
        this.mainForm.updateProps("includeGst", {inputClass: "col-3 py-0 pr-5"})
        this.mainForm.updateProps("interestCharges", {inputClass: "col-3 py-0 pr-5"})
      }

      if(productCode == "FL" || productCode == "OL") {
        this.mainForm.updateProps( "totalAmountBorrowed", { label: "Total Cash Cost" } );
        this.mainForm.updateHidden({ includeGst: false });
    
      }

      this.baseSvc.onLoanPurposeChange.subscribe((loanPurpose) => {
        let showLmf = this.dashboardSvc?.introducers?.find(item => 
         item.originatorNo == this.baseFormData?.originatorNumber
      )  
      
      if( (loanPurpose == configure?.LoanPurpose || this.baseFormData?.loanPurpose == configure?.LoanPurpose) && productCode !== "OL") {
        this.mainForm.updateHidden({ loanMaintenceFee: false });
        if(showLmf?.waive == 1) {
        this.mainForm.updateHidden({ fixedCheckbox: false });
        if(this.baseFormData.weiveLMF=="1")
        {
         this.mainForm.get('fixedCheckbox')?.setValue(true);
        }
        else{
          this.mainForm.get('fixedCheckbox')?.setValue(false);
        }
        }
        else{
          this.mainForm.updateHidden({ fixedCheckbox: true });
        }
      }
      else {
    
        this.mainForm.updateHidden({ loanMaintenceFee: true });
        this.mainForm.updateHidden({ fixedCheckbox: true });
      }
     
    });

    this.baseSvc.onDealerChange.subscribe((change)=>{
      if(this.baseFormData?.purposeofLoan == configure.LoanPurpose) {
        let showLmf = this.dashboardSvc?.introducers?.find(item => 
         item.originatorNo == this.baseFormData?.originatorNumber
        )  

        if(showLmf?.waive == 1 ) {
          this.mainForm.updateHidden({ fixedCheckbox: false });
           if(this.baseFormData.weiveLMF=="1")
        {
         this.mainForm.get('fixedCheckbox')?.setValue(true);
        }
        else{
          this.mainForm.get('fixedCheckbox')?.setValue(false);
        }
        }
        else{
          this.mainForm.updateHidden({ fixedCheckbox: true });
        }
      }
      else{
        this.mainForm.updateHidden({ fixedCheckbox: true });
      }
      
    })
    
    await this.updateValidation("onInit");
    super.onFormReady();
  }

  override async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  override async onValueEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  override onValueTyped(event: any): void {
    if(event?.name === "fixedCheckbox"){
       this.baseSvc.forceToClickCalculate.next(true);
    }
  }
  async updateValidation(event) {
    const req = {
      form: this.mainForm?.form,
      formConfig: this.formConfig,
      event: event,
      modelName: this.modelName,
      pageCode: this.pageCode,
    };

    const responses = await this.validationSvc.updateValidation(req);
    if (!responses.status && responses.updatedFields.length) {
      await this.mainForm.applyValidationUpdates(responses);
    }

    return responses.status;
  }

  override async onStepChange(quotesDetails: any): Promise<void> {
    if (quotesDetails.type !== "tabNav") {
      var result: any = await this.updateValidation("onSubmit");
      if (!result?.status) {
        // this.toasterSvc.showToaster({
        //   severity: "error",
        //   detail: "I7",
        // });
      }
    }
  }
}
