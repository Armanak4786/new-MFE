import { ChangeDetectorRef, Component } from '@angular/core';
import { BaseIndividualClass } from '../../../base-individual.class';
import { ActivatedRoute } from '@angular/router';
import { CommonService, GenericFormConfig } from 'auro-ui';
import { IndividualService } from '../../../services/individual.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-regular-recurring-frequency',
  templateUrl: './regular-recurring-frequency.component.html',
  styleUrl: './regular-recurring-frequency.component.scss',
})
export class RegularRecurringFrequencyComponent extends BaseIndividualClass {
  regularOutgoingArray: any[] = [];
  regularOutgoingForm: FormGroup;
  regularOutgoingFrequencyOptions: any;
  regularOutgoingTypeOptions: any;
  private recurringDescriptionMapId = new Map<number, string>();

  
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: IndividualService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
    this.customForm = { form: this.regularOutgoingForm };

    this.regularOutgoingForm = this.fb.group({
      regularOutgoingDetails: this.fb.array([]), // Initialize form array
      recurringDescription: [''], // Temporary field for adding new label
      amtRecurring: ['', [Validators.min(0), Validators.max(999999999999999999.99)]], // Add min and max validator - prevent negative values, 18,2 format
      recurringFrequency: [3533], // Temporary field for adding recurringFrequency
    });
  }

override async ngOnInit(): Promise<void> {
  await super.ngOnInit();
  let isLoaded = false;

  let recurringFrequencyRes = this.baseFormData.UdcFrequency;
  this.regularOutgoingFrequencyOptions = recurringFrequencyRes
  .map((item: any) => ({
    name: item.lookupValue,
    code: item.lookupId,
  }));

  let recurringOptionRes = this.baseFormData.UdcExpenditureDescription;
  this.regularOutgoingTypeOptions = recurringOptionRes
  .filter((item: any) => item.lookupCode.includes("E"))
  .map((item: any) => ({
    name: item.lookupValue,
    code: item.lookupId,
  }));

  recurringOptionRes.forEach(item => {
    this.recurringDescriptionMapId.set(item.lookupId, item.lookupValue);
  });

  this.regularOutgoingForm.get('recurringFrequency')?.setValue(3533);

  if (this.baseFormData.financialPositionRegularRecurring) {
    this.baseFormData?.financialPositionRegularRecurring.forEach((recurring: any) => {
          
      this.addregularOutgoingForm({
        recurringDescription: recurring.recurringDescription,
        amtRecurring: recurring.amtRecurring || 0,
        recurringFrequency: recurring.recurringFrequency || 3533,
        financialPositionRecurringId: recurring.financialPositionRecurringId || 0,
        financialPositionBaseId: recurring.financialPositionBaseId || 0
      });
    });
  }
  // Calculate initial total
  this.calculateTotalRegularOutgoings();

  this.regularOutgoingDetails.valueChanges.subscribe(changes => {
      // console.log("Changes==",changes, this.regularOutgoingDetails.value)
    this.baseSvc.setBaseDealerFormData({
      financialPositionRegularRecurring: this.regularOutgoingDetails.value
    });
    //  Recalculate total on every change
    this.calculateTotalRegularOutgoings();
  });
  
  this.baseSvc.setBaseDealerFormData({
    financialPositionRegularRecurring: this.regularOutgoingDetails.value
  });
}
isDisabled(): boolean {
  const baseFormDataStatus= this.baseFormData?.AFworkflowStatus; 
  const sessionStorageStatus= sessionStorage.getItem('workFlowStatus'); 
  return !(
    baseFormDataStatus=== 'Quote' ||
    sessionStorageStatus=== 'Open Quote'
  );
}

