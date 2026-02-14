import { ChangeDetectorRef, Component } from "@angular/core";
import {
  BaseFormClass,
  CommonService,
  DataService,
  GenericFormConfig,
  ToasterService,
} from "auro-ui";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AssetTradeSummaryService } from "../asset-insurance-summary/asset-trade.service";
import { HttpParams } from "@angular/common/http";
import { PhysicalAsset } from "../../models/assetsTrade";
import { map } from "rxjs";
import { ValidationService } from "auro-ui";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";

@Component({
  selector: "app-dealer-inventory-tab",
  template: `
   <div class= "dealer-inventory-tab">
      <base-form
        #mainForm
        [formConfig]="formConfig"
        [mode]="mode"
        [id]="id"
        [data]="data"
        (valueChanges)="onChildValueChanges($event)"
        (formEvent)="onFormEvent($event)"
        (formButtonEvent)="onButtonClick($event)"
        (formReady)="onFormReady()"
      >
      </base-form>
    </div>
  `,
})
export class DealerInventoryTabComponent extends BaseStandardQuoteClass {
  assetData: any = {};

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    private toasterService: ToasterService,
    public ref: DynamicDialogRef,
    public assetTradeSvc: AssetTradeSummaryService,
    public dataSvc: DataService,
    public toasterSvc: ToasterService,
    public config: DynamicDialogConfig,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef,
    public override baseSvc: StandardQuoteService
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
        type: "text",
        label: "Asset Id",
        name: "assetId",
        cols: 3,
        maxLength: 10,
        // //validators: [validators.pattern('^[0-9]{1,4}$')],
      },
      {
        type: "text",
        label: "Year",
        name: "Year",
        cols: 3,
        //validators: [validators.pattern("^[0-9]{1,4}$")],
        //min: 1990,
        //max: 2024,
      },
      {
        type: "text",
        label: "Make",
        name: "make",
        cols: 3,
       // maxLength: 10,
      },
      {
        type: "text",
        label: "Model",
        name: "model",
        cols: 3,
        maxLength: 10,
      },
      {
        type: "text",
        label: "Variant",
        name: "variant",
        cols: 3,
        maxLength: 10,
      },
      {

        type: "text",
        label: "Rego No",
        name: "registrationNo",
        //regexPattern: "[^a-zA-Z0-9]*",
        cols: 3,
      },
      {
        type: "text",
        label: "VIN",
        name: "vinNo",
        cols: 3,
       // maxLength: 10,
      },
      {
        type: "text",
        label: "Serial / Chassis No",
        name: "SerialChassisNo",
        cols: 3,
       // maxLength: 10,
      },
      {
        type: "button",
        label: "Search",
        name: "searchDealerBtn",
        cols: 2,
        className: "col-offset-4 mt-3",
        submitType: "submit",
      },
      {
        type: "button",
        label: "Reset",
        name: "resetBtn",
        btnType: "border-btn",
        cols: 2,
        className: "mt-3",
        submitType: "internal",
        nextLine: true,

      },
    ],

  };

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();

    this.baseSvc
      .getBaseDealerFormData()
      .subscribe((res) => {
        this.baseFormData = res;

      });
    // if(this.baseFormData?.delerInventoryData){
    //   console.log('baseform',this.baseFormData?.delerInventoryData?.vinNo);
    //   this.mainForm.get("vinNo").patchValue(this.baseFormData?.delerInventoryData?.vinNo); 
    // }
    // this.mainForm?.get('vinNo')?.patchValue('hjghjgj')
    if (!this.config?.data?.bindData) {
      this.mainForm?.form?.reset();
      this.baseSvc?.setBaseDealerFormData(this.mainForm?.form?.value);

    }

  }

  override async onFormEvent(event: any): Promise<void> {
    super.onFormEvent(event);
    await this.updateValidation("onInit");
  }

  override async onSuccess(data: any) { }

  override onChildValueChanges(event: any): void {
    this.assetData = { ...event };
  }
  override onButtonClick(event: any): void {

    if (event?.field?.name === 'searchDealerBtn') {
      this.baseSvc.isAssetSubmit = false;
      const status = this.proceed();

      if (status === 'VALID') {
        this.callApi(); // always call if valid and any field is filled
      }
    }

    if (event.field.name == "resetBtn") {
      this.mainForm.form.reset();
    }
  }

  // async callApi() {
  //     // console.log("call api called", this.assetTradeSvc.assetSearchResult);
  //     let isDataEmpty = true;
  //     let formData = this.mainForm.form.value;
  //     let params = new HttpParams();

  //     for (const key in formData) {
  //       if (formData[key]) {
  //         isDataEmpty = false;
  //         params = params.set(key, formData[key]);
  //       }
  //     }

  //     if (!isDataEmpty) {
  //       let res = await this.dataSvc
  //         .get(`AssetType/search_physicalasset`, params)
  //         .pipe(
  //           map((res) => {
  //             return res;
  //           })
  //         )
  //         .toPromise();
  //         debugger
  //         console.log("svc data", this.svc.data);
  //         this.assetTradeSvc.assetSearchResult = [];
  //       if (res.data != 'Record Not Found') {
  //         let data = res.data || res.items;
  //         let mappedData = [];
  //         data.forEach((ele, index) => {
  //           let asset: PhysicalAsset;
  //           asset = {
  //             id: ele?.assetId,
  //             assetId: String(ele?.assetId),
  //             assetName: ele?.assetType?.assetTypeName,
  //             assetType:{
  //               assetTypeId:ele.assetType?.assetTypeId,
  //               assetTypeName:ele.assetType?.assetTypeName,
  //               assetTypePath:ele.assetType?.assetTypePath,
  //             },
  //             make: ele?.make,
  //             model: ele?.model,
  //             year: ele.year,
  //             conditionOfGood: ele?.condition,
  //             variant: 'text',
  //             regoNumber: ele?.registrationNo,
  //             vin: ele?.vinNo,
  //             serialChassisNumber: ele?.chassisNo,
  //             costOfAsset: 0,
  //             ccRating: ele?.ccRating,
  //             engineNumber: ele?.engineNo,
  //             chassisNumber: ele?.chassisNo,
  //             vehicle: "",
  //             colour: ele?.colour,
  //             motivePower: ele?.motivePower,
  //             countryFirstRegistered: ele?.countryFirstRegistered || 'text', 
  //             //condition: ele?.condition, 
  //             assetLocationOfUse:'text',
  //             supplierName: ele?.supplierName || 'test',
  //             odometer:ele?.odometer,
  // 	          features : ele?.features,
  //             description :ele?.description,
  //             // sumInsured: ele?.sumInsured
  //           };
  //           mappedData.push(asset);
  //         });
  //         console.log("mapped data", mappedData);
  //         this.assetTradeSvc.assetSearchResult = mappedData;
  //         this.svc.router.navigateByUrl(
  //           "/dealer/standard-quote/asset-search-result"
  //         );
  //         this.ref.close({
  //           action: "closeAssetInsuranceSummaryTable",
  //         });
  //        } 
  //       else {
  //         // this.toasterService.showToaster({
  //         //   severity: "info",
  //         //   detail: "Data cannot be found for searched values.",
  //         // });
  //         this.assetTradeSvc.assetSearchResult = [];
  //         this.svc.router.navigateByUrl(
  //           "/dealer/standard-quote/asset-search-result"
  //         );
  //         this.ref.close({
  //           action: "closeAssetInsuranceSummaryTable",
  //         });
  //       }
  //     }else{
  //       this.toasterSvc.showToaster({
  //         severity: "error",
  //         detail: "Please complete at least one selection",
  //       });
  //     }
  //   }

  async callApi() {
    let isDataEmpty = true;
    let formData = this.mainForm.form.value;

     if(this.mainForm.form.value?.assetId ||
        this.mainForm.form.value?.Year ||
        this.mainForm.form.value?.make ||
        this.mainForm.form.value?.model ||
        this.mainForm.form.value?.variant ||
        this.mainForm.form.value?.registrationNo ||
        this.mainForm.form.value?.vinNo ||
        this.mainForm.form.value?.SerialChassisNo){
       isDataEmpty = false;
     }


    let body = {
      // assetId: Number(formData?.assetId) || null,
      assetId: formData?.assetId || null,
      dealerId: this.baseFormData?.originatorNumber || null,
      year: Number(formData?.Year) || null,
      make: formData?.make|| null,
      model: formData?.model || null,
      assetClass: null,
      variant: formData?.variant || null,
      registrationNo: formData?.registrationNo || null,
      vinNo: formData?.vinNo || null,
      serialChassisNo: formData?.SerialChassisNo || null,
    }
    
    if (!isDataEmpty) {
      if (this.baseFormData?.originatorName) {
        let res = await this.dataSvc
          .post(`AssetType/search_asset`, body)
          .pipe(
            map((res) => {
              return res;
            })
          )
          .toPromise();

        // this.assetTradeSvc.assetSearchResult = [];
        if (res.data) {
          let data = res.data || res.items;
          let mappedData = [];
          data.forEach((ele, index) => {
            let asset: PhysicalAsset;
            asset = {
              id: ele?.assetId,
              assetId: ele?.assetId ? String(ele.assetId) : "",
              regoNumber: ele?.regoNumber,
              make: ele?.make,
              model: ele?.model,
              variant: ele?.variant,
              year: ele?.year,
              vin: ele?.vin,
              chassisNumber: ele?.serialChassisNumber,
            };
            mappedData.push(asset);
          });
          console.log("mapped data", mappedData);
          this.assetTradeSvc.searchAssetData = data;
          this.assetTradeSvc.assetSearchResult = mappedData;
          this.svc.router.navigateByUrl(
            "/dealer/standard-quote/asset-search-result"
          );
          this.ref.close({
            action: "closeAssetInsuranceSummaryTable",
          });
        }
        else {
          // this.toasterService.showToaster({
          //   severity: "info",
          //   detail: "Data cannot be found for searched values.",
          // });
          this.assetTradeSvc.assetSearchResult = [];
          this.assetTradeSvc.searchAssetData = [];
          this.svc.router.navigateByUrl(
            "/dealer/standard-quote/asset-search-result"
          );
          this.ref.close({
            action: "closeAssetInsuranceSummaryTable",
          });
        }
      }
      else {
        this.toasterSvc.showToaster({
          severity: "error",
          detail: "Please select the originator name first",
        });
      }
    } else {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: "Please complete at least one selection",
      });
    }
  }
  override onValueChanges(event: any): void { }

  pageCode: string = "SearchAssetComponent";
  modelName: string = "DealerInventoryTabComponent";

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
      if (!result?.status) {
        // this.toasterSvc.showToaster({
        //   severity: "error",
        //   detail: "I7",
        // });
      }
    }
  }
}
