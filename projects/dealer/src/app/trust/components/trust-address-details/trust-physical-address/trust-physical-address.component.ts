import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BaseTrustClass } from "../../../base-trust.class";
import { TrustService } from "../../../services/trust.service";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

import {
  CommonService,
  GenericFormConfig,
  ToasterService,
  ValidationService,
} from "auro-ui";
import { SearchAddressService } from "../../../../standard-quote/services/search-address.service";
import { Subject, takeUntil } from "rxjs";
import { IndividualService } from "../../../../individual/services/individual.service";

@Component({
  selector: "app-trust-physical-address",
  templateUrl: "./trust-physical-address.component.html",
  styleUrl: "./trust-physical-address.component.scss",
})
export class TrustPhysicalAddressComponent extends BaseTrustClass {
  @Input() copyToPreviousAddress = false;
  optionsdata = [{ label: "icashpro", value: "icp" }];
  privousChecked: any;
  physicalSeachValue: String;
  index: any;
  searchAddressList: any[];
  cityOptions: any = [];
  private countryOptions: any[] = [];
  cityOptionsLocationId: any = [];
  year: boolean;
  cityOptionsAll: any = [];

  override formConfig: GenericFormConfig = {
    // headerTitle: 'Physical Address',
    autoResponsive: true,
    cardType: "non-border",
    cardBgColor: "--background-color-secondary",
    api: "",
    // goBackRoute: '',
    fields: [
      {
        type: "autoSelect",
        // placeholder: "Search",
        name: "physicalSearchValue",
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
      //   type: 'checkbox',
      //   label: 'Create new and copy to previous Address',
      //   name: 'copyToPreviousAddress',
      //   hidden: true,
      //   default: false,
      // },
      // {
      //   type: 'text',
      //   label: 'Search',
      //   name: 'physicalSearch',
      //   className: ' ',
      //   //validators: [Validators.required],
      //   cols: 4,
      //   nextLine: true,
      //   rightIcon: true,
      // },
      // {
      //   type: "text",
      //   label: "Attention",
      //   name: "physicalAttention",
      //   //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/)],
      //   className: " ",
      //   cols: 3,
      //   nextLine: true,
      // },
      // {
      //   type: "select",
      //   label: "Residence Type ",
      //   name: "physicalResidenceType",
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
        name: "physicalYear",
        maxLength: 2,
        labelClass: "se white-space-nowrap",
        className: "-mt-1 col-fixed w-4rem ml-0",
        inputClass: "",
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
        name: "physicalMonth",
        maxLength: 2,
        inputClass: "pm",
        // validators: [Validators.max(11)],   -- Auro
        errorMessage: "Value should be less than 12",
        className: "mb-1 col-fixed w-4rem yearmonthClass1",
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "Months",
        name: "month",
        className: "mt-3 pt-3 col-fixed w-4rem",
        nextLine: false,
      },
      {
        type: "toggle",
        label: "Reuse for Postal Address",
        name: "physicalreuseOfPostalAddress",
        className: " ml-8 ",
        cols: 2,
        alignmentType: "vertical",
        offLabel: "Yes",
        onLabel: "No",
        nextLine: false,
      },
      {
        type: "toggle",
        label: "Reuse for Register Address",
        name: "physicalreuseOfRegisterAddress",
        className: " ",
        cols: 2,
        alignmentType: "vertical",
        offLabel: "Yes",
        onLabel: "No",
        nextLine: true,
      },

      {
        type: "text",
        label: "Building Name",
        name: "physicalBuildingName",
        maxLength: 20,

        className: " ",
        inputClass: "w-8 ",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
        inputType: "vertical",
        cols: 2,
        nextLine: false,
      },
      {
        type: "select",
        label: "Floor Type",
        name: "physicalFloorType",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
        cols: 2,
        // list$: "LookUpServices/custom_lookups?LookupSetName=FloorType",
        // idKey: "lookupValue",
        // idName: "lookupValue",
        options: [],
        className: "px-0 customLabel",
        alignmentType: "vertical",
        labelClass: "w-8 -my-3",
      },
      {
        type: "text",
        label: "Floor Number",
        name: "physicalFloorNumber",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
        className: " ",
        cols: 2,
        maxLength: 5,
        inputClass: "w-8",
        inputType: "vertical",
      },
      {
        type: "select",
        label: "Unit Type",
        name: "physicalUnitType",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
        className: "px-0 customLabel",
        cols: 2,
        // list$: "LookUpServices/custom_lookups?LookupSetName=UnitType",
        // idKey: "lookupValue",
        // idName: "lookupValue",
        options: [],
        nextLine: true,
        labelClass: "w-8 -my-3",
        alignmentType: "vertical",
      },
      {
        type: "textArea",
        label: "Address",
        name: "physicalStreetArea",
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
        name: "physicalUnitNumber",
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
        name: "physicalStreetNumber",
        //validators: [Validators.required],
        //regexPattern: "[^0-9]*",
        className: " ",
        inputClass: "w-8",
        inputType: "vertical",
        cols: 2,
        nextLine: false,
      },

      {
        type: "text",
        label: "Street Name",
        name: "physicalStreetName",
        inputClass: "w-8",
        inputType: "vertical",
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
        name: "physicalStreetType",
        //validators: [Validators.required],
        className: "px-0 customLabel",
        alignmentType: "vertical",
        labelClass: "w-8 -my-3",
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
        name: "physicalStreetDirection",
        // validators: [
        //   Validators.required,
        //   Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/),
        // ],
        inputClass: "w-8",
        inputType: "vertical",
        className: "",
        cols: 2,
        nextLine: false,
      },
      {
        type: "text",
        label: "Rural Delivery",
        name: "physicalRuralDelivery",
        className: "",
        inputClass: "w-8",
        inputType: "vertical",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/)],
        cols: 2,
        nextLine: true,
      },
      {
        type: "text",
        label: "Suburb",
        name: "physicalSuburbs",
        // validators: [
        //   Validators.required,
        //   Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/),
        // ],
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
        // validators: [
        //   Validators.required,
        //   Validators.pattern(/^[A-Za-z0-9\-\/]*$/),
        // ],
        name: "physicalCity",
        className: "px-0 customLabel",
        alignmentType: "vertical",
        labelClass: "w-8 -my-3",
        cols: 2,
        options: this.cityOptions,
        nextLine: false,
      },
      {
        type: "text",
        //regexPattern: "[^0-9]*",
        label: "Postcode",
        //validators: [Validators.required],
        name: "physicalPostcode",
        className: " ",
        inputClass: "w-8",
        inputType: "vertical",
        cols: 2,
        maxLength: 10,
        nextLine: false,
      },

