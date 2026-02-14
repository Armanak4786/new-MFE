import { ChangeDetectorRef, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, Mode, ToasterService } from "auro-ui";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BaseIndividualClass } from "../../../base-individual.class";
import { IndividualService } from "../../../services/individual.service";
import { ValidationService } from "auro-ui";
import { distinctUntilChanged, filter, Subscription, takeUntil } from "rxjs";
import { SearchAddressService } from "../../../../standard-quote/services/search-address.service";
@Component({
  selector: "app-postal-address",
  templateUrl: "./postal-address.component.html",
  styleUrl: "./postal-address.component.scss",
})
export class PostalAddressComponent extends BaseIndividualClass {
  optionsdata = [{ label: "icashpro", value: "icp" }];
  flag: boolean = true;
  private countryOptions: any[] = [];
  private cityOptionsAll: any[] = [];
  postalSearchValue: String;
  reusePhysicalSubs: Subscription;
  index: number;
  customerRoleForm: FormGroup;
  searchAddressList: any[];
  cityOptions: any = [];
  cityOptionsLocationId: any = [];
  tempCity = null;
  private copiedPhysicalValues: any = {}; // Store copied values for immediate comparison
  private previousAddressType: string = null; // Track previous address type to detect manual changes
  private lastSearchedValue: string = null; // Track last searched value to prevent duplicate searches
  private searchSubscription: Subscription; // Track search subscription for cleanup

