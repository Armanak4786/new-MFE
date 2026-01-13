import {
  ChangeDetectorRef,
  Component,
  Input,
  SimpleChanges,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, ToasterService } from "auro-ui";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BaseIndividualClass } from "../../../base-individual.class";
import { IndividualService } from "../../../services/individual.service";
import { ValidationService } from "auro-ui";
import { SearchAddressService } from "../../../../standard-quote/services/search-address.service";
import { Subject, takeUntil } from "rxjs";
@Component({
  selector: "app-physical-address",
  templateUrl: "./physical-address.component.html",
  styleUrl: "./physical-address.component.scss",
})
export class PhysicalAddressComponent extends BaseIndividualClass {
  optionsdata = [{ label: "icashpro", value: "icp" }];
  cityOptions: any = [];
  cityOptionsLocationId: any = [];
  private destroySubject$ = new Subject<void>();
  @Input() copyToPreviousAddress = false;
  customerAddressArray: any;
  countryType: string = "New";
  isStreet: any;
  private countryOptions: any[] = [];
  private cityOptionsAll: any[] = [];
  isEffectDtFrom: any;
  isAddressType: any;
  index: any;
  physicalSeachValue: String;
  customerRoleForm: FormGroup;
  searchAddressList: any[];
  year: boolean;
  override title: string = "Address Details";
  override formConfig: GenericFormConfig = {
    headerTitle: "Physical Address",
    autoResponsive: true,
    api: "",
    cardType: "non-border",
    cardBgColor: "--background-color-secondary",
    // goBackRoute: 'physicalAddress',
    fields: [
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
      //   name: 'physicalSearchValue',
      //   className: ' ',
      //   maxLength: 30,
      //   validators: [Validators.required],
      //   cols: 4,
      //   nextLine: true,
      //   rightIcon: true,
      // },
      {
        type: "autoSelect",
        //placeholder: "Search",
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
      {
        type: "select",
        label: "Residence Type ",
        name: "physicalResidenceType",
        cols: 2,
        filter: true,
        // validators: [Validators.required],  -- Auro
        nextLine: false,
        // list$: "LookUpServices/lookups?LookupSetName=Homeowner",
        // idKey: "lookupValue",
        // idName: "lookupValue",
        options: [],
        className: "p-0 customLabel",
        alignmentType: "vertical",
        labelClass: "w-8 -my-3 mb-seven",
      },
      {
        type: "number",
        inputType: "vertical",
        label: "Time at Address",
        name: "physicalYear",
        maxLength: 3,
        className: "col-fixed w-4rem ml-0",
        labelClass: "white-space-nowrap",
        inputClass: "",
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
        name: "physicalMonth",
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
        nextLine: false,
      },

      {
        type: "toggle",
        label: "Reuse for Postal Address",
        name: "physicalReuseOff",
        className: "  lg:col-offset-1 pl-0 ",
        cols: 3,
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
        inputType: "vertical",
        // validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],   -- Auro
        cols: 2,
        nextLine: false,
      },
      {
        type: "select",
        label: "Floor Type",
        name: "physicalFloorType",
        // validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],   -- Auro
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
        // validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],  -- Auro
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
        // validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],  -- Auro
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
        // validators: [Validators.pattern(/^[A-Za-z0-9\-\/]*$/)],   -- Auro
        textAreaRows: 4,
        className: " ",
        cols: 12,
        hidden: true,
        nextLine: true,
        rows: 1,
      },
      {
        type: "text",
        label: "Unit/Lot Number",
        name: "physicalUnitNumber",
        // validators: [Validators.pattern(/^[A-Za-z0-9\-\/]*$/)],    -- Auro
        maxLength: 20,
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
        maxLength: 20,
        inputClass: "w-8",
        inputType: "vertical",
        /*  validators: [
          Validators.required,
          Validators.pattern(/^[A-Za-z0-9\-\/]*$/),
        ],     -- Auro  */
        className: " ",
        cols: 2,
        nextLine: false,
      },

      {
        type: "text",
        label: "Street Name",
        name: "physicalStreetName",
        maxLength: 20,
        inputClass: "w-8",
        inputType: "vertical",
        //regexPattern: "^[A-Za-z'.-& ]+$",
        /* validators: [
          Validators.required,
          Validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/),
        ],   --Auro UI */
        className: "",
        cols: 2,
        nextLine: false,
      },
      {
        type: "select",
        label: "Street Type",
        name: "physicalStreetType",
        // validators: [Validators.required],    --Auro UI
        className: "p-0 customLabel",
        alignmentType: "vertical",
        labelClass: "w-8",
        cols: 2,
        nextLine: false,
        filter: true,
        // list$: "LookUpServices/custom_lookups?LookupSetName=StreetType",
        // idKey: "lookupValue",
        // idName: "lookupValue",
        options: [],
      },

      {
        type: "text",
        label: "Street Direction",
        name: "physicalStreetDirection",
        /* validators: [
          Validators.required,
          Validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/),
        ], -- Auro UI */
        className: "",
        inputClass: "w-8",
        inputType: "vertical",
        maxLength: 20,
        cols: 2,
        nextLine: false,
      },
      {
        type: "text",
        label: "Rural Delivery",
        name: "physicalRuralDelivery",
        // validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],   -- Auro Ui
        className: "",
        maxLength: 20,
        inputClass: "w-8",
        inputType: "vertical",
        cols: 2,
        nextLine: true,
      },
      {
        type: "text",
        label: "Suburb",
        name: "physicalSuburbs",
        /* validators: [
          Validators.required,
          Validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/),
        ],   Auro UI */
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
        // labelClass: 'w-8 -my-3',
        // alignmentType: 'vertical',
        className: "px-0 customLabel",
        alignmentType: "vertical",
        labelClass: "w-8 -my-3",
        options: this?.cityOptions,
        name: "physicalCity",
        cols: 2,
        nextLine: false,
      },
      {
        type: "text",
        label: "Postcode",
        name: "physicalPostcode",
        inputClass: "w-8",
        inputType: "vertical",
        //regexPattern: "[^0-9]*",
        maxLength: 10,
        // validators: [Validators.required],  -- Auro Ui
        className: "",
        cols: 2,
        nextLine: false,
      },
      {
        type: "select",
        label: "Country",
        name: "physicalCountry",
        disabled: true,
        // mode: Mode.view,
        labelClass: "w-8 -my-3",
        alignmentType: "vertical",
        // validators: [Validators.required],   -- Auro UI
        className: "px-0 customLabel",
        cols: 2,
        // list$: "LookUpServices/locations?LocationType=country",
        // idKey: "name",
        default: "New Zealand",
        // idName: "name",
        options: [],
        filter: true,
        nextLine: false,
      },
      {
        type: "text",
        label: "physicalSearchCountry",
        maxLength: 20,
        name: "physicalSearchCountry",
        className: " ",
        inputClass: "w-8",
        inputType: "vertical",
        cols: 2,
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
    this.baseSvc.formDataCacheableRoute([
      "LookUpServices/lookups?LookupSetName=Homeowner",
    ]);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();

    this.customerRoleForm = this.fb.group({
      physicalSeachValue: ["", Validators.required],
    });
    let params: any = this.route.snapshot.params;

    if (params.mode == "edit" && this.baseFormData) {
    }

    // COMMENTED OUT: Country-specific layout switching - kept for future use
    // TODO: Uncomment this section if country-specific layouts are needed again
    /* 
  if (
    this.baseFormData.physicalCountry &&
    this.baseFormData.physicalCountry != "New Zealand"
  ) {
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
  */

    // CURRENT: Always show detailed layout (New Zealand style) for all countries
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

    this.searchSvc
      .getPhysicalAddressData()
      .pipe(takeUntil(this.destroySubject$))
      .subscribe(async (data) => {
        if (data) {
          this.mainForm?.form?.patchValue(data);

          // NEW: Handle city location ID after patching data
          if (data.physicalCity) {
            setTimeout(async () => {
              await this.setCityLocationId(data.physicalCity);
            }, 100);
          }
        } else {
          this.mainForm?.form?.reset();
        }
      });

    // this.mainForm?.get("physicalReuseOff").patchValue(false);
    // this.baseFormData.physicalReuseOff = false;

    if (this.baseSvc.showValidationMessage) {
      this.mainForm.form.markAllAsTouched();
    }

    await this.updateHomeowner();
    this.baseSvc.updateDropdownData().subscribe((result) => {
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
  }

  async updateHomeowner() {
    await this.baseSvc.getFormData(
      `LookUpServices/lookups?LookupSetName=Homeowner`,
      (res) => {
        let list = res.data;
        const residenceTypeList = list.map((item) => ({
          label: item.lookupValue,
          value: item.lookupValue,
        }));
       residenceTypeList?.sort((a, b) => a?.label?.localeCompare(b?.label));
        this.mainForm.updateList("physicalResidenceType", residenceTypeList);
        return residenceTypeList;
      }
    );
    await this.getCities(); // Changed to await

    //  Handle existing city location ID after cities are loaded
    setTimeout(async () => {
      await this.handleExistingCityLocationId();
    }, 200); // Delay to ensure both residence types and cities are loaded
  }
  // Add this method to handle existing city values
  private async handleExistingCityLocationId(): Promise<void> {
    const existingCity = this.mainForm?.form.get("physicalCity")?.value;
    if (existingCity && existingCity.trim()) {
      await this.setCityLocationId(existingCity);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.mainForm?.form &&
      changes["copyToPreviousAddress"].currentValue !=
        changes["copyToPreviousAddress"].previousValue
    ) {
      this.mainForm.form
        .get("copyToPreviousAddress")
        .patchValue(changes["copyToPreviousAddress"].currentValue);
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
    this.physicalSeachValue = [
      feature.properties.address_line1,
      feature.properties.address_line2,
    ]
      .filter((part) => part && part.trim())
      .join(" ");
    return [feature.properties.address_line1, feature.properties.address_line2]
      .filter((part) => part && part.trim())
      .join(" ");
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
        physicalCityLocationId: locationId[0]?.locationId,
      });
    }
  }

  async placeSelected(event: any, index: number) {
    if (event.properties) {
      const data = event.properties;

      if (data.streetType) {
        setTimeout(async () => {
          await this.setStreetType(data.streetType);
        }, 200);
      }
      if (data.country) {
        this.mainForm.get("physicalCountry").patchValue(data.country);
        this.mainForm.get("physicalSearchCountry").patchValue(data.country);
      }
      if (data.postcode)
        this.mainForm.get("physicalPostcode").patchValue(data.postcode);

      if (data.city) {
        this.mainForm.get("physicalCity").patchValue(data.city);
        // UPDATED: Set the city location ID when city is auto-populated
        await this.setCityLocationId(data.city);
      }

      if (data.street)
        this.mainForm.get("physicalStreetName").patchValue(data.street);
      if (data.suburb)
        this.mainForm.get("physicalSuburbs").patchValue(data.suburb);

      // COMMENTED OUT: Country-specific layout switching after place selection
      // TODO: Uncomment this section if country-specific layouts are needed again
      /*
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
      */

      // CURRENT: Always maintain detailed layout after place selection
      await this.updateValidation("onInit");
    }
  }

  tempCity = null;

  override onFormEvent(event: any): void {
    if (event.name === "physicalCountry" && event?.value) {
      if (event?.value != this.tempCity) {
        this.getCities();
      }
      this.tempCity = event?.value;
    }
    if (event.name === "physicalCity" && event?.value) {
    }

    super.onFormEvent(event);
  }

  override async onValueChanges(event: any) {
    if (event.physicalReuseOff) {
      this.baseFormData.physicalCountry =
        this.mainForm.get("physicalCountry").value;
      // if (event.data) {
      //   console.log(event)
      this.baseSvc.reusePhysical.next("copied");
    } else {
      this.baseSvc.reusePhysical.next("undoCopy");
      // }
    }
    if (event.physicalSearchValue && event.physicalSearchValue.length >= 4) {
      this.searchSvc
        .searchAddress(event.physicalSearchValue)
        .subscribe((res) => {
          this.searchAddressList = res;
          this.mainForm.updateList(
            "physicalSearchValue",
            this.searchAddressList
          );
        });
    }

    // COMMENTED OUT: Country-specific layout switching on search country change
    // TODO: Uncomment this section if country-specific layouts are needed again
    /*
    if (event.physicalSearchCountry) {
      if (event.physicalSearchCountry != "New Zealand") {
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
    */

    // CURRENT: Always maintain detailed layout regardless of search country
    if (event.physicalSearchCountry) {
      await this.updateValidation("onInit");
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

    if (event.name == "physicalYear" || event.name == "physicalMonth") {
      this.year =
        Number(this.mainForm?.form?.get("physicalYear")?.value) * 12 +
          Number(this.mainForm?.form?.get("physicalMonth")?.value) <
        36
          ? true
          : false;

      this.baseSvc.previousAddressHiddenStatus$.next(this.year);
      this.baseSvc.previousAddressComponentStatus = this.year;
    }
    if (event.name == "physicalReuseOff") {
      this.baseFormData.physicalCountry =
        this.mainForm.get("physicalCountry").value;
      if (event.data) {
        this.baseSvc.reusePhysical.next("copied");
      } else if (!event.data) {
        this.baseSvc.reusePhysical.next("undoCopy");
      }
    }

    // COMMENTED OUT: Country-specific layout switching on country change
    // TODO: Uncomment this section if country-specific layouts are needed again
    /*
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
      }
    }
    */

    // CURRENT: Country change no longer affects field visibility - all fields remain in detailed layout
    if (event.name == "physicalCountry") {
      // Country selection no longer triggers layout changes
      // All address fields remain visible in detailed format
    }

    await this.updateValidation("onInit");
  }
  // Add this new method to handle street type selection
  async setStreetType(streetTypeValue: string) {
    try {
      // Ensure street type options are loaded
      const streetTypeOptions =
        this.mainForm?.fieldProps?.["physicalStreetType"]?.options;

      if (!streetTypeOptions || streetTypeOptions.length === 0) {
        console.warn("Street type options not loaded yet, retrying...");
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
        // console.log('✅ Street type set successfully:', matchedOption);
      } else {
        //   console.warn('⚠️ No matching street type found for:', streetTypeValue);
        //console.log('Available options:', streetTypeOptions.map(o => o.value || o.label));
      }
    } catch (error) {
      // console.error('Error setting street type:', error);
    }
  }

  async getCities() {
    const selectedCountry =
      this.mainForm?.form.get("physicalCountry")?.value || "New Zealand";

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
            this.mainForm.updateList("physicalCity", filteredCities);
          }
        }
      );
    }
  }

