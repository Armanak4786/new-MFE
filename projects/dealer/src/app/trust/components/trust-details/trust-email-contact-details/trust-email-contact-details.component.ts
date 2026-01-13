import { Component } from "@angular/core";
import { BaseTrustClass } from "../../../base-trust.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, Mode } from "auro-ui";
import { TrustService } from "../../../services/trust.service";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
@Component({
  selector: "app-trust-email-contact-details",
  templateUrl: "./trust-email-contact-details.component.html",
  styleUrl: "./trust-email-contact-details.component.scss",
})
export class TrustEmailContactDetailsComponent extends BaseTrustClass {
  emailForm: FormGroup;
 emailType = ["EmailBusiness", "EmailOther", "EmailHome"];
  emailChk: boolean = false;

  // override formConfig: GenericFormConfig = {
  //   autoResponsive: true,
  //   api: "",
  //   goBackRoute: "",
  //   cardType: "non-border",
  //   cardBgColor: "--background-color-secondary",
  //   fields: [
  //     {
  //       type: "array",
  //       name: "trustDetailsEmail",
  //       cols: 12,
  //       isTemplateFormData: false,
  //       isDelete: false,
  //       isAdd: false,
  //       fields: [
  //         {
  //           type: "text",
  //           label: "Email",
  //           name: "email",
  //           cols: 8,
  //           disabled: true,
  //           nextLine: false,
  //         },
  //         {
  //           type: "checkbox",
  //           name: "emailChk",
  //           cols: 3,
  //           label: "No Email",
  //           className: "pt-4",
  //         },
  //         {
  //           type: "deleteBtn",
  //           btnType: "non-bg-btn",
  //           submitType: "internal",
  //           name: "deleteBtn",
  //           icon: "fa-regular fa-trash-can text-base",
  //           cols: 1,
  //           nextLine: true,
  //         },
  //       ],
  //       templateFormFields: [
  //         {
  //           type: "text",
  //           label: "Email",
  //           name: "email",
  //           cols: 8,
  //           nextLine: false,
  //           //Validators: [Validators.required],
  //         },
  //         {
  //           type: "checkbox",
  //           name: "emailChk",
  //           cols: 3,
  //           label: "No Email",
  //           className: "pt-4",
  //         },

