import { ChangeDetectorRef, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  CommonService,
  GenericFormConfig,
  Mode,
  ToasterService,
} from "auro-ui";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BusinessService } from "../../../services/business";
import { BaseBusinessClass } from "../../../base-business.class";
import { ValidationService } from "auro-ui";
import { distinctUntilChanged, filter, Subscription, takeUntil } from "rxjs";
import { SearchAddressService } from "../../../../standard-quote/services/search-address.service";
import { IndividualService } from "../../../../individual/services/individual.service";

@Component({
  selector: "app-business-postal-address",
  templateUrl: "./business-postal-address.component.html",
  styleUrl: "./business-postal-address.component.scss",
})
export class BusinessPostalAddressComponent extends BaseBusinessClass {
  optionsdata = [{ label: "icashpro", value: "icp" }];
  privousChecked: any;
  index: any;
  physicalSeachValue: String;
  reusePhysicalSubs: Subscription;
  customerRoleForm: FormGroup;
  selectedAddressType: string = "po";
  cityOptionsLocationId: any = [];
  tempCity = null;
  private copiedPhysicalValues: any = {}; // Store copied values for immediate comparison
  private previousAddressType: string = null;

  fields = [
    "SearchValue",
    "BuildingName",
    "Attention",
    "City",
    "Year",
    "Month",
    "Lot",
    "Country",
    "FloorType",
    "Postcode",
    "ResidenceType",
    "RuralDelivery",
    "StreetDirection",
    "StreetName",
    "StreetNumber",
    "StreetType",
    "StreetArea",
    "Suburbs",
    "TimeAtAddress",
    "UnitNumber",
    "FloorNumber",
    "UnitType",
  ];
  searchAddressList: any;
  postalAddressType: any;
  postalSearchValue: String;
  private countryOptions: any[] = [];
  private cityOptions: any[] = [];
  override formConfig: GenericFormConfig = {
    headerTitle: "Postal Address",
    autoResponsive: true,
    api: "postalAddress",
    cardType: "border",
    //cardBgColor: "--primary-lighter-color",
    // goBackRoute: 'postalAddress',
    fields: [
      {
        type: "radio",
        options: [
          { label: "P. O. Box", value: "po" },
          { label: "Street", value: "street" },
        ],
        name: "postalAddressType",
        className: "flex gap-8 whitespace-nowrap",
        default: "street",
        // cols:12,
        nextLine: true,
      },

      {
        type: "autoSelect",
        label: "Search",
        name: "postalSearchValue",
        idKey: "street",
        // placeholder: "Search",
        cols: 2,
        options: [],
        className: "my-1",
        rightIcon: true,
        icon: "fa-solid fa-location-crosshairs fa-lg",
        minLength: 3,
        nextLine: true,
        // rightIcon: true,
      },
      // {
      //   type: "text",
      //   label: "Attention",
      //   name: "postalAttention",
      //   inputType: "vertical",
      //   className: " ",
      //   //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
      //   cols: 2,
      //   nextLine: true,
      // },
      {
        type: "number",
        inputType: "vertical",
        label: "Time at Address",
        name: "postalYear",
        maxLength: 2,
        className: "col-fixed w-4rem ml-3 white-space-nowrap",
        inputClass: "-m-2",
        hidden: true,

        // validators: [Validators.required, Validators.min(1)],  -- Auro
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "Years",
        name: "year",
        className: "mt-3 pt-3 col-fixed w-4rem",
        hidden: true,
      },
      {
        type: "number",
        inputType: "vertical",
        name: "postalMonth",
        maxLength: 2,
        // validators: [Validators.max(11)],   -- Auro
        errorMessage: "Value should be less than 12",
        className: "mt-2 col-fixed w-4rem yearmonthClass",
        hidden: true,
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "Months",
        name: "month",
        className: "mt-3 pt-3 col-fixed w-4rem",
        nextLine: false,
        hidden: true,
      },
      {
        type: "text",
        label: "Postal Number ",
        name: "postalPostalNumber",
        //regexPattern: "[^0-9]*",
        className: "lg:col-offset-1 mt-2   pl-1",
        cols: 3,
        //validators: [Validators.required],
        nextLine: true,
        hidden: true,
      },

      {
        type: "text",
        label: "Building Name",
        name: "postalBuildingName",
        inputType: "vertical",
        inputClass: "w-8 ",

        maxLength: 20,
        className: " ",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],

        cols: 2,
        nextLine: false,
       // mode: Mode.view,
      },
      {
        type: "select",
        label: "Unit Type",
        name: "postalUnitType",
        alignmentType: "vertical",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
        className: "px-0 customLabel",
        cols: 2,
        // list$: "LookUpServices/custom_lookups?LookupSetName=UnitType",
        // idKey: "lookupValue",
        // idName: "lookupValue",
        options: [],
        labelClass: "w-8 -my-3",
       // mode: Mode.view,
        // nextLine: true,
      },
      {
        type: "select",
        label: "Floor Type",
        name: "postalFloorType",
        alignmentType: "vertical",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
        className: "px-0 customLabel",
        cols: 2,
        // list$: "LookUpServices/custom_lookups?LookupSetName=FloorType",
        // idKey: "lookupValue",
        // idName: "lookupValue",
        options: [],
        labelClass: "w-8 -my-3",
       // mode: Mode.view,
      },
      {
        type: "text",
        label: "Floor Number",
        name: "postalFloorNumber",
        inputType: "vertical",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
        className: " ",
        cols: 2,
        maxLength: 5,
        inputClass: "w-8",
       // mode: Mode.view,
      },
      {
        type: "textArea",
        label: "Address",
        name: "postalStreetArea",
        inputType: "vertical",
        // //validators: [Validators.pattern(/^[A-Za-z0-9\-\/]*$/)],
        // textAreaRows: 4,
        className: " ",
        cols: 12,
        hidden: false,
        nextLine: true,
       // mode: Mode.view,
      },
      {
        type: "text",
        label: "Unit/Lot Number",
        name: "postalUnitNumber",
        inputType: "vertical",
        //validators: [Validators.pattern(/^[A-Za-z0-9\-\/]*$/)],
        className: " ",
        cols: 2,
        nextLine: false,
        inputClass: "w-8",
       // mode: Mode.view,
      },
      {
        type: "text",
        label: "Street Number",
        name: "postalStreetNumber",
        inputType: "vertical",
        //regexPattern: "[^0-9]*",
        //validators: [Validators.required],
        className: " ",
        cols: 2,
        inputClass: "w-8",
        nextLine: false,
       // mode: Mode.view,
      },

      {
        type: "text",
        label: "Street Name",
        name: "postalStreetName",
        inputType: "vertical",
        inputClass: "w-8",
        //regexPattern: "[^0-9]*",
        //validators: [Validators.required],
        className: "",
        cols: 2,
        nextLine: false,
       // mode: Mode.view,
      },
      {
        type: "select",
        label: "Street Type",
        name: "postalStreetType",
        alignmentType: "vertical",
        labelClass: "w-8 -my-3",
        //validators: [Validators.required],
        className: "px-0 customLabel",
        cols: 2,
        nextLine: false,
        // list$: "LookUpServices/custom_lookups?LookupSetName=StreetType",
        // idKey: "lookupValue",
        // idName: "lookupValue",
        options: [],
       // mode: Mode.view,
      },

      {
        type: "text",
        label: "Street Direction",
        name: "postalStreetDirection",
        inputType: "vertical",
        inputClass: "w-8",
        // validators: [
        //   Validators.required,
        //   Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/),
        // ],
        className: "",
        cols: 2,
       // mode: Mode.view,
        nextLine: false,
      },
      {
        type: "text",
        label: "Rural Delivery",
        name: "postalRuralDelivery",
        inputType: "vertical",
        inputClass: "w-8",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
        className: "",
        cols: 2,
       // mode: Mode.view,
        nextLine: true,
      },
      {
        type: "text",
        label: "Suburb",
        name: "postalSuburbs",
        inputType: "vertical",
        inputClass: "w-8",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
        className: " ",
        cols: 2,
        maxLength: 20,
       // mode: Mode.view,
        nextLine: false,
      },
      {
        type: "select",
        label: "City",
        name: "postalCity",
        alignmentType: "vertical",
        labelClass: "w-8 -my-3",
        //validators: [Validators.required],
        className: "px-0 customLabel",
        cols: 2,
        // list$: "LookUpServices/locations?LocationType=City",
        // idKey: "name",
        // idName: "name",
        options: this.cityOptions,
        //default: "New Zealand",
       // mode: Mode.view,
        nextLine: false,
      },
      {
        type: "text",
        //regexPattern: "[^0-9]*",
        label: "Postcode",
        //validators: [Validators.required],
        name: "postalPostcode",
        inputClass: "w-8",
        inputType: "vertical",
        className: " ",
        cols: 2,
        maxLength: 10,
       // mode: Mode.view,
        nextLine: false,
      },
      {
        type: "select",
        label: "Country",
        name: "postalCountry",
        alignmentType: "vertical",
        labelClass: "w-8 mb-2",
        //validators: [Validators.required],
        className: "px-0 customLabel",
        cols: 2,
        // list$: "LookUpServices/locations?LocationType=country",
        // idKey: "name",
        default: "New Zealand",
        // idName: "name",
       // mode: Mode.view,
        nextLine: false,
      },
    ],
  };
  constructor(
    public fb: FormBuilder,
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: BusinessService,
    private toasterService: ToasterService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef,
    public searchSvc: SearchAddressService,
    private indSvc: IndividualService
  ) {
    super(route, svc, baseSvc);
  }

  override title: string = "Address Details";
  // override title: string = 'Address Details';

  private togglePostalCountry(addressType: string): void {
    const countryCtrl = this.mainForm?.form?.get('postalCountry');

    if (!countryCtrl) return;

    if (addressType === 'street') {
      // Change to text field (read-only) when street type. Default: NZ
      this.mainForm.updateProps("postalCountry", {
        type: 'text',
        inputType: 'vertical',
        inputClass: "w-8 mt-2",
        cols: 2,
        labelClass: "w-8 -my-3",
        className: "px-0 mt-2 customLabel",
        // readOnly: true,
        // disabled: true,
        mode: Mode.view,
      });
      countryCtrl.setValue('New Zealand', { emitEvent: false });
      countryCtrl.disable({ emitEvent: false });
      
    } else {      
      this.mainForm.updateProps("postalCountry", {
        type: "select",
        label: "Country",
        labelClass: "w-8 -my-3",
        alignmentType: "vertical",
        name: "postalCountry",
        className: "px-0 customLabel",
        cols: 2,
        // options: this.postalCountryOptions.length > 0 ? this.postalCountryOptions : [],
        filter: true,
      });
      
      // Update the countries - sessionStorage
      this.indSvc.updateDropdownData().subscribe((result) => {
        if (result?.country) {
          this.mainForm.updateList("postalCountry", result?.country);
        }
      });
      
      countryCtrl.enable({ emitEvent: false });
    }
  }

  // NEW METHOD: Add street type handling method for business postal address
  async setStreetType(streetTypeValue: string) {
    try {
      // Ensure street type options are loaded
      const streetTypeOptions =
        this.mainForm?.fieldProps?.["postalStreetType"]?.options;

      if (!streetTypeOptions || streetTypeOptions.length === 0) {
        console.warn(
          "Business postal street type options not loaded yet, retrying..."
        );
        // Retry after a short delay
        return;
      }

      // Try different matching strategies
      let matchedOption = streetTypeOptions.find((option) => {
        const searchValue = streetTypeValue?.toLowerCase()?.trim();

        // Try exact matches first
        if (option.value?.toLowerCase() === searchValue) return true;
        if (option.label?.toLowerCase() === searchValue) return true;
        if (option.lookupValue?.toLowerCase() === searchValue) return true;
        if (option.lookupCode?.toLowerCase() === searchValue) return true;

        // Try partial matches
        if (option.value?.toLowerCase().includes(searchValue)) return true;
        if (option.label?.toLowerCase().includes(searchValue)) return true;

        return false;
      });

      if (matchedOption) {
        this.mainForm
          .get("postalStreetType")
          .patchValue(matchedOption.value || matchedOption.label);
        console.log(
          "✅ Business postal street type set successfully:",
          matchedOption
        );
      } else {
        console.warn(
          "⚠️ No matching business postal street type found for:",
          streetTypeValue
        );
        console.log(
          "Available options:",
          streetTypeOptions.map((o) => o.value || o.label)
        );
      }
    } catch (error) {
      console.error("Error setting business postal street type:", error);
    }
  }

  

  copyStreetAddress() {
    this.reusePhysicalSubs = this.baseSvc.reusePhysical$.subscribe(
      (data: any) => {
        if (data == "copied" && this.mainForm) {
          if (
            this.baseFormData.physicalCountry != "New Zealand" ||
            this.postalAddressType != "po"
          ) {
            this.mainForm?.updateHidden({
              postalUnitType: true,
              postalFloorNumber: true,
              postalFloorType: true,
              postalBuildingName: true,
              postalRuralDelivery: true,
              postalStreetDirection: true,
              postalStreetType: true,
              postalStreetName: true,
              postalStreetNumber: true,
              postalUnitNumber: true,
              postalStreetArea: false,
            });
            this.mainForm.get("postalAddressType").setValue("street");
          } else {
            this.mainForm?.updateHidden({
              postalUnitType: false,
              postalFloorNumber: false,
              postalFloorType: false,
              postalBuildingName: false,
              postalRuralDelivery: false,
              postalStreetDirection: false,
              postalStreetType: false,
              postalStreetName: false,
              postalStreetNumber: false,
              postalUnitNumber: false,
              postalStreetArea: true,
            });
            this.mainForm.get("postalAddressType").setValue("po");
          }
          this.fields.forEach((field) => {
            const postalField = this.mainForm.form.get(`postal${field}`);
            const physicalFieldValue = this.baseFormData[`physical${field}`];
            if (
              postalField &&
              postalField.value !== physicalFieldValue &&
              physicalFieldValue
            ) {
              postalField.patchValue(physicalFieldValue);
              postalField.enable();
            }
          });
        } else if (data == "undoCopy" && this.mainForm) {
          this.mainForm?.updateHidden({
            postalUnitType: false,
            postalFloorNumber: false,
            postalFloorType: false,
            postalBuildingName: false,
            postalRuralDelivery: false,
            postalStreetDirection: false,
            postalStreetType: false,
            postalStreetName: false,
            postalStreetNumber: false,
            postalUnitNumber: false,
            postalStreetArea: true,
          });
          this.mainForm.form.reset();
          this.postalSearchValue = null;
        }
      }
    );
    setTimeout(() => {
      if (this.baseFormData?.postalCountry) {
        if (
          this.baseFormData?.postalCountry != "New Zealand" ||
          this.postalAddressType != "po"
        ) {
          this.mainForm?.updateHidden({
            postalUnitType: true,
            postalFloorNumber: true,
            postalFloorType: true,
            postalBuildingName: true,
            postalRuralDelivery: true,
            postalStreetDirection: true,
            postalStreetType: true,
            postalStreetName: true,
            postalStreetNumber: true,
            postalUnitNumber: true,
            postalStreetArea: false,
          });
        } else {
          this.mainForm?.updateHidden({
            postalUnitType: false,
            postalFloorNumber: false,
            postalFloorType: false,
            postalBuildingName: false,
            postalRuralDelivery: false,
            postalStreetDirection: false,
            postalStreetType: false,
            postalStreetName: false,
            postalStreetNumber: false,
            postalUnitNumber: false,
            postalStreetArea: true,
          });
        }
      }
    });
  }

