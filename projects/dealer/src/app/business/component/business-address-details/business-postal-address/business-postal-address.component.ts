import { ChangeDetectorRef, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  CommonService,
  GenericFormConfig,
  Mode,
  ToasterService,
} from "auro-ui";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BusinessService } from "../../../services/business";
import { BaseBusinessClass } from "../../../base-business.class";
import { ValidationService } from "auro-ui";
import { distinctUntilChanged, filter, Subscription, takeUntil } from "rxjs";
import { SearchAddressService } from "../../../../standard-quote/services/search-address.service";
import { IndividualService } from "../../../../individual/services/individual.service";

@Component({
  selector: "app-business-postal-address",
  templateUrl: "./business-postal-address.component.html",
  styleUrl: "./business-postal-address.component.scss",
})
export class BusinessPostalAddressComponent extends BaseBusinessClass {
  optionsdata = [{ label: "icashpro", value: "icp" }];
  privousChecked: any;
  index: any;
  physicalSeachValue: String;
  reusePhysicalSubs: Subscription;
  customerRoleForm: FormGroup;
  selectedAddressType: string = "po";
  cityOptionsLocationId: any = [];
  tempCity = null;

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
  searchAddressList: any;
  postalAddressType: any;
  postalSearchValue: String;
  private countryOptions: any[] = [];
  private cityOptions: any[] = [];
  override formConfig: GenericFormConfig = {
    headerTitle: "Postal Address",
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
        default: "street",
        // cols:12,
        nextLine: true,
      },

      {
        type: "autoSelect",
        label: "Search",
        name: "postalSearchValue",
        idKey: "street",
        // placeholder: "Search",
        cols: 2,
        options: [],
        className: "my-1",
        rightIcon: true,
        icon: "fa-solid fa-location-crosshairs fa-lg",
        minLength: 3,
        nextLine: true,
        // rightIcon: true,
      },
      // {
      //   type: "text",
      //   label: "Attention",
      //   name: "postalAttention",
      //   inputType: "vertical",
      //   className: " ",
      //   //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
      //   cols: 2,
      //   nextLine: true,
      // },
      {
        type: "number",
        inputType: "vertical",
        label: "Time at Address",
        name: "postalYear",
        maxLength: 2,
        className: "col-fixed w-4rem ml-3 white-space-nowrap",
        inputClass: "-m-2",
        hidden: true,

        // validators: [Validators.required, Validators.min(1)],  -- Auro
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "Years",
        name: "year",
        className: "mt-3 pt-3 col-fixed w-4rem",
        hidden: true,
      },
      {
        type: "number",
        inputType: "vertical",
        name: "postalMonth",
        maxLength: 2,
        // validators: [Validators.max(11)],   -- Auro
        errorMessage: "Value should be less than 12",
        className: "mt-2 col-fixed w-4rem yearmonthClass",
        hidden: true,
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "Months",
        name: "month",
        className: "mt-3 pt-3 col-fixed w-4rem",
        nextLine: false,
        hidden: true,
      },
      {
        type: "text",
        label: "Postal Number ",
        name: "postalPostalNumber",
        //regexPattern: "[^0-9]*",
        className: "lg:col-offset-1 mt-2   pl-1",
        cols: 3,
        //validators: [Validators.required],
        nextLine: true,
        hidden: true,
      },

      {
        type: "text",
        label: "Building Name",
        name: "postalBuildingName",
        inputType: "vertical",
        inputClass: "w-8 ",

        maxLength: 20,
        className: " ",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],