      {
        type: "select",
        label: "Country",
        name: "physicalCountry",
        labelClass: "w-8 -my-3",
        alignmentType: "vertical",
        // validators: [Validators.required],   -- Auro UI
        className: "px-0 customLabel",
        cols: 2,
        // list$: "LookUpServices/locations?LocationType=country",
        // idKey: "name",
        // idName: "name",
        options: [],
        default: "New Zealand",
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
      console.log("physical address", result);
      this.mainForm.updateList("physicalFloorType", result?.floorType);
      this.mainForm.updateList("physicalUnitType", result?.unitType);
      this.mainForm.updateList("physicalStreetType", result?.streetType);
      if (result?.country) {
        this.mainForm.updateList("physicalCountry", result?.country);
        this.mainForm?.form?.get("physicalCountry")?.setValue("New Zealand");
        this.mainForm.updateList("physicalCity", result?.city);

      }
    });
    let params: any = this.route.snapshot.params;

    // setTimeout(() => {
    // if (
    //   this.baseFormData.physicalCountry &&
    //   this.baseFormData.physicalCountry != "New Zealand"
    // ) {
    //   this.mainForm.updateHidden({
    //     physicalUnitType: true,
    //     physicalFloorNumber: true,
    //     physicalFloorType: true,
    //     physicalBuildingName: true,
    //     physicalRuralDelivery: true,
    //     physicalStreetDirection: true,
    //     physicalStreetType: true,
    //     physicalStreetName: true,
    //     physicalStreetNumber: true,
    //     physicalUnitNumber: true,
    //     physicalStreetArea: false,
    //   });
    // } else {
    //   this.mainForm.updateHidden({
    //     physicalUnitType: false,
    //     physicalFloorNumber: false,
    //     physicalFloorType: false,
    //     physicalBuildingName: false,
    //     physicalRuralDelivery: false,
    //     physicalStreetDirection: false,
    //     physicalStreetType: false,
    //     physicalStreetName: false,
    //     physicalStreetNumber: false,
    //     physicalUnitNumber: false,
    //     physicalStreetArea: true,
    //   });
    // }
    // }, 100);

    this.searchSvc
      .getPhysicalAddressData()
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((data) => {
        if (data) {
          this.mainForm.form.patchValue(data);
        } else {
          // this.mainForm.form.reset();
        }
      });

   // this?.mainForm?.get("physicalreuseOfRegisterAddress")?.patchValue(false);
   // this?.mainForm?.get("physicalreuseOfPostalAddress")?.patchValue(false);
  
  }
  

  // NEW METHOD: Add street type handling method for trust physical address
  async setStreetType(streetTypeValue: string) {
    try {
      // Ensure street type options are loaded - using getOptions method for trust component
      const streetTypeOptions = await this.mainForm.getOptions(
        "physicalStreetType"
      );

      if (!streetTypeOptions || streetTypeOptions.length === 0) {
        console.warn(
          "Trust physical street type options not loaded yet, retrying..."
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
          .get("physicalStreetType")
          .patchValue(matchedOption.value || matchedOption.label);
        //console.log('✅ Trust physical street type set successfully:', matchedOption);
      } else {
        console.warn(
          "⚠️ No matching trust physical street type found for:",
          streetTypeValue
        );
        //console.log('Available options:', streetTypeOptions.map(o => o.value || o.label));
      }
    } catch (error) {
      console.error("Error setting trust physical street type:", error);
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
  //       this.mainForm.updateList("physicalFloorType", floorTypeList);
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
  //       this.mainForm.updateList("physicalUnitType", unitTypeList);
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
  //       this.mainForm.updateList("physicalStreetType", streetTypeList);
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
  //       const selectedCountry =
  //         this.mainForm?.form?.get("physicalCountry")?.value || "New Zealand";

  //       // Sort with selected country at top
  //       const sortedCountryList = this.sortDropdownWithSelectedFirst(
  //         countryList,
  //         selectedCountry
  //       );

  //       this.mainForm.updateList("physicalCountry", sortedCountryList);
  //       return sortedCountryList;
  //     }
  //   );

  //   await this.getCities();
  // }

  ngOnChanges(changes: SimpleChanges): void {
    // if (
    //   this.mainForm?.form &&
    //   changes["copyToPreviousAddress"].currentValue !=
    //   changes["copyToPreviousAddress"].previousValue
    // ) {
    //   this.mainForm.form
    //     .get("copyToPreviousAddress")
    //     .patchValue(changes["copyToPreviousAddress"].currentValue);
    // }
  }

  override title: string = "Address Details";

  private destroySubject$ = new Subject<void>();

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
  override onFormEvent(event: any): void {
    if (event.name === "physicalCity") {
      let locationName = this.mainForm.form.get("physicalCity").value;
      let checkSessionLocationId = JSON.parse(sessionStorage.getItem("LookUpServices/locations?LocationType=City"))
      if(checkSessionLocationId && this.cityOptionsLocationId.length == 0){
        this.cityOptionsLocationId = checkSessionLocationId.data;
      }
      let LocationId = this.cityOptionsLocationId.filter(
        (l) => l.name === locationName
      );
      this.baseSvc.setBaseDealerFormData({
        physicalCityLocationId: LocationId[0]?.locationId,
      });
      
    }
    // if (event.name == "physicalCountry") {
    //   if (
    //     event.name == "physicalCountry" &&
    //     event.value != "New Zealand" &&
    //     event.value
    //   ) {
    //     this.mainForm.updateHidden({
    //       physicalUnitType: true,
    //       physicalFloorNumber: true,
    //       physicalFloorType: true,
    //       physicalBuildingName: true,
    //       physicalRuralDelivery: true,
    //       physicalStreetDirection: true,
    //       physicalStreetType: true,
    //       physicalStreetName: true,
    //       physicalStreetNumber: true,
    //       physicalUnitNumber: true,
    //       physicalStreetArea: false,
    //     });
    //   } else {
    //     this.mainForm.updateHidden({
    //       physicalUnitType: false,
    //       physicalFloorNumber: false,
    //       physicalFloorType: false,
    //       physicalBuildingName: false,
    //       physicalRuralDelivery: false,
    //       physicalStreetDirection: false,
    //       physicalStreetType: false,
    //       physicalStreetName: false,
    //       physicalStreetNumber: false,
    //       physicalUnitNumber: false,
    //       physicalStreetArea: true,
    //     });
    //     // await this.updateValidation("onInit");
    //   }
    // }

    if (event?.name == "physicalCountry" && event?.value) {
      if (event?.value != this.tempCity) {
        this.getCities();
      }
      this.tempCity = event?.value;
    }

    super.onFormEvent(event);
  }

  async getCities() {
    const selectedCountry = this.mainForm?.form.get("physicalCountry")?.value;

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

this.cityOptions = filteredCities;
this.cityOptionsLocationId = obj;
this.mainForm.updateList("physicalCity", this.cityOptions);

          }
        }
      );
    }
  }

  override onValueChanges(event: any): void {
    // if (event == "physicalreuseOfPostalAddress") {
    //   this.baseFormData.physicalCountry =
    //     this.mainForm?.get("physicalCountry")?.value;
    //   if (event.physicalreuseOfPostalAddress) {
    //     this.trustSvc.reusePhysical.next("copied");
    //   } else if (!event.physicalreuseOfPostalAddress) {
    //     this.trustSvc.reusePhysical.next("undoCopy");
    //   }
    // }
    if (event.physicalSearchValue && event.physicalSearchValue.length >= 4) {
      this.searchSvc
        .searchAddress(event.physicalSearchValue)
        .subscribe((res) => {
          console.log("Result:", res);
          this.searchAddressList = res;
          this.mainForm.updateList(
            "physicalSearchValue",
            this.searchAddressList
          );
        });
    }
  }

  override async onValueTyped(event: any): Promise<void> {
    if (event.name === "physicalCity") {
      let locationName = this.mainForm.form.get("physicalCity").value;
      let LocationId = this.cityOptionsLocationId.filter(
        (l) => l.name === locationName
      );

      this.baseSvc.setBaseDealerFormData({
        physicalCityLocationId: LocationId[0]?.locationId,
      });
    }
    console.log(event);
    if (event.name == "physicalYear" || event.name == "physicalMonth") {
      this.year =
        Number(this.mainForm?.form?.get("physicalYear")?.value) * 12 +
          Number(this.mainForm?.form?.get("physicalMonth")?.value) <
        36
          ? true
          : false;

      this.trustSvc.previousAddressHiddenStatus$.next(this.year);
      this.trustSvc.previousAddressComponentStatus = this.year;
    }

    if (event.name == "physicalreuseOfPostalAddress") {
      this.baseFormData.physicalCountry =
        this.mainForm.get("physicalCountry").value;
      if (event.data) {
        this.trustSvc.reusePhysical.next("copied");
      } else if (!event.data) {
        this.trustSvc.reusePhysical.next("undoCopy");
      }
    }

    if (event.name == "physicalreuseOfRegisterAddress") {
      this.baseFormData.physicalCountry =
        this.mainForm.get("physicalCountry").value;
      if (event.data) {
        this.trustSvc.reusePhysicalAsRegister.next("copied");
      } else if (!event.data) {
        this.trustSvc.reusePhysicalAsRegister.next("undoCopy");
      }
    }
    if (event.name == "physicalCountry") {
      if (event.data != "New Zealand") {
        this.mainForm.updateHidden({
          physicalUnitType: true,
          physicalFloorNumber: true,
          physicalFloorType: true,
          physicalBuildingName: true,
          physicalRuralDelivery: true,
          physicalStreetDirection: true,
          physicalStreetType: true,
          physicalStreetName: true,
          physicalStreetNumber: true,
          physicalUnitNumber: true,
          physicalStreetArea: false,
        });
      } else {
        this.mainForm.updateHidden({
          physicalUnitType: false,
          physicalFloorNumber: false,
          physicalFloorType: false,
          physicalBuildingName: false,
          physicalRuralDelivery: false,
          physicalStreetDirection: false,
          physicalStreetType: false,
          physicalStreetName: false,
          physicalStreetNumber: false,
          physicalUnitNumber: false,
          physicalStreetArea: true,
        });
        //await this.updateValidation("onInit");
      }
    }
    await this.updateValidation("onInit");
  }

  // UPDATED METHOD: Enhanced place selection with street type auto-population
  async placeSelected(event: any, index: any) {
    console.log();

    if (event.properties) {
      const data = event.properties;

      // NEW: Add street type handling
      if (data.streetType) {
        setTimeout(async () => {
          await this.setStreetType(data.streetType);
        }, 200);
      }

      if (data.country)
        this.mainForm.get("physicalCountry").patchValue(data.country);
      if (data.postcode)
        this.mainForm.get("physicalPostcode").patchValue(data.postcode);
      if (data.city) this.mainForm.get("physicalCity").patchValue(data.city);
      if (data.street)
        this.mainForm.get("physicalStreetName").patchValue(data.street);
      if (data.suburb)
        this.mainForm.get("physicalSuburbs").patchValue(data.suburb);
      if (data.country != "New Zealand") {
        this.mainForm.updateHidden({
          physicalUnitType: true,
          physicalFloorNumber: true,
          physicalFloorType: true,
          physicalBuildingName: true,
          physicalRuralDelivery: true,
          physicalStreetDirection: true,
          physicalStreetType: true,
          physicalStreetName: true,
          physicalStreetNumber: true,
          physicalUnitNumber: true,
          physicalStreetArea: false,
        });
      } else {
        this.mainForm.updateHidden({
          physicalUnitType: false,
          physicalFloorNumber: false,
          physicalFloorType: false,
          physicalBuildingName: false,
          physicalRuralDelivery: false,
          physicalStreetDirection: false,
          physicalStreetType: false,
          physicalStreetName: false,
          physicalStreetNumber: false,
          physicalUnitNumber: false,
          physicalStreetArea: true,
        });
        await this.updateValidation("onInit");
      }
    }
  }
  override async onSuccess(data: any) {}

  override onFormDataUpdate(res: any): void {
    // if (
    //   !res.previousCountry &&
    //   res.copyToPreviousAddress &&
    //   !this.baseFormData?.copyToPreviousAddress
    // ) {
    //   setTimeout(() => {
    //     this.physicalSeachValue = '';
    //     this.mainForm.form.reset();
    //   }, 500);
    // }
  }

  pageCode: string = "TrustAddressDetailsComponent";
  modelName: string = "TrustPhysicalAddressComponent";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
  }

  // UPDATED METHOD: Enhanced blur event with street type auto-population
  override async onBlurEvent(event): Promise<void> {
    if (event.name == "physicalSearchValue") {
      // if(event.data && event.data.length >= 4){
      this.searchSvc
        .getExternalAddressDetails(event.value.externalAddressLookupKey)
        .subscribe(async (res) => {
          // console.log("External trust physical address result:", res);
          const formValues = this.searchSvc.mapAddressJsonToFormControls(
            res.data,
            "physical"
          );

          // Patch form values first
          this.mainForm.form.patchValue(formValues);

          // IMPROVED: Better street type handling with proper timing
          // if (formValues.physicalStreetType) {
          //   setTimeout(async () => {
          //     await this.setStreetType(formValues.physicalStreetType);
          //   }, 300);
          // }

          // COMMENTED OUT: Old street type handling method
          /*
          const options = await this.mainForm.getOptions('physicalStreetType')
          this.mainForm.get('physicalStreetType').setValue(options?.find(obj=>obj.lookupCode == formValues?.physicalStreetType?.toUpperCase())?.value)
          */

          // this.mainForm.get('physicalCountry').disable({emitEvent:false});
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
    if (!this.trustSvc.previousAddressComponentStatus) {
      this.trustSvc.updateComponentStatus(
        "Address Details",
        "TrustPreviousAddressComponent",
        true
      ); // this is when previous address component is hidden
    }

    this.trustSvc.updateComponentStatus(
      "Address Details",
      "TrustPhysicalAddressComponent",
      this.mainForm.form.valid
    );

    if (this.trustSvc.showValidationMessage) {
      let invalidPages = this.checkStepValidity();
      this.trustSvc.iconfirmCheckbox.next(invalidPages);
    }
  }
}
