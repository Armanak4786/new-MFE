import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  CommonService,
  GenericFormConfig,
  Mode,
  ToasterService,
  ValidationService,
} from "auro-ui";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BaseSoleTradeClass } from "../../../base-sole-trade.class";
import { SoleTradeService } from "../../../services/sole-trade.service";
import { SearchAddressService } from "../../../../standard-quote/services/search-address.service";
import { IndividualService } from "../../../../individual/services/individual.service";
import { debounceTime, distinctUntilChanged, filter, takeUntil } from "rxjs/operators";
import { Subscription } from "rxjs";

@Component({
  selector: "app-sole-trade-registered-address",
  templateUrl: "./sole-trade-registered-address.component.html",
  styleUrl: "./sole-trade-registered-address.component.scss",
})
export class SoleTradeRegisterAddressComponent extends BaseSoleTradeClass {
  optionsdata = [{ label: "icashpro", value: "icp" }];
  privousChecked: any;
  index: any;
  physicalSeachValue: String;
  customerRoleForm: FormGroup;
  searchAddressList: any;
  cityOptions: any = [];
  private countryOptions: any[] = [];
  private cityOptionsAll: any[] = [];
  cityOptionsLocationId: any = [];
  private copiedPhysicalValues: any = {}; // Store copied values for comparison
  private reuseRegisterSubs: Subscription;

  @Input() copyToPreviousAddress = false;
  borrowedAmount: any;