        cols: 2,
        nextLine: false,
       // mode: Mode.view,
      },
      {
        type: "select",
        label: "Unit Type",
        name: "postalUnitType",
        alignmentType: "vertical",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
        className: "px-0 customLabel",
        cols: 2,
        // list$: "LookUpServices/custom_lookups?LookupSetName=UnitType",
        // idKey: "lookupValue",
        // idName: "lookupValue",
        options: [],
        labelClass: "w-8 -my-3",
       // mode: Mode.view,
        // nextLine: true,
      },
      {
        type: "select",
        label: "Floor Type",
        name: "postalFloorType",
        alignmentType: "vertical",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
        className: "px-0 customLabel",
        cols: 2,
        // list$: "LookUpServices/custom_lookups?LookupSetName=FloorType",
        // idKey: "lookupValue",
        // idName: "lookupValue",
        options: [],
        labelClass: "w-8 -my-3",
       // mode: Mode.view,
      },
      {
        type: "text",
        label: "Floor Number",
        name: "postalFloorNumber",
        inputType: "vertical",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
        className: " ",
        cols: 2,
        maxLength: 5,
        inputClass: "w-8",
       // mode: Mode.view,
      },
      {
        type: "textArea",
        label: "Address",
        name: "postalStreetArea",
        inputType: "vertical",
        // //validators: [Validators.pattern(/^[A-Za-z0-9\-\/]*$/)],
        // textAreaRows: 4,
        className: " ",
        cols: 12,
        hidden: false,
        nextLine: true,
       // mode: Mode.view,
      },
      {
        type: "text",
        label: "Unit/Lot Number",
        name: "postalUnitNumber",
        inputType: "vertical",
        //validators: [Validators.pattern(/^[A-Za-z0-9\-\/]*$/)],
        className: " ",
        cols: 2,
        nextLine: false,
        inputClass: "w-8",
       // mode: Mode.view,
      },
      {
        type: "text",
        label: "Street Number",
        name: "postalStreetNumber",
        inputType: "vertical",
        //regexPattern: "[^0-9]*",
        //validators: [Validators.required],
        className: " ",
        cols: 2,
        inputClass: "w-8",
        nextLine: false,
       // mode: Mode.view,
      },

      {
        type: "text",
        label: "Street Name",
        name: "postalStreetName",
        inputType: "vertical",
        inputClass: "w-8",
        //regexPattern: "[^0-9]*",
        //validators: [Validators.required],
        className: "",
        cols: 2,
        nextLine: false,
       // mode: Mode.view,
      },
      {
        type: "select",
        label: "Street Type",
        name: "postalStreetType",
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
       // mode: Mode.view,
      },

      {
        type: "text",
        label: "Street Direction",
        name: "postalStreetDirection",
        inputType: "vertical",
        inputClass: "w-8",
        // validators: [
        //   Validators.required,
        //   Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/),
        // ],
        className: "",
        cols: 2,
       // mode: Mode.view,
        nextLine: false,
      },
      {
        type: "text",
        label: "Rural Delivery",
        name: "postalRuralDelivery",
        inputType: "vertical",
        inputClass: "w-8",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
        className: "",
        cols: 2,
       // mode: Mode.view,
        nextLine: true,
      },
      {
        type: "text",
        label: "Suburb",
        name: "postalSuburbs",
        inputType: "vertical",
        inputClass: "w-8",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
        className: " ",
        cols: 2,
        maxLength: 20,
       // mode: Mode.view,
        nextLine: false,
      },
      {
        type: "select",
        label: "City",
        name: "postalCity",
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
       // mode: Mode.view,
        nextLine: false,
      },
      {
        type: "text",
        //regexPattern: "[^0-9]*",
        label: "Postcode",
        //validators: [Validators.required],
        name: "postalPostcode",
        inputClass: "w-8",
        inputType: "vertical",
        className: " ",
        cols: 2,
        maxLength: 10,
       // mode: Mode.view,
        nextLine: false,
      },
      {
        type: "select",
        label: "Country",
        name: "postalCountry",
        alignmentType: "vertical",
        labelClass: "w-8 -my-3",
        //validators: [Validators.required],
        className: "px-0 customLabel",
        cols: 2,
        // list$: "LookUpServices/locations?LocationType=country",
        // idKey: "name",
        default: "New Zealand",
        // idName: "name",
       // mode: Mode.view,
        nextLine: false,
      },
    ],
  };
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

  override title: string = "Address Details";
  // override title: string = 'Address Details';

  // NEW METHOD: Add street type handling method for business postal address
  async setStreetType(streetTypeValue: string) {
    try {
      // Ensure street type options are loaded
      const streetTypeOptions =
        this.mainForm?.fieldProps?.["postalStreetType"]?.options;

      if (!streetTypeOptions || streetTypeOptions.length === 0) {
        console.warn(
          "Business postal street type options not loaded yet, retrying..."
        );
        // Retry after a short delay
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
        console.log(
          "✅ Business postal street type set successfully:",
          matchedOption
        );
      } else {
        console.warn(
          "⚠️ No matching business postal street type found for:",
          streetTypeValue
        );
        console.log(
          "Available options:",
          streetTypeOptions.map((o) => o.value || o.label)
        );
      }
    } catch (error) {
      console.error("Error setting business postal street type:", error);
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
            this.mainForm.get("postalAddressType").setValue("street");
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
            this.mainForm.get("postalAddressType").setValue("po");
          }
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
    //await this.updateValidation("onInit");
  }
  await this.updateValidation("onInit");
}

