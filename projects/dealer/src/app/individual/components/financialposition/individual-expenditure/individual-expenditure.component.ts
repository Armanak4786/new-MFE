import { ChangeDetectorRef, Component } from '@angular/core';
import { BaseIndividualClass } from '../../../base-individual.class';
import { ActivatedRoute } from '@angular/router';
import { CommonService, GenericFormConfig } from 'auro-ui';
import { IndividualService } from '../../../services/individual.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-individual-expenditure',
  templateUrl: './individual-expenditure.component.html',
  styleUrl: './individual-expenditure.component.scss',
})
export class IndividualExpenditureComponent extends BaseIndividualClass {
  expenditureArray: any[] = [];
  expenditureDetailsForm: FormGroup;
  expenditureFrequencyOptions: any;
  expenditureTypeOptions: any;
  expenditureStaticFields: any;
  expenditureTotal: any;
  private expenditureDescriptionMapId = new Map<number, string>();


  
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: IndividualService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
    this.customForm = { form: this.expenditureDetailsForm };
    this.expenditureDetailsForm = this.fb.group({
      expenditureDetails: this.fb.array([]), // Initialize form array
      expenditureDescription: [''],
      amtExpenditure: [0], // Temporary field for adding new amount
      expenditureFrequency: [''], // Temporary field for adding frequency
      // financialPositionExpenditureId: [0]
    });
  }


  
  override async ngOnInit(): Promise<void> {

    await super.ngOnInit();
    let isLoaded = false;

    let expenditureFrequencyRes = this.baseFormData.UdcFrequency;
    this.expenditureFrequencyOptions = expenditureFrequencyRes.map(
      (item: any) => ({
        name: item.lookupValue,
        code: item.lookupId,
      })
    );

    let expOptionRes = this.baseFormData.UdcExpenditureDescription;
    this.expenditureTypeOptions = expOptionRes
    .filter((item: any) => item.lookupCode === 'E')
      .map((item: any) => ({
        name: item.lookupValue,
        code: item.lookupId,
      }));

    this.expenditureStaticFields = expOptionRes
    .filter((item: any) => item.lookupCode.includes('R') && item.lookupCode !== '6R')
      .map((item: any) => ({
        name: item.lookupValue,
        code: item.lookupId,
      }));

    expOptionRes.forEach(item => {
      this.expenditureDescriptionMapId.set(item.lookupId, item.lookupValue);
    });

    this.expenditureDescriptionMapId.forEach((value, key) => {
      if (value === "Motor Vehicle") {
        this.expenditureDescriptionMapId.set(key, "Motor Vehicles");
      } 
    });

    this.expenditureStaticFields.forEach((expenditure: any) => {
      this.addExpenditureForm({
        expenditureDescription: expenditure.code,
        amtExpenditure: 0,
        expenditureFrequency: 3533, // Default frequency
      });
    });

    this.expenditureDetails.patchValue(this.baseFormData.financialPositionExpenditure)
    //console.log(this.baseFormData.financialPositionExpenditure)

    this.calculateTotalIncome();
    this.expenditureDetailsForm.valueChanges.subscribe((changes) => {
      this.baseSvc.setBaseDealerFormData({
        financialPositionExpenditure: this.sanitizeExpenditureDetails(
          this.expenditureDetails.value
        ),
      });
      this.calculateTotalIncome();
      
    });
  }


  get expenditureDetails(): FormArray {
    return this.expenditureDetailsForm.get('expenditureDetails') as FormArray;
  }

  isDisabled(): boolean {
  const baseFormDataStatus= this.baseFormData?.AFworkflowStatus; 
  const sessionStorageStatus= sessionStorage.getItem('workFlowStatus'); 
  return !(
    baseFormDataStatus=== 'Quote' ||
    sessionStorageStatus=== 'Open Quote'
  );
}

  private sanitizeExpenditureDetails(expenditures: any[]): any[] {
    return expenditures.map((exp) => ({
      expenditureDescription: exp.expenditureDescription ?? "",
      amtExpenditure: Number(exp.amtExpenditure) || 0,
      expenditureFrequency: Number(exp.expenditureFrequency) || 0,
      financialPositionExpenditureId:
        Number(exp.financialPositionExpenditureId) || 0,
      financialPositionBaseId: Number(exp.financialPositionBaseId) || 0,
    }));
  }


  // ✅ Add a new row
  addRow(): void {
    let expenditureIncome = this.expenditureDetailsForm.value
    this.addExpenditureForm(expenditureIncome);

    // Clear temporary fields
      this.expenditureDetailsForm.get('financialExpenditureType')?.reset();
      this.expenditureDetailsForm
        .get('financialExpenditureTypeAmount')
        ?.reset();
      this.expenditureDetailsForm.get('financialExpenditureFrequency')?.reset();
  }


  deleteRow(index: number): void {
    if (this.expenditureDetails.length > 0) {

      const financialPositionExpenditureId = this.expenditureDetails.at(index).get('financialPositionExpenditureId')?.value;
      // console.log('Deleting financialPositionExpenditureId=>>>>', financialPositionExpenditureId);

       if(financialPositionExpenditureId > 0){
        this.svc.data
          .delete(
             `CustomerDetails/delete_customerFinancialPosition?FinancialPositionAssetId=${financialPositionExpenditureId}`,
          )
           .subscribe((res) => { });
      }

      this.expenditureDetails.removeAt(index);
      this.expenditureArray.splice(index, 1); // Also remove from array
    }
    this.baseSvc.setBaseDealerFormData({
      expenditureDetails: this.expenditureDetails.value,
    });
    this.calculateTotalIncome();
  }


  private addExpenditureForm(expenditure: any) {
    const amt = expenditure.amtExpenditure != null ? expenditure.amtExpenditure : 0;
    const expenditureGroup = this.fb.group({
      expenditureDescription: [
        expenditure.expenditureDescription,
        // Validators.required,
      ],
      amtExpenditure: [amt, [Validators.min(0), Validators.max(999999999999999999.99)]], // Add min and max validator - prevent negative values, 18,2 format
      // expenditure.amtExpenditure || 0,
      // [Validators.required, Validators.min(1)],
      // ],
      expenditureFrequency: [
        expenditure.expenditureFrequency,
        Validators.required,
      ],
      financialPositionExpenditureId: [0],
      financialPositionBaseId: [expenditure.financialPositionBaseId || 0],
      
    });

    this.expenditureDetails.push(expenditureGroup);
    this.baseSvc.setBaseDealerFormData({
      expenditureDetails: this.expenditureDetails.value,
    });
    this.calculateTotalIncome();
  }

  // Add new method to handle expenditure field updates
  updateExpenditureDetails(index: number): void {
    const expenditureGroup = this.expenditureDetails.at(index);
    if (expenditureGroup) {
      this.baseSvc.setBaseDealerFormData({
        expenditureDetails: this.expenditureDetails.value,
      });
      this.calculateTotalIncome();
    }
  }

  onAmountBlur(index: number): void {
    const expenditureGroup = this.expenditureDetails.at(index);
    if (expenditureGroup) {
      const amountControl = expenditureGroup.get('amtExpenditure');
      const currentValue = amountControl?.value;
      
      // Set to 0 when field is empty/null/undefined on blur (but allow negative values for validation)
      if (currentValue === null || currentValue === undefined || currentValue === '') {
        amountControl?.setValue(0);
        this.cdr.detectChanges();
        // Note: setBaseDealerFormData() and calculateTotalIncome() are handled automatically by valueChanges subscription
      }
    }
  }

  // calculateTotalIncome(): void {
  //   // console.log('Calculating total income...', this.expenditureDetails.value);

  //   this.expenditureTotal = this.expenditureDetails.value.reduce(
  //     (acc: number, expenditure: any) =>
  //       acc + (expenditure.amtExpenditure || 0),
  //     0
  //   );

  //   this.baseSvc.setBaseDealerFormData({
  //     expenditureTotal: this.expenditureTotal,
  //   });
  // }

  //Calculate total expenditure with frequency conversion to monthly
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
  const validExpenditures = this.expenditureDetails.value.filter(
    (expenditure: any) => {
      return expenditure.amtExpenditure !== null && 
             expenditure.amtExpenditure !== undefined;
    }
  );

  // Check if any amount is invalid
  const hasInvalidAmount = validExpenditures.some(
    (expenditure: any) => isInvalidAmount(expenditure.amtExpenditure)
  );

  // Filter out invalid amounts for calculation
  const validAmountsForCalculation = validExpenditures.filter(
    (expenditure: any) => !isInvalidAmount(expenditure.amtExpenditure)
  );

  if (validExpenditures.length === 0) {
    this.expenditureTotal = 0;
    this.baseSvc.setBaseDealerFormData({
      expenditureTotal: this.expenditureTotal,
      hasInvalidExpenditureInput: false,
    });
  } else if (hasInvalidAmount) {
    // Check if ALL amounts are invalid - if so, reset graph to 0
    const allInvalid = validExpenditures.every(
      (expenditure: any) => isInvalidAmount(expenditure.amtExpenditure)
    );

    if (allInvalid) {
      // All values are invalid - reset graph to 0
      this.expenditureTotal = 0;
    } else {
      // Some values are invalid - calculate using only valid positive values
      this.expenditureTotal = 0;
      validAmountsForCalculation.forEach((expenditure: any) => {
        const amount = expenditure.amtExpenditure || 0;
        
        // Only process positive values
        if (amount > 0) {
          const frequency = expenditure.expenditureFrequency;

          // Convert to monthly based on frequency
          let monthlyAmount = amount;
          if (amount && amount !== 0) {
            switch (frequency) {
              case 3533:
                monthlyAmount = amount * 4.3333;
                break; // Weekly
              case 3534:
                monthlyAmount = amount * 2.1667;
                break; // Fortnightly
              case 3535:
                monthlyAmount = amount;
                break; // Monthly
              case 4017:
                monthlyAmount = amount / 3;
                break; // Quarterly
              default:
                monthlyAmount = amount;
                break;
            }
          }
          this.expenditureTotal += monthlyAmount;
        }
      });
    }
    
    // Set flag to indicate invalid input exists
    this.baseSvc.setBaseDealerFormData({
      expenditureTotal: this.expenditureTotal,
      hasInvalidExpenditureInput: true,
    });
  } else {
    // No invalid amounts - check if ALL amounts are negative
    const allNegative = validExpenditures.every(
      (expenditure: any) => {
        return expenditure.amtExpenditure < 0;
      }
    );

    if (allNegative) {
      // Reset graph to 0 when ALL values are negative
      this.expenditureTotal = 0;
    } else {
      // Calculate monthly-converted total
      // Only include positive values in the calculation
      this.expenditureTotal = 0;
      this.expenditureDetails.value.forEach((expenditure: any) => {
        const amount = expenditure.amtExpenditure || 0;
        
        // Only process positive values
        if (amount > 0) {
          const frequency = expenditure.expenditureFrequency;

          // Convert to monthly based on frequency
          let monthlyAmount = amount;
          if (amount && amount !== 0) {
            switch (frequency) {
              case 3533:
                monthlyAmount = amount * 4.3333;
                break; // Weekly
              case 3534:
                monthlyAmount = amount * 2.1667;
                break; // Fortnightly
              case 3535:
                monthlyAmount = amount;
                break; // Monthly
              case 4017:
                monthlyAmount = amount / 3;
                break; // Quarterly
              default:
                monthlyAmount = amount;
                break;
            }
          }
          this.expenditureTotal += monthlyAmount;
        }
      });
    }
    
    this.baseSvc.setBaseDealerFormData({
      expenditureTotal: this.expenditureTotal,
      hasInvalidExpenditureInput: false,
    });
  }
}


  // updateAssetDetails(index: number): void {
  //   const expenditureGroup = this.expenditureDetails.at(index);


  //   if (expenditureGroup) {
  //     const updatedExpenditure = {
  //       expenditure: expenditureGroup.get('expenditure')
  //         ?.value,
  //       amount: expenditureGroup.get('amount')
  //         ?.value,
  //       frequency: expenditureGroup.get(
  //         'frequency'
  //       )?.value,
  //     };


  //     // this.expenditureArray[index] = updatedExpenditure;
  //     this.baseSvc.setBaseDealerFormData({
  //       expenditureDetails: this.expenditureDetails.value,
  //     });
  //   }
  //   this.calculateTotalIncome();
  // }
  override onStepChange(stepperDetails: any): void {

    if (stepperDetails?.validate) {
      let formStatus;

      if (this.expenditureDetailsForm) {
        formStatus = this.svc.proceedForm(this.expenditureDetailsForm);
        this.baseSvc?.formStatusArr?.push(formStatus);
      }
    }
    super.onStepChange(stepperDetails);

    this.baseSvc.updateComponentStatus(
      "Financial Position",
      "IndividualExpenditureComponent",
      this.expenditureDetails.valid
    );
  }
}
