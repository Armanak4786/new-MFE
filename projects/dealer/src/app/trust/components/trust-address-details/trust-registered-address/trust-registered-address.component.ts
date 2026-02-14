import { ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  CommonService,
  GenericFormConfig,
  Mode,
  ToasterService,
  ValidationService,
} from "auro-ui";
import { Validators } from "@angular/forms";
import { BaseTrustClass } from "../../../base-trust.class";
import { TrustService } from "../../../services/trust.service";
import { SearchAddressService } from "../../../../standard-quote/services/search-address.service";
import { IndividualService } from "../../../../individual/services/individual.service";
import { debounceTime, distinctUntilChanged, filter, takeUntil } from "rxjs/operators";
import { Subscription } from "rxjs";

@Component({
  selector: "app-trust-registered-address",
  templateUrl: "./trust-registered-address.component.html",
  styleUrl: "./trust-registered-address.component.scss",
})
export class TrustRegisterAddressComponent extends BaseTrustClass implements OnDestroy {
  optionsdata = [{ label: "icashpro", value: "icp" }];
  privousChecked: any;
  searchAddressList: any[];
  private cityOptionsAll: any[] = [];

  cityOptions: any = [];
  cityOptionsLocationId: any = [];
  private countryOptions: any[] = [];
  private copiedPhysicalValues: any = {}; // Store copied values for comparison
  private reuseRegisterSubs: Subscription;
  override formConfig: GenericFormConfig = {
    autoResponsive: true,
    api: "registeredAddress",
    goBackRoute: "registeredAddress",
    //cardBgColor: "--background-color-secondary",
    cardType: "non-border",
    fields: [
      {
        type: "autoSelect",
        //placeholder: "Search",
        name: "registerSearchValue",
        label: "Search",
        idKey: "street",
        cols: 2,
        options: [],
        className: "my-1",
        icon: "fa-solid fa-location-crosshairs fa-lg",
        rightIcon: true,
        // rightIcon:true,
        // icon:"fa-solid fa-location-crosshairs fa-lg",
        // minLength:3,
        nextLine: true,
        // //validators: [Validators.required], // validation Comment
      },
      // {
      //   type: "text",
      //   label: "Attention",
      //   name: "registerAttention",
      //   className: " ",
      //   cols: 4,
      //   nextLine: true,
      // },

      {
        type: "number",
        inputType: "vertical",
        label: "Time at Address",
        name: "registerYear",
        maxLength: 2,
        className: "-mt-1 col-fixed w-4rem ml-0",
        labelClass:'white-space-nowrap',
        // inputClass: "-mt-2",
        // validators: [Validators.required, Validators.min(1)],  -- Auro
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "Years",

        name: "year",
        className: "mt-3 pt-3 col-fixed w-4rem",
      },
      {
        type: "number",
        inputType: "vertical",
        name: "registerMonth",
        maxLength: 2,

        // validators: [Validators.max(11)],   -- Auro
        errorMessage: "Value should be less than 12",
        className: " col-fixed w-4rem yearmonthClass",
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "Months",
        name: "month",
        className: "mt-3 pt-3 col-fixed w-4rem",
        nextLine: true,
      },
      // {
      //   type: "text",
      //   label: "Postal Number ",
      //   name: "registerPostalNumber",
      //   className: "lg:col-offset-1 mt-2",
      //   cols: 3,
      //   //Validators: [Validators.required],
      //   nextLine: true,
      // },

      {
        type: "text",
        label: "Building Name",
        name: "registerBuildingName",
        inputType: "vertical",
        inputClass: "w-8 ",
        className: " ",
        cols: 2,
        nextLine: false,
      },
      {
        type: "text",
        label: "Unit/Floor Type",
        name: "registerFloorType",
        inputType: "vertical",
        // //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],  -- Auro
        className: "px-0 customLabel",
        cols: 2,
        maxLength: 20,
        nextLine: true,
      },
      {
        type: "text",
        label: "Unit/Lot Number",
        name: "registerUnitNumber",
        className: " ",
        inputClass: "w-8",
        inputType: "vertical",
        cols: 2,
        nextLine: false,
      },
      {
        type: "text",
        label: "Street Number",
        name: "registerStreetNumber",
        //Validators: [Validators.required],
        className: " ",
        inputType: "vertical",
        inputClass: "w-8",
        cols: 2,
        nextLine: false,
      },

      {
        type: "text",
        label: "Street Name",
        name: "registerStreetName",
        //Validators: [Validators.required],
        className: "",
        inputType: "vertical",
        inputClass: "w-8",
        cols: 2,
        nextLine: false,
      },
      {
        type: "select",
        label: "Street Type",
        name: "registerStreetType",
        alignmentType: "vertical",
        labelClass: "w-8 -my-3",
        //Validators: [Validators.required],
        className: "px-0 customLabel",
        cols: 2,
        nextLine: false,
        filter: true,
        //  list$: "LookUpServices/custom_lookups?LookupSetName=StreetType",
        // idKey: "lookupValue",
        // idName: "lookupValue",
        options: [],
      },

      {
        type: "text",
        label: "Street Direction",
        name: "registerStreetDirection",
        //Validators: [Validators.required],
        className: "",
        inputType: "vertical",
        inputClass: "w-8",
        cols: 2,
        nextLine: false,
      },
      {
        type: "text",
        label: "Rural Delivery",
        name: "registerRuralDelivery",
        className: "",
        inputType: "vertical",
        inputClass: "w-8",
        cols: 2,
        nextLine: true,
      },
      {
        type: "text",
        label: "Suburb",
        name: "registerSuburbs",
        className: " ",
        inputType: "vertical",
        inputClass: "w-8",
        cols: 2,
        maxLength: 20,
        nextLine: false,
      },
      {
        type: "select",
        label: "City",
        name: "registerCity",
        //Validators: [Validators.required],
        alignmentType: "vertical",
        labelClass: "w-8 -my-3",
        //validators: [Validators.required],
        className: "px-0 customLabel",
        cols: 2,
        options: this.cityOptions,
        nextLine: false,
      },
      {
        type: "text",
        label: "Postcode",
        name: "registerPostcode",
        maxLength: 10,
        //Validators: [Validators.required],
        className: "",
        inputType: "vertical",
        inputClass: "w-8",
        cols: 2,
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
        filter: true,
        cols: 2,
        // list$: "LookUpServices/locations?LocationType=country",
        // idKey: "name",
        // idName: "name",
        options: [],
        // default: "New Zealand",
        nextLine: false,
        // disabled:true
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
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override trustSvc: TrustService,
    private toasterService: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef,
    public searchSvc: SearchAddressService,
    private indSvc: IndividualService
  ) {
    super(route, svc, trustSvc);
  }

  // override title: string = 'Address Details';
  // override title: string = 'Address Details';

  // NEW METHOD: Add street type handling method for trust registered address
  async setStreetType(streetTypeValue: string) {
    try {
      // Ensure street type options are loaded - using fieldProps for trust component as shown in original onBlurEvent
      const streetTypeOptions =
        this.mainForm?.fieldProps?.["registerStreetType"]?.options;

      if (!streetTypeOptions || streetTypeOptions.length === 0) {
        console.warn(
          "Trust registered street type options not loaded yet, retrying..."
        );
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
      } else {
        //  console.warn('⚠️ No matching trust registered street type found for:', streetTypeValue);
        //  console.log('Available options:', streetTypeOptions.map(o => o.value || o.label));
      }
    } catch (error) {
      //  console.error('Error setting trust registered street type:', error);
    }
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

  if (this.trustSvc.showValidationMessage) {
    this.mainForm.form.markAllAsTouched();
  }

  this.indSvc.updateDropdownData().subscribe((result) => {
    this.mainForm.updateList("registerStreetType", result?.streetType);
    if (result?.country) {
      this.mainForm.updateList("registerCountry", result?.country);
      this.mainForm?.form?.get("registerCountry")?.setValue("New Zealand");
      this.mainForm.updateList("registerCity", result?.city);
    }
  });

  if (!this?.mainForm?.get("registerCountry")?.value) {
    this?.mainForm?.get("registerCountry")?.patchValue("New Zealand");
    this.baseFormData.registerCountry = "New Zealand";
  }

  // New: Load existing locationId from base form data if available
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

  // Initialize subscription to physical address copy signals (like business/sole-trade modules)
  this.initializeCopySubscription();
}

// Initializes subscription to physical address copy signals
private initializeCopySubscription(): void {
  // Unsubscribe from previous subscription if exists
  this.reuseRegisterSubs?.unsubscribe();
  
  this.reuseRegisterSubs = this.trustSvc.reusePhysicalAsRegister$
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
  this.trustSvc.isCopyingToRegister = true;

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
  this.trustSvc.isCopyingToRegister = false;
  
  this.cdr.detectChanges();
}

private checkIfRegisterFieldChanged(event: any): void {
  // Skip if copying is in progress
  if (this.trustSvc.isCopyingToRegister) {
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
    // Immediately notify service to toggle off physicalreuseOfRegisterAddress
    this.trustSvc.registerAddressManuallyChanged.next(true);
  }
}

 

  // async updateDropdownData() {
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
  //       this.mainForm.updateList("registerStreetType", streetTypeList);
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
  //         this.mainForm?.form?.get("registerCountry")?.value ||
  //         this.baseFormData?.registerCountry ||
  //         "New Zealand";

  //       // Sort with selected country at top
  //       const sortedCountryList = this.sortOptionsWithSelectedOnTop(
  //         countryList,
  //         selectedCountry
  //       );

  //       this.mainForm.updateList("registerCountry", sortedCountryList);

  //       return sortedCountryList;
  //     }
  //   );

  //   await this.getCities();
  // }

  fields = [
    "SearchValue",
    "BuildingName",
    "City",
    "Year",
    "Month",
    "Lot",
    "Country",
    "FloorType",
    "FloorNumber",
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
    "StreetArea",
  ];

  override async onSuccess(data: any) {}

  override onFormDataUpdate(res: any): void {
    if (
      this.baseFormData?.physicalreuseOdfRegisterAddress !=
      res?.physicalreuseOdfRegisterAddress
    ) {
      const dataToSave: any = {};
      this.fields.forEach((field) => {
        // console.log(field, res[`physical${field}`], this.mainForm.form.get(`register${field}`).value);
        const physicalFieldValue = res[`physical${field}`];
        const registerField = this.mainForm.form.get(`register${field}`);

        if (physicalFieldValue !== undefined && physicalFieldValue !== null && physicalFieldValue !== '') {
          if (registerField) {
            // Field exists in form, update it
            if (registerField.value != physicalFieldValue) {
              if (field == "PostCode") {
                // console.log(res[`physical${field}`]);
              }
              this.updateDisableValue({
                key: `register${field}`,
                value: physicalFieldValue,
              });
              registerField.enable();
              registerField.patchValue(physicalFieldValue);
            }
          }
          // Save to baseFormData for payload (even if field doesn't exist in form)
          dataToSave[`register${field}`] = physicalFieldValue;
        }
      });
      // Save all copied values to baseFormData for payload
      if (Object.keys(dataToSave).length > 0) {
        this.baseSvc.setBaseDealerFormData(dataToSave);
      }
    }
  }

  // NEW METHOD: Add place selection handler with street type auto-population
  async placeSelected(event: any, index: any) {
    if (event.properties) {
      const data = event.properties;

      // NEW: Add street type handling
      if (data.streetType) {
        setTimeout(async () => {
          await this.setStreetType(data.streetType);
        }, 200);
      }

      const dataToSave: any = {};
      if (data.country) {
        this.mainForm.get("registerCountry").patchValue(data.country);
        dataToSave.registerCountry = data.country;
      }
      if (data.postcode) {
        this.mainForm.get("registerPostcode").patchValue(data.postcode);
        dataToSave.registerPostcode = data.postcode;
      }
      if (data.city) {
        this.mainForm.get("registerCity").patchValue(data.city);
        dataToSave.registerCity = data.city;
      }
      if (data.street) {
        this.mainForm.get("registerStreetName").patchValue(data.street);
        dataToSave.registerStreetName = data.street;
      }
      if (data.suburb) {
        this.mainForm.get("registerSuburbs").patchValue(data.suburb);
        dataToSave.registerSuburbs = data.suburb;
      }
      
      // Save all patched values to baseFormData for payload
      if (Object.keys(dataToSave).length > 0) {
        this.baseSvc.setBaseDealerFormData(dataToSave);
      }
    }
  }

  tempCity = null;
override onFormEvent(event: any): void {
  // Save dropdown/select values to baseFormData for payload
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
    let locationName = this.mainForm.form.get("registerCity").value;

    // Try loading cities from session storage if not present
    let checkSessionLocationId = JSON.parse(sessionStorage.getItem("LookUpServices/locations?LocationType=City"));
    if (checkSessionLocationId && this.cityOptionsLocationId.length == 0) {
      this.cityOptionsLocationId = checkSessionLocationId.data;
    }

    let LocationId = this.cityOptionsLocationId.filter(
      (l) => l.name === locationName
    );
    if (LocationId && LocationId.length > 0 && LocationId[0]?.locationId) {
      this.baseSvc.setBaseDealerFormData({
        registerCity: locationName, // Always set city name
        registerCityLocationId: LocationId[0]?.locationId, // Set location ID
      });
    }
  }

  if (event?.name == "registerCountry" && event?.value) {
    if (event?.value != this.tempCity) {
      this.getCities();
    }
    this.tempCity = event?.value;
  }

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



async getCities() {
  const selectedCountry =
    this.mainForm?.form.get("registerCountry")?.value || "New Zealand";

  if (selectedCountry) {
    await this.baseSvc.getFormData(
      `LookUpServices/locations?LocationType=City`,
      (res) => {
        if (res.data && Array.isArray(res.data)) {
          let obj = res.data;
          // Store all city objects with locationIds for lookup
          this.cityOptionsLocationId = obj;
          const filteredCities = obj
            .filter((city) => city.owner === selectedCountry)
            .map((city) => ({
              label: city.name,
              value: city.name,
            }));

          this.cityOptions = filteredCities;
          this.mainForm.updateList("registerCity", filteredCities);

          // Restore selected city/locationId if present in form or baseFormData
          const existingCity =
            this.mainForm?.form?.get("registerCity")?.value ||
            this.baseFormData?.registerCity;
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
        }
      }
    );
  }
}




  override onValueChanges(event: any): void {
    // IMMEDIATE CHANGE DETECTION: Check if user manually changed any copied field
    // This handles cases where onValueTyped might not fire (e.g., programmatic changes)
    if (this.baseFormData?.physicalreuseOfRegisterAddress && Object.keys(this.copiedPhysicalValues).length > 0 && !this.trustSvc.isCopyingToRegister) {
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
              this.trustSvc.registerAddressManuallyChanged.next(true);
              return; // Exit early once we detect a change
            }
          }
        }
      });
    }

    // Sync all changed values to baseFormData for payload
    this.baseSvc.setBaseDealerFormData({ ...event });

    if (event.registerSearchValue && event.registerSearchValue.length >= 4) {
      this.searchSvc
        .searchAddress(event.registerSearchValue)
        .subscribe((res) => {
          // console.log('Result:', res);
          this.searchAddressList = res;
          this.mainForm.updateList(
            "registerSearchValue",
            this.searchAddressList
          );
        });
    }
  }

