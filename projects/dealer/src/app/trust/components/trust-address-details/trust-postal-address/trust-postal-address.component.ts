import { ChangeDetectorRef, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TrustService } from "../../../services/trust.service";
import { BaseTrustClass } from "../../../base-trust.class";
import { Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

import {
  CommonService,
  GenericFormConfig,
  ToasterService,
  ValidationService,
} from "auro-ui";
import { SearchAddressService } from "../../../../standard-quote/services/search-address.service";
import { IndividualService } from "../../../../individual/services/individual.service";

@Component({
  selector: "app-trust-postal-address",
  templateUrl: "./trust-postal-address.component.html",
  styleUrl: "./trust-postal-address.component.scss",
})
export class TrustPostalAddressComponent extends BaseTrustClass {
  optionsdata = [{ label: "icashpro", value: "icp" }];
  privousChecked: any;
  index: any;
  private cityOptionsAll: any[] = [];

  private countryOptions: any[] = [];
  physicalSeachValue: String;
  reusePhysicalSubs: Subscription;
  searchAddressList: any[];
  cityOptionsLocationId: any = [];

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
  cityOptions: any = [];

  override formConfig: GenericFormConfig = {
    // headerTitle: 'Postal Address',
    autoResponsive: true,
    api: "postalAddress",
    cardType: "non-border",
    cardBgColor: "--background-color-secondary",
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
        icon: "fa-solid fa-location-crosshairs fa-lg",
        rightIcon: true,
        // rightIcon:true,
        // icon:"fa-solid fa-location-crosshairs fa-lg",
        // minLength:3,
        nextLine: true,
        // //validators: [Validators.required], // validation Comment
      },

      // {
      //   type: "number",
      //   inputType: "vertical",
      //   label: "Time at address",
      //   name: "postalYear",
      //   maxLength: 2,
      //    className: "col-fixed w-4rem ml-2 white-space-nowrap",
      //   labelClass:'-ml-1',
      //   inputClass: "-mt-2",
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
      //   name: "postalMonth",
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
      // {
      //   type: "text",
      //   label: "Postal Number ",
      //   name: "postalPostalNumber",
      //   className: "lg:col-offset-1 mt-2   pl-1",
      //   cols: 3,
      //   //validators: [Validators.required],
      //   //regexPattern: "[^0-9]*",
      //   nextLine: true,
      // },

      {
        type: "text",
        label: "Building Name",
        name: "postalBuildingName",
        maxLength: 20,
        inputClass: "w-8",
        inputType: "vertical",
        className: " ",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],

        cols: 2,
        nextLine: false,
      },
      {
        type: "select",
        label: "Floor Type",
        name: "postalFloorType",
        labelClass: "w-8 -my-3",
        alignmentType: "vertical",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],

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
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
        className: " ",
        inputType: "vertical",
        inputClass: "w-8",
        cols: 2,
        maxLength: 5,
      },
      {
        type: "select",
        label: "Unit Type",
        name: "postalUnitType",
        labelClass: "w-8 -my-3",
        alignmentType: "vertical",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
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
        // //validators: [Validators.pattern(/^[A-Za-z0-9\-\/]*$/)],
        textAreaRows: 4,
        className: "mb-1 mt-1",
        cols: 12,
        hidden: true,
        nextLine: true,
      },
      {
        type: "text",
        label: "Unit/Lot Number",
        name: "postalUnitNumber",
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
        name: "postalStreetNumber",
        //regexPattern: "[^0-9]*",
        //validators: [Validators.required],
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
        // validators: [
        //   Validators.required,
        //   Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/),
        // ],
        className: "",
        inputClass: "w-8",
        inputType: "vertical",
        cols: 2,
        nextLine: false,
      },
      {
        type: "select",
        label: "Street Type",
        name: "postalStreetType",
        labelClass: "w-8 -my-3",
        alignmentType: "vertical",
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
        name: "postalStreetDirection",
        // validators: [
        //   Validators.required,
        //   Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/),
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
        name: "postalRuralDelivery",
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
        name: "postalSuburbs",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
        className: " ",
        inputClass: "w-8",
        inputType: "vertical",
        cols: 2,
        maxLength: 20,
        nextLine: false,
      },
      {
        type: "select",
        label: "City",
        name: "postalCity",
        // validators: [
        //   Validators.required,
        //   Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/),
        // ],
        inputClass: "w-8",
        labelClass: "w-8 -my-3",
        alignmentType: "vertical",
        className: "px-0 customLabel",
        cols: 2,
        options: this.cityOptions,
        nextLine: false,
      },
      {
        type: "text",
        label: "Postcode",
        //validators: [Validators.required],
        name: "postalPostcode",
        inputClass: "w-8",
        inputType: "vertical",
        className: " ",
        cols: 2,
        maxLength: 10,
        //regexPattern: "[^0-9]*",
        nextLine: false,
      },
      {
        type: "select",
        label: "Country",
        name: "postalCountry",
        labelClass: "w-8 -my-3",
        alignmentType: "vertical",
        //validators: [Validators.required],
        className: "px-0 customLabel",

        cols: 2,
        // list$: "LookUpServices/locations?LocationType=country",
        // idKey: "name",
        // idName: "name",
        options: [],
        nextLine: false,
      },
    ],
  };

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override trustSvc: TrustService,
    private toasterService: ToasterService,
    public validationSvc: ValidationService,
    public searchSvc: SearchAddressService,
    public cdr: ChangeDetectorRef,
    private indSvc: IndividualService
  ) {
    super(route, svc, trustSvc);
  }

