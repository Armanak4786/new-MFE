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

@Component({
  selector: "app-contract-summery-tabs",
  templateUrl: "./contract-summery-tabs.component.html",
  styleUrls: ["./contract-summery-tabs.component.scss"],
})
export class ContractSummeryTabsComponent extends BaseStandardQuoteClass {
  uploadDocument: any;
  loanVariationId: any;
  formdata: any;
  steps: any;
  files = [];
  uploadedFiles = [];
  stepss = ["Additional Approval", "Uploade Documents", "Generate Documents"];

  activeSteps = 0;

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: StandardQuoteService,
    private toasterService: ToasterService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    public authSvc: AuthenticationService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService
  ) {
    super(route, svc, baseSvc);
  }
  responsedData: any;
  override async ngOnInit(): Promise<void> {}

  manageSelectedRow(activeStep) {
    // this.selectedRow = null;
    // }
  }
  // trialData = [];

  pageCode: string = "";
  modelName: string = "";

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
    if (quotesDetails.type !== "tabNav") {
      var result: any = await this.updateValidation("onSubmit");
      if (!result?.status) {
        // this.toasterSvc.showToaster({
        //   severity: 'error',
        //   detail: 'I7',
        // });
      }
    }
  }
}
