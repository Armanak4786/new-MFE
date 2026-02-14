import { ChangeDetectorRef, Component } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig } from "auro-ui";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { IndividualService } from "../../../individual/services/individual.service";
import { BusinessService } from "../../../business/services/business";
import { TrustService } from "../../../trust/services/trust.service";
import { ToasterService, ValidationService } from "auro-ui";
import configure from "src/assets/configure.json";
import { SoleTradeService } from "../../../sole-trade/services/sole-trade.service";
import { takeUntil } from "rxjs";

@Component({
  selector: "app-search-customer",
  templateUrl: "./search-customer.component.html",
  styleUrl: "./search-customer.component.scss",
})
export class SearchCustomerComponent extends BaseStandardQuoteClass {
  override formConfig: GenericFormConfig = {
    cardType: "non-border",
    autoResponsive: true,
    api: "addAsset",
    goBackRoute: "quoteOriginator",
    createData: {
      searchCustomer: "individual",
    },
    fields: [
      {
        type: "radio",
        name: "searchCustomer",
        label: "Search Type",
        cols: 3,
        options: [
          { label: "Individual", value: "individual" },
          { label: "Business", value: "business" },
          { label: "Trust", value: "trust" },
        ],
      },
    ],
  };

  searchType: "trust" | "individual" | "business" = "individual";

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    public individualSvc: IndividualService,
    private trustSvc: TrustService,
    private businessSvc: BusinessService,
    private soleTradeSvc: SoleTradeService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
  }
  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.mainForm.get("searchCustomer").patchValue("individual");
    this.searchType = "individual";

    if (this.baseFormData?.purposeofLoan == configure.LoanPurpose ) {
      this.mainForm.updateProps("searchCustomer", {
        className: "disabled-radio",
      });
    }

    if(this.baseFormData?.purposeofLoan == "Business" ||  this.baseFormData?.searchCustomerData?.business != null) {
    this.mainForm.get("searchCustomer").patchValue("business");
    this.searchType = "business";
    }
    if(this.baseFormData?.searchCustomerData?.trust != null){
 
    this.mainForm.get("searchCustomer").patchValue("trust");
      this.searchType = "trust"
    }

    await this.updateValidation("onInit");
  }

  override onFormEvent(event: any): void {
    if (event.name == "searchCustomer") {
      this.searchType = event.value;
       if(this.searchType == "trust" && this.baseFormData?.purposeofLoan == configure?.LoanPurpose && this.individualSvc?.role !== 1 && this.businessSvc?.role !== 1){  
        this.toasterSvc.showToaster({
            severity: "error",
            detail: "Please add an individual borrower before adding a Trust as a Guarantor."
          })
        
          return
        }
    }
  }
  newCustomer() {
    this.individualSvc.activeStep = 0;
    this.businessSvc.activeStep = 0;
    this.trustSvc.activeStep = 0;
    this.individualSvc.mode = "create";
    this.businessSvc.mode = "create";
    this.trustSvc.mode = "create";

    this.svc.router.navigateByUrl(
      `/dealer/${this.mainForm.get("searchCustomer").value}`
    );
    this.individualSvc.resetBaseDealerFormData();
    this.businessSvc.resetBaseDealerFormData();
    this.trustSvc.resetBaseDealerFormData();
    this.soleTradeSvc.resetBaseDealerFormData();
    this.baseSvc.getBaseDealerFormData().pipe(takeUntil(this.destroy$)).subscribe((data) => {
    
     
      if (this.searchType === "business") {
        this.businessSvc.setBaseDealerFormData({
          registeredCompanyNumber: data?.businessregisteredNo,
          legalName: data?.businessCompanyName,
          tradingName: data?.businesstradingName,
          taxNumber: data?.businessgstNo,
        });
      } 
      else if (this.searchType === "trust") {
        this.trustSvc.setBaseDealerFormData({
          trustName: data?.udcTrustName,
        });
      }
      else if (this.searchType === "individual") {
        this.individualSvc.setBaseDealerFormData({
        firstName: data?.firstName,
        lastName: data?.lastName,
        dateOfBirth: data?.dateOfBirth,
      });
      }
     
    });
  
    this.ref.close();
  }

  override ngOnDestroy(): void {
    this.searchType = "individual";
    this.mainForm.form.reset();
  }

  pageCode: string = "SearchCustomerComponent";
  modelName: string = "SearchCustomerComponent";

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
