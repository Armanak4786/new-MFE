import { ChangeDetectorRef, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Validators } from "@angular/forms";
import { CommonService, GenericFormConfig, ToasterService, ValidationService } from "auro-ui";
import { SoleTradeService } from "../../services/sole-trade.service";
import { BaseSoleTradeClass } from "../../base-sole-trade.class";

@Component({
  selector: "app-sole-trade-employment-details",
  templateUrl: "./sole-trade-employment-details.component.html",
  styleUrl: "./sole-trade-employment-details.component.scss",
})
export class SoleTradeEmploymentDetailsComponent extends BaseSoleTradeClass {
  constructor(
     public override route: ActivatedRoute,
     public override svc: CommonService,
     public override baseSvc: SoleTradeService,
     private cdr: ChangeDetectorRef,
     public toasterSvc: ToasterService,
     public validationSvc: ValidationService
   ) {
     super(route, svc, baseSvc);
   }
   override async ngOnInit(): Promise<void> {
     await super.ngOnInit();
     this.baseSvc.getBaseDealerFormData().subscribe((res) => {
       this.checkPreviousEmployees = res?.checkPreviousEmployees;
     });

     this.baseSvc.isPreviousEmployeeVisible = this.isEnable;
    
   }
 
   
 
   optionsdata = [{ name: "icashpro", code: "icp" }];
   checkPreviousEmployees: boolean;
   flag: boolean = false;
   apiData: any;
   isEnable: boolean = false;
   getvalue(event) {
     this.baseSvc?.setBaseDealerFormData({
       checkPreviousEmployees: event,
     });

     this.baseSvc.EmploymentDetailChangedSlider = event;
    
    if(event){
      this.baseSvc.setBaseDealerFormData({
        CopyCurrentEmploymentDetails: this.baseFormData?.employementDetails?.[0],
        currentEmployer : null,
        currentOccupation : null,
        currentEmploymentType : null,
        currentEmployeeYear : 0,
        currentEmployeeMonth : 0,
      })
    }
  }
  
  onEmployementYearChange(event){
    
     if (!this.checkPreviousEmployees && event < 3 && event != null) {
      this.isEnable = true;
    } else if (!this.checkPreviousEmployees && event >= 3) {
      this.isEnable = false;
    } else if (this.checkPreviousEmployees && event < 3) {
      this.isEnable = true;
    } else {
      this.isEnable = false;
    }

    this.baseSvc.isPreviousEmployeeVisible = this.isEnable;

   }
   override async onSuccess(data: any) {}
   override onFormDataUpdate(res: any): void {
     // if (res?.currentEmployeeYear && res?.currentEmployeeYear < 3) {
     //   this.isEnable = true;
     // } else if (res?.currentEmployeeYear && res?.currentEmployeeYear >= 3 ) {
     //   this.isEnable = false;
     // } else if (!res.currentEmployeeYear && this.isEnable) {
     //   this.isEnable = false;
     // }
 
    //  const currentYear = res?.currentEmployeeYear;
    //  const currentMonth = res?.currentEmployeeMonth;
 
  //    if (currentMonth === null && currentYear === null) {
  //    this.isEnable = false;
  //    return;
  //  }

  //    if (!this.checkPreviousEmployees && typeof currentYear === "number" && currentYear < 3 && currentYear >= 0) {
  //      this.isEnable = true;
  //    } else if (!this.checkPreviousEmployees && currentYear >= 3) {
  //      this.isEnable = false;
  //    } else if (this.checkPreviousEmployees && currentYear < 3) {
  //      this.isEnable = true;
  //    } else {
  //      this.isEnable = false;
  //    }
   }
 
   pageCode: string = "EmploymentDetailsComponent";
   modelName: string = "EmploymentDetailsComponent";
 
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
 
     const responses = await this.validationSvc.updateValidation(req);
     if (!responses.status && responses.updatedFields.length) {
       await this.mainForm.applyValidationUpdates(responses);
     }
 
     return responses.status;
   }
 
   override async onStepChange(quotesDetails: any): Promise<void> {
     super.onStepChange(quotesDetails);
     if (quotesDetails.type !== "tabNav") {
       var result: any = await this.updateValidation("onSubmit");
       // if (!result?.status) {
       //   this.toasterSvc.showToaster({
       //     severity: "error",
       //     detail: "I7",
       //   });
       // }
     }

     this.baseSvc.isPreviousEmployeeVisible = this.isEnable;
   }
 }
 
