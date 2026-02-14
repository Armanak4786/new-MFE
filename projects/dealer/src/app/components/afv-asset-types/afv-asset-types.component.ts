import { ChangeDetectorRef, Component, ViewEncapsulation } from "@angular/core";
import { Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  BaseFormClass,
  CommonService,
  DataService,
  GenericFormConfig,
} from "auro-ui";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { map, Subject, takeUntil } from "rxjs";
import { StandardQuoteService } from "../../standard-quote/services/standard-quote.service";
import { ToasterService, ValidationService } from "auro-ui";

@Component({
  selector: "app-afv-asset-types",
  templateUrl: "./afv-asset-types.component.html",
  styleUrl: "./afv-asset-types.component.scss",
})
export class AfvAssetTypesComponent extends BaseFormClass {
  emptyData = { label: "No Results Found", value: "noData" };
  assetMakeDataList = [this.emptyData];
  assetModelDataList = [this.emptyData];
  assetVarientDataList = [this.emptyData];
  assetYearDataList = [this.emptyData];
  assetTypeData = [];
  assetTypeModalValues: string;
  assetOptionsList = [];
  standardQuoteData: any;

  formData;
  override data: any;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public dataSvc: DataService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private router: Router,
    private standardQuoteSvc: StandardQuoteService,
    private toasterService: ToasterService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc);
    this.data = config.data;

    this.assetTypeData = this.config?.data?.assetTypeData;
    this.assetTypeModalValues = this.config?.data?.assetTypeModalValues;
    
  }
  destroy$ = new Subject<void>();

  mapDataToDD(valList) {
    if (valList.length > 1) {
     
      this.assetMakeDataList = this.filterAssetTypeData(valList[1]); // options
      this.mainForm.updateList("afvMake", this.assetMakeDataList);
      this.mainForm.get("afvMake").patchValue(valList[2]);
      

      this.assetModelDataList = this.filterAssetTypeData(valList[2]);
      this.mainForm.updateList("afvModel", this.assetModelDataList);
      this.mainForm.get("afvModel").patchValue(valList[3]);

      this.assetVarientDataList = this.filterAssetTypeData(valList[3]);
     
      this.mainForm.updateList("afvVariant", this.assetVarientDataList);
      this.mainForm.get("afvVariant").patchValue(valList[4]);
      
    }
  }
  override formConfig: GenericFormConfig = {
    cardType: "non-border",
    autoResponsive: true,
    api: "afvDetails",
    goBackRoute: "afvDetails",
    cardBgColor: "--primary-lighter-color",
    fields: [
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "Make",
        name: "makeLabel",
        cols: 4,
        className: "my-auto",
        isRequired: true,
      },
      {
        type: "select",
        placeholder: "Select",
        name: "afvMake",
        options: this.assetMakeDataList,
        // options: [{ label: "Mazda", value: "Mazda" }],
        cols: 8,
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "Model",
        name: "afvModelLabel",
        cols: 4,
        className: "my-auto",
        isRequired: true,
      },
      {
        type: "select",
        placeholder: "Select",
        name: "afvModel",
        options: this.assetModelDataList,
        cols: 8,
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "Variant",
        name: "afvVariantLabel",
        cols: 4,
        className: "my-auto",
        isRequired: true,
      },
      {
        type: "select",
        placeholder: "Select",
        name: "afvVariant",
        options: this.assetVarientDataList,
        cols: 8,
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "Year",
        name: "afvYearLabel",
        cols: 4,
        className: "my-auto",
      },
      {
        type: "select",
        name: "afvYear",
        cols: 8,
        options: [
          { label: 2025, value: 2025 },
          { label: 2024, value: 2024 },
          { label: 2023, value: 2023 },
          { label: 2022, value: 2022 },
          { label: 2021, value: 2021 },
          { label: 2020, value: 2020 },
          { label: 2019, value: 2019 },
          { label: 2018, value: 2018 },
          { label: 2017, value: 2017 },
          { label: 2016, value: 2016 },
          { label: 2015, value: 2015 },
          { label: 2014, value: 2014 },
          { label: 2013, value: 2013 },
          { label: 2012, value: 2012 },
          { label: 2011, value: 2011 },
          { label: 2010, value: 2010 },
          { label: 2009, value: 2009 },
          { label: 2008, value: 2008 },
          { label: 2007, value: 2007 },
          { label: 2006, value: 2006 },
          { label: 2005, value: 2005 },
          { label: 2004, value: 2004 },
          { label: 2003, value: 2003 },
          { label: 2002, value: 2002 },
          { label: 2001, value: 2001 },
          { label: 2000, value: 2000 },
          { label: 1999, value: 1999 },
          { label: 1998, value: 1998 },
          { label: 1997, value: 1997 },
          { label: 1996, value: 1996 },
          { label: 1995, value: 1995 },
          { label: 1994, value: 1994 },
          { label: 1993, value: 1993 },
          { label: 1992, value: 1992 },
          { label: 1991, value: 1991 },
          { label: 1990, value: 1990 },
        ],
        className: "my-auto",
      },
      {
        type: "button",
        label: "Select",
        name: "selectBtn",
        cols: 5,
        className: "col-offset-4 mt-5 ml-3",
        submitType: "submit",
      },
      {
        type: "button",
        label: "Cancel",
        name: "cancelBtn",
        btnType: "border-btn",
        cols: 5,
        className: "mt-5 ml-3",
        submitType: "cancel",
        nextLine: true,
      },
    ],
  };

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    // await this.loadAssetTypeData();
    this.standardQuoteSvc.getBaseDealerFormData().subscribe((res) => {
      this.formData = res;
    });
    //console.log(this.data);

    if (this.assetTypeModalValues) {
      let val = this.assetTypeModalValues.split(" / ");
      if (this.assetTypeModalValues) {
        this.mapDataToDD(val);
      }
    }
    this.mainForm?.get("assetType")?.patchValue("AFV");
  }

  filterAssetTypeData(ownerId) {
    // All Asset Type

    let filteredData = this.assetTypeData.filter(
      (item) => item.ownerId === ownerId // Agricultural
    );

    let dropDownData = filteredData.map((item) => ({
      label: item.name,
      value: item.name,
      // id: item.assetTypeId,
    }));

    return dropDownData;
  }

  override onFormEvent(event: any): void {
    super.onFormEvent(event);
  }

  override onButtonClick(event): void {
   
    if (event.field.name === "cancelBtn") {
      this.ref.close({});
    }

    if (event.field.name === "selectBtn") {
    
      let val =
        this.mainForm.get("afvVariant").value ||
        this.mainForm.get("afvModel").value ||
        this.mainForm.get("afvMake").value;

      // Check mandatory selections based on available options
      if (
        this.assetVarientDataList.length !== 0 &&
        !this.mainForm.get("afvVariant").value
      ) {
       
        val = "undefined";
      }
      if (
        this.assetModelDataList.length > 1 &&
        !this.mainForm.get("afvModel").value
      ) {
        val = "undefined";
      }
      if (
        this.assetMakeDataList.length > 1 &&
        !this.mainForm.get("afvMake").value
      ) {
        val = "undefined";
      }

      if (val !== "undefined") {
        let assetId = null;
        let assetTypeModalValues = "";

        if (this.mainForm.get("afvMake").value) {
          assetTypeModalValues = `All Asset Types / All Asset Type / ${
            this.mainForm.get("afvMake").value
          }`;

          if (this.mainForm.get("afvModel").value) {
            assetTypeModalValues += ` / ${this.mainForm.get("afvModel").value}`;
          }

          if (this.mainForm.get("afvVariant").value) {
            assetTypeModalValues += ` / ${
              this.mainForm.get("afvVariant").value
            }`;
          }

          assetId = this.assetTypeData.find(
            (obj) => obj.name === val
          )?.assetTypeId;
        }
        this.ref.close({
          assetTypeData: val,
          assetTypeId: assetId,
          assetTypeValues: assetTypeModalValues,
          btnType: "submit",
          data: this.mainForm.form.value,
        });
      }
    }
  }

  override async onFormReady(): Promise<void> {
    //console.log(this.mainForm);

    this.mainForm.form.patchValue(this.data);
    super.onFormReady();
    //    console.log(this.mainForm);

    // this.mainForm.form.patchValue(this.data)
  }

  override onValueTyped(event: any): void {
    super.onValueTyped(event);
    if (event.name == "afvMake") {
      this.assetModelDataList.length = 0;
      this.assetModelDataList = this.filterAssetTypeData(event.data); // options
      this.mainForm.updateList("afvModel", this.assetModelDataList);
    }

    if (event.name == "afvModel") {
      this.assetVarientDataList.length = 0;
      this.assetVarientDataList = this.filterAssetTypeData(event.data); // options
      this.mainForm.updateList("afvVariant", this.assetVarientDataList);
    }
  }
}
