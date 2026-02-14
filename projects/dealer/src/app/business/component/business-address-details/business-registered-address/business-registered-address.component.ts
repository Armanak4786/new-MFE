import { ChangeDetectorRef, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, Mode, ToasterService } from "auro-ui";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BusinessService } from "../../../services/business";
import { BaseBusinessClass } from "../../../base-business.class";
import { ValidationService } from "auro-ui";
import { SearchAddressService } from "../../../../standard-quote/services/search-address.service";
import { IndividualService } from "../../../../individual/services/individual.service";
import { Subject, Subscription, takeUntil, filter } from 'rxjs';
@Component({
  selector: "app-business-registered-address",
  templateUrl: "./business-registered-address.component.html",
  styleUrl: "./business-registered-address.component.scss",
})
export class BusinessRegisterAddressComponent extends BaseBusinessClass {
  optionsdata = [{ label: "icashpro", value: "icp" }];
  privousChecked: any;
  index: any;
  physicalSeachValue: String;
  customerRoleForm: FormGroup;
  searchAddressList: any;
  cityOptions: any = [];
  private reusePhysicalSubs: Subscription;
  cityOptionsLocationId: any = [];
  private countryOptions: any[] = [];
  private cityOptionsAll: any[] = [];
  private copiedPhysicalValues: any = {}; // Store copied values for immediate comparison
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

