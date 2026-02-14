import { ChangeDetectorRef, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, Mode, ToasterService } from "auro-ui";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BaseIndividualClass } from "../../../base-individual.class";
import { IndividualService } from "../../../services/individual.service";
import { ValidationService } from "auro-ui";
import { SearchAddressService } from "../../../../standard-quote/services/search-address.service";

@Component({
  selector: "app-previous-address",
  templateUrl: "./previous-address.component.html",
  styleUrl: "./previous-address.component.scss",
})
export class PreviousAddressComponent extends BaseIndividualClass {
  optionsdata = [{ label: "icashpro", value: "icp" }];
  flag: boolean = false;
  index: number;
  previousSearchValue: String;
  customerRoleForm: FormGroup;
  private countryOptions: any[] = [];
  private cityOptionsAll: any[] = [];
  searchAddressList: any;
  cityOptions: any = [];
  cityOptionsLocationId: any = [];

override formConfig: GenericFormConfig = {
  headerTitle: "Previous Physical Address",
  autoResponsive: true,
  cardType: "border",
  //cardBgColor: "--background-color-secondary",
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
    // OLD SELECT FIELD CODE - Changed to text field initially (default is NZ Address)
    // When Overseas Address toggle is ON, it will be changed to select dropdown dynamically
    // {
    //   type: "select",
    //   label: "Country",
    //   name: "previousCountry",
    //     //validators: [Validators.required],
    //   className: "px-0 customLabel",
    //   filter: true,
    //   cols: 2,
    //     // list$: "LookUpServices/locations?LocationType=country",
    //     // idKey: "name",
    //   alignmentType: "vertical",
    //   labelClass: "w-8 -my-3",
    //     // idName: "name",
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
  }

 

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    if (this.mainForm.form.get("overseasAddress").value) {
      this.hiddenfieldbyOverseas(this.baseFormData?.overseasAddress || true);
    } else {
      this.hiddenfieldbyOverseas("");
    }
    if (this.baseSvc.showValidationMessage) {
      this.mainForm.form.markAllAsTouched();
    }

