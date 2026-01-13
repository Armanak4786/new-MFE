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

export interface dropDown {
  label?: string;
  value?: string;
}

@Component({
  selector: "app-asset-types",
  templateUrl: "./asset-types.component.html",
  styleUrls: ["./asset-types.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AssetTypesComponent extends BaseFormClass {
  emptyData = { label: "No Results Found", value: "noData" };
  categoryOptions = [this.emptyData]; // []
  subCategoryOptions = [this.emptyData];
  assetTypeProduct = [];
  assetTypeVarient = [];
  assetTypeSubVarient = []

  assetTypeData = [];
  assetTypeModalValues: string;
  standardQuoteData: any;

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
    JSON.stringify(config.data);

    this.assetTypeData = this.config?.data?.assetTypeData;
    this.assetTypeModalValues = this.config?.data?.assetTypeModalValues;
  }

  destroy$ = new Subject<void>();

  mapDataToDD(valList) {
    if (valList.length > 1) {
      this.categoryOptions = this.filterAssetTypeData(valList[1]); // options

      this.mainForm.updateList("category", this.categoryOptions);
      this.mainForm.get("category").patchValue(valList[2]);
      this.subCategoryOptions = this.filterAssetTypeData(valList[2]);
      this.mainForm.updateList("subCategory", this.subCategoryOptions);
      this.mainForm.updateHidden({ subCategory: false });

      this.mainForm.get("subCategory").patchValue(valList[3]);
      this.mainForm.updateValidators("subCategory", Validators.required);
      if (valList.length > 4) {
        this.assetTypeProduct = this.filterAssetTypeData(valList[3]);
        this.mainForm.updateList("assetTypeProduct", this.assetTypeProduct);
        this.mainForm.updateHidden({ assetTypeProduct: false });
        this.mainForm.get("assetTypeProduct").patchValue(valList[4]);
      }
      if (valList.length > 5) {
        this.assetTypeVarient = this.filterAssetTypeData(valList[4]);
        this.mainForm.updateList("varient", this.assetTypeVarient);
        this.mainForm.updateHidden({ varient: false });
        this.mainForm.get("varient").patchValue(valList[5]);
      }
      if (valList.length > 6) {
        this.assetTypeSubVarient = this.filterAssetTypeData(valList[5]);
        this.mainForm.updateList("subvarient", this.assetTypeSubVarient);
        this.mainForm.updateHidden({ subvarient: false });
        this.mainForm.get("subvarient").patchValue(valList[6]);
      }
    }
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.updateValidation("onInit");
    this.standardQuoteSvc
      .getBaseDealerFormData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.standardQuoteData = res;
      });
    // this.mainForm.get('assetType').patchValue('All Asset Type');

    if (this.assetTypeModalValues) {
      let val = this.assetTypeModalValues.split(" / ");
      if (this.assetTypeModalValues) {
        this.mapDataToDD(val);
      }
    }
    this.mainForm.get("assetType").patchValue("All Asset Type");
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

  override title: string = "";
  override formConfig: GenericFormConfig = {
    cardType: "non-border",
    headerTitle: null,
    autoResponsive: true,
    api: "",
    goBackRoute: "",
    createData: {
      assetType: "All Asset Type",
    },
    fields: [
      {
        type: "select",
        label: "Select Asset Type",
        name: "assetType",
        options: [{ label: "All Asset Type", value: "All Asset Type" }],
        // //validators: [Validators.required],
        filter: true,
        disabled: true,
        cols: 3,
      },
      {
        type: "select",
        label: "Select Asset 1",
        name: "category",
        options: this.categoryOptions,
        // //validators: [Validators.required],
        filter: true,
        cols: 3,
      },
      {
        type: "select",
        label: "Select  Asset 2",
        name: "subCategory",
        cols: 3,
        options: this.subCategoryOptions,
        filter: true,
        hidden: true,
      },
      {
        type: "select",
        label: "Select  Asset 3",
        name: "assetTypeProduct",
        options: this.assetTypeProduct,
        resetOnHidden: true,
        hidden: true,
        filter: true,
        cols: 3,
      },
      {
        type: "select",
        label: "Select Asset 4",
        name: "varient",
        options: this.assetTypeVarient,
        resetOnHidden: true,
        hidden: true,
        filter: true,
        cols: 3,
        className:"mt-3"
        
      },
       {
        type: "select",
        label: "Select Asset 5",
        name: "subvarient",
        options: this.assetTypeSubVarient,
        resetOnHidden: true,
        hidden: true,
        filter: true,
        cols:3,
        className:"mt-3"
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        name: "space",
        className: "col-fixed w-1rem",
        nextLine: true,
        cols: 3,

      },
      {
        type: "button",
        label: "Add",
        name: "AddBtn",
        cols: 2,
        className: "col-offset-4 mt-3",
        submitType: "submit",
      },
      {
        type: "button",
        label: "Reset",
        name: "resetBtn",
        btnType: "border-btn",
        cols: 2,
        className: "mt-3",
        submitType: "internal",
        nextLine: true,
      },
    ],
  };

  subCategory;
  assetProduct;
  category;

 override onValueTyped(event: any): void {
  let params: string = this.router.url;
  let validate = false;

  if (params.includes("/dealer/asset/addAsset")) {
    validate = true;
  }
  let FsubCategory;
  let FassetTypeProduct;
  let Fcategory;
  let assetTypeModalValues = this.standardQuoteData.assetTypeModalValues;

  if (assetTypeModalValues) {
    let val = assetTypeModalValues.split(" / ");
    if (assetTypeModalValues) {
      if (val.length > 1) {
        Fcategory = val[2];
        FsubCategory = val[3];
        if (val.length > 4) {
          FassetTypeProduct = val[4];
        }
      }
    }
  }

  if (event.name == "category") {
    this.subCategoryOptions.length = 0;
    this.mainForm.get("subCategory").reset();
    this.mainForm.get("assetTypeProduct").reset();
    this.mainForm.get("varient").reset();
    this.mainForm.get("subvarient").reset();
    
    this.subCategoryOptions = this.filterAssetTypeData(event.data);
    
    if (this.subCategoryOptions.length == 0) {
      this.mainForm.get("subCategory").clearValidators();
      this.mainForm.updateHidden({ subCategory: true });
    } else {
      this.mainForm.updateHidden({ subCategory: false });
      this.mainForm.updateValidators("subCategory", Validators.required);
    }
    
    this.mainForm.updateList("subCategory", this.subCategoryOptions);
    this.category = event.data;
    
    // Hide all dependent fields when category changes
    this.mainForm.updateHidden({ assetTypeProduct: true });
    this.mainForm.updateHidden({ varient: true });
    this.mainForm.updateHidden({ subvarient: true });
    
    if (validate && event?.data !== Fcategory) {
      this.toasterService.showToaster({
        severity: "warn",
        detail: "You have selected `" + Fcategory + "` for Financial Asset. Selecting different Asset Type will replace the Financial Asset Type.",
      });
    }
  }

  if (event.name == "subCategory") {
    this.subCategory = event?.data;
    this.assetTypeProduct.length = 0;
    this.mainForm.get("assetTypeProduct").reset();
    this.mainForm.get("varient").reset();
    this.mainForm.get("subvarient").reset();
    
    this.assetTypeProduct = this.filterAssetTypeData(event.data);
    
    // Show assetTypeProduct only if it has real data
    if (this.assetTypeProduct.length > 0) {
      this.mainForm.updateList("assetTypeProduct", this.assetTypeProduct);
      this.mainForm.updateHidden({ assetTypeProduct: false });
    } else {
      this.mainForm.updateHidden({ assetTypeProduct: true });
    }
    
    // Hide varient and subvarient when subCategory changes
    this.mainForm.updateHidden({ varient: true });
    this.mainForm.updateHidden({ subvarient: true });
    
    if (validate && event?.data != FsubCategory && this.category == Fcategory) {
      this.toasterService.showToaster({
        severity: "warn",
        detail: "You have selected `" + FsubCategory + "` for Financial Asset. Selecting different Asset Type will replace the Financial Asset Type.",
      });
    }
  }

  if (event.name == "assetTypeProduct") {
    // Reset dependent fields
    this.mainForm.get("varient").reset();
    this.mainForm.get("subvarient").reset();
    
    this.assetTypeVarient = this.filterAssetTypeData(event.data);
    
    // Show varient only if it has real data
    if (this.assetTypeVarient.length > 0) {
      this.mainForm.updateHidden({ varient: false });
      this.mainForm.updateList("varient", this.assetTypeVarient);
    } else {
      this.mainForm.updateHidden({ varient: true });
    }
    
    // Always hide subvarient when assetTypeProduct changes
    this.mainForm.updateHidden({ subvarient: true });
    
    if (
      validate &&
      event?.data != FassetTypeProduct &&
      this.category == Fcategory &&
      this.subCategory == FsubCategory
    ) {
      this.toasterService.showToaster({
        severity: "warn",
        detail:
          "You have selected `" +
          FassetTypeProduct +
          "` for Financial Asset. Selecting different Asset Type will replace the Financial Asset Type.",
      });
    }
    this.assetProduct = event?.data;
  }

  if(event.name == "varient") {
    // Reset dependent field
    this.mainForm.get("subvarient").reset();
    
    this.assetTypeSubVarient = this.filterAssetTypeData(event.data);
    
    // Show subvarient only if it has real data
    if(this.assetTypeSubVarient.length > 0) {
      this.mainForm.updateHidden({ subvarient: false });
      this.mainForm.updateList("subvarient", this.assetTypeSubVarient);
    } else {
      this.mainForm.updateHidden({ subvarient: true });
    }
  }
}


  override onFormEvent(event: any): void {
    // Heirarchial DropDown Values Fetched


    super.onFormEvent(event);
    
    if (event.name == "assetType") {
      // 1st dropdown All Asset Type

      this.categoryOptions.length = 0;
      this.categoryOptions = this.filterAssetTypeData(event.value); // options
      this.mainForm.updateList("category", this.categoryOptions);
      
    }
  }

  override onChildValueChanges(event: any): void { }

   override onButtonClick(event): void {
  let val;
  if (event.field.name === "AddBtn") {
    Object.values(this.mainForm.form.controls).forEach((control: any) => {
      control.markAsTouched();
    });

    val =
      this.mainForm.get("subvarient").value ||
      this.mainForm.get("varient").value ||
      this.mainForm.get("assetTypeProduct").value ||
      this.mainForm.get("subCategory").value ||
      this.mainForm.get("category").value 


    // Check mandatory selections based on available options
    if (
      this.assetTypeProduct.length !== 0 &&
      !this.mainForm.get("assetTypeProduct").value
    ) {
      val = "undefined";
    }
    if (
      this.subCategoryOptions.length > 1 &&
      !this.mainForm.get("subCategory").value
    ) {
      val = "undefined";
    }
    if (
      this.categoryOptions.length > 1 &&
      !this.mainForm.get("category").value
    ) {
      val = "undefined";
    }

    // Include checks for varient and subvarient if applicable
    if (
      this.assetTypeVarient?.length > 0 &&
      !this.mainForm.get("varient").value
    ) {
      val = "undefined";
    }
    if (
      this.assetTypeSubVarient?.length > 0 &&
      !this.mainForm.get("subvarient").value
    ) {
      val = "undefined";
    }

    if (val !== "undefined") {
      let assetId = null;
      let assetTypeModalValues = "";

      // Build full asset path string
      if (this.mainForm.get("category").value) {
        assetTypeModalValues = `All Asset Types / All Asset Type / ${this.mainForm.get("category").value}`;

        if (this.mainForm.get("subCategory").value) {
          assetTypeModalValues += ` / ${this.mainForm.get("subCategory").value}`;
        }

        if (this.mainForm.get("assetTypeProduct").value) {
          assetTypeModalValues += ` / ${this.mainForm.get("assetTypeProduct").value}`;
        }

        if (this.mainForm.get("varient").value) {
          assetTypeModalValues += ` / ${this.mainForm.get("varient").value}`;
        }

        if (this.mainForm.get("subvarient").value) {
          assetTypeModalValues += ` / ${this.mainForm.get("subvarient").value}`;
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
      });
    }
  }

  // Reset button logic
  if (event.field.name === "resetBtn") {
    this.mainForm.get("assetTypeProduct").clearValidators();
    this.mainForm.get("subCategory").clearValidators();
    this.mainForm.get("varient").clearValidators();
    this.mainForm.get("subvarient").clearValidators();

    this.mainForm.form.reset();

    this.mainForm.updateHidden({ subCategory: true });
    this.mainForm.updateHidden({ assetTypeProduct: true });
    this.mainForm.updateHidden({ varient: true });
    this.mainForm.updateHidden({ subvarient: true });

    this.mainForm.get("assetType").patchValue("All Asset Type");
  }
}

  pageCode: string = "AssetTypesComponent";
  modelName: string = "AssetTypesComponent";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();
  }

  override async onBlurEvent(event): Promise<void> {
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

  async onStepChange(quotesDetails: any): Promise<void> {
    if (quotesDetails.type !== "tabNav") {
      var result: any = await this.updateValidation("onSubmit");
      if (!result?.status) {
        // this.toasterSvc.showToaster({
        //   severity: "error",
        //   detail: "I7",
        // });
      }
    }
  }

}
