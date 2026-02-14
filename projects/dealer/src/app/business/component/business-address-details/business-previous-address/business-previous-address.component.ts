import { ChangeDetectorRef, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, Mode, ToasterService } from "auro-ui";
import { BusinessService } from "../../../services/business";
import { BaseBusinessClass } from "../../../base-business.class";
import { ValidationService } from "auro-ui";
import { SearchAddressService } from "../../../../standard-quote/services/search-address.service";
import { IndividualService } from "../../../../individual/services/individual.service";

@Component({
  selector: "app-business-previous-address",
  templateUrl: "./business-previous-address.component.html",
  styleUrl: "./business-previous-address.component.scss",
})
export class BusinessPreviousAddressComponent extends BaseBusinessClass {
  privousChecked: any;
  searchAddressList: any[];
  cityOptions: any = [];
  private countryOptions: any[] = [];
  private cityOptionsAll: any[] = [];
  cityOptionsLocationId: any = [];
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: BusinessService,
    private toasterService: ToasterService,
    private cdr: ChangeDetectorRef,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public searchSvc: SearchAddressService,
    private indSvc: IndividualService
  ) {
    super(route, svc, baseSvc);
  }
  index: any;
  physicalSeachValue: String;
  // override title: string = 'Address Details';
  optionsdata = [{ label: "icashpro", value: "icp" }];
  override formConfig: GenericFormConfig = {
    headerTitle: "Previous Physical Address",
    autoResponsive: true,
    cardType: "border",
    //cardBgColor: "--primary-lighter-color",
    api: "",
    // goBackRoute: '',
    fields: [
      {
        type: "autoSelect",
        name: "previousSearchValue",
        // placeholder: "Search",
        label: "Search",
        idKey: "street",
        cols: 2,
        options: [],
        className: "my-1",
        rightIcon: true,
        icon: "fa-solid fa-location-crosshairs fa-lg",
        minLength: 3,
        // nextLine:true
      },
      {
        type: "toggle",
        label: "Overseas Address",
        name: "overseasAddress",
        className: "pl-0 mb-1 ml-3",
        cols: 2,
        alignmentType: "vertical",
        offLabel: "Yes",
        onLabel: "No",
        default: false,
        nextLine: true,
      },
      // {
      //   type: "select",
      //   label: "Residence Type ",
      //   name: "previousResidenceType",
      //   cols: 2,
      //   className: "px-0 customLabel",
      //   //validators: [Validators.required],
      //   nextLine: false,
      //   list$: "LookUpServices/lookups?LookupSetName=Homeowner",
      //   idKey: "lookupValue",
      //   idName: "lookupValue",
      //   alignmentType: "vertical",
      //   labelClass: "w-8 -my-3",
      // },
      {
        type: "number",
        inputType: "vertical",
        label: "Time at Address",
        name: "previousYear",
        // maxLength: 2,
        className: "col-fixed w-4rem ml-1",
        labelClass: "-ml-1 white-space-nowrap",
        inputClass: "-mt-2",
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
        name: "previousMonth",
        maxLength: 2,
        // validators: [Validators.max(11)],   -- Auro
        errorMessage: "Value should be less than 12",
        className: "pt-3 col-fixed w-4rem yearmonthClass",
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "Months",
        name: "month",
        className: "mt-3 w-8 pt-3 col-fixed w-4rem",
        nextLine: true,
      },
      {
        type: "text",
        label: "Building Name",
        name: "previousBuildingName",
        maxLength: 20,

        className: " ",
        inputType: "vertical",
        inputClass: "w-8 ",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],

        cols: 2,
        nextLine: false,
      },
      {
        type: "select",
        label: "Floor Type",
        name: "previousFloorType",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
        className: "px-0 customLabel",
        cols: 2,
        // list$: "LookUpServices/custom_lookups?LookupSetName=FloorType",
        // idKey: "lookupValue",
        // idName: "lookupValue",
        options: [],
        alignmentType: "vertical",
        labelClass: "w-8 -my-3",
      },
      {
        type: "text",
        label: "Floor Number",
        name: "previousFloorNumber",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
        className: " ",
        cols: 2,
        maxLength: 5,
        inputType: "vertical",
        inputClass: "w-8 ",
      },
      {
        type: "select",
        label: "Unit Type",
        name: "previousUnitType",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
        className: "px-0 customLabel",
        cols: 2,
        // list$: "LookUpServices/custom_lookups?LookupSetName=UnitType",
        // idKey: "lookupValue",
        // idName: "lookupValue",
        options: [],
        alignmentType: "vertical",
        labelClass: "w-8 -my-3",
      },
      {
        type: "textArea",
        label: "Address",
        name: "previousStreetArea",
        //validators: [Validators.pattern(/^[A-Za-z0-9\-\/]*$/)],
        textAreaRows: 4,
        className: " ",
        cols: 12,
        hidden: true,
        nextLine: true,
      },
      {
        type: "text",
        label: "Unit/Lot Number",
        name: "previousUnitNumber",
        //validators: [Validators.pattern(/^[A-Za-z0-9\-\/]*$/)],
        className: " ",
        cols: 2,
        inputType: "vertical",
        inputClass: "w-8 ",
        nextLine: false,
      },
      {
        type: "text",
        label: "Street Number",
        name: "previousStreetNumber",
        // validators: [
        //   Validators.required,
        //   Validators.pattern(/^[A-Za-z0-9\-\/]*$/),
        // ],
        className: " ",
        cols: 2,
        inputType: "vertical",
        inputClass: "w-8 ",
        nextLine: false,
      },

      {
        type: "text",
        label: "Street Name",
        name: "previousStreetName",
        // validators: [
        //   Validators.required,
        //   Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/),
        // ],
        className: "",
        cols: 2,
        inputType: "vertical",
        inputClass: "w-8 ",
        nextLine: false,
      },
      {
        type: "select",
        label: "Street Type",
        name: "previousStreetType",
        //validators: [Validators.required],
        className: "px-0 customLabel",
        cols: 2,
        nextLine: false,
        options: [],
        alignmentType: "vertical",
        labelClass: "w-8 -my-3",
      },

      {
        type: "text",
        label: "Street Direction",
        name: "previousStreetDirection",
        // validators: [
        //   Validators.required,
        //   Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/),
        // ],
        className: "",
        inputType: "vertical",
        inputClass: "w-8 ",
        cols: 2,
        nextLine: false,
      },
      {
        type: "text",
        label: "Rural Delivery",
        name: "previousRuralDelivery",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
        className: "",
        cols: 2,
        inputType: "vertical",
        inputClass: "w-8 ",
        nextLine: true,
      },
      {
        type: "text",
        label: "Suburb",
        name: "previousSuburbs",
        className: " ",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
        cols: 2,
        maxLength: 20,
        inputType: "vertical",
        inputClass: "w-8 ",
        nextLine: false,
      },
      {
        type: "select",
        label: "City",
        // validators: [
        //   Validators.required,
        //   Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/),
        // ],
        name: "previousCity",
        alignmentType: "vertical",
        labelClass: "w-8 -my-3",
        //validators: [Validators.required],
        className: "px-0 customLabel",
        cols: 2,
        // list$: "LookUpServices/locations?LocationType=City",
        // idKey: "name",
        // idName: "name",
        options: this.cityOptions,
        nextLine: false,
      },
      {
        type: "text",
        label: "Postcode",
        //validators: [Validators.required],
        name: "previousPostcode",
        className: " ",
        cols: 2,
        maxLength: 10,
        inputType: "vertical",
        inputClass: "w-8 ",
        nextLine: false,
      },
      // OLD SELECT FIELD CODE - Changed to text field initially (default is NZ Address)
      // When Overseas Address toggle is ON, it will be changed to select dropdown dynamically
      // {
      //   type: "select",
      //   label: "Country",
      //   name: "previousCountry",
      //   //validators: [Validators.required],
      //   className: "px-0 customLabel",
      //   filter: true,
      //   cols: 2,
      //   // list$: "LookUpServices/locations?LocationType=country",
      //   // idKey: "name",
      //   alignmentType: "vertical",
      //   labelClass: "w-8 -my-3",
      //   // idName: "name",
      //   options: [],
      //   //default: "New Zealand",
      //   nextLine: false,
      // },
      {
        type: "select",
        label: "Country",
        name: "previousCountry",
        filter: true,
        labelClass: "w-8 mb-2",
        className: "px-0 customLabel",
        cols: 2,
        alignmentType: "vertical",
        default: "New Zealand",
        nextLine: false,
      },
      {
        type: "text",
        label: "previousSearchCountry",
        // maxLength: 20,
        inputClass: "w-8",
        inputType: "vertical",

        name: "previousSearchCountry",
        className: " ",
        cols: 2,
        disabled: true,
        hidden: true,
        nextLine: false,
      },
    ],
  };

  override async onSuccess(data: any) {}
