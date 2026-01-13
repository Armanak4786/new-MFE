import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  CommonService,
  GenericFormConfig,
  ToasterService,
  ValidationService,
} from "auro-ui";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SoleTradeService } from "../../../services/sole-trade.service";
import { BaseSoleTradeClass } from "../../../base-sole-trade.class";
import { SearchAddressService } from "../../../../standard-quote/services/search-address.service";
import { IndividualService } from "../../../../individual/services/individual.service";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-sole-trade-previous-address",
  templateUrl: "./sole-trade-previous-address.component.html",
  styleUrl: "./sole-trade-previous-address.component.scss",
})
export class SoleTradePreviousAddressComponent extends BaseSoleTradeClass {
  optionsdata = [{ label: "icashpro", value: "icp" }];

  @Input() copyToPreviousAddress = false;
  flag: boolean = false;
  index: number;
  private countryOptions: any[] = [];
  private cityOptionsAll: any[] = [];
  previousSearchValue: String;
  customerRoleForm: FormGroup;
  searchAddressList: any;
  cityOptions: any = [];
  cityOptionsLocationId: any = [];
  // pageCode: string = "SoleTradeAddressDetailsComponent";
  // modelName: string = "SoleTradePreviousAddressComponent";
  pageCode: string = "SoleTradeAddressDetailsComponent";
  modelName: string = "SoleTradePreviousAddressComponent";

override formConfig: GenericFormConfig = {
  headerTitle: "Previous Physical Address",
  autoResponsive: true,
  cardType: "non-border",
  cardBgColor: "--background-color-secondary",
  api: "",
  goBackRoute: "",
  fields: [
    {
      type: "autoSelect",
        //placeholder: "Search",
      name: "previousSearchValue",
      label: "Search",
      idKey: "street",
      cols: 2,
      options: [],
      className: "my-1",
      rightIcon: true,
      icon: "fa-solid fa-location-crosshairs fa-lg ",
      minLength: 3,
      nextLine: false,
        // //validators: [Validators.required], // validation Comment
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
      nextLine: true,
      default: false,
    },
      // {
      //   className: "mt-2 ",
      //   type: "select",
      //   label: "Residence Type ",
      //   name: "previousResidenceType",
      //   filter: true,
      //   cols: 3,
      //   //validators: [Validators.required],
      //   nextLine: false,
      //   list$: "LookUpServices/lookups?LookupSetName=PropertyResidenceType",
      //   idKey: "lookupValue",
      //   idName: "lookupValue",
      // },

      // {
      //   type: "number",
      //   inputType: "vertical",
      //   label: "Time at address",
      //   name: "previousYear",
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
      //   name: "previousMonth",
      //   maxLength: 2,
      //   // validators: [Validators.max(11)],   -- Auro
      //   errorMessage: "Value should be less than 12",
      //   className: "pt-3 col-fixed w-4rem yearmonthClass",
      // },
      // {
      //   type: "label-only",
      //   typeOfLabel: "inline",
      //   label: "Months",
      //   name: "month",
      //   className: "mt-3 pt-3 col-fixed w-4rem",
      //   nextLine: true,
      // },


   
    {
      type: "number",
      inputType: "vertical",
      label: "Time at Address",
      name: "previousYear",
      maxLength: 2,
      className: "col-fixed w-4rem ml-0",
      inputClass: "",
      labelClass: "white-space-nowrap",
        // validators: [Validators.required, Validators.min(1)],  -- Auro
    },
    {
      type: "label-only",
      typeOfLabel: "inline",
      label: "Years",

      name: "year",
      className: "mt-4 pt-3 col-fixed w-4rem",
    },
    {
      type: "number",
      inputType: "vertical",
      name: "previousMonth",
      maxLength: 2,
      inputClass: "",
        // validators: [Validators.max(11)],   -- Auro
      errorMessage: "Value should be less than 12",
      className: "mt-3 col-fixed w-4rem yearmonthClass",
    },
    {
      type: "label-only",
      typeOfLabel: "inline",
      label: "Months",
      name: "month",
      className: "mt-4 pt-3 col-fixed w-4rem",
      nextLine: true,   
    },
    {
      type: "text",
      label: "Building Name",
      name: "previousBuildingName",
      className: " ",
      maxLength: 20,
      inputClass: "w-8",
      inputType: "vertical",
      cols: 2,
      nextLine: false,
    },
    {
      type: "select",
      label: "Floor Type",
      name: "previousFloorType",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
      className: "px-0 customLabel",
      labelClass: "w-8 -my-3",
      alignmentType: "vertical",
      cols: 2,
        // list$: "LookUpServices/custom_lookups?LookupSetName=FloorType",
        // idKey: "lookupValue",
        // idName: "lookupValue",
      options: [],
      nextLine: false,
    },

    {
      type: "text",
      label: "Floor Number",
      name: "previousFloorNumber",
        //validators: [Validators.pattern(/^[A-Za-z0-9\-\/]*$/)],
      className: " ",
      cols: 2,
      inputClass: "w-8",
      inputType: "vertical",
      maxLength: 5,
      nextLine: false,
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
      labelClass: "w-8 -my-3",
      alignmentType: "vertical",
      nextLine: true,
    },
    {
      type: "textArea",
      label: "Address",
      name: "previousStreetArea",
        //validators: [Validators.pattern(/^[A-Za-z0-9\-\/]*$/)],
      textAreaRows: 4,
      className: "mb-1",
      rows: 1,
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
      inputClass: "w-8",
      inputType: "vertical",
      cols: 2,
      nextLine: false,
    },
    {
      type: "text",
      label: "Street Number",
      name: "previousStreetNumber",
      inputClass: "w-8",
      inputType: "vertical",
        // validators: [
        //   Validators.required,
        //   Validators.pattern(/^[A-Za-z0-9\-\/]*$/),
        // ],
      className: " ",
      maxLength: 20,
      cols: 2,
      nextLine: false,
    },

    {
      type: "text",
      label: "Street Name",
      name: "previousStreetName",
      inputClass: "w-8",
      inputType: "vertical",
        // validators: [
        //   Validators.required,
        //   Validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/),
        // ],
      className: "",
      cols: 2,
      nextLine: false,
    },
    {
      type: "select",
      label: "Street Type",
      name: "previousStreetType",
        //validators: [Validators.required],
      className: "px-0 customLabel",
      filter: true,
      cols: 2,
      nextLine: false,
      labelClass: "w-8 -my-3",
      alignmentType: "vertical",
        // list$: "LookUpServices/custom_lookups?LookupSetName=StreetType",
        // idKey: "lookupValue",
        // idName: "lookupValue",
      options: [],
    },

    {
      type: "text",
      label: "Street Direction",
      name: "previousStreetDirection",
        // validators: [
        //   Validators.required,
        //   Validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/),
        // ],
      className: "",
      inputClass: "w-8",
      inputType: "vertical",
      cols: 2,
      nextLine: false,
    },
    {
      type: "text",
      label: "Rural Delivery",
      name: "previousRuralDelivery",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
      className: "",
      inputClass: "w-8",
      inputType: "vertical",
      cols: 2,
      nextLine: true,
    },
    {
      type: "text",
      label: "Suburb",
      name: "previousSuburbs",
      inputClass: "w-8",
      inputType: "vertical",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
      className: "",
      cols: 2,
      maxLength: 20,

      nextLine: false,
    },
    {
      type: "select",
      label: "City",
      labelClass: "w-8 -my-3",
      alignmentType: "vertical",
      name: "previousCity",
      className: "px-0 customLabel",
      options: this.cityOptions,
      cols: 2,
      nextLine: false,
    },
    {
      type: "text",
      label: "Postcode",
      name: "previousPostcode",
        //validators: [Validators.required],
      className: "",
      inputClass: "w-8",
      inputType: "vertical",
      maxLength: 10,
      cols: 2,
      nextLine: false,
    },
    {
      type: "select",
      label: "Country",
      name: "previousCountry",
        //validators: [Validators.required],
      className: "px-0 customLabel",
      filter: true,
      cols: 2,
        // list$: "LookUpServices/locations?LocationType=country",
        // idKey: "name",
      alignmentType: "vertical",
      labelClass: "w-8 -my-3",
        // idName: "name",
      options: [],
      default: "New Zealand",
      nextLine: false,
    },
    {
      type: "text",
      label: "previousSearchCountry",
      maxLength: 20,
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

  // override title: string = 'Address Details';

  // NEW METHOD: Add street type handling method for sole trade previous address
  async setStreetType(streetTypeValue: string) {
    try {
      // Ensure street type options are loaded - using fieldProps for sole trade component as shown in original onBlurEvent
      const streetTypeOptions =
        this.mainForm?.fieldProps?.["previousStreetType"]?.options;

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
          .get("previousStreetType")
          .patchValue(matchedOption.value || matchedOption.label);
      }
    } catch (error) {}
  }

override async ngOnInit(): Promise<void> {
  await super.ngOnInit();

  if (this.baseSvc.showValidationMessage) {
    this.mainForm.form.markAllAsTouched();
  }

  this.indSvc.updateDropdownData().subscribe((result) => {
    this.mainForm.updateList("previousFloorType", result?.floorType);
    this.mainForm.updateList("previousUnitType", result?.unitType);
    this.mainForm.updateList("previousStreetType", result?.streetType);
    if (result?.country) {
      this.mainForm.updateList("previousCountry", result?.country);
      this.mainForm?.form?.get("previousCountry")?.setValue("New Zealand");
      this.mainForm.updateList("previousCity", result?.city);

    }
  });

  this.customerRoleForm = this.fb.group({
    previousSearchValue: ["", Validators.required],
  });
  this.baseSvc.reusePhysicalAsPrevious.subscribe(async (data) => {
    if (data == "copied" && this.mainForm) {
      const isNz = this.baseFormData?.physicalCountry === "New Zealand";

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
      });
      await this.updateValidation("onInit");
      this.pathcValue(this.baseFormData);
    } else if (data == "undoCopy" && this.mainForm) {
      this.mainForm.form.reset();
    }
  });

  if (this.mainForm.form.get("overseasAddress").value) {
    this.hiddenfield(this.baseFormData?.physicalCountry || "New Zealand");
  } else {
    this.hiddenfield("");
  }
}
private clearAllAddressFields(): void {
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

  addressFields.forEach(fieldName => {
    const control = this.mainForm.form.get(fieldName);
    if (control) {
      control.patchValue('', { emitEvent: false });
    }
  });
}