  override formConfig: GenericFormConfig = {
    headerTitle: "Registered Address",
    autoResponsive: true,
    api: "",
    goBackRoute: "",
    cardType: "border",
    //cardBgColor: "--background-color-secondary",
    fields: [
      {
        type: "autoSelect",
        label: "Search",
        name: "registerSearchValue",
        idKey: "street",
        cols: 2,
        options: [],
        className: "my-1",
        rightIcon: true,
        icon: "fa-solid fa-location-crosshairs fa-lg",
        minLength: 3,
        nextLine: true,
      },
      // {
      //   type: "text",
      //   label: "Attention",
      //   name: "registerAttention",
      //   // //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],  --Auro Ui
      //   className: " ",
      //   cols: 3,
      //   nextLine: true,
      // },

      // {
      //   type: "number",
      //   inputType: "vertical",
      //   label: "Time at address",
      //   name: "registerYear",
      //   maxLength: 2,
      //   className: "col-fixed w-4rem ml-3 white-space-nowrap",
      //   inputClass: "-m-2",
      //   // validators: [Validators.required, Validators.min(1)],  -- Auro
      // },
      // {
      //   type: "label-only",
      //   typeOfLabel: "inline",
      //   label: "Years",

      //   name: "year",
      //   className: "mt-3 pt-3 col-fixed w-4rem",
      // },
      // {
      //   type: "number",
      //   inputType: "vertical",
      //   name: "registerMonth",
      //   maxLength: 2,
      //   // validators: [Validators.max(11)],   -- Auro
      //   errorMessage: "Value should be less than 12",
      //   className: "-mt-2 col-fixed w-4rem yearmonthClass",
      // },
      // {
      //   type: "label-only",
      //   typeOfLabel: "inline",
      //   label: "Months",
      //   name: "month",
      //   className: "mt-3 pt-3 col-fixed w-4rem",
      //   nextLine: false,
      // },
      // {
      //   type: "text",
      //   label: "Postal Number ",
      //   name: "registerPostalNumber",
      //   className: "lg:col-offset-1 pl-1 mt-2",
      //   cols: 3,
      //   /* //validators: [
      //     Validators.required,
      //     Validators.pattern(/^[A-Za-z0-9\-\/]*$/),
      //   ],    for Auro UI */
      //   nextLine: true,
      // },
      {
        type: "text",
        label: "Building Name",
        name: "registerBuildingName",
        maxLength: 20,
        inputType: "vertical",
        inputClass: "w-8 ",
        className: " ",
        // //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],  -- Auro

        cols: 2,
        nextLine: false,
      },
      {
        type: "select",
        label: "Unit Type",
        name: "registerUnitType",
        alignmentType: "vertical",
        // //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],  -- Auro
        className: "px-0 customLabel",
        cols: 2,
        // list$: "LookUpServices/custom_lookups?LookupSetName=UnitType",
        // idKey: "lookupValue",
        // idName: "lookupValue",
        options: [],
        labelClass: "w-8 -my-3",

        // nextLine: true,
      },
      {
        type: "select",
        label: "Floor Type",
        name: "registerFloorType",
        alignmentType: "vertical",
        // //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],  -- Auro
        className: "px-0 customLabel",
        cols: 2,
        // list$: "LookUpServices/custom_lookups?LookupSetName=FloorType",
        // idKey: "lookupValue",
        // idName: "lookupValue",
        options: [],
        labelClass: "w-8 -my-3",
      },
      {
        type: "text",
        label: "Floor Number",
        name: "registerFloorNumber",
        // //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],  -- Auro
        className: " ",
        cols: 2,
        maxLength: 5,
        inputType: "vertical",
        inputClass: "w-8",
      },

      {
        type: "textArea",
        label: "Address",
        name: "registerStreetArea",
        inputType: "vertical",
        // //validators: [Validators.pattern(/^[A-Za-z0-9\-\/]*$/)],  -- Auro
        textAreaRows: 4,
        className: " ",
        cols: 12,
        hidden: true,
        nextLine: true,
      },
      {
        type: "text",
        label: "Unit/Lot Number",
        name: "registerUnitNumber",
        inputType: "vertical",
        inputClass: "w-8",
        //validators: [Validators.pattern(/^[A-Za-z0-9\-\/]*$/)],
        className: " ",
        cols: 2,
        nextLine: false,
      },
      {
        type: "text",
        label: "Street Number",
        name: "registerStreetNumber",
        // validators: [
        //   Validators.required,
        //   Validators.pattern(/^[A-Za-z0-9\-\/]*$/),
        // ],
        className: " ",
        cols: 2,
        inputType: "vertical",
        inputClass: "w-8",
        nextLine: false,
      },

      {
        type: "text",
        label: "Street Name",
        name: "registerStreetName",
        inputType: "vertical",
        inputClass: "w-8",
        // validators: [
        //   Validators.required,
        //   Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/),
        // ],
        className: "",
        cols: 2,
        nextLine: false,
      },
      {
        type: "select",
        label: "Street Type",
        name: "registerStreetType",
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
      },

      {
        type: "text",
        label: "Street Direction",
        name: "registerStreetDirection",
        inputType: "vertical",
        inputClass: "w-8",
        // validators: [
        //   Validators.required,
        //   Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/),
        // ],
        className: "",
        cols: 2,
        nextLine: false,
      },
      {
        type: "text",
        label: "Rural Delivery",
        name: "registerRuralDelivery",
        inputType: "vertical",
        inputClass: "w-8",
        className: "",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
        cols: 2,
        nextLine: true,
      },
      {
        type: "text",
        label: "Suburb",
        name: "registerSuburbs",
        inputType: "vertical",
        inputClass: "w-8",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
        className: " ",
        cols: 2,
        maxLength: 20,
        nextLine: false,
      },
      {
        type: "select",
        label: "City",
        name: "registerCity",
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
        nextLine: false,
      },
      {
        type: "text",
        label: "Postcode",
        name: "registerPostcode",
        inputType: "vertical",
        inputClass: "w-8",
        // maxLength: 6,
        //validators: [Validators.required],
        className: "",
        cols: 2,
        maxLength: 10,
        nextLine: false,
      },
      {
        type: "select",
        label: "Country",
        name: "registerCountry",
        alignmentType: "vertical",
        labelClass: "w-8 mb-2",
        //validators: [Validators.required],
        className: "px-0 customLabel",
        cols: 2,
        // list$: "LookUpServices/locations?LocationType=country",
        // idKey: "name",
        // idName: "name",
        options: [],
        default: "New Zealand",
        nextLine: false,
        // disabled: true,
      },
      // {
      //   type: "text",
      //   label: "Country",
      //   name: "registerCountry",
      //   disabled: true,
      //   inputType: "vertical",
      //   inputClass: "w-8 mt-2",
      //   labelClass: "w-8 -my-3",
      //   //validators: [Validators.required],
      //   className: "px-0 mt-2 customLabel",
      //   cols: 2,
      //   default: "New Zealand",
      //   nextLine: false,
      //   mode: Mode.view,
      // },
    ],
  };