override async onValueTyped(event: any): Promise<void> {
  // IMMEDIATE CHANGE DETECTION: Check if user manually changed a copied field
  this.checkIfPostalFieldChanged(event);
  
  // Save typed value to baseFormData for payload
  // Always get the current form value to ensure we save what the user actually typed
  if (event.name && event.name.startsWith('postal')) {
    const formControl = this.mainForm?.form?.get(event.name);
    if (formControl) {
      const fieldValue = formControl.value;
      this.baseSvc.setBaseDealerFormData({
        [event.name]: fieldValue
      });
    }
  }

  if (event.name == "postalCountry") {
    if (event.data != "New Zealand") {
      this.mainForm.updateHidden({
        postalUnitType: true,
        postalFloorNumber: true,
        postalFloorType: true,
        postalBuildingName: true,
        postalRuralDelivery: true,
        postalStreetDirection: true,
        postalStreetType: true,
        postalStreetName: true,
        postalStreetNumber: true,
        postalUnitNumber: true,
        postalStreetArea: false,
        postalType: true,
        postalNumber: true,
      });
    } else {
      this.mainForm.updateHidden({
        postalUnitType: false,
        postalFloorNumber: false,
        postalFloorType: false,
        postalBuildingName: false,
        postalRuralDelivery: false,
        postalStreetDirection: false,
        postalStreetType: false,
        postalStreetName: false,
        postalStreetNumber: false,
        postalUnitNumber: false,
        postalStreetArea: true,
        postalType: false,
        postalNumber: false,
      });
    }
    //await this.updateValidation("onInit");
  }
  await this.updateValidation("onInit");
}

