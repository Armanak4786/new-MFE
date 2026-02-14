import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  CommonService,
  GenericFormConfig,
  Mode,
  ToasterService,
  ValidationService,
} from "auro-ui";
import { BaseTrustClass } from "../../../base-trust.class";
import { TrustService } from "../../../services/trust.service";
import { SearchAddressService } from "../../../../standard-quote/services/search-address.service";
import { IndividualService } from "../../../../individual/services/individual.service";

@Component({
  selector: "app-trust-previous-address",
  templateUrl: "./trust-previous-address.component.html",
  styleUrl: "./trust-previous-address.component.scss",
})
export class TrustPreviousAddressComponent extends BaseTrustClass {
  optionsdata = [{ label: "icashpro", value: "icp" }];
  searchAddressList: any[];
  cityOptions: any = [];
  cityOptionsLocationId: any = [];
  private countryOptions: any[] = [];
override formConfig: GenericFormConfig = {
  headerTitle: "Previous Physical Address",
  autoResponsive: true,
  api: "",
  // goBackRoute: '',
  //cardBgColor: "--background-color-secondary",
  cardType: "border",
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
    //   type: 'checkbox',
    //   label: 'Create new and copy to previous Address',
    //   name: 'copyToPreviousAddress',
    //   hidden: true,
    //   default: false,
    // },
    // {
    //   type: 'text',
    //   label: 'Search',
    //   name: 'previousSearch',
    //   className: ' ',
    //   //validators: [Validators.required],
    //   cols: 4,
    //   nextLine: true,
    //   rightIcon: true,
    // },
    // {
    //   type: "text",
    //   label: "Attention",
    //   name: "previousAttention",
    //   //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/)],
    //   className: " ",
    //   cols: 3,
    //   nextLine: true,
    // },
    // {
    //   type: "select",
    //   label: "Residence Type ",
    //   name: "previousResidenceType",
    //   cols: 3,
    //   className: "mt-2",
    //   //validators: [Validators.required],
    //   nextLine: false,
    //   list$: "LookUpServices/lookups?LookupSetName=Homeowner",
    //   idKey: "lookupValue",
    //   idName: "lookupValue",
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
    // {
    //   type: "toggle",
    //   label: "Reuse for Postal Addresss ",
    //   name: "previousreuseOfPostalAddress",
    //   className: " ml-8 ",
    //   cols: 2,
    //   alignmentType: "vertical",
    //   offLabel: "Yes",
    //   onLabel: "No",
    //   nextLine: false,
    // },
    // {
    //   type: "toggle",
    //   label: "Reuse for Register Addresss ",
    //   name: "previousreuseOfRegisterAddress",
    //   className: " ",
    //   cols: 2,
    //   alignmentType: "vertical",
    //   offLabel: "Yes",
    //   onLabel: "No",
    //   nextLine: true,
    // },

    {
      type: "text",
      label: "Building Name",
      name: "previousBuildingName",
      maxLength: 20,

      className: " ",
      inputClass: "w-8",
      inputType: "vertical",
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
      className: " ",
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
      name: "previousRuralDelivery",
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
      className: " ",
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
      className: " ",
      inputClass: "w-8",
      inputType: "vertical",
      maxLength: 10,
      cols: 2,
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
    //   default: "New Zealand",
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
  // optionsdata = [{ name: 'icashpro', code: 'icp' }];

  // NEW METHOD: Add street type handling method for trust previous address
  async setStreetType(streetTypeValue: string) {
    try {
      // Ensure street type options are loaded - using fieldProps for trust component as shown in original onBlurEvent
      const streetTypeOptions =
        this.mainForm?.fieldProps?.["previousStreetType"]?.options;

      if (!streetTypeOptions || streetTypeOptions.length === 0) {
        console.warn(
          "Trust previous street type options not loaded yet, retrying..."
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
          .get("previousStreetType")
          .patchValue(matchedOption.value || matchedOption.label);
      } else {
        console.warn(
          "⚠️ No matching trust previous street type found for:",
          streetTypeValue
        );
      }
    } catch (error) {
      console.error("Error setting trust previous street type:", error);
    }
  }


 
  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();

    if (this.trustSvc.showValidationMessage) {
      this.mainForm.form.markAllAsTouched();
    }

    this.indSvc.updateDropdownData().subscribe((result) => {
      this.mainForm.updateList("previousFloorType", result?.floorType);
      this.mainForm.updateList("previousUnitType", result?.unitType);
      this.mainForm.updateList("previousStreetType", result?.streetType);
      if (result?.country) {
        const countryCtrl = this.mainForm?.form?.get("previousCountry");
        if (countryCtrl && !countryCtrl.disabled) {
        this.mainForm.updateList("previousCountry", result?.country);
        }
        this.mainForm?.form?.get("previousCountry")?.setValue("New Zealand");
       this.mainForm.updateList("previousCity", result?.city);

      }
    });

    this.trustSvc.reusePhysicalAsPrevious.subscribe(async (data) => {
      if (data == "copied" && this.mainForm) {
        if (this.baseFormData.physicalCountry != "New Zealand") {
          this.mainForm?.updateHidden({
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
          });
        } else {
          this.mainForm?.updateHidden({
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
          });
          await this.updateValidation("onInit");
        }
        const fields = [
          "Search",
          "BuildingName",
          "City",
          "Year",
          "Month",
          "Lot",
          "Country",
          "FloorType",
          "UnitType",
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
          "Attention",
        ];

        fields.forEach((field) => {
          if (
            this.mainForm.form.get(`previous${field}`) &&
            this.mainForm.form.get(`previous${field}`).value !=
              this?.baseFormData[`physical${field}`] &&
            this?.baseFormData[`physical${field}`]
          ) {
            // this.updateDisableValue({
            //   key: `previous${field}`,
            //   value: res[`physical${field}`],
            // });
            this.mainForm.form.get(`previous${field}`).enable();
            this.mainForm.form
              .get(`previous${field}`)
              .patchValue(this?.baseFormData[`physical${field}`]);
            // this.baseFormData[`previous${field}`] = res[`physical${field}`];
          }
        });
      } else if (data == "undoCopy" && this.mainForm) {
        this.mainForm.form.reset();
      }
    });

    if (!this?.mainForm?.get("previousCountry")?.value) {
      this?.mainForm?.get("previousCountry")?.patchValue("New Zealand");
      this.baseFormData.previousCountry = "New Zealand";
    }
     let portalWorkflowStatus = sessionStorage.getItem("workFlowStatus");
    if (
      (portalWorkflowStatus != 'Open Quote') || (
        this.baseFormData?.AFworkflowStatus &&
        this.baseFormData.AFworkflowStatus !== 'Quote'
      )
    ) {
      this.mainForm?.form?.disable();
    } else { 
      this.mainForm?.form?.enable();
    }
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
  //       this.mainForm.updateList("previousStreetType", streetTypeList);
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
  //         this.mainForm?.form?.get("previousCountry")?.value ||
  //         this.baseFormData?.previousCountry ||
  //         "New Zealand";

  //       const sortedCountryList = this.sortOptionsWithSelectedOnTop(
  //         countryList,
  //         selectedCountry
  //       );

  //       this.mainForm.updateList("previousCountry", sortedCountryList);

  //       return sortedCountryList;
  //     }
  //   );

  //   await this.getCities();
  // }

  override async onSuccess(data: any) {}

  override onFormDataUpdate(res: any): void {}

  override onValueChanges(event: any): void {
    if (event.previousSearchValue && event.previousSearchValue.length >= 4) {
      this.searchSvc
        .searchAddress(event.previousSearchValue)
        .subscribe((res) => {
          console.log("Result:", res);
          this.searchAddressList = res;
          this.mainForm.updateList(
            "previousSearchValue",
            this.searchAddressList
          );
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
        this.mainForm.get("previousCountry").patchValue(data.country);
      if (data.postcode)
        this.mainForm.get("previousPostcode").patchValue(data.postcode);
      if (data.city) this.mainForm.get("previousCity").patchValue(data.city);
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
        });
      }
    }
  }

  pageCode: string = "TrustAddressDetailsComponent";
  modelName: string = "TrustPreviousAddressComponent";

 override async onFormReady(): Promise<void> {
    //  Handle initial country dropdown state based on overseas toggle
    const overseas = this.mainForm.form.get('overseasAddress')?.value;
    await this.getCities();  //: ensure cities LocationId loaded

    // Restore city/locationId in payload if any
    const existingCity = this.baseFormData?.previousCity; 
    if (existingCity && this.cityOptionsLocationId && this.cityOptionsLocationId.length > 0) {
      const LocationId = this.cityOptionsLocationId.filter(
        (l) => l.name === existingCity
      );
      if (LocationId && LocationId.length > 0 && LocationId[0]?.locationId) {
        this.baseSvc.setBaseDealerFormData({
          previousCity: existingCity,
          previousCityLocationId: LocationId[0]?.locationId,
        });
      }
    }

    await this.updateValidation("onInit");
    if (this.baseFormData.overseasAddress) {
      // If overseas address is already enabled from saved data
      this.hiddenfieldbyOverseas(this.baseFormData.overseasAddress);
      // Disable the search field on load
      this.mainForm?.form.get("previousSearchValue")?.disable({ emitEvent: false });
      // Clear any existing search value
      this.mainForm?.form.get("previousSearchValue")?.patchValue("", { emitEvent: false });
    }
    super.onFormReady();
     let portalWorkflowStatus = sessionStorage.getItem("workFlowStatus");
    if (
      (portalWorkflowStatus != 'Open Quote') || (
        this.baseFormData?.AFworkflowStatus &&
        this.baseFormData.AFworkflowStatus !== 'Quote'
      )
    ) {
      this.mainForm?.form?.disable();
    } else { 
      this.mainForm?.form?.enable();
    }
  }

  tempCity = null;
  override onFormEvent(event: any): void {
    if (event.name === "previousCity") {
      let locationName = this.mainForm.form.get("previousCity").value;
      let LocationId = this.cityOptionsLocationId.filter(
        (l) => l.name === locationName
      );

      if (LocationId && LocationId.length > 0 && LocationId[0]?.locationId) {
        this.baseSvc.setBaseDealerFormData({
        previousCity: locationName, // NEW: set city name explicitly
          previousCityLocationId: LocationId[0]?.locationId,
        });
      }
    }

    if (event?.name == "previousCountry" && event?.value) {
      if (event?.value != this.tempCity) {
        this.getCities();
      }
      this.tempCity = event?.value;
    }
     let portalWorkflowStatus = sessionStorage.getItem("workFlowStatus");
    if (
      (portalWorkflowStatus != 'Open Quote') || (
        this.baseFormData?.AFworkflowStatus &&
        this.baseFormData.AFworkflowStatus !== 'Quote'
      )
    ) {
      this.mainForm?.form?.disable();
    } else { 
      this.mainForm?.form?.enable();
    }

    super.onFormEvent(event);
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
            // Set for lookup later
            this.cityOptionsLocationId = obj;
            const filteredCities = obj
              .filter((city) => city.owner === selectedCountry)
              .map((city) => ({
                label: city.name,
                value: city.name,
              }));

            this.cityOptions = filteredCities;
            this.mainForm.updateList("previousCity", filteredCities);

            // Restore previousCity and locationId for payload consistency
            const existingCity =
              this.mainForm?.form?.get("previousCity")?.value ||
              this.baseFormData?.previousCity;
            if (existingCity) {
              const LocationId = this.cityOptionsLocationId.filter(
                (l) => l.name === existingCity
              );
              if (LocationId && LocationId.length > 0 && LocationId[0]?.locationId) {
                this.baseSvc.setBaseDealerFormData({
                previousCity: existingCity, // NEW: always set city here
                  previousCityLocationId: LocationId[0].locationId,
                });
              }
            }
          }
        }
      );
    }
  }


  // UPDATED METHOD: Enhanced blur event with street type auto-population
  override async onBlurEvent(event): Promise<void> {
    if (event.name == "previousSearchValue") {
      // if(event.data && event.data.length >= 4){
      this.searchSvc
        .getExternalAddressDetails(event.value.externalAddressLookupKey)
        .subscribe(async (res) => {
          console.log("External trust previous address result:", res);
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
    await this.updateValidation(event);
  }

  override async onValueEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  override async onValueTyped(event: any): Promise<void> {
    if (event.name === "previousCity") {
      let locationName = this.mainForm.form.get("previousCity").value;
      let LocationId = this.cityOptionsLocationId.filter(
        (l) => l.name === locationName
      );

      if (LocationId && LocationId.length > 0 && LocationId[0]?.locationId) {
        this.baseSvc.setBaseDealerFormData({
          previousCity: locationName,  //: set city explicitly
          previousCityLocationId: LocationId[0].locationId,
        });
      }
    }

    if (event.name == "overseasAddress") {
      // Step 1: ALWAYS clear all address fields first (regardless of Yes or No)
      this.clearAllAddressFields();
      
      if (event.data) {
        // Step 2: When toggle is set to "Yes" (true) - Overseas Address
        
        // Step 3: Hide/show appropriate fields for overseas address
        this.hiddenfieldbyOverseas(true);
        
        // Step 4: DISABLE the search address field
        this.mainForm.form.get("previousSearchValue")?.disable({ emitEvent: false });
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
        // Step 2: When toggle is set to "No" (false) - NZ Address     
        // Step 3: Hide/show appropriate fields for NZ address
        this.hiddenfieldbyOverseas(false);
        
        // Step 4: ENABLE the search address field
        this.mainForm.form.get("previousSearchValue")?.enable({ emitEvent: false });
        
        // Step 5: Set country back to New Zealand
        this.mainForm
          .get("previousCountry")
          .patchValue("New Zealand", { emitEvent: true });
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


  // : Toggle country dropdown based on overseas address
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
        // options: this.previousCountryOptions.length > 0 ? this.previousCountryOptions : [],
      });
      
      // Update the countries - sessionStorage cache
      this.indSvc.updateDropdownData().subscribe((result) => {
        if (result?.country) {
          this.mainForm.updateList("previousCountry", result?.country);
        }
      });
      countryCtrl.enable({ emitEvent: false });
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


   // METHOD: Clear all address fields when toggle changes
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
        previousYear: true,
        previousMonth: true,
        year: true,
        month: true,
        // previousSearchValue: true
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
      await this.updateValidation("onInit");
    }

    // this.pathcValue(this.baseFormData);
  }

  async hiddenfieldbyOverseas(overseas) {
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
        // previousSearchValue: true
      });

      this.mainForm.get("previousCountry").patchValue("", { emitEvent: true });
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

      // **NEW: Set New Zealand as default when not overseas**
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
  // NEW: Ensure latest previousCity and locationId are always synced before moving to next step
    const currentCity = this.mainForm?.form?.get('previousCity')?.value;
    const savedData = this.baseSvc.getBaseDealerFormData().value;

    if (currentCity && (!savedData?.previousCityLocationId || savedData?.previousCity !== currentCity)) {
      const LocationId = this.cityOptionsLocationId?.filter(
        (l) => l.name === currentCity
      );
      if (LocationId && LocationId.length > 0 && LocationId[0]?.locationId) {
        this.baseSvc.setBaseDealerFormData({
          previousCity: currentCity,
          previousCityLocationId: LocationId[0]?.locationId,
        });
      }
    }

    super.onStepChange(quotesDetails);
    if (quotesDetails.type !== "tabNav") {
      var result: any = await this.updateValidation("onSubmit");
    }

    if (this.trustSvc.previousAddressComponentStatus) {
      this.trustSvc.updateComponentStatus(
        "Address Details",
        "TrustPreviousAddressComponent",
        this.mainForm.form.valid
      );
    } else {
      this.trustSvc.updateComponentStatus(
        "Address Details",
        "TrustPreviousAddressComponent",
        true
      );
    }

    if (this.trustSvc.showValidationMessage) {
      let invalidPages = this.checkStepValidity();
      this.trustSvc.iconfirmCheckbox.next(invalidPages);
    }
  }
}