  constructor(
    public fb: FormBuilder,
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: SoleTradeService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef,
    public searchSvc: SearchAddressService,
    private indSvc: IndividualService
  ) {
    super(route, svc, baseSvc);
  }

  // NEW METHOD: Add street type handling method for sole trade registered address
  async setStreetType(streetTypeValue: string) {
    try {
      // Ensure street type options are loaded - using fieldProps for sole trade component as shown in original onBlurEvent
      const streetTypeOptions =
        this.mainForm?.fieldProps?.["registerStreetType"]?.options;

      if (!streetTypeOptions || streetTypeOptions.length === 0) {
        // Retry after a short delay
        setTimeout(() => this.setStreetType(streetTypeValue), 500);
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
          .get("registerStreetType")
          .patchValue(matchedOption.value || matchedOption.label);
      }
    } catch (error) {}
  }

override async ngOnInit(): Promise<void> {
  await super.ngOnInit();

   let portalWorkflowStatus = sessionStorage.getItem("workFlowStatus");
     if (
      (portalWorkflowStatus != 'Open Quote') || (
    this.baseFormData?.AFworkflowStatus &&
    this.baseFormData.AFworkflowStatus !== 'Quote'
    ) )
    {
    this.mainForm?.form?.disable();
    }
    else{ this.mainForm?.form?.enable();}
  // Load existing locationId from addressDetails
  const dealerFormData = this.baseSvc.getBaseDealerFormData().value;
  dealerFormData?.addressDetails?.forEach((address) => {
    if (address?.addressType === "Registered") {
      const registeredCityLocationId = address?.city?.locationId;
      this.baseSvc.setBaseDealerFormData({
        registerCityLocationId: registeredCityLocationId
      });
    }
  });

    if (this.baseSvc.showValidationMessage) {
      this.mainForm.form.markAllAsTouched();
    }

    this.customerRoleForm = this.fb.group({
      physicalSeachValue: ["", Validators.required],
    });

  this.indSvc.updateDropdownData().subscribe((result) => {
    this.mainForm.updateList("registerFloorType", result?.floorType);
    this.mainForm.updateList("registerUnitType", result?.unitType);
    this.mainForm.updateList("registerStreetType", result?.streetType);
    if (result?.country) {
      this.mainForm.updateList("registerCountry", result?.country);
      this.mainForm?.form?.get("registerCountry")?.setValue("New Zealand");
      this.mainForm.updateList("registerCity", result?.city);
      
    }
  });
  await this.getCities();

  // Initialize subscription to physical address copy signals (like business module)
  this.initializeCopySubscription();
}

// Initializes subscription to physical address copy signals
private initializeCopySubscription(): void {
  // Unsubscribe from previous subscription if exists
  this.reuseRegisterSubs?.unsubscribe();
  
  this.reuseRegisterSubs = this.baseSvc.reuseRegister$
    .pipe(
      takeUntil(this.destroy$),
      filter(payload => {
        if (!payload) return false;
        if (typeof payload === 'string') return false; // Filter out old string format
        return true;
      })
    )
    .subscribe((payload: any) => {
      if (!this.mainForm) return;

      if (payload?.action === 'copiedToRegister' && payload?.data) {
        this.handleCopyFromPhysical(payload.data);
      }
    });
}

private handleCopyFromPhysical(physicalData: any): void {
  const isNz = physicalData.registerCountry === "New Zealand";

  // Set flag EARLY to prevent form change listener from triggering during copy operations
  this.baseSvc.isCopyingToRegister = true;

  // Clear previous copied values and store new ones
  this.copiedPhysicalValues = {};

  if (!isNz) {
    this.mainForm.updateHidden({
      registerUnitType: true,
      registerFloorNumber: true,
      registerFloorType: true,
      registerBuildingName: true,
      registerRuralDelivery: true,
      registerStreetDirection: true,
      registerStreetType: true,
      registerStreetName: true,
      registerStreetNumber: true,
      registerUnitNumber: true,
      registerStreetArea: false,
    });
  } else {
    this.mainForm.updateHidden({
      registerUnitType: false,
      registerFloorNumber: false,
      registerFloorType: false,
      registerBuildingName: false,
      registerRuralDelivery: false,
      registerStreetDirection: false,
      registerStreetType: false,
      registerStreetName: false,
      registerStreetNumber: false,
      registerUnitNumber: false,
      registerStreetArea: true,
    });
  }

  // Copy all values from physicalData
  Object.keys(physicalData).forEach(key => {
    const control = this.mainForm.form.get(key);
    if (control && physicalData[key] !== undefined && physicalData[key] !== null) {
      // Store the copied value for later comparison (including empty strings)
      this.copiedPhysicalValues[key] = physicalData[key];

      const wasDisabled = control.disabled;
      if (wasDisabled) control.enable({ emitEvent: false });
      control.setValue(physicalData[key], { emitEvent: false });
      if (wasDisabled) control.disable({ emitEvent: false });
    }
  });

  // Update baseFormData with all copied register values so they're included in payload
  this.baseSvc.setBaseDealerFormData(physicalData);

  // Handle city location ID
  if (physicalData.registerCityLocationId) {
    this.baseSvc.setBaseDealerFormData({
      registerCity: physicalData.registerCity,
      registerCityLocationId: physicalData.registerCityLocationId,
    });
  }

  this.baseFormData.physicalreuseOfRegisterAddress = true;
  
  // Immediately enable change detection after copy is complete
  this.baseSvc.isCopyingToRegister = false;
  
  this.cdr.detectChanges();
}