  tempCity = null;
  override async onFormEvent(event: any): Promise<void> {
    if (event.name === "previousCity") {
      let locationName = this.mainForm.form.get("previousCity").value;
      let LocationId = this.cityOptionsLocationId.filter(
        (l) => l.name === locationName
      );

      this.baseSvc.setBaseDealerFormData({
        previousCityLocationId: LocationId[0]?.locationId,
      });
     
    }
  if (event.name === "previousCountry" && event?.value) {
  if (event?.value != this.tempCity) {
    this.getCities();
  }
  this.tempCity = event?.value;
}


    await super.onFormEvent(event);
  }

  // async updateDropdownData() {
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
  //         this.mainForm?.form?.get("previousCountry")?.value ||
  //         this.baseFormData?.previousCountry ||
  //         "New Zealand";

  //       // Sort with selected country at top
  //       const sortedCountryList = this.sortOptionsWithSelectedOnTop(
  //         countryList,
  //         selectedCountry
  //       );

  //       this.mainForm.updateList("previousCountry", sortedCountryList);

  //       return sortedCountryList;
  //     }
  //   );

  //   await this.baseSvc.getFormData(
  //     `LookUpServices/custom_lookups?LookupSetName=StreetType`,
  //     (res) => {
  //       let list = res.data;