override async ngOnInit(): Promise<void> {
  await super.ngOnInit();

  // Set default postalAddressType if not set
  if (!this.mainForm.form.get("postalAddressType")?.value) {
    this.mainForm.form.get("postalAddressType").setValue("po");
  }

  // Initialize subscription for copy functionality from physical address
  this.initializeCopySubscription();

  // Determine current form state
  const postalCountry = this.mainForm.form.get("postalCountry")?.value || "New Zealand";
  const postalAddressType = this.mainForm.form.get("postalAddressType")?.value;

  // NEW: Initialize previousAddressType to track changes
  this.previousAddressType = postalAddressType;

  // Set initial country dropdown state based on address type
  if (postalAddressType === "street") {
    // For street type: set New Zealand and disable country dropdown
    this.mainForm.form.get("postalCountry")?.patchValue("New Zealand", { emitEvent: false });
    this.mainForm.form.get("postalCountry")?.disable({ emitEvent: false });
  } else {
    // For PO Box: enable country dropdown, don't force a value
    this.mainForm.form.get("postalCountry")?.enable({ emitEvent: false });
  }

  if (postalAddressType === "po" || postalCountry !== "New Zealand") {
    this.mainForm.updateHidden({
      postalUnitType: true,
      postalFloorNumber: true,
      postalFloorType: true,
      postalBuildingName: true,
      postalRuralDelivery: true,
      postalStreetDirection: true,
      postalStreetType: true,
      postalStreetName: true,
      postalStreetNumber: true,
      postalUnitNumber: true,
      postalStreetArea: false,
      postalType: true,
      postalNumber: true,
    });
  } else {
    this.mainForm.updateHidden({
      postalUnitType: false,
      postalFloorNumber: false,
      postalFloorType: false,
      postalBuildingName: false,
      postalRuralDelivery: false,
      postalStreetDirection: false,
      postalStreetType: false,
      postalStreetName: false,
      postalStreetNumber: false,
      postalUnitNumber: false,
      postalStreetArea: true,
      postalType: false,
      postalNumber: false,
    });
  }

  this.cdr.detectChanges();

  this.indSvc.updateDropdownData().subscribe({
    next: (result) => {
      try {
        this.mainForm.updateList("postalFloorType", result?.floorType);
        this.mainForm.updateList("postalUnitType", result?.unitType);
        this.mainForm.updateList("postalStreetType", result?.streetType);

        if (result?.country) {
          this.mainForm.updateList("postalCountry", result?.country);
          // Only set default country for street type
          if (postalAddressType === "street") {
            this.mainForm?.form?.get("postalCountry")?.setValue("New Zealand", { emitEvent: false });
          }
          this.mainForm.updateList("postalCity", result?.city);
        }
      } catch (error) {
        if (error?.message?.includes('Cannot read properties of undefined') && error?.message?.includes('split')) {
          console.warn('BusinessPostalAddressComponent: Split error in updateDropdownData subscription', error.message);
        } else {
          console.error('BusinessPostalAddressComponent: Error in updateDropdownData subscription', error);
        }
      }
    },
    error: (error) => {
      console.error('BusinessPostalAddressComponent: Error in updateDropdownData subscription', error);
    }
  });

  await this.getCities();
  
  this.initializeCityHandler();

  // Mark all fields as touched if validation messages should be shown
  if (this.baseSvc.showValidationMessage) {
    this.mainForm.form.markAllAsTouched();
  }
  let portalWorkflowStatus = sessionStorage.getItem("workFlowStatus");
     if (
      (portalWorkflowStatus != 'Open Quote') || (
    this.baseFormData?.AFworkflowStatus &&
    this.baseFormData.AFworkflowStatus !== 'Quote'
    ) )
    {
      try {
        // Use emitEvent: false to prevent triggering validation subscriptions that cause split errors
        this.mainForm?.form?.disable({ emitEvent: false });
      } catch (error) {
        console.warn('BusinessPostalAddressComponent: Error disabling form', error);
      }
    }
    else{ 
      try {
        // Use emitEvent: false to prevent triggering validation subscriptions that cause split errors
        this.mainForm?.form?.enable({ emitEvent: false });
      } catch (error) {
        // Handle errors that might occur when enabling form triggers validation subscriptions
        if (error?.message?.includes('Cannot read properties of undefined') && error?.message?.includes('split')) {
          console.warn('BusinessPostalAddressComponent: Split error when enabling form - likely undefined pattern value in validation', error.message);
        } else {
          console.warn('BusinessPostalAddressComponent: Error enabling form', error);
        }
      }
    }
}


