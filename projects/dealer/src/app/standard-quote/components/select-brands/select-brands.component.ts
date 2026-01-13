import { ChangeDetectorRef, Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms"; // Import Reactive Forms modules
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { CommonService } from "auro-ui";
import { ActivatedRoute } from "@angular/router";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ToasterService, ValidationService } from "auro-ui";

@Component({
  selector: "app-select-brands",
  templateUrl: "./select-brands.component.html",
  styleUrl: "./select-brands.component.scss",
})
export class SelectBrandsComponent extends BaseStandardQuoteClass {
  brands: any[] = [];
  form: FormGroup;
  selectedBrand: any[] = [];

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    private dynamicDialogConfig: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    override baseSvc: StandardQuoteService,
    private fb: FormBuilder,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
    this.brands = this.dynamicDialogConfig?.data?.brands || [];

    this.form = this.fb.group({
      brandSelection: [null],
    });
  }

  override async ngOnInit() {
    super.ngOnInit();
    this.brands = this.dynamicDialogConfig?.data?.brands || [];

    this.form.get("brandSelection")?.valueChanges.subscribe((value) => {
      this.selectedBrand = this.brands.filter(
        (brand: any) => brand?.name === value
      );

      this.baseSvc.setBaseDealerFormData({
        brandImage: this.selectedBrand,
      });
    });
    await this.updateValidation("onInit");
  }

  passDataToParent(): void {
    this.ref.close({
      data: this.selectedBrand,
    });
  }

  pageCode: string = "SelectBrandsComponent";
  modelName: string = "SelectBrandsComponent";

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
    if (!responses?.status && responses.updatedFields?.length) {
      await this.mainForm.applyValidationUpdates(responses);
    }

    return responses?.status;
  }

  override async onStepChange(quotesDetails: any): Promise<void> {
    if (quotesDetails?.type !== "tabNav") {
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
