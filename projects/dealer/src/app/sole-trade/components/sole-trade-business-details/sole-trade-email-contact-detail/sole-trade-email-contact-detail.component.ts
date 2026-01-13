import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, Mode } from "auro-ui";
import { BaseSoleTradeClass } from "../../../base-sole-trade.class";
import { SoleTradeService } from "../../../services/sole-trade.service";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-sole-trade-email-contact-detail",
  templateUrl: "./sole-trade-email-contact-detail.component.html",
  styleUrl: "./sole-trade-email-contact-detail.component.scss",
})
export class SoleTradeEmailContactDetailComponent extends BaseSoleTradeClass {
//   constructor(
//     public override route: ActivatedRoute,
//     public override svc: CommonService,
//     override baseSvc: SoleTradeService
//   ) {
//     super(route, svc, baseSvc);
//   }
//   override formConfig: GenericFormConfig = {
//     autoResponsive: true,
//     api: "",
//     goBackRoute: "",
//     cardType: "non-border",
//     fields: [
//       {
//         type: "array",
//         name: "emailArr",
//         cols: 12,
//         isTemplateFormData: true,
//         isDelete: false,
//         isAdd: false,

//         fields: [
//           {
//             type: "text",
//             name: "email",
//             label: "Email",
//             cols: 6,
//           },
//           {
//             type: "checkbox",
//             name: "emailChk",
//             label: "No Email",
//             cols: 2,
//             className: "pt-4",
//           },
//           {
//             type: "deleteBtn",
//             btnType: "non-bg-btn",
//             submitType: "internal",
//             name: "deleteBtn",
//             icon: "fa-regular fa-trash-can text-base",
//             cols: 1,
//             nextLine: true,
//           },
//         ],
//         templateFormFields: [
//           {
//             type: "text",
//             name: "email",
//             label: "Email",
//             cols: 6,
//           },
//           {
//             type: "checkbox",
//             name: "emailChk",
//             label: "No Email",
//             cols: 2,
//             nextLine: true,
//             className: "pt-4",
//           },
//           {
//             type: "addBtn",
//             submitType: "internal",
//             label: "Add Other Email",
//             name: "addBtn",
//             btnType: "plus-btn",
//             cols: 4,
//             className: "",
//             nextLine: true,
//           },
//         ],
//       },
//     ],
//   };

//   override async onSuccess(data: any) {}

//   override onValueChanges(event: any): void {}
//   override onButtonClick(event: any): void {
//     const formArray = this.mainForm.getArrayControls(event?.field?.name);

//     if (formArray.length < 2) {
//       if (event?.field?.name == "emailArr") {
//         this.mainForm.addArrayControls(event?.field?.name);
//         this.customPatchFormArray(event, event?.templateFormData?.value);
//       }
//     }
//   }
// }

 emailForm: FormGroup;

