import { ChangeDetectorRef, Component } from "@angular/core";
import { Validators } from "@angular/forms";
import { BaseSoleTradeClass } from "../../../base-sole-trade.class";
import { ActivatedRoute } from "@angular/router";
import {
  CommonService,
  GenericFormConfig,
  ToasterService,
  ValidationService,
} from "auro-ui";
import { SoleTradeService } from "../../../services/sole-trade.service";
import { StandardQuoteService } from "../../../../standard-quote/services/standard-quote.service";
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { IndividualService } from "../../../../individual/services/individual.service";


@Component({
  selector: "app-sole-trade-driver-licence-detail",
  templateUrl: "./sole-trade-driver-licence-detail.component.html",
  styleUrl: "./sole-trade-driver-licence-detail.component.scss",
})
export class SoleTradeDriverLicenceDetailComponent extends BaseSoleTradeClass {
  private countryOptions: any[] = [];
  private lastCountryDropdownLicenseType: string | null = null;
  override formConfig: GenericFormConfig = {
    headerTitle: "Driver Licence Details",
    autoResponsive: true,
    api: "",
    goBackRoute: "",
    cardBgColor: "--background-color-secondary",
    cardType: "non-border",
    createData: {
      countryOfIssue: "New Zealand",
    },
    fields: [
      {
        type: "select",
        label: "Licence Type",
        name: "licenseType",
        cols: 3,
        inputClass: "w-5 pt-2",
        alignmentType: "horizontal",
        labelClass: "pt-3 ml-2",
        options: [],
        filter: true,
        validators: [],
      },
      {
        type: "select",
        label: "Country of Issue",
        name: "countryOfIssue",
        cols: 3,
        options: [],
        default: "New Zealand",
        inputClass: "w-6 pt-2",
        alignmentType: "horizontal",
        labelClass: "pt-3  mr-2",
        filter: true,
        validators: [],
      },
      {
        type: "text",
        label: "Licence Number",
        name: "licenceNumber",
        cols: 3,
        labelClass: "pt-3 mr-2",
        inputType: "horizontal",
        inputClass: "pt-2",
        validators: [],
      },
      {
        type: "text",
        label: "Version Number",
        name: "versionNumber",
        cols: 3,
        labelClass: "pt-3 mr-2",
        inputType: "horizontal",
        inputClass: "pt-2",
        validators: [],
      },
    ],
  };

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: SoleTradeService,
    private cdr: ChangeDetectorRef,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public stdqsvc: StandardQuoteService,
    private indSvc: IndividualService
  ) {
    super(route, svc, baseSvc);
    this.baseSvc.formDataCacheableRoute([
      "LookUpServices/custom_lookups?LookupSetName=EthnicGroups",
      "LookUpServices/locations?LocationType=country",
    ]);
  }

