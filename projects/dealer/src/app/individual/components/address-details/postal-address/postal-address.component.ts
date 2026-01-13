import { ChangeDetectorRef, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, ToasterService } from "auro-ui";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BaseIndividualClass } from "../../../base-individual.class";
import { IndividualService } from "../../../services/individual.service";
import { ValidationService } from "auro-ui";
import { distinctUntilChanged, filter, Subscription, takeUntil } from "rxjs";
import { SearchAddressService } from "../../../../standard-quote/services/search-address.service";
@Component({
  selector: "app-postal-address",
  templateUrl: "./postal-address.component.html",
  styleUrl: "./postal-address.component.scss",
})
export class PostalAddressComponent extends BaseIndividualClass {
  optionsdata = [{ label: "icashpro", value: "icp" }];
  flag: boolean = true;
  private countryOptions: any[] = [];
  private cityOptionsAll: any[] = [];
  postalSearchValue: String;
  reusePhysicalSubs: Subscription;
  index: number;
  customerRoleForm: FormGroup;
  searchAddressList: any[];
  cityOptions: any = [];
  cityOptionsLocationId: any = [];
  tempCity = null;

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
    cardType: "non-border",
    autoResponsive: true,
    api: "postalAddress",
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
        // placeholder: "Search",
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

    if (this.baseSvc.showValidationMessage) {
      this.mainForm.form.markAllAsTouched();
    }

  this.customerRoleForm = this.fb.group({
    postalSearchValue: ["", Validators.required],
  });

  this.baseSvc.updateDropdownData().subscribe((result) => {
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
}
private togglePostalCountry(addressType: string): void {
  const countryCtrl = this.mainForm?.form?.get('postalCountry');

  if (!countryCtrl) return;

  if (addressType === 'street') {
    countryCtrl.disable({ emitEvent: false });
  } else {
    countryCtrl.enable({ emitEvent: false });
  }
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
  if (!this.cityOptionsLocationId || this.cityOptionsLocationId.length === 0) {
    return;
  }
  
  const LocationId = this.cityOptionsLocationId.filter(
    (l) => l.name === cityName
  );

  if (LocationId && LocationId.length > 0 && LocationId[0]?.locationId) {
    this.baseSvc.setBaseDealerFormData({
      postalCity: cityName,
      postalCityLocationId: LocationId[0]?.locationId,
    });
  }
}


  private initializeFieldVisibility(addressType: string): void {
    if (addressType === "po") {
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
  }


  // NEW METHOD: Add street type handling method similar to other address components
  async setStreetType(streetTypeValue: string) {
    try {
      // Ensure street type options are loaded
      const streetTypeOptions =
        this.mainForm?.fieldProps?.["postalStreetType"]?.options;

      if (!streetTypeOptions || streetTypeOptions.length === 0) {
        console.warn("Postal street type options not loaded yet, retrying...");
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
      console.error("Error setting postal street type:", error);
    }
  }

  copyStreetAddress() {
    this.reusePhysicalSubs = this.baseSvc.reusePhysical$.subscribe(
      (data: any) => {
        console.log(data);
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
           this.mainForm.form.reset({
          postalCountry: { value: 'New Zealand', disabled: true }
        });
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
        postalCityLocationId: locationId[0]?.locationId,
      });
    }
  }

  // Add this method to handle existing city values
  private async handleExistingCityLocationId(): Promise<void> {
    const existingCity = this.mainForm?.form.get("postalCity")?.value;
    if (existingCity && existingCity.trim()) {
      await this.setCityLocationId(existingCity);
    }
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

    if (event.name === "postalCountry") {
      await this.getCities();
    }
  }
  await this.updateValidation("onInit");
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

      // NEW: Add street type handling similar to other address components
      if (data.streetType) {
        setTimeout(async () => {
          await this.setStreetType(data.streetType);
        }, 200);
      }

      if (data.country) {
        this.mainForm.get("postalCountry").patchValue(data.country);
        this.mainForm.get("postalSearchCountry").patchValue(data.country);
      }
      if (data.postcode)
        this.mainForm.get("postalPostcode").patchValue(data.postcode);

      if (data.city) {
        this.mainForm.get("postalCity").patchValue(data.city);
        // UPDATED: Set the city location ID when city is auto-populated
        await this.setCityLocationId(data.city);
      }

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
        await this.updateValidation("onInit");
      }
    }
  }
  override async onSuccess(data: any) {}

  copied: boolean = false;
  // override onFormDataUpdate(res: any): void {
  //   console.log(res)
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
  // console.log(this.baseFormData?.physicalReuseOff, res?.physicalReuseOff);
  //  console.log("res----->",res);

  if (this.baseFormData?.physicalReuseOff !== res?.physicalReuseOff) {
    const isNz = res.physicalCountry === "New Zealand";
    console.log(
      res.physicalCountry === "New Zealand",
      "res.physicalCountry === New Zealand"
    );

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

      // UPDATED: Set city location ID when copying from physical address
      if (res.physicalCity) {
        await this.setCityLocationId(res.physicalCity);
      }
    } else {
      // ✅ FIXED: Reset form but preserve postal country as "New Zealand" and keep it disabled
      if (this?.baseFormData?.physicalReuseOff) {
        this.mainForm.form.reset({
          postalCountry: { value: 'New Zealand', disabled: true },
          postalAddressType: 'po'
        });
      }
    }

    // ✅ ENHANCED: Always ensure postal country remains "New Zealand" and disabled after any form data update
    const postalCountryControl = this.mainForm?.form.get("postalCountry");
    if (postalCountryControl) {
      // Set value to New Zealand if it's empty or different
      if (postalCountryControl.value !== 'New Zealand') {
        postalCountryControl.setValue('New Zealand', { emitEvent: false });
      }
      // Always keep it disabled
      if (postalCountryControl.enabled) {
        postalCountryControl.disable({ emitEvent: false });
      }
    }
    
    // Handle existing city location ID for any form data update
    const existingCity = this.mainForm?.form.get("postalCity")?.value;
    if (existingCity && existingCity.trim()) {
      await this.setCityLocationId(existingCity);
    }

    // ✅ Trigger change detection manually to update the view immediately
    this.cdr.detectChanges();
  }
}