  emailType = ["EmailHome", "EmailBusiness", "EmailOther"];
  emailLabels = ["Home Email", "Business Email", "Other Email"];
  emailChk: boolean = false;
  activeStep: number;

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: SoleTradeService,
    public fb: FormBuilder
  ) {
    super(route, svc, baseSvc);
    this.emailForm = this.fb.group({
      emails: this.fb.array([
        this.fb.group({
          value: [
            "",
            [
              Validators.required,
              Validators.pattern(
                "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
              ),
              Validators.maxLength(50),
              Validators.email,
            ],
          ],
          type: this.emailType[0],
          emailChk: false,
        }),
      ]),
    });
  }
  override onFormEvent(event: any): void {
    super.onFormEvent(event);
   
  }
  // override async ngOnInit(): Promise<void> {
  //   this.customForm = { form: this.emailForm };

  //   await super.ngOnInit();
    
  //   this.activeStep = this.baseSvc.activeStep;
  //   let params: any = this.route.snapshot.params;
  //   this.mode = params.mode;
  //   if (this.mode == "edit" || this.mode == "view") {
  //     this.emails.clear();

  //     // Loop through each email in baseFormData.business.emails
  //     if (
  //       this.baseFormData?.personalDetails?.emails[0]?.value &&
  //       !this.baseFormData?.personalDetailsEmail
  //     ) {
  //       this.baseFormData?.personalDetails?.emails.forEach((ele) => {
  //         if (ele.value !== "") {
  //           // Add a new FormGroup (email control) for each valid email
  //           const emailControl = this.createEmailForm();

  //           // Push the newly created FormGroup to the FormArray
  //           this.emails.push(emailControl);

  //           if(ele.emailChk){
  //             // emailControl.get('emailChk').removeValidators(Validators.required)
  //             emailControl.get('value').clearValidators()
  //             emailControl.get('value').disable()
  //             emailControl.get('value').updateValueAndValidity();
  //             this.emailChk = true
  //           }
  //           // Patch the newly added control with the values from baseFormData
  //           emailControl.patchValue({
  //             value: ele.value,
  //             type: ele.type || null,
  //             emailChk: ele.emailChk || false,
  //           });
  //         }
  //       });
  //     } else if (this.baseFormData?.personalDetailsEmail) {
  //       this.baseFormData?.personalDetailsEmail.forEach((ele) => {
         
  //         if (ele.value !== "") {

  //           if(ele.value !== undefined){

            
  //           // Add a new FormGroup (email control) for each valid email
  //           const emailControl = this.createEmailForm();

  //           // Push the newly created FormGroup to the FormArray
  //           this.emails.push(emailControl);

  //            if(ele.emailChk){
  //             // emailControl.get('emailChk').removeValidators(Validators.required)
  //             emailControl.get('value').clearValidators()
  //             emailControl.get('value').disable()
  //             emailControl.get('value').updateValueAndValidity();
  //             this.emailChk = true
  //           }

  //           // Patch the newly added control with the values from baseFormData
  //           emailControl.patchValue({
  //             value: ele.value,
  //             type: ele.type || null,
  //             emailChk: ele.emailChk || true,
  //           });
  //         }
  //         else{
  //            const emailControl = this.createEmailForm();

  //           // Push the newly created FormGroup to the FormArray
  //           this.emails.push(emailControl);

  //           //  if(ele.emailChk){
  //           //   emailControl.get('emailChk').clearValidators();
  //           //   emailControl.get('emailChk').updateValueAndValidity();

  //           // }
  //            if(ele.emailChk){
  //             // emailControl.get('emailChk').removeValidators(Validators.required)
  //             emailControl.get('value').clearValidators()
  //             emailControl.get('value').disable()
  //             emailControl.get('value').updateValueAndValidity();
  //             this.emailChk = true
  //           }

  //           // Patch the newly added control with the values from baseFormData
  //           emailControl.patchValue({
  //             value: ele.value,
  //             type: ele.type || null,
  //             emailChk: ele.emailChk || true,
  //           });
  //         }
  //       }
        
  //       });
  //     } else {
  //       this.emails.push(this.createEmailForm());
  //     }
  //   } else {
  //     // if (this.baseFormData?.personalDetailsEmail != undefined) {
  //     //   for (
  //     //     let i = this.emails.length;
  //     //     i != this.baseFormData?.personalDetailsEmail.length;
  //     //     i++
  //     //   ) {
  //     //     // this.emails.push(this.createEmailForm());
  //     //   }
  //     //   this.emails.patchValue(this.baseFormData?.personalDetailsEmail);
  //     // }
  //     if (this.baseFormData?.personalDetailsEmail) {
  //         this.emails.clear();
  //           this.baseFormData.personalDetailsEmail.forEach((email) => {
  //               const emailControl = this.createEmailForm();
  //               this.emails.push(emailControl);

  //               if(email.emailChk){
  //                   emailControl.get('value').clearValidators()
  //                   emailControl.get('value').disable()
  //                   emailControl.get('value').updateValueAndValidity();
  //                   this.emailChk = true 
  //               }
                
  //               emailControl.patchValue({
  //                   value: email.value, 
  //                   type: email.type || null,
  //                   emailChk: email.emailChk || false
  //               });
  //           });
  //       }
  //   }
  // }

    // override async ngOnInit(): Promise<void> {
    //   await super.ngOnInit();
    //   // Clear existing emails in the FormArray first
    //   this.activeStep = this.baseSvc.activeStep;
    //   let params: any = this.route.snapshot.params;
    //   this.mode = params.mode || Mode.create;
    //   if (this.mode == "edit") {
    //     this.emails.clear();
  
    //     let emailData = this.baseFormData?.personalDetailsEmail || this.baseFormData?.personalDetails?.emails;
        
  
    //     // Loop through each email in baseFormData.business.emails
    //     emailData.forEach((ele, index) => {
    //       if (ele.value !== "" || index === 0) {
    //         const emailControl = this.createEmailForm();
    //         this.emails.push(emailControl);
  
    //         let emailCheck = (ele.emailChk === true || ele.emailChk === false) ? ele.emailChk : !ele.value
  
    //         if(ele.emailChk || emailCheck){
    //           emailControl.get('value').clearValidators()
    //           emailControl.get('value').disable()
    //           emailControl.get('value').updateValueAndValidity();
    //           this.emailChk = true
              
    //         }
    //         emailControl.patchValue({
    //           value: ele.value,
    //           type: ele.type || null,
    //           emailChk: emailCheck,
    //         });
    //       }
    //     });
    //   } else {
    //      if (this.baseFormData?.personalDetailsEmail) {
    //         this.emails.clear();
    //           this.baseFormData.personalDetailsEmail.forEach((email) => {
    //               const emailControl = this.createEmailForm();
    //               this.emails.push(emailControl);
  
    //               if(email.emailChk){
    //                   emailControl.get('value').clearValidators()
    //                   emailControl.get('value').disable()
    //                   emailControl.get('value').updateValueAndValidity();
    //                   this.emailChk = true 
    //               }
                  
    //               emailControl.patchValue({
    //                   value: email.value, 
    //                   type: email.type || null,
    //                   emailChk: email.emailChk || false
    //               });
    //           });
    //       }
    //   }
    // }
     override async ngOnInit(): Promise<void> {
    this.customForm = { form: this.emailForm };
    await super.ngOnInit();

     

    this.activeStep = this.baseSvc.activeStep;
    let params: any = this.route.snapshot.params;
    this.mode = params.mode || Mode.create;
    
    // Clear existing emails
    this.emails.clear();

    // Get email data from API response
    const emailData = this.baseFormData?.personalDetailsEmail || 
                     this.baseFormData?.personalDetails?.emails || [];

  if (emailData.length > 0) {
    // FIXED: Sort emails to follow the order: EmailHome, EmailBusiness, EmailOther
    const typeOrder = ["EmailHome", "EmailBusiness", "EmailOther"];
    const sortedEmails = [...emailData].sort(
      (a, b) => typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type)
    );

    // Populate the form array with sorted emails
    sortedEmails.forEach(email => {
      if (email.value !== "") {
        const emailControl = this.createEmailForm();
        this.emails.push(emailControl);

        const emailCheck = (email.emailChk === true || email.emailChk === false) ? 
                          email.emailChk : !email.value;

        if (emailCheck) {
          emailControl.get('value').clearValidators();
          emailControl.get('value').disable();
          emailControl.get('value').updateValueAndValidity();
          this.emailChk = true;
        }

        emailControl.patchValue({
          value: email.value,
          type: email.type,  // Keep original type from sorted data
          emailChk: emailCheck
        });
      }
    });
  } else {
    // If no email data is available, add a default email form control
    this.emails.push(this.createEmailForm());
  }

    if(this.baseSvc.showValidationMessage){
      this.emails.markAllAsTouched()
    }
  }

  override onStepChange(stepperDetails: any): void {
    if (stepperDetails?.validate) {
      let formStatus;
      if (this.emailForm) {
        // formStatus = this.svc.proceedForm(this.emailForm);
        // this.baseSvc?.formStatusArr?.push(formStatus);
      }
    }
    super.onStepChange(stepperDetails);
    this.baseSvc.updateComponentStatus("Business Individual", "SoleTradeEmailContactDetailComponent", this.emails.valid)

    if(this.baseSvc.showValidationMessage){
      let invalidPages = this.checkStepValidity()
      this.baseSvc.iconfirmCheckbox.next(invalidPages)
    }
  }

  // onCheckboxChange(event: any, index: number) {
  //   const emailGroup = this.emails.at(index) as FormGroup;

  //   if (event.checked) {
  //     // Reset and disable the control
  //     emailGroup.get("value")?.reset();
  //     emailGroup.get("value")?.disable();
  //     this.emailChk = true;
  //     emailGroup.get("value")?.removeValidators(Validators.required);
  //   } else {
  //     // Enable the control
  //     emailGroup.get("value")?.enable();
  //     emailGroup.get("value")?.addValidators(Validators.required);
  //     this.emailChk = false;
  //   }
  // }

