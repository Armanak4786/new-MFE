import { ChangeDetectorRef, Component } from '@angular/core';
import { BaseIndividualClass } from '../../../base-individual.class';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'auro-ui';
import { IndividualService } from '../../../services/individual.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinancialPositionService } from '../financial-position.service';


@Component({
  selector: 'app-income-details',
  templateUrl: './income-details.component.html',
  styleUrls: ['./income-details.component.scss'],
})
export class IncomeDetailsComponent extends BaseIndividualClass {
  incomeArray: any[] = [];
  incomeDetailsForm: FormGroup;
  incomeFrequencyOptions: any;
  incomeTypeOptions: any;
  totalIncome: any;
  private incomeDescriptionMapId = new Map<number, string>();
  private additionalIncomes: any[] = [];
  isIncomeDecreaseValue:any;



  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: IndividualService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private financialService: FinancialPositionService
  ) {
    super(route, svc, baseSvc);




    this.incomeDetailsForm = this.fb.group({
      incomeDetails: this.fb.array([]),
      financialIncomeType: [''],
      financialIncomeTypeAmount: ['', [Validators.max(999999999999999999.9999)]], // Add max validator
      financialIncomeFrequency: [3533],
      myTextarea: ['', [Validators.maxLength(255)]], // Always have maxLength validator
      isIncomeDecrease: [],
      financialPositionIncomeId: [0],
    });
  }




  override async ngOnInit(): Promise<void> {
    
    this.customForm = { form: this.incomeDetailsForm };
    await super.ngOnInit();



   //console.log("IncomeDetailbaseFormData", this.baseFormData);
    // let frequencyRes = await this.getLookUpRes('UdcFrequency');
    let frequencyRes = this.baseFormData?.UdcFrequency
    this.incomeFrequencyOptions = frequencyRes.map((item: any) => ({
      name: item.lookupValue,
      code: item.lookupId,
    }));



    // let incomeOptionRes = await this.getLookUpRes('UdcAdditionalIncomeDescription');
    let incomeOptionRes = this.baseFormData.UdcAdditionalIncomeDescription
    this.incomeTypeOptions = incomeOptionRes
    .map((item: any) => ({
      name: item.lookupValue,
      code: item.lookupId,
    }));




    incomeOptionRes.forEach(item => {
      this.incomeDescriptionMapId.set(item.lookupId, item.lookupValue);
    });



   
    
    // console.log(this.baseFormData)
    // if (this.baseFormData?.financialPositionBase || this.baseFormData?.details) {
    //   this.incomeDetailsForm
    //     ?.get('myTextarea')
    //     .patchValue(this.baseFormData?.details ? this.baseFormData?.details : this.baseFormData?.financialPositionBase?.incomeDecrDetail);
    //     console.log(this.baseFormData?.details)
    // }
    if (this.baseFormData?.financialPositionBase || this.baseFormData?.details !== undefined) {
  const textareaValue = this.baseFormData?.details !== undefined 
    ? this.baseFormData.details 
    : this.baseFormData?.financialPositionBase?.incomeDecrDetail;
  
  this.incomeDetailsForm?.get('myTextarea').patchValue(textareaValue || '');
  
}



    if(this.baseFormData?.isIncomeDecrease){
      this.incomeDetailsForm
        ?.get('isIncomeDecrease')
        .patchValue(this.baseFormData?.isIncomeDecrease )
    }



    let isLoaded = false;



      if (this.baseFormData.financialPositionBase || this.baseFormData.incomeDetails) {
        const getIncomefromAPI = [
          { incomeType: 'Take Home Pay', amount: this.baseFormData?.incomeDetails?.[0].amount || this.baseFormData?.financialPositionBase?.amtTakeHomePay, frequency: this.baseFormData?.incomeDetails?.[0].frequency || this.baseFormData?.financialPositionBase?.takeHomePayFrequency },
          { incomeType: 'Spouse/Partner Pay', amount:this.baseFormData?.incomeDetails?.[1].amount || this.baseFormData?.financialPositionBase?.amtSpousePay, frequency: this.baseFormData?.incomeDetails?.[1].frequency || this.baseFormData?.financialPositionBase?.spousePayFrequency }
        ];
        getIncomefromAPI.forEach((income) => {
          this.addIncomeForm({
            incomeType: income.incomeType,
            amount: income.amount,
            frequency: income.frequency,
            //financialPositionIncomeId: income.financialPositionIncomeId,
          });
        });



       if(this.baseFormData.financialPositionIncome) {
        this.baseFormData?.financialPositionIncome.forEach((income: any) => {
        this.addIncomeForm({
          incomeType: income.additionalIncomeDescription,
          amount: income.amtAdditionalIncome || 0,
          frequency: income.additionalIncomeFrequency,
          financialPositionIncomeId: income.financialPositionIncomeId,
          financialPositionBaseId: income.financialPositionBaseId || 0
        });
      });
      }
    



      // this.incomeDetailsForm
      //   ?.get('isIncomeDecrease')
      //   .patchValue(this.baseFormData?.isIncomeDecrease || this.baseFormData?.financialPositionBase?.isIncomeLikelyToDecrease.toString());
    
      // this.incomeDetailsForm?.get('myTextarea').patchValue(this.baseFormData?.details || this.baseFormData?.financialPositionBase?.incomeDecrDetail);




        isLoaded = true;
    }
    



setTimeout(() => {
      this.incomeDetailsForm
        ?.get('isIncomeDecrease')
        .patchValue(this.baseFormData?.isIncomeDecrease?.toString() || this.baseFormData?.financialPositionBase?.isIncomeLikelyToDecrease.toString() || null);
}, 0);
      this.cdr.detectChanges();


    
        if(this.baseFormData?.isIncomeDecrease === false || (this.baseFormData?.isIncomeDecrease === undefined && !this.baseFormData?.financialPositionBase)){
        this.incomeDetailsForm.get('myTextarea')?.disable();
        this.incomeDetailsForm.get('myTextarea')?.reset();
        }
        else if(this.baseFormData?.isIncomeDecrease === undefined && this.baseFormData?.financialPositionBase?.isIncomeLikelyToDecrease === false){
              this.incomeDetailsForm.get('myTextarea')?.disable();
              this.incomeDetailsForm.get('myTextarea')?.reset();
        }
        else{
        this.incomeDetailsForm.get('myTextarea')?.enable();
        this.incomeDetailsForm.get('myTextarea')?.setValidators([Validators.required, Validators.maxLength(255)]);
        this.incomeDetailsForm.get('myTextarea')?.updateValueAndValidity();
        }






      if (!isLoaded) {
        const initialIncome = [
          {
            incomeType: 'Take Home Pay',
            amount: this.baseFormData.incomeDetails?.[0]?.amount || 0,
            frequency: this.baseFormData.incomeDetails?.[0]?.frequency || 3533,
          },
          {
            incomeType: 'Spouse/Partner Pay',
            amount: this.baseFormData.incomeDetails?.[1]?.amount || 0,
            frequency: this.baseFormData.incomeDetails?.[1].frequency || 3533,
          },
        ];



        initialIncome.forEach((income) => this.addIncomeForm(income));
      



        if(this.baseFormData.financialPositionIncome){
        this.baseFormData?.financialPositionIncome.forEach((income: any) => {
          this.addIncomeForm({
            incomeType: income.additionalIncomeDescription,
            amount: income.amtAdditionalIncome || 0,
            frequency: income.additionalIncomeFrequency,
            financialPositionIncomeId: income.financialPositionIncomeId || 0,
            financialPositionBaseId: income.financialPositionBaseId || 0
          });
        });
      }



      }
    



    // Listen for value changes
    this.incomeDetails.valueChanges.subscribe((data) => {
     // console.log("IncomevalueChanges", data)
      this.baseSvc.setBaseDealerFormData({
        incomeDetails : data
      })
      this.incomeArray = data; // Sync incomeArray with form changes
    });
    
    if(this.baseSvc.showValidationMessage){
      this.incomeDetails.markAllAsTouched()
    }



    // console.log("Income Value Changes: ",this.incomeArray)
  }



  get incomeDetails(): FormArray {
    return this.incomeDetailsForm.get('incomeDetails') as FormArray;
  }


