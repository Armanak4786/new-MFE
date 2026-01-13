import { ChangeDetectorRef, Component } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef, DialogService } from "primeng/dynamicdialog";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, DataService, GenericFormConfig } from "auro-ui";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { IndividualService } from "../../../individual/services/individual.service";
import { BusinessService } from "../../../business/services/business";
import { HttpClient } from "@angular/common/http";
import { ToasterService, ValidationService } from "auro-ui";


@Component({
  selector: "app-search-supplier",
  templateUrl: "./search-supplier.component.html",
  styleUrls: ["./search-supplier.component.scss"],
})
export class SearchSupplierComponent extends BaseStandardQuoteClass {

  override formConfig: GenericFormConfig = {
    cardType: "non-border",
    api: "",
    autoResponsive: true,
    createData: { searchSupplier: "individual" },
    fields: [
      {
        type: "radio",
        name: "searchSupplier",
        label: "Search Type",
        cols: 3,
        options: [
          { label: "Individual", value: "individual" },
          { label: "Business", value: "business" },
        ],
      },
    ],
  };

  searchType: "individual" | "business" = "individual";
  filteredSuppliers: any[] = [];
  isLoading = false;

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    public individualSvc: IndividualService,
    private businessSvc: BusinessService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private http: HttpClient,
    public dataSvc: DataService,
  ) {
    super(route, svc, baseSvc);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();

    this.mainForm.get("searchSupplier")?.patchValue("individual");
    this.searchType = "individual";

    await this.updateValidation("onInit");
  }

  override onFormEvent(event: any): void {
    if (event.name === "searchSupplier") {
      this.searchType = event.value;
    }
  }


onClose(){
this.ref.close()
}

  onResetClicked(): void {
    this.filteredSuppliers = [];
    this.mainForm.form.reset();
    this.mainForm.get("searchSupplier")?.patchValue("individual");
    this.searchType = "individual";
  }

  pageCode = "SearchSupplierComponent";
  modelName = "SearchSupplierComponent";

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
      event,
      modelName: this.modelName,
      pageCode: this.pageCode,
    };
    const responses = await this.validationSvc.updateValidation(req);
    if (!responses.status && responses.updatedFields.length) {
      await this.mainForm.applyValidationUpdates(responses);
    }
    return responses.status;
  }

  override ngOnDestroy(): void {
    this.searchType = "individual";
    this.mainForm.form.reset();
  }
}
