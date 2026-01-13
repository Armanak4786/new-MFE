// import { Component } from '@angular/core';
// import { BaseIndividualClass } from '../../../base-individual.class';
// import { ActivatedRoute } from '@angular/router';
// import { CommonService, GenericFormConfig } from 'auro-ui';
// import { IndividualService } from '../../../services/individual.service';
// import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';


// @Component({
//   selector: 'app-individual-liabilities',
//   templateUrl: './individual-liabilities.component.html',
//   styleUrls: ['./individual-liabilities.component.scss'],
// })
// export class IndividualLiabilitiesComponent extends BaseIndividualClass {
//   liabilitiesArray: any[] = [];
//   liabilitiesDetailsForm: FormGroup;
//   liabilitiesFrequencyOptions: any;
//   liabilitiesTypeOptions: any;
//   liabilitiesTotal: any;
//   private liabilityDescriptionMapId = new Map<number, string>();
//   private liabilitiesFields : any[] = []
//   residenceType: string = '';




//   constructor(
//     public override route: ActivatedRoute,
//     public override svc: CommonService,
//     override baseSvc: IndividualService,
//     private fb: FormBuilder
//   ) {


//     super(route, svc, baseSvc);
//     this.customForm = { form: this.liabilitiesDetailsForm };
//     this.liabilitiesDetailsForm = this.fb.group({
//       liabilitiesDetails: this.fb.array([]),
//       liabilityDescription: [''],
//       liabilitiesTypeAmount: [''],
//       liabilitiesFrequency: [''],
//       liabilitiesBalance: [''],
//     });
//   }


//   override async ngOnInit(): Promise<void> {
//     await super.ngOnInit();


//      this.residenceType = (this.baseFormData.physicalResidenceType || 
//                          this.baseFormData?.addressDetails?.physicalResidenceType || '')
//                          .toString().toLowerCase();
//     //console.log("Individual Liabilities Component Initialized",this.baseFormData);
//     let isLoaded = false;
//     let liabilitiesFrequencyRes = this.baseFormData.UdcFrequency;
//     this.liabilitiesFrequencyOptions = liabilitiesFrequencyRes
//     .map((item: any) => ({
//       name: item.lookupValue,
//       code: item.lookupId,
//     }));


//     let liabilitiesOptionRes = this.baseFormData.UdcExpenditureDescription;
//     this.liabilitiesTypeOptions = liabilitiesOptionRes
//     .filter((item: any) => item.lookupCode.includes("L"))
//     .map((item: any) => ({
//       name: item.lookupValue,
//       code: item.lookupId,
//     }));


//     this.liabilitiesFields = liabilitiesOptionRes
//     .filter((item: any) => item.lookupCode.includes("L"))
//     .map((item: any) => ({
//       name : item.lookupValue,
//       code : item.lookupId
//     }));


//     liabilitiesOptionRes.forEach(item => {
//       this.liabilityDescriptionMapId.set(item.lookupId, item.lookupValue);
//     });


//     this.filterLiabilitiesFields();


    
    
//     if (this.baseFormData.financialPositionLiability && this.baseFormData.financialPositionLiability.length > 0) {
//       this.baseFormData?.financialPositionLiability?.forEach((liability: any) => {
          
//         this.addLiabilitiesForm({
//           liabilityDescription: liability.liabilityDescription,
//           amtLiability: liability.amtLiability || 0,
//           amtBalanceLimit: liability.amtBalanceLimit || 0,
//           liabilityFrequency: liability.liabilityFrequency || 3533, // Default frequency
//           financialPositionLiabilityId: liability.financialPositionLiabilityId || 0,
//           financialPositionBaseId: liability.financialPositionBaseId || 0
//         });
//       });
//       }
//       else{
//         this.liabilitiesFields.forEach((liability:any) => {
//           this.addLiabilitiesForm({
//             liabilityDescription: liability.code,
//             amtLiability: 0,
//             liabilityFrequency: 3533, // Default frequency
//             amtBalanceLimit: 0,
//           })
//         })
//       }


//       this.calculateTotalIncome();
//       this.liabilitiesDetails.valueChanges.subscribe(changes => {
//         // console.log("Changes==",changes, this.liabilitiesDetails.value)
//         // this.baseSvc.setBaseDealerFormData({
//         //   financialPositionLiability: this.liabilitiesDetails.value
//         // })
//         this.updateFormData();
//         this.calculateTotalIncome();
//       });
    
//   }


//   private filterLiabilitiesFields() {
//   const residenceType = (this.baseFormData.physicalResidenceType || 
//                        this.baseFormData?.addressDetails?.physicalResidenceType || '').toString().toLowerCase();


//   // Filter out the appropriate Mortgage/Rent field based on residence type
//   this.liabilitiesFields = this.baseFormData.UdcExpenditureDescription
//     .filter((item: any) => {
//       if (item.lookupCode.includes("L")) {
//         const description = item.lookupValue.toLowerCase();
//         if (description === 'mortgage' || description === 'rent') {
//           if (residenceType === 'mortgage') {
//             return description === 'mortgage';
//           } else if (residenceType === 'renting') {
//             return description === 'rent';
//           }
//           return false; // Hide both if residence type is neither
//         }
//         return true; // Keep all other liabilities
//       }
//       return false;
//     })
//     .map((item: any) => ({
//       name: item.lookupValue,
//       code: item.lookupId
//     }));
// }


