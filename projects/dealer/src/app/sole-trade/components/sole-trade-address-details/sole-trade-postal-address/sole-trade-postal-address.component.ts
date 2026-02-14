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
import { SoleTradeService } from "../../../services/sole-trade.service";
import { BaseSoleTradeClass } from "../../../base-sole-trade.class";
import { SearchAddressService } from "../../../../standard-quote/services/search-address.service";
import { Subscription } from "rxjs";
import { IndividualService } from "../../../../individual/services/individual.service";
import { debounceTime, distinctUntilChanged, filter, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-sole-trade-postal-address",
  templateUrl: "./sole-trade-postal-address.component.html",
  styleUrl: "./sole-trade-postal-address.component.scss",
})
export class SoleTradePostalAddressComponent extends BaseSoleTradeClass {
  optionsdata = [{ label: "icashpro", value: "icp" }];
  flag: boolean = true;
  postalSearchValue: String;
  reusePhysicalSubs: Subscription;
  index: number;
  customerRoleForm: FormGroup;
  private countryOptions: any[] = [];
  private cityOptionsAll: any[] = [];
  searchAddressList: any[];
  cityOptions: any = [];
  cityOptionsLocationId: any = [];
  private copiedPhysicalValues: any = {}; // Store copied values for immediate comparison
  private previousAddressType: string = null; // Track previous address type to detect manual changes

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
    autoResponsive: true,
    api: "postalAddress",
    goBackRoute: "postalAddress",
    cardType: "border",
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
        //placeholder: "Search",
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
        // list$: "LookUpServices/custom_lookups?LookupSetName=FloorType",
        // idKey: "lookupValue",
        // idName: "lookupValue",
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
        // list$: "LookUpServices/custom_lookups?LookupSetName=UnitType",
        // idKey: "lookupValue",
        // idName: "lookupValue",
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
        className: " ",
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
        // list$: "LookUpServices/custom_lookups?LookupSetName=StreetType",
        // idKey: "lookupValue",
        // idName: "lookupValue",
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
        // //validators: [validators.required],  -- Auro
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
        // list$: "LookUpServices/locations?LocationType=country",
        // idKey: "name",
        // idName: "name",
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
    public override baseSvc: SoleTradeService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef,
    public searchSvc: SearchAddressService,
    private indSvc: IndividualService
  ) {
    super(route, svc, baseSvc);
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

    if (this.baseSvc.showValidationMessage) {
      this.mainForm.form.markAllAsTouched();
    }

    this.customerRoleForm = this.fb.group({
      postalSearchValue: ["", Validators.required],
    });

    this.indSvc.updateDropdownData().subscribe((result) => {
      this.mainForm.updateList("postalFloorType", result?.floorType);
      this.mainForm.updateList("postalUnitType", result?.unitType);
      this.mainForm.updateList("postalStreetType", result?.streetType);

      if (result?.country) {
        this.mainForm.updateList("postalCountry", result?.country);
        
        const countryCtrl = this.mainForm?.form?.get("postalCountry");
        const addressType = this.mainForm?.form?.get('postalAddressType')?.value;
        
        // Only set default value for PO type - street type is handled by togglePostalCountry()
      // if 'PO' , take data from baseform OR default to NZ for new forms
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

    // Initialize subscription to physical address copy signals (like business module)
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

  private togglePostalCountry(addressType: string): void {
    const countryCtrl = this.mainForm?.form?.get('postalCountry');

    if (!countryCtrl) return;

    if (addressType === 'street') {
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
      // const currentValue = countryCtrl.value || 'New Zealand';
      
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
      this.indSvc.updateDropdownData().subscribe((result) => {
        if (result?.country) {
          this.mainForm.updateList("postalCountry", result?.country);
        }
      });
      
      countryCtrl.enable({ emitEvent: false });
    }
  }

  // NEW METHOD: Add street type handling method for sole trade postal address
  async setStreetType(streetTypeValue: string) {
    try {
      // Ensure street type options are loaded - using fieldProps for sole trade component as shown in original onBlurEvent
      const streetTypeOptions =
        this.mainForm?.fieldProps?.["postalStreetType"]?.options;

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
          .get("postalStreetType")
          .patchValue(matchedOption.value || matchedOption.label);
      }
    } catch (error) {}
  }

  // async updateDropdownData() {
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
  //     `LookUpServices/custom_lookups?LookupSetName=StreetType`,
  //     (res) => {
  //       let list = res.data;

  //       const floorTypeList = list.map((item) => ({
  //         label: item.lookupValue,
  //         value: item.lookupValue,
  //         lookupCode: item.lookupCode,
  //       }));

  //       this.mainForm.updateList("postalStreetType", floorTypeList);

  //       return floorTypeList;
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

  //       this.countryOptions = countryList;

  //       const selectedCountry =
  //         this.mainForm?.form?.get("postalCountry")?.value ||
  //         this.baseFormData?.postalCountry ||
  //         "New Zealand";

  //       const sortedCountryList = this.sortOptionsWithSelectedOnTop(
  //         countryList,
  //         selectedCountry
  //       );

  //       this.mainForm.updateList("postalCountry", sortedCountryList);

  //       return sortedCountryList;
  //     }
  //   );

  //   await this.getCities();
  // }

  override title: string = "Address Details";
  // override title: string = 'Address Details';

  // override async onSuccess(data: any) {}
  // override onFormDataUpdate(res: any): void {
  //   if (
  //     this.baseFormData?.physicalreuseOfPostalAddress !=
  //     res?.physicalreuseOfPostalAddress
  //   ) {
  //     const fields = [
  //       "Search",
  //       "BuildingName",
  //       "City",
  //       "Year",
  //       "Month",
  //       "Lot",
  //       "Country",
  //       "FloorType",
  //       "Postcode",
  //       "ResidenceType",
  //       "RuralDelivery",
  //       "StreetDirection",
  //       "StreetName",
  //       "StreetNumber",
  //       "StreetType",
  //       "Suburb",
  //       "TimeAtAddress",
  //       "UnitNumber",
  //       "Attention",
  //     ];

  //     fields.forEach((field) => {
  //       if (
  //         this.mainForm.form.get(`postal${field}`) &&
  //         this.mainForm.form.get(`postal${field}`).value !=
  //           res[`physical${field}`] &&
  //         res[`physical${field}`]
  //       ) {
  //         this.updateDisableValue({
  //           key: `postal${field}`,
  //           value: res[`physical${field}`],
  //         });
  //         this.mainForm.form.get(`postal${field}`).enable();
  //       }
  //     });
  //   }
  // }

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
          this.mainForm.get("postalAddressType").setValue("po");
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
    if (event.name && event.name.startsWith('postal')) {
      const formControl = this.mainForm?.form?.get(event.name);
      if (formControl) {
        const fieldValue = formControl.value;
        this.baseSvc.setBaseDealerFormData({
          [event.name]: fieldValue
        });
      }
    }
    
    if (event.name === "postalCity") {
      let locationName = this.mainForm.form.get("postalCity").value;
      let LocationId = this.cityOptionsLocationId.filter(
        (l) => l.name === locationName
      );

      this.baseSvc.setBaseDealerFormData({
        postalCityLocationId: LocationId[0]?.locationId,
      });
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
        this.getCities();
      }
      //await this.updateValidation("onInit");
    }
    await this.updateValidation("onInit");
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

  /**
   * Clears all address-related fields when user manually changes address type
   * This preserves the address type and country fields, but clears all other address data
   */
  private clearAddressDataOnTypeChange(): void {
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
      'postalCountry'
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
    this.baseSvc.setBaseDealerFormData(dataToClear);
    
    this.postalSearchValue = null;
    
    if (this.baseFormData?.physicalReuseOff) {
      this.baseSvc.postalAddressManuallyChanged.next(true);
    }
  }

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

  override async onSuccess(data: any) {}

  copied: boolean = false;
  // override onFormDataUpdate(res: any): void {
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
    // Only handle changes to physicalReuseOff toggle
    if (
      this.baseFormData?.physicalReuseOff !==
      res?.physicalReuseOff
    ) {
      const wasPreviouslyCopied = this.baseFormData?.physicalReuseOff === true;
      const isNowCopying = res?.physicalReuseOff === true;
      
      const isNz = res.physicalCountry === "New Zealand";

      // Only change address type if we're copying from physical address
      // Don't change it if we're just undoing a copy or opening existing address
      if (isNowCopying) {
        const copiedAddressType = isNz ? "street" : "po";
        
        // Set flag EARLY to prevent form change listener from triggering during copy operations
        this.baseSvc.isCopyingToPostal$.next(true);
        
        // Update previous address type BEFORE changing the address type
        // This prevents the manual change detection from triggering during copy
        this.previousAddressType = copiedAddressType;
        
        this.mainForm.form
          .get("postalAddressType")
          .patchValue(copiedAddressType, { emitEvent: false });
        
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
        });
      }
      
      if (res.physicalReuseOff) {
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

        const dataToSave: any = {};
        fields.forEach((field) => {
          const controlName = `postal${field}`;
          const control = this.mainForm?.form?.get(controlName);
          const value = res[`physical${field}`];

          if (control && value !== undefined && value !== null) {
            const wasDisabled = control.disabled;
            if (wasDisabled) control.enable({ emitEvent: false });
            control.setValue(value, { emitEvent: false });
            if (wasDisabled) control.disable({ emitEvent: false });
            // Save to baseFormData for payload
            dataToSave[controlName] = value;
          }
        });
        
        // Save postalAddressType and postalCountry
        dataToSave.postalAddressType = "street";
        dataToSave.postalCountry = "New Zealand";
        
        // Save all copied values to baseFormData for payload
        if (Object.keys(dataToSave).length > 0) {
          this.baseSvc.setBaseDealerFormData(dataToSave);
        }
        
        this.mainForm.form.get("postalAddressType").patchValue("street", { emitEvent: false });
        
        // Update previous address type to prevent false positive on manual change detection
        this.previousAddressType = "street";
        
        // Set country and disable it for street type
        this.mainForm.form.get('postalCountry')?.patchValue('New Zealand', { emitEvent: false });
        this.mainForm.form.get('postalCountry')?.disable({ emitEvent: false });
        
        // Reset copy flag after copy operation completes
        this.baseSvc.isCopyingToPostal$.next(false);
      } else {
        // Only reset if we're UNDOING a copy (was true, now false)
        // Don't reset if we're just opening an existing address that was never copied
        if (wasPreviouslyCopied && !isNowCopying) {
          // Check if there's existing postal address data - if so, preserve the address type
          const hasExistingPostalData = !!(this.baseFormData?.postalStreetName || 
                                          this.baseFormData?.postalBuildingName || 
                                          this.baseFormData?.postalStreetNumber ||
                                          this.baseFormData?.postalStreetArea);
          const existingAddressType = this.baseFormData?.postalAddressType || 
                                     (hasExistingPostalData ? "street" : "po");
          
          // Reset all fields except country and postalAddressType
          Object.keys(this.mainForm.form.controls).forEach(key => {
            if (key !== 'postalCountry' && key !== 'postalAddressType') {
              this.mainForm.form.get(key).reset();
            }
          });       
          
          // Only reset address type to "po" if there's no existing postal data
          // Otherwise preserve the existing address type
          if (!hasExistingPostalData) {
            this.mainForm.form.get("postalAddressType").patchValue("po", { emitEvent: false });
            // Update previous address type
            this.previousAddressType = "po";
            // Enable country for PO Box type
            this.mainForm.form.get('postalCountry')?.patchValue('New Zealand', { emitEvent: false });
            this.mainForm.form.get('postalCountry')?.enable({ emitEvent: false });
          } else {
            // Preserve existing address type and update visibility accordingly
            this.mainForm.form.get("postalAddressType").patchValue(existingAddressType, { emitEvent: false });
            // Update previous address type
            this.previousAddressType = existingAddressType;
            if (existingAddressType === "street") {
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
              const currentCountry = this.mainForm.form.get('postalCountry')?.value || this.baseFormData?.postalCountry;
              if (!currentCountry || currentCountry === "New Zealand") {
                this.mainForm.form.get('postalCountry')?.patchValue('New Zealand', { emitEvent: false });
              }
              this.mainForm.form.get('postalCountry')?.disable({ emitEvent: false });
            }
          }
          
          // Clear copied values
          this.copiedPhysicalValues = {};
        }
      }
    }

    this.cdr.detectChanges();
  }

  override async onFormEvent(event) {
  if (event.name === "postalCity") {
    let locationName = this.mainForm.form.get("postalCity").value;
    let LocationId = this.cityOptionsLocationId.filter(
      (l) => l.name === locationName
    );

    this.baseSvc.setBaseDealerFormData({
      postalCityLocationId: LocationId[0]?.locationId,
    });
     
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
    this.mainForm?.form?.disable();
    }
    else{ this.mainForm?.form?.enable();}
    await this.updateValidation("onInit");
  }
    // const isNz = this.baseFormData?.postalCountry === "New Zealand";
    // this.mainForm.form.get('postalAddressType').patchValue(isNz ? 'street' : 'po')

  super.onFormEvent(event);
}

  override onValueChanges(event: any): void {
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

    if (event.postalSearchValue && event.postalSearchValue.length >= 4) {
      this.searchSvc.searchAddress(event.postalSearchValue).subscribe((res) => {
        this.searchAddressList = res;
        this.mainForm.updateList("postalSearchValue", this.searchAddressList);
      });
    }

    // Sync all postal field values to baseFormData for payload
    this.baseSvc.setBaseDealerFormData({
      ...event,
    });
  }

  postalAddressType: any;
  // pageCode: string = "SoleTradeAddressDetailsComponent";
  // modelName: string = "SoleTradePostalAddressComponent";
  pageCode: string = "SoleTradeAddressDetailsComponent";
  modelName: string = "SoleTradePostalAddressComponent";

  override async onFormReady(): Promise<void> {
    // const addressType = this.mainForm?.form?.get('postalAddressType')?.value || 'po';
    // this.togglePostalCountry(addressType);
    const addressType = this.mainForm?.form?.get('postalAddressType')?.value;
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
              .filter((city) => city.owner === selectedCountry)
              .map((city) => ({
                label: city.name,
                value: city.name,
              }));

            // Store both the filtered options and location IDs
            this.cityOptionsAll = filteredCities;
            this.cityOptionsLocationId = obj;

           this.cityOptions = filteredCities;

this.mainForm.updateList("postalCity", filteredCities);

          }
        }
      );
    }
  }

  // UPDATED METHOD: Enhanced blur event with street type auto-population
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

          // Patch form values first
          this.mainForm.form.patchValue(formValues);

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

          // this.mainForm.get('postalCountry').disable({emitEvent:false});
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
      "SoleTradePostalAddressComponent",
      this.mainForm.form.valid
    );

    if (this.baseSvc.showValidationMessage) {
      let invalidPages = this.checkStepValidity();
      this.baseSvc.iconfirmCheckbox.next(invalidPages);
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.reusePhysicalSubs?.unsubscribe();
  }
}
