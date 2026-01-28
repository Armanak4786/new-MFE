import { ChangeDetectorRef, Component } from '@angular/core';
import { BaseIndividualClass } from '../../../base-individual.class';
import { ActivatedRoute } from '@angular/router';
import { CommonService, GenericFormConfig } from 'auro-ui';
import { IndividualService } from '../../../services/individual.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { FinancialPositionService } from '../financial-position.service';

@Component({
  selector: 'app-individual-asset-details',
  templateUrl: './individual-asset-details.component.html',
  styleUrls: ['./individual-asset-details.component.scss'],
})
export class IndividualAssetDetailsComponent extends BaseIndividualClass {
  assetsArray: any[] = [];
  assetDetailsForm: FormGroup;
  totalAsset: any;
  own: any;
  asssetTypeOptions: any;
  private assetDescriptionMapId = new Map<number, string>();
  private additionalAssets: any[] = [];

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: IndividualService,
    private fb: FormBuilder,
    private financialPositionService: FinancialPositionService,
    private cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);

    this.assetDetailsForm = this.fb.group({
      assetDetails: this.fb.array([]), // Initialize form array
      financialAssetType: [''], // Temporary field for adding new label
      financialAssetTypeAmount: ['', [Validators.min(0), Validators.max(999999999999999999.99)]], // Add validation here - 18,2 format
      assestHomeOwnerType: [''],
      financialPositionAssetId: [0],
    });
  }

  // Custom validator for 18,2 format (if you want to use this instead)
  private amountValidator = (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return null; // Don't validate empty values
    }
    
    const value = control.value.toString();
    const [integerPart, decimalPart] = value.split('.');
    
    // Check if integer part exceeds 18 digits
    if (integerPart && integerPart.length > 18) {
      return { max: true };
    }
    
    // Check if decimal part exceeds 2 digits
    if (decimalPart && decimalPart.length > 2) {
      return { max: true };
    }
    
    // Check if total value exceeds the maximum
    if (parseFloat(value) > 999999999999999999.99) {
      return { max: true };
    }
    
    return null;
  };
  
  override async ngOnInit(): Promise<void> {
    this.customForm = { form: this.assetDetailsForm };

    await super.ngOnInit();

   // console.log("IndividualAssetDetailsComponent", this.baseFormData)

    const [HomeOwnershipRes, AssetOptionRes] = await Promise.all([
      this.baseFormData.UdcHomeOwnership,
      this.baseFormData.UdcAssetDescription
    ]);
    //let HomeOwnershipRes = await this.getLookUpRes('UdcHomeOwnership');
    this.own = HomeOwnershipRes.map((item) => ({
      label: item.lookupValue,
      value: item.lookupId,
    }));

    //let AssetOptionRes = await this.getLookUpRes('UdcAssetDescription');
    this.asssetTypeOptions = AssetOptionRes.map((item) => ({
      label: item.lookupValue,
      value: item.lookupId,
    }));

    AssetOptionRes.forEach(item => {
      this.assetDescriptionMapId.set(item.lookupId, item.lookupValue);
    });

    let assetsLoaded = false;

    if (this.baseFormData?.financialPositionBase || this.baseFormData.financialAssetDetails) {
     
      const getAssetfromAPI = [
        { assestType: 'Home Ownership Type',assestHomeOwnerType: this.baseFormData?.financialAssetDetails?.[0]?.assestHomeOwnerType || this.baseFormData?.financialPositionBase?.homeOwnership || this.baseFormData.assestHomeOwnerType , amount: this.baseFormData?.financialAssetDetails?.[0].amount || this.baseFormData?.financialPositionBase?.amtHomeValue},
        { assestType: 'Vehicle Value', amount: this.baseFormData?.financialAssetDetails?.[1].amount ||  this.baseFormData?.financialPositionBase?.amtVehicleValue },
        { assestType: 'Furniture & Effects Value', amount: this.baseFormData?.financialAssetDetails?.[2].amount || this.baseFormData?.financialPositionBase?.amtFurnitureValue },
      ];
      getAssetfromAPI.forEach((asset) => this.addAssetToForm(asset));

      
      if(this.assetDetails.length === 3 && this.baseFormData.financialPositionAsset){
      this.baseFormData?.financialPositionAsset.forEach((asset: any) => {
        const assetType = asset.assetDescription
        this.addAssetToForm({
          assestType: assetType,
          amount: asset.amtAssetValue || 0,
          financialPositionAssetId: asset.financialPositionAssetId || 0,
        });
      });
    }

      assetsLoaded = true;
    }

    if (!assetsLoaded) {
      const initialAssets = [
        { assestType: 'Home Ownership Type',assestHomeOwnerType: this.baseFormData.financialAssetDetails?.[0]?.assestHomeOwnerType || this.baseFormData.assestHomeOwnerType, amount: this.baseFormData.financialAssetDetails?.[0]?.amount || 0 },
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
     //console.log("valuechanges: ",data)
 
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
  
    const assetGroup = this.fb.group({
      assestType: [asset.assestType],                               
      amount: [asset.amount || 0, [Validators.min(0), Validators.max(999999999999999999.99)]], // 18,2 format
      assestHomeOwnerType: [asset.assestHomeOwnerType],
      financialPositionAssetId: [asset.financialPositionAssetId || 0],
    });
  
    this.assetDetails.push(assetGroup);
    this.updateFormData();
  }

  /**
   * Check if the Add Row button should be disabled
   * Returns true if asset type or amount is not properly filled
   */
  isAddRowDisabled(): boolean {
    const financialAssetType = this.assetDetailsForm.get('financialAssetType')?.value;
    const financialAssetTypeAmount = this.assetDetailsForm.get('financialAssetTypeAmount')?.value;
    const amountControl = this.assetDetailsForm.get('financialAssetTypeAmount');
    
    // Disabled if: no asset type selected OR amount is empty/null/undefined/0 OR amount is invalid
    return !financialAssetType || 
           financialAssetTypeAmount === null || 
           financialAssetTypeAmount === undefined || 
           financialAssetTypeAmount === '' ||
           financialAssetTypeAmount === 0 ||
           (amountControl?.invalid ?? false);
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
          amtAssetValue: financialAssetTypeAmount,
          //operationType: null
      }

      this.additionalAssets.push(additionalAsset);

    const existingAssets = this.baseFormData?.financialPositionAsset || [];
      const isDuplicate = existingAssets.some(
        (inc) =>
          inc.assetDescription === additionalAsset.assetDescription &&
          inc.amtAssetValue === additionalAsset.amtAssetValue
      );

      if (!isDuplicate) {
        const updatedIncomeList = [...existingAssets, additionalAsset];
        this.baseSvc.setBaseDealerFormData({
          financialPositionAsset: updatedIncomeList
        });
      }

      this.addAssetToForm(newAsset);

      this.assetDetailsForm.get('financialAssetType')?.reset();
      this.assetDetailsForm.get('financialAssetTypeAmount')?.reset();
      this.assetDetailsForm.get('assestHomeOwnerType')?.reset();

      this.updateFormData();
    }
  }
  isDisabled(): boolean {
  const baseFormDataStatus= this.baseFormData?.AFworkflowStatus; 
  const sessionStorageStatus= sessionStorage.getItem('workFlowStatus'); 
  return !(
    baseFormDataStatus=== 'Quote' ||
    sessionStorageStatus=== 'Open Quote'
  );
}

  deleteRow(index: number): void {
    if (this.assetDetails.length > 0) {
      
      const assetType = this.assetDetails.at(index).get('assestType')?.value;
      const financialPositionId = this.assetDetails.at(index).get('financialPositionAssetId')?.value;

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
            assetDescription: item.assestType,
            amtAssetValue: item.amount,
        }

        newAssetDetails.push(additionalAsset)
      }
    })

      this.baseSvc.setBaseDealerFormData({
        financialPositionAsset: newAssetDetails,
      });

    }
  }

  updateAssetDetails(index: number): void {
    const assetGroup = this.assetDetails.at(index);
    if (assetGroup) {
      const updatedAmount = assetGroup.value.amount;

      if(this.baseFormData.financialPositionAsset){
      
      let updatedAsset = this.baseFormData?.financialPositionAsset;

      updatedAsset.forEach((asset: any) => {
        if (asset.financialPositionAssetId === assetGroup.get('financialPositionAssetId')?.value) {
          asset.amtAssetValue = updatedAmount;
        }
      });
    }

      this.updateFormData();
      this.calculateTotalIncome();
    }
  }

  onAmountBlur(index?: number): void {
    let amountControl;
    
    if (index !== undefined && index !== null) {
      // Handle form array item
      const assetGroup = this.assetDetails.at(index);
      if (assetGroup) {
        amountControl = assetGroup.get('amount');
      }
    } else {
      // Handle standalone financialAssetTypeAmount field
      amountControl = this.assetDetailsForm.get('financialAssetTypeAmount');
    }
    
    if (amountControl) {
      const currentValue = amountControl?.value;
      
      // Set to 0 when field is empty/null/undefined on blur (but allow negative values for validation)
      if (currentValue === null || currentValue === undefined || currentValue === '') {
        amountControl?.setValue(0);
        this.cdr.detectChanges();
        
        // Update form data and recalculate total only for form array items
        if (index !== undefined && index !== null) {
          this.updateFormData();
        }
      }
    }
  }

  calculateTotalIncome(): void {
  // Helper function to check if amount is invalid (>18,2 format OR negative)
  const isInvalidAmount = (amount: any): boolean => {
    if (amount === null || amount === undefined) return false;
    const amountStr = amount.toString();
    const [integerPart, decimalPart] = amountStr.split('.');
    
    // Check if negative
    if (amount < 0) return true;
    
    // Check if integer part exceeds 18 digits
    if (integerPart && integerPart.length > 18) return true;
    
    // Check if decimal part exceeds 2 digits
    if (decimalPart && decimalPart.length > 2) return true;
    
    // Check if total value exceeds the maximum (18,2 format)
    if (parseFloat(amountStr) > 999999999999999999.99) return true;
    
    return false;
  };

  // Filter out null/undefined amounts and get valid amounts
  const validAssets = this.assetDetails.value.filter((asset: any) => {
    return asset.amount !== null && asset.amount !== undefined;
  });

  // Check if any amount is invalid
  const hasInvalidAmount = validAssets.some((asset: any) => isInvalidAmount(asset.amount));

  // Filter out invalid amounts for calculation
  const validAmountsForCalculation = validAssets.filter((asset: any) => !isInvalidAmount(asset.amount));

  if (validAssets.length === 0) {
    this.totalAsset = 0;
    this.baseSvc.setBaseDealerFormData({
      totalAsset: this.totalAsset,
      hasInvalidAssetInput: false,
    });
  } else if (hasInvalidAmount) {
    // Check if ALL amounts are invalid - if so, reset graph to 0
    const allInvalid = validAssets.every((asset: any) => isInvalidAmount(asset.amount));
    
    if (allInvalid) {
      // All values are invalid - reset graph to 0
      this.totalAsset = 0;
    } else {
      // Some values are invalid - calculate using only valid positive values
      this.totalAsset = validAmountsForCalculation.reduce(
        (acc: number, asset: any) => {
          const amount = asset.amount || 0;
          // Only include positive values in the calculation
          return acc + (amount > 0 ? amount : 0);
        },
        0
      );
    }
    
    // Set flag to indicate invalid input exists
    this.baseSvc.setBaseDealerFormData({
      totalAsset: this.totalAsset,
      hasInvalidAssetInput: true,
    });
  } else {
    // No invalid amounts - check if ALL amounts are negative
    const allNegative = validAssets.every((asset: any) => {
      return asset.amount < 0;
    });

    if (allNegative) {
      // Reset graph to 0 when ALL values are negative
      this.totalAsset = 0;
    } else {
      // Calculate sum using only positive values (exclude negative values)
      this.totalAsset = this.assetDetails.value.reduce(
        (acc: number, asset: any) => {
          const amount = asset.amount || 0;
          // Only include positive values in the calculation
          return acc + (amount > 0 ? amount : 0);
        },
        0
      );
    }
    
    this.baseSvc.setBaseDealerFormData({
      totalAsset: this.totalAsset,
      hasInvalidAssetInput: false,
    });
  }
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
  }

  override onStepChange(stepperDetails: any): void {

    if (stepperDetails?.validate) {
      let formStatus;

      if (this.assetDetailsForm) {
        formStatus = this.svc.proceedForm(this.assetDetailsForm);
        this.baseSvc?.formStatusArr?.push(formStatus);
      }
    }
    super.onStepChange(stepperDetails);

    this.baseSvc.updateComponentStatus("Financial Position", "IndividualAssetDetailsComponent", this.assetDetails.valid)
    
  }
}
