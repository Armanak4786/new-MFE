import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, Mode } from "auro-ui";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { ToasterService, ValidationService } from "auro-ui";

@Component({
  selector: "app-afv-details",
  templateUrl: "./afv-details.component.html",
  styleUrl: "./afv-details.component.scss",
})
export class AfvDetailsComponent extends BaseStandardQuoteClass {
  physicalAsset :any;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);

    const config = this.validationSvc.validationConfigSubject.getValue();
    const filteredValidations = this.validationSvc?.filterValidation(
    config,this.modelName,this.pageCode);
    this.formConfig = { ...this.formConfig, fields: filteredValidations };
    console.log('AFV Details field:', filteredValidations);

  }
// Do not remove below commented code - kept for reference
  // override formConfig: GenericFormConfig = {
  //   cardType: "non-border",
  //   autoResponsive: true,
  //   api: "afvDetails",
  //   goBackRoute: "afvDetails",
  //   cardBgColor: "--primary-lighter-color",
  //   fields: [
  //     {
  //       type: "label-only",
  //       typeOfLabel: "inline",
  //       label: "Make",
  //       name: "makeLabel",
  //       cols: 4,
  //       className: "my-auto",
  //     },
  //     {
  //       type: "text",
  //       placeholder: "Select",
  //       name: "afvMake",
  //       // options: [{ label: "Mazda", value: "Mazda" }],
  //       cols: 5,
  //       mode: Mode.view
  //     },
  //     {
  //       type: "label-only",
  //       typeOfLabel: "inline",
  //       label: "Model",
  //       name: "afvModelLabel",
  //       cols: 4,
  //       className: "my-auto",
  //     },
  //     {
  //       type: "text",
  //       // placeholder: "Select",
  //       name: "afvModel",
  //       // options: [{ label: "Mazda 3", value: "Mazda3" }],
  //       cols: 5,
  //       mode: Mode.view
  //     },
  //     {
  //       type: "label-only",
  //       typeOfLabel: "inline",
  //       label: "Variant",
  //       name: "afvVariantLabel",
  //       cols: 4,
  //       className: "my-auto",
  //     },
  //     {
  //       type: "text",
  //       placeholder: "Select",
  //       name: "afvVariant",
  //       // options: [
  //       //   {
  //       //     label: "Mazda CX-8 GSX DSL 2.2DT/4WD",
  //       //     value: "Mazda CX-8 GSX DSL 2.2DT/4WD",
  //       //   },
  //       // ],
  //       cols: 5,
  //       mode: Mode.view
  //     },
  //     {
  //       type: "label-only",
  //       typeOfLabel: "inline",
  //       label: "Year",
  //       name: "afvYearLabel",
  //       cols: 4,
  //       className: "my-auto",
  //     },
  //     {
  //       type: "text",
  //       name: "afvYear",
  //       cols: 5,
  //       // options: [
  //       //   { label: 2025, value: 2025 },
  //       //   { label: 2024, value: 2024 },
  //       //   { label: 2023, value: 2023 },
  //       //   { label: 2022, value: 2022 },
  //       //   { label: 2021, value: 2021 },
  //       //   { label: 2020, value: 2020 },
  //       //   { label: 2019, value: 2019 },
  //       //   { label: 2018, value: 2018 },
  //       //   { label: 2017, value: 2017 },
  //       //   { label: 2016, value: 2016 },
  //       //   { label: 2015, value: 2015 },
  //       //   { label: 2014, value: 2014 },
  //       //   { label: 2013, value: 2013 },
  //       //   { label: 2012, value: 2012 },
  //       //   { label: 2011, value: 2011 },
  //       //   { label: 2010, value: 2010 },
  //       //   { label: 2009, value: 2009 },
  //       //   { label: 2008, value: 2008 },
  //       //   { label: 2007, value: 2007 },
  //       //   { label: 2006, value: 2006 },
  //       //   { label: 2005, value: 2005 },
  //       //   { label: 2004, value: 2004 },
  //       //   { label: 2003, value: 2003 },
  //       //   { label: 2002, value: 2002 },
  //       //   { label: 2001, value: 2001 },
  //       //   { label: 2000, value: 2000 },
  //       //   { label: 1999, value: 1999 },
  //       //   { label: 1998, value: 1998 },
  //       //   { label: 1997, value: 1997 },
  //       //   { label: 1996, value: 1996 },
  //       //   { label: 1995, value: 1995 },
  //       //   { label: 1994, value: 1994 },
  //       //   { label: 1993, value: 1993 },
  //       //   { label: 1992, value: 1992 },
  //       //   { label: 1991, value: 1991 },
  //       //   { label: 1990, value: 1990 },
  //       // ],
  //       className: "my-auto",
  //       mode: Mode.view
  //     },
  //     {
  //       type: "label-only",
  //       typeOfLabel: "inline",
  //       label: "Provider",
  //       name: "afvProviderLabel",
  //       cols: 4,
  //       className: "my-auto",
  //     },
  //     {
  //       type: "text",
  //       placeholder: "Select",
  //       name: "afvProvider",
  //       // options: [{ label: "UDC Finance Ltd.", value: "UDC Finance Ltd." }],
  //       cols: 5,
  //     },
  //   ],
  // };

  override formConfig: any = {
    cardType: "non-border",
    autoResponsive: true,
    api: "afvDetails",
    goBackRoute: "afvDetails",
    cardBgColor: "--primary-lighter-color",
    fields: [],
  };

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    // if (this.baseFormData?.productCode == 'AFV' || this.baseFormData?.productCode == 'OL') {
    //   this.showCard = true;
    //   if (this.baseFormData?.productCode == 'AFV') {
    //     this.headerText = 'AFV Details';
    //   } else if (this.baseFormData?.productCode == 'OL') {
    //     this.headerText = 'Details';
    //   }
    // } else {
    //   this.showCard = false;
    // }
   // console.log(this.baseFormData);
    
    this.physicalAsset = this.baseFormData?.physicalAsset[0];
    //console.log(this.physicalAsset);
          if(this?.physicalAsset){
      const mapping = {
        afvMake: "make",
        afvModel: "model",
        afvVariant: "variant",
        afvYear: "year",
        // afvProvider: "supplierName"
      };
      const formValues: any = {};
      Object.keys(mapping).forEach(key => {
        formValues[key] = this.physicalAsset[mapping[key]];
      });
     // console.log(formValues)
      this.baseSvc.setBaseDealerFormData({...formValues})
      // this.mainForm?.form.patchValue(formValues);
     // console.log(this.baseFormData);
      
}
      }

  override async onSuccess(data: any) {}
  showCard: boolean = false;
  headerText: string = "AFV Details";

  override onFormDataUpdate(res: any): void {
    // if (res?.productId) {
    //   if (res?.productId === 19 || res?.productId === 15) {
    //     this.showCard = true;
    //     if (res?.productId === 19) {
    //       this.headerText = 'AFV Details';
    //     } else if (res?.productId === 15) {
    //       this.headerText = 'Details';
    //     }
    //   } else {
    //     this.showCard = false;
    //   }
    // }
  }

  pageCode: string = "StandardQuoteComponent";
  modelName: string = "AfvDetailsComponent";

  override async onFormReady(): Promise<void> {
  //  await this.updateValidation("onInit");
     // console.log(this.mainForm)
      // this.mainForm?.form.patchValue(this?.physicalAsset)


    super.onFormReady();

  }

  
  override async onBlurEvent(event): Promise<void> {
    //await this.updateValidation(event);
  }

  override async onValueEvent(event): Promise<void> {
   // await this.updateValidation(event);
  }
  override onFormEvent(event: any): void {
    super.onFormEvent(event)
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
