import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonService, ToasterService, ValidationService, GenericFormConfig } from 'auro-ui';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { map } from 'rxjs';
import { BaseStandardQuoteClass } from '../../../base-standard-quote.class';

import { StandardQuoteService } from '../../../services/standard-quote.service';
import { AssetTradeSummaryService } from '../../asset-insurance-summary/asset-trade.service';
import { PhysicalAsset, TradeAsset } from '../../../models/assetsTrade';
import { TranslateService } from '@ngx-translate/core';
import { AddAssetService } from '../../../../asset/services/addAsset.service';

@Component({
  selector: 'motocheck-tab',
  templateUrl: './motocheck-tab.component.html',
  styleUrl: './motocheck-tab.component.scss'
})
export class MotocheckTabComponent  extends BaseStandardQuoteClass{
assetData: any = {};
  param: any;
  searchBy: any;
  @Input() addType: string;
  // mappedData: any={
    
  //       "id": 0,
  //       "assetId": "",
  //       "assetName": "",
  //       "make": "SUBARU",
  //       "model": "LEGACY",
  //       "year": 2008,
  //       "conditionOfGood": "",
  //       "variant": "RS",
  //       "regoNumber": "STOLEN",
  //       "vin": "7A8GF0B0797022619",
  //       "serialChassisNumber": "EJ20-233971",
  //       "costOfAsset": 0,
  //       "ccRating": "1994",
  //       "engineNumber": "EJ20-233971",
  //       "chassisNumber": "EJ20-233971",
  //       "colour": "BLUE",
  //       "motivePower": "Petrol",
  //       "odometer": 301375,
  //       "features": "",
  //       "description": ""
  //   }
mappedData :any = null
  showCard : boolean= false;
  isMotoCheckSuccess : boolean;
  buttonLabel:any=''
  buttonClass:any=''
  assetMappedData :any ={}
  conditionOfGood: string;

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: StandardQuoteService,
    public ref: DynamicDialogRef,
    public assetTradeSvc: AssetTradeSummaryService,
    public toasterService: ToasterService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef,
    private translateSvc : TranslateService,
    private addassetService: AddAssetService
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
        validators: [Validators.required],
        options: [
          { label: "Rego Number", value: "regoNumber" },
          { label: "VIN Number", value: "vinNumber" },
        ],
        className:"pl-0",
        
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

   override async ngOnInit(): Promise<void> {
     await super.ngOnInit();
     this.addassetService.getBaseDealerFormData().subscribe((data) => {
      this.baseSvc.setBaseDealerFormData({
        regoNumber: data?.regoNumber,
      })
     });

    this.mainForm.get("searchAssetSearchBy").patchValue("regoNumber");
    this.mainForm.get("searchAssetEnterNum").patchValue(this.baseFormData?.regoNumber);
   }