// // shouldShowLiability(liabilityDescriptionId: number): boolean {
// //   const description = this.liabilityDescriptionMapId.get(liabilityDescriptionId);
// //   const residenceType = (this.baseFormData.physicalResidenceType || 
// //                        this.baseFormData?.addressDetails?.physicalResidenceType || '').toString().toLowerCase();


// //   // For Mortgage/Rent fields
// //   if (description === 'Mortgage' || description === 'Rent') {
// //     if (residenceType === 'mortgage') {
// //       return description === 'Mortgage'; // Only show Mortgage
// //     } else if (residenceType === 'renting') {
// //       return description === 'Rent'; // Only show Rent
// //     }
// //     return false; // Hide both if residence type is neither
// //   }
// //   return true; // Show all other liabilities
// // }


// // Add these methods to your component class
// // shouldShowBalanceField(liabilityDescriptionId: number): boolean {
// //   const description = this.liabilityDescriptionMapId.get(liabilityDescriptionId)?.toLowerCase();
// //   return description === 'mortgage' && this.residenceType === 'mortgage';
// // }


// // shouldShowAmountField(liabilityDescriptionId: number): boolean {
// //   const description = this.liabilityDescriptionMapId.get(liabilityDescriptionId)?.toLowerCase();
// //   return description !== 'mortgage' || this.residenceType !== 'mortgage';
// // }


// shouldShowLiability(liabilityDescriptionId: number): boolean {
//     const description = this.liabilityDescriptionMapId.get(liabilityDescriptionId)?.toLowerCase();
    
//     // Special handling for Mortgage/Rent
//     if (description === 'mortgage' || description === 'rent') {
//       if (this.residenceType === 'mortgage') {
//         return description === 'mortgage';
//       } else if (this.residenceType === 'renting') {
//         return description === 'rent';
//       }
//       return false; // Hide both if residence type doesn't match
//     }
    
//     return true; // Show all other liabilities
//   }


//  getDisplayText(liabilityDescription: number): string {
//     const description = this.liabilityDescriptionMapId.get(liabilityDescription);
//     return description === 'Mortgage' || description === 'Rent' 
//            ? 'Mortgage/Rent' 
//            : description || '';
//   }



// // Call this whenever residence type changes
// // onResidenceTypeChange() {
// //   this.filterLiabilitiesFields();
  
// //   // Rebuild the form with the filtered fields
// //   const currentValues = this.liabilitiesDetails.value;
// //   this.liabilitiesDetails.clear();
  
// //   currentValues.forEach((liability: any) => {
// //     if (this.shouldShowLiability(liability.liabilityDescription)) {
// //       this.addLiabilitiesForm(liability);
// //     }
// //   });
  
// //   this.calculateTotalIncome();
// // }


//   get liabilitiesDetails(): FormArray {
//     return this.liabilitiesDetailsForm.get('liabilitiesDetails') as FormArray;
//   }


//   // ✅ Add a new row
//   addRow(): void {
//     const liabilityDescription =
//       this.liabilitiesDetailsForm.get('liabilityDescription')?.value;


//     const liabilitiesTypeAmount = this.liabilitiesDetailsForm.get(
//       'liabilitiesTypeAmount'
//     )?.value;
//     const liabilitiesFrequency = this.liabilitiesDetailsForm.get(
//       'liabilitiesFrequency'
//     )?.value;


//     const liabilitiesBalance =
//       this.liabilitiesDetailsForm.get('liabilitiesBalance')?.value;


//     if (
//       liabilityDescription &&
//       liabilitiesTypeAmount !== null &&
//       liabilitiesFrequency &&
//       liabilitiesBalance !== null
//     ) {
//       const newLiabilities = {
//         liabilityDescription: liabilityDescription,
//         amtLiability: liabilitiesTypeAmount || 0,
//         liabilityFrequency: liabilitiesFrequency,
//         amtBalanceLimit: liabilitiesBalance || 0, // Initialize amtBalanceLimit
//       };


//       this.addLiabilitiesForm(newLiabilities);


//       // Clear temporary fields
//       this.liabilitiesDetailsForm.get('liabilityDescription')?.reset();
//       this.liabilitiesDetailsForm.get('liabilitiesTypeAmount')?.reset();
//       this.liabilitiesDetailsForm.get('liabilitiesFrequency')?.reset();
//       this.liabilitiesDetailsForm.get('liabilitiesBalance')?.reset();
//     }
//   }


//   // ✅ Delete a row
//   deleteRow(index: number): void {
//     if (this.liabilitiesDetails.length > 0) {
//       this.liabilitiesDetails.removeAt(index);
//       this.liabilitiesArray.splice(index, 1); // Also remove from array
//     }
//     this.baseSvc.setBaseDealerFormData({
//       liabilitiesDetails: this.liabilitiesDetails.value,
//     });
//     this.calculateTotalIncome();
//   }