  fields = [
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
  override formConfig: GenericFormConfig = {
    headerTitle: "Postal Address",
    cardType: "border",
    autoResponsive: true,
    api: "postalAddress",
    //cardBgColor: "--background-color-secondary",
    fields: [
      {
        type: "radio",
        options: [
          { label: "Postal", value: "po" },
          { label: "Street", value: "street" },
        ],
        name: "postalAddressType",
        className: "flex white-space-nowrap",
        default: "po",
        // cols:12,
        nextLine: true,
      },
      {
        type: "autoSelect",
        // placeholder: "Search",
        name: "postalSearchValue",
        label: "Search",
        idKey: "street",
        cols: 2,
        options: [],
        className: "my-1",
        rightIcon: true,
        icon: "fa-solid fa-location-crosshairs fa-lg",
        minLength: 3,
        nextLine: true,
        // //validators: [Validators.required], // validation Comment
      },
      // {
      //   type: "text",
      //   label: "Postal Type ",
      //   name: "postalType",
      //   cols: 3,
      //   inputClass:'w-8',
      //   inputType:'vertical',
      //   /*  //validators: [
      //     validators.required,
      //     validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/),
      //   ],  -- Auro */
      //   nextLine: false,
      //   maxLength: 6,
      // },
      // {
      //   type: "phone",
      //   label: "Postal Number ",
      //   name: "postalNumber",
      //   className: " ",
      //   inputClass:'w-8',
      //   inputType:'vertical',
      //   cols: 3,
      //   /* //validators: [
      //     validators.required,
      //     validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/),
      //   ],  Auro UI */
      //   nextLine: true,
      // },

      {
        type: "text",
        label: "Building Name",
        name: "postalBuildingName",
        className: " ",
        inputClass: "w-8",
        inputType: "vertical",
        // //validators: [validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/)],   --Auro
        cols: 2,
        nextLine: false,
      },
      {
        type: "select",
        labelClass: "w-8 -my-3",
        alignmentType: "vertical",
        label: "Floor Type",
        name: "postalFloorType",
        // //validators: [validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/)],   --Auro Ui
        className: "px-0 customLabel",
        cols: 2,
        options: [],
      },
      {
        type: "text",
        label: "Floor Number",
        name: "postalFloorNumber",
        // //validators: [validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/)],   -- Auro
        className: " ",
        inputType: "vertical",
        inputClass: "w-8",
        cols: 2,
        nextLine: false,
      },

      {
        type: "select",
        labelClass: "w-8 -my-3",
        alignmentType: "vertical",
        label: "Unit Type",
        name: "postalUnitType",
        // //validators: [validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/)],  --Auro
        className: "px-0 customLabel",
        cols: 2,
        options: [],
        nextLine: true,
      },

      {
        type: "textArea",
        label: "Address",
        name: "postalStreetArea",
        // //validators: [validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/)],   --Auro
        textAreaRows: 4,
        className: "mb-1 mt-1",
        cols: 12,
        rows: 1,
        hidden: true,
        nextLine: true,
        inputType: "vertical",
      },
      {
        type: "text",
        label: "Unit/Lot Number",
        name: "postalUnitNumber",
        // //validators: [validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/)],  --Auro
        className: " ",
        cols: 2,
        nextLine: false,
        inputClass: "w-8",
        inputType: "vertical",
      },

      {
        type: "text",
        label: "Street Number",
        name: "postalStreetNumber",
        /*  //validators: [
          validators.required,
          validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/),
        ],   -- Auro */
        className: "ml- ",
        inputClass: "w-8",
        inputType: "vertical",
        cols: 2,
        nextLine: false,
      },

      {
        type: "text",
        label: "Street Name",
        name: "postalStreetName",
        inputClass: "w-8",
        inputType: "vertical",
        /* //validators: [
          validators.required,
          validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/),
        ],   -- Auro */
        className: "",
        cols: 2,
        nextLine: false,
      },
      {
        type: "select",
        labelClass: "w-8 -my-3",
        alignmentType: "vertical",
        label: "Street Type",
        name: "postalStreetType",
        filter: true,
        // //validators: [validators.required],   --Auro
        className: "px-0 customLabel",
        cols: 2,
        nextLine: false,
        options: [],
      },

      {
        type: "text",
        label: "Street Direction",
        name: "postalStreetDirection",
        inputClass: "w-8",
        inputType: "vertical",
        /*  //validators: [
          validators.required,
          validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/),
        ],       --Auro */
        className: "",
        cols: 2,
        nextLine: false,
      },
      {
        type: "text",
        label: "Rural Delivery",
        name: "postalRuralDelivery",
        inputClass: "w-8",
        inputType: "vertical",
        className: "",
        // //validators: [validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/)],   --
        cols: 2,
        nextLine: true,
      },
      {
        type: "text",
        label: "Suburb",
        name: "postalSuburbs",
        inputClass: "w-8",
        inputType: "vertical",
        // //validators: [validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/)],
        className: " ",
        cols: 2,
        maxLength: 20,
        nextLine: false,
      },
      {
        type: "select",
        label: "City",
        name: "postalCity",
        inputClass: "w-8",
        labelClass: "w-8 -my-3",
        alignmentType: "vertical",
        className: "px-0 customLabel",
        cols: 2,
        options: this?.cityOptions,
        nextLine: false,
      },
      {
        type: "text",
        label: "Postcode",
        name: "postalPostcode",
        inputClass: "w-8",
        inputType: "vertical",
        // //validators: [Validators.required],  -- Auro
        className: "",
        cols: 2,
        maxLength: 10,
        //regexPattern: "[^0-9]*",
        nextLine: false,
      },
      {
        type: "select",
        labelClass: "w-8 mb-2",
        alignmentType: "vertical",
        label: "Country",
        name: "postalCountry",
        // //validators: [validators.required],   --Auro
        className: "px-0 customLabel",
        cols: 2,
        options: [],
        filter: true,
        default: "New Zealand",
        nextLine: false,
      },
      {
        type: "text",
        label: "postalSearchCountry",
        inputClass: "w-8",
        inputType: "vertical",
        maxLength: 20,

        name: "postalSearchCountry",
        className: " ",
        cols: 2,
        disabled: true,
        hidden: true,
        nextLine: false,
      },
    ],
  };
  constructor(
    public fb: FormBuilder,
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: IndividualService,
    private toasterService: ToasterService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef,
    public searchSvc: SearchAddressService
  ) {
    super(route, svc, baseSvc);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();

    if (this.baseSvc.showValidationMessage) {
      this.mainForm.form.markAllAsTouched();
    }

  this.customerRoleForm = this.fb.group({
    postalSearchValue: ["", Validators.required],
  });

  this.baseSvc.updateDropdownData().subscribe((result) => {
    this.mainForm.updateList("postalFloorType", result?.floorType);
    this.mainForm.updateList("postalUnitType", result?.unitType);
    this.mainForm.updateList("postalStreetType", result?.streetType);

    if (result?.country) {
      this.mainForm.updateList("postalCountry", result?.country);
      
      // Only set default value for PO type - street type is handled by togglePostalCountry()
      // if 'PO' , take data from baseform OR default to NZ for new forms
      const countryCtrl = this.mainForm?.form?.get("postalCountry");
      const addressType = this.mainForm?.form?.get('postalAddressType')?.value;
      
      if (countryCtrl && addressType !== 'street') {
        const savedCountry = this.baseFormData?.postalCountry;
        
        if (savedCountry) {
          countryCtrl.setValue(savedCountry);
        } else if (!countryCtrl.value || countryCtrl.value === '') {
          countryCtrl.setValue("New Zealand");
        }
      }
      
      this.mainForm.updateList("postalCity", result?.city);
    }
  });

  await this.getCities();
  this.initializeCityHandler();
  
  // Initialize subscription to physical address copy signals (like sole-trade module)
  this.initializeCopySubscription();
  
  // Initialize previous address type to track manual changes
  // Check form value first (may have been loaded by base class), then baseFormData, then default
  const formAddressType = this.mainForm.form.get("postalAddressType")?.value;
  const baseFormAddressType = this.baseFormData?.postalAddressType;
  // If we have existing postal data (like street name, building name, etc.), it's likely a street address
  const hasExistingStreetData = !!(this.baseFormData?.postalStreetName || this.baseFormData?.postalBuildingName || 
                                 this.baseFormData?.postalStreetNumber || this.baseFormData?.postalUnitNumber ||
                                 this.baseFormData?.postalStreetArea);
  // Prioritize: form value > baseFormData value > inferred from data > default "po"
  const savedAddressType = formAddressType || baseFormAddressType || (hasExistingStreetData ? "street" : "po");
  
  // Only set the address type if form doesn't have a value yet
  if (!formAddressType && savedAddressType) {
    this.mainForm.form.get("postalAddressType")?.patchValue(savedAddressType, { emitEvent: false });
  }
  
  // Initialize previous address type to track manual changes
  this.previousAddressType = savedAddressType;
  
  // Subscribe to sync trigger from service
  this.baseSvc.syncAddressFormValues
    .pipe(takeUntil(this.destroy$), filter(val => val === true))
    .subscribe(() => {
      this.syncFormValuesToBaseData();
      // Reset the trigger
      this.baseSvc.syncAddressFormValues.next(false);
    });
  
   let portalWorkflowStatus = sessionStorage.getItem("workFlowStatus");
     if (
      (portalWorkflowStatus != 'Open Quote') || (
    this.baseFormData?.AFworkflowStatus &&
    this.baseFormData.AFworkflowStatus !== 'Quote'
    ) )
    {
      try {
        this.mainForm?.form?.disable({ emitEvent: false });
      } catch (error) {
        console.warn('PostalAddressComponent: Error disabling form', error);
      }
    }
    else{ 
      try {
        // Use emitEvent: false to prevent triggering validation subscriptions that cause split errors
        this.mainForm?.form?.enable({ emitEvent: false });
      } catch (error) {
        // Handle errors that might occur when enabling form triggers validation subscriptions
        if (error?.message?.includes('Cannot read properties of undefined') && error?.message?.includes('split')) {
          console.warn('PostalAddressComponent: Split error when enabling form - likely undefined pattern value in validation', error.message);
        } else {
          console.warn('PostalAddressComponent: Error enabling form', error);
        }
      }
    }
}
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
      filter: true
    });
    
    // Update the countries - sessionStorage cache
    this.baseSvc.updateDropdownData().subscribe((result) => {
      if (result?.country) {
        this.mainForm.updateList("postalCountry", result?.country);
      }
    });
    
 
    countryCtrl.enable({ emitEvent: false });
  }
}


  // Initializes subscription to physical address copy signals
  private initializeCopySubscription(): void {
    // Unsubscribe from previous subscription if exists
    this.reusePhysicalSubs?.unsubscribe();
    
    this.reusePhysicalSubs = this.baseSvc.reusePhysical$
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

        if (payload?.action === 'copied' && payload?.data) {
          this.handleCopyFromPhysical(payload.data);
        } else if (payload?.action === 'undoCopy') {
          if (this.baseFormData?.physicalReuseOff) {
            this.handleUndoCopy();
          }
        }
      });
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
  if (!this.cityOptionsLocationId || this.cityOptionsLocationId.length === 0) {
    return;
  }
  
  const LocationId = this.cityOptionsLocationId.filter(
    (l) => l.name === cityName
  );

  if (LocationId && LocationId.length > 0 && LocationId[0]?.locationId) {
    this.baseSvc.setBaseDealerFormData({
      postalCity: cityName,
      postalCityLocationId: LocationId[0]?.locationId,
    });
  }
}

  private handleCopyFromPhysical(physicalData: any): void {
    const isNz = physicalData.postalCountry === "New Zealand";

    const copiedAddressType = physicalData.postalAddressType || 'street';
    
    // Set flag EARLY to prevent form change listener from triggering during copy operations
    // The flag is already set in physical component, but ensure it's set here too
    this.baseSvc.isCopyingToPostal$.next(true);
    
    // Update previous address type BEFORE changing the address type
    // This prevents the manual change detection from triggering during copy
    this.previousAddressType = copiedAddressType;

    // Clear previous copied values and store new ones
    this.copiedPhysicalValues = {};

    if (!isNz) {
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

    // Set address type - this will trigger onFormEvent, but flag is already set
    this.mainForm.get("postalAddressType").setValue(copiedAddressType, { emitEvent: true });

    // Copy all values from physicalData
    Object.keys(physicalData).forEach(key => {
      const control = this.mainForm.form.get(key);
      if (control && physicalData[key] !== undefined && physicalData[key] !== null) {
        // Store the copied value for later comparison
        this.copiedPhysicalValues[key] = physicalData[key];

        const wasDisabled = control.disabled;
        if (wasDisabled) control.enable({ emitEvent: false });
        control.setValue(physicalData[key], { emitEvent: false });
        if (wasDisabled) control.disable({ emitEvent: false });
      }
    });

    // Store postalAddressType in copiedPhysicalValues for comparison
    this.copiedPhysicalValues['postalAddressType'] = copiedAddressType;

    // Update baseFormData with all copied postal values so they're included in payload
    this.baseSvc.setBaseDealerFormData(physicalData);

    // Handle city location ID
    if (physicalData.postalCityLocationId) {
      this.baseSvc.setBaseDealerFormData({
        postalCity: physicalData.postalCity,
        postalCityLocationId: physicalData.postalCityLocationId,
      });
    }

    this.baseFormData.physicalReuseOff = true;
    
    // Reset flag after copy operation completes
    this.baseSvc.isCopyingToPostal$.next(false);
    
    this.cdr.detectChanges();
  }

  private handleUndoCopy(): void {
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

    this.mainForm.form.reset({
      postalCountry: { value: 'New Zealand', disabled: true },
      postalAddressType: 'po'
    });
    
    // Clear copied values
    this.copiedPhysicalValues = {};
    this.baseFormData.physicalReuseOff = false;
    this.postalSearchValue = null;
    this.cdr.detectChanges();
  }

  /**
   * Clears all address-related fields when user manually changes address type
   * Exception: If changing to 'Street', the country field should be automatically set to 'New Zealand'
   */
  private clearAddressDataOnTypeChange(): void {
    const currentAddressType = this.mainForm?.form?.get("postalAddressType")?.value;
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
      'postalCityLocationId'
    ];
    
    fieldsToClear.forEach(fieldName => {
      const control = this.mainForm?.form?.get(fieldName);
      if (control) {
        control.reset(null, { emitEvent: false });
      }
    });
    
    const dataToClear: any = {};
    fieldsToClear.forEach(fieldName => {
      dataToClear[fieldName] = null;
    });
    
    // Exception: If changing to 'Street', set country to 'New Zealand'
    if (currentAddressType === 'street') {
      const countryControl = this.mainForm?.form?.get('postalCountry');
      if (countryControl) {
        countryControl.setValue('New Zealand', { emitEvent: false });
        countryControl.disable({ emitEvent: false });
      }
      dataToClear.postalCountry = 'New Zealand';
    } else {
      // For PO Box, clear country as well
      const countryControl = this.mainForm?.form?.get('postalCountry');
      if (countryControl) {
        countryControl.reset(null, { emitEvent: false });
        countryControl.enable({ emitEvent: false });
      }
      dataToClear.postalCountry = null;
    }
    
    this.baseSvc.setBaseDealerFormData(dataToClear);
    
    this.postalSearchValue = null;
    
    if (this.baseFormData?.physicalReuseOff) {
      this.baseSvc.postalAddressManuallyChanged.next(true);
    }
  }

  private checkIfPostalFieldChanged(event: any): void {
    // Skip if copying is in progress
    if (this.baseSvc.isCopyingToPostal$.getValue()) {
      return;
    }
    
    // Only check if physicalReuseOff was ON (meaning data was copied) and we have stored copied values
    if (!this.baseFormData?.physicalReuseOff || Object.keys(this.copiedPhysicalValues).length === 0) {
      return;
    }
    
    // Get the field name that was changed
    const fieldName = event.name;
    
    // Check all postal fields including postalAddressType
    if (!fieldName || !fieldName.startsWith('postal')) {
      return;
    }
    
    // Special handling for postalAddressType: if changed from "street" to "po", toggle off
    if (fieldName === 'postalAddressType') {
      const currentValue = event.data !== undefined ? event.data : this.mainForm?.form?.get(fieldName)?.value;
      const copiedValue = this.copiedPhysicalValues[fieldName];
      
      // If address type was stored as "street" and user changed it to "po", toggle off
      if (copiedValue === 'street' && currentValue === 'po') {
        this.baseSvc.postalAddressManuallyChanged.next(true);
        return;
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
      // Immediately notify service to toggle off physicalReuseOff
      this.baseSvc.postalAddressManuallyChanged.next(true);
    }
  }


  private initializeFieldVisibility(addressType: string): void {
    if (addressType === "po") {
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
  }


  // NEW METHOD: Add street type handling method similar to other address components
  async setStreetType(streetTypeValue: string) {
    try {
      // Ensure street type options are loaded
      const streetTypeOptions =
        this.mainForm?.fieldProps?.["postalStreetType"]?.options;

      if (!streetTypeOptions || streetTypeOptions.length === 0) {
        console.warn("Postal street type options not loaded yet, retrying...");
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
          .get("postalStreetType")
          .patchValue(matchedOption.value || matchedOption.label);
      } else {
      }
    } catch (error) {
      console.error("Error setting postal street type:", error);
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
          this.mainForm.get("postalAddressType").setValue("street");
          this.fields.forEach((field) => {
            const postalField = this.mainForm.form.get(`postal${field}`);
            const physicalFieldValue = this.baseFormData[`physical${field}`];
            if (
              postalField &&
              postalField.value !== physicalFieldValue &&
              physicalFieldValue
            ) {
              // Use emitEvent: false to prevent triggering validation subscriptions that cause split errors
              postalField.patchValue(physicalFieldValue, { emitEvent: false });
              try {
                // Use emitEvent: false to prevent triggering validation subscriptions that cause split errors
                postalField.enable({ emitEvent: false });
              } catch (error) {
                if (error?.message?.includes('Cannot read properties of undefined') && error?.message?.includes('split')) {
                  console.warn('PostalAddressComponent: Split error when enabling field - likely undefined pattern value in validation', error.message);
                } else {
                  console.warn('PostalAddressComponent: Error enabling field', error);
                }
              }
            }
          });
        } else if (data == "undoCopy" && this.mainForm) {
          try {
            // Use emitEvent: false to prevent triggering validation subscriptions that cause split errors
            this.mainForm.form.reset({
              postalCountry: { value: 'New Zealand', disabled: true }
            }, { emitEvent: false });
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
            this.mainForm.form.reset({}, { emitEvent: false });
            this.mainForm.get("postalAddressType")?.setValue("po", { emitEvent: false });
            this.postalSearchValue = null;
          } catch (error) {
            if (error?.message?.includes('Cannot read properties of undefined') && error?.message?.includes('split')) {
              console.warn('PostalAddressComponent: Split error when resetting form in undoCopy - likely undefined pattern value in validation', error.message);
            } else {
              console.warn('PostalAddressComponent: Error resetting form in undoCopy', error);
            }
          }
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

  // NEW METHOD: Helper method to set city location ID
  async setCityLocationId(cityName: string) {
    // Ensure cityOptionsLocationId is populated
    if (
      !this.cityOptionsLocationId ||
      this.cityOptionsLocationId.length === 0
    ) {
      await this.getCities();
    }

    const locationId = this.cityOptionsLocationId.filter(
      (l) => l.name === cityName
    );

    if (locationId && locationId.length > 0) {
      this.baseSvc.setBaseDealerFormData({
        postalCityLocationId: locationId[0]?.locationId,
      });
    }
  }

  // Add this method to handle existing city values
  private async handleExistingCityLocationId(): Promise<void> {
    const existingCity = this.mainForm?.form.get("postalCity")?.value;
    if (existingCity && existingCity.trim()) {
      await this.setCityLocationId(existingCity);
    }
  }

override async onValueTyped(event: any): Promise<void> {
  // IMMEDIATE CHANGE DETECTION: Check if user manually changed a copied field
  this.checkIfPostalFieldChanged(event);
  
  // Save typed value to baseFormData for payload
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

    if (event.name === "postalCountry") {
      await this.getCities();
    }
  }
  await this.updateValidation("onInit");
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
  async placeSelected(event: any, index: number) {
    if (event.properties) {
      const data = event.properties;

      // NEW: Add street type handling similar to other address components
      if (data.streetType) {
        setTimeout(async () => {
          await this.setStreetType(data.streetType);
        }, 200);
      }

      if (data.country) {
        // Use emitEvent: false to prevent triggering validation subscriptions that cause split errors
        this.mainForm.get("postalCountry")?.patchValue(data.country, { emitEvent: false });
        this.mainForm.get("postalSearchCountry")?.patchValue(data.country, { emitEvent: false });
      }
      if (data.postcode)
        this.mainForm.get("postalPostcode")?.patchValue(data.postcode, { emitEvent: false });

      if (data.city) {
        this.mainForm.get("postalCity")?.patchValue(data.city, { emitEvent: false });
        // UPDATED: Set the city location ID when city is auto-populated
        await this.setCityLocationId(data.city);
      }

      if (data.street)
        this.mainForm.get("postalStreetName")?.patchValue(data.street, { emitEvent: false });
      if (data.suburb)
        this.mainForm.get("postalSuburbs")?.patchValue(data.suburb, { emitEvent: false });

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
        await this.updateValidation("onInit");
      }
    }
  }
  override async onSuccess(data: any) {}

  copied: boolean = false;
  // override onFormDataUpdate(res: any): void {
  //   console.log(res)
  //   const fields = [
  //     "FloorType",
  //     "BuildingName",
  //     "UnitType",
  //     "StreetArea",
  //     "SearchValue",
  //     "BuildingName",
  //     "City",
  //     "Year",
  //     "Month",
  //     "UnitNumber",
  //     "Country",
  //     "FloorType",
  //     "Postcode",
  //     "ResidenceType",
  //     "RuralDelivery",
  //     "StreetDirection",
  //     "StreetName",
  //     "StreetNumber",
  //     "StreetType",
  //     "Suburbs",
  //     "TimeAtAddress",
  //     "UnitType",
  //     "FloorType",
  //     "FloorNumber",
  //     "StreetArea",
  //     "SearchCountry",
  //   ];
  //   if (
  //     res?.physicalReuseOff &&
  //     this.baseFormData?.physicalReuseOff !== res?.physicalReuseOff
  //   ) {
  //     if (res.physicalCountry != "New Zealand") {
  //       this.mainForm.updateHidden({
  //         postalUnitType: true,
  //         postalFloorNumber: true,
  //         postalFloorType: true,
  //         postalBuildingName: true,
  //         postalRuralDelivery: true,
  //         postalStreetDirection: true,
  //         postalStreetType: true,
  //         postalStreetName: true,
  //         postalStreetNumber: true,
  //         postalUnitNumber: true,
  //         postalStreetArea: false,
  //       });
  //     } else {
  //       this.mainForm.updateHidden({
  //         postalUnitType: false,
  //         postalFloorNumber: false,
  //         postalFloorType: false,
  //         postalBuildingName: false,
  //         postalRuralDelivery: false,
  //         postalStreetDirection: false,
  //         postalStreetType: false,
  //         postalStreetName: false,
  //         postalStreetNumber: false,
  //         postalUnitNumber: false,
  //         postalStreetArea: true,
  //       });

  //     }
  //     if (res.physicalReuseOff) {
  //       if(res.physicalCountry == 'New Zealand'){
  //         this.mainForm.get('postalAddressType').setValue('street');
  //       }else{
  //         this.mainForm.get('postalAddressType').setValue('po');
  //       }

  //     fields.forEach((field) => {
  //       const postalField = this.mainForm.form.get(`postal${field}`);
  //       const physicalFieldValue = res[`physical${field}`];
  //       if (
  //         postalField &&
  //         postalField.value !== physicalFieldValue &&
  //         physicalFieldValue
  //       ) {
  //         postalField.patchValue(physicalFieldValue);
  //         postalField.enable();
  //       }
  //     });
  //   }else{
  //     this.mainForm.form.reset();
  //     this.mainForm.get('postalAddressType').setValue('po');
  //   }
  //   }

  // }

override async onFormDataUpdate(res: any): Promise<void> {
  // console.log(this.baseFormData?.physicalReuseOff, res?.physicalReuseOff);
  //  console.log("res----->",res);

  if (this.baseFormData?.physicalReuseOff !== res?.physicalReuseOff) {
    const isNz = res.physicalCountry === "New Zealand";

    // Use emitEvent: false to prevent triggering validation subscriptions that cause split errors
    this.mainForm.form
      .get("postalAddressType")
      ?.patchValue(isNz ? "street" : "po", { emitEvent: false });
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
    if (res.physicalReuseOff) {
      // Set flag to prevent false positives during copying
      this.baseSvc.isCopyingToPostal = true;
      
      // Clear previous copied values
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
          const wasDisabled = control.disabled;
          if (wasDisabled) control.enable({ emitEvent: false });
          control.setValue(value);
          if (wasDisabled) control.disable({ emitEvent: false });
          
          // Store the copied value for change detection
          this.copiedPhysicalValues[controlName] = value;
        }
      });
      
      // Store postalAddressType value as well
      const addressTypeValue = isNz ? "street" : "po";
      this.copiedPhysicalValues["postalAddressType"] = addressTypeValue;

      // UPDATED: Set city location ID when copying from physical address
      if (res.physicalCity) {
        await this.setCityLocationId(res.physicalCity);
      }
      
      // Reset flag after copying is complete
      // All setValue operations use emitEvent: false, so they won't trigger change detection
      // Reset immediately after all copy operations complete
      this.baseSvc.isCopyingToPostal = false;
    } else {
      // Clear copied values when toggle is turned off
      this.copiedPhysicalValues = {};
      
      // ✅ FIXED: Reset form but preserve postal country as "New Zealand" and keep it disabled
      if (this?.baseFormData?.physicalReuseOff) {
        try {
          // Use emitEvent: false to prevent triggering validation subscriptions that cause split errors
          this.mainForm.form.reset({
            postalCountry: { value: 'New Zealand', disabled: true },
            postalAddressType: 'po'
          }, { emitEvent: false });
        } catch (error) {
          if (error?.message?.includes('Cannot read properties of undefined') && error?.message?.includes('split')) {
            console.warn('PostalAddressComponent: Split error when resetting form in onFormDataUpdate - likely undefined pattern value in validation', error.message);
          } else {
            console.warn('PostalAddressComponent: Error resetting form in onFormDataUpdate', error);
          }
        }
      }
    }

    // ✅ ENHANCED: Ensure postal country is correct based on address type after form data update
    const postalCountryControl = this.mainForm?.form.get("postalCountry");
    const addressType = this.mainForm?.form?.get('postalAddressType')?.value;
    
    if (postalCountryControl) {
      if (addressType === 'street') {
        // For street type, always ensure it's "New Zealand" and disabled
      if (postalCountryControl.value !== 'New Zealand') {
        postalCountryControl.setValue('New Zealand', { emitEvent: false });
      }
      if (postalCountryControl.enabled) {
        postalCountryControl.disable({ emitEvent: false });
        }
      } else {
        // For po type, ensure it's enabled (can be any country)
        if (postalCountryControl.disabled) {
          postalCountryControl.enable({ emitEvent: false });
        }
      }
    }
    
    // Handle existing city location ID for any form data update
    const existingCity = this.mainForm?.form.get("postalCity")?.value;
    if (existingCity && existingCity.trim()) {
      await this.setCityLocationId(existingCity);
    }

    // ✅ Trigger change detection manually to update the view immediately
    this.cdr.detectChanges();
  }
}