  //         {
  //           type: "addBtn",
  //           submitType: "internal",
  //           label: "Add Other Email",
  //           name: "addBtn",
  //           btnType: "plus-btn",
  //           cols: 6,
  //           className: "",
  //           nextLine: true,
  //         },
  //       ],
  //     },
  //   ],
  // };

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override trustSvc: TrustService,
    public fb: FormBuilder
  ) {
    super(route, svc, trustSvc);
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

  // override async ngOnInit(): Promise<void> {
  //   await super.ngOnInit();
  //   const data = this.transformEmailData(this.baseFormData?.trust?.emails);

  //   this.patchFormValue(data);
  //   if (this.mode == "edit") {
  //     this.emails.clear();

  //     // Loop through each email in baseFormData.business.emails
  //     this.baseFormData?.trust?.emails.forEach((ele) => {
  //       if (ele.value !== "") {
  //         // Add a new FormGroup (email control) for each valid email
  //         const emailControl = this.createEmailForm();

  //         // Push the newly created FormGroup to the FormArray
  //         this.emails.push(emailControl);

  //         // Patch the newly added control with the values from baseFormData
  //         emailControl.patchValue({
  //           value: ele.value,
  //           type: ele.type || null,
  //           emailChk: ele.emailChk || false,
  //         });
  //       }
  //     });
  //   } else {
  //     if (this.baseFormData?.trustDetailsEmail != undefined) {
  //       for (
  //         let i = this.emails.length;
  //         i != this.baseFormData?.trustDetailsEmail.length;
  //         i++
  //       ) {
  //         this.emails.push(this.createEmailForm());
  //       }
  //       this.emails.patchValue(this.baseFormData?.personalDetailsEmail);
  //     }
  //   }
  // }

override async ngOnInit(): Promise<void> {
  this.customForm = { form: this.emailForm };
  await super.ngOnInit();

  let params: any = this.route.snapshot.params;
  this.mode = params.mode || Mode.create;
  
  // Clear existing emails
  this.emails.clear();

  // Get email data from API response
  const emailData = this.baseFormData?.trustDetailsEmail || 
                   this.baseFormData?.trust?.emails || [];

  if (emailData.length > 0) {
    // FIXED: Sort emails to follow: EmailBusiness, EmailOther, EmailHome
    const typeOrder = ["EmailBusiness", "EmailOther", "EmailHome"];
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

        // Handle checkbox state
        if (emailCheck) {
          emailControl.get('value').clearValidators();
          emailControl.get('value').disable();
          emailControl.get('value').updateValueAndValidity();
          this.emailChk = true;
        }

        // FIXED: Patch with sorted type preserved
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

  if(this.trustSvc.showValidationMessage){
    this.emails.markAllAsTouched();
  }
}


  override onStepChange(stepperDetails: any): void {
    // console.log("onStepChange", stepperDetails.validate, this.emailForm);
    if (stepperDetails?.validate) {
      let formStatus;
      if (this.emailForm) {
      //   formStatus = this.svc.proceedForm(this.emailForm);
      //  // console.log(this.emailForm.status, this)
      //   this.trustSvc.formStatusArr.push(formStatus);
      }
    }
    super.onStepChange(stepperDetails);
    this.trustSvc.updateComponentStatus("Trust Details", "TrustEmailContactDetailsComponent", this.emails.valid)

    if(this.trustSvc.showValidationMessage){
      let invalidPages = this.checkStepValidity()
      this.trustSvc.iconfirmCheckbox.next(invalidPages)
    }
  }

  override onFormReady(): void {
    super.onFormReady();
  }

  transformEmailData(emailData: any[]) {
    return {
      trustDetailsEmail: emailData
        .filter((email) => email.value) // Remove empty values
        .map((email) => ({
          email: email.value, // Assign email value
          emailChk: false, // Set default false
        })),
    };
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

  onCheckboxChange(event: any, index: number) {
    const emailGroup = this.emails.at(index) as FormGroup;

    if (event.checked) {
        // Reset and disable the first email control
        emailGroup.get("value")?.reset();
        emailGroup.get("value")?.disable();
        this.emailChk = true;
        emailGroup.get("value")?.removeValidators(Validators.required);

        // Remove all other email controls (if any exist)
        while (this.emails.length > 1) {
            this.emails.removeAt(this.emails.length - 1);
        }

        // Disable the "Add Other Email" button
        this.emailChk = true;
    } else {
        // Enable the first email control
        emailGroup.get("value")?.enable();
        emailGroup.get("value")?.addValidators(Validators.required);
        this.emailChk = false;
    }
    
    // Update the form data
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
            Validators.maxLength(40),
          ],
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
          Validators.maxLength(40),
        ],
      ],
      type: this.emailType[this.emails.length],
      emailChk: false,
    });
  }

  get emails(): FormArray {
    return this.emailForm.get("emails") as FormArray;
  }

  shouldShowCheckbox(index: number): boolean {
    return index === 0; // Example: Show only for the first item
  }

  createNewEmailForm(): FormGroup {
    return this.fb.group({
      value: [
        "",
        [
          Validators.pattern(
            "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"
          ),
          Validators.maxLength(40),
        ],
      ],
      type: this.emailType[this.emails.length],
      emailChk: false,
    });
  }


  addOtherEmail() {
    if (this.emails.length < 3 && !this.emailChk) {
      this.emails.push(this.createNewEmailForm());
    }
  }
  // getvalue() {
  //   this.baseSvc.setBaseDealerFormData({
  //     trustDetailsEmail: this.emailForm.value.emails,
  //   });
  // }

getvalue() {
  // FIXED: Changed from this.emailForm.value.emails.map()
  // to this.emails.controls.map() to preserve exact types
  const formattedEmails = this.emails.controls.map((email: FormGroup) => {
    return {
      value: email.get('value')?.value || "",
      type: email.get('type')?.value,  // Preserve exact type from form control
      emailChk: email.get('emailChk')?.value
    };
  });

  this.baseSvc.setBaseDealerFormData({
    trustDetailsEmail: formattedEmails
  });

  console.log("Updated trustDetailsEmail:", formattedEmails, this.baseFormData?.trustDetailsEmail);
}

  removeEmail(index) {
    this.emails.removeAt(index);

    // Update the base form data after removing an email
    this.getvalue();
  }
}