    if (this.mainForm?.form) {
    }

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
    this.baseSvc.updateDropdownData().subscribe((result) => {
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

    let portalWorkflowStatus = sessionStorage.getItem("workFlowStatus");
    if (
      (portalWorkflowStatus != 'Open Quote') || 
      (this.baseFormData?.AFworkflowStatus && 
       this.baseFormData.AFworkflowStatus !== 'Quote')
    ) {
      this.mainForm?.form?.disable();
    } else { 
      this.mainForm?.form?.enable();
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

  async placeSelected(event: any, index: number) {
    if (event.properties) {
      const data = event.properties;

      // NEW: Add street type handling similar to physical address
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

  // NEW METHOD: Add street type handling method similar to physical address
  async setStreetType(streetTypeValue: string) {
    try {
      // Ensure street type options are loaded
      const streetTypeOptions =
        this.mainForm?.fieldProps?.["previousStreetType"]?.options;

      if (!streetTypeOptions || streetTypeOptions.length === 0) {
        console.warn(
          "Previous street type options not loaded yet, retrying..."
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
          "⚠️ No matching previous street type found for:",
          streetTypeValue
        );
        //  console.log('Available options:', streetTypeOptions.map(o => o.value || o.label));
      }
    } catch (error) {
      console.error("Error setting previous street type:", error);
    }
  }

  // if ((res.netTradeAmount||res.netTradeAmount==0) && this.baseFormData.netTradeAmount != res.netTradeAmount) {
  //   this.updateDisableValue({ key: 'totalBorrowedAmount', value: (res.netTradeAmount)
  pageCode: string = "AddressDetailsComponent";
  modelName: string = "PreviousAddressComponent";

  // if (this.formData?.previousTextArea){

  // }

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
     let portalWorkflowStatus = sessionStorage.getItem("workFlowStatus");
    if (
      (portalWorkflowStatus != 'Open Quote') || 
      (this.baseFormData?.AFworkflowStatus && 
       this.baseFormData.AFworkflowStatus !== 'Quote')
    ) {
      this.mainForm?.form?.disable();
    } else { 
      this.mainForm?.form?.enable();
    }
  }

  override async onFormReady(): Promise<void> {
      const overseas = this.mainForm.form.get('overseasAddress')?.value;

  // this.getCities();
  
  
  await this.updateValidation("onInit");
  
  //  Handle initial state of overseasAddress
  if (this.baseFormData.overseasAddress) {
    // If overseas address is already enabled from saved data
    this.hiddenfieldbyOverseas(this.baseFormData.overseasAddress);
    
    // Disable the search field on load
    this.mainForm.form.get("previousSearchValue")?.disable({ emitEvent: false });
    
    // Clear any existing search value
    this.mainForm.form.get("previousSearchValue")?.patchValue("", { emitEvent: false });
    
    // // Make the search field unclickable (COMMENTED - using disable is enough)
    // this.mainForm.updateProps("previousSearchValue", {
    //   readOnly: true,
    //   disabled: true,
    // });
  }

  if (this.baseFormData?.addressDetails?.length) {
    this.mainForm
      .get("previousStreetArea")
      ?.patchValue(this.baseFormData?.addressDetails[2]?.street);
  }

    super.onFormReady();
     let portalWorkflowStatus = sessionStorage.getItem("workFlowStatus");
    if (
      (portalWorkflowStatus != 'Open Quote') || 
      (this.baseFormData?.AFworkflowStatus && 
       this.baseFormData.AFworkflowStatus !== 'Quote')
    ) {
      this.mainForm?.form?.disable();
    } else { 
      this.mainForm?.form?.enable();
    }
  }

  // override onFormDataUpdate(res: any): void {
  //   console.log(res)
  //   if (
  //     this.baseFormData?.copyToPreviousAddress != res?.copyToPreviousAddress
  //   ) {
  //     setTimeout(() => {
  //         console.log(res)
  //       if (
  //         (res.physicalCountry != "New Zealand" ||
  //           res.physicalCountry == undefined)
  //       ) {
  //         this.mainForm.updateHidden({
  //           previousStreetArea: false,
  //           previousUnitType: true,
  //           previousFloorNumber: true,
  //           previousFloorType: true,
  //           previousBuildingName: true,
  //           previousRuralDelivery: true,
  //           previousStreetDirection: true,
  //           previousStreetType: true,
  //           previousStreetName: true,
  //           previousStreetNumber: true,
  //           previousUnitNumber: true,
  //           previousResidenceType: true,
  //           previousYear: true,
  //           previousMonth: true,
  //           month:true,
  //         year:true,
  //         overseasAddress:false
  //         });
  //       } else {
  //         this.mainForm.updateHidden({
  //           previousUnitType: false,
  //           previousFloorNumber: false,
  //           previousFloorType: false,
  //           previousBuildingName: false,
  //           previousRuralDelivery: false,
  //           previousStreetDirection: false,
  //           previousStreetType: false,
  //           previousStreetName: false,
  //           previousStreetNumber: false,
  //           previousUnitNumber: false,
  //           previousStreetArea: true,
  //           previousResidenceType: false,
  //           previousYear: false,
  //           previousMonth: false,
  //           month:false,
  //         year:false,
  //         overseasAddress:false
  //         });
  //       }
  //     }, 100);

  //     const fields = [
  //       "BuildingName",
  //       "City",
  //       "Country",
  //       "FloorNumber",
  //       "FloorType",
  //       "Month",
  //       "Postcode",
  //       "ResidenceType",
  //       "RuralDelivery",
  //       "StreetDirection",
  //       "StreetName",
  //       "StreetNumber",
  //       "StreetType",
  //       "Suburbs",
  //       "UnitNumber",
  //       "UnitType",
  //       "Year"
  //     ];

  // //       const previous = [
  // //   "previousFloorType",
  // //   "previousBuildingName",
  // //   "previousUnitType",
  // //   "previousStreetArea",
  // //   // previousSearchValue,
  // //   "previousCity",
  // //   "previousYear",
  // //   'previousMonth',
  // //   'previousUnitNumber',
  // //   'previousCountry',
  // //   'previousPostcode',
  // //   'previousResidenceType',
  // //   'previousRuralDelivery',
  // //   'previousStreetDirection',
  // //   'previousStreetName',
  // //   'previousStreetNumber',
  // //   'previousStreetType',
  // //  'previousSuburbs',
  // //  //previousTimeAtAddress,
  // //   'previousFloorNumber',
  // //   'previousSearchCountry'
  // //       ];

  // fields.forEach((field) => {
  //   alert(res[`physical${field}`])
  //       const controlName = `previous${field}`;
  //       const previousField = this.mainForm?.form?.get(controlName);
  //       const physicalValue = res[`physical${field}`];

  //       if (!previousField) {
  //         console.warn(`❌ Control not found: ${controlName}`);
  //         return;
  //       }
  //       if (physicalValue === undefined || physicalValue === null) {
  //         console.warn(`⚠️ No data in response for key: physical${field}`);
  //         return;
  //       }

  //       previousField.enable();
  //       previousField.patchValue(physicalValue);
  //       console.log(`✅ Patched ${controlName} with value: ${physicalValue}`);
  //     });

  //   }
  // }

  override async onFormDataUpdate(res: any): Promise<void> {}

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
        "Suburb",
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
    
    // Step 1: ALWAYS clear all address fields first (regardless of Yes or No)
    this.clearAllAddressFields();
    
    if (event.data) {
      // Step 2: When toggle is set to "Yes" (true) - Overseas Address
      
      // Step 3: Hide/show appropriate fields for overseas address
      this.hiddenfieldbyOverseas(true);
      
      // Step 4: DISABLE the search address field
      this.mainForm.form.get("previousSearchValue")?.disable({ emitEvent: false });
      
      // // Step 5: Make the search field unclickable (COMMENTED - using disable is enough)
      // this.mainForm.updateProps("previousSearchValue", {
      //   readOnly: true,
      //   disabled: true,
      // });

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
      // this.mainForm.updateProps("previousSearchValue", {
      //   readOnly: false,
      //   disabled: false,
      // });

      // Step 6: Set country back to New Zealand
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
    // if (event.data) {
    //   this.hiddenfieldOver(this.baseFormData.physicalCountry);
    //   this.mainForm.get("previousSearchValue").disable();
    // } else {
    //   this.hiddenfield("");
    //   this.mainForm.get("previousSearchValue").enable();
    // }
  }
  // if (event.name === 'previousCountry') {
  //   this.getCities()
  // }
  
  await this.updateValidation(event);
  this.checkTimeInPreviousPhysicalAddress();
}

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
    this.baseSvc.updateDropdownData().subscribe((result) => {
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

            this.cityOptionsAll = filteredCities;
            this.cityOptionsLocationId = obj;

            this.cityOptions = filteredCities;
this.mainForm.updateList("previousCity", filteredCities);

          }
        }
      );
    }
  }