// Converts income amount to monthly equivalent based on frequency

private convertToMonthly(amount: number, frequency: number): number {
  if (!amount || amount === 0) return 0;

  switch (frequency) {
    case 3533: // Weekly
      return amount * 4.33;
    case 3534: // Fortnightly
      return amount * 2.17;
    case 3535: // Monthly
      return amount;
    case 4017: // Quarterly
      return amount / 3;
    default:
      return amount; // Fallback: treat as monthly
  }
}


  addRow(): void {
    const financialIncomeType = this.incomeDetailsForm.get(
      'financialIncomeType'
    )?.value;
    const financialIncomeTypeAmount = this.incomeDetailsForm.get(
      'financialIncomeTypeAmount'
    )?.value;
    const financialIncomeFrequency = this.incomeDetailsForm.get(
      'financialIncomeFrequency'
    )?.value;

    // Check if the amount field is valid before proceeding
    const amountControl = this.incomeDetailsForm.get('financialIncomeTypeAmount');
    if (amountControl?.invalid) {
      // Mark the field as touched to show validation errors
      amountControl.markAsTouched();
      return;
    }



    if (
      financialIncomeType &&
      financialIncomeTypeAmount !== null &&
      financialIncomeFrequency
    ) {
      const newIncome = {
        incomeType: financialIncomeType,
        amount: financialIncomeTypeAmount || 0,
        frequency: financialIncomeFrequency,
      };



      // const frequencyLookupId = this.frequencyMapId.get(financialIncomeFrequency);
      //  const incomeDescriptionId = this.incomeDescriptionMapId.get(financialIncomeType);
      //  console.log("incomeDescriptionId", incomeDescriptionId);



      const additionalIncome = {
          financialPositionIncomeId: 0,
          financialPositionBaseId: 0,
          additionalIncomeDescription: financialIncomeType,
          amtAdditionalIncome: financialIncomeTypeAmount || 0,
          additionalIncomeFrequency: financialIncomeFrequency,
          operationType: null
      }



      this.additionalIncomes.push(additionalIncome);



      // if(this.baseFormData?.financialPositionIncome  && this.mode === "edit") {
      //   console.log("Running If loop-------------------");
      //   this.baseSvc.setBaseDealerFormData({
      //      financialPositionIncome: [...this.baseFormData?.financialPositionIncome, ...this.additionalIncomes]
      //     // financialPositionIncome: [...this.additionalIncomes]
      //   });
      
      // }
      // else{
      // console.log("Running Else loop-------------------");
      // this.baseSvc.setBaseDealerFormData({
      //   // financialPositionIncome: [...this.additionalIncomes, ...this.baseFormData?.financialPositionIncome]
      //   financialPositionIncome: [...this.additionalIncomes]
      // });
      // }



      const existingIncomes = this.baseFormData?.financialPositionIncome || [];
      const isDuplicate = existingIncomes.some(
        (inc) =>
          inc.additionalIncomeDescription === additionalIncome.additionalIncomeDescription &&
          inc.amtAdditionalIncome === additionalIncome.amtAdditionalIncome &&
          inc.additionalIncomeFrequency === additionalIncome.additionalIncomeFrequency
      );



      if (!isDuplicate) {
        const updatedIncomeList = [...existingIncomes, additionalIncome];
        this.baseSvc.setBaseDealerFormData({
          financialPositionIncome: updatedIncomeList
        });
      }



      // console.log("financialPositionIncomeCheck>>>>>>>", this.baseFormData.financialPositionIncome, this.incomeDetails.value);
      this.addIncomeForm(newIncome);



      // Clear temporary fields
      this.incomeDetailsForm.get('financialIncomeType')?.reset();
      this.incomeDetailsForm.get('financialIncomeTypeAmount')?.reset();
      this.incomeDetailsForm.get('financialIncomeFrequency')?.reset();
    }
  }



  deleteRow(index: number): void {
    if (this.incomeDetails.length > 0) {



      const incomePositionId = this.incomeDetails.at(index).get('financialPositionIncomeId')?.value;



      const additionalIncomeDescription = this.incomeDetails.at(index).get('incomeType').value;



     // console.log("Deleting incomePositionId==>", incomePositionId, additionalIncomeDescription);



        if(incomePositionId > 0){
         this.svc.data
           .delete(
             `CustomerDetails/delete_customerFinancialPosition?FinancialPositionIncomeId=${incomePositionId}`,
           )
           .subscribe((res) => { });
         }



      this.incomeDetails.removeAt(index);



      let newIncomeDetails : any[] = []



      this.incomeDetails.value.forEach((item, index) => {
        if(index > 1){
        const additionalIncome = {
          financialPositionIncomeId: item.financialPositionIncomeId || 0,
          financialPositionBaseId: item.financialPositionBaseId || 0,
          additionalIncomeDescription: item.incomeType,
          amtAdditionalIncome: item.amount || 0,



          additionalIncomeFrequency: item.frequency,
          operationType: null
      }
  
          newIncomeDetails.push(additionalIncome)
        }
      })
    
  
      this.baseSvc.setBaseDealerFormData({
        financialPositionIncome: newIncomeDetails,
      });
    //  console.log(this.baseFormData.financialPositionIncome, this.incomeDetails.value)



      // this.baseSvc.setBaseDealerFormData({
      //   incomeDetails: this.incomeDetails.value,
      // });
    }
  }



  private addIncomeForm(income: {
    incomeType: string;
    amount: number;
    frequency: string;
    financialPositionIncomeId?: number;
    financialPositionBaseId?: number;
  }) {
    const incomeGroup = this.fb.group({
      // incomeType: [income.incomeType, Validators.required],
      incomeType: [income.incomeType],
      amount: [
  income.amount || 0,
  [Validators.max(999999999999999999.99)]  // Add max validator
        // [Validators.required, Validators.min(1)],
      ],
      // frequency: [income.frequency, Validators.required],
      frequency: [income.frequency, Validators.required],
      financialPositionIncomeId: [ income.financialPositionIncomeId || 0 ],
      financialPositionBaseId: [ income.financialPositionBaseId || 0 ],



    });



    if (income.incomeType === 'Take Home Pay') {
      incomeGroup.get('amount')?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(999999999999999999.99) // Add max validator
      ]);
    } else {
      incomeGroup.get('amount')?.setValidators([
        Validators.min(0),
        Validators.max(999999999999999999.9999) // Add max validator
      ]);
    }
    
    incomeGroup.get('amount')?.updateValueAndValidity();



    this.incomeDetails.push(incomeGroup);



    this.baseSvc.setBaseDealerFormData({
      incomeDetails: this.incomeDetails.value,
    });
    this.calculateTotalIncome();
  }



  textAreaValue(event: any): void {
   
    this.baseSvc.setBaseDealerFormData({
      details: this.incomeDetailsForm.get('myTextarea')?.value,
    });
  }




  // isIncomeDecrease(event: any): void {
  //  // console.log("isIncomeDecreaseevent", event);
  //   this.baseSvc.setBaseDealerFormData({
  //     isIncomeDecrease: this.incomeDetailsForm.get('isIncomeDecrease')?.value,
  //     details: this.incomeDetailsForm.get('myTextarea')?.value,
  //   });



  //   if(event.value === 'false'){
  //     this.incomeDetailsForm.get('myTextarea')?.disable();
  //     this.incomeDetailsForm.get('myTextarea')?.reset();
  //     this.baseSvc.setBaseDealerFormData({
  //       details: ''
  //     });
  //   }
  //   else{
  //     this.incomeDetailsForm.get('myTextarea')?.enable();



  //   }
  //  // console.log("this.incomeDetailsForm.get('isIncomeDecrease')?.value", this.incomeDetailsForm.get('isIncomeDecrease')?.value, this.baseFormData?.isIncomeDecrease);
  // }
  isIncomeDecrease(event: any): void {
    const isDecrease = event.value === 'true';
    this.isIncomeDecreaseValue = this.incomeDetailsForm.get('isIncomeDecrease')?.value;
    if (isDecrease) {
      this.incomeDetailsForm.get('myTextarea')?.setValidators([
        Validators.required,
        Validators.maxLength(255)
      ]);
      this.incomeDetailsForm.get('myTextarea')?.enable();
    } else {
      this.incomeDetailsForm.get('myTextarea')?.clearValidators();
      this.incomeDetailsForm.get('myTextarea')?.setValidators(Validators.maxLength(255));
      this.incomeDetailsForm.get('myTextarea')?.reset();
      this.incomeDetailsForm.get('myTextarea')?.disable();
    }
    
    this.incomeDetailsForm.get('myTextarea')?.updateValueAndValidity();
  
    this.baseSvc.setBaseDealerFormData({
      isIncomeDecrease: isDecrease,
      details: this.incomeDetailsForm.get('myTextarea')?.value,
    });
  }