//   // ✅ Add Liabilities Object to Form
//   // private addLiabilitiesForm(liabilities:any) {
//   //   const incomeGroup = this.fb.group({
//   //     liabilityDescription: [
//   //       liabilities.liabilityDescription,
//   //       // Validators.required,
//   //     ],
//   //     amtLiability: [
//   //       liabilities.amtLiability,
//   //       //  [Validators.required, Validators.min(1)],
//   //     ],
//   //     liabilityFrequency: [
//   //       liabilities.liabilityFrequency,
//   //        Validators.required,
//   //     ],
//   //     amtBalanceLimit: [
//   //       liabilities.amtBalanceLimit,
//   //       //  [Validators.required, Validators.min(1)],
//   //     ],
//   //     financialPositionLiabilityId: [liabilities.financialPositionLiabilityId || 0]
//   //   });


//   //   const residenceType = this.baseFormData.physicalResidenceType || 
//   //                      this.baseFormData?.addressDetails?.physicalResidenceType;


//   // // Conditional validation for amtBalanceLimit
//   // if (residenceType !== "Mortgage") {
//   //   incomeGroup.get("amtBalanceLimit").clearValidators();
//   //   incomeGroup.get("amtBalanceLimit").updateValueAndValidity();
//   // } else {
//   //   incomeGroup.get("amtBalanceLimit").setValidators([
//   //     Validators.required,
//   //     Validators.min(1)
//   //   ]);
//   //   incomeGroup.get("amtBalanceLimit").updateValueAndValidity();
//   // }


//   // // Conditional validation for amtLiability
//   // if (residenceType === "Freehold") {
//   //   incomeGroup.get("amtLiability").clearValidators();
//   //   incomeGroup.get("amtLiability").updateValueAndValidity();
//   // } else {
//   //   incomeGroup.get("amtLiability").setValidators([
//   //     Validators.required,
//   //     Validators.min(1)
//   //   ]);
//   //   incomeGroup.get("amtLiability").updateValueAndValidity();
//   // }



//   //   // if (this.baseFormData.physicalResidenceType !== "Mortgage" || this.baseFormData?.addressDetails?.physicalResidenceType != "Mortgage") {
//   //   //   incomeGroup.get("amtLiability").setValidators([
     
//   //   //   ]);
//   //   // }
//   //   // else{
//   //   //   incomeGroup.get("amtLiability").setValidators([
//   //   //     Validators.required,
//   //   //     Validators.min(1),
//   //   //   ]);
//   //   // }
//   //   // if (this.baseFormData.physicalResidenceType === "Freehold" || this.baseFormData?.addressDetails?.physicalResidenceType === "Freehold") {
//   //   //   incomeGroup.get("amtBalanceLimit").setValidators([
//   //   //   ]);
//   //   // }


//   //   this.liabilitiesDetails.push(incomeGroup);
//   //   this.baseSvc.setBaseDealerFormData({
//   //     liabilitiesDetails: this.liabilitiesDetails.value,
//   //   });
//   //   this.calculateTotalIncome();
//   // }
//   private addLiabilitiesForm(liabilities: any) {
//     const balanceLimit = liabilities.amtBalanceLimit !== null ? liabilities.amtBalanceLimit : 0;
//     const incomeGroup = this.fb.group({
//       liabilityDescription: [liabilities.liabilityDescription],
//       amtLiability: [liabilities.amtLiability || 0],
//       liabilityFrequency: [liabilities.liabilityFrequency, Validators.required],
//       amtBalanceLimit: [balanceLimit],
//       financialPositionLiabilityId: [liabilities.financialPositionLiabilityId || 0],
//       financialPositionBaseId: [liabilities.financialPositionBaseId || 0]
//     });
  
//     // Get residence type in a case-insensitive way
//     const residenceType = (this.baseFormData.physicalResidenceType || 
//                          this.baseFormData?.addressDetails?.physicalResidenceType || '').toString().toLowerCase();
  
//     if (residenceType === "mortgage") {
     
//       incomeGroup.get("amtBalanceLimit")?.setValidators([
//         Validators.required,
//         Validators.min(1)
//       ]);
//       incomeGroup.get("amtLiability")?.clearValidators();
//     } 
//     else if (residenceType === "freehold") {
//       incomeGroup.get("amtLiability")?.clearValidators();
//       incomeGroup.get("amtBalanceLimit")?.clearValidators();
//     } 
//     else {
//       incomeGroup.get("amtLiability")?.setValidators([
//         Validators.required,
//         Validators.min(1)
//       ]);
//       incomeGroup.get("amtBalanceLimit")?.clearValidators();
//     }
  
//     incomeGroup.get("amtLiability")?.updateValueAndValidity();
//     incomeGroup.get("amtBalanceLimit")?.updateValueAndValidity();
  
//     this.liabilitiesDetails.push(incomeGroup);
//     this.baseSvc.setBaseDealerFormData({
//       liabilitiesDetails: this.liabilitiesDetails.value,
//     });
//     this.calculateTotalIncome();
//   }


//   // ✅ Update Liabilities Details on Input Change
//   // updateLiabilitiesDetails(index: number): void {
//   //   const liabilitiesGroup = this.liabilitiesDetails.at(index);


