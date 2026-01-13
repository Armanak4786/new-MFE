import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from "auro-ui";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ToasterService, ValidationService } from "auro-ui";

@Component({
  selector: "app-key-info-popup",
  templateUrl: "./key-info-popup.component.html",
  styleUrl: "./key-info-popup.component.scss",
})
export class KeyInfoPopupComponent
  extends BaseStandardQuoteClass
  implements OnInit
{
  apiData: any;
  messageType = "KeyDisclosureCSAPersonal"; // Replace with your actual variable or value
  programId = 2; // Replace with your actual variable or value
  quoteId: number;
  params: any;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
  }

  @ViewChild("mainSection") mainSection: ElementRef;
  override async ngOnInit(): Promise<void> {
    this.data = this.config.data;

    this.apiData = this.data?.data.content;
    await this.updateValidation("onInit");
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    // Scroll to the top of the main section after it renders
    this.mainSection.nativeElement.scrollTo(0, 0);
  }
  close() {
    this.ref.close({});
  }
  passDataToParent(): void {
    this.ref.close({
      data: this.data,
      quoteId: this.quoteId,
    });
  }

  pageCode: string = "KeyInfoPopupComponent";
  modelName: string = "KeyInfoPopupComponent";

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