override async ngOnInit(): Promise<void> {
  await super.ngOnInit();
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
        console.warn('BusinessPreviousAddressComponent: Error disabling form', error);
      }
    }
    else{ 
      try {
        // Use emitEvent: false to prevent triggering validation subscriptions that cause split errors
        this.mainForm?.form?.enable({ emitEvent: false });
      } catch (error) {
        // Handle errors that might occur when enabling form triggers validation subscriptions
        if (error?.message?.includes('Cannot read properties of undefined') && error?.message?.includes('split')) {
          console.warn('BusinessPreviousAddressComponent: Split error when enabling form - likely undefined pattern value in validation', error.message);
        } else {
          console.warn('BusinessPreviousAddressComponent: Error enabling form', error);
        }
      }
    }
    // await this.updateDropdownData();

  this.indSvc.updateDropdownData().subscribe({
    next: (result) => {
      try {
        this.mainForm.updateList("previousFloorType", result?.floorType);
        this.mainForm.updateList("previousUnitType", result?.unitType);
        this.mainForm.updateList("previousStreetType", result?.streetType);
        if (result?.country) {
          this.mainForm.updateList("previousCountry", result?.country);
          this.mainForm?.form?.get("previousCountry")?.setValue("New Zealand", { emitEvent: false });
          this.mainForm.updateList("previousCity", result?.city);
        }
      } catch (error) {
        if (error?.message?.includes('Cannot read properties of undefined') && error?.message?.includes('split')) {
          console.warn('BusinessPreviousAddressComponent: Split error in updateDropdownData subscription', error.message);
        } else {
          console.error('BusinessPreviousAddressComponent: Error in updateDropdownData subscription', error);
        }
      }
    },
    error: (error) => {
      console.error('BusinessPreviousAddressComponent: Error in updateDropdownData subscription', error);
    }
  });
  await this.getCities();

  // Set initial country dropdown state based on overseasAddress toggle
  const overseasAddress = this.mainForm.form.get("overseasAddress")?.value;
  if (overseasAddress === true) {
    // If overseas address is YES, enable country dropdown
    this.mainForm.form.get("previousCountry")?.enable({ emitEvent: false });
  } else {
    // If overseas address is NO (default), keep country dropdown enabled
    this.mainForm.form.get("previousCountry")?.enable({ emitEvent: false });
  }
  if (this.baseSvc.showValidationMessage) {
    this.mainForm.form.markAllAsTouched();
  }
  this.mainForm
    ?.get("previousStreetType")
    ?.valueChanges.subscribe((selectedValue) => {
      if (!selectedValue) return;
      this.setStreetType(selectedValue);
    });
}
async getCities() {
  const selectedCountry = this.mainForm?.form.get("previousCountry")?.value;

  if (selectedCountry) {
    await this.baseSvc.getFormData(
      `LookUpServices/locations?LocationType=City`,
      (res) => {
        if (res.data && Array.isArray(res.data)) {
          let obj = res.data; // Full array with locationId
          const filteredCities = res.data
            .filter((city) => city.owner === selectedCountry)
            .map((city) => ({
              label: city?.name,
              value: city?.name,
              id: city?.id,
            }));

          // Store BOTH filtered options AND full data
          this.cityOptions = filteredCities;
          this.cityOptionsLocationId = obj; // ← CRITICAL: Store full objects

          this.mainForm.updateList("previousCity", filteredCities);
        }
      }
    );
  }
}

  // NEW METHOD: Add street type handling method for business previous address