calculateTotalRegularOutgoings(): void {
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
  const validOutgoings = this.regularOutgoingDetails.value.filter((outgoing: any) => {
    return outgoing.amtRecurring !== null && 
           outgoing.amtRecurring !== undefined;
  });

  // Check if any amount is invalid
  const hasInvalidAmount = validOutgoings.some((outgoing: any) => isInvalidAmount(outgoing.amtRecurring));

  // Filter out invalid amounts for calculation
  const validAmountsForCalculation = validOutgoings.filter((outgoing: any) => !isInvalidAmount(outgoing.amtRecurring));

  let totalRegularOutgoings: number;

  if (validOutgoings.length === 0) {
    totalRegularOutgoings = 0;
    this.baseSvc.setBaseDealerFormData({
      totalRegularOutgoings: totalRegularOutgoings,
      hasInvalidRecurringInput: false,
    });
  } else if (hasInvalidAmount) {
    // Check if ALL amounts are invalid - if so, reset graph to 0
    const allInvalid = validOutgoings.every((outgoing: any) => isInvalidAmount(outgoing.amtRecurring));

    if (allInvalid) {
      // All values are invalid - reset graph to 0
      totalRegularOutgoings = 0;
    } else {
      // Some values are invalid - calculate using only valid positive values
      totalRegularOutgoings = 0;
      validAmountsForCalculation.forEach((outgoing: any) => {
        const amount = outgoing.amtRecurring || 0;
        
        // Only process positive values
        if (amount > 0) {
          const frequency = outgoing.recurringFrequency;
          
          // Convert to monthly based on frequency
          let monthlyAmount = amount;
          if (amount && amount !== 0) {
            switch (frequency) {
              case 3533: monthlyAmount = amount * 4.3333; break;   // Weekly
              case 3534: monthlyAmount = amount * 2.1667; break;   // Fortnightly
              case 3535: monthlyAmount = amount; break;          // Monthly
              case 4017: monthlyAmount = amount / 3; break;      // Quarterly
              default: monthlyAmount = amount; break;
            }
          }
          
          totalRegularOutgoings += monthlyAmount;
        }
      });
    }
    
    // Set flag to indicate invalid input exists
    this.baseSvc.setBaseDealerFormData({
      totalRegularOutgoings: totalRegularOutgoings,
      hasInvalidRecurringInput: true,
    });
  } else {
    // No invalid amounts - check if ALL amounts are negative
    const allNegative = validOutgoings.every((outgoing: any) => {
      return outgoing.amtRecurring < 0;
    });

    if (allNegative) {
      // Reset graph to 0 when ALL values are negative
      totalRegularOutgoings = 0;
    } else {
      // Calculate monthly-converted total
      // Only include positive values in the calculation
      totalRegularOutgoings = 0;
      this.regularOutgoingDetails.value.forEach((outgoing: any) => {
        const amount = outgoing.amtRecurring || 0;
        
        // Only process positive values
        if (amount > 0) {
          const frequency = outgoing.recurringFrequency;
          
          // Convert to monthly based on frequency
          let monthlyAmount = amount;
          if (amount && amount !== 0) {
            switch (frequency) {
              case 3533: monthlyAmount = amount * 4.3333; break;   // Weekly
              case 3534: monthlyAmount = amount * 2.1667; break;   // Fortnightly
              case 3535: monthlyAmount = amount; break;          // Monthly
              case 4017: monthlyAmount = amount / 3; break;      // Quarterly
              default: monthlyAmount = amount; break;
            }
          }
          
          totalRegularOutgoings += monthlyAmount;
        }
      });
    }
    
    this.baseSvc.setBaseDealerFormData({
      totalRegularOutgoings: totalRegularOutgoings,
      hasInvalidRecurringInput: false,
    });
  }
}

  get regularOutgoingDetails(): FormArray {
    return this.regularOutgoingForm.get('regularOutgoingDetails') as FormArray;
  }

  /**
   * Check if the Add Row button should be disabled
   * Returns true if outgoing type, amount, or frequency is not properly filled
   */
  isAddRowDisabled(): boolean {
    const recurringDescription = this.regularOutgoingForm.get('recurringDescription')?.value;
    const amtRecurring = this.regularOutgoingForm.get('amtRecurring')?.value;
    const recurringFrequency = this.regularOutgoingForm.get('recurringFrequency')?.value;
    const amountControl = this.regularOutgoingForm.get('amtRecurring');
    
    // Disabled if: no outgoing type selected OR amount is empty/null/undefined/0 OR amount is invalid OR no frequency selected
    return !recurringDescription || 
           amtRecurring === null || 
           amtRecurring === undefined || 
           amtRecurring === '' ||
           amtRecurring === 0 ||
           (amountControl?.invalid ?? false) ||
           !recurringFrequency;
  }

  addRow(): void {
    const regularOutgoingType = this.regularOutgoingForm.get(
      'recurringDescription'
    )?.value;
    const regularOutgoingTypeAmount = this.regularOutgoingForm.get(
      'amtRecurring'
    )?.value;
    const regularOutgoingFrequency = this.regularOutgoingForm.get(
      'recurringFrequency'
    )?.value;

    // Check if amount field is valid before proceeding
    const amountControl = this.regularOutgoingForm.get('amtRecurring');
    if (amountControl?.invalid) {
      amountControl.markAsTouched();
      return;
    }

    //console.log(regularOutgoingType, regularOutgoingTypeAmount, regularOutgoingFrequency)
    if (
      regularOutgoingType &&
      regularOutgoingTypeAmount !== null &&
      regularOutgoingFrequency
    ) {
      const regularOutgoingIncome = {
        recurringDescription: regularOutgoingType,
        amtRecurring: regularOutgoingTypeAmount,
        recurringFrequency: regularOutgoingFrequency || 3533,
      };

      // let  regularOutgoingIncome = this.regularOutgoingDetails.value   
      this.addregularOutgoingForm(regularOutgoingIncome);

      this.regularOutgoingForm.get('recurringDescription')?.reset();
      this.regularOutgoingForm.get('amtRecurring')?.reset();
      this.regularOutgoingForm.get('recurringFrequency')?.reset();
    }
  }

  deleteRow(index: number): void {
    if (this.regularOutgoingDetails.length > 0) {
      const financialPositionRecurringId = this.regularOutgoingDetails.at(index).get('financialPositionRecurringId')?.value;

      if(financialPositionRecurringId){
        this.svc.data
           .delete(
             `CustomerDetails/delete_customerFinancialPosition?FinancialPositionIncomeId=${financialPositionRecurringId}`,
           )
           .subscribe((res) => { });
      }
      this.regularOutgoingDetails.removeAt(index);
      this.regularOutgoingArray.splice(index, 1);
    }
    this.baseSvc.setBaseDealerFormData({
      regularOutgoingDetails: this.regularOutgoingDetails.value,
    });
  }

  private addregularOutgoingForm(regularOutgoing: any) {
    const regularOutgoingGroup = this.fb.group({
      recurringDescription: [
        regularOutgoing.recurringDescription,
        // Validators.required,
      ],
      amtRecurring: [
        regularOutgoing.amtRecurring,
        [Validators.min(0), Validators.max(999999999999999999.99)] // Add min and max validator - prevent negative values, 18,2 format
        // [Validators.required, Validators.min(1)],
      ],
      recurringFrequency: [
        regularOutgoing.recurringFrequency,
        Validators.required,
      ],
      financialPositionRecurringId : [regularOutgoing.financialPositionRecurringId || 0],
      financialPositionBaseId: [ regularOutgoing.financialPositionBaseId || 0]
    });

    this.regularOutgoingDetails.push(regularOutgoingGroup);
    this.baseSvc.setBaseDealerFormData({
      regularOutgoingDetails: this.regularOutgoingDetails.value,
    });
  }

  // Add  method to handle regular outgoing field updates