  override async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
    if (event.name == "previousSearchValue") {
      // if(event.data && event.data.length >= 4){
      this.searchSvc
        .getExternalAddressDetails(event.value.externalAddressLookupKey)
        .subscribe(async (res) => {
          console.log("External previous address result:", res);
          const formValues = this.searchSvc.mapAddressJsonToFormControls(
            res.data,
            "previous"
          );

          // Patch form values first
          this.mainForm.form.patchValue(formValues);

          // IMPROVED: Better street type handling with proper timing - similar to physical address
          // if (formValues.previousStreetType) {
          //   setTimeout(async () => {
          //     await this.setStreetType(formValues.previousStreetType);
          //   }, 300);
          // }

          // COMMENTED OUT: Old street type handling method
          /*
          const options = await this.mainForm.fieldProps["previousStreetType"]
            .options;
          this.mainForm
            .get("previousStreetType")
            .setValue(
              options?.find(
                (obj) =>
                  obj.lookupCode ==
                  formValues?.previousStreetType?.toUpperCase()
              )?.value
            );
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

    if (this.baseSvc.previousAddressComponentStatus) {
      this.baseSvc.updateComponentStatus(
        "Address Details",
        "PreviousAddressComponent",
        this.mainForm.form.valid
      ); // this is when previous address component is not hidden
    } else {
      this.baseSvc.updateComponentStatus(
        "Address Details",
        "PreviousAddressComponent",
        true
      ); // this is when previous address component is hidden
    }

    if (this.baseSvc.showValidationMessage) {
      let invalidPages = this.checkStepValidity();
      this.baseSvc.iconfirmCheckbox.next(invalidPages);
    }
    // this.checkStepValidity()
  }

  // async hiddenfield(country) {
  //   if (country == "New Zealand") {
  //     this.mainForm.updateHidden({
  //       previousStreetArea: false,
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
  //       previousResidenceType: true,
  //       // previousSearchValue: true
  //       previousYear: true,
  //       previousMonth: true,
  //       year: true,
  //       month: true,
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
  //       previousResidenceType: false,
  //       // previousSearchValue: false,
  //       previousYear: false,
  //       previousMonth: false,
  //       year: false,
  //       month: false,
  //     });
  //     await this.updateValidation("onInit");
  //   }

  //   // this.pathcValue(this.baseFormData);
  // }

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

      // Clear the country field when overseas is enabled
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

      this.mainForm
        .get("previousCountry")
        .patchValue("New Zealand", { emitEvent: true });
      this.baseSvc.setBaseDealerFormData({
        previousCountry: "New Zealand",
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
    checkTimeInPreviousPhysicalAddress(): void {
    const yCtrl = this.mainForm.get("previousYear");
    const mCtrl = this.mainForm.get("previousMonth");
    const yearValue = yCtrl?.value;
    const monthValue = mCtrl?.value;
    if (yearValue == 0 && monthValue == 0) {
      yCtrl?.setErrors({ required: true });
      mCtrl?.setErrors({ required: true });
    } 
  }
}
