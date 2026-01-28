import { ChangeDetectorRef, Component, EventEmitter, Output } from "@angular/core";
import { BaseStandardQuoteClass } from "../../../base-standard-quote.class";
import { CommonService, DataService, GenericFormConfig } from "auro-ui";
import { ActivatedRoute } from "@angular/router";
import { StandardQuoteService } from "../../../services/standard-quote.service";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { ToasterService, ValidationService } from "auro-ui";
import { takeUntil } from "rxjs";
import { SupplierSearchResultComponent } from "../../supplier-search-result/supplier-search-result.component";

@Component({
  selector: "app-supplier-business-tab",
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
  `
})
export class SupplierBusinessTabComponent extends BaseStandardQuoteClass {
    @Output() searchTriggered = new EventEmitter<any>();

  override formConfig: GenericFormConfig = {
    cardType: "non-border",
    api: "",
    autoResponsive: true,
    fields: [
      {
        type: "select",
        name: "searchByBusiness",
        label: "Search By",
        default: "companyName",
        options: [
          { label: "Company Name", value: "companyName" },
          { label: "Trading Name", value: "tradingName" },
          { label: "Registered Number", value: "registeredNumber" },
          { label: "UDC Supplier Number", value: "udcSupplierNumber" },
          { label: "GST Number", value: "gstNumber" }
        ],
        toolTipPosition: "top"
      },
      {
        type: "text",
        label: "Company Name",
        name: "companyName",
        hidden: false,
        className: "-mt-2",
        labelClass: "mb-0",
        inputType: "vertical"
      },
      {
        type: "text",
        label: "Trading Name",
        name: "tradingName",
        hidden: true,
        className: "-mt-2",
        labelClass: "mb-0",
        inputType: "vertical"
      },
      {
        type: "text",
        label: "Registered Number",
        name: "registeredNumber",
        hidden: true,
        className: "-mt-2",
        labelClass: "mb-0",
        inputType: "vertical"
      },
      {
        type: "text",
        label: "UDC Supplier Number",
        name: "udcSupplierNumber",
        hidden: true,
        className: "-mt-2",
        labelClass: "mb-0",
        inputType: "vertical"
      },
      {
        type: "text",
        label: "GST Number",
        name: "gstNumber",
        hidden: true,
        className: "-mt-2",
        labelClass: "mb-0",
        inputType: "vertical"
      },
      {
        type: "button",
        label: "Search",
        name: "searchBtn",
        submitType: "submit"
      },
      {
        type: "button",
        label: "Reset",
        name: "resetBtn",
        btnType: "border-btn",
        submitType: "internal"
      }
    ]
  };

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public dataSvc: DataService,
    public override baseSvc: StandardQuoteService,
    public ref: DynamicDialogRef,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.mainForm?.form?.reset();
    this.baseFormData.searchByBusiness = "companyName"
    this.mainForm.get("searchByBusiness")?.patchValue("companyName");
    await this.updateValidation("onInit");
  }

 
  override async onValueTyped(event: any): Promise<void> {
    if (event.name === "searchByBusiness") {
      const value = event.data;

      this.mainForm.updateHidden({
        companyName: value !== "companyName",
        tradingName: value !== "tradingName",
        registeredNumber: value !== "registeredNumber",
        udcSupplierNumber: value !== "udcSupplierNumber",
        gstNumber: value !== "gstNumber"
      });
    }

    await this.updateValidation("onInit");
  }

  
 override async onButtonClick(event: any): Promise<void> {
  if (event.field.name === "resetBtn") {
    this.mainForm.form.reset();
    this.mainForm.get("searchByBusiness")?.patchValue("companyName");
    this.mainForm.updateHidden({
      companyName: false,
      tradingName: true,
      registeredNumber: true,
      udcSupplierNumber: true,
      gstNumber: true
    });

  }

   if (event.field.name === "searchBtn") {
   this.callSupplierSearchApi();
  }


  await this.updateValidation("onInit");
  return;
 }

  callSupplierSearchApi(){
    let formData = this.mainForm.form.value;
    let businessData:any;

    switch(formData?.searchByBusiness){
        case "companyName":
          businessData = {
            companyName: formData?.companyName,
          };
          break;
            case "tradingName":
          businessData = {
            tradingName: formData?.tradingName,
          };
          break;
            case "registeredNumber":
          businessData = {
            registeredNumber: formData?.registeredNumber,
          };
          break;
            case "udcSupplierNumber":
          businessData = {
            udcCustomerNo: formData?.udcSupplierNumber,
          };
          break;
        case "gstNumber":
          businessData = {
            gstNumber: formData?.gstNumber,
          };
          break;
    }
     let payload = {
        individual: null,
        business: businessData,
      };
  
      let suppliersData;
      this.svc.data.post("CustomerDetails/search_customer", payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res)=>{
          suppliersData = res?.data?.customers || [];
  
      if(suppliersData?.length){
        const mappedData = this.mapApiToSupplierUI(suppliersData, "business")
        this.openSearchResultDialog(mappedData);
      }
      else{
        this.openSearchResultDialog();
      }
      })
  }


private mapApiToSupplierUI(customers: any[], type: string) {
  return customers.map(c => {

    if (type === "business") {
      return {
        supplierName: c.companyName || c.tradingName || c.firstName || "",
        supplierNo: c.customerNo || c.udcCustomerNo || "",
        supplierType: "Business",
        partyRole: c.partyType || "-",

        address: c.address || "-",
        tradingName: c.tradingName || "-",

        raw: c
      };
    }

    return { raw: c };
  });
}

openSearchResultDialog(supplierData?: any[]){
  this.svc.dialogSvc.show(SupplierSearchResultComponent,"",{
     width: "62vw",
     height: "60vh",
      data: {
      supplierType: "business",
      suppliers: supplierData 
    },
     templates: {
          footer: null,
        },
  })
  .onClose.subscribe((data) => {
      if(data){
    }
  this.ref.close(data)
  });
  
}


  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();
  }

 
  async updateValidation(event: any) {
    const req = {
      form: this.mainForm?.form,
      formConfig: this.formConfig,
      event,
      modelName: "SupplierBusinessTabComponent",
      pageCode: "SearchSupplierComponent"
    };

    const responses = await this.validationSvc.updateValidation(req);
    if (!responses.status && responses.updatedFields.length) {
      await this.mainForm.applyValidationUpdates(responses);
    }
    return responses.status;
  }

  
}
