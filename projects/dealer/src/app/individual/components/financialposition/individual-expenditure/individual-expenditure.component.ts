import { Component } from '@angular/core';
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
    private fb: FormBuilder
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
      amtExpenditure: [amt, [Validators.max(999999999999999999.9999)]], // Add max validator
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

  // Add new method to handle expenditure field updates with negative value validation
  updateExpenditureDetails(index: number): void {
    const expenditureGroup = this.expenditureDetails.at(index);
    if (expenditureGroup) {
      // Handle negative values for amount field
      const amountControl = expenditureGroup.get('amtExpenditure');
      const currentValue = amountControl?.value;

      // Convert negative values to 0
      if (currentValue !== null && currentValue < 0) {
        amountControl?.setValue(0);
        return; // Exit early since the value change will trigger another update
      }

      this.baseSvc.setBaseDealerFormData({
        expenditureDetails: this.expenditureDetails.value,
      });
      this.calculateTotalIncome();
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
  // Check if any amount exceeds 18 digits
  const hasInvalidAmount = this.expenditureDetails.value.some(
    (expenditure: any) => {
      if (
        expenditure.amtExpenditure === null ||
        expenditure.amtExpenditure === undefined
      )
        return false;
      const amountStr = expenditure.amtExpenditure
        .toString()
        .replace(".", "");
      return amountStr.length > 18;
    }
  );

  if (hasInvalidAmount) {
    this.expenditureTotal = Infinity;
  } else {
    // Calculate monthly-converted total
    this.expenditureTotal = 0;
    this.expenditureDetails.value.forEach((expenditure: any) => {
      const amount = expenditure.amtExpenditure || 0;
      const frequency = expenditure.expenditureFrequency;

      // Convert to monthly based on frequency
      let monthlyAmount = amount;
      if (amount && amount !== 0) {
        switch (frequency) {
          case 3533:
            monthlyAmount = amount * 4.33;
            break; // Weekly
          case 3534:
            monthlyAmount = amount * 2.17;
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
    });
  }

  this.baseSvc.setBaseDealerFormData({
    expenditureTotal: this.expenditureTotal,
  });
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