private initializeCopySubscription(): void {
  this.reusePhysicalSubs = this.baseSvc.reusePhysical$
    .pipe(
      takeUntil(this.destroy$),
      // Filter out null/initial values and legacy string format signals
      filter(payload => {
        if (!payload) return false;
        
        // Only accept the new object format with action property
        if (typeof payload === 'string') {
          return false;
        }
        
        return true;
      })
    )
    .subscribe((payload: any) => {
      if (!this.mainForm) {
        return;
      }

      // Route to appropriate handler based on action type
      if (payload?.action === 'copied' && payload?.data) {
        this.handleCopyFromPhysical(payload.data);
      } 

    });
}


private handleCopyFromPhysical(physicalData: any): void {
  const isNz = physicalData.postalCountry === "New Zealand";

  // Set flag EARLY to prevent form change listener from triggering during copy operations
  this.baseSvc.isCopyingToPostal = true;

  // Clear previous copied values and store new ones
  this.copiedPhysicalValues = {};

  // Determine address type based on country
  const copiedAddressType = isNz ? "street" : "po";
  
  // CRITICAL EDIT: Track address type BEFORE changing it to prevent clearAddressDataOnTypeChange
  this.previousAddressType = copiedAddressType;

  // Update field visibility based on country and address type FIRST
  if (!isNz || copiedAddressType === "po") {
    this.mainForm.updateHidden({
      postalUnitType: true,
      postalFloorNumber: true,
      postalFloorType: true,
      postalBuildingName: true,
      postalRuralDelivery: true,
      postalStreetDirection: true,
      postalStreetType: true,
      postalStreetName: true,
      postalStreetNumber: true,
      postalUnitNumber: true,
      postalStreetArea: false,
      postalType: true,
      postalNumber: true,
    });
  } else {
    this.mainForm.updateHidden({
      postalUnitType: false,
      postalFloorNumber: false,
      postalFloorType: false,
      postalBuildingName: false,
      postalRuralDelivery: false,
      postalStreetDirection: false,
      postalStreetType: false,
      postalStreetName: false,
      postalStreetNumber: false,
      postalUnitNumber: false,
      postalStreetArea: true,
      postalType: false,
      postalNumber: false,
    });
  }

  // Set address type with emitEvent: true to trigger onFormEvent
  this.mainForm.form.get("postalAddressType")?.patchValue(copiedAddressType, { emitEvent: true });
  this.selectedAddressType = copiedAddressType;

  // EDIT: Store postalAddressType in copiedPhysicalValues for comparison
  this.copiedPhysicalValues['postalAddressType'] = copiedAddressType;

  // Enable/disable country dropdown based on address type
  if (this.selectedAddressType === "street") {
    this.mainForm.form.get("postalCountry")?.disable({ emitEvent: false });
  } else {
    this.mainForm.form.get("postalCountry")?.enable({ emitEvent: false });
  }

  // Patch all form values while preserving control disabled states and storing copied values
  Object.keys(physicalData).forEach(key => {
    const control = this.mainForm.form.get(key);
    if (control && physicalData[key] !== undefined && physicalData[key] !== null) {
      // Store the copied value for later comparison
      this.copiedPhysicalValues[key] = physicalData[key];

      const wasDisabled = control.disabled;
      
      // Temporarily enable disabled controls to allow value update
      if (wasDisabled) {
        control.enable({ emitEvent: false });
      }
      
      control.patchValue(physicalData[key], { emitEvent: false });
      
      // Restore disabled state if control was previously disabled
      if (wasDisabled) {
        control.disable({ emitEvent: false });
      }
    }
  });

  // Store city location ID if provided
  if (physicalData.postalCityLocationId) {
    this.baseSvc.setBaseDealerFormData({
      postalCity: physicalData.postalCity,
      postalCityLocationId: physicalData.postalCityLocationId,
    });
  }

  // Mark toggle state as active
  this.baseFormData.physicalreuseOfPostalAddress = true;

  // CRITICAL EDIT: Reset flag AFTER copy is complete
  this.baseSvc.isCopyingToPostalSubject.next(false);
  this.baseSvc.isCopyingToPostal = false;

  // Trigger change detection to update view
  this.cdr.detectChanges();
}




