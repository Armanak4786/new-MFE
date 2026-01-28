import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BaseBusinessClass } from "../../../base-business.class";
import { BusinessService } from "../../../services/business";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { delay, Observable, of } from "rxjs";
import { CommonService, Mode, ValidationService } from "auro-ui";

@Component({
  selector: "app-business-email-contact-details",

  templateUrl: "./business-email-contact-details.component.html",
  styleUrl: "./business-email-contact-details.component.scss",
})
export class BusinessEmailContactDetailsComponent extends BaseBusinessClass {
  emailForm: FormGroup;

emailType = ["EmailBusiness", "EmailOther", "EmailHome"];
  noEmailCheck: boolean = false;
  activeStep: any;

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: BusinessService,
    private fb: FormBuilder,
    public validationSvc: ValidationService
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
            ], // Email pattern
          ],
          type: this.emailType[0],
          emailChk: false,
        }),
      ]),
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
override async ngOnInit(): Promise<void> {
  this.customForm = { form: this.emailForm };
  await super.ngOnInit();

  this.activeStep = this.baseSvc.activeStep;
  let params: any = this.route.snapshot.params;
  this.mode = params.mode || Mode.create;
  // Clear existing emails
  this.emails.clear();

  // Get email data from API response
  const emailData = this.baseFormData?.businessDetailEmail || 
                   this.baseFormData?.business?.emails || [];

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
          this.noEmailCheck = true;
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

  if(this.baseSvc.showValidationMessage){
    this.emails.markAllAsTouched();
  }
}


  isRequired(group: FormControl) {
    return group.hasValidator(Validators.required);
  }

  // onCheckboxChange(event: any, index: number) {
  //   const emailGroup = this.emails.at(index) as FormGroup;

  //   if (event.checked) {
  //     // Reset and disable the control
  //     emailGroup.get("value")?.reset();
  //     emailGroup.get("value")?.disable();
  //     this.noEmailCheck = true;
  //     emailGroup.get("value")?.removeValidators(Validators.required);
  //   } else {
  //     // Enable the control
  //     emailGroup.get("value")?.enable();
  //     emailGroup.get("value")?.addValidators(Validators.required);

  //     this.noEmailCheck = false;
  //   }
  // }

  onCheckboxChange(event: any, index: number) {
    const emailGroup = this.emails.at(index) as FormGroup;

    if (event.checked) {
        // Reset and disable the first email control
        emailGroup.get("value")?.reset();
        emailGroup.get("value")?.disable();
        this.noEmailCheck = true;
        emailGroup.get("value")?.removeValidators(Validators.required);

        // Remove all other email controls (if any exist)
        while (this.emails.length > 1) {
            this.emails.removeAt(this.emails.length - 1);
        }

        // Disable the "Add Other Email" button
        this.noEmailCheck = true;
    } else {
        // Enable the first email control
        emailGroup.get("value")?.enable();
        emailGroup.get("value")?.addValidators(Validators.required);
        this.noEmailCheck = false;
    }
    
    // Update the form data
    this.getvalue();
}

  override onStepChange(stepperDetails: any): void {
    if (stepperDetails?.validate) {
      let formStatus;
      if (this.emailForm) {
        // formStatus = this.svc.proceedForm(this.emailForm);

        // this.baseSvc.formStatusArr?.push(formStatus);
      }
    }
    super.onStepChange(stepperDetails);
    this.baseSvc.updateComponentStatus("Business Details", "BusinessEmailContactDetailsComponent", this.emails.valid)

    if(this.baseSvc.showValidationMessage){
      let invalidPages = this.checkStepValidity()
      this.baseSvc.iconfirmCheckbox.next(invalidPages)
    }
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
          Validators.maxLength(50)
        ], // Email pattern
      ],
      type: this.emailType[this.emails.length],
      emailChk: false,
    });
  }

  addOtherEmail() {
    if (this.emails.length < 3 && !this.noEmailCheck) {
      this.emails.push(this.createNewEmailForm());
    }
  }
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
    businessDetailEmail: formattedEmails
  });
  
}
  removeEmail(index) {
    this.emails.removeAt(index);

    this.getvalue();
  }

  // pageCode: string = "BusinessContactDeatilComponent";
  // modelName: string = "BusinessContactDeatilComponent";

  // override async onBlurEvent(event): Promise<void> {
  //   await this.updateValidation(event);
  // }

  // override async onValueEvent(event): Promise<void> {
  //   await this.updateValidation(event);
  // }

  // async updateValidation(event) {
  //   const req = {
  //     form: this.mainForm?.form,
  //     formConfig: this.formConfig,
  //     event: event,
  //     modelName: this.modelName,
  //     pageCode: this.pageCode,
  //   };

  //   var responses: any = await this.validationSvc.updateValidation(req);
  //   if (responses.formConfig && !responses.status) {
  //     this.formConfig = { ...responses.formConfig };

  //     // this.cdr.detectChanges();
  //     return false;
  //   }
  //   return true;
  // }
}