  //       const streetTypeList = list.map((item) => ({
  //         label: item.lookupValue,
  //         value: item.lookupValue,
  //         lookupCode: item.lookupCode,
  //       }));

  //       this.mainForm.updateList("previousStreetType", streetTypeList);

  //       return streetTypeList;
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

  //       this.mainForm.updateList("previousFloorType", floorTypeList);

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

  //       this.mainForm.updateList("previousUnitType", unitTypeList);

  //       return unitTypeList;
  //     }
  //   );

  //   await this.getCities();
  // }

override async onFormReady(): Promise<void> {
  await this.updateValidation("onInit");
  if (this.baseFormData.overseasAddress) {
    this.hiddenfieldbyOverseas(this.baseFormData.overseasAddress);
    this.mainForm?.get("previousSearchValue").disable();
  } else {
    // NEW: When overseas is false, disable country and set to New Zealand
    const countryControl = this.mainForm.form.get("previousCountry");
    if (countryControl) {
      countryControl.patchValue("New Zealand", { emitEvent: false });
      countryControl.disable({ emitEvent: false });
    }
  }
  if (this.baseFormData?.addressDetails?.length) {
    this.mainForm
      .get("previousStreetArea")
      ?.patchValue(this.baseFormData?.addressDetails[3]?.street);
  }

  super.onFormReady();
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
      this.mainForm?.form?.reset();
    }
    this.cdr.detectChanges();
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