override async ngOnInit(): Promise<void> {
  await super.ngOnInit();

  if (this.trustSvc.showValidationMessage) {
    this.mainForm.form.markAllAsTouched();
  }

    // this.updateDropdownData();
  this.trustSvc.reusePhysical.subscribe(async (data) => {
    if (data == "copied" && this.mainForm) {
      if (this.baseFormData.physicalCountry != "New Zealand") {
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
        await this.updateValidation("onInit");
      }
      this.fields.forEach((field) => {
        const postalField = this.mainForm.form.get(`postal${field}`);
        const physicalFieldValue = this.baseFormData[`physical${field}`];
        if (
          postalField &&
          postalField.value !== physicalFieldValue &&
          physicalFieldValue
        ) {
          postalField.enable();
          postalField.patchValue(physicalFieldValue);
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
      await this.updateValidation("onInit");
      const currentAddressType = this.mainForm.form.get("postalAddressType")?.value || "po";
      
      //Reset all fields except country and postalAddressType
      Object.keys(this.mainForm.form.controls).forEach(key => {
        if (key !== 'postalCountry' && key !== 'postalAddressType') {
          this.mainForm.form.get(key).reset();
        }
      });
      
      // Set country based on address type after reset
      if (currentAddressType === 'street') {
        this.mainForm.form.get('postalCountry').patchValue('New Zealand');
        this.mainForm.form.get('postalCountry').disable({ emitEvent: false });
      } else {
        // For 'po' type, keep country enabled but set to New Zealand
        this.mainForm.form.get('postalCountry').patchValue('New Zealand');
        this.mainForm.form.get('postalCountry').enable({ emitEvent: false });
      }      
      this.physicalSeachValue = null;
    }
  });

  if (this.baseFormData?.postalCountry) {
    if (
      this.baseFormData?.postalCountry != "New Zealand" &&
      this.baseFormData?.postalCountry
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

  if (!this?.mainForm?.get("postalCountry")?.value) {
    this?.mainForm?.get("postalCountry")?.patchValue("New Zealand");
    this.baseFormData.postalCountry = "New Zealand";
  }

  this.indSvc.updateDropdownData().subscribe((result) => {
    this.mainForm.updateList("postalFloorType", result?.floorType);
    this.mainForm.updateList("postalUnitType", result?.unitType);
    this.mainForm.updateList("postalStreetType", result?.streetType);

    if (result?.country) {
      this.mainForm.updateList("postalCountry", result?.country);
      this.mainForm?.form?.get("postalCountry")?.setValue("New Zealand");
      this.mainForm.updateList("postalCity", result?.city);
    }
  });

  //  Update layout based on saved postalAddressType value
  const savedAddressType = this.baseFormData?.postalAddressType || this.mainForm.form.get("postalAddressType")?.value || "po";
  
  if (savedAddressType === "po") {
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
    //Enable country dropdown for PO Box
    this.mainForm.form.get('postalCountry')?.enable({ emitEvent: false });
  } else if (savedAddressType === "street") {
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
    //Disable country dropdown for Street and set to New Zealand
    this.mainForm.form.get('postalCountry')?.patchValue('New Zealand');
    this.mainForm.form.get('postalCountry')?.disable({ emitEvent: false });
  }
  
  // Trigger change detection to ensure UI updates
  this.cdr.detectChanges();
}


  // NEW METHOD: Add street type handling method for trust postal address
  async setStreetType(streetTypeValue: string) {
    try {
      // Ensure street type options are loaded - using fieldProps for trust component as shown in original onBlurEvent
      const streetTypeOptions =
        this.mainForm?.fieldProps?.["postalStreetType"]?.options;

      if (!streetTypeOptions || streetTypeOptions.length === 0) {
        console.warn(
          "Trust postal street type options not loaded yet, retrying..."
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
          .get("postalStreetType")
          .patchValue(matchedOption.value || matchedOption.label);
      } else {
      }
    } catch (error) {
      console.error("Error setting trust postal street type:", error);
    }
  }

  async updateDropdownData() {
    await this.baseSvc.getFormData(
      `LookUpServices/custom_lookups?LookupSetName=FloorType`,
      (res) => {
        let list = res.data;
        const floorTypeList = list.map((item) => ({
          label: item.lookupValue,
          value: item.lookupValue,
        }));
        this.mainForm.updateList("postalFloorType", floorTypeList);
        return floorTypeList;
      }
    );

    await this.baseSvc.getFormData(
      `LookUpServices/custom_lookups?LookupSetName=UnitType`,
      (res) => {
        let list = res.data;
        const unitTypeList = list.map((item) => ({
          label: item.lookupValue,
          value: item.lookupValue,
        }));
        this.mainForm.updateList("postalUnitType", unitTypeList);
        return unitTypeList;
      }
    );

    // Load Street Type
    await this.baseSvc.getFormData(
      `LookUpServices/custom_lookups?LookupSetName=StreetType`,
      (res) => {
        let list = res.data;
        const streetTypeList = list.map((item) => ({
          label: item.lookupValue,
          value: item.lookupValue,
          lookupCode: item.lookupCode,
        }));
        this.mainForm.updateList("postalStreetType", streetTypeList);
        return streetTypeList;
      }
    );

    await this.baseSvc.getFormData(
      `LookUpServices/locations?LocationType=country`,
      (res) => {
        let list = res.data;
        const countryList = list.map((item) => ({
          label: item.name,
          value: item.name,
        }));

      this.mainForm.updateList("postalCountry", countryList);

return countryList;

      }
    );

    await this.getCities();
  }
  override title: string = "Address Details";
  // override title: string = 'Address Details';

 

  override async onValueTyped(event: any): Promise<void> {
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
      if (event.data != "New Zealand" && event.data) {
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
        //await this.updateValidation("onInit");
      }
    }
    await this.updateValidation("onInit");
  }
  tempCity = null;
override async onFormEvent(event: any): Promise<void> {
  if (event.name === "postalCity") {
    let locationName = this.mainForm.form.get("postalCity").value;
    let checkSessionLocationId = JSON.parse(sessionStorage.getItem("LookUpServices/locations?LocationType=City"))
    if(checkSessionLocationId && this.cityOptionsLocationId.length == 0){
      this.cityOptionsLocationId = checkSessionLocationId.data;
    }
    let LocationId = this.cityOptionsLocationId.filter(
      (l) => l.name === locationName
    );

    this.baseSvc.setBaseDealerFormData({
      postalCityLocationId: LocationId[0]?.locationId,
    });
   
  }

  if (event?.name == "postalCountry" && event?.value) {
    if (event?.value != this.tempCity) {
      this.getCities();
    }
    this.tempCity = event?.value;
  }

  if (event.name == "postalAddressType") {
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
        postalType: true,
        postalNumber: true,
      });
      // NEW: Enable country dropdown for PO Box
      this.mainForm.form.get('postalCountry')?.enable({ emitEvent: false });
      this.mainForm.form.get('postalCountry')?.patchValue('New Zealand');
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
      //  NEW: Disable country dropdown for Street and set to New Zealand
      this.mainForm.form.get('postalCountry')?.patchValue('New Zealand');
      this.mainForm.form.get('postalCountry')?.disable({ emitEvent: false });
    }
    await this.updateValidation("onInit");
  }

  super.onFormEvent(event);
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

            // Store the filtered options
            this.cityOptions = filteredCities;
            this.cityOptionsLocationId = obj;

            this.cityOptions = filteredCities;
this.mainForm.updateList("postalCity", filteredCities);

          }
        }
      );
    }
  }

  override onValueChanges(event: any) {
    if (event.postalSearchValue && event.postalSearchValue.length >= 4) {
      this.searchSvc.searchAddress(event.postalSearchValue).subscribe((res) => {
        this.searchAddressList = res;
        this.mainForm.updateList("postalSearchValue", this.searchAddressList);
      });
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

      // NEW: Add street type handling (only for street address type)
      if (
        data.streetType &&
        this.mainForm.get("postalAddressType")?.value === "street"
      ) {
        setTimeout(async () => {
          await this.setStreetType(data.streetType);
        }, 200);
      }

      if (data.country)
        this.mainForm.get("postalCountry").patchValue(data.country);
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
        await this.updateValidation("onInit");
      }
    }
  }
  pageCode: string = "TrustAddressDetailsComponent";
  modelName: string = "TrustPostalAddressComponent";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
  }

  // UPDATED METHOD: Enhanced blur event with street type auto-population
  override async onBlurEvent(event): Promise<void> {
    if (event.name == "postalSearchValue") {
      // if(event.data && event.data.length >= 4){
      this.searchSvc
        .getExternalAddressDetails(event.value.externalAddressLookupKey)
        .subscribe(async (res) => {
          // console.log("External trust postal address result:", res);
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

          //  this.mainForm.get('postalCountry').disable({emitEvent:false});
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
    this.trustSvc.updateComponentStatus(
      "Address Details",
      "TrustPostalAddressComponent",
      this.mainForm.form.valid
    );

    if (this.trustSvc.showValidationMessage) {
      let invalidPages = this.checkStepValidity();
      this.trustSvc.iconfirmCheckbox.next(invalidPages);
    }
  }
  override async onSuccess(data: any) {}
override async onFormDataUpdate(res: any): Promise<void> {
  if (
    this.baseFormData?.physicalreuseOfPostalAddress !==
    res?.physicalreuseOfPostalAddress
  ) {
    const isNz = res.physicalCountry === "New Zealand";

    this.mainForm.form
      .get("postalAddressType")
      .patchValue(isNz ? "street" : "po");
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
        }
      });
      this.mainForm.form.get("postalAddressType").patchValue("street");  
      //  NEW: Set country and disable it for street type
      this.mainForm.form.get('postalCountry')?.patchValue('New Zealand');
      this.mainForm.form.get('postalCountry')?.disable({ emitEvent: false });
    } else {
      if (!this.baseFormData?.physicalreuseOfPostalAddress) {
        //  NEW: Get current address type before reset
        const currentAddressType = this.mainForm.form.get("postalAddressType")?.value || "po";      
        // Reset all fields except country and postalAddressType
        Object.keys(this.mainForm.form.controls).forEach(key => {
          if (key !== 'postalCountry' && key !== 'postalAddressType') {
            this.mainForm.form.get(key).reset();
          }
        });       
        this.mainForm.form.get("postalAddressType").patchValue("po");
        //  NEW: Enable country for PO Box type
        this.mainForm.form.get('postalCountry')?.patchValue('New Zealand');
        this.mainForm.form.get('postalCountry')?.enable({ emitEvent: false });
      }
    }

    this.cdr.detectChanges();
  }
}
}