  override onValueTyped(event: any): void {
    if (event.name == "searchAssetSearchBy") {
      if (event.data == "regoNumber") {
        this.mainForm.get("searchAssetEnterNum").clearValidators();
        this.mainForm.updateValidators("searchAssetEnterNum", [
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9]{1,6}$")
          // Validators.pattern("^[a-zA-Z0-9/() \-]*$")
        ]);
      } else if (event.data == "vinNumber") {
        this.mainForm.updateValidators("searchAssetEnterNum", [
          Validators.minLength(17),
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9]*$")
        ]);
        // this.mainForm.get('searchAssetEnterNum').addValidators();
      }
    }
      this.showCard=false;
      this.buttonLabel =null;
      this.mappedData =null;
      this.assetMappedData = null;
  }

  override onChildValueChanges(event: any): void {
    this.assetData = { ...event };
  }
  override onFormEvent(event: any): void {}
  override async onButtonClick(event: any): Promise<void> {


    if (event?.field?.name == "searchBtn") {
      const validation = this.checkValidate();
     // console.log(validation)
      headers: {
        ("Encrypt");
        ("true"); // Custom header to trigger encryption
      }
      let request;
      const formValues = this.mainForm.form.value;
      const searchBy = formValues.searchAssetSearchBy;
      const param = formValues.searchAssetEnterNum;
      const programId = this.baseFormData?.programId;
      const errorMsg=this.generateErrorMessage(formValues)
        if(errorMsg){
          this.showCard=true
          this.isMotoCheckSuccess = false;
          this.buttonLabel = errorMsg;
          this.mappedData =null;
          this.assetMappedData = null;       
        }

      request = {
        RegistrationPlate: searchBy === "regoNumber" ? param : null,
        VIN: searchBy === "vinNumber" ? param : null,
        ProgramId: programId.toString()
      };

    //  request= {
    // "RegistrationPlate": null,
    // "VIN":"7A8GF0B0797022619",
    // "ProgramId": "122"
    //   }
      if (param && validation != "INVALID") {
        let res: any = await this.svc.data
          .post("Motocheck/get_motocheck_evaluation", request)
          .pipe(
            map((res) => {
              return res.data || res.items;
            })
          )
          .toPromise();

        if (res) {
          if(res?.isSuccessful){
          let data = res?.responseMessage?.jsoNpayload;

          const year = Number(data?.vehicleDescription?.yearOfManufacture);
          const today = new Date();

          if (year && year.toString().length > 3) {
            if (year === today.getFullYear()) {
              this.conditionOfGood = 'New';
            } else if (year < today.getFullYear()) {
              this.conditionOfGood = 'Used';
            }
          }
          let asset: PhysicalAsset;
         asset = {
          id: 0,
          assetId: res?.responseMessage?.assetId || 0, 
          assetName: res?.responseMessage?.assetName || '',
          make: data?.vehicleDescription?.make || "",
          model: data?.vehicleDescription?.model || "",
          year: Number(data?.vehicleDescription?.yearOfManufacture) || null,         
          conditionOfGood: this.conditionOfGood,
          variant: data?.vehicleDescription?.variant || "",
          regoNumber: data?.vehicleDescription?.plateNumber || "",
          vin: data?.vehicleDescription?.vin || "",
          serialChassisNumber: "",
          costOfAsset: 0,
          ccRating: String(data?.vehicleDescription?.ccRating || 0),
          engineNumber: data?.vehicleDescription?.engineNumber || "",
          chassisNumber: data?.vehicleDescription?.engineNumber || "",
          colour: data?.vehicleDescription?.colour || "",
          motivePower: data?.vehicleDescription?.fuelType || "",
          odometer: Number(data?.vehicleDescription?.odometerReading || null),
          countryFirstRegistered: data?.vehicleDescription?.previousCountryOfRegistration || "", 
          features: '',
          description: ''
            };
          this.mappedData= data ? asset : null ;
          const response = res?.responseMessage;
            this.assetMappedData =
            this.addType === 'Add Asset'
              ? this.mapToPhysicalAsset(data?.vehicleDescription, response)
              : this.mapToTradeAsset(data?.vehicleDescription, response);
        }
      
            // if ((res?.responseMessage?.status === 'INVALID' && this.baseFormData.productCode.includes('AFV')) || (res?.responseMessage?.status === 'INVALID' && res?.responseMessage?.result=='DATA  NOT AVAILABLE')) {
            //   alert(1)
            //   this.buttonLabel = res?.responseMessage?.generalDescription;
            //   this.isMotoCheckSuccess = false;
            // } else {
            //   this.buttonLabel = "Motocheck Successfully Executed";
            //   this.isMotoCheckSuccess = true;
            // }
        if(!this.baseFormData?.productCode.includes('AFV')){
        if(res?.responseMessage?.jsoNpayload){
             this.buttonLabel = this.translateSvc.instant('motocheckSuccessMessage');
              this.isMotoCheckSuccess = true;
        }else{
              this.buttonLabel = this.translateSvc.instant('motocheckErrorMessage');
              this.isMotoCheckSuccess = false;
        }
      }else{
         if ((res?.responseMessage?.status === 'INVALID' && this.baseFormData?.productCode.includes('AFV'))) {
              this.buttonLabel = res?.responseMessage?.generalDescription;
              this.isMotoCheckSuccess = false;
            } else {
              this.buttonLabel = this.translateSvc.instant('motocheckSuccessMessage');
              this.isMotoCheckSuccess = true;
            }
      }

        // this.assetTradeSvc.assetSearchResult = this.mappedData;
        

        this.showCard=true;
      }
        else {
          this.toasterService.showToaster({
            severity: "error",
            detail: "Data cannot be found for searched values.",
          });
          this.showCard=false;

        }

        //call api
        // this.dataSvc.post('assets', this.assetData);
        // this.svc.router.navigateByUrl(
        //   '/standard-quote/asset-search-result'
        // );
        // this.ref.close();
      }
    }

    if (event.field.name == "resetBtn") {
        this.mainForm.form.reset();
         if (this.addType === "Add Trade") {
            this.assetTradeSvc.tradeEditData = {};
          } else {
            this.assetTradeSvc.assetEditData = {};
          }
        this.showCard=false;
        this.baseSvc.isAssetSearch=false ;
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

  addAsset(){
        if (this.addType == "Add Trade") {
              this.assetTradeSvc.tradeEditData = {
            ...this.assetMappedData,
          };
          // this.assetTradeSvc.tradeList ={
          //    ...this.mappedData,
          // }
        }else{
             this.assetTradeSvc.assetEditData = {
            ...this.assetMappedData,
          };
        }
          this.assetTradeSvc.assetSearchSubject.next(this.assetMappedData);
        this.baseSvc.isAssetSearch=true ;

          if (this.addType == "Add Asset") {
          
            this.svc.router.navigateByUrl("asset/addAsset/edit");
           
          } else {
                      this.svc.router.navigateByUrl("dealer/asset/addTrade/edit");
          }

          this.ref.close({
            action: "closeAssetInsuranceSummaryTable",
          });
  }

  private mapToPhysicalAsset(data: any, response: any): PhysicalAsset {
    
  return {
    id: 0,
    assetId: response?.assetId || 0,
    assetName: response?.assetName || '',
    make: data?.make || '',
    model: data?.model || '',
    year: Number(data?.yearOfManufacture) || null,
    conditionOfGood: this.conditionOfGood,
    variant: data?.variant || '',
    regoNumber: data?.plateNumber || '',
    vin: data?.vin || '',
    serialChassisNumber: '',
    costOfAsset: 0,
    ccRating: String(Number(data?.ccRating || 0)),
    engineNumber: data?.engineNumber || '',
    chassisNumber: data?.engineNumber || '',
    colour: data?.colour || '',
    motivePower: data?.fuelType || '',
    odometer: Number(data?.odometerReading || null),
     countryFirstRegistered: data?.previousCountryOfRegistration || '',
    features: '',
    description: ''
  };
}

private mapToTradeAsset(data: any, response: any): TradeAsset {
  return {
    id: 0,
    tradeId: response?.assetId || 0,
    tradeName: response?.assetName || '',
    tradeMake: data?.make || '',
    tradeModel: data?.model || '',
    tradeYear: data?.yearOfManufacture || null,
    conditionOfGood: this.conditionOfGood,
    tradeVariant: data?.variant || '',
    tradeRegoNo: data?.plateNumber || '',
    tradeVinNo: data?.vin || '',
    tradeSerialOrChassisNo: '',
    tradeAssetValue: this.baseFormData?.tradeInAssetRequest.length == 0 ? this.baseFormData?.tradeAmountPrice : 0,
    tradeCCNo: String(Number(data?.ccRating)|| 0),
    tradeEngineNo: data?.engineNumber || '',
    tradeColour: data?.colour || '',
    tradeMotivePower: data?.fuelType || '',
    tradeOdometer: data?.odometerReading || null,
  };
}

  generateErrorMessage(formValues):string{
     var finalStr = '';
     var isError = 0;
      const searchBy = formValues.searchAssetSearchBy;
      const param = formValues.searchAssetEnterNum;
      const control = this.mainForm.form.get('searchAssetEnterNum');
      if(isError == 0 && searchBy ==='regoNumber' && !param){
        isError =1;
       finalStr= this.translateSvc.instant('regoNumber_error');       
        }
        
      if(isError == 0 && searchBy ==='vinNumber' && !param){
          isError =1;
          finalStr = this.translateSvc.instant('vinNumber_error');   
        }

       if(param){
        if(isError == 0 && searchBy ==='vinNumber' && control?.errors?.['minlength']){
            isError =1;
              finalStr = this.translateSvc.instant('vinNumberInvalidFormat_error')
        }
        if(isError == 0 && searchBy ==='vinNumber' && control?.errors?.['pattern']){
            isError =1;
              finalStr = this.translateSvc.instant('vinNumberInvalidFormat_error')
        }
        if(isError == 0 && searchBy ==='regoNumber' && control?.errors?.['pattern']){
            isError =1;
              finalStr = this.translateSvc.instant('regoNumberInvalidFormat_error')
        }

       } 
        return finalStr;
  }

}
