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
import { Subscription } from "rxjs";
import { IndividualService } from "../../../../individual/services/individual.service";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-sole-trade-postal-address",
  templateUrl: "./sole-trade-postal-address.component.html",
  styleUrl: "./sole-trade-postal-address.component.scss",
})
export class SoleTradePostalAddressComponent extends BaseSoleTradeClass {
  optionsdata = [{ label: "icashpro", value: "icp" }];
  flag: boolean = true;
  postalSearchValue: String;
  reusePhysicalSubs: Subscription;
  index: number;
  customerRoleForm: FormGroup;
  private countryOptions: any[] = [];
  private cityOptionsAll: any[] = [];
  searchAddressList: any[];
  cityOptions: any = [];
  cityOptionsLocationId: any = [];

  fields = [
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

  override formConfig: GenericFormConfig = {
    headerTitle: "Postal Address",
    autoResponsive: true,
    api: "postalAddress",
    goBackRoute: "postalAddress",
    cardType: "non-border",
    cardBgColor: "--background-color-secondary",
    fields: [
      {
        type: "radio",
        options: [
          { label: "Postal", value: "po" },
          { label: "Street", value: "street" },
        ],
        name: "postalAddressType",
        className: "flex white-space-nowrap",
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
        rightIcon: true,
        icon: "fa-solid fa-location-crosshairs fa-lg",
        minLength: 3,
        nextLine: true,
        // //validators: [Validators.required], // validation Comment
      },
      // {
      //   type: "text",
      //   label: "Postal Type ",
      //   name: "postalType",
      //   cols: 3,
      //   inputClass:'w-8',
      //   inputType:'vertical',
      //   /*  //validators: [
      //     validators.required,
      //     validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/),
      //   ],  -- Auro */
      //   nextLine: false,
      //   maxLength: 6,
      // },
      // {
      //   type: "phone",
      //   label: "Postal Number ",
      //   name: "postalNumber",
      //   className: " ",
      //   inputClass:'w-8',
      //   inputType:'vertical',
      //   cols: 3,
      //   /* //validators: [
      //     validators.required,
      //     validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/),
      //   ],  Auro UI */
      //   nextLine: true,
      // },

      {
        type: "text",
        label: "Building Name",
        name: "postalBuildingName",
        className: " ",
        inputClass: "w-8",
        inputType: "vertical",
        // //validators: [validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/)],   --Auro
        cols: 2,
        nextLine: false,
      },
      {
        type: "select",
        labelClass: "w-8 -my-3",
        alignmentType: "vertical",
        label: "Floor Type",
        name: "postalFloorType",
        // //validators: [validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/)],   --Auro Ui
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
        // //validators: [validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/)],   -- Auro
        className: " ",
        inputType: "vertical",
        inputClass: "w-8",
        cols: 2,
        nextLine: false,
      },

      {
        type: "select",
        labelClass: "w-8 -my-3",
        alignmentType: "vertical",
        label: "Unit Type",
        name: "postalUnitType",
        // //validators: [validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/)],  --Auro
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
        // //validators: [validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/)],   --Auro
        textAreaRows: 4,
        className: "mb-1 mt-1",
        cols: 12,
        rows: 1,
        hidden: true,
        nextLine: true,
        inputType: "vertical",
      },
      {
        type: "text",
        label: "Unit/Lot Number",
        name: "postalUnitNumber",
        // //validators: [validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/)],  --Auro
        className: " ",
        cols: 2,
        nextLine: false,
        inputClass: "w-8",
        inputType: "vertical",
      },

      {
        type: "text",
        label: "Street Number",
        name: "postalStreetNumber",
        /*  //validators: [
          validators.required,
          validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/),
        ],   -- Auro */
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
        inputClass: "w-8",
        inputType: "vertical",
        /* //validators: [
          validators.required,
          validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/),
        ],   -- Auro */
        className: "",
        cols: 2,
        nextLine: false,
      },
      {
        type: "select",
        labelClass: "w-8 -my-3",
        alignmentType: "vertical",
        label: "Street Type",
        name: "postalStreetType",
        filter: true,
        // //validators: [validators.required],   --Auro
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
        inputClass: "w-8",
        inputType: "vertical",
        /*  //validators: [
          validators.required,
          validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/),
        ],       --Auro */
        className: "",
        cols: 2,
        nextLine: false,
      },
      {
        type: "text",
        label: "Rural Delivery",
        name: "postalRuralDelivery",
        inputClass: "w-8",
        inputType: "vertical",
        className: "",
        // //validators: [validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/)],   --
        cols: 2,
        nextLine: true,
      },
      {
        type: "text",
        label: "Suburb",
        name: "postalSuburbs",
        inputClass: "w-8",
        inputType: "vertical",
        // //validators: [validators.pattern(/^[A-Za-z0-9'\-\&\/. ]*$/)],
        className: " ",
        cols: 2,
        maxLength: 20,
        nextLine: false,
      },
      {
        type: "select",
        label: "City",
        name: "postalCity",
        inputClass: "w-8",
        labelClass: "w-8 -my-3",
        alignmentType: "vertical",
        className: "px-0 customLabel",
        cols: 2,
        options: this?.cityOptions,
        nextLine: false,
      },
      {
        type: "text",
        label: "Postcode",
        name: "postalPostcode",
        inputClass: "w-8",
        inputType: "vertical",
        // //validators: [validators.required],  -- Auro
        className: "",
        cols: 2,
        maxLength: 10,
        //regexPattern: "[^0-9]*",
        nextLine: false,
      },
      {
        type: "select",
        labelClass: "w-8 -my-3",
        alignmentType: "vertical",
        label: "Country",
        name: "postalCountry",
        // //validators: [validators.required],   --Auro
        className: "px-0 customLabel",
        cols: 2,
        // list$: "LookUpServices/locations?LocationType=country",
        // idKey: "name",
        // idName: "name",
        options: [],
        filter: true,
        default: "New Zealand",
        nextLine: false,
      },
      {
        type: "text",
        label: "postalSearchCountry",
        inputClass: "w-8",
        inputType: "vertical",
        maxLength: 20,

        name: "postalSearchCountry",
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

    if (this.baseSvc.showValidationMessage) {
      this.mainForm.form.markAllAsTouched();
    }

    this.customerRoleForm = this.fb.group({
      postalSearchValue: ["", Validators.required],
    });

    this.indSvc.updateDropdownData().subscribe((result) => {
      this.mainForm.updateList("postalFloorType", result?.floorType);
      this.mainForm.updateList("postalUnitType", result?.unitType);
      this.mainForm.updateList("postalStreetType", result?.streetType);

      if (result?.country) {
        this.countryOptions = result.country;
        this.mainForm.updateList("postalCountry", result.country);
        this.mainForm?.form?.get("postalCountry")?.setValue("New Zealand");

        this.mainForm.updateList("postalCity", result?.city);

      }
    });
  }

  // NEW METHOD: Add street type handling method for sole trade postal address
  async setStreetType(streetTypeValue: string) {
    try {
      // Ensure street type options are loaded - using fieldProps for sole trade component as shown in original onBlurEvent
      const streetTypeOptions =
        this.mainForm?.fieldProps?.["postalStreetType"]?.options;

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
          .get("postalStreetType")
          .patchValue(matchedOption.value || matchedOption.label);
      }
    } catch (error) {}
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

  //       this.mainForm.updateList("postalFloorType", floorTypeList);

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

  //       this.mainForm.updateList("postalUnitType", unitTypeList);

  //       return unitTypeList;
  //     }
  //   );

  //   await this.baseSvc.getFormData(
  //     `LookUpServices/custom_lookups?LookupSetName=StreetType`,
  //     (res) => {
  //       let list = res.data;

  //       const floorTypeList = list.map((item) => ({
  //         label: item.lookupValue,
  //         value: item.lookupValue,
  //         lookupCode: item.lookupCode,
  //       }));

  //       this.mainForm.updateList("postalStreetType", floorTypeList);

  //       return floorTypeList;
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
  //         this.mainForm?.form?.get("postalCountry")?.value ||
  //         this.baseFormData?.postalCountry ||
  //         "New Zealand";

  //       const sortedCountryList = this.sortOptionsWithSelectedOnTop(
  //         countryList,
  //         selectedCountry
  //       );

  //       this.mainForm.updateList("postalCountry", sortedCountryList);

  //       return sortedCountryList;
  //     }
  //   );

  //   await this.getCities();
  // }

  override title: string = "Address Details";
  // override title: string = 'Address Details';

  // override async onSuccess(data: any) {}
  // override onFormDataUpdate(res: any): void {
  //   if (
  //     this.baseFormData?.physicalreuseOfPostalAddress !=
  //     res?.physicalreuseOfPostalAddress
  //   ) {
  //     const fields = [
  //       "Search",
  //       "BuildingName",
  //       "City",
  //       "Year",
  //       "Month",
  //       "Lot",
  //       "Country",
  //       "FloorType",
  //       "Postcode",
  //       "ResidenceType",
  //       "RuralDelivery",
  //       "StreetDirection",
  //       "StreetName",
  //       "StreetNumber",
  //       "StreetType",
  //       "Suburb",
  //       "TimeAtAddress",
  //       "UnitNumber",
  //       "Attention",
  //     ];

  //     fields.forEach((field) => {
  //       if (
  //         this.mainForm.form.get(`postal${field}`) &&
  //         this.mainForm.form.get(`postal${field}`).value !=
  //           res[`physical${field}`] &&
  //         res[`physical${field}`]
  //       ) {
  //         this.updateDisableValue({
  //           key: `postal${field}`,
  //           value: res[`physical${field}`],
  //         });
  //         this.mainForm.form.get(`postal${field}`).enable();
  //       }
  //     });
  //   }
  // }

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
          this.mainForm.get("postalAddressType").setValue("street");
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
          this.mainForm.get("postalAddressType").setValue("po");
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

      if (event.name === "postalCountry") {
        this.getCities();
      }
      //await this.updateValidation("onInit");
    }
    await this.updateValidation("onInit");
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

  override async onSuccess(data: any) {}

  copied: boolean = false;
  // override onFormDataUpdate(res: any): void {
  //   const fields = [
  //     "FloorType",
  //     "BuildingName",
  //     "UnitType",
  //     "StreetArea",
  //     "SearchValue",
  //     "BuildingName",
  //     "City",
  //     "Year",
  //     "Month",
  //     "UnitNumber",
  //     "Country",
  //     "FloorType",
  //     "Postcode",
  //     "ResidenceType",
  //     "RuralDelivery",
  //     "StreetDirection",
  //     "StreetName",
  //     "StreetNumber",
  //     "StreetType",
  //     "Suburbs",
  //     "TimeAtAddress",
  //     "UnitType",
  //     "FloorType",
  //     "FloorNumber",
  //     "StreetArea",
  //     "SearchCountry",
  //   ];
  //   if (
  //     res?.physicalReuseOff &&
  //     this.baseFormData?.physicalReuseOff !== res?.physicalReuseOff
  //   ) {
  //     if (res.physicalCountry != "New Zealand") {
  //       this.mainForm.updateHidden({
  //         postalUnitType: true,
  //         postalFloorNumber: true,
  //         postalFloorType: true,
  //         postalBuildingName: true,
  //         postalRuralDelivery: true,
  //         postalStreetDirection: true,
  //         postalStreetType: true,
  //         postalStreetName: true,
  //         postalStreetNumber: true,
  //         postalUnitNumber: true,
  //         postalStreetArea: false,
  //       });
  //     } else {
  //       this.mainForm.updateHidden({
  //         postalUnitType: false,
  //         postalFloorNumber: false,
  //         postalFloorType: false,
  //         postalBuildingName: false,
  //         postalRuralDelivery: false,
  //         postalStreetDirection: false,
  //         postalStreetType: false,
  //         postalStreetName: false,
  //         postalStreetNumber: false,
  //         postalUnitNumber: false,
  //         postalStreetArea: true,
  //       });

  //     }
  //     if (res.physicalReuseOff) {
  //       if(res.physicalCountry == 'New Zealand'){
  //         this.mainForm.get('postalAddressType').setValue('street');
  //       }else{
  //         this.mainForm.get('postalAddressType').setValue('po');
  //       }

  //     fields.forEach((field) => {
  //       const postalField = this.mainForm.form.get(`postal${field}`);
  //       const physicalFieldValue = res[`physical${field}`];
  //       if (
  //         postalField &&
  //         postalField.value !== physicalFieldValue &&
  //         physicalFieldValue
  //       ) {
  //         postalField.patchValue(physicalFieldValue);
  //         postalField.enable();
  //       }
  //     });
  //   }else{
  //     this.mainForm.form.reset();
  //     this.mainForm.get('postalAddressType').setValue('po');
  //   }
  //   }

  // }

  override async onFormDataUpdate(res: any): Promise<void> {
    if (this.baseFormData?.physicalReuseOff !== res?.physicalReuseOff) {
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
      if (res.physicalReuseOff) {
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
      } else {
        if (this?.baseFormData?.physicalReuseOff) {
          this.mainForm.form.reset();
          this.mainForm.form.get("postalAddressType").patchValue("po");
        }
      }

      this.cdr.detectChanges();
    }
  }

override async onFormEvent(event) {
  if (event.name === "postalCity") {
    let locationName = this.mainForm.form.get("postalCity").value;
    let LocationId = this.cityOptionsLocationId.filter(
      (l) => l.name === locationName
    );

    this.baseSvc.setBaseDealerFormData({
      postalCityLocationId: LocationId[0]?.locationId,
    });
     
  }

  if (event.name == "postalAddressType") {
    const countryControl = this.mainForm.form.get("postalCountry");   
    if (event.value == "po") {
      // PO Box mode - enable country and show textarea
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
      // Enable country dropdown for PO Box
      if (countryControl) {
        countryControl.enable({ emitEvent: false });
      }
    } else {
      // Street mode - disable country, set to New Zealand, show street fields
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
      // Disable country dropdown and set to New Zealand for street addresses
      if (countryControl) {
        countryControl.patchValue("New Zealand", { emitEvent: false });
        countryControl.disable({ emitEvent: false });
      }
    } 

    this.baseSvc.setBaseDealerFormData({
      postalAddressType: event.value
    });

  
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
    // const isNz = this.baseFormData?.postalCountry === "New Zealand";
    // this.mainForm.form.get('postalAddressType').patchValue(isNz ? 'street' : 'po')

  super.onFormEvent(event);
}

  override onValueChanges(event: any): void {
    if (event.postalSearchValue && event.postalSearchValue.length >= 4) {
      this.searchSvc.searchAddress(event.postalSearchValue).subscribe((res) => {
        this.searchAddressList = res;
        this.mainForm.updateList("postalSearchValue", this.searchAddressList);
      });
    }
  }

  postalAddressType: any;
  // pageCode: string = "SoleTradeAddressDetailsComponent";
  // modelName: string = "SoleTradePostalAddressComponent";
  pageCode: string = "SoleTradeAddressDetailsComponent";
  modelName: string = "SoleTradePostalAddressComponent";

  override async onFormReady(): Promise<void> {
    this.getCities();
    await this.updateValidation("onInit");
    super.onFormReady();
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

            // Store both the filtered options and location IDs
            this.cityOptionsAll = filteredCities;
            this.cityOptionsLocationId = obj;

           this.cityOptions = filteredCities;

this.mainForm.updateList("postalCity", filteredCities);

          }
        }
      );
    }
  }

  // UPDATED METHOD: Enhanced blur event with street type auto-population
  override async onBlurEvent(event): Promise<void> {
    // await this.updateValidation(event);
    if (event.name == "postalSearchValue") {
      // if(event.data && event.data.length >= 4){
      this.searchSvc
        .getExternalAddressDetails(event.value.externalAddressLookupKey)
        .subscribe(async (res) => {
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

          // this.mainForm.get('postalCountry').disable({emitEvent:false});
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
    this.baseSvc.updateComponentStatus(
      "Address Details",
      "SoleTradePostalAddressComponent",
      this.mainForm.form.valid
    );

    if (this.baseSvc.showValidationMessage) {
      let invalidPages = this.checkStepValidity();
      this.baseSvc.iconfirmCheckbox.next(invalidPages);
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.reusePhysicalSubs?.unsubscribe();
  }
}