async getCities() {
  const selectedCountry = this.mainForm?.form.get("postalCountry")?.value || "New Zealand";

  if (selectedCountry) {
    await this.baseSvc.getFormData(
      `LookUpServices/locations?LocationType=City`,
      (res) => {
        if (res.data && Array.isArray(res.data)) {
          let obj = res.data;
          const filteredCities = res.data
            .filter((city) => city.owner === selectedCountry)
            .map((city) => ({
              label: city.name,
              value: city.name,
            }));

          // Store both the filtered options and location IDs
          this.cityOptions = filteredCities;
          this.cityOptionsLocationId = obj; // Store all city data with locationId

          this.mainForm.updateList("postalCity", filteredCities);
        }
      }
    );
  }
}



  // async updateDropdownData() {
  //   await this.baseSvc.getFormData(
  //     `LookUpServices/custom_lookups?LookupSetName=UnitType`,
  //     (res) => {
  //       let list = res.data;
  //       const unitTypeList = list.map((item) => ({
  //         label: item.lookupValue,
  //         value: item.lookupValue,
  //       }));
  //       this.mainForm.updateList("postalUnitType", unitTypeList);
  //       return unitTypeList;
  //     }
  //   );
  //   await this.baseSvc.getFormData(
  //     `LookUpServices/custom_lookups?LookupSetName=FloorType`,
  //     (res) => {
  //       let list = res.data;
  //       const floorTypeList = list.map((item) => ({
  //         label: item.lookupValue,
  //         value: item.lookupValue,
  //       }));
  //       this.mainForm.updateList("postalFloorType", floorTypeList);
  //       return floorTypeList;
  //     }
  //   );
  //   // Load Street Type
  //   await this.baseSvc.getFormData(
  //     `LookUpServices/custom_lookups?LookupSetName=StreetType`,
  //     (res) => {
  //       let list = res.data;
  //       const streetTypeList = list.map((item) => ({
  //         label: item.lookupValue,
  //         value: item.lookupValue,
  //         lookupCode: item.lookupCode,
  //       }));
  //       this.mainForm.updateList("postalStreetType", streetTypeList);
  //       return streetTypeList;
  //     }
  //   );

  //   await this.baseSvc.getFormData(
  //     `LookUpServices/locations?LocationType=country`,
  //     (res) => {
  //       let list = res.data;
  //       const countryList = list.map((item) => ({
  //         label: item.name,
  //         value: item.name,
  //       }));

  //       // STORE the original country options
  //       this.countryOptions = countryList;

  //       // Get currently selected value
  //       const selectedCountry =
  //         this.mainForm?.form?.get("postalCountry")?.value ||
  //         this.baseFormData?.postalCountry ||
  //         "New Zealand";

  //       // Sort with selected country at top
  //       const sortedCountryList = this.sortOptionsWithSelectedOnTop(
  //         countryList,
  //         selectedCountry
  //       );

  //       this.mainForm.updateList("postalCountry", sortedCountryList);

  //       return sortedCountryList;
  //     }
  //   );

  //   // REPLACE THE CITY SECTION WITH THIS:
  //   await this.baseSvc.getFormData(
  //     `LookUpServices/locations?LocationType=City`,
  //     (res) => {
  //       let list = res.data;
  //       this.cityOptionsLocationId = list;

  //       const cityList = list.map((item) => ({
  //         label: item.name,
  //         value: item.name,
  //       }));

  //       // Store the original city options
  //       this.cityOptions = cityList;

  //       // Get currently selected value
  //       const selectedCity =
  //         this.mainForm?.form?.get("postalCity")?.value ||
  //         this.baseFormData?.postalCity ||
  //         "";

  //       // Sort with selected city at top
  //       const sortedCityList = this.sortOptionsWithSelectedOnTop(
  //         cityList,
  //         selectedCity
  //       );

  //       this.mainForm.updateList("postalCity", sortedCityList);

  //       return sortedCityList;
  //     }
  //   );
  // }

  override onValueChanges(event: any): void {
    // EDIT: IMMEDIATE CHANGE DETECTION - Check if user manually changed any copied field
    if (this.baseFormData?.physicalreuseOfPostalAddress && Object.keys(this.copiedPhysicalValues).length > 0 && !this.baseSvc.isCopyingToPostal) {
      // Check all postal fields in the event including postalAddressType
      Object.keys(event).forEach(fieldName => {
        if (fieldName.startsWith('postal')) {
          // EDIT: Special handling for postalAddressType
          if (fieldName === 'postalAddressType') {
            const currentValue = event[fieldName];
            const copiedValue = this.copiedPhysicalValues[fieldName];
            
            // If address type was stored and user changed it, toggle off
            if (copiedValue && currentValue !== copiedValue) {
              this.baseSvc.postalAddressManuallyChanged.next(true);
              return; // Exit early once we detect a change
            }
          } else {
            const currentValue = event[fieldName];
            const copiedValue = this.copiedPhysicalValues[fieldName];
            
            if (copiedValue !== undefined) {
              const normalizeValue = (val: any) => {
                if (val === null || val === undefined || val === '') return '';
                return String(val).trim();
              };
              
              if (normalizeValue(currentValue) !== normalizeValue(copiedValue)) {
                this.baseSvc.postalAddressManuallyChanged.next(true);
                return; // Exit early once we detect a change
              }
            }
          }
        }
      });
    }

    if (event.postalSearchValue && event.postalSearchValue.length >= 4) {
      this.searchSvc.searchAddress(event.postalSearchValue).subscribe((res) => {
        this.searchAddressList = res;
        this.mainForm.updateList("postalSearchValue", this.searchAddressList);
      });
    }
  }

  private checkIfPostalFieldChanged(event: any): void {
    // Skip if copying is in progress
    if (this.baseSvc.isCopyingToPostal) {
      return;
    }
    
    // Only check if physicalreuseOfPostalAddress was ON (meaning data was copied) and we have stored copied values
    if (!this.baseFormData?.physicalreuseOfPostalAddress || Object.keys(this.copiedPhysicalValues).length === 0) {
      return;
    }
    
    // Get the field name that was changed
    const fieldName = event.name;
    
    // Check all postal fields including postalAddressType
    if (!fieldName || !fieldName.startsWith('postal')) {
      return;
    }
    
    // EDIT: Special handling for postalAddressType - if changed from copied value, toggle off
    if (fieldName === 'postalAddressType') {
      const currentValue = event.data !== undefined ? event.data : event.value;
      const copiedValue = this.copiedPhysicalValues[fieldName];
      
      // If address type was stored and user changed it, toggle off
      if (copiedValue && currentValue !== copiedValue) {
        this.baseSvc.postalAddressManuallyChanged.next(true);
      }
      return; // Don't check other address type changes
    }
    
    // Get the current value and the copied value
    const currentValue = event.data !== undefined ? event.data : this.mainForm?.form?.get(fieldName)?.value;
    const copiedValue = this.copiedPhysicalValues[fieldName];
    
    // Skip if this field wasn't copied (might not exist in physical address)
    if (copiedValue === undefined) {
      return;
    }
    
    // Normalize values for comparison (handle null, undefined, empty string)
    const normalizeValue = (val: any) => {
      if (val === null || val === undefined || val === '') return '';
      return String(val).trim();
    };
    
    const normalizedCurrent = normalizeValue(currentValue);
    const normalizedCopied = normalizeValue(copiedValue);
    
    // If current value differs from copied value, it's a manual change - toggle off immediately
    if (normalizedCurrent !== normalizedCopied) {
      // Immediately notify service to toggle off physicalreuseOfPostalAddress
      this.baseSvc.postalAddressManuallyChanged.next(true);
    }
  }
