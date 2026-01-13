import { Component } from '@angular/core';
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
    private fb: FormBuilder
  ) {
    super(route, svc, baseSvc);
    this.customForm = { form: this.regularOutgoingForm };

    this.regularOutgoingForm = this.fb.group({
      regularOutgoingDetails: this.fb.array([]), // Initialize form array
      recurringDescription: [''], // Temporary field for adding new label
      amtRecurring: ['', [Validators.max(99999999999999.9999)]], // Add max validator for (18,4) format
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

calculateTotalRegularOutgoings(): void {
  // Check if any amount exceeds 18 digits
  const hasInvalidAmount = this.regularOutgoingDetails.value.some((outgoing: any) => {
    if (outgoing.amtRecurring === null || outgoing.amtRecurring === undefined) return false;
    const amountStr = outgoing.amtRecurring.toString().replace('.', '');
    return amountStr.length > 18;
  });

  let totalRegularOutgoings: number;

  if (hasInvalidAmount) {
    totalRegularOutgoings = Infinity;
  } else {
    // Calculate monthly-converted total
    totalRegularOutgoings = 0;
    this.regularOutgoingDetails.value.forEach((outgoing: any) => {
      const amount = outgoing.amtRecurring || 0;
      const frequency = outgoing.recurringFrequency;
      
      // Convert to monthly based on frequency
      let monthlyAmount = amount;
      if (amount && amount !== 0) {
        switch (frequency) {
          case 3533: monthlyAmount = amount * 4.33; break;   // Weekly
          case 3534: monthlyAmount = amount * 2.17; break;   // Fortnightly
          case 3535: monthlyAmount = amount; break;          // Monthly
          case 4017: monthlyAmount = amount / 3; break;      // Quarterly
          default: monthlyAmount = amount; break;
        }
      }
      
      totalRegularOutgoings += monthlyAmount;
    });
  }

  // Send to service
  this.baseSvc.setBaseDealerFormData({
    totalRegularOutgoings: totalRegularOutgoings
  });
}

  get regularOutgoingDetails(): FormArray {
    return this.regularOutgoingForm.get('regularOutgoingDetails') as FormArray;
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

    // Handle negative values for the add row amount field
    if (regularOutgoingTypeAmount !== null && regularOutgoingTypeAmount < 0) {
      this.regularOutgoingForm.get('amtRecurring')?.setValue(0);
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
        [Validators.max(99999999999999.9999)] // Add max validator for (18,4) format
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

  // Add new method to handle regular outgoing field updates with negative value validation
updateRegularOutgoingDetails(index: number): void {
  const regularOutgoingGroup = this.regularOutgoingDetails.at(index);
  if (regularOutgoingGroup) {
      // Handle negative values for amount field
    const amountControl = regularOutgoingGroup.get('amtRecurring');
    const currentValue = amountControl?.value;
  
      // Convert negative values to 0
    if (currentValue !== null && currentValue < 0) {
      amountControl?.setValue(0);
        return; // Exit early since the value change will trigger another update
    }

    this.baseSvc.setBaseDealerFormData({
      regularOutgoingDetails: this.regularOutgoingDetails.value,
    });
    // Recalculate total
    this.calculateTotalRegularOutgoings();
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
