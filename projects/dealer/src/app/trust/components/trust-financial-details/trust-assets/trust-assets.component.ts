import { ChangeDetectorRef, Component } from '@angular/core';
import { BaseTrustClass } from '../../../base-trust.class';
import { ActivatedRoute } from '@angular/router';
import { CommonService, GenericFormConfig, ValidationService } from 'auro-ui';
import { TrustService } from '../../../services/trust.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';


@Component({
  selector: 'app-trust-assets',
  templateUrl: './trust-assets.component.html',
  styleUrl: './trust-assets.component.scss',
})
export class TrustAssetsComponent extends BaseTrustClass {


  assetsArray: any[] = [];
  assetDetailsForm: FormGroup;
  totalAsset: any;
  own: any;
  asssetTypeOptions: any;
  // private assetDescriptionMap = new Map<number, string>();
  // private HomeOwnershipMap = new Map<number, string>();
  private assetDescriptionMapId = new Map<number, string>();
  private additionalAssets: any[] = [];


  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: TrustService,
    private fb: FormBuilder,
     public validationSvc: ValidationService,
    private cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);


    this.assetDetailsForm = this.fb.group({
      assetDetails: this.fb.array([]), // Initialize form array
      financialAssetType: [''], // Temporary field for adding new label
      financialAssetTypeAmount: ['', [Validators.max(999999999999999999.9999)]], // Temporary field for adding new amount with validation
      assestHomeOwnerType: [''],
      financialPositionAssetId: [0],

    });


  }

  // Custom validator for 18,4 format
  private amountValidator = (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return null; // Don't validate empty values
    }
    
    const value = control.value.toString();
    const [integerPart, decimalPart] = value.split('.');
    
    // Check if integer part exceeds 14 digits (for safety)
    if (integerPart && integerPart.length > 14) {
      return { max: true };
    }
    
    // Check if decimal part exceeds 4 digits
    if (decimalPart && decimalPart.length > 4) {
      return { max: true };
    }
    
    // Check if total value exceeds the maximum
    if (parseFloat(value) > 999999999999999999.9999) {
      return { max: true };
    }
    
    return null;
  };


  override async ngOnInit(): Promise<void> {
    this.customForm = { form: this.assetDetailsForm };


    await super.ngOnInit();


   // console.log("IndividualAssetDetailsComponent", this.baseFormData)


    // const [HomeOwnershipRes, AssetOptionRes] = await Promise.all([
    //   this.getLookUpRes('UdcHomeOwnership'),
    //   this.getLookUpRes('UdcAssetDescription')
    // ]);
    const [ AssetOptionRes] = await Promise.all([
      this.baseFormData.UdcAssetDescription
    ]);
    //let HomeOwnershipRes = await this.getLookUpRes('UdcHomeOwnership');
    // this.own = HomeOwnershipRes.map((item) => ({
    //   label: item.lookupValue,
    //   value: item.lookupId,
    // }));


    //let AssetOptionRes = await this.getLookUpRes('UdcAssetDescription');
    this.asssetTypeOptions = AssetOptionRes.map((item) => ({
      label: item.lookupValue,
      value: item.lookupId,
    }));


    AssetOptionRes.forEach(item => {
      this.assetDescriptionMapId.set(item.lookupId, item.lookupValue);
    });


    let assetsLoaded = false;


    if (this.baseFormData?.financialPositionBase) {
      const getAssetfromAPI = [
        { assestType: 'Personal Property', amount: this.baseFormData?.financialPositionBase?.amtHomeValue},
        { assestType: 'Vehicle Value', amount: this.baseFormData?.financialPositionBase?.amtVehicleValue },
        { assestType: 'Furniture & Effects Value', amount: this.baseFormData?.financialPositionBase?.amtFurnitureValue },
      ];
      getAssetfromAPI.forEach((asset) => this.addAssetToForm(asset));


      // console.log('IndividualBaseformTest:>>>', this.baseFormData);
      


      if(this.assetDetails.length === 3){
      this.baseFormData?.financialPositionAsset.forEach((asset: any) => {
        const assetType = asset.assetDescription
        this.addAssetToForm({
          assestType: assetType,
          amount: asset.amtAssetValue || 0,
          financialPositionAssetId: asset.financialPositionAssetId || 0,
        });
      });
    }


      const homeOwnershipTypeNumber = this.baseFormData?.financialPositionBase?.homeOwnership;
    //  console.log('homeOwnershipTypeNumber', homeOwnershipTypeNumber);
      


      this.assetDetails.at(0).get('assestHomeOwnerType')?.patchValue(homeOwnershipTypeNumber);
      //this.assetDetailsForm.get('assestHomeOwnerType')?.patchValue(test);
      this.cdr.detectChanges();


      assetsLoaded = true;
    }


    if (!assetsLoaded) {
      const initialAssets = [
        { assestType: 'Personal Property',assestHomeOwnerType: this.baseFormData.assestHomeOwnerType, amount: this.baseFormData.financialAssetDetails?.[0]?.amount || 0 },
        { assestType: 'Vehicle Value', amount: this.baseFormData.financialAssetDetails?.[1]?.amount || 0 },
        { assestType: 'Furniture & Effects Value', amount: this.baseFormData.financialAssetDetails?.[2]?.amount || 0 },
      ];
      initialAssets.forEach((asset) => this.addAssetToForm(asset));


      
      if(this.baseFormData.financialPositionAsset){
      this.baseFormData?.financialPositionAsset.forEach((asset: any) => {
        const assetType = asset.assetDescription
        this.addAssetToForm({
          assestType: assetType,
          amount: asset.amtAssetValue || 0,
          financialPositionAssetId: asset.financialPositionAssetId || 0,
        });
      });
    }


    }



    this.assetDetails.valueChanges.subscribe((data) => {
     // console.log("valuechanges: ",data)
      this.baseSvc.setBaseDealerFormData({
          financialAssetDetails: data,
        });
      this.assetsArray = data; // Sync assetsArray with form changes
    });
  }


  getLookUpRes(LookupSetName: string): Promise<any> {
    return this.baseSvc.getFormData(
      `LookUpServices/custom_lookups?LookupSetName=${LookupSetName}`,
      function (res) {
        return res?.data;
      }
    );
  }


    // Getter for the assetDetails form array
    get assetDetails(): FormArray {
      return this.assetDetailsForm.get('assetDetails') as FormArray;
    }


    private addAssetToForm(asset: {
      assestType: string;
      amount: number;
      assestHomeOwnerType?: string;
      financialPositionAssetId?: number;
    }) {
      const isFirstAsset = this.assetDetails.length === 0;
      const homeOwnerType = isFirstAsset && this.baseFormData?.financialPositionBase?.homeOwnership 
        ? this.baseFormData.financialPositionBase.homeOwnership
        : asset.assestHomeOwnerType || '';
    
      const assetGroup = this.fb.group({
        assestType: [asset.assestType],                                //Subhashish
        // amount: [asset.amount, [Validators.required, Validators.min(1)]],
        amount: [asset.amount, 
          [Validators.max(999999999999999999.9999)], // 18,4 validation
        ],
        //assestHomeOwnerType: [homeOwnerType, isFirstAsset ? [Validators.required] : []],
        assestHomeOwnerType: [asset.assestHomeOwnerType],
        financialPositionAssetId: [asset.financialPositionAssetId || 0],
      });
    
      this.assetDetails.push(assetGroup);
      this.updateFormData();
    }


    addRow(): void {
      const financialAssetType =
        this.assetDetailsForm.get('financialAssetType')?.value;
      const financialAssetTypeAmount = this.assetDetailsForm.get(
        'financialAssetTypeAmount'
      )?.value;
      const assestHomeOwnerType = this.assetDetailsForm.get(
        'assestHomeOwnerType'
      )?.value;

      // Check if the amount field is valid before proceeding
      const amountControl = this.assetDetailsForm.get('financialAssetTypeAmount');
      if (amountControl?.invalid) {
        // Mark the field as touched to show validation errors
        amountControl.markAsTouched();
        return;
      }
  
      if (financialAssetType && financialAssetTypeAmount !== null) {
        const newAsset = {
          assestType: financialAssetType,
          amount: financialAssetTypeAmount,
          assestHomeOwnerType: assestHomeOwnerType || '',
        };
  
        const additionalAsset = {
            financialPositionAssetId: 0,
            financialPositionBaseId: 0,
            assetDescription: financialAssetType,
            amtAssetValue: financialAssetTypeAmount || 0,
            //operationType: null
        }
  
        this.additionalAssets.push(additionalAsset);
  
      //   if(this.baseFormData.financialPositionAsset && this.mode === "edit"){
      //     this.baseFormData.financialPositionAsset = [...this.baseFormData.financialPositionAsset, ...this.additionalAssets];
      //   }
      //   else{
      //   this.baseSvc.setBaseDealerFormData({
      //     financialPositionAsset : [...this.additionalAssets]
      //   });
      // }
  
      const existingAssets = this.baseFormData?.financialPositionAsset || [];
        const isDuplicate = existingAssets.some(
          (inc) =>
            inc.assetDescription === additionalAsset.assetDescription &&
            inc.amtAssetValue === additionalAsset.amtAssetValue
            // inc.additionalIncomeFrequency === additionalAsset.additionalIncomeFrequency
        );
  
        if (!isDuplicate) {
          const updatedIncomeList = [...existingAssets, additionalAsset];
          this.baseSvc.setBaseDealerFormData({
            financialPositionAsset: updatedIncomeList
          });
        }
  
        // console.log('AssetBaseFormData: ', this.baseFormData);
        this.addAssetToForm(newAsset);
        // console.log('assetType:', financialAssetType);
  
        // console.log("assetDescriptionMapId: " , this.assetDescriptionMapId.get(financialAssetType));
  
        this.assetDetailsForm.get('financialAssetType')?.reset();
        this.assetDetailsForm.get('financialAssetTypeAmount')?.reset();
        this.assetDetailsForm.get('assestHomeOwnerType')?.reset();
  
        this.updateFormData();
      }
    }


    deleteRow(index: number): void {
      if (this.assetDetails.length > 0) {
        
        const assetType = this.assetDetails.at(index).get('assestType')?.value;
     //   console.log('assetTypeValue==>>>', assetType);
        const financialPositionId = this.assetDetails.at(index).get('financialPositionAssetId')?.value;
      //  console.log('financialPositionId==>>>', financialPositionId);
  
         if(financialPositionId > 0){
          this.svc.data
             .delete(
               `CustomerDetails/delete_customerFinancialPosition?FinancialPositionAssetId=${financialPositionId}`,
             )
             .subscribe((res) => { });
           }
        
        this.assetDetails.removeAt(index);
  
  
      let newAssetDetails : any[] = []
  
      this.assetDetails.value.forEach((item, index) => {
        if(index > 2){
        const additionalAsset = {
              financialPositionAssetId: item.financialPositionAssetId,
              // financialPositionBaseId: 0,
              assetDescription: item.assestType,
              amtAssetValue: item.amount || 0,
              //operationType: null
          }
  
          newAssetDetails.push(additionalAsset)
        }
      })
    
  
     // console.log(this.baseFormData.financialPositionAsset, this.assetDetails.value)
        this.baseSvc.setBaseDealerFormData({
          financialPositionAsset: newAssetDetails,
        });
  
      //  console.log("financialPositionAsset:",this.baseFormData.financialPositionAsset)
        //this.updateFormData();
  
      }
    }


    updateAssetDetails(index: number): void {
      const assetGroup = this.assetDetails.at(index);
      if (assetGroup) {
        // const updatedAsset = {
        //   assestType: assetGroup.get('assestType')?.value,
        //   amount: assetGroup.get('amount')?.value,
        //   assestHomeOwnerType: assetGroup.get('assestHomeOwnerType')?.value,
        // };
  
        // this.baseSvc.setBaseDealerFormData({
        //   financialAssetDetails: this.assetDetails.value,
        // });
        // console.log('assetGroup.value', assetGroup);

        const amountControl = assetGroup.get('amount');
        const currentValue = amountControl?.value;
      
        // Convert negative values to 0
        if (currentValue !== null && currentValue < 0) {
          amountControl?.setValue(0);
          return; // Exit early since the value change will trigger another update
        }
  
        const updatedAmount = assetGroup.value.amount;
  
      //  console.log('updatedAmount: ', updatedAmount);
  
        if(this.baseFormData.financialPositionAsset){
        
        let updatedAsset = this.baseFormData?.financialPositionAsset;
  
        updatedAsset.forEach((asset: any) => {
          if (asset.financialPositionAssetId === assetGroup.get('financialPositionAssetId')?.value) {
            asset.amtAssetValue = updatedAmount;
            // asset.assetDescription = this.assetDescriptionMapId.get(assetGroup.get('assestType')?.value);
          }
        });
      //  console.log('updatedAsset: ', updatedAsset);
      }
  
  
        // console.log('assetGroup.value', assetGroup.value);
        // console.log("assetGroup.get('assestHomeOwnerType')?.value", assetGroup.get('assestHomeOwnerType')?.value);
        // console.log('this.assetDetails.value', this.assetDetails.value);
  
        this.updateFormData();
        this.calculateTotalIncome();
      }
    }


    // calculateTotalIncome(): void {
    //   this.totalAsset = this.assetDetails.value.reduce(
    //     (acc: number, asset: any) => acc + (asset.amount || 0),
    //     0
    //   );
  
    //   this.baseSvc.setBaseDealerFormData({
    //     totalAsset: this.totalAsset,
    //   });
    // }

    calculateTotalIncome(): void {
      // Check if any amount exceeds 18 digits
      const hasInvalidAmount = this.assetDetails.value.some((asset: any) => {
        if (asset.amount === null || asset.amount === undefined) return false;
        const amountStr = asset.amount.toString().replace('.', '');
        return amountStr.length > 18;
      });

      if (hasInvalidAmount) {
        this.totalAsset = Infinity;
      } else {
        this.totalAsset = this.assetDetails.value.reduce(
          (acc: number, asset: any) => acc + (asset.amount || 0),
          0
        );
      }

      this.baseSvc.setBaseDealerFormData({
        totalAsset: this.totalAsset,
      });
    }


    private updateFormData(): void {
      const formData = {
        financialAssetDetails: this.assetDetails.value,
        financialAssetType: this.assetDetailsForm.get('financialAssetType')?.value,
        financialAssetTypeAmount: this.assetDetailsForm.get('financialAssetTypeAmount')?.value,
        assestHomeOwnerType: this.assetDetails.at(0)?.get('assestHomeOwnerType')?.value || '',
        totalAsset: this.totalAsset
      };
      this.calculateTotalIncome();
      this.baseSvc.setBaseDealerFormData(formData);
  
     // console.log('Saving form data: >> ', formData);
    }


    override onStepChange(stepperDetails: any): void {


      if (stepperDetails?.validate) {
        let formStatus;
  
        if (this.assetDetailsForm) {
          //this.updateFormData();
          // formStatus = this.svc.proceedForm(this.assetDetailsForm);
          formStatus = this.assetDetailsForm.status
       //   console.log(formStatus, this)
          this.trustSvc?.formStatusArr?.push(formStatus);
        }
      }
      super.onStepChange(stepperDetails);
      this.trustSvc.updateComponentStatus("Finance Accounts", "TrustAssetsComponent", this.assetDetails.valid)
    }



  // override formConfig: GenericFormConfig = {
  //   headerTitle: '',
  //   autoResponsive: true,
  //   cardType: 'non-border',
  //   api: '',
  //   goBackRoute: '',
  //   fields: [
  //     {
  //       type: 'label-only',
  //       typeOfLabel: 'inline',
  //       label: 'Asset Type*',
  //       name: 'trustAssetTypeLabel',
  //       cols: 4,
  //       className: '',
  //     },
  //     {
  //       type: 'label-only',
  //       typeOfLabel: 'inline',
  //       label: 'Amount',
  //       name: 'trustAssetAmountLabel',
  //       cols: 3,
  //       className: 'col-offset-3',
  //       nextLine: true,
  //     },
  //     {
  //       type: 'amount',
  //       inputType: 'horizontal',
  //       label: 'Personal Property',
  //       // name: 'personalProperty',
  //       name: 'amtHomeValue',
  //       cols: 12,
  //       labelClass: 'col-7',
  //       inputClass: ' col-3 ',
  //       default: 0,
  //     },


  //     {
  //       type: 'amount',
  //       inputType: 'horizontal',
  //       // name: 'vehicleValue',
  //       name: 'amtVehicleValue',
  //       label: 'Vehicle Value',
  //       cols: 12,
  //       labelClass: 'col-7',
  //       inputClass: ' col-3 ',
  //       nextLine: true,
  //       default: 0,
  //     },
  //     {
  //       type: 'amount',
  //       inputType: 'horizontal',
  //       // name: 'vehicleValue',
  //       name: 'amtFurnitureValue',
  //       label: 'Furniture & Effects',
  //       cols: 12,
  //       labelClass: 'col-7',
  //       inputClass: ' col-3 ',
  //       nextLine: true,
  //       default: 0,
  //     },


  //     {
  //       type: 'select',
  //       name: 'UdcAssetDescription',
  //       list$: "LookUpServices/custom_lookups?LookupSetName=UdcAssetDescription",
  //       idKey: "lookupCode",
  //       idName: "lookupValue",
  //       cols: 4,
  //     },
  //     {
  //       type: 'amount',
  //       name: 'selectedAssetAmount',
  //       cols: 3,
  //       className: 'col-offset-3',
  //       default: 0,
  //     },
  //   ],
  // };


 override async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
  }


  


  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    
  }


  override async onValueEvent(event): Promise<void> {
    await this.updateValidation(event?.target?.value || event);
  }



  override async onValueTyped(event: any): Promise<void> {
    await this.updateValidation(event?.target?.value || event);
  }



  pageCode: string = "TrustFinancialDetailComponent";
  modelName: string = "TrustAssetComponent";


  async updateValidation(event) {
     const value = event?.target?.value ?? event;
    const req = {
      form: this.mainForm?.form,
      formConfig: this.formConfig,
      event: value,
      modelName: this.modelName,
      pageCode: this.pageCode,
    };


    const responses = await this.validationSvc.updateValidation(req);
    if (!responses.status && responses.updatedFields.length) {
      await this.mainForm.applyValidationUpdates(responses);
    }


    return responses.status;
  }
  
}