override async ngOnInit(): Promise<void> {
  await super.ngOnInit();

  if (this.baseSvc.showValidationMessage) {
    this.mainForm.form.markAllAsTouched();
  }

  // Initialize licence number from baseFormData or fetch from stdqsvc
  const licenceNumber = this.baseFormData?.licenceNumber;
  if (!licenceNumber) {
    // Only fetch from stdqsvc if not already in baseFormData
    this.stdqsvc.getBaseDealerFormData().subscribe((res) => {
      const driverLicenseNo = res?.individualDriverLicenseNo;
      if (driverLicenseNo) {
        this.baseSvc.setBaseDealerFormData({
          licenceNumber: driverLicenseNo,
        });
        // Patch the form value immediately
        this.mainForm.form.get('licenceNumber')?.patchValue(driverLicenseNo, { emitEvent: false });
      }
    });
  } else {
    // If licenceNumber exists in baseFormData, patch it to the form
    this.mainForm.form.get('licenceNumber')?.patchValue(licenceNumber, { emitEvent: false });
  }

    await this.updatedropdowndata();
    this.indSvc.updateDropdownData().subscribe((result) => {
      if (result?.country) {
        // Cache full country list for later filtering
        this.countryOptions = result.country;
        this.mainForm.updateList("countryOfIssue", result?.country);
        this.mainForm?.form?.get("countryOfIssue")?.setValue("New Zealand");
      }
    });
    await this.handleAllDynamicValidatorsAndValidation("onInit");
  }

  async updatedropdowndata() {
    await this.baseSvc.getFormData(
      `LookUpServices/custom_lookups?LookupSetName=EthnicGroups`,
      (res) => {
        let list = res.data;
        const licenseTypeList = list.map((item) => ({
          label: item.lookupValue,
          value: item.lookupValue,
        }));
        licenseTypeList?.sort((a, b) => a?.label?.localeCompare(b?.label));
        this.mainForm.updateList("licenseType", licenseTypeList);
        return licenseTypeList;
      }
    );

   
    // await this.baseSvc.getFormData(
    //   `LookUpServices/locations?LocationType=country`,
    //   (res) => {
    //     let list = res.data;
    //     const countryOfIssueList = list.map((item) => ({
    //       label: item.name,
    //       value: item.name,
    //     }));

    //     // Store the original country options
    //     this.countryOptions = countryOfIssueList;

    //     this.mainForm.updateList("countryOfIssue", this.countryOptions);

    //     if (!this.mainForm.get("countryOfIssue")?.value) {
    //       this.mainForm.get("countryOfIssue")?.patchValue("New Zealand");
    //     }

    //     return this.countryOptions;
    //   }
    // );

  }


  pageCode: string = "SoleTradeComponent";
  modelName: string = "SoleTradePersonalDriverLicenceDetailComponent";

  override async onFormReady(): Promise<void> {
    await this.handleAllDynamicValidatorsAndValidation("onInit");
    super.onFormReady();
  }

  /**
   * Handles all dynamic validators based on license type and country
   */
  handleDynamicValidators() {
    const licenseTypeCtrl = this.mainForm.get("licenseType");
    const countryOfIssueCtrl = this.mainForm.get("countryOfIssue");
    const licenceNumberCtrl = this.mainForm.get("licenceNumber");
    const versionNumberCtrl = this.mainForm.get("versionNumber");

    const licenseType = licenseTypeCtrl?.value;
    const countryOfIssue = countryOfIssueCtrl?.value;

    // Adjust country dropdown when license type changes (e.g., remove NZ for International)
    this.updateCountryDropdownForLicenseType(licenseType, countryOfIssue);

    // License Type: mandatory except if "None"
    if (licenseType === "None") {
      // licenseTypeCtrl.clearValidators();
      // this.updateFieldConfigRequired(
      //   // this.formConfig.fields,
      //   // "licenseType",
      //   // false,
      //   // []
      // );
    } else {
      licenseTypeCtrl.setValidators([Validators.required]);
      this.updateFieldConfigRequired(
        this.formConfig.fields,
        "licenseType",
        true,
        [Validators.required]
      );
    }
    licenseTypeCtrl.updateValueAndValidity({ emitEvent: false });

    
    // Country of Issue Logic:
    // mandatory unless licenseType is None or Disqualified
    if (
      licenseType != null &&
      licenseType !== "None" &&
      licenseType !== "Disqualified"
    ) {
      countryOfIssueCtrl.setValidators([Validators.required]);
      this.updateFieldConfigRequired(
        this.formConfig.fields,
        "countryOfIssue",
        true,
        [Validators.required]
      );
    } else {
      countryOfIssueCtrl.clearValidators();
      this.updateFieldConfigRequired(
        this.formConfig.fields,
        "countryOfIssue",
        false,
        []
      );
    }
    countryOfIssueCtrl.updateValueAndValidity({ emitEvent: false });

    // Version Number logic:
    // International: required only (no pattern/length)
    if (licenseType === "International") {
      versionNumberCtrl.setValidators([Validators.required]);
      this.updateFieldConfigRequired(
        this.formConfig.fields,
        "versionNumber",
        true,
        [Validators.required]
      );
    }
    // Mandatory if country is NZ AND license type is not 'None' or 'Disqualified'
    else if (
      countryOfIssue === "New Zealand" &&
      licenseType != null &&
      licenseType !== "None" &&
      licenseType !== "Disqualified"
    ) {
      versionNumberCtrl.setValidators([
        Validators.required,
        Validators.maxLength(3),
        Validators.pattern("^[1-9]*$"),
      ]);
      this.updateFieldConfigRequired(
        this.formConfig.fields,
        "versionNumber",
        true,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern("^[1-9]*$"),
        ]
      );
    }
    // Version Number not mandatory but validate pattern for 'None' or 'Disqualified' in NZ
    else if (
      countryOfIssue === "New Zealand" &&
      (licenseType === "None" || licenseType === "Disqualified")
    ) {
      versionNumberCtrl.setValidators([
        Validators.maxLength(3),
        Validators.pattern("^[1-9]*$"),
      ]);
      this.updateFieldConfigRequired(
        this.formConfig.fields,
        "versionNumber",
        false,
        [Validators.maxLength(3), Validators.pattern("^[1-9]*$")]
      );
    }
    // Version Number not mandatory for non-NZ countries (other than International which is handled above)
    else {
      versionNumberCtrl.setValidators([
        Validators.maxLength(3),
        Validators.pattern("^[1-9]*$"),
      ]);
      this.updateFieldConfigRequired(
        this.formConfig.fields,
        "versionNumber",
        false,
        [Validators.maxLength(3), Validators.pattern("^[1-9]*$")]
      );
    }
    versionNumberCtrl.updateValueAndValidity({ emitEvent: false });

    // Licence Number logic:
    // International: required only (no pattern)
    if (
      licenseType === "International"
    ) {
      licenceNumberCtrl.setValidators([Validators.required]);
      this.updateFieldConfigRequired(
        this.formConfig.fields,
        "licenceNumber",
        true,
        [Validators.required]
      );
    }
    // Mandatory if license type is NOT 'None' or 'Disqualified' (and not International + non-NZ which is handled above)
    else if (licenseType != null && licenseType !== "" && licenseType !== "None" && licenseType !== "Disqualified") {
      licenceNumberCtrl.setValidators([
        Validators.required,
        Validators.pattern("^[A-Za-z]{2}[0-9]{6}$"),
      ]);
      this.updateFieldConfigRequired(
        this.formConfig.fields,
        "licenceNumber",
        true,
        [Validators.required, Validators.pattern("^[A-Za-z]{2}[0-9]{6}$")]
      );
    } else {
      // Licence Number optional if license type is 'None'
      licenceNumberCtrl.setValidators([
        Validators.pattern("^[A-Za-z]{2}[0-9]{6}$"),
      ]);
      this.updateFieldConfigRequired(
        this.formConfig.fields,
        "licenceNumber",
        false,
        [Validators.pattern("^[A-Za-z]{2}[0-9]{6}$")]
      );
    }
    licenceNumberCtrl.updateValueAndValidity({ emitEvent: false });

    // Update error messages conditionally to reflect active validators
    if (licenseType === "International") {
      // Required-only messages for International (no pattern/length)
      this.mainForm.updateProps("versionNumber", {
        errorMessage: "Version Number is required",
      });
      this.mainForm.updateProps("licenceNumber", {
        errorMessage: "Licence Number is required",
      });
    } else {
      // Pattern messages when pattern/length validators are active
      this.mainForm.updateProps("versionNumber", {
        errorMessage: "License number is in an incorrect format",
      });
      this.mainForm.updateProps("licenceNumber", {
        errorMessage:
          "Licence No. should start with 2 letters followed by 6 digits",
      });
    }
        // --- LICENCE NUMBER VALIDATION BASED ON COUNTRY ---
