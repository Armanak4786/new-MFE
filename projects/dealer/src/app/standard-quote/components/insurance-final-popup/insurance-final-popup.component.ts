import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { CloseDialogData, CommonService, Mode } from "auro-ui";
import { ActivatedRoute, Router } from "@angular/router";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { SearchCustomerComponent } from "../search-customer/search-customer.component";
import { takeUntil } from "rxjs";
import { KeyInfoPopupComponent } from "../key-info-popup/key-info-popup.component";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { ToasterService, ValidationService } from "auro-ui";

@Component({
  selector: "app-insurance-final-popup",
  templateUrl: "./insurance-final-popup.component.html",
  styleUrl: "./insurance-final-popup.component.scss",
})
export class InsuranceFinalPopupComponent extends BaseStandardQuoteClass {
  policy1_b1: string;
  policy2_b1: string;
  policy3_b1: string;
  policy4_b1: string;
  policy5_b1: string;
  policy6_b1: string;
  policy7_b1: string;
  signDate_b1: string;
  signature_b1: string;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public router: Router,
    override baseSvc: StandardQuoteService,
    private cdr: ChangeDetectorRef,
    public ref: DynamicDialogRef,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService
  ) {
    super(route, svc, baseSvc);
  }
  override async ngOnInit(): Promise<void> {
    await this.updateValidation("onInit");
  }

  showKeyInfoDisclosure() {
    this.svc.dialogSvc
      .show(KeyInfoPopupComponent, "Key Info Disclosure", {
        templates: {
          footer: null,
        },
        width: "60vw",
      })
      .onClose.subscribe((data: CloseDialogData) => {});
  }

  close() {
    this.ref.close({});
  }

  passDataToParent() {
    this.close();
  }

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
        //   severity: "error",
        //   detail: "I7",
        // });
      }
    }
  }
}