/**
 * Clears all address-related fields when user manually changes address type
 * This preserves the address type field but clears all other address data
 */
private clearAddressDataOnTypeChange(newAddressType: string): void {
  const fieldsToClear = [
    'postalSearchValue',
    'postalBuildingName',
    'postalFloorType',
    'postalFloorNumber',
    'postalUnitType',
    'postalStreetArea',
    'postalUnitNumber',
    'postalStreetNumber',
    'postalStreetName',
    'postalStreetType',
    'postalStreetDirection',
    'postalRuralDelivery',
    'postalSuburbs',
    'postalCity',
    'postalPostcode',
    'postalCityLocationId',
    'postalCountry',
    'postalPostalNumber'
  ];
  
  // Clear form controls
  fieldsToClear.forEach(fieldName => {
    const control = this.mainForm?.form?.get(fieldName);
    if (control) {
      control.reset(null, { emitEvent: false });
    }
  });
  
  // Clear baseFormData
  const dataToClear: any = {};
  fieldsToClear.forEach(fieldName => {
    dataToClear[fieldName] = null;
  });
  this.baseSvc.setBaseDealerFormData(dataToClear);
  
  // Clear search value
  this.physicalSeachValue = null;
  
  // Set country based on address type
  if (newAddressType === 'street') {
    // For street: set New Zealand and disable
    this.mainForm.form.get('postalCountry')?.enable({ emitEvent: false });
    this.mainForm.form.get('postalCountry')?.patchValue('New Zealand', { emitEvent: false });
    this.mainForm.form.get('postalCountry')?.disable({ emitEvent: false });
    this.baseSvc.setBaseDealerFormData({ postalCountry: 'New Zealand' });
  } else {
    // For PO Box: clear country but ENABLE so user can select any country (including NZ)
    this.mainForm.form.get('postalCountry')?.enable({ emitEvent: false });
    // Don't set any value - let it be empty/null so user can choose
  }
  
  // If toggle was on, notify physical component to turn it off
  if (this.baseFormData?.physicalreuseOfPostalAddress) {
    this.baseSvc.postalAddressManuallyChanged.next(true);
  }
  
  // Clear copied values since we're starting fresh
  this.copiedPhysicalValues = {};
}



override async onFormEvent(event): Promise<void> {
  if (event.name === "postalCountry") {
    // Only call getCities if country value exists and has actually changed
    if (event?.value && event?.value !== this.tempCity) {
      await this.getCities();
      this.tempCity = event?.value;
    }
  }

  if (event.name === "postalAddressType") {
    // CRITICAL: Check if this is a copy operation
    const isCopyingOperation = this.baseSvc.isCopyingToPostalSubject.getValue() === true;
    
    if (isCopyingOperation) {
      // During copy: only update visibility, don't clear fields or check for manual changes
      if (event.value === "po") {
        this.mainForm.form.get("postalCountry")?.enable({ emitEvent: false });
        this.mainForm?.updateHidden({
          postalUnitType: true,
          postalFloorNumber: true,
          postalFloorType: true,
          postalBuildingName: true,
          postalRuralDelivery: true,
          postalStreetDirection: true,
          postalStreetType: true,
          postalStreetName: true,
          postalStreetNumber: true,
          postalUnitNumber: true,
          postalStreetArea: false,
          postalType: true,
          postalNumber: true,
        });
      } else {
        this.mainForm.form.get("postalCountry")?.patchValue('New Zealand', { emitEvent: false });
        this.mainForm.form.get("postalCountry")?.disable({ emitEvent: false });
        this.mainForm?.updateHidden({
          postalUnitType: false,
          postalFloorNumber: false,
          postalFloorType: false,
          postalBuildingName: false,
          postalRuralDelivery: false,
          postalStreetDirection: false,
          postalStreetType: false,
          postalStreetName: false,
          postalStreetNumber: false,
          postalUnitNumber: false,
          postalStreetArea: true,
          postalType: false,
          postalNumber: false,
        });
      }
      
      // Update previousAddressType and exit early
      this.previousAddressType = event.value;
      return; // CRITICAL: Exit early to prevent field clearing during copy
    }
    
    // NEW: Detect manual address type change and clear fields
    const isManualChange = this.previousAddressType !== null && 
                          this.previousAddressType !== event.value;
    
    if (isManualChange) {
      // User manually changed address type - clear all fields
      this.clearAddressDataOnTypeChange(event.value);
    }
    
    // Handle normal address type change (not during copy)
    if (event.value === "po") {
      // For P.O. Box - enable country dropdown, leave it empty for user to select
      this.mainForm.form.get("postalCountry")?.enable({ emitEvent: false });    
      this.mainForm?.updateHidden({
        postalUnitType: true,
        postalFloorNumber: true,
        postalFloorType: true,
        postalBuildingName: true,
        postalRuralDelivery: true,
        postalStreetDirection: true,
        postalStreetType: true,
        postalStreetName: true,
        postalStreetNumber: true,
        postalUnitNumber: true,
        postalStreetArea: false,
        postalType: true,
        postalNumber: true,
      });
      
      // REMOVED: Don't force clear country here - clearAddressDataOnTypeChange already handles it if manual change
    } else {
      // For Street - set New Zealand and disable country dropdown
      this.mainForm.form.get("postalCountry")?.enable({ emitEvent: false });
      this.mainForm.form.get("postalCountry")?.patchValue('New Zealand', { emitEvent: false });
      this.mainForm.form.get("postalCountry")?.disable({ emitEvent: false }); 
      this.mainForm?.updateHidden({
        postalUnitType: false,
        postalFloorNumber: false,
        postalFloorType: false,
        postalBuildingName: false,
        postalRuralDelivery: false,
        postalStreetDirection: false,
        postalStreetType: false,
        postalStreetName: false,
        postalStreetNumber: false,
        postalUnitNumber: false,
        postalStreetArea: true,
        postalType: false,
        postalNumber: false,
      });
      
      // Ensure country is set to New Zealand for street type
      this.baseSvc.setBaseDealerFormData({ postalCountry: 'New Zealand' });
    }
    
    // Update previousAddressType
    this.previousAddressType = event.value;
    
    let portalWorkflowStatus = sessionStorage.getItem("workFlowStatus");
    if (
      (portalWorkflowStatus != 'Open Quote') || (
      this.baseFormData?.AFworkflowStatus &&
      this.baseFormData.AFworkflowStatus !== 'Quote'
      ) )
    {
      try {
        // Use emitEvent: false to prevent triggering validation subscriptions that cause split errors
        this.mainForm?.form?.disable({ emitEvent: false });
      } catch (error) {
        console.warn('BusinessPostalAddressComponent: Error disabling form', error);
      }
    }
    else{ 
      try {
        // Use emitEvent: false to prevent triggering validation subscriptions that cause split errors
        this.mainForm?.form?.enable({ emitEvent: false });
      } catch (error) {
        // Handle errors that might occur when enabling form triggers validation subscriptions
        if (error?.message?.includes('Cannot read properties of undefined') && error?.message?.includes('split')) {
          console.warn('BusinessPostalAddressComponent: Split error when enabling form - likely undefined pattern value in validation', error.message);
        } else {
          console.warn('BusinessPostalAddressComponent: Error enabling form', error);
        }
      }
    }
    
    await this.updateValidation("onInit");
  }

  super.onFormEvent(event);
}


  suggestionsChanged(event: any): void {
    if (!event || event.length === 0) {
      this.toasterService.showToaster({
        severity: "error",
        detail: "No Such address found",
      });
    } else {
      return event;
    }
  }
  postprocessingHook(feature: any) {
    return [feature.properties.address_line1, feature.properties.address_line2]
      .filter((part) => part && part.trim())
      .join(" ");
  }