override async onFormReady(): Promise<void> {
  await this.getCities();

  // Restore any previously selected city/locationId for payload consistency
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




override async onValueTyped(event: any): Promise<void> {
  // IMMEDIATE CHANGE DETECTION: Check if user manually changed a copied field
  this.checkIfRegisterFieldChanged(event);
  
  // Save typed value to baseFormData for payload
  // Always get the current form value to ensure we save what the user actually typed
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
    let locationName = this.mainForm.form.get("registerCity").value;
    let LocationId = this.cityOptionsLocationId.filter(
      (l) => l.name === locationName
    );
    if (LocationId && LocationId.length > 0 && LocationId[0]?.locationId) {
      this.baseSvc.setBaseDealerFormData({
        registerCity: locationName, // Always set city name
        registerCityLocationId: LocationId[0]?.locationId, // Set location ID
      });
    }
  }
  await this.updateValidation("onInit");
}



  // UPDATED METHOD: Enhanced blur event with street type auto-population
  override async onBlurEvent(event): Promise<void> {
    // await this.updateValidation(event);
    // console.log(event)
    if (event.name == "registerSearchValue") {
      // if(event.data && event.data.length >= 4){
      this.searchSvc
        .getExternalAddressDetails(event.value.externalAddressLookupKey)
        .subscribe(async (res) => {
          console.log("External trust registered address result:", res);
          const formValues = this.searchSvc.mapAddressJsonToFormControls(
            res.data,
            "register"
          );

          // Patch form values first
          this.mainForm.form.patchValue(formValues);

          // Save all patched values to baseFormData for payload
          const dataToSave: any = {};
          Object.keys(formValues).forEach(key => {
            if (key.startsWith('register')) {
              dataToSave[key] = formValues[key];
            }
          });
          if (Object.keys(dataToSave).length > 0) {
            this.baseSvc.setBaseDealerFormData(dataToSave);
          }

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
  }
  pageCode: string = "TrustAddressDetailsComponent";
  modelName: string = "TrustRegisterAddressComponent";
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
  // Ensure latest city and locationId are in payload before step change
  const currentCity = this.mainForm?.form?.get('registerCity')?.value;
  const savedData = this.baseSvc.getBaseDealerFormData().value;

  if (currentCity && (!savedData?.registerCityLocationId || savedData?.registerCity !== currentCity)) {
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

  this.trustSvc.updateComponentStatus(
    "Address Details",
    "TrustRegisterAddressComponent",
    this.mainForm.form.valid
  );

  if (this.trustSvc.showValidationMessage) {
    let invalidPages = this.checkStepValidity();
    this.trustSvc.iconfirmCheckbox.next(invalidPages);
  }
}

override ngOnDestroy(): void {
  this.reuseRegisterSubs?.unsubscribe();
  super.ngOnDestroy();
}
}