async setStreetType(streetTypeValue: string) {
    try {
      const streetTypeOptions =
        this.mainForm?.fieldProps?.["previousStreetType"]?.options;

      if (!streetTypeOptions || streetTypeOptions.length === 0) {
        console.warn("Street type options not loaded yet, skipping...");
        return;
      }

      const searchValue = streetTypeValue?.toLowerCase()?.trim();

      const matchedOption = streetTypeOptions.find((option) => {
        return (
          option.value?.toLowerCase() === searchValue ||
          option.label?.toLowerCase() === searchValue ||
          option.lookupValue?.toLowerCase() === searchValue ||
          option.lookupCode?.toLowerCase() === searchValue ||
          option.value?.toLowerCase().includes(searchValue) ||
          option.label?.toLowerCase().includes(searchValue)
        );
      });

      if (matchedOption) {
        const newValue = matchedOption.value || matchedOption.label;

        const ctrl = this.mainForm.get("previousStreetType");

        // 🚑 Only patch if different
        if (ctrl?.value !== newValue) {
          ctrl.patchValue(newValue, { emitEvent: false }); // 🔥 FIX HERE
        }

        // console.log(
          // "✅ Business previous street type set successfully:",
          // matchedOption
        // );
      } else {
        console.warn(
          "⚠️ No matching business previous street type found for:",
          streetTypeValue
        );
      }
    } catch (error) {
      console.error("Error setting business previous street type:", error);
    }
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

  // UPDATED METHOD: Enhanced place selection with street type auto-population
async placeSelected(event: any, index: any) {
  if (event.properties) {
    const data = event.properties;

    if (data.country)
      this.mainForm.get("previousCountry").patchValue(data.country);
    if (data.postcode)
      this.mainForm.get("previousPostcode").patchValue(data.postcode);
    if (data.city) {
      this.mainForm.get("previousCity").patchValue(data.city);
      
      // ← NEW: Set cityLocationId when city is selected from search
      let LocationId = this.cityOptionsLocationId?.filter(
        (l) => l.name === data.city
      );
      if (LocationId && LocationId.length > 0 && LocationId[0]?.locationId) {
        this.baseSvc.setBaseDealerFormData({
          previousCity: data.city,
          previousCityLocationId: LocationId[0]?.locationId,
        });
      }
    }
    if (data.street)
      this.mainForm.get("previousStreetName").patchValue(data.street);
    if (data.suburb)
      this.mainForm.get("previousSuburbs").patchValue(data.suburb);
    
    if (data.country != "New Zealand") {
      this.mainForm.updateHidden({
        previousUnitType: true,
        previousFloorNumber: true,
        previousFloorType: true,
        previousBuildingName: true,
        previousRuralDelivery: true,
        previousStreetDirection: true,
        previousStreetType: true,
        previousStreetName: true,
        previousStreetNumber: true,
        previousUnitNumber: true,
        previousStreetArea: false,
        overseasAddress: false,
      });
    } else {
      this.mainForm.updateHidden({
        previousUnitType: false,
        previousFloorNumber: false,
        previousFloorType: false,
        previousBuildingName: false,
        previousRuralDelivery: false,
        previousStreetDirection: false,
        previousStreetType: false,
        previousStreetName: false,
        previousStreetNumber: false,
        previousUnitNumber: false,
        previousStreetArea: true,
        overseasAddress: false,
      });
    }
  }
}


  tempCity = null;
override async onFormEvent(event: any): Promise<void> {
  if (event.name === "previousCity") {
    let locationName = this.mainForm?.form?.get("previousCity")?.value;
    let LocationId = this.cityOptionsLocationId?.filter(
      (l) => l.name === locationName
    );

    if (LocationId && LocationId.length > 0 && LocationId[0]?.locationId) {
      this.baseSvc.setBaseDealerFormData({
        previousCity: locationName,
        previousCityLocationId: LocationId[0]?.locationId,
      });
    }
  }
  
  if (event.name == "previousCountry") {
    if (event?.value != this.tempCity) {
      await this.getCities(); // ← NEW: Reload cities when country changes
    }
    this.tempCity = event?.value;
  }
  
  await super.onFormEvent(event);

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
        console.warn('BusinessPreviousAddressComponent: Error disabling form', error);
      }
    }
    else{ 
      try {
        // Use emitEvent: false to prevent triggering validation subscriptions that cause split errors
        this.mainForm?.form?.enable({ emitEvent: false });
      } catch (error) {
        // Handle errors that might occur when enabling form triggers validation subscriptions
        if (error?.message?.includes('Cannot read properties of undefined') && error?.message?.includes('split')) {
          console.warn('BusinessPreviousAddressComponent: Split error when enabling form - likely undefined pattern value in validation', error.message);
        } else {
          console.warn('BusinessPreviousAddressComponent: Error enabling form', error);
        }
      }
    }
}


  // override onFormEvent(event: any): void {
  //   if(event.name == 'previousCountry' )
  //     {
  //   if(event.name=='previousCountry' && event.value!='New Zealand') {
  //     this.mainForm.updateHidden({
  //       previousUnitType: true,
  //       previousFloorNumber: true,
  //       previousFloorType: true,
  //       previousBuildingName: true,
  //       previousRuralDelivery: true,
  //       previousStreetDirection: true,
  //       previousStreetType: true,
  //       previousStreetName: true,
  //       previousStreetNumber: true,
  //       previousUnitNumber: true,
  //       previousStreetArea: false,
  //     });
  //   } else {
  //     this.mainForm.updateHidden({
  //       previousUnitType: false,
  //       previousFloorNumber: false,
  //       previousFloorType: false,
  //       previousBuildingName: false,
  //       previousRuralDelivery: false,
  //       previousStreetDirection: false,
  //       previousStreetType: false,
  //       previousStreetName: false,
  //       previousStreetNumber: false,
  //       previousUnitNumber: false,
  //       previousStreetArea: true,
  //     });
  //   }
  // }

  // }
  override async onFormDataUpdate(res: any): Promise<void> {
    if (
      this.baseFormData?.copyToPreviousAddress !== res?.copyToPreviousAddress &&
      res?.copyToPreviousAddress
    ) {
      const isNz = res.physicalCountry === "New Zealand";

      this.mainForm.updateHidden({
        previousStreetArea: isNz,
        previousUnitType: !isNz,
        previousFloorNumber: !isNz,
        previousFloorType: !isNz,
        previousBuildingName: !isNz,
        previousRuralDelivery: !isNz,
        previousStreetDirection: !isNz,
        previousStreetType: !isNz,
        previousStreetName: !isNz,
        previousStreetNumber: !isNz,
        previousUnitNumber: !isNz,
        previousResidenceType: !isNz,
        previousYear: !isNz,
        previousMonth: !isNz,
        month: !isNz,
        year: !isNz,
        overseasAddress: !isNz,
      });
      // await this.updateValidation("onInit");
      this.pathcValue(res);
    }
  }
  pathcValue(res) {
    if (res.copyToPreviousAddress) {
      const fields = [
        "BuildingName",
        "City",
        "Country",
        "FloorNumber",
        "FloorType",
        "Month",
        "Postcode",
        "ResidenceType",
        "RuralDelivery",
        "StreetDirection",
        "StreetName",
        "StreetNumber",
        "StreetType",
        "Suburbs",
        "UnitNumber",
        "UnitType",
        "Year",
      ];

      fields.forEach((field) => {
        const controlName = `previous${field}`;
        const control = this.mainForm?.form?.get(controlName);
        const value = res[`physical${field}`];

        if (control && value !== undefined && value !== null) {
          const wasDisabled = control.disabled;
          if (wasDisabled) control.enable({ emitEvent: false });
          control.setValue(value);
          if (wasDisabled) control.disable({ emitEvent: false });
        }
      });
    } else {
      try {
        // Use emitEvent: false to prevent triggering validation subscriptions that cause split errors
        this.mainForm?.form?.reset({}, { emitEvent: false });
      } catch (error) {
        if (error?.message?.includes('Cannot read properties of undefined') && error?.message?.includes('split')) {
          console.warn('BusinessPreviousAddressComponent: Split error when resetting form in pathcValue - likely undefined pattern value in validation', error.message);
        } else {
          console.warn('BusinessPreviousAddressComponent: Error resetting form in pathcValue', error);
        }
      }
    }
    this.cdr.detectChanges();
  }
