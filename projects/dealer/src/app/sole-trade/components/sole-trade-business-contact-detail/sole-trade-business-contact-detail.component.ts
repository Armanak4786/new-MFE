import { Component } from "@angular/core";
import { BaseSoleTradeClass } from "../../base-sole-trade.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig } from "auro-ui";
import { SoleTradeService } from "../../services/sole-trade.service";
import { Validators } from "@angular/forms";

@Component({
  selector: "app-sole-trade-business-contact-detail",

  templateUrl: "./sole-trade-business-contact-detail.component.html",
  styleUrls: ["./sole-trade-business-contact-detail.component.scss"],
})
export class SoleTradeBusinessContactDetail2Component extends BaseSoleTradeClass {
  optionsdata: any[] = ["aa"];
  privousChecked: any;
  borrowedAmount: any;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public soleTradeSvc: SoleTradeService
  ) {
    super(route, svc, soleTradeSvc);
  }
  override formConfig: GenericFormConfig = {
    autoResponsive: true,
    api: "",
    goBackRoute: "",
    cardType: "non-border",
    fields: [
      {
        type: "array",
        name: "mobileArr",
        cols: 12,
        isTemplateFormData: true,
        isDelete: false,
        isAdd: false,
        fields: [
          {
            type: "label-only",
            typeOfLabel: "inline",
            label: "Busniess",
            name: "year",
            className: "mt-2 pt-2 col-fixed w-4rem",
          },
          {
            type: "select",
            name: "code",
            cols: 2,
            options: [],
            nextLine: false,
          },
          {
            type: "text",
            name: "areaNum",
            cols: 2,
            disabled: true,
            nextLine: false,
          },
          {
            type: "text",
            name: "mobileNoText",
            cols: 4,
          },
          {
            type: "checkbox",
            name: "phoneChk",
            cols: 1,
            className: "pt-4",
          },
          {
            type: "deleteBtn",
            btnType: "non-bg-btn",
            submitType: "internal",
            name: "deleteBtn",
            icon: "fa-regular fa-trash-can text-base",
            cols: 1,
            nextLine: true,
          },
        ],
        templateFormFields: [
          {
            type: "label-only",
            typeOfLabel: "inline",
            label: "Mobile",
            name: "year",
            className: "mt-2 pt-2 col-fixed w-4rem",
          },
          {
            type: "select",
            name: "code",
            cols: 2,
            options: [
              {
                label: "Others",
                value: "Others",
              },
              {
                label: "Otherssss",
                value: "Otherssss",
              },
            ],
          },
          {
            type: "text",

            name: "areaNum",
            cols: 2,
          },
          {
            type: "text",
            name: "mobileNoText",
            cols: 4,
          },
          {
            type: "checkbox",
            name: "phoneChk",
            cols: 1,
            className: "pt-4",
            nextLine: true,
          },
          {
            type: "addBtn",
            submitType: "internal",
            label: "Add Other Number",
            name: "addBtn",
            btnType: "plus-btn",
            cols: 4,
            className: "",
            nextLine: true,
          },
        ],
      },
    ],
  };

  override async onSuccess(data: any) {}

  override onValueChanges(event: any): void {}
  override onButtonClick(event: any): void {
    const formArray = this.mainForm.getArrayControls(event?.field?.name);

    if (formArray?.length < 2) {
      if (event?.field?.name == "mobileArr") {
        formArray.length == 1
          ? (event.field.fields[0].label = "Other")
          : "Business";

        this.mainForm.addArrayControls(event?.field?.name);
        this.customPatchFormArray(event, event?.templateFormData?.value);
      }
    }
  }

  override onFormEvent(event: any): void {
     super.onFormEvent(event);
     
  }
  isDisabled(): boolean {
  const baseFormDataStatus = this.baseFormData?.AFworkflowStatus;
  const sessionStorageStatus = sessionStorage.getItem('workFlowStatus');
  return !(
    baseFormDataStatus === 'Quote' ||
    sessionStorageStatus === 'Open Quote'
  );
}

  override onFormReady(): void {
    super.onFormReady();
    // Disable form if workflow status requires it
    if (this.isDisabled() && this.mainForm?.form) {
      this.mainForm.form.disable();
    }
  }
}
