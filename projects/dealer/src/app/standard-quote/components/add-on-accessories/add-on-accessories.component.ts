import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { CommonService } from "auro-ui";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { ToasterService, ValidationService } from "auro-ui";
import { InsuranceRequirementComponent } from "./component/insurance-requirement/insurance-requirement.component";
import { AccessoriesComponent } from "./component/accessories/accessories.component";
import { ServicePlanComponent } from "./component/service-plan/service-plan.component";
import { AbstractControl, FormArray, FormGroup } from "@angular/forms";

@Component({
  selector: "app-add-on-accessories",
  templateUrl: "./add-on-accessories.component.html",
  styleUrl: "./add-on-accessories.component.scss",
})
export class AddOnAccessoriesComponent extends BaseStandardQuoteClass {
  total = 0;
   @ViewChild(InsuranceRequirementComponent)
  insuranceRequirementComponent: InsuranceRequirementComponent;
  
  @ViewChild(ServicePlanComponent)
  servicePlanComponent: ServicePlanComponent;
  
  @ViewChild(AccessoriesComponent)
  accessoriesComponent: AccessoriesComponent;
  
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: StandardQuoteService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
  }

  productCode : any;
  // override mode: Mode | string = Mode.create;

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();

    this.baseSvc.accessoriesSubject.subscribe((res) => {
      this.total =
        (res.subTotalServicePlanValue || 0) +
        (res.subTotalInsuranceRequirementValue || 0) +
        (res.subTotalAccesoriesValue || 0);
    });

    this.productCode = sessionStorage?.getItem("productCode");
  }

  redirectToHome() {
     this.svc?.ui?.showOkDialog(
      "Any unsaved changes will be lost. Are you sure you want to cancel?",
      "Cancel Add Ons ",
      () => {
    this.svc.router.navigateByUrl("/standard-quote");
      })
  }

  override onFormDataUpdate(res: any): void {
    // if (
    //   res?.changedField?.subTotalServicePlanValue ||
    //   res?.changedField?.subTotalInsuranceRequirementValue ||
    //   res?.changedField?.subTotalAccesoriesValue
    // ) {
    //   this.total =
    //     (res.subTotalServicePlanValue || 0) +
    //     (res.subTotalInsuranceRequirementValue || 0) +
    //     (res.subTotalAccesoriesValue || 0);
    // }
  }
private validateChildForms(): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];
  let isValid = true;

  
  if (this.servicePlanComponent?.servicePlanForm) {
    const servicePlanForm = this.servicePlanComponent.servicePlanForm;
    
    
    this.markFormGroupTouched(servicePlanForm);
    
    if (servicePlanForm.invalid) {
      isValid = false;
      
      
      const servicePlanArray = servicePlanForm.get('servicePlan') as FormArray;
      if (servicePlanArray && servicePlanArray.controls) {
        servicePlanArray.controls.forEach((control: AbstractControl, index: number) => {
          
          const formGroup = control as FormGroup;
          const amountValue = formGroup.get('amount')?.value;
          const monthsControl = formGroup.get('months');
          const nameValue = formGroup.get('name')?.value;
          const descriptionControl = formGroup.get('description');
          
         
          if (amountValue > 0 && nameValue !== 'Other Service Plan' && 
              monthsControl?.invalid) {
            missingFields.push('Service Plan Months');
          }
          
          
          if (amountValue > 0 && nameValue === 'Other Service Plan' && 
              descriptionControl?.invalid) {
            missingFields.push('Service Plan Description');
          }
        });
      }

      // Also check registrations FormArray
      const registrationsArray = servicePlanForm.get('registrations') as FormArray;
      if (registrationsArray && registrationsArray.controls) {
        registrationsArray.controls.forEach((control: AbstractControl, index: number) => {
          const formGroup = control as FormGroup;
          const amountValue = formGroup.get('amount')?.value;
          const monthsControl = formGroup.get('months');
          
          if (amountValue > 0 && monthsControl?.invalid) {
            missingFields.push('Registration Months');
          }
        });
      }
    }
  }

  
if (this.insuranceRequirementComponent) {
    if (this.insuranceRequirementComponent.allowedInsurance && 
        this.insuranceRequirementComponent.allowedInsurance.length > 0) {
      if (this.insuranceRequirementComponent.submitInsuranceForm) {
        const insuranceValid = this.insuranceRequirementComponent.submitInsuranceForm();
        if (!insuranceValid) {
          isValid = false;
          missingFields.push('Insurance');
        }
      }
    }
  }

 
  if (this.accessoriesComponent?.accessoriesForm) {
    const accessoriesForm = this.accessoriesComponent.accessoriesForm;
    this.markFormGroupTouched(accessoriesForm);
     
    if (accessoriesForm.invalid) {
      isValid = false;
      missingFields.push('Accessories');
    }
  }

  return { isValid, missingFields };
}

 private markFormGroupTouched(formGroup: any): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
      
      
      if (control && control.controls) {
        control.controls.forEach((nestedControl: any) => {
          if (nestedControl.controls) {
            this.markFormGroupTouched(nestedControl);
          } else {
            nestedControl.markAsTouched({ onlySelf: true });
          }
        });
      }
    });
  }

  addAccessories() {
    
    const validationResult = this.validateChildForms();
    
    if (!validationResult.isValid) {
      
      const fieldList = [...new Set(validationResult.missingFields)].join(', ');
      const errorMessage = `At least the ${fieldList} must be selected to save the quote.`;
      
      this.toasterSvc.showToaster({
        severity: "error",
        detail: errorMessage,
        life: 5000
      });
      
      return;
    }

    
    this.baseSvc.accessoriesFormDataSubject.next(true);
    const statusInvalid = this.baseSvc.formStatusArr.includes("INVALID");
    this.baseSvc.formStatusArr.length = 0;

    if (statusInvalid) {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: "savebtn_error",
        life: 5000
      });
      return;
    }
    
    this.baseSvc.setBaseDealerFormData({
      ...this.baseSvc.accessoriesData,
      totalCharge: this.total,
    });
    this.toasterSvc.showToaster({
      severity: "success",
      detail: "Add ons & accessories saved successfully",
      life: 3000
    });
    
    const contractId = this.baseSvc.contractId;
    if (contractId) {
      this.svc.router.navigate(["/standard-quote/edit", contractId]);
    } else {
      this.svc.router.navigateByUrl("/standard-quote");
    }
  }
  pageCode: string = "AddOnAccessoriesComponent";
  modelName: string = "AddOnAccessoriesComponent";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();
  }

  override async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  override async onValueEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  async updateValidation(event) {
    const req = {
      form: this.mainForm?.form,
      formConfig: this.formConfig,
      event: event,
      modelName: this.modelName,
      pageCode: this.pageCode,
    };

    var responses: any = await this.validationSvc.updateValidation(req);
    if (responses.formConfig && !responses.status) {
      this.formConfig = { ...responses.formConfig };

      this.cdr.detectChanges();
    }
  }

  override async onStepChange(quotesDetails: any): Promise<void> {
    if (quotesDetails?.type !== "tabNav") {
    //   var result: any = await this.updateValidation("onSubmit");
    //   if (!result?.status) {
    //     // this.toasterSvc.showToaster({
    //     //   severity: "error",
    //     //   detail: "I7",
    //     // });
    //   }
    }
  }
}