override async onValueTyped(event: any): Promise<void> {
  if (event.name === "previousCity") {
    let locationName = this.mainForm.form.get("previousCity").value;
    let LocationId = this.cityOptionsLocationId.filter(
      (l) => l.name === locationName
    );

    if (LocationId && LocationId.length > 0 && LocationId[0]?.locationId) {
      this.baseSvc.setBaseDealerFormData({
        previousCity: locationName,
        previousCityLocationId: LocationId[0]?.locationId,
      });
    }
  }

  if (event.name == "overseasAddress") {
    // ALWAYS clear all address fields first (regardless of Yes or No)
    this.clearAllAddressFields();
    if (event.data === true) {
      //When toggle is set to "Yes" (true) - Overseas Address
      this.hiddenfieldbyOverseas(true);
      this.mainForm.get("previousSearchValue").disable({ emitEvent: false });
      this.mainForm.get("previousSearchValue").setValue("", { emitEvent: false });       
      // Changing "City" dropdown to text input field
      this.mainForm.updateProps("previousCity", {
        type:'text',
        inputType:'vertical',
        inputClass: "w-8",
        cols: 2,
        labelClass:"",
        className:'',
      });
    } else {
      // When toggle is set to "No" (false) - NZ Address     
      this.hiddenfieldbyOverseas(false);
      
      this.mainForm.get("previousSearchValue").enable({ emitEvent: false });
      // Changing "City" text input field back to dropdown
      this.mainForm.updateProps("previousCity", {
        type: "select",
        label: "City",
        labelClass: "w-8 -my-3",
        alignmentType: "vertical",
        name: "previousCity",
        className: "px-0 customLabel",
        options: this.cityOptions,
        cols: 2,
        nextLine: false,
      });
      await this.getCities(); // ← NEW: Reload cities when switching back to NZ
    }
  }

  await this.updateValidation("onInit");
}

  // Toggle country dropdown based on overseas address
  private toggleCountryDropdown(overseas: boolean): void {
    const countryCtrl = this.mainForm.form.get('previousCountry');

    if (!countryCtrl) return;

    if (overseas) {
      // YES → Overseas → change to SELECT dropdown (enabled)
      this.mainForm.updateProps("previousCountry", {
        type: "select",
        label: "Country",
        name: "previousCountry",
        className: "px-0 customLabel",
        filter: true,
        cols: 2,
        alignmentType: "vertical",
        labelClass: "w-8 -my-3",
      });
      
      // Update the countries - sessionStorage cache
      this.indSvc.updateDropdownData().subscribe((result) => {
        if (result?.country) {
          this.mainForm.updateList("previousCountry", result?.country);
        }
      });
      
      countryCtrl.enable({ emitEvent: false });
      // countryCtrl.setValue(currentValue || '', { emitEvent: false });
    } else {
      // NO → NZ → change to TEXT field (read-only)
      this.mainForm.updateProps("previousCountry", {
        type: "text",
        label: "Country",
        name: "previousCountry",
        disabled: true,
        inputType: "vertical",
        inputClass: "w-8 mt-2",
        labelClass: "w-8 -my-3",
        className: "px-0 mt-2 customLabel",
        cols: 2,
        mode: Mode.view,
      });
      // Set value to New Zealand
      countryCtrl.setValue('New Zealand', { emitEvent: false });
      
      this.baseSvc.setBaseDealerFormData({
        previousCountry: 'New Zealand',
      });
    }
  }

  override onValueChanges(event: any) {
    if (event.previousSearchValue && event.previousSearchValue.length >= 4) {
      this.searchSvc
        .searchAddress(event.previousSearchValue)
        .subscribe((res) => {
          this.searchAddressList = res;
          this.mainForm.updateList(
            "previousSearchValue",
            this.searchAddressList
          );
        });
    }
  }

  pageCode: string = "BusinessAddressDetailsComponent";
  modelName: string = "BusinessPreviousAddressComponent";