//   onCheckboxChange(event: any, index: number) {
//     const emailGroup = this.emails.at(index) as FormGroup;

//     if (event.checked) {
//         // Reset and disable the first email control
//         emailGroup.get("value")?.reset();
//         emailGroup.get("value")?.disable();
//         this.emailChk = true;
//         emailGroup.get("value")?.removeValidators(Validators.required);

//         // Remove all other email controls (if any exist)
//         while (this.emails.length > 1) {
//             this.emails.removeAt(this.emails.length - 1);
//         }

//         // Disable the "Add Other Email" button
//         this.emailChk = true;
//     } else {
//         // Enable the first email control
//         emailGroup.get("value")?.enable();
//         emailGroup.get("value")?.addValidators(Validators.required);
//         this.emailChk = false;
//     }
    
//     // Update the form data
//     this.getvalue();
// }
 onCheckboxChange(event: any, index: number) {
    const emailGroup = this.emails.at(index) as FormGroup;

    if (event.checked) {
      // Reset and disable the first email control
      emailGroup.get("value")?.reset();
      emailGroup.get("value")?.disable();
      this.emailChk = true;
      emailGroup.get("value")?.clearValidators();

      // Remove all other email controls (if any exist)
      while (this.emails.length > 1) {
        this.emails.removeAt(this.emails.length - 1);
      }
    } else {
      // Enable the first email control
      emailGroup.get("value")?.enable();
      emailGroup.get("value")?.addValidators([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"),
        Validators.maxLength(50)
      ]);
      emailGroup.get("value")?.updateValueAndValidity();
      this.emailChk = false;
    }
    
    this.getvalue();
  }


  isRequired(group: FormControl) {
    return group.hasValidator(Validators.required);
  }

    createEmailForm(): FormGroup {
    
    if(!this.emails.value[0]){
      return this.fb.group({
        value: [
          "",
          [
            Validators.required,
            Validators.pattern(
              "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"
            ),
            Validators.maxLength(50)
          ], // Email pattern
        ],
        type: this.emailType[this.emails.length],
        emailChk: false,
      });
    }
    return this.fb.group({
      value: [
        "",
        [
          Validators.pattern(
            "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"
          ),
          Validators.maxLength(50)
        ], // Email pattern
      ],
      // type: this.emailType[this.emails.length],
      type: [this.emailType[this.emails.length] || this.emailType[0]],
      emailChk: false,
    });
  }

  // createEmailForm(): FormGroup {
  //   return this.fb.group({
  //     value: [
  //       "",
  //       [
  //         Validators.required,
  //         Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"),
  //         Validators.maxLength(50)
  //       ]
  //     ],
  //     type: [this.emailType[this.emails.length] || this.emailType[0]],
  //     emailChk: [false]
  //   });
  // }

  

  get emails(): FormArray {
    return this.emailForm.get("emails") as FormArray;
  }

  getEmailLabel(type: string): string {
    const index = this.emailType.indexOf(type);
    return index >= 0 ? this.emailLabels[index] : 'Email';
  }

  shouldShowCheckbox(index: number): boolean {
    return index === 0; // Example: Show only for the first item
  }

  //  createNewEmailForm(): FormGroup {
  //   return this.fb.group({
  //     value: [
  //       "",
  //       [
  //         Validators.pattern(
  //           "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"
  //         ),
  //         Validators.maxLength(50)
  //       ], // Email pattern
  //     ],
  //     type: this.emailType[this.emails.length],
  //     emailChk: false,
  //   });
  // }

  createNewEmailForm(): FormGroup {
    return this.fb.group({
      value: [
        "",
        [
          Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"),
          Validators.maxLength(50)
        ]
      ],
      type: [this.emailType[this.emails.length] || this.emailType[0]],
      emailChk: [false]
    });
  }

  


  addOtherEmail() {
    if (this.emails.length < 3 && !this.emailChk) {
      this.emails.push(this.createNewEmailForm()); // Excludes `emailChk`
    }
  }
  // getvalue() {
  //   this.baseSvc.setBaseDealerFormData({
  //     personalDetailsEmail: this.emailForm.value.emails,
  //   });
  // }

getvalue() {
  const formattedEmails = this.emails.controls.map((email: FormGroup) => {
    return {
      value: email.get('value')?.value || "",
      type: email.get('type')?.value,  // Preserve exact type from form control
      emailChk: email.get('emailChk')?.value
    };
  });

    this.baseSvc.setBaseDealerFormData({
      personalDetailsEmail: formattedEmails
    });

  }
  
  // removeEmail(index) {
  //   this.emails.removeAt(index);
  //   this.baseSvc.setBaseDealerFormData({
  //     personalDetailsEmail: this.emailForm.value.emails,
  //   });
  // }
  removeEmail(index: number) {
    this.emails.removeAt(index);
    this.getvalue();
  }
}

