import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { CommonService, DialogData } from "auro-ui";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { ButtonType } from "auro-ui";
import { ToasterService, ValidationService } from "auro-ui";

@Component({
  selector: "app-dealer-udc-declaration",
  templateUrl: "./dealer-udc-declaration.component.html",
  styleUrls: ["./dealer-udc-declaration.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DealerUdcDeclarationComponent extends BaseStandardQuoteClass {
  visible: boolean;

  // todo translate pending
  privacyAuthorizationText: string;
  contractId: number;
  financialAdviceText: string;

  @Output() onProceed: EventEmitter<any> = new EventEmitter<boolean>();

  isPrivacyAuthorization: boolean = false;
  isFinancialAdvise: boolean = false;

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: StandardQuoteService,
    private commonSvc: CommonService,
    private dynamicDialogConfig: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
  }

  originationData: any;
  override ngOnInit(): Promise<void> {
    super.ngOnInit();

    this.baseSvc
      .getBaseDealerFormData()
      .pipe()
      .subscribe((res) => {
        this.contractId = res.contractId;
      });
    //  this.svc.data.get(`https://portalgateway/gateway/Declaration/get_origination_declarations?MessageType=${OriginatorDeclaration}`)
    this.svc.data
      .get(
        `Declaration/get_origination_declarations?MessageType=IntroducerDeclaration`
      )
      .subscribe((res) => {
        this.originationData = res.data;
      });

    return null;
  }

  override onValueChanges(event) {
    let data: DialogData = {
      formData: {
        isPrivacyAuthorization: this.isPrivacyAuthorization,
        isFinancialAdvise: this.isFinancialAdvise,
      },
    };
    this.dynamicDialogConfig.data = data;
  }
  close() {
    this.ref.close({
      btnType: "cancel",
    });
  }
  passDataToParent() {
    const params = {
      contractId: this.contractId,
      dealerId: 5,
      messageIdInfo: [
        { messageId: 24, isActive: 1 },
        { messageId: 25, isActive: 1 },
      ],
      quoteId: this.contractId,
    };

    if (this.contractId) {
      this.svc.data
        .post(`Declaration/add_Origination_declaration`, params)
        .subscribe(
          (response) => {},
          (error) => {}
        );
    }

    this.ref.close({
      btnType: "submit",
    });
  }

  pageCode: string = "DealerUdcDeclarationComponent";
  modelName: string = "DealerUdcDeclarationComponent";

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
