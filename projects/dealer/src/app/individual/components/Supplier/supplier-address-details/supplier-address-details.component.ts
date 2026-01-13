import { ChangeDetectorRef, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, ToasterService } from "auro-ui";
import { ValidationService } from "auro-ui";
import { BaseIndividualClass } from "../../../base-individual.class";
import { IndividualService } from "../../../services/individual.service";
import { Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { SearchAddressService } from "../../../../standard-quote/services/search-address.service";

@Component({
  selector: "app-supplier-address-details",
  templateUrl: "./supplier-address-details.component.html",
  styleUrls: ["./supplier-address-details.component.scss"],
})
export class SupplierAddressDetailsComponent extends BaseIndividualClass {

  @Output() addressUpdate = new EventEmitter<any>();
  cities=[]

  override formConfig: GenericFormConfig = {
    headerTitle: "Current Address Details",
    autoResponsive: true,
    api: "",
    goBackRoute: "",
    cardBgColor: "--background-color-secondary",
    cardType: "non-border",
    fields: [
      {
        type: "autoSelect",
        label: "Search",
        name: "searchAddress",
        cols: 3,
        options: [],
        icon: "fa-solid fa-location-crosshairs fa-lg",
        rightIcon: true,
        nextLine: true,
        className: "mb-4",
      },

         {
        type: "number",
        inputType: "vertical",
        label: "Time at Address",
        name: "previousYear",
        maxLength: 2,
        className: "col-fixed w-4rem ml-0 white-space-nowrap",
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
      //   type: "select",
      //   label: "Residence Type",
      //   name: "residenceType",
      //   cols: 2,
      //   options: [],
      // },

      { 
        type: "text", 
        label: "Building Name", 
        name: "buildingName", 
        cols: 2,
        inputType: "vertical",
        className: "mt-2"
      },
      { 
        type: "select", 
        label: "Unit / Floor Type", 
        name: "unitFloorType", 
        cols: 2, 
        options: [], 
        alignmentType: "vertical",
        nextLine: true,
        className: "-mt-2 ml-3"
        },

      { type: "text", label: "Unit / Lot Number", name: "unitLotNumber", cols: 2, inputType:"vertical", className:"-mt-2" },
      { type: "text", label: "Street Number", name: "streetNumber", cols: 2, inputType:"vertical",className:"-mt-2 ml-3" },
      { type: "text", label: "Street Name", name: "streetName", cols: 2, inputType:"vertical" ,className:"-mt-2 ml-3"},

      { type: "select", label: "Street Type", name: "streetType", cols: 2, options: [], alignmentType:"vertical", className: "-mt-4 ml-2" },
      { type: "text", label: "Street Direction", name: "streetDirection", cols: 2, inputType:"vertical",className:"-mt-2 ml-2 pr-8" },
      { type: "text", label: "Rural Delivery", name: "ruralDelivery", cols: 2, nextLine: true, inputType:"vertical" ,className:"-mt-2 -ml-6 pr-3"},

      { type: "text", label: "Suburb", name: "suburb", cols: 2, inputType:"vertical",className:"-mt-2" },
      { type: "select", label: "City", name: "city", cols: 2, options: [], alignmentType:"vertical", className: "-mt-4" },
      { type: "text", label: "Postcode", name: "postcode", cols: 2, inputType:"vertical",className:"-mt-2" },
      { type: "select", label: "Country", name: "country", cols: 2, options: [], alignmentType:"vertical",  className: "-mt-4" },
    ],
  };

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: IndividualService,
    public searchSvc: SearchAddressService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();

    // aligned with physical address component
    this.baseSvc.formDataCacheableRoute([
      "LookUpServices/lookups?LookupSetName=PropertyResidenceType",
      "LookUpServices/custom_lookups?LookupSetName=StreetType",
      "LookUpServices/custom_lookups?LookupSetName=UnitType",
      "LookUpServices/locations?LocationType=City",
      "LookUpServices/locations?LocationType=Country",
    ]);

    await this.loadLookups();
    await this.updateValidation("onInit");
  }

  async loadLookups() {
    // Residence Type
    await this.baseSvc.getFormData(
      `LookUpServices/lookups?LookupSetName=PropertyResidenceType`,
      res => {
        this.mainForm.updateList(
          "residenceType",
          res.data.map(x => ({ label: x.lookupValue, value: x.lookupValue }))
        );
      }
    );

    // Street Type
    await this.baseSvc.getFormData(
      `LookUpServices/custom_lookups?LookupSetName=StreetType`,
      res => {
        this.mainForm.updateList(
          "streetType",
          res.data.map(x => ({ label: x.lookupValue, value: x.lookupValue }))
        );
      }
    );

    // Unit / Floor Type
    await this.baseSvc.getFormData(
      `LookUpServices/custom_lookups?LookupSetName=UnitType`,
      res => {
        this.mainForm.updateList(
          "unitFloorType",
          res.data.map(x => ({ label: x.lookupValue, value: x.lookupValue }))
        );
      }
    );

    // City
    await this.baseSvc.getFormData(
      `LookUpServices/locations?LocationType=City`,
      res => {
        this.mainForm.updateList(
          "city",
          res.data.map(x => ({ label: x.name, value: x.name }))
        );

        this.cities = res?.data
      }
    );

    // Country
    await this.baseSvc.getFormData(
      `LookUpServices/locations?LocationType=Country`,
      res => {
        this.mainForm.updateList(
          "country",
          res.data.map(x => ({ label: x.name, value: x.name }))
        );
      }
    );
  }

  override onValueChanges(event: any) {
    super.onValueChanges(event);
    if(event?.city){
      let c = this.cities?.find(c=>c.name === event?.city)
      this.baseFormData.physicalCityLocationId = c?.locationId
    }

    this.addressUpdate.emit(event);
}

  async updateValidation(event: string) {
    const req = {
      form: this.mainForm?.form,
      formConfig: this.formConfig,
      event,
      modelName: "SupplierAddressDetailsComponent",
      pageCode: "SupplierAddressDetailsComponent",
    };

    const responses = await this.validationSvc.updateValidation(req);

    if (!responses.status && responses.updatedFields.length) {
      await this.mainForm.applyValidationUpdates(responses);
    }

    return responses.status;
  }
}