override async onFormEvent(event) {
  super.onFormEvent(event);
  
  if (event.name == "postalCountry") {
    if (event?.value != this.tempCity) {
      await this.getCities();
    }
    this.tempCity = event?.value;
  }
  
  if (event.name == "postalAddressType") {
    const isCopyingOperation = this.baseSvc.isCopyingToPostal$.getValue() === true;
    
    if (isCopyingOperation) {
      // During copy operation, just update visibility, NO WIPE OUT
      const countryControl = this.mainForm.form.get("postalCountry");
      
      if (event.value == "po") {
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
        if (countryControl) {
          countryControl.enable({ emitEvent: false });
        }
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
        if (countryControl) {
          countryControl.patchValue('New Zealand', { emitEvent: false });
          countryControl.disable({ emitEvent: false });
        }
      }
      
      // Update previous address type to prevent false positive on manual change detection
      this.previousAddressType = event.value;
      return;
    }
    
    // Check if this is a manual change (user changed address type manually)
    const isManualChange = this.previousAddressType !== null && 
                          this.previousAddressType !== event.value;
    
    if (isManualChange) {
      // User manually changed address type - wipe out the data
      this.clearAddressDataOnTypeChange();
    }
    
    const countryControl = this.mainForm.form.get("postalCountry");   
    if (event.value == "po") {
      // PO Box mode - enable country and show textarea
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
      // Enable country dropdown for PO Box
      if (countryControl) {
        countryControl.enable({ emitEvent: false });
      }
    } else {
      // Street mode - disable country, set to New Zealand, show street fields
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
      // Disable country dropdown and set to New Zealand for street addresses
      if (countryControl) {
        countryControl.patchValue("New Zealand", { emitEvent: false });
        countryControl.disable({ emitEvent: false });
      }
    } 

    // Update previous address type after handling the change
    this.previousAddressType = event.value;

    this.baseSvc.setBaseDealerFormData({
      postalAddressType: event.value
    });

  
     let portalWorkflowStatus = sessionStorage.getItem("workFlowStatus");
     if (
      (portalWorkflowStatus != 'Open Quote') || (
    this.baseFormData?.AFworkflowStatus &&
    this.baseFormData.AFworkflowStatus !== 'Quote'
    ) )
    {
      try {
        this.mainForm?.form?.disable({ emitEvent: false });
      } catch (error) {
        console.warn('PostalAddressComponent: Error disabling form', error);
      }
    }
    else{ 
      try {
        // Use emitEvent: false to prevent triggering validation subscriptions that cause split errors
        this.mainForm?.form?.enable({ emitEvent: false });
      } catch (error) {
        // Handle errors that might occur when enabling form triggers validation subscriptions
        if (error?.message?.includes('Cannot read properties of undefined') && error?.message?.includes('split')) {
          console.warn('PostalAddressComponent: Split error when enabling form - likely undefined pattern value in validation', error.message);
        } else {
          console.warn('PostalAddressComponent: Error enabling form', error);
        }
      }
    }
    
    await this.updateValidation("onInit");
  }
}