//   //   if (liabilitiesGroup) {
//   //     const updatedLiabilities = {
//   //       liabilitiesType: liabilitiesGroup.get('liabilitiesType')
//   //         ?.value,
//   //       amount: liabilitiesGroup.get('amount')
//   //         ?.value,
//   //       frequency: liabilitiesGroup.get(
//   //         'frequency'
//   //       )?.value,
//   //       balance: liabilitiesGroup.get('balance')
//   //         ?.value,
//   //     };


//   //     this.baseSvc.setBaseDealerFormData({
//   //       liabilitiesDetails: this.liabilitiesDetails.value,
//   //     });
//   //     this.calculateTotalIncome();
//   //   }
//   // }


//   private updateFormData() {
//     const sanitizedData = this.liabilitiesDetails.value.map(item => ({
//       ...item,
//       amtBalanceLimit: item.amtBalanceLimit !== null ? item.amtBalanceLimit : 0,
//       amtLiability: item.amtLiability || 0
//     }));
  
//     this.baseSvc.setBaseDealerFormData({
//       financialPositionLiability: sanitizedData
//     });
//   }


//   calculateTotalIncome(): void {
//     this.liabilitiesTotal = this.liabilitiesDetails.value.reduce(
//       (acc: number, liabilities: any) =>
//         acc + (liabilities.amtLiability || 0),
//       0
//     );


//     this.baseSvc.setBaseDealerFormData({
//       totalLiabilites: this.liabilitiesTotal,
//     });
//   }



//   override onStepChange(stepperDetails: any): void {


//     if (stepperDetails?.validate) {
//       let formStatus;
//      console.log("Liabilities Details Form", this.liabilitiesDetailsForm, this.liabilitiesDetailsForm?.status);
//       if (this.liabilitiesDetailsForm) {
//         formStatus = this.svc.proceedForm(this.liabilitiesDetailsForm);
//         this.baseSvc?.formStatusArr?.push(formStatus);
//       }
//     }
//     super.onStepChange(stepperDetails);
//   }


// }




import { Component } from '@angular/core';
import { BaseIndividualClass } from '../../../base-individual.class';
import { ActivatedRoute } from '@angular/router';
import { CommonService, GenericFormConfig } from 'auro-ui';
import { IndividualService } from '../../../services/individual.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';


@Component({
  selector: 'app-individual-liabilities',
  templateUrl: './individual-liabilities.component.html',
  styleUrls: ['./individual-liabilities.component.scss'],
})
export class IndividualLiabilitiesComponent extends BaseIndividualClass {
  liabilitiesArray: any[] = [];
  liabilitiesDetailsForm: FormGroup;
  liabilitiesFrequencyOptions: any;
  liabilitiesTypeOptions: any;
  liabilitiesTotal: any;
  liabilitiesBalanceLimitTotal: any;
  private liabilityDescriptionMapId = new Map<number, string>();
  private allLiabilitiesFields: any[] = [];
  residenceType: string = '';
   mandatoryBalanceLimitFlag: boolean = false;
  mandatoryAmountFlag: boolean = false;

  //  Fixed order for liabilities display
  private readonly LIABILITIES_ORDER = [
    'mortgage / rent',
    'loans',
    'credit cards',
    'other liabilities'
  ];

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: IndividualService,
    private fb: FormBuilder
  ) {
    super(route, svc, baseSvc);
    this.customForm = { form: this.liabilitiesDetailsForm };
    this.liabilitiesDetailsForm = this.fb.group({
      liabilitiesDetails: this.fb.array([]),
    });
  }


override async ngOnInit(): Promise<void> {
  await super.ngOnInit();


  this.residenceType = (this.baseFormData.physicalResidenceType || 
                       this.baseFormData?.addressDetails?.physicalResidenceType || '')
                       .toString().toLowerCase();


  let liabilitiesFrequencyRes = this.baseFormData.UdcFrequency;
  this.liabilitiesFrequencyOptions = liabilitiesFrequencyRes
    .map((item: any) => ({
      name: item.lookupValue,
      code: item.lookupId,
    }));


  // Store all liabilities fields
  this.allLiabilitiesFields = this.baseFormData.UdcExpenditureDescription
    .filter((item: any) => item.lookupCode.includes("L"))
    .map((item: any) => ({
      name: item.lookupValue,
      code: item.lookupId,
      lookupValue: item.lookupValue.toLowerCase()
    })).sort((a, b) => this.getSortOrder(a.lookupValue) - this.getSortOrder(b.lookupValue));


  // Create mapping for liability descriptions
  this.baseFormData.UdcExpenditureDescription.forEach(item => {
    this.liabilityDescriptionMapId.set(item.lookupId, item.lookupValue);
  });


  // Initialize form with all liabilities
  this.initializeLiabilitiesForm();
  
  this.calculateTotals(); 
  this.liabilitiesDetails.valueChanges.subscribe(() => {
    this.updateFormData();
    this.calculateTotals();
  });
  // Subscribe to residence type changes to update validation dynamically
  this.baseSvc
    .getBaseDealerFormData()
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      const newResidenceType = (data?.physicalResidenceType || 
                                data?.addressDetails?.physicalResidenceType || '')
                                .toString().toLowerCase();
      
      // Only update if residence type actually changed
      if (newResidenceType !== this.residenceType) {
        console.log(`Residence type changed from "${this.residenceType}" to "${newResidenceType}"`);
        this.residenceType = newResidenceType;
        
        // Update which liabilities are shown/hidden
        this.updateLiabilityVisibility();
        
        // Update validation rules for Mortgage/Rent field
        this.updateValidationForAllRows();
      }
    });

  if(this.baseSvc.showValidationMessage){
    this.liabilitiesDetails.markAllAsTouched();
  }
}

