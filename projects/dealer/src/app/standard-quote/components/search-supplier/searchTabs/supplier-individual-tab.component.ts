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
  selector: "app-supplier-individual-tab",
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
export class SupplierIndividualTabComponent extends BaseStandardQuoteClass {
  @Output() searchTriggered = new EventEmitter<any>();

  date = new Date();
  allowedDate = new Date(
    this.date.getMonth() + 1 + "/" + this.date.getDate() + "/" + (this.date.getFullYear() - 18)
  );

  override formConfig: GenericFormConfig = {
    cardType: "non-border",
    autoResponsive: true,
    api: "",
    fields: [
      {
        type: "select",
        label: "Search By",
        name: "searchByIndividualSupplier",
        filter: true,
        options: [
          { label: "Name", value: "name" },
          { label: "Number", value: "number" },
        ],
        toolTipPosition: "top",
      },
      {
        type: "text",
        label: "First Name",
        name: "firstName",
        hidden: false,
        className: "-mt-2 mr-2",
        labelClass: "mb-0",
        inputType: "vertical",
      },
      {
        type: "text",
        label: "Last Name",
        name: "lastName",
        hidden: false,
        className: "-mt-2",
        labelClass: "mb-0",
        inputType: "vertical",
      },
      {
        type: "date",
        label: "Date of Birth",
        name: "dateOfBirth",
        defaultDate: this.allowedDate,
        maxDate: this.allowedDate,
        labelClass: "mb-0",
        inputType: "vertical",
        className: "-mt-3",
      },
      {
        type: "text",
        label: "Supplier Number",
        name: "supplierNumber",
        hidden: true,
        className: "-mt-2",
        labelClass: "mb-0",
        inputType: "vertical",
      },
      {
        type: "button",
        label: "Search",
        name: "searchBtn",
        submitType: "submit",
      },
      {
        type: "button",
        label: "Reset",
        name: "resetBtn",
        btnType: "border-btn",
        submitType: "internal",
      },
    ],
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
    this.baseFormData.searchByIndividualSupplier = "name"
    this.mainForm.get("searchByIndividualSupplier")?.patchValue("name");
    await this.updateValidation("onInit");
  }

  override async onValueTyped(event: any): Promise<void> {
    if (event.name === "searchByIndividualSupplier") {
      const value = event.data;
      if (value === "number") {
        this.mainForm.updateHidden({
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          supplierNumber: false,
        });
      } else {
        this.mainForm.updateHidden({
          firstName: false,
          lastName: false,
          dateOfBirth: false,
          supplierNumber: true,
        });
      }
    }
    await this.updateValidation("onInit");
  }

  
  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();
  }

  override async onBlurEvent(event: any): Promise<void> {
    if (event.name !== "dateOfBirth") {
      await this.updateValidation(event);
    }
  }

  override async onValueEvent(event: any): Promise<void> {
    await this.updateValidation(event);
  }

  override async onButtonClick(event: any): Promise<void> {
  if (event.field.name === "resetBtn") {
    this.mainForm.form.reset();
    this.mainForm.get("searchByIndividualSupplier")?.patchValue("name");
    this.mainForm.updateHidden({
      firstName: false,
      lastName: false,
      dateOfBirth: false,
      supplierNumber: true,
    });
    await this.updateValidation("onInit");
    return;
  }

 if (event.field.name === "searchBtn") {
   this.callSupplierSearchApi();
}
}

callSupplierSearchApi(){
  let formData = this.mainForm.form.value;
  let individualData:any;
 
  switch(formData?.searchByIndividualSupplier){
      case "name":
        individualData = {
          firstName: formData?.firstName,
          lastName: formData?.lastName,
          dateOfBirth: this.baseFormData?.dateOfBirth,
        };
        break;
      case "number":
        individualData = {
          udcCustomerNo: formData?.supplierNumber,
        };
        break;
  }
   let payload = {
      individual: individualData,
      business: null,
    };

    let suppliersData;
    this.svc.data.post("CustomerDetails/search_customer", payload)
    .pipe(takeUntil(this.destroy$))
    .subscribe((res)=>{
        suppliersData = res?.data?.customers || [];

        if (!suppliersData.length) {
          this.toasterSvc.showToaster({
            severity: "warn",
            detail: "No suppliers found.",
          });
          return;
        }

    if(suppliersData?.length){
      const mappedData = this.mapApiToSupplierUI(suppliersData, "individual")
      this.openSearchResultDialog(mappedData);
    }
    })


}

private mapApiToSupplierUI(customers: any[], type: string) {
  return customers.map(c => {
    if (type === "individual") {
      return {
        supplierName: `${c.firstName || ""} ${c.lastName || ""}`.trim(),
        supplierNo: c.customerNo || c.udcCustomerNo || "",
        supplierType: "Individual",
        partyRole: c.partyType || "-",

        address: c.address || "-",
        dob: (c.dateOfBirth && c.dateOfBirth !== "0001-01-01")
              ? c.dateOfBirth
              : "-",

        raw: c
      };
    }
    return { raw: c };
  });
}

openSearchResultDialog(supplierData: any[]){
  this.svc.dialogSvc.show(SupplierSearchResultComponent,"",{
     width: "62vw",
     height: "60vh",
      data: {
      supplierType: "individual",
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


  async updateValidation(event: any) {
    const req = {
      form: this.mainForm?.form,
      formConfig: this.formConfig,
      event,
      modelName: "SupplierIndividualTabComponent",
      pageCode: "SearchSupplierComponent",
    };

    const responses = await this.validationSvc.updateValidation(req);
    if (!responses.status && responses.updatedFields.length) {
      await this.mainForm.applyValidationUpdates(responses);
    }

    return responses.status;
  }

  override ngOnDestroy(): void {
     super.ngOnDestroy()
   }
}