  // UPDATED METHOD: Enhanced place selection with street type auto-population
  async placeSelected(event: any, index: number) {
    if (event.properties) {
      const data = event.properties;

      // NEW: Add street type handling
      if (data.streetType) {
        setTimeout(async () => {
          await this.setStreetType(data.streetType);
        }, 200);
      }

      if (data.country)
        this.mainForm.get("previousCountry").patchValue(data.country);
      this.mainForm.get("previousSearchCountry").patchValue(data.country);
      if (data.postcode)
        this.mainForm.get("previousPostcode").patchValue(data.postcode);
      if (data.city) this.mainForm.get("previousCity").patchValue(data.city);
      if (data.street)
        this.mainForm.get("previousStreetName").patchValue(data.street);
      if (data.suburb)
        this.mainForm.get("previousSuburbs").patchValue(data.suburb);

      if (data.country != "New Zealand") {
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
          previousYear: true,
          previousMonth: true,
          month: true,
          year: true,
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
          previousYear: false,
          previousMonth: false,
          month: false,
          year: false,
        });
        await this.updateValidation("onInit");
      }
    }
  }
  override async onSuccess(data: any) {}

  override onFormDataUpdate(res: any): void {
    // if (
    //   this.baseFormData?.copyToPreviousAddress != res?.copyToPreviousAddress
    // ) {
    //   const fields = [
    //     "Search",
    //     "BuildingName",
    //     "City",
    //     "Year",
    //     "Month",
    //     "Lot",
    //     "Country",
    //     "FloorType",
    //     "Postcode",
    //     "ResidenceType",
    //     "RuralDelivery",
    //     "StreetDirection",
    //     "StreetName",
    //     "StreetNumber",
    //     "StreetType",
    //     "Suburb",
    //     "TimeAtAddress",
    //     "UnitNumber",
    //     "Attention",
    //   ];
    //   fields.forEach((field) => {
    //     if (
    //       this.mainForm.form.get(`previous${field}`) &&
    //       this.mainForm.form.get(`previous${field}`).value !=
    //         res[`physical${field}`] &&
    //       res[`physical${field}`]
    //     ) {
    //       this.updateDisableValue({
    //         key: `previous${field}`,
    //         value: res[`physical${field}`],
    //       });
    //       this.mainForm.form.get(`previous${field}`).enable();
    //     }
    //   });
    // }
  }