override onValueChanges(event: any): void {
  // Safety check: ensure event is valid
  if (!event || typeof event !== 'object') return;

  // IMMEDIATE CHANGE DETECTION: Check if user manually changed any copied field
  // This handles cases where onValueTyped might not fire (e.g., programmatic changes)
  if (this.baseFormData?.physicalReuseOff && Object.keys(this.copiedPhysicalValues).length > 0 && !this.baseSvc.isCopyingToPostal$.getValue()) {
    // Check all postal fields in the event including postalAddressType
    Object.keys(event).forEach(fieldName => {
      if (fieldName.startsWith('postal')) {
        // Special handling for postalAddressType
        if (fieldName === 'postalAddressType') {
          const currentValue = event[fieldName];
          const copiedValue = this.copiedPhysicalValues[fieldName];
          
          // If address type was stored as "street" and user changed it to "po", toggle off
          if (copiedValue === 'street' && currentValue === 'po') {
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

  // Only search when postalSearchValue is a string (user typing), not an object (user selected from autocomplete)
  // Also prevent duplicate searches for the same value
  if (event.postalSearchValue && typeof event.postalSearchValue === 'string') {
    const searchValue = event.postalSearchValue.trim();
    
    // Only search if:
    // 1. Value is at least 4 characters
    // 2. Value is different from last searched value (prevent duplicate searches)
    if (searchValue && searchValue.length >= 4 && searchValue !== this.lastSearchedValue) {
      // Unsubscribe from previous search if exists
      this.searchSubscription?.unsubscribe();
      
      // Track the value being searched
      this.lastSearchedValue = searchValue;
      
      // Subscribe with takeUntil for proper cleanup
      this.searchSubscription = this.searchSvc.searchAddress(searchValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          this.searchAddressList = res;
          // Update list without triggering value changes by using a flag or checking if value changed
          // Only update if the current form value is still the same string we searched for
          const currentFormValue = this.mainForm.form.get('postalSearchValue')?.value;
          if (typeof currentFormValue === 'string' && currentFormValue.trim() === searchValue) {
            this.mainForm.updateList('postalSearchValue', this.searchAddressList);
          }
        });
    } else if (searchValue && searchValue.length < 4) {
      // Reset last searched value when user clears or shortens the search
      this.lastSearchedValue = null;
    }
  } else if (event.postalSearchValue && typeof event.postalSearchValue === 'object') {
    // User selected from autocomplete - reset last searched value to allow new searches
    this.lastSearchedValue = null;
  }

  // **IMPROVED SANITIZATION** - Filter out undefined/null values and normalize data
  const sanitizedEvent: any = {};
  
  Object.keys(event).forEach(key => {
    const value = event[key];
    
    // **KEY FIX**: Skip undefined, null values AND empty strings to prevent split errors
    if (value === undefined || value === null || value === '') {
      // Don't include these in sanitizedEvent
      return;
    }
    
    // Handle postalSearchValue specially - EXCLUDE string values to prevent search loop
    // Only include object values (selected addresses) in baseFormData
    if (key === 'postalSearchValue') {
      // Exclude string values (user typing) to prevent triggering onValueChanges loop
      // Only include object values (selected address from autocomplete)
      if (typeof value === 'object' && value !== null) {
        const stringValue = value.street || value.value || value.label;
        if (stringValue && typeof stringValue === 'string') {
          sanitizedEvent[key] = stringValue;
        }
      }
      // Skip string values - they're just search input, not actual data to save
      return;
    } else {
      // For other values
      if (typeof value === 'string') {
        // Only include non-empty strings
        if (value.trim().length > 0) {
          sanitizedEvent[key] = value;
        }
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        sanitizedEvent[key] = value;
      } else if (Array.isArray(value)) {
        if (value.length > 0) {
          sanitizedEvent[key] = value;
        }
      } else if (typeof value === 'object' && value !== null) {
        // Only include objects with meaningful string representations
        const stringValue = value.value || value.label || value.name;
        if (stringValue && typeof stringValue === 'string' && stringValue.trim().length > 0) {
          sanitizedEvent[key] = stringValue;
        }
      }
    }
  });
  
  // Only call setBaseDealerFormData if we have valid data
  if (Object.keys(sanitizedEvent).length > 0) {
    this.baseSvc.setBaseDealerFormData(sanitizedEvent);
  }
}


  postalAddressType: any;
  pageCode: string = "AddressDetailsComponent";
  modelName: string = "PostalAddressComponent";

override async onFormReady(): Promise<void> {
    this.getCities();
    
    // Initialize previous address type after form is ready
    // Check form value first (may have been loaded by base class), then baseFormData, then default
    const formAddressType = this.mainForm.form.get("postalAddressType")?.value;
    const baseFormAddressType = this.baseFormData?.postalAddressType;
    // If we have existing postal data (like street name, building name, etc.), it's likely a street address
    const hasExistingStreetData = !!(this.baseFormData?.postalStreetName || this.baseFormData?.postalBuildingName || 
                                   this.baseFormData?.postalStreetNumber || this.baseFormData?.postalUnitNumber ||
                                   this.baseFormData?.postalStreetArea);
    // Prioritize: form value > baseFormData value > inferred from data > default "po"
    const savedAddressType = formAddressType || baseFormAddressType || (hasExistingStreetData ? "street" : "po");
    
    // Initialize previous address type to track manual changes
    this.previousAddressType = savedAddressType;
    
    const addressType = this.mainForm?.form?.get('postalAddressType')?.value || 'po';
  await this.updateValidation("onInit");
  super.onFormReady();
}


async getCities() {
  const selectedCountry =
    this.mainForm?.form.get("postalCountry")?.value || "New Zealand";

  if (selectedCountry) {
    await this.baseSvc.getFormData(
      `LookUpServices/locations?LocationType=City`,
      (res) => {
        if (res.data && Array.isArray(res.data)) {
          let obj = res.data;
          const filteredCities = res.data
            .filter((city) => {
              return city.owner === selectedCountry;
            })
            .map((city) => ({
              label: city.name,
              value: city.name,
            }));

          this.cityOptions = filteredCities;
          this.cityOptionsLocationId = obj;
          this.mainForm.updateList("postalCity", filteredCities);
        }
      }
    );
  }
}


  override async onBlurEvent(event): Promise<void> {
    // await this.updateValidation(event);
    if (event.name == "postalSearchValue") {
      // if(event.data && event.data.length >= 4){
      this.searchSvc
        .getExternalAddressDetails(event.value.externalAddressLookupKey)
        .subscribe(async (res) => {
          const formValues = this.searchSvc.mapAddressJsonToFormControls(
            res.data,
            "postal"
          );

          // Patch form values first - use emitEvent: false to prevent triggering validation subscriptions that cause split errors
          this.mainForm.form.patchValue(formValues, { emitEvent: false });

          // UPDATED: Set city location ID after patching values
          if (formValues.postalCity) {
            await this.setCityLocationId(formValues.postalCity);
          }

          // IMPORTANT: Save postalStreetArea to baseFormData when address type is "po"
          // This ensures the street area is included in the payload even though emitEvent: false prevents onValueChanges
          const currentAddressType = this.mainForm.form.get('postalAddressType')?.value;
          if (currentAddressType === 'po' && formValues.postalStreetArea) {
            this.baseSvc.setBaseDealerFormData({
              postalStreetArea: formValues.postalStreetArea
            });
          }

          // Also save all other patched values to baseFormData for payload
          // This ensures all address fields are included even when emitEvent: false is used
          const dataToSave: any = {};
          Object.keys(formValues).forEach(key => {
            if (formValues[key] !== undefined && formValues[key] !== null && formValues[key] !== '') {
              dataToSave[key] = formValues[key];
            }
          });
          if (Object.keys(dataToSave).length > 0) {
            this.baseSvc.setBaseDealerFormData(dataToSave);
          }

          // IMPROVED: Better street type handling with proper timing - similar to other address components
          // if (formValues.postalStreetType) {
          //   setTimeout(async () => {
          //     await this.setStreetType(formValues.postalStreetType);
          //   }, 300);
          // }

          // COMMENTED OUT: Old street type handling method - kept for reference
          /*
          const options = await this.mainForm.fieldProps["postalStreetType"]
            .options;
          this.mainForm
            .get("postalStreetType")
            .setValue(
              options?.find(
                (obj) =>
                  obj.lookupCode == formValues?.postalStreetType?.toUpperCase()
              )?.value
            );
          */
          // this.mainForm.get('postalCountry').disable({emitEvent:false});
        });
      // }
    }
  }

  override async onValueEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  async updateValidation(event) {
    // Safety check: ensure mainForm exists
    if (!this.mainForm || !this.mainForm.form) {
      console.warn('PostalAddressComponent: mainForm or form not available for validation');
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
        console.warn('PostalAddressComponent: Invalid regex pattern in validation rules', error.message);
        return true; // Return true to prevent blocking on invalid patterns
      }
      
      // Handle split errors gracefully
      if (error?.message?.includes('Cannot read properties of undefined') && error?.message?.includes('split')) {
        console.warn('PostalAddressComponent: Split error in validation - likely undefined pattern value', error.message);
        return true; // Return true to prevent blocking
      }
      
      // For other errors, log but don't throw to prevent breaking the app
      console.error('PostalAddressComponent: Validation error', error);
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
      "PostalAddressComponent",
      this.mainForm.form.valid
    );

    if (this.baseSvc.showValidationMessage) {
      let invalidPages = this.checkStepValidity();
      this.baseSvc.iconfirmCheckbox.next(invalidPages);
    }
    // this.checkStepValidity()
  }

  /**
   * Manually sync current form values to baseFormData
   * This is needed when emitEvent: false is used, as it prevents onValueChanges from firing
   */
  syncFormValuesToBaseData(): void {
    if (!this.mainForm?.form) return;
    
    const formValues = this.mainForm.form.value;
    const sanitizedValues: any = {};
    
    // Only sync non-empty values to avoid triggering validation errors
    Object.keys(formValues).forEach(key => {
      const value = formValues[key];
      if (value !== null && value !== undefined && value !== '') {
        if (typeof value === 'string' && value.trim().length > 0) {
          sanitizedValues[key] = value;
        } else if (typeof value === 'number' || typeof value === 'boolean') {
          sanitizedValues[key] = value;
        } else if (Array.isArray(value) && value.length > 0) {
          sanitizedValues[key] = value;
        } else if (typeof value === 'object' && value !== null) {
          const stringValue = value.value || value.label || value.name;
          if (stringValue && typeof stringValue === 'string' && stringValue.trim().length > 0) {
            sanitizedValues[key] = stringValue;
          } else {
            sanitizedValues[key] = value;
          }
        }
      }
    });
    
    if (Object.keys(sanitizedValues).length > 0) {
      this.baseSvc.setBaseDealerFormData(sanitizedValues);
    }
  }

  override ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    super.ngOnDestroy();
    this.reusePhysicalSubs?.unsubscribe();
    this.searchSubscription?.unsubscribe();
  }
}