/**
 *  Update validation rules when residence type changes
 * This ensures Mortgage/Rent field has correct mandatory rules dynamically
 * AND shows validation errors immediately
 */
private updateValidationForAllRows(): void {
  this.liabilitiesDetails.controls.forEach((formGroup: FormGroup) => {
    const descriptionId = formGroup.get('liabilityDescription')?.value;
    const description = this.liabilityDescriptionMapId.get(descriptionId)?.toLowerCase();
    const isMortgageRentField = description === 'mortgage' || description === 'rent';
    
    if (isMortgageRentField) {
      // Clear existing validators first
      formGroup.get('amtLiability')?.clearValidators();
      formGroup.get('amtBalanceLimit')?.clearValidators();
      formGroup.get('liabilityFrequency')?.clearValidators();
      
      // Reapply validation based on new residence type
      this.applyMortgageRentValidation(formGroup);
      
      // Force validation check with emitEvent: false to avoid infinite loop
      formGroup.get('amtLiability')?.updateValueAndValidity({ emitEvent: false });
      formGroup.get('amtBalanceLimit')?.updateValueAndValidity({ emitEvent: false });
      formGroup.get('liabilityFrequency')?.updateValueAndValidity({ emitEvent: false });
      
      // Mark fields as touched AND dirty to show errors immediately
      formGroup.get('amtLiability')?.markAsTouched();
      formGroup.get('amtLiability')?.markAsDirty();
      formGroup.get('amtBalanceLimit')?.markAsTouched();
      formGroup.get('amtBalanceLimit')?.markAsDirty();
      formGroup.get('liabilityFrequency')?.markAsTouched();
      formGroup.get('liabilityFrequency')?.markAsDirty();
      
      console.log(`Updated validation for ${description} - Residence Type: ${this.residenceType}`);
    }
  });
  
  this.liabilitiesDetails.markAllAsTouched();
}


/**
 * Update which liability fields are visible
 * Show/hide Mortgage vs Rent based on residence type
 */
private updateLiabilityVisibility(): void {
  // Get current form values
  const currentValues = this.liabilitiesDetails.value;
  
  // Re-initialize form with updated visibility logic
  this.initializeLiabilitiesForm();
  
  // Restore values for fields that are still visible
  this.liabilitiesDetails.controls.forEach((formGroup: FormGroup, index) => {
    const descriptionId = formGroup.get('liabilityDescription')?.value;
    const matchingValue = currentValues.find(
      (v: any) => v.liabilityDescription === descriptionId
    );
    
    if (matchingValue) {
      formGroup.patchValue(matchingValue, { emitEvent: false });
    }
  });
  
  this.calculateTotals();
}


  // method to get sort order based on fixed order
  private getSortOrder(lookupValue: string): number {
    const normalizedValue = lookupValue.toLowerCase();
    
    // Handle mortgage/rent - both should be first
    if (normalizedValue === 'mortgage' || normalizedValue === 'rent') {
      return 0;
    }
    
    const index = this.LIABILITIES_ORDER.findIndex(order => 
      normalizedValue.includes(order.replace(' / ', ''))
    );
    
    return index === -1 ? 999 : index;
  }

private initializeLiabilitiesForm() {
  // Get all liabilities that should be in the form
  const allLiabilities = this.getAllLiabilitiesForForm();
  

  if (this.baseFormData.financialPositionLiability && this.baseFormData.financialPositionLiability.length > 0) {
    // Map existing data to our form structure
    const existingLiabilities = allLiabilities.map(liability => {
      const existing = this.baseFormData.financialPositionLiability.find(
        (item: any) => item.liabilityDescription === liability.code
      );
      
      if (existing) {
        return {
          liabilityDescription: existing.liabilityDescription,
          amtLiability: existing.amtLiability || 0,
          amtBalanceLimit: existing.amtBalanceLimit || 0,
          liabilityFrequency: existing.liabilityFrequency || 3533,
          financialPositionLiabilityId: existing.financialPositionLiabilityId, // Preserve existing ID
          financialPositionBaseId: existing.financialPositionBaseId // Preserve existing ID
        };
      }
      
      // Only create new record with 0 IDs if no existing record found
      return {
        liabilityDescription: liability.code,
        amtLiability: 0,
        amtBalanceLimit: 0,
        liabilityFrequency: 3533,
        financialPositionLiabilityId: 0,
        financialPositionBaseId: 0
      };
    });


    // Clear existing form array
    while (this.liabilitiesDetails.length) {
      this.liabilitiesDetails.removeAt(0);
    }


    // Add all liabilities to form
    existingLiabilities.forEach(liability => {
      this.addLiabilitiesForm(liability);
    });
  } else {
    // Initialize with default values for all liabilities
    while (this.liabilitiesDetails.length) {
      this.liabilitiesDetails.removeAt(0);
    }


    allLiabilities.forEach(liability => {
      this.addLiabilitiesForm({
        liabilityDescription: liability.code,
        amtLiability: 0,
        liabilityFrequency: 3533, // Default frequency
        amtBalanceLimit: 0,
        financialPositionLiabilityId: 0,
        financialPositionBaseId: 0
      });
    });
  }

  // Mark all controls as touched and dirty immediately 
  this.liabilitiesDetails.markAllAsTouched();
  this.liabilitiesDetails.controls.forEach((formGroup: FormGroup) => {
    formGroup.get('amtLiability')?.markAsTouched();
    formGroup.get('amtLiability')?.markAsDirty();
    formGroup.get('amtBalanceLimit')?.markAsTouched();
    formGroup.get('amtBalanceLimit')?.markAsDirty();
    formGroup.get('liabilityFrequency')?.markAsTouched();
    formGroup.get('liabilityFrequency')?.markAsDirty();
  });
}