private initializeCityHandler(): void {
  this.mainForm?.form?.get('postalCity')?.valueChanges
    .pipe(
      takeUntil(this.destroy$),
      filter(value => !!value),
      distinctUntilChanged()
    )
    .subscribe((cityName: string) => {
      this.handleCitySelection(cityName);
    });
}

private handleCitySelection(cityName: string): void {
  if (!this.cityOptionsLocationId || this.cityOptionsLocationId?.length === 0) {
    return;
  }
  
  const LocationId = this.cityOptionsLocationId.filter(
    (l) => l.name === cityName
  );

  if (LocationId && LocationId?.length > 0 && LocationId[0]?.locationId) {
    this.baseSvc.setBaseDealerFormData({
      postalCity: cityName,
      postalCityLocationId: LocationId[0]?.locationId,
    });
  }
}

  // UPDATED METHOD: Enhanced place selection with street type auto-population
  async placeSelected(event: any, index: any) {
    if (event.properties) {
      const data = event.properties;

      // NEW: Add street type handling (only for street address type)
      if (
        data.streetType &&
        this.mainForm.get("postalAddressType")?.value === "street"
      ) {
        setTimeout(async () => {
          await this.setStreetType(data.streetType);
        }, 200);
      }

      if (data.country) {
        this.mainForm.get("postalCountry").patchValue(data.country);
      }
      if (data.postcode)
        this.mainForm.get("postalPostcode").patchValue(data.postcode);
      if (data.city) this.mainForm.get("postalCity").patchValue(data.city);
      if (data.street)
        this.mainForm.get("postalStreetName").patchValue(data.street);
      if (data.suburb)
        this.mainForm.get("postalSuburbs").patchValue(data.suburb);
      if (data.country != "New Zealand") {
        this.mainForm.updateHidden({
          postalUnitType: true,
          postalFloorNumber: true,
          postalFloorType: true,
          postalBuildingName: true,
          postalRuralDelivery: true,
          postalStreetDirection: true,
          postalStreetType: true,
          postalStreetName: true,
          postalStreetNumber: true,
          postalUnitNumber: true,
          postalStreetArea: false,
        });
      } else {
        this.mainForm.updateHidden({
          postalUnitType: false,
          postalFloorNumber: false,
          postalFloorType: false,
          postalBuildingName: false,
          postalRuralDelivery: false,
          postalStreetDirection: false,
          postalStreetType: false,
          postalStreetName: false,
          postalStreetNumber: false,
          postalUnitNumber: false,
          postalStreetArea: true,
        });
      }
    }
  }
  override async onSuccess(data: any) {}
  override async onFormDataUpdate(res: any): Promise<void> {
    if (
      this.baseFormData?.physicalreuseOfPostalAddress !==
      res?.physicalreuseOfPostalAddress
    ) {
      const isNz = res.physicalCountry === "New Zealand";

      // Set flag EARLY to prevent form change listener from triggering during copy/reset operations
      this.baseSvc.isCopyingToPostal = true;

      this.mainForm.form
        .get("postalAddressType")
        .patchValue(isNz ? "street" : "po", { emitEvent: false });
      this.mainForm.updateHidden({
        postalFloorNumber: isNz,
        postalFloorType: isNz,
        postalBuildingName: isNz,
        postalRuralDelivery: isNz,
        postalStreetDirection: isNz,
        postalStreetType: isNz,
        postalStreetName: isNz,
        postalStreetNumber: isNz,
        postalUnitNumber: isNz,
        postalStreetArea: !isNz,
        postalType: isNz,
        postalNumber: isNz,
      });
      // await this.updateValidation("onInit");
      if (res.physicalreuseOfPostalAddress) {
        // Clear previous copied values and store new ones
        this.copiedPhysicalValues = {};

        const fields = [
          "FloorType",
          "BuildingName",
          "UnitType",
          "StreetArea",
          "SearchValue",
          "BuildingName",
          "City",
          "Year",
          "Month",
          "UnitNumber",
          "Country",
          "FloorType",
          "Postcode",
          "ResidenceType",
          "RuralDelivery",
          "StreetDirection",
          "StreetName",
          "StreetNumber",
          "StreetType",
          "Suburbs",
          "TimeAtAddress",
          "UnitType",
          "FloorType",
          "FloorNumber",
          "StreetArea",
          "SearchCountry",
        ];

        fields.forEach((field) => {
          const controlName = `postal${field}`;
          const control = this.mainForm?.form?.get(controlName);
          const value = res[`physical${field}`];

          if (control && value !== undefined && value !== null) {
            // Store the copied value for later comparison
            this.copiedPhysicalValues[controlName] = value;

            const wasDisabled = control.disabled;
            if (wasDisabled) control.enable({ emitEvent: false });
            control.setValue(value, { emitEvent: false });
            if (wasDisabled) control.disable({ emitEvent: false });
          }
        });
        
        // Store postalAddressType as "street" in copiedPhysicalValues for comparison
        this.copiedPhysicalValues['postalAddressType'] = 'street';
        
        this.mainForm.form.get("postalAddressType").patchValue("street", { emitEvent: false });
        
        // Immediately enable change detection after copy is complete
        this.baseSvc.isCopyingToPostal = false;
        } else {
        if (this?.baseFormData?.physicalreuseOfPostalAddress) {
          // Clear copied values when toggle is turned off
          this.copiedPhysicalValues = {};
          try {
            // Use emitEvent: false to prevent triggering validation subscriptions that cause split errors
            this.mainForm.form.reset({}, { emitEvent: false });
            this.mainForm.form.get("postalAddressType").patchValue("po", { emitEvent: false });
          } catch (error) {
            if (error?.message?.includes('Cannot read properties of undefined') && error?.message?.includes('split')) {
              console.warn('BusinessPostalAddressComponent: Split error when resetting form in onFormDataUpdate - likely undefined pattern value in validation', error.message);
            } else {
              console.warn('BusinessPostalAddressComponent: Error resetting form in onFormDataUpdate', error);
            }
          }
        }
        // Reset copying flag immediately for reset scenario
        this.baseSvc.isCopyingToPostal = false;
      }

      this.cdr.detectChanges();
    }
  }

  pageCode: string = "BusinessAddressDetailsComponent";
  modelName: string = "BusinessPostalAddressComponent";

  override async onFormReady(): Promise<void> {
    const addressType = this.mainForm?.form?.get('postalAddressType')?.value || 'street';
    await this.updateValidation("onInit");
    super.onFormReady();
  }

  // UPDATED METHOD: Enhanced blur event with street type auto-population
  override async onBlurEvent(event): Promise<void> {
    if (event.name == "postalSearchValue") {
      // if(event.data && event.data.length >= 4){
      this.searchSvc
        .getExternalAddressDetails(event.value.externalAddressLookupKey)
        .subscribe(async (res) => {
          //console.log("External business postal address result:", res);
          const formValues = this.searchSvc.mapAddressJsonToFormControls(
            res.data,
            "postal"
          );
          if (this.mainForm.form.get("postalAddressType")?.value === "po") {
            this.mainForm.form
              .get("postalStreetArea")
              .patchValue(formValues.postalStreetArea);
            this.mainForm.form
              .get("postalSuburbs")
              .patchValue(formValues.postalSuburbs);
            this.mainForm.form
              .get("postalCity")
              .patchValue(formValues.postalCity);
            this.mainForm.form
              .get("postalPostcode")
              .patchValue(formValues.postalPostcode);
            this.mainForm.form
              .get("postalCountry")
              .patchValue(formValues.postalCountry);
          } else {
            // Patch form values first - use emitEvent: false to prevent triggering validation subscriptions that cause split errors
            try {
              this.mainForm.form.patchValue(formValues, { emitEvent: false });
            } catch (error) {
              if (error?.message?.includes('Cannot read properties of undefined') && error?.message?.includes('split')) {
                console.warn('BusinessPostalAddressComponent: Split error when patching form values in onBlurEvent - likely undefined pattern value in validation', error.message);
              } else {
                console.error('BusinessPostalAddressComponent: Error patching form values in onBlurEvent', error);
              }
            }

            // IMPROVED: Better street type handling with proper timing (only for street type)
            // if (formValues.postalStreetType && this.mainForm.form.get("postalAddressType")?.value === "street") {
            //   setTimeout(async () => {
            //     await this.setStreetType(formValues.postalStreetType);
            //   }, 300);
            // }

            // COMMENTED OUT: Old street type handling method
            /*
            const options = await this.mainForm.fieldProps['postalStreetType'].options;
            this.mainForm.get('postalStreetType').setValue(options?.find(obj=>obj.lookupCode == formValues?.postalStreetType?.toUpperCase())?.value)
            */
          }
          // this.mainForm.get('postalCountry').disable({emitEvent:false});
        });
      // }
    }
    await this.updateValidation(event);
  }

  // this.mainForm.updateHidden({
  //           postalUnitType: false,
  //           postalFloorNumber: false,
  //           postalFloorType: false,
  //           postalBuildingName: false,
  //           postalRuralDelivery: false,
  //           postalStreetDirection: false,
  //           postalStreetType: false,
  //           postalStreetName: false,
  //           postalStreetNumber: false,
  //           postalUnitNumber: false,
  //           postalStreetArea: true,
  mapAddressJsonToFormControls(response: any): any {
    let componentMap: { [key: string]: string };

    if (this.selectedAddressType === "po") {
      componentMap = {
        street: "postalStreetArea",
      };
    } else if (this.selectedAddressType === "street") {
      componentMap = {
        BuildingName: "postalBuildingName",
        FloorType: "postalFloorType",
        FloorNo: "postalFloorNumber",
        UnitType: "postalUnitType",
        UnitLot: "postalUnitNumber",
        StreetNo: "postalStreetNumber",
        StreetName: "postalStreetName",
        StreetType: "postalStreetType",
        StreetDirection: "postalStreetDirection",
        RuralDelivery: "postalRuralDelivery",
      };
    }

    const data = response?.data;
    const result: any = {};

    if (data?.addressComponents) {
      data.addressComponents.forEach((component: any) => {
        const formKey = componentMap[component.type];
        if (formKey) {
          result[formKey] = component.value;
        }
      });
    }

    result["postalSuburbs"] = data?.suburb || "";
    result["postalCity"] = data?.city?.extName || "";
    result["postalPostcode"] = data?.zipCode || "";
    result["postalCountry"] = data?.countryRegion?.extName || "";

    return result;
  }

  override async onValueEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  async updateValidation(event) {
    // Safety check: ensure mainForm exists
    if (!this.mainForm || !this.mainForm.form) {
      console.warn('BusinessPostalAddressComponent: mainForm or form not available for validation');
      return true; // Return true to prevent blocking if form isn't ready
    }

    const req = {
      form: this.mainForm?.form,
      formConfig: this.formConfig,
      event: event,
      modelName: this.modelName,
      pageCode: this.pageCode,
    };

    try {
      const responses = await this.validationSvc.updateValidation(req);
      
      if (!responses.status && responses.updatedFields && responses.updatedFields.length > 0) {
        await this.mainForm.applyValidationUpdates(responses);
      }

      return responses.status;
    } catch (error) {
      // Handle regex pattern errors gracefully - don't break the app
      if (error?.message?.includes('Invalid regular expression') || error?.message?.includes('Range out of order')) {
        console.warn('BusinessPostalAddressComponent: Invalid regex pattern in validation rules', error.message);
        return true; // Return true to prevent blocking on invalid patterns
      }
      
      // Handle split errors gracefully
      if (error?.message?.includes('Cannot read properties of undefined') && error?.message?.includes('split')) {
        console.warn('BusinessPostalAddressComponent: Split error in validation - likely undefined pattern value', error.message);
        return true; // Return true to prevent blocking
      }
      
      // For other errors, log but don't throw to prevent breaking the app
      console.error('BusinessPostalAddressComponent: Validation error', error);
      return true; // Return true instead of throwing to prevent app breakage
    }
  }

  override async onStepChange(quotesDetails: any): Promise<void> {
    super.onStepChange(quotesDetails);
    if (quotesDetails.type !== "tabNav") {
      var result: any = await this.updateValidation("onSubmit");
      // if (!result?.status) {
      //   this.toasterSvc.showToaster({
      //     severity: "error",
      //     detail: "I7",
      //   });
      // }
    }
    this.baseSvc.updateComponentStatus(
      "Address Details",
      "BusinessPostalAddressComponent",
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
  this.reusePhysicalSubs?.unsubscribe();
  super.ngOnDestroy();
}
}
