import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import {
  CommonService,
  GenericFormConfig,
  ToasterService,
  ValidationService,
} from "auro-ui";
import { SoleTradeService } from "../../../services/sole-trade.service";
import { BaseSoleTradeClass } from "../../../base-sole-trade.class";
import { SearchAddressService } from "../../../../standard-quote/services/search-address.service";
import { Subject, takeUntil } from "rxjs";
import { IndividualService } from "../../../../individual/services/individual.service";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-sole-trade-physical-address",
  templateUrl: "./sole-trade-physical-address.component.html",
  styleUrl: "./sole-trade-physical-address.component.scss",
})
export class SoleTradePhysicalAddressComponent
  extends BaseSoleTradeClass
  implements OnChanges
{
  optionsdata = [{ label: "icashpro", value: "icp" }];
  private destroySubject$ = new Subject<void>();
  @Input() copyToPreviousAddress = false;
  privousChecked: any;
  borrowedAmount: any;
  searchAddressList: any[];
  private countryOptions: any[] = [];
  private cityOptionsAll: any[] = [];
  cityOptions: any = [];
  cityOptionsLocationId: any = [];
  physicalSeachValue: String;
  customerRoleForm: FormGroup;
  year: boolean;

  override formConfig: GenericFormConfig = {
    headerTitle: " Current Physical Address",
    autoResponsive: true,
    api: "",
    goBackRoute: "",
    cardType: "non-border",
    cardBgColor: "--background-color-secondary",
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
        className: "px-0 customLabel",
        alignmentType: "vertical",
        labelClass: "w-8 -my-3",
      },
      {
        type: "number",
        inputType: "vertical",
        label: "Time at Address",
        name: "physicalYear",
        maxLength: 2,
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
        label: "Reuse for Postal Addresss ",
        name: "physicalReuseOff",
        className: "  lg:col-offset-1 pl-0 ",
        cols: 3,
        alignmentType: "vertical",
        offLabel: "Yes",
        onLabel: "No",
        // nextLine: true,
      },
      {
        type: "toggle",
        label: "Reuse for Register Address",
        name: "physicalreuseOfRegisterAddress",
        className: "lg:col-offset-1 pl-0 ",
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
        className: "px-0 customLabel",
        alignmentType: "vertical",
        labelClass: "w-8 -my-3",
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
        /* validators: [
          Validators.required,
          Validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/),
        ], -- Auro UI */
        name: "physicalCity",
        options: this.cityOptions,
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
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: SoleTradeService,
    public searchSvc: SearchAddressService,
    public validationSvc: ValidationService,
    private toasterService: ToasterService,
    public fb: FormBuilder,
    private indSvc: IndividualService
  ) {
    super(route, svc, baseSvc);
    this.baseSvc.formDataCacheableRoute([
      "LookUpServices/lookups?LookupSetName=Homeowner",
    ]);
  }

  override title: string = "Address Details";

  // NEW METHOD: Add street type handling method for sole trade physical address
  async setStreetType(streetTypeValue: string) {
    try {
      // Ensure street type options are loaded - using getOptions method for sole trade component
      const streetTypeOptions = await this.mainForm.getOptions(
        "physicalStreetType"
      );

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
          .get("physicalStreetType")
          .patchValue(matchedOption.value || matchedOption.label);
      }
    } catch (error) {}
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();

    this.customerRoleForm = this.fb.group({
      physicalSeachValue: ["", Validators.required],
    });
    let params: any = this.route.snapshot.params;
    if (params.mode == "edit" && this.baseFormData) {
    }
    setTimeout(async () => {
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
    }, 100);
    this.searchSvc
      .getPhysicalAddressData()
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((data) => {
        if (data) {
          this.mainForm.form.patchValue(data);
        } else {
          this.mainForm?.form.reset();
        }
      });
    // this.mainForm?.get("physicalReuseOff").patchValue(false);
    // this.baseFormData.physicalReuseOff = false;

    this.updateDropdownData();

    if (this.baseSvc.showValidationMessage) {
      this.mainForm.form.markAllAsTouched();
    }

    this.indSvc.updateDropdownData().subscribe((result) => {
      this.mainForm.updateList("physicalFloorType", result?.floorType);
      this.mainForm.updateList("physicalUnitType", result?.unitType);
      this.mainForm.updateList("physicalStreetType", result?.streetType);
      if (result?.country) {
        this.countryOptions = result.country;
        this.mainForm.updateList("physicalCountry", result?.country);
        this.mainForm?.form?.get("physicalCountry")?.setValue("New Zealand");
       this.mainForm.updateList("physicalCity", result?.city);

      }
    });
  }

  async updateDropdownData() {
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

    await this.getCities();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.mainForm?.form &&
      changes["copyToPreviousAddress"].currentValue !=
        changes["copyToPreviousAddress"].previousValue
    ) {
      this.mainForm?.form
        .get("copyToPreviousAddress")?.patchValue(changes["copyToPreviousAddress"].currentValue);
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

      if (data.country) {
        // this.mainForm.get("physicalCountry").patchValue(data.country);
        this.mainForm.get("physicalSearchCountry").patchValue(data.country);
      }
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
  pageCode: string = "SoleTradeAddressDetailsComponent";
  modelName: string = "SoleTradePhysicalAddressComponent";

  override async onFormReady(): Promise<void> {
    // await this.getCities();
    await this.updateValidation("onInit");
    super.onFormReady();
  }
  tempCity = null;
  override onFormEvent(event: any): void {
    if (event.name === "physicalCity") {
      let locationName = this.mainForm.form.get("physicalCity").value;
      let LocationId = this.cityOptionsLocationId.filter(
        (l) => l.name === locationName
      );

      this.baseSvc.setBaseDealerFormData({
        physicalCityLocationId: LocationId[0]?.locationId,
      });
     
    }
    // if (event.name === "physicalCountry" && event?.value) {
    //   if (event?.value != this.tempCity) {
    //     this.getCities();
    //     if (this.countryOptions.length > 0) {
    //       const sortedCountryList = this.baseSvc.sortOptionsWithSelectedOnTop(
    //         this.countryOptions,
    //         event.value
    //       );
    //       this.mainForm.updateList("physicalCountry", sortedCountryList);
    //     }
    //   }
    //   this.tempCity = event?.value;
    // }
    super.onFormEvent(event);
  }
  override async onValueChanges(event: any) {
    if (event.physicalReuseOff) {
      this.baseFormData.physicalCountry =
        this.mainForm.get("physicalCountry").value;
      this.baseSvc.reusePhysical.next("copied");
    } else {
      this.baseSvc.reusePhysical.next("undoCopy");
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
    //  if(event.name === 'physicalCountry'){
    //   this.getCities()
    // }
    await this.updateValidation("onInit");
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

            this.cityOptionsAll = filteredCities;
            this.cityOptionsLocationId = obj;

          this.cityOptions = filteredCities;
this.mainForm.updateList("physicalCity", filteredCities);

          }
        }
      );
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

  // UPDATED METHOD: Enhanced blur event with street type auto-population
  override async onBlurEvent(event): Promise<void> {
    // await this.updateValidation(event);
    if (event.name == "physicalSearchValue") {
      // if(event.data && event.data.length >= 4){
      this.searchSvc
        .getExternalAddressDetails(event.value.externalAddressLookupKey)
        .subscribe(async (res) => {
          const formValues = this.mapAddressJsonToFormControls(res.data);

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
  }

  override onStepChange(stepperDetails: any): void {
    super.onStepChange(stepperDetails);

    if (!this.baseSvc.previousAddressComponentStatus) {
      this.baseSvc.updateComponentStatus(
        "Address Details",
        "SoleTradePreviousAddressComponent",
        true
      ); // this is when previous address component is hidden
    }

    this.baseSvc.updateComponentStatus(
      "Address Details",
      "SoleTradePhysicalAddressComponent",
      this.mainForm.form.valid
    );
    if (this.baseSvc.showValidationMessage) {
      let invalidPages = this.checkStepValidity();
      this.baseSvc.iconfirmCheckbox.next(invalidPages);
    }
  }
}