/**
 *  Helper method to determine if validation error should be shown
 * Shows errors when field is invalid AND (touched OR dirty OR showValidationMessage is true)
 */
shouldShowError(formGroup: any, fieldName: string): boolean {
  const field = formGroup.get(fieldName);
  if (!field) return false;
  
  return field.invalid && (
    field.touched || 
    field.dirty || 
    this.baseSvc.showValidationMessage
  );
}


  private getAllLiabilitiesForForm() {
    return this.allLiabilitiesFields.filter(liability => {
      // Always include non-mortgage/rent liabilities
      if (!['mortgage', 'rent'].includes(liability.lookupValue)) {
        return true;
      }
      
      // Include mortgage only if residence type is mortgage
      if (liability.lookupValue === 'mortgage' && this.residenceType === 'mortgage') {
        return true;
      }
      
      // Include rent for all other residence types
      if (liability.lookupValue === 'rent' && this.residenceType !== 'mortgage') {
        return true;
      }
      
      return false;
    });
  }


  get liabilitiesDetails(): FormArray {
    return this.liabilitiesDetailsForm.get('liabilitiesDetails') as FormArray;
  }

  // ✅ Add a new row
  addRow(): void {
    const liabilityDescription =
      this.liabilitiesDetailsForm.get('liabilityDescription')?.value;

    const liabilitiesTypeAmount = this.liabilitiesDetailsForm.get(
      'liabilitiesTypeAmount'
    )?.value;
    const liabilitiesFrequency = this.liabilitiesDetailsForm.get(
      'liabilitiesFrequency'
    )?.value;

    const liabilitiesBalance =
      this.liabilitiesDetailsForm.get('liabilitiesBalance')?.value;

    if (
      liabilityDescription &&
      liabilitiesTypeAmount !== null &&
      liabilitiesFrequency &&
      liabilitiesBalance !== null
    ) {
      const newLiabilities = {
        liabilityDescription: liabilityDescription,
        amtLiability: liabilitiesTypeAmount || 0,
        liabilityFrequency: liabilitiesFrequency,
        amtBalanceLimit: liabilitiesBalance || 0, // Initialize amtBalanceLimit
      };

      this.addLiabilitiesForm(newLiabilities);

      // Clear temporary fields
      this.liabilitiesDetailsForm.get('liabilityDescription')?.reset();
      this.liabilitiesDetailsForm.get('liabilitiesTypeAmount')?.reset();
      this.liabilitiesDetailsForm.get('liabilitiesFrequency')?.reset();
      this.liabilitiesDetailsForm.get('liabilitiesBalance')?.reset();
    }
  }

  deleteRow(index: number): void {
    if (this.liabilitiesDetails.length > 0) {
      this.liabilitiesDetails.removeAt(index);
    }
    this.updateFormData();
    this.calculateTotals();
  }


  private addLiabilitiesForm(liabilities: any) {
    const incomeGroup = this.fb.group({
      liabilityDescription: [liabilities.liabilityDescription],
      // Add max validator for amtLiability field
      amtLiability: [liabilities.amtLiability || 0, [Validators.max(999999999999999999.99)]],
      liabilityFrequency: [liabilities.liabilityFrequency, Validators.required],
      // Add max validator for amtBalanceLimit field
      amtBalanceLimit: [liabilities.amtBalanceLimit || 0, [Validators.max(999999999999999999.99)]],
      financialPositionLiabilityId: [liabilities.financialPositionLiabilityId || 0],
      financialPositionBaseId: [liabilities.financialPositionBaseId || 0]
    });
  
    const description = this.liabilityDescriptionMapId.get(liabilities.liabilityDescription)?.toLowerCase();
    const isMortgageRentField = description === 'mortgage' || description === 'rent';    
    // Apply conditional validation ONLY to Mortgage/Rent field
    if (isMortgageRentField) {
      this.applyMortgageRentValidation(incomeGroup);
    }

    incomeGroup.get("amtLiability")?.updateValueAndValidity();
    incomeGroup.get("amtBalanceLimit")?.updateValueAndValidity();

    this.liabilitiesDetails.push(incomeGroup);
  }

  //Conditional validation logic for Mortgage/Rent field only
  private applyMortgageRentValidation(formGroup: FormGroup) {
    // Get residence type from baseFormData.physicalResidenceType
    const residenceType = (this.baseFormData.physicalResidenceType || '').toString().toLowerCase();

    if (residenceType === "mortgage") {
      // Mortgage: Balance/Limit, Amount, and Frequency are mandatory
      formGroup.get("amtBalanceLimit")?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(999999999999999999.99)
      ]);
      formGroup.get("amtLiability")?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(999999999999999999.99)
      ]);
      formGroup.get("liabilityFrequency")?.setValidators([Validators.required]);
    } 
    else if (residenceType === "freehold") {
      // Freehold: All optional (only max validator)
      formGroup.get("amtLiability")?.setValidators([Validators.max(999999999999999999.99)]);
      formGroup.get("amtBalanceLimit")?.setValidators([Validators.max(999999999999999999.99)]);
      formGroup.get("liabilityFrequency")?.setValidators([Validators.required]);
    } 
    else {
      // None, Renting, Living with Parents, Boarding, Living in Caravan Park/Hostel, Unknown
      // Amount and Frequency are mandatory, Balance/Limit is optional
      formGroup.get("amtLiability")?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(999999999999999999.99)
      ]);
      formGroup.get("amtBalanceLimit")?.setValidators([Validators.max(999999999999999999.99)]);
      formGroup.get("liabilityFrequency")?.setValidators([Validators.required]);
    }
  }

  updateLiabilityDetails(index: number): void {
    const liabilitiesGroup = this.liabilitiesDetails.at(index);

    if (liabilitiesGroup) {
      this.updateFormData();
      this.calculateTotals();
    }
  }

  private updateFormData() {
    
    this.liabilitiesDetails.controls.forEach((control: FormGroup) => {
      const descriptionId = control.get('liabilityDescription')?.value;
        
      if (!this.shouldShowLiability(descriptionId)) {
        // This field is hidden - remove all validators except max
        control.get('amtLiability')?.setValidators([Validators.max(999999999999999999.9999)]);
        control.get('amtLiability')?.updateValueAndValidity();
        
        control.get('amtBalanceLimit')?.setValidators([Validators.max(999999999999999999.9999)]);
        control.get('amtBalanceLimit')?.updateValueAndValidity();
        
        control.get('liabilityFrequency')?.clearValidators();
        control.get('liabilityFrequency')?.updateValueAndValidity();
      }
    });

    // Prepare the payload data
    const allLiabilitiesData = this.allLiabilitiesFields.map(liability => {
      const existingInForm = this.liabilitiesDetails.value.find(
        (item: any) => item.liabilityDescription === liability.code
      );

      const existingInOriginalData = this.baseFormData.financialPositionLiability?.find(
        (item: any) => item.liabilityDescription === liability.code
      );

      if (existingInForm) {
        return {
          ...existingInForm,
          financialPositionLiabilityId: existingInOriginalData?.financialPositionLiabilityId || 0,
          financialPositionBaseId: existingInOriginalData?.financialPositionBaseId || 0
        };
      } 
      else if (existingInOriginalData) {
        return {
          liabilityDescription: existingInOriginalData.liabilityDescription,
          amtLiability: 0,
          amtBalanceLimit: 0,
          liabilityFrequency: 3533,
          financialPositionLiabilityId: existingInOriginalData.financialPositionLiabilityId,
          financialPositionBaseId: existingInOriginalData.financialPositionBaseId
        };
      } 
      else {
        return {
          liabilityDescription: liability.code,
          amtLiability: 0,
          amtBalanceLimit: 0,
          liabilityFrequency: 3533,
          financialPositionLiabilityId: 0,
          financialPositionBaseId: 0
        };
      }
    });

    this.baseSvc.setBaseDealerFormData({
      financialPositionLiability: allLiabilitiesData
    });
  }

