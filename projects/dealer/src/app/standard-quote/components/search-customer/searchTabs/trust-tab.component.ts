import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseStandardQuoteClass } from "../../../base-standard-quote.class";
import { CommonService, DataService, GenericFormConfig } from "auro-ui";
import { ActivatedRoute } from "@angular/router";
import { StandardQuoteService } from "../../../services/standard-quote.service";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { GenericDialogService } from "auro-ui";
import { ToasterService, ValidationService } from "auro-ui";
import { IndividualService } from "../../../../individual/services/individual.service";
import { BusinessService } from "../../../../business/services/business";
import configure  from "../../../../../../public/assets/configure.json"

@Component({
  selector: "app-trust-tab",
  template: `
    <base-form
      #mainForm
      [formConfig]="formConfig"
      [mode]="mode"
      [id]="id"
      [data]="data"
      (valueChanges)="onValueChanges($event)"
      (formEvent)="onFormEvent($event)"
      (formButtonEvent)="onButtonClick($event)"
      (formReady)="onFormReady()"
      (onInput)="onValueTyped($event)"
      (onBlur) ="onBlurEvent($event)"
      (onValueChange)="onValueEvent($event)"
    >
    </base-form>
  `,
})
export class TrustTabComponent extends BaseStandardQuoteClass {

    override formConfig: GenericFormConfig = {
    cardType: "non-border",
    autoResponsive: true,
    api: "addAsset",
    goBackRoute: "quoteOriginator",
    fields: [
      {
        type: "select",
        name: "searchByTrust",
        label: "Search By",
        cols: 3,
        default: "trustName",
        filter: true,
        options: [
          { label: "Trust Name", value: "trustName" },
          { label: "UDC Customer Number", value: "udcCustomerNo" },
        ],
         toolTipPosition:'top'
      },
      {
        type: "text",
        label: "UDC Customer Number",
        name: "udcCustomerNo",
        cols: 5,
        hidden: true,
        maxLength: 10,
        className: "-mt-2",
        labelClass: "mb-0",
        inputType: "vertical",
        //regexPattern: "[^a-zA-Z0-9]*",
      },
      {
        type: "text",
        label: "Trust Name",
        name: "trustName",
        //regexPattern: "[^a-zA-Z ]*",
        resetOnHidden: true,
        // validators : [Validators.required],
        maxLength: 40,
        cols: 5,
        hidden: false,
        className: "-mt-2",
        labelClass: "mb-0",
        inputType: "vertical",
      },
      {
        type: "button",
        label: "Search",
        name: "searchBtn",
        submitType: "submit",
        cols:2
      },
      {
        type: "button",
        label: "Reset",
        name: "resetBtn",
        btnType: "border-btn",
        submitType: "internal",
        cols:2
      },
    ],
  };

  constructor(
    public override route: ActivatedRoute,
    public dataSvc: DataService,
    public override svc: CommonService,
    override baseSvc: StandardQuoteService,
    public ref: DynamicDialogRef,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef,
     public individualSvc : IndividualService,
    public businessSvc : BusinessService
  ) {
    super(route, svc, baseSvc);
  }

  override async ngOnInit(): Promise<void> {
    this.mainForm?.form?.reset();
    await super.ngOnInit();
    this.mainForm.get("searchByTrust").patchValue("trustName");

    this.baseFormData.udcTrustName = null;
    await this.updateValidation("onInit");
  }


  override async onFormEvent(event) {
    // if (event.value == "udcCustomerNo") {
    //   this.mainForm.updateHidden({ udcCustomerNo: false, trustName: true });
    // } else if (event.value == "trustName") {
    //   this.mainForm.updateHidden({ udcCustomerNo: true, trustName: false });
    // }
  }

  override async onValueTyped(event: any): Promise<void> {
   
      if (event.data == "udcCustomerNo") {
      this.mainForm.updateHidden({ udcCustomerNo: false, trustName: true });
    } else if (event.data == "trustName") {
      this.mainForm.updateHidden({ udcCustomerNo: true, trustName: false });
      this.mainForm.get("udcCustomerNo").reset();
    }

    if( event.name == "trustName") {
      this.baseFormData.udcTrustName = event.data;
    }
    else if (event.name == "udcCustomerNo") {
      this.baseFormData.udcTrustName = null;
    }
    
     await this.updateValidation(event);
  }

  callCustomerSearchAPI() {
    let formData = this.mainForm.form.value;
    let trustData: any;

    switch (formData?.searchByTrust) {
      case "udcCustomerNo":
        trustData = {
          udcCustomerNo: formData?.udcCustomerNo,
        };
        break;
      case "trustName":
        trustData = {
          trustName: formData?.trustName,
        };
        break;
    }

    let payload = {
      individual: null,
      business: null,
      trust: trustData,
    };

     this.baseSvc.setBaseDealerFormData({
      searchCustomerData : payload
      }
      )

    this.dataSvc
      .post(`CustomerDetails/search_customer`, payload)
      .subscribe((res) => {
       
          this.baseSvc.searchCustomerData = res?.data?.customers;
          this.svc.router.navigateByUrl(
            "/dealer/standard-quote/borrower-search-result/trust"
          );
          this.mainForm.form.reset();
          this.ref.close();
        
      });
  }

  override async onButtonClick(event: any): Promise<void> {

    if (event?.field?.name == "searchBtn") {
      if(this.baseFormData?.purposeofLoan == configure?.LoanPurpose && this.individualSvc?.role !== 1 && this.businessSvc?.role !== 1){
        this.toasterSvc.showToaster({
          severity: "error",
          detail: "Please add an individual borrower before adding a Trust as a Guarantor."
        })
        return
      }
    if (this.mainForm.form.valid ) {
        this.callCustomerSearchAPI();
      } 
    else {
        this.toasterSvc.showToaster({
            severity: "error",
            detail: "A search criteria field must be completed",
        });
      }
    }
 if (event?.field?.name == "resetBtn") {
    
    this.mainForm.form.reset();
    
    
    this.mainForm.form.markAsUntouched();
    this.mainForm.form.markAsPristine();
    
    
    Object.keys(this.mainForm.form.controls).forEach(key => {
        const control = this.mainForm.form.get(key);
        control?.markAsUntouched();
        control?.markAsPristine();
        control?.setErrors(null);
    });
    
    
    this.mainForm.get("searchByTrust")?.patchValue("trustName", { emitEvent: false });
    this.mainForm.updateHidden({ udcCustomerNo: true, trustName: false });
}


  }

  override async onSuccess(data: any) {}
  override ngOnDestroy(): void {
    this.mainForm.form.reset();
    
  }

  pageCode: string = "SearchCustomerComponent";
  modelName: string = "TrustTabComponent";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();

    if (this.baseFormData?.searchCustomerData?.trust != null) {
        const trust = this.baseFormData?.searchCustomerData?.trust;

        
        if (trust?.udcCustomerNo) {
            this.mainForm.get("searchByTrust").patchValue("udcCustomerNo");
            this.mainForm.get("udcCustomerNo").patchValue(trust.udcCustomerNo);
            this.mainForm.updateHidden({
                udcCustomerNo: false,
                trustName: true
            });
        } else if (trust?.trustName) {
            this.mainForm.get("searchByTrust").patchValue("trustName");
            this.mainForm.get("trustName").patchValue(trust.trustName);
            this.mainForm.updateHidden({
                udcCustomerNo: true,
                trustName: false
            });
        }
    }
  }

  override async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  override async onValueEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  async updateValidation(event) {
     if (event?.field?.name == "resetBtn") {
      console.log('in')
    return { status: true, updatedFields: [] };
  }
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
