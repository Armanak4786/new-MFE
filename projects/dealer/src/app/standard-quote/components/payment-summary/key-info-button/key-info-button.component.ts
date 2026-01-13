import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseStandardQuoteClass } from "../../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { CloseDialogData, CommonService, GenericFormConfig } from "auro-ui";
import { StandardQuoteService } from "../../../services/standard-quote.service";
import { Validators } from "@angular/forms";
import { KeyInfoPopupComponent } from "../../key-info-popup/key-info-popup.component";
import { takeUntil } from "rxjs";
import { ToasterService, ValidationService } from "auro-ui";

@Component({
  selector: "app-key-info-button",
  templateUrl: "./key-info-button.component.html",
  styleUrl: "./key-info-button.component.scss",
})
export class KeyInfoButtonComponent extends BaseStandardQuoteClass {
  formData: any;
  contractId: any;
  messageType = "";
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: StandardQuoteService,
    private toasterService: ToasterService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
  }

  override async ngOnInit(): Promise<void> {
    let params: any = this.route.snapshot.params;
    this.mode = params.mode;

    this.contractId = this.baseFormData?.contractId;
    this.baseSvc
      .getBaseDealerFormData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.formData = res;
      });
  }
  // override formConfig: GenericFormConfig = {
  //   headerTitle: '',
  //   autoResponsive: true,
  //   cardType: 'non-border',
  //   api: '',
  //   goBackRoute: '',
  //   fields: [
  //     {
  //       type: 'button',
  //       btnType: 'non-bg-btn',
  //       label: 'Key Information Disclosure >',
  //       name: 'keyInfoBtn',
  //       submitType: 'internal',
  //       cols: 4,
  //       className: 'p-0',
  //       nextLine: true,
  //     },
  //   ],
  // };
  override async onSuccess(data: any) {}
  override onButtonClick(event: any) {
    this.showDialog();
  }

  showDialog() {
    let qupteId;
    if (this.mode == "edit" || this.mode == "view") {
      qupteId = this.formData?.contractId;
    } else {
      qupteId = 0;
    }
    this.messageType = this.formData?.productCode == 'AFV' ? "KeyDisclosureAFVPersonal": "KeyDisclosureCSAPersonal";
    this.svc.data
      ?.get(
        `Declaration/get_disclosure_messages?MessageType=${this.messageType}&ProgramId=${this.formData?.programId}&QuoteId=${qupteId}`
      )
      ?.subscribe((res) => {
        this.data = res;

        this.baseSvc.setBaseDealerFormData({ keyInfo: res?.data });
        if (this.data) {
          this.svc.dialogSvc
            .show(KeyInfoPopupComponent, "Key Information Disclosure", { 
              templates: {
                footer: null,
              },
              data: this.data,
              width: "60vw",
            }) 
          .onClose.subscribe((data: CloseDialogData) => {});
        }
      });
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