override async ngOnInit(): Promise<void> {
  await super.ngOnInit();

  // Set default postalAddressType if not set
  if (!this.mainForm.form.get("postalAddressType")?.value) {
    this.mainForm.form.get("postalAddressType").setValue("po");
  }

  // Initialize subscription for copy functionality from physical address
  this.initializeCopySubscription();

  // Determine current form state
  const postalCountry = this.mainForm.form.get("postalCountry")?.value || "New Zealand";
  const postalAddressType = this.mainForm.form.get("postalAddressType")?.value;

  // Set initial country dropdown state based on address type
  if (postalAddressType === "street") {
    this.mainForm.form.get("postalCountry")?.disable({ emitEvent: false });
  } else {
    this.mainForm.form.get("postalCountry")?.enable({ emitEvent: false });
  }

  if (postalAddressType === "po" || postalCountry !== "New Zealand") {
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

  this.cdr.detectChanges();

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

  await this.getCities();
  
  this.initializeCityHandler();

  // Mark all fields as touched if validation messages should be shown
  if (this.baseSvc.showValidationMessage) {
    this.mainForm.form.markAllAsTouched();
  }
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
}

private initializeCopySubscription(): void {
  this.reusePhysicalSubs = this.baseSvc.reusePhysical$
    .pipe(
      takeUntil(this.destroy$),
      // Filter out null/initial values and legacy string format signals
      filter(payload => {
        if (!payload) return false;
        
        // Only accept the new object format with action property
        if (typeof payload === 'string') {
          return false;
        }
        
        return true;
      })
    )
    .subscribe((payload: any) => {
      if (!this.mainForm) {
        return;
      }

      // Route to appropriate handler based on action type
      if (payload?.action === 'copied' && payload?.data) {
        this.handleCopyFromPhysical(payload.data);
      } 

    });
}


private handleCopyFromPhysical(physicalData: any): void {
  const isNz = physicalData.postalCountry === "New Zealand";

  // Set address type based on country
  this.mainForm.form.get("postalAddressType")?.patchValue(isNz ? "street" : "po", { emitEvent: false });
  this.selectedAddressType = isNz ? "street" : "po";

  // Enable/disable country dropdown based on address type
  if (this.selectedAddressType === "street") {
    this.mainForm.form.get("postalCountry")?.disable({ emitEvent: false });
  } else {
    this.mainForm.form.get("postalCountry")?.enable({ emitEvent: false });
  }

  // Update field visibility based on country and address type
  if (!isNz || this.selectedAddressType === "po") {
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

  // Patch all form values while preserving control disabled states
  Object.keys(physicalData).forEach(key => {
    const control = this.mainForm.form.get(key);
    if (control && physicalData[key] !== undefined && physicalData[key] !== null) {
      const wasDisabled = control.disabled;
      
      // Temporarily enable disabled controls to allow value update
      if (wasDisabled) {
        control.enable({ emitEvent: false });
      }
      
      control.patchValue(physicalData[key], { emitEvent: false });
      
      // Restore disabled state if control was previously disabled
      if (wasDisabled) {
        control.disable({ emitEvent: false });
      }
    }
  });

  // Store city location ID if provided
  if (physicalData.postalCityLocationId) {
    this.baseSvc.setBaseDealerFormData({
      postalCity: physicalData.postalCity,
      postalCityLocationId: physicalData.postalCityLocationId,
    });
  }

  // Mark toggle state as active
  this.baseFormData.physicalreuseOfPostalAddress = true;

  // Trigger change detection to update view
  this.cdr.detectChanges();
}




async getCities() {
  const selectedCountry = this.mainForm?.form.get("postalCountry")?.value || "New Zealand";

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
          this.cityOptions = filteredCities;
          this.cityOptionsLocationId = obj; // Store all city data with locationId

          this.mainForm.updateList("postalCity", filteredCities);
        }
      }
    );
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
  //       this.mainForm.updateList("postalUnitType", unitTypeList);
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
  //       this.mainForm.updateList("postalFloorType", floorTypeList);
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
  //       this.mainForm.updateList("postalStreetType", streetTypeList);
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
  //         this.mainForm?.form?.get("postalCountry")?.value ||
  //         this.baseFormData?.postalCountry ||
  //         "New Zealand";

  //       // Sort with selected country at top
  //       const sortedCountryList = this.sortOptionsWithSelectedOnTop(
  //         countryList,
  //         selectedCountry
  //       );

  //       this.mainForm.updateList("postalCountry", sortedCountryList);

  //       return sortedCountryList;
  //     }
  //   );

  //   // REPLACE THE CITY SECTION WITH THIS:
  //   await this.baseSvc.getFormData(
  //     `LookUpServices/locations?LocationType=City`,
  //     (res) => {
  //       let list = res.data;
  //       this.cityOptionsLocationId = list;

  //       const cityList = list.map((item) => ({
  //         label: item.name,
  //         value: item.name,
  //       }));

  //       // Store the original city options
  //       this.cityOptions = cityList;

  //       // Get currently selected value
  //       const selectedCity =
  //         this.mainForm?.form?.get("postalCity")?.value ||
  //         this.baseFormData?.postalCity ||
  //         "";

  //       // Sort with selected city at top
  //       const sortedCityList = this.sortOptionsWithSelectedOnTop(
  //         cityList,
  //         selectedCity
  //       );

  //       this.mainForm.updateList("postalCity", sortedCityList);

  //       return sortedCityList;
  //     }
  //   );
  // }

  override onValueChanges(event: any): void {
    if (event.postalSearchValue && event.postalSearchValue.length >= 4) {
      this.searchSvc.searchAddress(event.postalSearchValue).subscribe((res) => {
        this.searchAddressList = res;
        this.mainForm.updateList("postalSearchValue", this.searchAddressList);
      });
    }
  }