override async onFormReady(): Promise<void> {
  await this.updateValidation("onInit");

  // Check initial state of overseas address with proper handling
  if (this.baseFormData.overseasAddress === true) {
    // Overseas address is YES - enable country dropdown
    this.hiddenfieldbyOverseas(this.baseFormData.overseasAddress);
    this.mainForm?.get("previousSearchValue").disable({ emitEvent: false });
    // Clear any existing search value when overseas is true
    this.mainForm
      ?.get("previousSearchValue")
      .setValue("", { emitEvent: false });
  } else {
    // Overseas address is NO - keep country dropdown enabled
    // Ensure search field is enabled for domestic addresses
    this.hiddenfieldbyOverseas(false);
    this.mainForm?.get("previousSearchValue").enable({ emitEvent: false });
  }

  super.onFormReady();
}

  // UPDATED METHOD: Enhanced blur event with street type auto-population
  override async onBlurEvent(event): Promise<void> {
    if (event.name == "previousSearchValue") {
      this.searchSvc
        .getExternalAddressDetails(event.value.externalAddressLookupKey)
        .subscribe(async (res) => {
          console.log("External business previous address result:", res);
          const formValues = this.searchSvc.mapAddressJsonToFormControls(
            res.data,
            "previous"
          );

          // Patch form values first - use emitEvent: false to prevent triggering validation subscriptions that cause split errors
          try {
            this.mainForm.form.patchValue(formValues, { emitEvent: false });
          } catch (error) {
            if (error?.message?.includes('Cannot read properties of undefined') && error?.message?.includes('split')) {
              console.warn('BusinessPreviousAddressComponent: Split error when patching form values in onBlurEvent - likely undefined pattern value in validation', error.message);
            } else {
              console.error('BusinessPreviousAddressComponent: Error patching form values in onBlurEvent', error);
            }
          }

          // IMPROVED: Better street type handling with proper timing
          // if (formValues.previousStreetType) {

          // }

          // COMMENTED OUT: Old street type handling method
          /*
          const options = await this.mainForm.fieldProps['previousStreetType'].options;
          this.mainForm.get('previousStreetType').setValue(options?.find(obj=>obj.lookupCode == formValues?.previousStreetType?.toUpperCase())?.value)
          */

          // this.mainForm.get('previousCountry').disable({emitEvent:false});
        });
    }
    await this.updateValidation(event);
  }