override async onValueTyped(event: any): Promise<void> {
  if (event.name === "previousCity") {
    let locationName = this.mainForm.form.get("previousCity").value;
    let LocationId = this.cityOptionsLocationId.filter(
      (l) => l.name === locationName
    );

    this.baseSvc.setBaseDealerFormData({
      previousCityLocationId: LocationId[0]?.locationId,
    });
  }

  if (event.name == "overseasAddress") {
    this.clearAllAddressFields();
    const countryControl = this.mainForm.form.get("previousCountry");    
    if (event.data) {
      // Overseas is YES (true) - enable country dropdown, clear country value
      this.hiddenfieldbyOverseas(true);
      this.mainForm.get("previousSearchValue").disable();

      // Enable country dropdown for overseas addresses
      if (countryControl) {
        countryControl.enable({ emitEvent: false });
      }

      // Changing "City" dropdown to text input field
      this.mainForm.updateProps("previousCity", {
        type:'text',
        inputType:'vertical',
        inputClass: "w-8",
        cols: 2,
        labelClass:"",
        className:''
      });
    } else {
      // Overseas is NO (false) - disable country dropdown, set to New Zealand
      this.hiddenfieldbyOverseas(false);
      this.mainForm.get("previousSearchValue").enable();

      // Disable country dropdown and set to New Zealand
      if (countryControl) {
        countryControl.patchValue("New Zealand", { emitEvent: false });
        countryControl.disable({ emitEvent: false });
      }
      this.baseSvc.setBaseDealerFormData({
        previousCountry: "New Zealand",
      });

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
    }
  }

  await this.updateValidation("onInit");
}

  override onValueChanges(event: any): void {
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
  async getCities() {
    const selectedCountry =
      this.mainForm?.form.get("previousCountry")?.value || "New Zealand";

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
this.mainForm.updateList("previousCity", filteredCities);

          }
        }
      );
    }
  }

  // UPDATED METHOD: Enhanced blur event with street type auto-population
  override async onBlurEvent(event): Promise<void> {
    // await this.updateValidation(event);
    if (event.name == "previousSearchValue") {
      // if(event.data && event.data.length >= 4){
      this.searchSvc
        .getExternalAddressDetails(event.value.externalAddressLookupKey)
        .subscribe(async (res) => {
          const formValues = this.searchSvc.mapAddressJsonToFormControls(
            res.data,
            "previous"
          );

          // Patch form values first
          this.mainForm.form.patchValue(formValues);

          // IMPROVED: Better street type handling with proper timing
          // if (formValues.previousStreetType) {
          //   setTimeout(async () => {
          //     await this.setStreetType(formValues.previousStreetType);
          //   }, 300);
          // }

          // COMMENTED OUT: Old street type handling method
          /*
        const options = await this.mainForm.fieldProps['previousStreetType'].options;
        this.mainForm.get('previousStreetType').setValue(options?.find(obj=>obj.lookupCode == formValues?.previousStreetType?.toUpperCase())?.value)
        */

          // this.mainForm.get('previousCountry').disable({emitEvent:false});
        });
      // }
    }
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
        // previousSearchValue: true
        previousYear: true,
        previousMonth: true,
        year: true,
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
        // previousSearchValue: false,
        previousYear: false,
        previousMonth: false,
        year: false,
        month: false,
      });
      await this.updateValidation("onInit");
    }

    // this.pathcValue(this.baseFormData);
  }

async hiddenfieldbyOverseas(overseas) {
  const countryControl = this.mainForm.form.get("previousCountry");
  if (overseas) {
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
    });
    // Enable country dropdown for overseas addresses
    if (countryControl) {
      countryControl.patchValue("", { emitEvent: false });
      countryControl.enable({ emitEvent: false });
    }
    
    this.baseSvc.setBaseDealerFormData({
      previousCountry: "",
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
      previousYear: false,
      previousMonth: false,
      year: false,
      month: false,
        // previousSearchValue: false
    });
    // Disable country dropdown and set to New Zealand
    if (countryControl) {
      countryControl.patchValue("New Zealand", { emitEvent: false });
      countryControl.disable({ emitEvent: false });
    }
    
    this.baseSvc.setBaseDealerFormData({
      previousCountry: "New Zealand",
    });

    await this.updateValidation("onInit");
  }

    // this.pathcValue(this.baseFormData);
}

  override onStepChange(stepperDetails: any): void {
    super.onStepChange(stepperDetails);

    if (this.baseSvc.previousAddressComponentStatus) {
      this.baseSvc.updateComponentStatus(
        "Address Details",
        "SoleTradePreviousAddressComponent",
        this.mainForm.form.valid
      ); // this is when previous address component is hidden
    } else {
      this.baseSvc.updateComponentStatus(
        "Address Details",
        "SoleTradePreviousAddressComponent",
        true
      ); // this is when previous address component is not hidden
    }
    // this.baseSvc.updateComponentStatus("Address Details", "SoleTradePreviousAddressComponent", this.mainForm.form.valid)

    if (this.baseSvc.showValidationMessage) {
      let invalidPages = this.checkStepValidity();
      this.baseSvc.iconfirmCheckbox.next(invalidPages);
    }
  }
}