updateAssetDetails(index: number): void {
  const incomeGroup = this.incomeDetails.at(index);



  if (incomeGroup) {
    // Handle negative values for amount field
    const amountControl = incomeGroup.get('amount');
    const currentValue = amountControl?.value;
  
    // Convert negative values to 0
    if (currentValue !== null && currentValue < 0) {
      amountControl?.setValue(0);
      return; // Exit early since the value change will trigger another update
    }


    const updatedIncome = {
      incomeType: incomeGroup.get('incomeType')?.value,
      amount: incomeGroup.get('amount')?.value,
      frequency: incomeGroup.get('frequency')?.value,
    };

    // Update financialPositionIncome array if it exists

    
    if(this.baseFormData.financialPositionIncome) {
      let updatedIncomes = this.baseFormData?.financialPositionIncome;
      
      updatedIncomes.forEach((income: any) => {
        if (income.financialPositionIncomeId === incomeGroup.get('financialPositionIncomeId')?.value) {
          income.amtAdditionalIncome = updatedIncome.amount || 0;
          income.additionalIncomeFrequency = updatedIncome.frequency;
        }
      });
       //   console.log("updatedIncomes", updatedIncomes);
    }

    // Update incomeDetails in base service


    this.baseSvc.setBaseDealerFormData({
      incomeDetails: this.incomeDetails.value,
    });
    // Recalculate total with monthly conversion
    this.calculateTotalIncome();
  }
}



  
  // calculateTotalIncome(): void {
  //   this.totalIncome = this.incomeDetails.value.reduce(
  //     (acc: number, income: any) => acc + (income.amount || 0),
  //     0
  //   );



  //   this.baseSvc.setBaseDealerFormData({
  //     totalIncome: this.totalIncome,
  //   });
  // }


