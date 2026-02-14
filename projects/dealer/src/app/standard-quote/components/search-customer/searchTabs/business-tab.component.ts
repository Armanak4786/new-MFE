import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseStandardQuoteClass } from "../../../base-standard-quote.class";
import { CommonService, DataService, GenericFormConfig } from "auro-ui";
import { ActivatedRoute } from "@angular/router";
import { StandardQuoteService } from "../../../services/standard-quote.service";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { ToasterService, ValidationService } from "auro-ui";
import { takeUntil } from "rxjs";

@Component({
  selector: "app-business-tab",
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
      (onBlur)="onBlurEvent($event)"
      (onValueChange)="onValueEvent($event)"
    >
    </base-form>
  `,
})
export class BusinessTabComponent extends BaseStandardQuoteClass {
  override formConfig: GenericFormConfig = {
    cardType: "non-border",
    autoResponsive: true,
    api: "addAsset",
    goBackRoute: "quoteOriginator",
    fields: [
      {
        type: "select",
        name: "searchByBusiness",
        label: "Search By",
        cols: 3,
        default: "companyName",
        options: [
          { label: "Company Name", value: "companyName" },
          { label: "GST Number", value: "gstNo" },
          { label: "Registered Number", value: "registeredNo" },
          { label: "Trading Name", value: "tradingName" },
          { label: "UDC Customer Number", value: "udcCustomerNo" },
        ],
         toolTipPosition:'top'
      },
      {
        type: "text",
        label: "Registered Number",
        name: "registeredNo",
        cols: 5,
        resetOnHidden: true,
        maxLength: 10,
        // //regexPattern: '[^a-zA-Z0-9]*',
        hidden: true,
        className: "-mt-2",
        labelClass: "mb-0",
        inputType: "vertical",
      },
      {
        type: "text",
        label: "Trading Name ",
        name: "tradingName",
        //regexPattern: "[^a-zA-Z ]*",
        cols: 5,
        maxLength: 40,
        resetOnHidden: true,
        hidden: true,
        className: "-mt-2",
        labelClass: "mb-0",
        inputType: "vertical",
      },
      {
        type: "text",
        label: "GST Number",
        name: "gstNo",
        cols: 5,
        hidden: true,
        resetOnHidden: true,
        maxLength: 10,
        //regexPattern: "[^a-zA-Z0-9]*",
        className: "-mt-2",
        labelClass: "mb-0",
        inputType: "vertical",
      },

      {
        type: "text",
        label: "UDC Customer Number",
        name: "udcCustomerNo",
        cols: 5,
        hidden: true,
        resetOnHidden: true,
        maxLength: 10,
        //regexPattern: "[^a-zA-Z0-9]*",
        className: "-mt-2",
        labelClass: "mb-0",
        inputType: "vertical",
      },
      {
        type: "text",
        label: "Company Name",
        name: "companyName",
        cols: 5,
        maxLength: 40,
        // //regexPattern: '[^a-zA-Z0-9]*',
        hidden: false,
        resetOnHidden: true,
        className: "-mt-2",
        labelClass: "mb-0",
        inputType: "vertical",
      },
      {
        type: "button",
        label: "Search",
        name: "searchBtn",
        submitType: "submit",
        cols: 2
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

   fields = {
        tradingName: "businesstradingName",
        gstNo: "businessgstNo",
        companyName: "businessCompanyName",
        registeredNo: "businessregisteredNo",
      };

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: StandardQuoteService,
    public dataSvc: DataService,
    public ref: DynamicDialogRef,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
  }

  override async ngOnInit(): Promise<void> {
    this.mainForm?.form?.reset();
    await super.ngOnInit();
    this.mainForm.get("searchByBusiness").patchValue("companyName");

      for (const key in this.fields) {
        this.baseFormData[this.fields[key]] = null;
      }

    await this.updateValidation("onInit");
  }

  override onFormEvent(event) {}

  override async onValueTyped(event: any): Promise<void> {
    if (event.name == "searchByBusiness") {
      if (event.data == "registeredNo") {
        this.mainForm.updateHidden({
          registeredNo: false,
          companyName: true,
          tradingName: true,
          gstNo: true,
          udcCustomerNo: true,
        });
      } else if (event.data == "tradingName") {
        this.mainForm.updateHidden({
          tradingName: false,
          companyName: true,
          registeredNo: true,
          gstNo: true,
          udcCustomerNo: true,
        });
      } else if (event.data == "gstNo") {
        this.mainForm.updateHidden({
          gstNo: false,
          companyName: true,
          registeredNo: true,
          tradingName: true,
          udcCustomerNo: true,
        });
      } else if (event.data == "udcCustomerNo") {
        this.mainForm.updateHidden({
          udcCustomerNo: false,
          companyName: true,
          registeredNo: true,
          tradingName: true,
          gstNo: true,
        });
      } else {
        this.mainForm.updateHidden({
          companyName: false,
          registeredNo: true,
          tradingName: true,
          gstNo: true,
          udcCustomerNo: true,
        });
      }
    } else {
      
      for (const key in this.fields) {
        this.baseFormData[this.fields[key]] = null;
      }

      if (this.fields[event.name]) {
        this.baseFormData[this.fields[event.name]] = event.data;
      }
    }

    await this.updateValidation("onInit");
  }
  override async onButtonClick(event: any): Promise<void> {
    if (event.field.name == "resetBtn") {
      this.mainForm.form.reset();
      await this.updateValidation("onInit");
      this.baseFormData.searchCustomerData.business = null
      
    }
    if (event?.field?.name == "searchBtn") {
      if (this.mainForm.form.valid) {
        this.callCustomerSearchAPI();
      } else {
        this.toasterSvc.showToaster({
          severity: "error",
          detail: "A search criteria field must be completed",
        });
      }
    }
  }

  callCustomerSearchAPI() {
    let formData = this.mainForm.form.value;
    let businessData: any;

    switch (formData?.searchByBusiness) {
      case "companyName":
        businessData = {
          companyName: formData?.companyName,
        };
        break;
      case "registeredNo":
        businessData = {
          registeredNo: formData?.registeredNo,
        };
        break;
      case "tradingName":
        businessData = {
          tradingName: formData?.tradingName,
        };
        break;
      case "gstNo":
        businessData = {
          gstNo: formData?.gstNo,
        };
        break;
      case "udcCustomerNo":
        businessData = {
          udcCustomerNo: formData?.udcCustomerNo,
        };
        break;
    }

    let payload = {
      individual: null,
      business: businessData,
      trust: null,
    };

      this.baseSvc.setBaseDealerFormData({
      searchCustomerData : payload
      }
      )

    this.dataSvc
      .post(`CustomerDetails/search_customer`, payload)
      .pipe(takeUntil(this.destroy$)).subscribe((res) => {
        this.baseSvc.searchCustomerData = res?.data?.customers || [];
        this.svc.router.navigateByUrl(
          "/dealer/standard-quote/borrower-search-result/business"
        );
        this.mainForm.form.reset();
        this.ref.close();
      });
  }

  override async onSuccess(data: any) {}

  override ngOnDestroy(): void {
    this.mainForm.form.reset();
  }

  pageCode: string = "SearchCustomerComponent";
  modelName: string = "BusinessTabComponent";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();

    if (this.baseFormData?.searchCustomerData?.business != null) {
 
        const business = this.baseFormData?.searchCustomerData?.business;
        
  
        if (business?.udcCustomerNo) {
          
            this.mainForm.get("searchByBusiness").patchValue("udcCustomerNo");
            this.mainForm.get("udcCustomerNo").patchValue(business.udcCustomerNo);
            this.mainForm.updateHidden({
                companyName: true,
                registeredNo: true,
                tradingName: true,
                gstNo: true,
                udcCustomerNo: false,
            });
        } else if (business?.registeredNo) {
      
            this.mainForm.get("searchByBusiness").patchValue("registeredNo");
            this.mainForm.get("registeredNo").patchValue(business.registeredNo);
            this.mainForm.updateHidden({
                companyName: true,
                registeredNo: false,
                tradingName: true,
                gstNo: true,
                udcCustomerNo: true,
            });
        } else if (business?.tradingName) {
        
            this.mainForm.get("searchByBusiness").patchValue("tradingName");
            this.mainForm.get("tradingName").patchValue(business.tradingName);
            this.mainForm.updateHidden({
                companyName: true,
                registeredNo: true,
                tradingName: false,
                gstNo: true,
                udcCustomerNo: true,
            });
        } else if (business?.gstNo) {
 
            this.mainForm.get("searchByBusiness").patchValue("gstNo");
            this.mainForm.get("gstNo").patchValue(business.gstNo);
            this.mainForm.updateHidden({
                companyName: true,
                registeredNo: true,
                tradingName: true,
                gstNo: false,
                udcCustomerNo: true,
            });
        } else if (business?.companyName) {
     
            this.mainForm.get("searchByBusiness").patchValue("companyName");
            this.mainForm.get("companyName").patchValue(business.companyName);
            this.mainForm.updateHidden({
                companyName: false,
                registeredNo: true,
                tradingName: true,
                gstNo: true,
                udcCustomerNo: true,
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