override async onValueEvent(event): Promise<void> {
  if (event.name === "previousCity") {
    let locationName = this.mainForm.form.get("previousCity").value;
    let LocationId = this.cityOptionsLocationId.filter(
      (l) => l.name === locationName
    );

    if (LocationId && LocationId.length > 0 && LocationId[0]?.locationId) {
      this.baseSvc.setBaseDealerFormData({
        previousCity: locationName,
        previousCityLocationId: LocationId[0]?.locationId,
      });
    }
  }
  
  await this.updateValidation(event);
}

  async updateValidation(event) {
    // Safety check: ensure mainForm exists
    if (!this.mainForm || !this.mainForm.form) {
      console.warn('BusinessPreviousAddressComponent: mainForm or form not available for validation');
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
      const responses: any = await this.validationSvc.updateValidation(req);
      
      if (!responses.status && responses.updatedFields && responses.updatedFields.length > 0) {
        await this.mainForm.applyValidationUpdates(responses);
      }

      return responses.status;
    } catch (error) {
      // Handle regex pattern errors gracefully - don't break the app
      if (error?.message?.includes('Invalid regular expression') || error?.message?.includes('Range out of order')) {
        console.warn('BusinessPreviousAddressComponent: Invalid regex pattern in validation rules', error.message);
        return true; // Return true to prevent blocking on invalid patterns
      }
      
      // Handle split errors gracefully
      if (error?.message?.includes('Cannot read properties of undefined') && error?.message?.includes('split')) {
        console.warn('BusinessPreviousAddressComponent: Split error in validation - likely undefined pattern value', error.message);
        return true; // Return true to prevent blocking
      }
      
      // For other errors, log but don't throw to prevent breaking the app
      console.error('BusinessPreviousAddressComponent: Validation error', error);
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

    if (this.baseSvc.previousAddressComponentStatus) {
      this.baseSvc.updateComponentStatus(
        "Address Details",
        "BusinessPreviousAddressComponent",
        this.mainForm.form.valid
      ); // this is when previous address component is not hidden
    } else {
      this.baseSvc.updateComponentStatus(
        "Address Details",
        "BusinessPreviousAddressComponent",
        true
      ); // this is when previous address component is hidden
    }

    // this.baseSvc.updateComponentStatus("Address Details", "BusinessPreviousAddressComponent", this.mainForm.form.valid)
    if (this.baseSvc.showValidationMessage) {
      let invalidPages = this.checkStepValidity();
      this.baseSvc.iconfirmCheckbox.next(invalidPages);
    }
  }

  async hiddenfield(country) {
    if (country == "New Zealand") {
      this.mainForm.updateHidden({
        previousStreetArea: false,
        previousUnitType: true,
        previousFloorNumber: true,
        previousFloorType: true,
        previousBuildingName: true,
        previousRuralDelivery: true,
        previousStreetDirection: true,
        previousStreetType: true,
        previousStreetName: true,
        previousStreetNumber: true,
        previousUnitNumber: true,
        previousResidenceType: true,
        previousSearchValue: false,
        previousYear: true,
        year: true,
        previousMonth: true,
        month: true,
      });
    } else {
      this.mainForm.updateHidden({
        previousUnitType: false,
        previousFloorNumber: false,
        previousFloorType: false,
        previousBuildingName: false,
        previousRuralDelivery: false,
        previousStreetDirection: false,
        previousStreetType: false,
        previousStreetName: false,
        previousStreetNumber: false,
        previousUnitNumber: false,
        previousStreetArea: true,
        previousResidenceType: false,
        previousSearchValue: false,
        previousYear: false,
        year: false,
        previousMonth: false,
        month: false,
      });
      await this.updateValidation("onInit");
    }

    this.pathcValue(this.baseFormData);
  }

  private clearAllAddressFields(): void {
  // List of all address fields that need to be cleared
  const addressFields = [
    'previousBuildingName',
    'previousFloorType',
    'previousFloorNumber',
    'previousUnitType',
    'previousUnitNumber',
    'previousStreetNumber',
    'previousStreetName',
    'previousStreetType',
    'previousStreetDirection',
    'previousRuralDelivery',
    'previousSuburbs',
    'previousCity',
    'previousPostcode',
    'previousCountry',
    'previousStreetArea',
    'previousSearchValue',
    'previousSearchCountry',
    'previousYear',
    'previousMonth'
  ];

  // Clear each field by resetting it to empty string
  addressFields.forEach(fieldName => {
    const control = this.mainForm.form.get(fieldName);
    if (control) {
      control.patchValue('', { emitEvent: false });
    }
  });
  
  
}
async hiddenfieldbyOverseas(overseas) {
  if (overseas) {
    // Overseas address is YES - enable country dropdown
    this.mainForm.form.get("previousCountry")?.enable({ emitEvent: false });   
    this.mainForm.updateHidden({
      previousStreetArea: false,
      previousUnitType: true,
      previousFloorNumber: true,
      previousFloorType: true,
      previousBuildingName: true,
      previousRuralDelivery: true,
      previousStreetDirection: true,
      previousStreetType: true,
      previousStreetName: true,
      previousStreetNumber: true,
      previousUnitNumber: true,
      previousResidenceType: true,
      previousYear: false,
      previousMonth: false,
      year: false,
      month: false,
        // previousSearchValue: true
    });

    this.mainForm.get("previousCountry").patchValue("", { emitEvent: true });
    this.baseSvc.setBaseDealerFormData({
      previousCountry: "",
    });
  } else {
    // Overseas address is NO - keep country dropdown enabled
    this.mainForm.form.get("previousCountry")?.enable({ emitEvent: false });    
    this.mainForm.updateHidden({
      previousUnitType: false,
      previousFloorNumber: false,
      previousFloorType: false,
      previousBuildingName: false,
      previousRuralDelivery: false,
      previousStreetDirection: false,
      previousStreetType: false,
      previousStreetName: false,
      previousStreetNumber: false,
      previousUnitNumber: false,
      previousStreetArea: true,
      previousResidenceType: false,
      previousYear: false,
      previousMonth: false,
      year: false,
      month: false,
        // previousSearchValue: false
    });

    this.mainForm
      .get("previousCountry")
      .patchValue("New Zealand", { emitEvent: true });
    this.baseSvc.setBaseDealerFormData({
      previousCountry: "New Zealand",
    });

    await this.updateValidation("onInit");
  }

    // this.pathcValue(this.baseFormData);
  }
}