override async onFormEvent(event): Promise<void> {
  if (event.name === "postalCountry") {
    // Only call getCities if country value exists and has actually changed
    if (event?.value && event?.value !== this.tempCity) {
      await this.getCities();
      this.tempCity = event?.value;
    }
  }

  if (event.name === "postalAddressType") {
    if (event.value === "po") {
      // For P.O. Box - enable country dropdown
      this.mainForm.form.get("postalCountry")?.enable({ emitEvent: false });    
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
      // For Street - disable country dropdown
      this.mainForm.form.get("postalCountry")?.disable({ emitEvent: false }); 
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

  super.onFormEvent(event);
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
  if (!this.cityOptionsLocationId || this.cityOptionsLocationId?.length === 0) {
    return;
  }
  
  const LocationId = this.cityOptionsLocationId.filter(
    (l) => l.name === cityName
  );

  if (LocationId && LocationId?.length > 0 && LocationId[0]?.locationId) {
    this.baseSvc.setBaseDealerFormData({
      postalCity: cityName,
      postalCityLocationId: LocationId[0]?.locationId,
    });
  }
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
      }
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
      } else {
        if (this?.baseFormData?.physicalreuseOfPostalAddress) {
          this.mainForm.form.reset();
          this.mainForm.form.get("postalAddressType").patchValue("po");
        }
      }

      this.cdr.detectChanges();
    }
  }

  pageCode: string = "BusinessAddressDetailsComponent";
  modelName: string = "BusinessPostalAddressComponent";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();
  }

  // UPDATED METHOD: Enhanced blur event with street type auto-population
  override async onBlurEvent(event): Promise<void> {
    if (event.name == "postalSearchValue") {
      // if(event.data && event.data.length >= 4){
      this.searchSvc
        .getExternalAddressDetails(event.value.externalAddressLookupKey)
        .subscribe(async (res) => {
          //console.log("External business postal address result:", res);
          const formValues = this.searchSvc.mapAddressJsonToFormControls(
            res.data,
            "postal"
          );
          if (this.mainForm.form.get("postalAddressType")?.value === "po") {
            this.mainForm.form
              .get("postalStreetArea")
              .patchValue(formValues.postalStreetArea);
            this.mainForm.form
              .get("postalSuburbs")
              .patchValue(formValues.postalSuburbs);
            this.mainForm.form
              .get("postalCity")
              .patchValue(formValues.postalCity);
            this.mainForm.form
              .get("postalPostcode")
              .patchValue(formValues.postalPostcode);
            this.mainForm.form
              .get("postalCountry")
              .patchValue(formValues.postalCountry);
          } else {
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
          }
          // this.mainForm.get('postalCountry').disable({emitEvent:false});
        });
      // }
    }
    await this.updateValidation(event);
  }

  // this.mainForm.updateHidden({
  //           postalUnitType: false,
  //           postalFloorNumber: false,
  //           postalFloorType: false,
  //           postalBuildingName: false,
  //           postalRuralDelivery: false,
  //           postalStreetDirection: false,
  //           postalStreetType: false,
  //           postalStreetName: false,
  //           postalStreetNumber: false,
  //           postalUnitNumber: false,
  //           postalStreetArea: true,
  mapAddressJsonToFormControls(response: any): any {
    let componentMap: { [key: string]: string };

    if (this.selectedAddressType === "po") {
      componentMap = {
        street: "postalStreetArea",
      };
    } else if (this.selectedAddressType === "street") {
      componentMap = {
        BuildingName: "postalBuildingName",
        FloorType: "postalFloorType",
        FloorNo: "postalFloorNumber",
        UnitType: "postalUnitType",
        UnitLot: "postalUnitNumber",
        StreetNo: "postalStreetNumber",
        StreetName: "postalStreetName",
        StreetType: "postalStreetType",
        StreetDirection: "postalStreetDirection",
        RuralDelivery: "postalRuralDelivery",
      };
    }

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

    result["postalSuburbs"] = data?.suburb || "";
    result["postalCity"] = data?.city?.extName || "";
    result["postalPostcode"] = data?.zipCode || "";
    result["postalCountry"] = data?.countryRegion?.extName || "";

    return result;
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
      "BusinessPostalAddressComponent",
      this.mainForm.form.valid
    );
    if (this.baseSvc.showValidationMessage) {
      let invalidPages = this.checkStepValidity();
      this.baseSvc.iconfirmCheckbox.next(invalidPages);
    }
  }

  override ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
  this.reusePhysicalSubs?.unsubscribe();
  super.ngOnDestroy();
}
}