  override onButtonClick(event: any): void {}
  // override onFormDataUpdate(res: any): void {
  //   if (
  //     !res.previousCountry &&
  //     res.copyToPreviousAddress &&
  //     !this.baseFormData?.copyToPreviousAddress
  //     // this.baseFormData.copyToPreviousAddress !== res.copyToPreviousAddress
  //   ) {
  //     setTimeout(() => {
  //       this.physicalSeachValue = "";
  //       // this.mainForm.form.reset();
  //     }, 500);
  //   }
  // }

  pageCode: string = "AddressDetailsComponent";
  modelName: string = "PhysicalAddressComponent";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");

    //  Handle existing city location ID after form is ready
    setTimeout(async () => {
      await this.handleExistingCityLocationId();
    }, 100); // Small delay to ensure cities are loaded

    super.onFormReady();
  }

  override async onBlurEvent(event): Promise<void> {
    if (event.name == "physicalSearchValue") {
      this.searchSvc
        .getExternalAddressDetails(event.value.externalAddressLookupKey)
        .subscribe(async (res) => {
          console.log("External address result:", res);
          const formValues = this.mapAddressJsonToFormControls(res.data);

          // Patch form values first
          this.mainForm.form.patchValue(formValues);

          // Set city location ID
          if (formValues.physicalCity) {
            await this.setCityLocationId(formValues.physicalCity);
          }

          // IMPROVED: Better street type handling with proper timing
          // if (formValues.physicalStreetType) {
          //   setTimeout(async () => {
          //     await this.setStreetType(formValues.physicalStreetType);
          //   }, 300);
          // }
        });

      await this.updateValidation(event);
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

  override async onStepChange(quotesDetails: any): Promise<void> {
    if (quotesDetails.type !== "tabNav") {
      var result: any = await this.updateValidation("onSubmit");
      // if (!result?.status) {
      //   this.toasterSvc.showToaster({
      //     severity: "error",
      //     detail: "I7",
      //   });
      // }
    }
    super.onStepChange(quotesDetails);

    if (!this.baseSvc.previousAddressComponentStatus) {
      this.baseSvc.updateComponentStatus(
        "Address Details",
        "PreviousAddressComponent",
        true
      ); // this is when previous address component is hidden
    }

    this.baseSvc.updateComponentStatus(
      "Address Details",
      "PhysicalAddressComponent",
      this.mainForm.form.valid
    );

    if (this.baseSvc.showValidationMessage) {
      let invalidPages = this.checkStepValidity();
      this.baseSvc.iconfirmCheckbox.next(invalidPages);
    }
    // this.checkStepValidity()
  }

  mapAddressJsonToFormControls(response: any): any {
    const componentMap: { [key: string]: string } = {
      BuildingName: "physicalBuildingName",
      FloorType: "physicalFloorType",
      FloorNo: "physicalFloorNumber",
      UnitType: "physicalUnitType",
      UnitLot: "physicalUnitNumber",
      StreetNo: "physicalStreetNumber",
      StreetName: "physicalStreetName",
      StreetType: "physicalStreetType",
      StreetDirection: "physicalStreetDirection",
      RuralDelivery: "physicalRuralDelivery",
    };

    const data = response?.data;
    const result: any = {};

    if (data?.addressComponents) {
      data.addressComponents.forEach((component: any) => {
        const formKey = componentMap[component.type];
        if (formKey) {
          result[formKey] = component.value;
        }
      });
    }

    // Add static mappings from other fields
    result["physicalSuburbs"] = data?.suburb || "";
    result["physicalCity"] = data?.city?.extName || "";
    result["physicalPostcode"] = data?.zipCode || "";
    result["physicalCountry"] = data?.countryRegion?.extName || "";

    return result;
  }

  // override ngOnDestroy() {
  //   this.destroySubject$.next();
  //   this.destroySubject$.complete();
  // }
}
