import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, ToasterService } from "auro-ui";
import { BusinessService } from "../../../services/business";
import { BaseBusinessClass } from "../../../base-business.class";
import { ValidationService } from "auro-ui";
import { Subject, takeUntil } from "rxjs";
import { SearchAddressService } from "../../../../standard-quote/services/search-address.service";
import { IndividualService } from "../../../../individual/services/individual.service";

@Component({
  selector: "app-business-physical-address",
  templateUrl: "./business-physical-address.component.html",
  styleUrl: "./business-physical-address.component.scss",
})
export class BusinessPhysicalAddressComponent
  extends BaseBusinessClass
  implements OnChanges
{
  // privousChecked: any;
  index: any;
  physicalSeachValue: String;
  customerRoleForm: FormGroup;
  private destroySubject$ = new Subject<void>();
  year: boolean;

  @Input() copyToPreviousAddress = false;
  @Output() sendYearForPrevious = new EventEmitter<boolean>();
  searchAddressList: any[];
  cityOptions: any = [];
  cityOptionsLocationId: any = [];
  private countryOptions: any[] = [];
  private cityOptionsAll: any[] = [];

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
    this.baseSvc.formDataCacheableRoute([
      "LookUpServices/lookups?LookupSetName=Homeowner",
    ]);
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

  override title: string = "Address Details";
  override formConfig: GenericFormConfig = {
    headerTitle: "Physical Address",
    autoResponsive: true,
    cardType: "non-border",
    api: "",
    cardBgColor: "--background-color-secondary",
    // goBackRoute: '',
    fields: [
      // {
      //   type: 'checkbox',
      //   label: 'Create new and copy to previous Address',
      //   name: 'copyToPreviousAddress',
      //   hidden: true,
      //   default: false,
      // },
      {
        type: "autoSelect",
        label: "Search",
        name: "physicalSearchValue",
        idKey: "street",
        cols: 2,
        options: [],
        className: "my-1",
        rightIcon: true,
        icon: "fa-solid fa-location-crosshairs fa-lg",
        minLength: 3,
        nextLine: true,
        alignmentType: "vertical",
      },
      {
        type: "number",
        inputType: "vertical",
        label: "Time at Address",
        name: "physicalYear",
        maxLength: 2,
        className: "col-fixed w-4rem",
        labelClass: "lc mt-2 white-space-nowrap", 
        inputClass: "icr",
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
        // validators: [Validators.max(11)],   -- Auro
        errorMessage: "Value should be less than 12",
        className: "pt-3 mt-1  col-fixed w-4rem yearmonthClass",
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
        className: "  lg:col-offset-1 pl-0 ",
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
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],

        cols: 2,
        nextLine: false,
        inputType: "vertical",
        inputClass: "w-8 ",
      },
      {
        type: "select",
        label: "Floor Type",
        name: "physicalFloorType",
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
        label: "Floor No",
        name: "physicalFloorNumber",
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
        name: "physicalUnitType",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/)],
        className: "px-0 customLabel",
        cols: 2,
        // list$: "LookUpServices/custom_lookups?LookupSetName=UnitType",
        // idKey: "lookupValue",
        // idName: "lookupValue",
        options: [],
        alignmentType: "vertical",
        labelClass: "w-8 -my-3",
        nextLine: true,
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
        inputType: "vertical",
        nextLine: true,
      },
      {
        type: "text",
        label: "Unit/Lot Number",
        name: "physicalUnitNumber",
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
        name: "physicalStreetNumber",
        //validators: [Validators.required],
        //regexPattern: "[^0-9]*",
        className: " ",
        cols: 2,
        inputType: "vertical",
        inputClass: "w-8 ",
        nextLine: false,
      },

      {
        type: "text",
        label: "Street Name",
        name: "physicalStreetName",
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
        name: "physicalStreetType",
        //validators: [Validators.required],
        className: "px-0 customLabel",
        cols: 2,
        nextLine: false,
        // list$: "LookUpServices/custom_lookups?LookupSetName=StreetType",
        // idKey: "lookupValue",
        // idName: "lookupValue",
        options: [],
        alignmentType: "vertical",
        labelClass: "w-8 -my-3",
      },

      {
        type: "text",
        label: "Street Direction",
        name: "physicalStreetDirection",
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
        type: "text",
        label: "Rural Delivery",
        name: "physicalRuralDelivery",
        className: "",
        //validators: [Validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/)],
        cols: 2,
        inputType: "vertical",
        inputClass: "w-8 ",
        nextLine: true,
      },
      {
        type: "text",
        label: "Suburb",
        name: "physicalSuburbs",
        inputType: "vertical",
        inputClass: "w-8 ",
        // validators: [
        //   Validators.required,
        //   Validators.pattern(/^[A-Za-z0-9'\-\&\/.]*$/),
        // ],
        className: " ",
        cols: 2,
        maxLength: 20,
        nextLine: false,
      },
      {
        type: "select",
        label: "City",
        // inputType: "vertical",
        // inputClass:'w-8 ',
        // validators: [
        //   Validators.required,
        //   Validators.pattern(/^[A-Za-z0-9\-\/]*$/),
        // ],
        name: "physicalCity",
        alignmentType: "vertical",
        labelClass: "w-8 -my-3",
        //validators: [Validators.required],
        className: "px-0 customLabel",
        cols: 2,
        // list$: "LookUpServices/locations?LocationType=City",
        // idKey: "name",
        // idName: "name",
        options: this.cityOptions,
        // default: "New Zealand",
        nextLine: false,
      },
      {
        type: "text",
        inputType: "vertical",
        inputClass: "w-8 ",
        //regexPattern: "[^0-9]*",
        label: "Postcode",
        //validators: [Validators.required],
        name: "physicalPostcode",
        className: " ",
        cols: 2,
        maxLength: 10,
        nextLine: false,
      },

      {
        type: "select",
        label: "Country",
        name: "physicalCountry",
        alignmentType: "vertical",
        labelClass: "w-8 -my-3",
        //validators: [Validators.required],
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

override async ngOnInit(): Promise<void> {
  await super.ngOnInit();

  let params: any = this.route.snapshot.params;

  if (params.mode == "edit" && this.baseFormData) {
  }
  
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

  this.searchSvc
    .getPhysicalAddressData()
    .pipe(takeUntil(this.destroySubject$))
    .subscribe((data) => {
      if (data) {
        const { physicalreuseOfPostalAddress, physicalreuseOfRegisterAddress, ...restData } = data;
        this.mainForm.form.patchValue(restData);
      } else {
        this.mainForm?.form?.reset();
      }
    });

  // NEW APPROACH: Detect if form was just opened vs tab navigation
  const formSessionKey = 'businessFormActive';
  const isFormActive = sessionStorage.getItem(formSessionKey);
  
  // If form is NOT currently active, it means user just opened it (fresh or after cancel)
  const isFirstLoad = !isFormActive;
  
  // Mark form as active
  sessionStorage.setItem(formSessionKey, 'true');

//  console.log('Physical Address ngOnInit - isFirstLoad:', isFirstLoad);

  // Handle physicalreuseOfPostalAddress toggle
  if (isFirstLoad) {
    // Form just opened - ALWAYS reset to false
    this.mainForm?.get("physicalreuseOfPostalAddress")?.patchValue(false, { emitEvent: false });
    this.baseFormData.physicalreuseOfPostalAddress = false;
   // console.log('Set physicalreuseOfPostalAddress to FALSE (fresh open)');
  } else {
    // Tab navigation - restore the existing value from baseFormData
    const savedValue = this.baseFormData?.physicalreuseOfPostalAddress ?? false;
    this.mainForm?.get("physicalreuseOfPostalAddress")?.patchValue(savedValue, { emitEvent: false });
  //  console.log('Restored physicalreuseOfPostalAddress to:', savedValue);
  }

  // Handle physicalreuseOfRegisterAddress toggle
  if (isFirstLoad) {
    // Form just opened - ALWAYS reset to false
    this.mainForm?.get("physicalreuseOfRegisterAddress")?.patchValue(false, { emitEvent: false });
    this.baseFormData.physicalreuseOfRegisterAddress = false;
   // console.log('Set physicalreuseOfRegisterAddress to FALSE (fresh open)');
  } else {
    // Tab navigation - restore the existing value from baseFormData
    const savedValue = this.baseFormData?.physicalreuseOfRegisterAddress ?? false;
    this.mainForm?.get("physicalreuseOfRegisterAddress")?.patchValue(savedValue, { emitEvent: false });
   // console.log('Restored physicalreuseOfRegisterAddress to:', savedValue);
  }

  this.updateDropdownData();
  this.indSvc.updateDropdownData().subscribe((result) => {
    this.mainForm.updateList("physicalFloorType", result?.floorType);
    this.mainForm.updateList("physicalUnitType", result?.unitType);
    this.mainForm.updateList("physicalStreetType", result?.streetType);
    if (result?.country) {
      this.mainForm.updateList("physicalCountry", result?.country);
      this.mainForm?.form?.get("physicalCountry")?.setValue("New Zealand");
      this.mainForm.updateList("physicalCity", result?.city);
    }
  });
  
  if (this.baseSvc.showValidationMessage) {
    this.mainForm.form.markAllAsTouched();
  }
}


  // NEW METHOD: Add street type handling method for physical address
  async setStreetType(streetTypeValue: string) {
    try {
      // Ensure street type options are loaded
      const streetTypeOptions =
        this.mainForm?.fieldProps?.["physicalStreetType"]?.options;

      if (!streetTypeOptions || streetTypeOptions?.length === 0) {
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
          .get("physicalStreetType")
          .patchValue(matchedOption.value || matchedOption.label);
      }
    } catch (error) {
      console.error("Error setting physical street type:", error);
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
        this.mainForm.updateList("physicalFloorType", floorTypeList);
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
        this.mainForm.updateList("physicalUnitType", unitTypeList);
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
        this.mainForm.updateList("physicalStreetType", streetTypeList);
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

        // Store the options
        this.countryOptions = countryList;

        this.mainForm.updateList("physicalCountry", countryList);
        return countryList;
      }
    );

    await this.getCities();
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

  // NEW METHOD: Add place selection handler with street type auto-population
  async placeSelected(event: any, index: number) {
    if (event?.properties) {
      const data = event?.properties;

      // NEW: Add street type handling
      if (data?.streetType) {
        await this.setStreetType(data.streetType);
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

  tempCity = null;
  override async onFormEvent(event: any): Promise<void> {
    if (event.name === "physicalCity") {
      let locationName = this.mainForm?.form?.get("physicalCity")?.value;
      let LocationId = this.cityOptionsLocationId?.filter(
        (l) => l.name === locationName
      );

      if (LocationId && LocationId.length > 0 && LocationId[0]?.locationId) {
      this.baseSvc.setBaseDealerFormData({
        physicalCity: locationName,
        physicalCityLocationId: LocationId[0]?.locationId,
      });
    }
    }
    if (event.name == "physicalCountry") {
      // if(this.mainForm.form.get("physicalCountry").value){
      //   this.baseFormData.physicalCountry=this.mainForm.form.get("physicalCountry").value
      // }
      //   if (event.name == "physicalCountry" && event.value != "New Zealand") {
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
      //     await this.updateValidation("onInit");
      //   }
      if (event?.value != this.tempCity) {
        this.getCities();
      }
      this.tempCity = event?.value;
    }

    super.onFormEvent(event);
  }

  override async onValueTyped(event: any): Promise<void> {
    if (event.name === "physicalCity") {
      let locationName = this.mainForm.form.get("physicalCity").value;
      let LocationId = this.cityOptionsLocationId.filter(
        (l) => l.name === locationName
      );

      this.baseSvc.setBaseDealerFormData({
        physicalCity: locationName,
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
      this.sendYearForPrevious.emit(this.year);
    }

    if (event.name == "physicalreuseOfPostalAddress") {
      this.baseFormData.physicalCountry =
        this.mainForm.get("physicalCountry").value;
      // UPDATED: Save the toggle value to baseFormData to persist across tab navigation
      this.baseFormData.physicalreuseOfPostalAddress = event?.data;

      if (event?.data) {
        this.baseSvc.reusePhysical.next("copied");
      } else if (!event.data) {
        this.baseSvc.reusePhysical.next("undoCopy");
      }
    }

    // UPDATED: Handle physicalreuseOfRegisterAddress toggle value changes
    if (event.name == "physicalreuseOfRegisterAddress") {
      // UPDATED: Save the toggle value to baseFormData to persist across tab navigation
      this.baseFormData.physicalreuseOfRegisterAddress = event.data;

      // Add any additional logic for register address reuse here if needed
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
        // await this.updateValidation("onInit");
      }
      //       if(event.name ==='physicalSearchValue'){
      //   if(event.data && event.data.length >= 4){
      //   this.searchSvc.searchAddress(event.data).subscribe(res => {
      //       this.searchAddressList = res;
      //       // this.mainForm.updateList('')
      //   })
      //   }
      // }
      if (event.name === "physicalCountry") {
        // this.getCities();
      }
    }
    await this.updateValidation("onInit");
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
                label: city?.name,
                value: city?.name,
                id: city?.id,
              }));

            // Store the filtered options

            //this.baseSvc.storeDropDownValuesCity=filteredCities
            this.cityOptions = filteredCities;
            this.cityOptionsLocationId = obj;

            this.mainForm.updateList("physicalCity", filteredCities);
          }
        }
      );
    }
  }