updateRegularOutgoingDetails(index: number): void {
  const regularOutgoingGroup = this.regularOutgoingDetails.at(index);
  if (regularOutgoingGroup) {
    this.baseSvc.setBaseDealerFormData({
      regularOutgoingDetails: this.regularOutgoingDetails.value,
    });
    // Recalculate total
    this.calculateTotalRegularOutgoings();
  }
}

onAmountBlur(index?: number): void {
  let amountControl;
  
  if (index !== undefined && index !== null) {
    // Handle form array item
    const regularOutgoingGroup = this.regularOutgoingDetails.at(index);
    if (regularOutgoingGroup) {
      amountControl = regularOutgoingGroup.get('amtRecurring');
    }
  } else {
    // Handle standalone amtRecurring field
    amountControl = this.regularOutgoingForm.get('amtRecurring');
  }
  
  if (amountControl) {
    const currentValue = amountControl?.value;
    
      // Set to 0 when field is empty/null/undefined on blur (but allow negative values for validation)
      if (currentValue === null || currentValue === undefined || currentValue === '') {
        amountControl?.setValue(0);
        this.cdr.detectChanges();
      }
  }
}

  // updateAssetDetails(index: number): void {
  //   const regularOutgoingGroup = this.regularOutgoingDetails.at(index);

  //   if (regularOutgoingGroup) {
  //     const updatedExpenditure = {
  //       outgoingType: regularOutgoingGroup.get(
  //         'outgoingType'
  //       )?.value,
  //       amount: regularOutgoingGroup.get(
  //         'amount'
  //       )?.value,
  //       frequency: regularOutgoingGroup.get(
  //         'frequency'
  //       )?.value,
  //     };

  //     this.baseSvc.setBaseDealerFormData({
  //       regularOutgoingDetails: this.regularOutgoingDetails.value,
  //     });
  //   }
  // }

  override onStepChange(stepperDetails: any): void {

    if (stepperDetails?.validate) {
      let formStatus;

      if (this.regularOutgoingForm) {
        formStatus = this.svc.proceedForm(this.regularOutgoingForm);
        this.baseSvc?.formStatusArr?.push(formStatus);
      }
    }
    super.onStepChange(stepperDetails);
    this.baseSvc.updateComponentStatus("Financial Position", "RegularRecurringFrequencyComponent", this.regularOutgoingDetails.valid)
    // this.checkStepValidity()
  }

}
