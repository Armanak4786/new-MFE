import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ToasterService, ValidationService } from "auro-ui";
import { AssetTradeSummaryService } from "../asset-insurance-summary/asset-trade.service";
import { StandardQuoteService } from "../../services/standard-quote.service";

@Component({
  selector: "app-search-asset",
  templateUrl: "./search-asset.component.html",
  styleUrl: "./search-asset.component.scss",
})
export class SearchAssetComponent implements OnInit {
  modalType: string = "";
  buttonName: string = "";
  mainForm: any;
  formConfig: any;
  searchType: any = "motocheck";
  hideAddButton: boolean = false;
  isInternalAndDirect:boolean = false;

  constructor(
    public router: Router,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef,
    private  svc : AssetTradeSummaryService,
    private stdqsvc: StandardQuoteService
  ) {}

  ngOnInit(): void {
    this.modalType = this.config.data?.modalType;
    this.hideAddButton = this.config.data?.hideAddButton || false;

    if (this.config.data?.modalType == "Search Asset") {
      this.buttonName = "Add Asset";
    } else {
      this.buttonName = "Add Trade";
    }
    this.updateValidation("onInit");
    this.searchType = this.config.data.searchType == "dealerInventory" ? "dealerInventory" : "motocheck";

    if((sessionStorage.getItem("externalUserType") == "Internal" )&&(this.stdqsvc.productBusinessModel === "Direct")){
      this.isInternalAndDirect = true
    }
  }


  redirectToAsset() {
    if (this.modalType == "Search Asset") {
      this.router.navigateByUrl("/asset/addAsset");
    }
    if (this.modalType == "Search Trade in Asset") {
      this.router.navigateByUrl("/asset/addTrade");
    }

    this.ref.close({
      action: "closeAssetInsuranceSummaryTable",
    });
  }

  pageCode: string = "SearchAssetComponent";
  modelName: string = "SearchAssetComponent";

  async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
  }

  async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  async onValueEvent(event): Promise<void> {
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

  async onStepChange(quotesDetails: any): Promise<void> {
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