  override async onSuccess(data: any) {}

  suggestionsChanged(event: any): void {
    if (!event || event.length === 0) {
      this.toasterSvc.showToaster({
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
override async onFormEvent(event: any): Promise<void> {
  if (event.name === "registerCity") {
    const locationName = event.value || this.mainForm?.form?.get("registerCity")?.value;
    
    if (!this.cityOptionsLocationId || this.cityOptionsLocationId.length === 0) {
      await this.getCities();
    }
    
    const LocationId = this.cityOptionsLocationId?.filter(
      (l) => l.name === locationName
    );

    if (LocationId && LocationId.length > 0 && LocationId[0]?.locationId) {
      this.baseSvc.setBaseDealerFormData({
        registerCity: locationName,
        registerCityLocationId: LocationId[0]?.locationId,
      });

    }
  }
  
  if (event.name == "registerCountry") {
    // Commented out to keep layout consistent regardless of country
    /*
    if (event.value != "New Zealand") {
      this.mainForm.updateHidden({
        registerUnitType: true,
        registerFloorNumber: true,
        registerFloorType: true,
        registerBuildingName: true,
        registerRuralDelivery: true,
        registerStreetDirection: true,
        registerStreetType: true,
        registerStreetName: true,
        registerStreetNumber: true,
        registerUnitNumber: true,
        registerStreetArea: false,
      });
    } else {
      this.mainForm.updateHidden({
        registerUnitType: false,
        registerFloorNumber: false,
        registerFloorType: false,
        registerBuildingName: false,
        registerRuralDelivery: false,
        registerStreetDirection: false,
        registerStreetType: false,
        registerStreetName: false,
        registerStreetNumber: false,
        registerUnitNumber: false,
        registerStreetArea: true,
      });
    }
    */
    await this.getCities();
  }
  
  await this.updateValidation("onInit");
  super.onFormEvent(event);
   let portalWorkflowStatus = sessionStorage.getItem("workFlowStatus");
     if (
      (portalWorkflowStatus != 'Open Quote') || (
    this.baseFormData?.AFworkflowStatus &&
    this.baseFormData.AFworkflowStatus !== 'Quote'
    ) )
    {
    this.mainForm?.form?.disable();
    }
    else{ this.mainForm?.form?.enable();}

}


  private handleCitySelection(cityName: string): void {
  if (!this.cityOptionsLocationId || this.cityOptionsLocationId.length === 0) {
    return;
  }
  
  const matchedLocation = this.cityOptionsLocationId.filter(
    (location) => location.name === cityName
  );

  if (matchedLocation && matchedLocation.length > 0 && matchedLocation[0]?.locationId) {
    this.baseSvc.setBaseDealerFormData({
      registerCity: cityName,
      registerCityLocationId: matchedLocation[0].locationId,
    });
  }
}

  // UPDATED METHOD: Enhanced place selection with street type auto-population
  async placeSelected(event: any, index: any) {
    if (event.properties) {
      const data = event.properties;

      // NEW: Add street type handling
      if (data.streetType) {
        setTimeout(async () => {
          await this.setStreetType(data.streetType);
        }, 200);
      }

      if (data.country)
        this.mainForm.get("registerCountry").patchValue(data.country);
      if (data.postcode)
        this.mainForm.get("registerPostcode").patchValue(data.postcode);
      if (data.city) this.mainForm.get("registerCity").patchValue(data.city);
      if (data.street)
        this.mainForm.get("registerStreetName").patchValue(data.street);
      if (data.suburb)
        this.mainForm.get("registerSuburbs").patchValue(data.suburb);

    // Commented out to keep consistent layout regardless of country
    /*
    if (data.country != "New Zealand") {
      this.mainForm.updateHidden({
        registerUnitType: true,
        registerFloorNumber: true,
        registerFloorType: true,
        registerBuildingName: true,
        registerRuralDelivery: true,
        registerStreetDirection: true,
        registerStreetType: true,
        registerStreetName: true,
        registerStreetNumber: true,
        registerUnitNumber: true,
        registerStreetArea: false,
      });
    } else {
      this.mainForm.updateHidden({
        registerUnitType: false,
        registerFloorNumber: false,
        registerFloorType: false,
        registerBuildingName: false,
        registerRuralDelivery: false,
        registerStreetDirection: false,
        registerStreetType: false,
        registerStreetName: false,
        registerStreetNumber: false,
        registerUnitNumber: false,
        registerStreetArea: true,
      });
    }
    */
  }
}
override onFormDataUpdate(res: any): void {
  // Copy is now handled by subscription, so we only need to handle reset case here
  if (
    this.baseFormData?.physicalreuseOfRegisterAddress &&
    !res?.physicalreuseOfRegisterAddress
  ) {
    // Set flag EARLY to prevent form change listener from triggering during reset operations
    this.baseSvc.isCopyingToRegister = true;

    // Clear copied values when toggle is turned off
    this.copiedPhysicalValues = {};
    
    // Toggle is OFF - reset all fields EXCEPT country
    const fields = [
      "SearchValue",
      "BuildingName",
      "City",
      "Year",
      "Month",
      "Lot",
      "FloorType",
      "UnitType",
      "Postcode",
      "ResidenceType",
      "RuralDelivery",
      "StreetDirection",
      "StreetName",
      "StreetNumber",
      "StreetType",
      "Suburbs",
      "TimeAtAddress",
      "UnitNumber",
      "Attention",
      "FloorNumber",
    ];

    fields.forEach((field) => {
      const registerField = this.mainForm.form.get(`register${field}`);
      if (registerField) {
        registerField.reset();
      }
    });
    
    // Reset postcode
    const postcodeCtrl = this.mainForm.form.get("registerPostcode");
    if (postcodeCtrl) {
      postcodeCtrl.reset();
    }
    
    // PRESERVE COUNTRY - Always set it back to New Zealand
    const countryCtrl = this.mainForm.form.get("registerCountry");
    if (countryCtrl) {
      countryCtrl.patchValue("New Zealand", { emitEvent: false });
    }
    
    // Reset copying flag
    this.baseSvc.isCopyingToRegister = false;
  }
}
override async onValueTyped(event: any): Promise<void> {
  // IMMEDIATE CHANGE DETECTION: Check if user manually changed a copied field
  this.checkIfRegisterFieldChanged(event);
  
  // Save typed value to baseFormData for payload
  if (event.name && event.name.startsWith('register')) {
    const formControl = this.mainForm?.form?.get(event.name);
    if (formControl) {
      const fieldValue = formControl.value;
      this.baseSvc.setBaseDealerFormData({
        [event.name]: fieldValue
      });
    }
  }

  if (event.name === "registerCity") {
    if (!this.cityOptionsLocationId || this.cityOptionsLocationId.length === 0) {
      await this.getCities();
    }
    
    const locationName = this.mainForm.form.get("registerCity").value;
    const LocationId = this.cityOptionsLocationId?.filter(
      (l) => l.name === locationName
    );

    if (LocationId && LocationId.length > 0 && LocationId[0]?.locationId) {
      this.baseSvc.setBaseDealerFormData({
        registerCity: locationName,
        registerCityLocationId: LocationId[0]?.locationId,
      });
    }
  }
  
  if (event.name === "registerSearchValue") {
    if (event.data && event.data.length >= 4) {
      this.searchSvc.searchAddress(event.data).subscribe((res) => {
        this.searchAddressList = res;
      });
    }
  }
  if (event.name === "registerCountry") {
    await this.getCities();
  }
  
  await this.updateValidation("onInit");
}

private checkIfRegisterFieldChanged(event: any): void {
  // Skip if copying is in progress
  if (this.baseSvc.isCopyingToRegister) {
    return;
  }
  
  // Only check if physicalreuseOfRegisterAddress was ON (meaning data was copied) and we have stored copied values
  if (!this.baseFormData?.physicalreuseOfRegisterAddress || Object.keys(this.copiedPhysicalValues).length === 0) {
    return;
  }
  
  // Get the field name that was changed
  const fieldName = event.name;
  
  // Check all register fields
  if (!fieldName || !fieldName.startsWith('register')) {
    return;
  }
  
  // Get the current value and the copied value (same pattern as postal component)
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
    // Immediately notify service to toggle off physicalreuseOfRegisterAddress
    this.baseSvc.registerAddressManuallyChanged.next(true);
  }
}

async getCities(): Promise<void> {
  const selectedCountry =
    this.mainForm?.form.get("registerCountry")?.value || "New Zealand";

  if (selectedCountry) {
    return new Promise<void>((resolve) => {
      this.baseSvc.getFormData(
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

            this.cityOptionsAll = filteredCities;
            this.cityOptionsLocationId = obj;
            this.cityOptions = filteredCities;
            this.mainForm.updateList("registerCity", filteredCities);
            
            const existingCity = this.mainForm?.form?.get("registerCity")?.value || this.baseFormData?.registerCity;
            if (existingCity) {
              const LocationId = this.cityOptionsLocationId.filter(
                (l) => l.name === existingCity
              );
              
              if (LocationId && LocationId.length > 0 && LocationId[0]?.locationId) {
                this.baseSvc.setBaseDealerFormData({
                  registerCity: existingCity,
                  registerCityLocationId: LocationId[0]?.locationId,
                });
              }
            }
            
            resolve();
          } else {
            this.cityOptionsLocationId = [];
            resolve();
          }
        }
      );
    });
  } else {
    this.cityOptionsLocationId = [];
    return Promise.resolve();
  }
}


  override onValueChanges(event: any) {
    // IMMEDIATE CHANGE DETECTION: Check if user manually changed any copied field
    // This handles cases where onValueTyped might not fire (e.g., programmatic changes)
    if (this.baseFormData?.physicalreuseOfRegisterAddress && Object.keys(this.copiedPhysicalValues).length > 0 && !this.baseSvc.isCopyingToRegister) {
      // Check all register fields in the event
      Object.keys(event).forEach(fieldName => {
        if (fieldName.startsWith('register')) {
          const currentValue = event[fieldName];
          const copiedValue = this.copiedPhysicalValues[fieldName];
          
          if (copiedValue !== undefined) {
            const normalizeValue = (val: any) => {
              if (val === null || val === undefined || val === '') return '';
              return String(val).trim();
            };
            
            if (normalizeValue(currentValue) !== normalizeValue(copiedValue)) {
              this.baseSvc.registerAddressManuallyChanged.next(true);
              return; // Exit early once we detect a change
            }
          }
        }
      });
    }

    if (event.registerSearchValue && event.registerSearchValue.length >= 4) {
      this.searchSvc
        .searchAddress(event.registerSearchValue)
        .subscribe((res) => {
          this.searchAddressList = res;
          this.mainForm.updateList(
            "registerSearchValue",
            this.searchAddressList
          );
        });
    }

    // Sync all register field values to baseFormData for payload
    this.baseSvc.setBaseDealerFormData({
      ...event,
    });
  }

  // pageCode: string = "SoleTradeAddressDetailsComponent";
  // modelName: string = "SoleTradeRegisterAddressComponent";
  pageCode: string = "SoleTradeAddressDetailsComponent";
  modelName: string = "SoleTradeRegisterAddressComponent";

override async onFormReady(): Promise<void> {
  await this.getCities();
  
  const existingCity = this.baseFormData?.registerCity;
  if (existingCity && this.cityOptionsLocationId && this.cityOptionsLocationId.length > 0) {
    const LocationId = this.cityOptionsLocationId.filter(
      (l) => l.name === existingCity
    );
    
    if (LocationId && LocationId.length > 0 && LocationId[0]?.locationId) {
      this.baseSvc.setBaseDealerFormData({
        registerCity: existingCity,
        registerCityLocationId: LocationId[0]?.locationId,
      });
    }
  }
  
  await this.updateValidation("onInit");
  super.onFormReady();
}

  // UPDATED METHOD: Enhanced blur event with street type auto-population
  override async onBlurEvent(event): Promise<void> {
    if (event.name == "registerSearchValue") {
      // if(event.data && event.data.length >= 4){
      this.searchSvc
        .getExternalAddressDetails(event.value.externalAddressLookupKey)
        .subscribe(async (res) => {
          const formValues = this.searchSvc.mapAddressJsonToFormControls(
            res.data,
            "register"
          );

          // Patch form values first
          this.mainForm.form.patchValue(formValues);

          // IMPROVED: Better street type handling with proper timing
          // if (formValues.registerStreetType) {
          //   setTimeout(async () => {
          //     await this.setStreetType(formValues.registerStreetType);
          //   }, 300);
          // }

          // COMMENTED OUT: Old street type handling method
          /*
          const options = await this.mainForm.fieldProps['registerStreetType'].options;
          this.mainForm.get('registerStreetType').setValue(options?.find(obj=>obj.lookupCode == formValues?.registerStreetType?.toUpperCase())?.value)
          */

          // this.mainForm.get('registerCountry').disable({emitEvent:false});
        });
      // }
    }
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
  const currentCity = this.mainForm?.form?.get('registerCity')?.value;
  const savedData = this.baseSvc.getBaseDealerFormData().value;
  
  if (currentCity && !savedData?.registerCityLocationId) {
    const LocationId = this.cityOptionsLocationId?.filter(
      (l) => l.name === currentCity
    );
    
    if (LocationId && LocationId.length > 0 && LocationId[0]?.locationId) {
      this.baseSvc.setBaseDealerFormData({
        registerCity: currentCity,
        registerCityLocationId: LocationId[0]?.locationId,
      });
    }
  }
  
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
      "SoleTradeRegisterAddressComponent",
      this.mainForm.form.valid
    );

    if (this.baseSvc.showValidationMessage) {
      let invalidPages = this.checkStepValidity();
      this.baseSvc.iconfirmCheckbox.next(invalidPages);
    }
  }

  override ngOnDestroy(): void {
    this.reuseRegisterSubs?.unsubscribe();
    super.ngOnDestroy();
  }
}
