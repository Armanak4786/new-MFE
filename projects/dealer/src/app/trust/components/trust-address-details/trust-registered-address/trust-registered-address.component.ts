import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  CommonService,
  GenericFormConfig,
  ToasterService,
  ValidationService,
} from "auro-ui";
import { Validators } from "@angular/forms";
import { BaseTrustClass } from "../../../base-trust.class";
import { TrustService } from "../../../services/trust.service";
import { SearchAddressService } from "../../../../standard-quote/services/search-address.service";
import { IndividualService } from "../../../../individual/services/individual.service";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-trust-registered-address",
  templateUrl: "./trust-registered-address.component.html",
  styleUrl: "./trust-registered-address.component.scss",
})
export class TrustRegisterAddressComponent extends BaseTrustClass {
  optionsdata = [{ label: "icashpro", value: "icp" }];
  privousChecked: any;
  searchAddressList: any[];
  private cityOptionsAll: any[] = [];

  cityOptions: any = [];
  cityOptionsLocationId: any = [];
  private countryOptions: any[] = [];
  override formConfig: GenericFormConfig = {
    autoResponsive: true,
    api: "registeredAddress",
    goBackRoute: "registeredAddress",
    cardBgColor: "--background-color-secondary",
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
        labelClass: "w-8 -my-3",
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
        disabled:true
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

  //  Subscribe with proper reset logic that preserves country
  this.trustSvc.reusePhysicalAsRegister.subscribe((data) => {
    if (data == "copied" && this.mainForm) {
      this.fields.forEach((field) => {
        const registerField = this.mainForm.form.get(`register${field}`);
        const physicalFieldValue = this.baseFormData[`physical${field}`];
        if (
          registerField &&
          registerField.value !== physicalFieldValue &&
          physicalFieldValue
        ) {
          registerField.enable();
          registerField.patchValue(physicalFieldValue);
        }
      });
    } else if (data == "undoCopy" && this.mainForm) {
      //  Reset all fields except country
      Object.keys(this.mainForm.form.controls).forEach(key => {
        if (key !== 'registerCountry') {
          this.mainForm.form.get(key).reset();
        }
      });
    }
  });
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
  ];

  override async onSuccess(data: any) {}

  override onFormDataUpdate(res: any): void {
    if (
      this.baseFormData?.physicalreuseOdfRegisterAddress !=
      res?.physicalreuseOdfRegisterAddress
    ) {
      this.fields.forEach((field) => {
        // console.log(field, res[`physical${field}`], this.mainForm.form.get(`register${field}`).value);

        if (
          this.mainForm.form.get(`register${field}`) &&
          this.mainForm.form.get(`register${field}`).value !=
            res[`physical${field}`] &&
          res[`physical${field}`]
        ) {
          if (field == "PostCode") {
            // console.log(res[`physical${field}`]);
          }
          this.updateDisableValue({
            key: `register${field}`,
            value: res[`physical${field}`],
          });
          this.mainForm.form.get(`register${field}`).enable();
          this.mainForm.form
            .get(`register${field}`)
            .patchValue(res[`physical${field}`]);
        }
      });
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

      if (data.country)
        this.mainForm.get("registerCountry").patchValue(data.country);
      if (data.postcode)
        this.mainForm.get("registerPostcode").patchValue(data.postcode);
      if (data.city) this.mainForm.get("registerCity").patchValue(data.city);
      if (data.street)
        this.mainForm.get("registerStreetName").patchValue(data.street);
      if (data.suburb)
        this.mainForm.get("registerSuburbs").patchValue(data.suburb);
    }
  }

  tempCity = null;
override onFormEvent(event: any): void {
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



}