override async onFormEvent(event) {
  super.onFormEvent(event);
  
  if (event.name == "postalCountry") {
    if (event?.value != this.tempCity) {
      await this.getCities();
    }
    this.tempCity = event?.value;
  }
  
  if (event.name == "postalAddressType") {
      this.togglePostalCountry(event.value); 
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
    }
    await this.updateValidation("onInit");
  }
}


  override onValueChanges(event: any): void {
    console.log("event--->", event);

    if (event.postalSearchValue && event.postalSearchValue.length >= 4) {
      this.searchSvc.searchAddress(event.postalSearchValue).subscribe((res) => {
        this.searchAddressList = res;
        this.mainForm.updateList("postalSearchValue", this.searchAddressList);
      });
    }

    this.baseSvc.setBaseDealerFormData({
      ...event,
    });
  }

  postalAddressType: any;
  pageCode: string = "AddressDetailsComponent";
  modelName: string = "PostalAddressComponent";

override async onFormReady(): Promise<void> {
    const addressType =this.mainForm?.form?.get('postalAddressType')?.value || 'po';
    this.togglePostalCountry(addressType); 
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

          this.cityOptions = filteredCities;
          this.cityOptionsLocationId = obj;
          this.mainForm.updateList("postalCity", filteredCities);
        }
      }
    );
  }
}


  override async onBlurEvent(event): Promise<void> {
    // await this.updateValidation(event);
    if (event.name == "postalSearchValue") {
      // if(event.data && event.data.length >= 4){
      this.searchSvc
        .getExternalAddressDetails(event.value.externalAddressLookupKey)
        .subscribe(async (res) => {
          console.log("External postal address result:", res);
          const formValues = this.searchSvc.mapAddressJsonToFormControls(
            res.data,
            "postal"
          );

          // Patch form values first
          this.mainForm.form.patchValue(formValues);

          // UPDATED: Set city location ID after patching values
          if (formValues.postalCity) {
            await this.setCityLocationId(formValues.postalCity);
          }

          // IMPROVED: Better street type handling with proper timing - similar to other address components
          // if (formValues.postalStreetType) {
          //   setTimeout(async () => {
          //     await this.setStreetType(formValues.postalStreetType);
          //   }, 300);
          // }

          // COMMENTED OUT: Old street type handling method - kept for reference
          /*
          const options = await this.mainForm.fieldProps["postalStreetType"]
            .options;
          this.mainForm
            .get("postalStreetType")
            .setValue(
              options?.find(
                (obj) =>
                  obj.lookupCode == formValues?.postalStreetType?.toUpperCase()
              )?.value
            );
          */
          // this.mainForm.get('postalCountry').disable({emitEvent:false});
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
      "PostalAddressComponent",
      this.mainForm.form.valid
    );

    if (this.baseSvc.showValidationMessage) {
      let invalidPages = this.checkStepValidity();
      this.baseSvc.iconfirmCheckbox.next(invalidPages);
    }
    // this.checkStepValidity()
  }

  override ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    super.ngOnDestroy();
    this.reusePhysicalSubs?.unsubscribe();
  }
}