override onValueChanges(event: any) {
  // Only process if the event actually contains the toggle field changes
  if (event.physicalreuseOfPostalAddress !== undefined) {
    this.baseFormData.physicalCountry = this.mainForm.get("physicalCountry").value;
    this.baseFormData.physicalreuseOfPostalAddress = event?.physicalreuseOfPostalAddress;

    if (event.physicalreuseOfPostalAddress) {
      const physicalData = {
        postalBuildingName: this.mainForm.get('physicalBuildingName')?.value,
        postalFloorType: this.mainForm.get('physicalFloorType')?.value,
        postalFloorNumber: this.mainForm.get('physicalFloorNumber')?.value,
        postalUnitType: this.mainForm.get('physicalUnitType')?.value,
        postalUnitNumber: this.mainForm.get('physicalUnitNumber')?.value,
        postalStreetNumber: this.mainForm.get('physicalStreetNumber')?.value,
        postalStreetName: this.mainForm.get('physicalStreetName')?.value,
        postalStreetType: this.mainForm.get('physicalStreetType')?.value,
        postalStreetDirection: this.mainForm.get('physicalStreetDirection')?.value,
        postalRuralDelivery: this.mainForm.get('physicalRuralDelivery')?.value,
        postalSuburbs: this.mainForm.get('physicalSuburbs')?.value,
        postalCity: this.mainForm.get('physicalCity')?.value,
        postalCityLocationId: this.baseFormData.physicalCityLocationId,
        postalPostcode: this.mainForm.get('physicalPostcode')?.value,
        postalCountry: this.mainForm.get('physicalCountry')?.value,
        postalStreetArea: this.mainForm.get('physicalStreetArea')?.value,
        postalSearchValue: this.mainForm.get('physicalSearchValue')?.value,
        postalAddressType: 'street', 
        addressComponentTemplateHdrId: 1
      };

      Object.keys(physicalData).forEach(key => {
        this.baseFormData[key] = physicalData[key];
      });

      this.baseSvc.reusePhysical.next({ action: 'copied', data: physicalData });
      
    } else {
      this.baseSvc.reusePhysical.next({ action: 'undoCopy', data: null });
    }
  }

    // UPDATED: Handle physicalreuseOfRegisterAddress toggle value changes
  if (event.physicalreuseOfRegisterAddress !== undefined) {
    this.baseFormData.physicalCountry = this.mainForm.get("physicalCountry").value;
    this.baseFormData.physicalreuseOfRegisterAddress = event?.physicalreuseOfRegisterAddress;

    if (event.physicalreuseOfRegisterAddress) {
      const physicalData = {
        registerBuildingName: this.mainForm.get('physicalBuildingName')?.value,
        registerFloorType: this.mainForm.get('physicalFloorType')?.value,
        registerFloorNumber: this.mainForm.get('physicalFloorNumber')?.value,
        registerUnitType: this.mainForm.get('physicalUnitType')?.value,
        registerUnitNumber: this.mainForm.get('physicalUnitNumber')?.value,
        registerStreetNumber: this.mainForm.get('physicalStreetNumber')?.value,
        registerStreetName: this.mainForm.get('physicalStreetName')?.value,
        registerStreetType: this.mainForm.get('physicalStreetType')?.value,
        registerStreetDirection: this.mainForm.get('physicalStreetDirection')?.value,
        registerRuralDelivery: this.mainForm.get('physicalRuralDelivery')?.value,
        registerSuburbs: this.mainForm.get('physicalSuburbs')?.value,
        registerCity: this.mainForm.get('physicalCity')?.value,
        registerCityLocationId: this.baseFormData.physicalCityLocationId,
        registerPostcode: this.mainForm.get('physicalPostcode')?.value,
        registerCountry: this.mainForm.get('physicalCountry')?.value,
        registerStreetArea: this.mainForm.get('physicalStreetArea')?.value,
      };

      Object.keys(physicalData).forEach(key => {
        this.baseFormData[key] = physicalData[key];
      });

      this.baseSvc.reusePhysical.next({ action: 'copiedToRegister', data: physicalData });
    } else {
      this.baseSvc.reusePhysical.next({ action: 'undoCopyRegister', data: null });
    }
  }

    if (event?.physicalSearchValue && event?.physicalSearchValue?.length >= 4) {
      this.searchSvc
        .searchAddress(event?.physicalSearchValue)
        .subscribe((res) => {
          this.searchAddressList = res;
          this.mainForm.updateList(
            "physicalSearchValue",
            this.searchAddressList
          );
        });
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
    //     this.physicalSeachValue = "";
    //     this.mainForm.form.reset();
    //   }, 500);
    // }
  }

  pageCode: string = "BusinessAddressDetailsComponent";
  modelName: string = "BusinessPhysicalAddressComponent";

  override async onFormReady(): Promise<void> {
    // await this.getCities();
    await this.updateValidation("onInit");
    super.onFormReady();
  }

  override async onBlurEvent(event): Promise<void> {
    if (event.name == "physicalSearchValue") {
      this.searchSvc
        .getExternalAddressDetails(event.value.externalAddressLookupKey)
        .subscribe(async (res) => {
          //console.log("External physical address result:", res);
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
          const options = this.mainForm.fieldProps['physicalStreetType'].options;
          this.mainForm.get('physicalStreetType').setValue(options?.find(obj=>obj.lookupCode == formValues?.physicalStreetType?.toUpperCase())?.value)
          */

          this.mainForm.get("physicalCity").setValue(formValues?.physicalCity);

          // this.mainForm.get('physicalCountry').disable({emitEvent:false});
        });
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
    if (!this.baseSvc.previousAddressComponentStatus) {
      this.baseSvc.updateComponentStatus(
        "Address Details",
        "BusinessPreviousAddressComponent",
        true
      ); // this is when previous address component is hidden
    }
    this.baseSvc.updateComponentStatus(
      "Address Details",
      "BusinessPhysicalAddressComponent",
      this.mainForm.form.valid
    );
    if (this.baseSvc.showValidationMessage) {
      let invalidPages = this.checkStepValidity();
      this.baseSvc.iconfirmCheckbox.next(invalidPages);
    }
  }

override ngOnDestroy(): void {
  // ONLY clear subscriptions here.
  this.destroySubject$.next();
  this.destroySubject$.complete();

  
}


}