/**
 * Calculates total monthly income by converting all income amounts to monthly equivalents
 * Uses frequency codes to determine conversion factor
 */
calculateTotalIncome(): void {
  // Check if any amount exceeds 18 digits
  const hasInvalidAmount = this.incomeDetails.value.some((income: any) => {
    if (income.amount === null || income.amount === undefined) return false;
    const amountStr = income.amount.toString().replace('.', '');
    return amountStr.length > 18;
  });


  if (hasInvalidAmount) {
    this.totalIncome = Infinity;
  } else {
    // Convert each income to monthly and sum them up
    this.totalIncome = this.incomeDetails.value.reduce(
      (acc: number, income: any) => {
        const rawAmount = income.amount || 0;
        const frequency = income.frequency;
        
        // Convert to monthly equivalent based on frequency
        const monthlyAmount = this.convertToMonthly(rawAmount, frequency);
        
        return acc + monthlyAmount;
      },
      0
    );
  }

  // Store the monthly-converted total income
  this.baseSvc.setBaseDealerFormData({
    totalIncome: this.totalIncome, // Now represents "Income (Monthly)"
  });
}




  override onStepChange(stepperDetails: any): void {



    if (stepperDetails?.validate) {
     // console.log("Income Details Form", this.incomeDetailsForm, this.incomeDetailsForm?.status);



      this.baseSvc.setBaseDealerFormData({
        incomeDetailValidator: true
      });



      let formStatus;



      // if (this.incomeDetailsForm) {
      //   formStatus = this.svc.proceedForm(this.incomeDetailsForm);
      //   this.baseSvc?.formStatusArr?.push(formStatus);
      // }
    }
    super.onStepChange(stepperDetails);



    this.baseSvc.updateComponentStatus("Financial Position", "IncomeDetailsComponent", this.incomeDetails.valid)
    
    if(this.baseSvc.showValidationMessage){
      let invalidPages = this.checkStepValidity()
      this.baseSvc.iconfirmCheckbox.next(invalidPages)
    }



    // this.checkStepValidity()



  }
}
