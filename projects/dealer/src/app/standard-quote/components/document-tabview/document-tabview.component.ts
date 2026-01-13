import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";

import {
  AuthenticationService,
  CommonService,
  DataService,
  StatusProgressList,
  ToasterService,
} from "auro-ui";
import { cloneDeep } from "lodash";
import { map, Subscription } from "rxjs";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { CalculationService } from "../payment-summary/calculation.service";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { Contract } from "../../../asset/asset.component";
import { ValidationService } from "auro-ui";
import { SignatoriesComponent } from "../signatories/signatories.component";
import { CreditConditionComponent } from "../credit-condition/credit-condition.component";

@Component({
  selector: "app-document-tabview",
  templateUrl: "./document-tabview.component.html",
  styleUrls: ["./document-tabview.component.scss"],
})
export class DocumentTabViewComponent extends BaseStandardQuoteClass {
  activeSteps = 0;
  @ViewChild(SignatoriesComponent) signatoryChild!: SignatoriesComponent;
  @ViewChild(CreditConditionComponent) creditConditionChild!: CreditConditionComponent;
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
  responsedData: any;
  override async ngOnInit(): Promise<void> {
    this.activeSteps = this.baseSvc?.activeStep;
    this.updateValidation("onInit");
  }

  pageCode: string = "StandardQuoteComponent";
  modelName: string = "DocumentTabViewComponent";

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

  loadTabSpecificData(event:any){
  
    if((this.baseSvc.activeStep === 1 && event.index === 2) || (this.baseSvc.activeStep === 2 && event.index === 2)){
      this.signatoryChild.init();
      
    }
    else if((this.baseSvc.activeStep === 2 && event.index === 3)){
      this.creditConditionChild.loadCreditConditions();
      
    }
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
    if (quotesDetails.type !== "tabNav") {
      var result: any = await this.updateValidation("onSubmit");
      if (!result?.status) {
        // this.toasterSvc.showToaster({
        //   severity: "error",
        //   detail: "I7",
        // });
      }
    }
  }
}