if (licenseType == null || licenseType === "None" || licenseType === "Disqualified" ) {
  licenceNumberCtrl.setValidators(
    countryOfIssue === "New Zealand"
      ? [Validators.pattern("^[A-Za-z]{2}[0-9]{6}$")]
      : []
  );
  this.updateFieldConfigRequired(
    this.formConfig.fields,
    "licenceNumber",
    false,
    countryOfIssue === "New Zealand"
      ? [Validators.pattern("^[A-Za-z]{2}[0-9]{6}$")]
      : []
  );
} else if (licenseType === "International") {
  licenceNumberCtrl.setValidators([Validators.required]);
  this.updateFieldConfigRequired(
    this.formConfig.fields,
    "licenceNumber",
    true,
    [Validators.required]
  );
} else {
  licenceNumberCtrl.setValidators(
    countryOfIssue === "New Zealand"
      ? [Validators.required, Validators.pattern("^[A-Za-z]{2}[0-9]{6}$")]
      : [Validators.required]
  );
  this.updateFieldConfigRequired(
    this.formConfig.fields,
    "licenceNumber",
    true,
    countryOfIssue === "New Zealand"
      ? [Validators.required, Validators.pattern("^[A-Za-z]{2}[0-9]{6}$")]
      : [Validators.required]
  );
}
licenceNumberCtrl.updateValueAndValidity({ emitEvent: false });

    this.cdr.detectChanges();
  }

  
   //Handles country dropdown state based on license type (e.g., remove NZ for International)
   
  private updateCountryDropdownForLicenseType(
    licenseType: string,
    countryOfIssue: string
  ) {
    if (!this.countryOptions?.length) {
      return;
    }

    // Avoid re-running if license type didn't change; prevents dropdown flicker while typing/filtering
    if (this.lastCountryDropdownLicenseType === licenseType) {
      return;
    }

    if (licenseType === "International") {
      // Remove New Zealand from options when International is selected
      const filteredCountries = this.countryOptions.filter(
        (c: any) => c.value !== "New Zealand"
      );
      this.mainForm.updateList("countryOfIssue", filteredCountries);

      // Clear country selection only if it was explicitly New Zealand
      if (countryOfIssue === "New Zealand") {
        this.mainForm.form
          .get("countryOfIssue")
          ?.patchValue(null, { emitEvent: false });
      }
      this.lastCountryDropdownLicenseType = "International";
    } else {
      // Restore full list; if empty, default to NZ
      this.mainForm.updateList("countryOfIssue", this.countryOptions);
      const hasValue = !!this.mainForm.get("countryOfIssue")?.value;
      if (!hasValue) {
        this.mainForm.form
          .get("countryOfIssue")
          ?.patchValue("New Zealand", { emitEvent: false });
      }
      this.lastCountryDropdownLicenseType = licenseType ?? null;
    }
  }

  /**
   * Utility: Safely update validators & required for formConfig fields
   */
  private updateFieldConfigRequired(
    fields: any[],
    fieldName: string,
    isRequired: boolean,
    validators: any[]
  ) {
    const field = fields.find((f) => f.name === fieldName);
    if (!field) return;
    if ("validators" in field) field.validators = [...validators];
    if ("isRequired" in field) field.isRequired = isRequired;
    if ("optional" in field) field.optional = !isRequired;
  }

  /**
   * Combined method that enforces sync before and after updateValidation()
   */
  private async handleAllDynamicValidatorsAndValidation(event: any) {
    await this.updateValidation(event);
    this.handleDynamicValidators();
    this.cdr.detectChanges();
  }

  override async onFormEvent(event: any) {
    await this.handleAllDynamicValidatorsAndValidation(event);
    super.onFormEvent(event);
  }

  override async onBlurEvent(event): Promise<void> {
    await this.handleAllDynamicValidatorsAndValidation(event);
  }

  override async onValueEvent(event): Promise<void> {
    await this.handleAllDynamicValidatorsAndValidation(event);
  }

  override async onValueTyped(event: any): Promise<void> {
    await this.handleAllDynamicValidatorsAndValidation(event);
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
    // console.log(responses);
    if (!responses.status && responses.updatedFields.length) {
      await this.mainForm.applyValidationUpdates(responses);
    }

    return responses.status;
  }

override async onStepChange(stepperDetails: any): Promise<void> {
  // Save current form values before changing tabs
  const currentFormValues = this.mainForm.form.value;
  
  if (currentFormValues.licenceNumber) {
    this.baseSvc.setBaseDealerFormData({
      licenceNumber: currentFormValues.licenceNumber,
    });
  }
   if (currentFormValues.versionNumber) {
    this.baseSvc.setBaseDealerFormData({
      versionNumber: currentFormValues.versionNumber,
    });
  }
  
  // console.log(this.mainForm.form.valid);
  super.onStepChange(stepperDetails);

    if (stepperDetails?.type !== "tabNav") {
      await this.handleAllDynamicValidatorsAndValidation("onSubmit");
    }

    this.baseSvc.updateComponentStatus(
      "Business Individual",
      "SoleTradeDriverLicenceDetailComponent",
      this.mainForm.form.valid
    );

    if (this.baseSvc.showValidationMessage) {
      let invalidPages = this.checkStepValidity();
      this.baseSvc.iconfirmCheckbox.next(invalidPages);
    }
  }
  override ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    super.ngOnDestroy();
  }
}
