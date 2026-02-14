import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { CommonService, GenericFormConfig, ToasterService } from "auro-ui";
import { ActivatedRoute } from "@angular/router";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { Validators } from "@angular/forms";
import { AssetTradeSummaryService } from "../asset-insurance-summary/asset-trade.service";
import { map } from "rxjs";
import { PhysicalAsset } from "../../models/assetsTrade";
import { ValidationService } from "auro-ui";

@Component({
  selector: "app-motocheck-tab",
  template: `
<div class="motocheck-tab">
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
    >
    </base-form>
</div>
  `,
})
export class AppMotocheckTabComponent extends BaseStandardQuoteClass {
  assetData: any = {};
  param: any;
  searchBy: any;
  @Input() addType: string;

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: StandardQuoteService,
    public ref: DynamicDialogRef,
    public assetTradeSvc: AssetTradeSummaryService,
    public toasterService: ToasterService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
  }

override formConfig: GenericFormConfig = {
    cardType: "non-border",
    autoResponsive: true,
    api: "addAsset",
    goBackRoute: "quoteOriginator",
    fields: [
      {
        type: "select",
        label: "Search By",
        name: "searchAssetSearchBy",
        cols: 3,
        //validators: [Validators.required],
        options: [
          { label: "Rego Number", value: "regoNumber" },
          { label: "VIN Number", value: "vinNumber" },
        ],
        className:"pl-0"
      },
      {
        type: "text",
        label: "Enter Number",
        name: "searchAssetEnterNum",
        maxLength: 20,
        //validators: [Validators.required],
        cols: 3,

      },
      {
        type: "button",
        label: "Search",
        name: "searchBtn",
        cols: 2,
        submitType: "submit",
        className: "mt-2",
      },
      {
        type: "button",
        label: "Reset",
        name: "resetBtn",
        btnType: "border-btn",
        cols: 2,
        submitType: "internal",
        className: "mt-2",
      },
    ],
  };

  override onValueTyped(event: any): void {
    if (event.name == "searchAssetSearchBy") {
      if (event.data == "regoNumber") {
        this.mainForm.get("searchAssetEnterNum").clearValidators();
        this.mainForm.updateValidators("searchAssetEnterNum", [
          Validators.required,
        ]);
      } else if (event.data == "vinNumber") {
        this.mainForm.updateValidators("searchAssetEnterNum", [
          Validators.minLength(17),
          Validators.required,
        ]);
        // this.mainForm.get('searchAssetEnterNum').addValidators();
      }
    }
  }

  override onChildValueChanges(event: any): void {
    this.assetData = { ...event };
  }
  override onFormEvent(event: any): void {}
  override async onButtonClick(event: any): Promise<void> {
    if (event?.field?.name == "searchBtn") {
      const validation = this.checkValidate();
      headers: {
        ("Encrypt");
        ("true"); // Custom header to trigger encryption
      }
      let request;
      const searchBy = this.mainForm.form.get("searchAssetSearchBy").value;
      const param = this.mainForm.form.get("searchAssetEnterNum").value;

      if (searchBy === "regoNumber") {
        request = { plateNumber: param };
      } else if (searchBy === "vinNumber") {
        request = { vinNumber: param };
      }
      if (param && validation != "INVALID") {
        let res: any = await this.svc.data
          .post("Motocheck/get_evaluation", request)
          .pipe(
            map((res) => {
              return res.data || res.items;
            })
          )
          .toPromise();

        if (res) {
          let data = res?.bcAservice?.bcAserviceData?.response?.motoChekReport;
          let mappedData = [];
          let asset: PhysicalAsset;
          asset = {
            id: 0,
            assetId: res?.bcAservice?.bcAserviceCode || 0,
            assetName: "",
            make: data.vehicleRegistrationDetails?.make || "",
            model: data.vehicleRegistrationDetails?.model || "",
            year: Number(data.vehicleRegistrationDetails?.year) || null,
            conditionOfGood: "",
            variant: data?.vehicleDescription?.submodel || "",
            regoNumber: data?.vehicleRegistrationDetails?.plateNumber || "",
            vin: data.vehicleDescription?.vinnumber || "",
            serialChassisNumber: data.vehicleDescription?.enginenumber || "",
            costOfAsset: 0,
            ccRating: String(data?.vehicleDescription?.ccRating || 0),
            engineNumber: data.vehicleDescription?.enginenumber || "",
            chassisNumber: data.vehicleDescription?.enginenumber || "",
            colour: data.vehicleDescription?.maincolour || "",
            motivePower: data.vehicleDescription?.fueltype || "",
            odometer: Number(
              data.vehicleDescription?.latestOdometerReading || null
            ),
          features : '',
          description :'',
          };
          mappedData.push(asset);
          this.assetTradeSvc.assetSearchResult = mappedData;
          //  this.dataList = extractedValues;
          if (this.addType == "Add Asset") {
            this.svc.router.navigateByUrl(
              "/dealer/standard-quote/asset-search-result"
            );
          } else {
            this.svc.router.navigateByUrl(
              "/dealer/standard-quote/trade-search-result"
            );
          }

          this.ref.close({
            action: "closeAssetInsuranceSummaryTable",
          });
        }
        // else {
        //   this.toasterService.showToaster({
        //     severity: "error",
        //     detail: "Data cannot be found for searched values.",
        //   });
        // }

        //call api
        // this.dataSvc.post('assets', this.assetData);
        // this.svc.router.navigateByUrl(
        //   '/dealer/standard-quote/asset-search-result'
        // );
        // this.ref.close();
      }
    }

    if (event.field.name == "resetBtn") {
        this.mainForm.form.reset();
    }
  }

  pageCode: string = "MotocheckTabComponent";
  modelName: string = "MotocheckTabComponent";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();
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
      // if (!result?.status) {
      //   this.toasterSvc.showToaster({
      //     severity: "error",
      //     detail: "I7",
      //   });
      // }
    }
  }
}