// Calculate totals correctly for graphs with frequency conversion

calculateTotals(): void {
  // Check if any Balance/Limit exceeds 18 digits
  const hasInvalidBalanceLimit = this.liabilitiesDetails.value.some((liability: any) => {
    if (liability.amtBalanceLimit !== null && liability.amtBalanceLimit !== undefined) {
      const amtBalanceLimitStr = liability.amtBalanceLimit.toString().replace('.', '');
      if (amtBalanceLimitStr.length > 18) return true;
    }
    return false;
  });

  // Check if any Amount exceeds 18 digits
  const hasInvalidAmount = this.liabilitiesDetails.value.some((liability: any) => {
    if (liability.amtLiability !== null && liability.amtLiability !== undefined) {
      const amtLiabilityStr = liability.amtLiability.toString().replace('.', '');
      if (amtLiabilityStr.length > 18) return true;
    }
    return false;
  });

 
  // CALCULATION 1: Balance/Limit Total (for Liabilities Total graph - Category 1)
  if (hasInvalidBalanceLimit) {
    this.liabilitiesBalanceLimitTotal = Infinity;
  } else {
    // Balance/Limit (for Liabilities Total graph) - DIRECT SUM, NO CONVERSION
    this.liabilitiesBalanceLimitTotal = this.liabilitiesDetails.value.reduce(
      (acc: number, liability: any) => acc + (liability.amtBalanceLimit || 0),
      0
    );
  }

  // CALCULATION 2: Monthly Amount Total (for Expenditure Monthly graph - Category 2)
  let liabilitiesMonthlyTotal = 0;
  
  if (hasInvalidAmount) {
    liabilitiesMonthlyTotal = Infinity;
  } else {
    // Calculate monthly-converted Liabilities Amount for Expenditure graph
    this.liabilitiesDetails.value.forEach((liability: any) => {
      const amount = liability.amtLiability || 0;
      const frequency = liability.liabilityFrequency;
      
      // Convert to monthly based on frequency
      let monthlyAmount = amount;
      if (amount && amount !== 0) {
        switch (frequency) {
          case 3533: 
            monthlyAmount = amount * 4.33; 
            break;   // Weekly
          case 3534: 
            monthlyAmount = amount * 2.17; 
            break;   // Fortnightly
          case 3535: 
            monthlyAmount = amount; 
            break;          // Monthly
          case 4017: 
            monthlyAmount = amount / 3; 
            break;      // Quarterly
          default: 
            monthlyAmount = amount; 
            break;
        }
      }
      
      liabilitiesMonthlyTotal += monthlyAmount;
    });
  }
  this.baseSvc.setBaseDealerFormData({
    totalLiabilitiesBalanceLimit: this.liabilitiesBalanceLimitTotal,  // For Liabilities (Total) graph
    totalLiabilitiesMonthly: liabilitiesMonthlyTotal  // For Expenditure (Monthly) graph - NEW!
  });
}


  shouldShowLiability(liabilityDescriptionId: number): boolean {
    const description = this.liabilityDescriptionMapId.get(liabilityDescriptionId)?.toLowerCase();
    
    // Always show non-mortgage/rent liabilities
    if (!['mortgage', 'rent'].includes(description || '')) {
      return true;
    }
    
    // Show mortgage only if residence type is mortgage
    if (description === 'mortgage' && this.residenceType === 'mortgage') {
      return true;
    }
    
    // Show rent only if residence type is not mortgage
    if (description === 'rent' && this.residenceType !== 'mortgage') {
      return true;
    }
    
    return false;
  }

  getDisplayText(liabilityDescription: number): string {
    const description = this.liabilityDescriptionMapId.get(liabilityDescription);
    return description === 'Mortgage' || description === 'Rent' 
           ? 'Mortgage / Rent' 
           : description || '';
  }

  // Check if this is Mortgage/Rent field and if Balance/Limit should be mandatory
  shouldShowBalanceLimitMandatory(liabilityDescriptionId: number): boolean {
    const description = this.liabilityDescriptionMapId.get(liabilityDescriptionId)?.toLowerCase();
    const isMortgageRent = description === 'mortgage' || description === 'rent';
    if (!isMortgageRent) return false;

    const currentResidenceType = (this.baseFormData.physicalResidenceType || '').toString().toLowerCase();
    
    // Balance/Limit is mandatory only when residence type is "Mortgage"
    return currentResidenceType === 'mortgage';
  }

  // Check if this is Mortgage/Rent field and if Amount should be mandatory
  shouldShowAmountMandatory(liabilityDescriptionId: number): boolean {
    const description = this.liabilityDescriptionMapId.get(liabilityDescriptionId)?.toLowerCase();
    const isMortgageRent = description === 'mortgage' || description === 'rent';
    
    if (!isMortgageRent) return false;
    
    // Get residence type from baseFormData.physicalResidenceType
    const currentResidenceType = (this.baseFormData.physicalResidenceType || '').toString().toLowerCase();
    
    // Amount is mandatory for these residence types 
    const mandatoryAmountResidenceTypes = [
      'mortgage',
      'none',
      'renting',
      'living with parents',
      'boarding',
      'living in caravan park / hostel',
      'living in caravan park/hostel',
      'unknown'
    ];
    
    return mandatoryAmountResidenceTypes.includes(currentResidenceType);
  }

  override onStepChange(stepperDetails: any): void {
    console.log("Liabilities Details Form", this.liabilitiesDetailsForm, this.liabilitiesDetailsForm?.status);
    if (stepperDetails?.validate) {
      let formStatus;
      if (this.liabilitiesDetailsForm) {
        // formStatus = this.svc.proceedForm(this.liabilitiesDetailsForm);
        // this.baseSvc?.formStatusArr?.push(formStatus);
      }
    }
    super.onStepChange(stepperDetails);

    this.baseSvc.updateComponentStatus("Financial Position", "IndividualLiabilitiesComponent", this.liabilitiesDetails.valid)

    if(this.baseSvc.showValidationMessage){
      let invalidPages = this.checkStepValidity()
      this.baseSvc.iconfirmCheckbox.next(invalidPages)
    }
  }
}