  // override title: string = 'Address Details';
  // override title: string = 'Address Details';
  override formConfig: GenericFormConfig = {
    headerTitle: "Registered Address",
    cardType: "border",
    autoResponsive: true,
    api: "registeredAddress",
    //cardBgColor: "--light-primary-color",
    // goBackRoute: 'registeredAddress',
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

        nextLine: true,
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

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
     this.enforceCountryState();

    this.customerRoleForm = this.fb.group({
      physicalSeachValue: ["", Validators.required],
    });
     this.initializeCopySubscription();
    this.indSvc.updateDropdownData().subscribe({
      next: (result) => {
        try {
          this.mainForm.updateList("registerFloorType", result?.floorType);
          this.mainForm.updateList("registerUnitType", result?.unitType);
          this.mainForm.updateList("registerStreetType", result?.streetType);
          if (result?.country) {
            this.mainForm.updateList("registerCountry", result?.country);
            this.mainForm?.form?.get("registerCountry")?.setValue("New Zealand", { emitEvent: false });
            this.mainForm.updateList("registerCity", result?.city);
          }
        } catch (error) {
          if (error?.message?.includes('Cannot read properties of undefined') && error?.message?.includes('split')) {
            console.warn('BusinessRegisterAddressComponent: Split error in updateDropdownData subscription', error.message);
          } else {
            console.error('BusinessRegisterAddressComponent: Error in updateDropdownData subscription', error);
          }
        }
      },
      error: (error) => {
        console.error('BusinessRegisterAddressComponent: Error in updateDropdownData subscription', error);
      }
    });

    if (this.baseSvc.showValidationMessage) {
      this.mainForm.form.markAllAsTouched();
    }
    await this.getCities();
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
          console.warn('BusinessRegisterAddressComponent: Error disabling form', error);
        }
      }
      else{ 
        try {
          // Use emitEvent: false to prevent triggering validation subscriptions that cause split errors
          this.mainForm?.form?.enable({ emitEvent: false });
        } catch (error) {
          // Handle errors that might occur when enabling form triggers validation subscriptions
          if (error?.message?.includes('Cannot read properties of undefined') && error?.message?.includes('split')) {
            console.warn('BusinessRegisterAddressComponent: Split error when enabling form - likely undefined pattern value in validation', error.message);
          } else {
            console.warn('BusinessRegisterAddressComponent: Error enabling form', error);
          }
        }
      }
  }
  private enforceCountryState(): void {
  const countryControl = this.mainForm?.form?.get('registerCountry');
  if (countryControl) {
    countryControl.patchValue('New Zealand', { emitEvent: false });
    countryControl.disable({ emitEvent: false });
  }
}
//Initializes subscription to physical address copy signals.
private initializeCopySubscription(): void {
  this.reusePhysicalSubs = this.baseSvc.reusePhysical$
    .pipe(
      takeUntil(this.destroy$),
      filter(payload => {
        if (!payload) return false;
        if (typeof payload === 'string') return false;
        return true;
      })
    )
    .subscribe((payload: any) => {
      if (!this.mainForm) return;

      if (payload?.action === 'copiedToRegister' && payload?.data) {
        this.handleCopyFromPhysical(payload.data);
      } 
      // else if (payload?.action === 'undoCopyRegister') {
      //   if (this.baseFormData?.physicalreuseOfRegisterAddress) {
      //     this.handleUndoCopy();
      //   }
      // }
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

  Object.keys(physicalData).forEach(key => {
    const control = this.mainForm.form.get(key);
    if (control && physicalData[key] !== undefined && physicalData[key] !== null) {
      // Store the copied value for later comparison
      this.copiedPhysicalValues[key] = physicalData[key];

      const wasDisabled = control.disabled;
      
      if (wasDisabled) {
        control.enable({ emitEvent: false });
      }
      
      control.patchValue(physicalData[key], { emitEvent: false });
      
      if (wasDisabled) {
        control.disable({ emitEvent: false });
      }
    }
  });
   this.enforceCountryState();

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

// private handleUndoCopy(): void {
//   this.mainForm.updateHidden({
//     registerUnitType: false,
//     registerFloorNumber: false,
//     registerFloorType: false,
//     registerBuildingName: false,
//     registerRuralDelivery: false,
//     registerStreetDirection: false,
//     registerStreetType: false,
//     registerStreetName: false,
//     registerStreetNumber: false,
//     registerUnitNumber: false,
//     registerStreetArea: true,
//   });

//   this.mainForm.form.reset();
//   this.mainForm.form.get("registerCountry")?.patchValue("New Zealand", { emitEvent: false });
//   this.baseFormData.physicalreuseOfRegisterAddress = false;
//   this.cdr.detectChanges();
// }


  // NEW METHOD: Add street type handling method for business registered address
  async setStreetType(streetTypeValue: string) {
    try {
      // Ensure street type options are loaded
      const streetTypeOptions =
        this.mainForm?.fieldProps?.["registerStreetType"]?.options;

      if (!streetTypeOptions || streetTypeOptions.length === 0) {
        console.warn(
          "Business registered street type options not loaded yet, retrying..."
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
        console.warn(
          "⚠️ No matching business registered street type found for:",
          streetTypeValue
        );
      }
    } catch (error) {
      console.error("Error setting business registered street type:", error);
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
  //       this.mainForm.updateList("registerUnitType", unitTypeList);
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
  //       this.mainForm.updateList("registerFloorType", floorTypeList);
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

  //       this.countryOptions = countryList;

  //       const selectedCountry =
  //         this.mainForm?.form?.get("registerCountry")?.value ||
  //         this.baseFormData?.registerCountry ||
  //         "New Zealand";

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
  override async onSuccess(data: any) {}

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

  tempCity = null;
override async onFormEvent(event: any): Promise<void> {
  if (event.name === "registerCity") {
    const locationName = event.value || this.mainForm?.form?.get("registerCity")?.value;   
    if (!this.cityOptionsLocationId || this.cityOptionsLocationId?.length === 0) {
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
  
  // REMOVE THIS ENTIRE BLOCK - Country should never change
  // Since country is always disabled and set to "New Zealand",
  // this event will never trigger
  /*
  if (event.name == "registerCountry") {
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
  }
  */  
  // Always enforce country state to handle any edge cases
  this.enforceCountryState();
  
  await this.updateValidation("onInit");
  super.onFormEvent(event);
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
          console.warn('BusinessRegisterAddressComponent: Error disabling form', error);
        }
      }
      else{ 
        try {
          // Use emitEvent: false to prevent triggering validation subscriptions that cause split errors
          this.mainForm?.form?.enable({ emitEvent: false });
        } catch (error) {
          // Handle errors that might occur when enabling form triggers validation subscriptions
          if (error?.message?.includes('Cannot read properties of undefined') && error?.message?.includes('split')) {
            console.warn('BusinessRegisterAddressComponent: Split error when enabling form - likely undefined pattern value in validation', error.message);
          } else {
            console.warn('BusinessRegisterAddressComponent: Error enabling form', error);
          }
        }
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
    }
  }
  override onFormDataUpdate(res: any): void {
    if (
      this.baseFormData?.physicalreuseOfRegisterAddress !=
      res?.physicalreuseOfRegisterAddress
    ) {
      // Set flag EARLY to prevent form change listener from triggering during copy/reset operations
      this.baseSvc.isCopyingToRegister = true;

      const fields = [
        "SearchValue",
        "BuildingName",
        "Attention",
        "City",
        "Year",
        "Month",
        "FloorType",
        "BuildingName",
        "UnitType",
        "StreetArea",
        "Lot",
        "Country",
        "FloorNumber",
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
      ];

      if (res.physicalreuseOfRegisterAddress) {
        // Clear previous copied values and store new ones
        this.copiedPhysicalValues = {};

        fields.forEach((field) => {
          const controlName = `register${field}`;
          const control = this.mainForm.form.get(controlName);
          const physicalFieldValue = res[`physical${field}`];
          //     console.log(`Checking field register${field} vs physical${field}`, {
          //   postalFieldValue: postalField?.value,
          //   physicalFieldValue,
          // });
          if (
            control &&
            control.value !== physicalFieldValue &&
            physicalFieldValue
          ) {
            // Store the copied value for later comparison
            this.copiedPhysicalValues[controlName] = physicalFieldValue;
            control.patchValue(physicalFieldValue, { emitEvent: false });
            control.enable();
          }
        });

        const postcodeControl = this.mainForm.form.get(`registerPostcode`);
        const physicalPostcodeValue = res[`physicalPostcode`];
        if (
          postcodeControl &&
          postcodeControl.value !== physicalPostcodeValue &&
          physicalPostcodeValue
        ) {
          // Store the copied value for later comparison
          this.copiedPhysicalValues['registerPostcode'] = physicalPostcodeValue;
          postcodeControl.patchValue(physicalPostcodeValue, { emitEvent: false });
          postcodeControl.enable();
        }
        
        // Immediately enable change detection after copy is complete
        this.baseSvc.isCopyingToRegister = false;
      } else {
        //reset the business physical fields, if toggle off
        if (this?.baseFormData?.physicalreuseOfRegisterAddress) {
          // Clear copied values when toggle is turned off
          this.copiedPhysicalValues = {};
          fields.forEach((field) => {
            const registerField = this.mainForm.form.get(`register${field}`);
            if (registerField) {
              try {
                registerField.reset(null, { emitEvent: false });
              } catch (error) {
                if (error?.message?.includes('Cannot read properties of undefined') && error?.message?.includes('split')) {
                  console.warn('BusinessRegisterAddressComponent: Split error when resetting field in onFormDataUpdate - likely undefined pattern value in validation', error.message);
                }
              }
            }
          });
          //resetting postcode too
          const postcodeCtrl = this.mainForm.form.get("registerPostcode");
          if (postcodeCtrl) {
            postcodeCtrl.reset();
          }
        }
        // Reset copying flag immediately for reset scenario
        this.baseSvc.isCopyingToRegister = false;
      }
    }
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
    this.baseSvc.registerAddressManuallyChanged.next(true);
  }
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
    if (!this.cityOptionsLocationId || this.cityOptionsLocationId.length === 0) {
      await this.getCities();
    }    
    const locationName = this.mainForm.form.get("registerCity").value;
    const LocationId = this.cityOptionsLocationId?.filter(
      (l) => l.name === locationName
    );

    // NEW: Add defensive checks
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
          // this.mainForm.updateList('')
      });
    }
  }
  if (event.name === "registerCountry") {
  if (!this.cityOptionsLocationId || this.cityOptionsLocationId?.length === 0) {
      await this.getCities();
    }
  }  
  await this.updateValidation("onInit");
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

            // Store both the filtered options and full location data
            this.cityOptionsAll = filteredCities;
            this.cityOptionsLocationId = obj; // CRITICAL: Store full objects with locationId
            this.cityOptions = filteredCities;
            this.mainForm.updateList("registerCity", filteredCities);
            
            // Load existing city locationId if form already has a city value
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
  }

  pageCode: string = "BusinessAddressDetailsComponent";
  modelName: string = "BusinessRegisterAddressComponent";

override async onFormReady(): Promise<void> {
   this.enforceCountryState();
  // NEW: Load cities first
 if (!this.cityOptionsLocationId || this.cityOptionsLocationId?.length === 0) {
      await this.getCities();
    }
  
  // NEW: Set locationId for existing city value
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
          //  console.log("External business registered address result:", res);
          const formValues = this.searchSvc.mapAddressJsonToFormControls(
            res.data,
            "register"
          );

          // Patch form values first - use emitEvent: false to prevent triggering validation subscriptions that cause split errors
          try {
            this.mainForm.form.patchValue(formValues, { emitEvent: false });
          } catch (error) {
            if (error?.message?.includes('Cannot read properties of undefined') && error?.message?.includes('split')) {
              console.warn('BusinessRegisterAddressComponent: Split error when patching form values in onBlurEvent - likely undefined pattern value in validation', error.message);
            } else {
              console.error('BusinessRegisterAddressComponent: Error patching form values in onBlurEvent', error);
            }
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
    await this.updateValidation(event);
  }

  override async onValueEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  async updateValidation(event) {
    // Safety check: ensure mainForm exists
    if (!this.mainForm || !this.mainForm.form) {
      console.warn('BusinessRegisterAddressComponent: mainForm or form not available for validation');
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
        console.warn('BusinessRegisterAddressComponent: Invalid regex pattern in validation rules', error.message);
        return true; // Return true to prevent blocking on invalid patterns
      }
      
      // Handle split errors gracefully
      if (error?.message?.includes('Cannot read properties of undefined') && error?.message?.includes('split')) {
        console.warn('BusinessRegisterAddressComponent: Split error in validation - likely undefined pattern value', error.message);
        return true; // Return true to prevent blocking
      }
      
      // For other errors, log but don't throw to prevent breaking the app
      console.error('BusinessRegisterAddressComponent: Validation error', error);
      return true; // Return true instead of throwing to prevent app breakage
    }
  }

override async onStepChange(quotesDetails: any): Promise<void> {
  // NEW: Final check to ensure locationId is set before navigation
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
      "BusinessRegisterAddressComponent",
      this.mainForm.form.valid
    );
    if (this.baseSvc.showValidationMessage) {
      let invalidPages = this.checkStepValidity();
      this.baseSvc.iconfirmCheckbox.next(invalidPages);
    }
  }

  /**
 * Component cleanup lifecycle hook.
 * Unsubscribes from all active subscriptions to prevent memory leaks.
 */
override ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
  this.reusePhysicalSubs?.unsubscribe();
  super.ngOnDestroy();
}

}
