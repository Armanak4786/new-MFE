import { ChangeDetectorRef, Component, effect, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  CloseDialogData,
  CommonService,
  GenericFormConfig,
  ToasterService,
} from "auro-ui";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { AssetInsuranceSummaryComponent } from "../asset-insurance-summary/asset-insurance-summary.component";
import { SearchAssetComponent } from "../search-asset/search-asset.component";
import { SelectBrandsComponent } from "../select-brands/select-brands.component";
import { AssetTypesComponent } from "../../../components/asset-types/asset-types.component";
import { AssetTradeSummaryService } from "../asset-insurance-summary/asset-trade.service";
import { ValidationService } from "auro-ui";
import { firstValueFrom, map, takeUntil } from "rxjs";
import configure from "src/assets/configure.json";
import { AfvAssetTypesComponent } from "../../../components/afv-asset-types/afv-asset-types.component";
import { DatePipe } from "@angular/common";
import { isWorkflowStatusInViewOrEdit } from "../../utils/workflow-status.utils";

@Component({
  selector: "app-asset-summary",
  templateUrl: "./asset-summary.component.html",
  styleUrl: "./asset-summary.component.scss",
})
export class AssetSummaryComponent extends BaseStandardQuoteClass {
  @Input() customerStatment: any;
  @Output() conditionDDValue = new EventEmitter<any>();
  assetTypeData = [];
  assetTypeModalValues: string;
  assetName: string = "";
  regNo: string = "";
  vin: string = "";
  customerStatementApiData: any;
  assets: any = [];

  responsiveOptions = [
    {
      breakpoint: "1199px",
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: "991px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "767px",
      numVisible: 1,
      numScroll: 1,
    },
  ];
  @ViewChild("assetListbox") assetListbox: any;

// Do not remove below commented code - kept for reference
  // override formConfig: GenericFormConfig = {
  //   autoResponsive: true,
  //   api: "assetSummary",
  //   goBackRoute: "",
  //   cardType: "non-border",
  //   cardBgColor: "--primary-lighter-color",
  //   fields: [
      // {
      //   type: "label-only",
      //   typeOfLabel: "inline",
      //   label: "Asset Type",
      //   name: "assetType",
      //   cols: 5,

      //   className: "my-auto",
      //   isRequired: true,
      // },
  //     {
  //       type: "text-select",
  //       placeholder: "Asset Type",
  //       name: "assetTypeDD",
  //       // hidden: true,
  //       disabled: false,
  //       cols: 4,
  //     },
      // {
      //   type: "label-only",
      //   typeOfLabel: "inline",
      //   label: "Condition",
      //   // accessDenied: !this.accessGranted?.["financial_asset"],
      //   name: "condition",
      //   cols: 5,
      //   className: "my-auto",
      //   isRequired: true,
      // },

  //     {
  //       type: "select",
  //       name: "conditionDD",
  //       options: [],
  //       // accessDenied: !this.accessGranted?.["financial_asset"],
  //       cols: 4,
  //       hidden: false,
  //       resetOnHidden: true,
  //     },
  //     {
  //       type: "label-only",
  //       typeOfLabel: "inline",
  //       label: "Useful Life",
  //       name: "usefulLifeLabel",
  //       // accessDenied: !this.accessGranted?.["financial_asset"],
  //       cols: 6,
  //       className: "my-auto",
  //       hidden: true,
  //     },

  //     {
  //       type: "number",
  //       name: "usefulLife",
  //       cols: 3,
  //       // accessDenied: !this.accessGranted?.["financial_asset"],
  //       hidden: true,
  //       resetOnHidden: true,
  //       className: "-ml-6",
  //     },
  //     {
  //       type: "label-only",
  //       typeOfLabel: "inline",
  //       label: "Months",
  //       name: "usefulLifeMonths",
  //       cols: 3,
  //       className: "my-auto",
  //       hidden: true,
  //     },
  //     {
  //       type: "text",
  //       name: "assetTypeModalValues",
  //       hidden: true,
  //     },
  //     {
  //       type: "text",
  //       name: "assetTypeId",
  //       hidden: true,
  //     },
  //   ],
  // };

  override formConfig: any = {
   autoResponsive: true,
    api: "assetSummary",
    goBackRoute: "",
    cardType: "non-border",
    cardBgColor: "--primary-lighter-color",
    fields: [],
  };


  private userModifiedUsefulLife = false;
  activeStepNum: number = 0;
  brands: any;
  selectedAsset: any;
  cashPriceValue: any;
  totalBorrowedAmount: any;
  gstFee: any;
  loanFee: any;
  defaultAsset: any;
  revertBackAsset: any;
  isBrandEditDisabled: boolean = true;
  originatorNo: any;
  programId: any;
  lastProgramId: any = null;
  productCode: any;

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public tradeSvc: AssetTradeSummaryService,
    public override baseSvc: StandardQuoteService,
    private cd: ChangeDetectorRef,
    private toasterService: ToasterService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    private datePipe: DatePipe
  ) {
    super(route, svc, baseSvc);

    effect(async () => {
      const trigger = this.baseSvc.triggerAllComponentsDuringWorkflowChange();
      if(trigger > 0){
        await this.updateValidation("onInit");
      }
    }, { allowSignalWrites: true });

    const config = this.validationSvc?.validationConfigSubject.getValue();
    const filteredValidations = this.validationSvc?.filterValidation(
    config,this.modelName,this.pageCode);
    this.formConfig = { ...this.formConfig, fields: filteredValidations };
    console.log('Asset Summary FormConfig:', filteredValidations);

    this.baseSvc.formDataCacheableRoute([
      "LookUpServices/custom_lookups?PageNo=1&PageSize=100&LookupSetName=AssetDealType",
      "AssetType/get_assettype",
    ]);

    this.baseSvc.formDataCacheableRoute(["Brand/all_brand_logo"]);
  }

  override async ngOnInit(): Promise<void> {
    
    this.activeStepNum = this.baseSvc?.activeStep || 0;
    await super.ngOnInit();
    
    this.mainForm?.updateProps("assetType", { isRequired: true });
    this.mainForm?.updateProps("condition", { isRequired: true });

    this.mainForm?.updateProps("assetTypeDD", { labelClassName: "hidden" });

    if (this.customerStatment === "Customer Statement") {
      console.log("Customer Statement mode detected in asset-summary");
      await this.loadCustomerStatementAssetData();
      await this.updateValidation("onInit");
      return; // Exit early for customer statement
    }
    this.productCode = sessionStorage.getItem("productCode");

    if (!this.baseFormData || !this.mainForm || !this.mainForm?.form) {
      // Don't Remove this Console
    }

    let params: any = this.route?.snapshot?.params;
    this.mode = params?.mode;

    this.accessGranted;
    await this.setVisibilityOfFields();

    this.baseSvc.programChange.subscribe(async (res) => {
      this.programId = res;
      if (res && this.activeStepNum == 0) {
        if (res != this.lastProgramId) {
          this.lastProgramId = res;
          await this.callApi(res);
        }
      }
    });

    if (!this.baseFormData?.defaultAsset) {
      await this.getAllBrands();
    }

    this.baseSvc?.changedProgram
      ?.pipe(takeUntil(this.destroy$))
      .subscribe(async (res) => {
        if (res) {
          this.getAllBrands();
        }
      });

    this.baseSvc?.changedOriginator
      ?.pipe(takeUntil(this.destroy$))
      .subscribe(async (res) => {
        if (res) {
          this.getAllBrands();
        }
      });

    if (this.baseFormData.productCode === "AFV") {
      await this.callApi("");
    }

    if (this.baseFormData && this.mainForm?.form) {
      this.mapData();
    }

    if(this.mainForm && this.mainForm?.form.get("assetTypeDD").disabled == true){
      this.mainForm?.updateProps("assetTypeDD", { disabled: true });
    }

    await this.assetCondition();
    await this.updateValidation("onInit");
    // if((configure?.workflowStatus?.view?.includes(this.baseFormData?.AFworkflowStatus)) || (configure?.workflowStatus?.edit?.includes(this.baseFormData?.AFworkflowStatus))){
    //   this.isBrandEditDisabled = true;
    // }
  }

  override onStatusChange(statusDetails: any): void {
    super.onStatusChange(statusDetails);
    if (isWorkflowStatusInViewOrEdit(statusDetails?.currentState)){
      this.isBrandEditDisabled = true;

    }
  }

  // Override to preserve asset type for AFV on preview
  override onCalledPreview(mode): void {
    if (this.baseFormData?.productCode === 'AFV') {
      // Call parent to patch other fields
      super.onCalledPreview(mode);
      
      // For AFV, restore user's selected asset type from saved values
      const savedAssetType = this.baseSvc.afvUserSelectedAssetType;
      if (savedAssetType?.assetTypeDD) {
        this.mainForm?.get('assetTypeDD')?.patchValue(savedAssetType.assetTypeDD, { emitEvent: false });
        this.mainForm?.get('assetTypeId')?.patchValue(savedAssetType.assetTypeId, { emitEvent: false });
        this.mainForm?.get('assetTypeModalValues')?.patchValue(savedAssetType.assetTypeModalValues, { emitEvent: false });
      }
    } else {
      super.onCalledPreview(mode);
    }
  }

  async loadCustomerStatementAssetData() {
    try {
      if (this.baseFormData?.customerStatementData) {
        this.customerStatementApiData = this.baseFormData.customerStatementData;
        console.log(
          "Customer Statement API Data:",
          this.customerStatementApiData
        );

        this.extractCustomerStatementFields();
        await this.loadBrandLogoForCustomerStatement();
      }
    } catch (error) {}
  }

  async loadBrandLogoForCustomerStatement() {
    try {
      const originatorNumber = this.customerStatementApiData?.originatorNumber;
      const program = this.customerStatementApiData?.program;

      if (originatorNumber) {
        // Call brand logo API
        const brandLogoResponse = await this.baseSvc.getFormData(
          `Brand/all_brand_logo?dealerNo=${originatorNumber}`,
          (res) => {
            return res || null;
          }
        );
        if (brandLogoResponse?.Data && brandLogoResponse.Data?.length > 0) {
          // Process brand images
          brandLogoResponse.Data.forEach((ele, index) => {
            ele.BrandImage = this.updateBrandImage(ele?.BrandImage);
            ele.name = "BrandName" + index;
          });

          this.brands = brandLogoResponse.Data;

          // Set default brand
          const defaultBrand = brandLogoResponse.Data.filter(
            (ele) => ele.IsDefault
          );

          if (defaultBrand?.length > 0) {
            this.baseFormData.defaultAsset = defaultBrand;
          } else {
            // Use first brand if no default
            this.baseFormData.defaultAsset = [brandLogoResponse.Data[0]];
          }
        } else {
          await this.getDefaultBrand();
        }
      } else {
        await this.getDefaultBrand();
      }
    } catch (error) {
      await this.getDefaultBrand();
    }
  }
  extractCustomerStatementFields() {
    if (!this.customerStatementApiData) {
      return;
    }

    this.assetName =
      this.customerStatementApiData?.assetType?.assetTypeName || "";

    this.regNo = this.customerStatementApiData?.registrationNo || "";

    this.vin = this.customerStatementApiData?.vin || "";
  }
  override ngAfterViewInit() {
    this.mainForm?.textSelectOP?.onHide?.subscribe(() => {
      this.clearSerach();
    });
  }

  async getAllBrands() {
    // this.svc.data.get("Brand/all_brand_logo").subscribe((res) => {
    //   // res?.Data.forEach((ele, index) => {
    //   //   ele.BrandImage = this.updateBrandImage(ele?.BrandImage);
    //   //   ele.name = "BrandName" + index;
    //   // });
    //   // this.brands = res?.Data;

    // });

    if (this.baseFormData?.originatorNumber) {
      await this.baseSvc.getFormData(
        `Brand/all_brand_logo?dealerNo=${this.baseFormData?.originatorNumber}&programId=${this.baseFormData.programId}`,
        (res) => {
          if (res) {
            res?.Data.forEach((ele, index) => {
              ele.BrandImage = this.updateBrandImage(ele?.BrandImage);
              ele.name = "BrandName" + index;
            });
            this.brands = res?.Data;

            this.isBrandEditDisabled = res?.Data?.length <= 1;
            
             if(isWorkflowStatusInViewOrEdit(this.baseFormData?.AFworkflowStatus)){
                this.isBrandEditDisabled = true;
              }

            if (res?.Data?.length == 1) {
              this.baseFormData.defaultAsset = this.brands;
            } else if (res?.Data?.length > 1) {
              this.baseFormData.defaultAsset = res.Data.filter(
                (ele) => ele.IsDefault
              );
            }
            this.cd.detectChanges();
          }
        }
      );
    }
  }

  async assetCondition() {
    await this.baseSvc.getFormData(
      `LookUpServices/custom_lookups?PageNo=1&PageSize=100&LookupSetName=AssetDealType`,
      (res) => {
        let list = res.data;

        const assetList = list.map((item) => ({
          label: item.lookupValue,
          value: item.lookupId,
        }));

        this.mainForm.updateList("conditionDD", assetList);

        return assetList;
      }
    );
  }

  async setVisibilityOfFields() {
    if (this.baseFormData?.productCode == "TL") {
      this.mainForm?.updateProps("assetTypeDD", { disabled: false });
      this.mainForm?.updateProps("assetType", { className: "my-auto" });
      if (this.mode != "edit") {
        this?.mainForm?.form?.get("conditionDD")?.patchValue(781);
      }
      this.mainForm?.updateHidden({
        cashPriceValue: true,
        cashPrice: true,
      });
      // Don't unconditionally hide retail price fields for TL
      // They will be controlled by the condition value in onFormEvent
    } else if (this.baseFormData?.productCode == "AFV") {
      this.mainForm?.updateHidden({
        retailPriceValue: true,
        retailPrice: true,
      });
    } else if (this.baseFormData?.productCode == "OL") {
      this.mainForm?.updateHidden({
        retailPriceValue: true,
        retailPrice: true,
        cashPriceValue: true,
        cashPrice: true,
        usefulLifeMonths: false,
        usefulLifeLabel: false,
        usefulLife: false,
      });
    } else if (this.baseFormData?.productCode == "FL") {
      this.mainForm?.updateProps("assetTypeDD", { disabled: false });
      this.mainForm?.updateProps("assetType", { className: "my-auto" });
      this.mainForm?.updateHidden({
        usefulLifeMonths: true,
        usefulLifeLabel: true,
        usefulLife: true,
        
      });
      if (this.mode != "edit") {
        this?.mainForm?.form?.get("conditionDD").patchValue(781);
      }
      this.cd.detectChanges();
    } else {
      this.mainForm?.updateHidden({
        cashPriceValue: false,
        cashPrice: false,
        usefulLifeMonths: true,
        usefulLifeLabel: true,
        usefulLife: true,
      });
    }
  }

async getUsefulLife(effectiveDate: any, assetTypeId: number, depreciationRateCurve: any): Promise<void> {
  try {
    const formattedDate = this.datePipe.transform(effectiveDate, 'yyyy-MM-dd');
    
    const payload = {
      depreciationRateCurve: depreciationRateCurve,
      effectiveDate: formattedDate,
      assetTypeId: assetTypeId
    };
    
    const response = await this.svc.data
      .post(`Contract/get_useful_life`, payload)
      .pipe(map((res: any) => res?.data))
      .toPromise();
    
    if (response && response.usefulLife !== undefined) {
      const usefulLife = Number(response.usefulLife * 12) || null;
      this.baseSvc.setBaseDealerFormData({ usefulLife: usefulLife });
      
     
    }
    
    return null;
  } catch (error) {
    this.toasterService.showToaster({
      severity: 'error',
      detail: 'Failed to fetch useful life data',
    });
    return null;
  }
}

  mapData() {
    let val;
    let cost;
    let assetid;
    // this.cashPriceValue= 2670.3;

    if (this.baseFormData?.financialAssets?.length > 0) {
      // For AFV, preserve user's selected asset type - don't overwrite from preview/financialAssets
      if (this.baseFormData?.productCode !== 'AFV') {
        val = this.baseFormData?.financialAssets[0]?.assetType?.assetTypeName;
        this.assetTypeModalValues =
          this.baseFormData?.financialAssets[0]?.assetType?.assetTypePath;
        assetid = this.baseFormData?.financialAssets[0]?.assetType?.assetTypeId;

        this.mainForm
          ?.get("assetTypeModalValues")
          ?.patchValue(this.assetTypeModalValues);
        this.mainForm?.get("assetTypeId")?.patchValue(assetid);
      }
      
      cost =
        this.baseFormData?.financialAssets[0]?.cost +
        this.baseFormData?.financialAssets[0]?.taxesAmt;
      this.cashPriceValue = cost ? cost : this.baseFormData?.cashPriceValue;

      this.totalBorrowedAmount = this.baseFormData?.totalAmountBorrowed;
      this.gstFee = this.baseFormData?.financialAssetLease?.taxesAmt;
      this.loanFee = this.baseFormData?.loanMaintenanceFee;
    }

    // For AFV, don't overwrite asset type dropdown from preview
    if (val && this.baseFormData?.productCode !== 'AFV') {
      this.mainForm?.get("assetTypeDD")?.patchValue(val);
    }
    // if (cost) this.mainForm.get('cashPriceValue').patchValue(cost);
    // if (condition) this.mainForm.get('conditionDD').patchValue(condition);

    this.originatorNo = this.baseFormData?.originatorNumber;
  }

  async callApi(programId) {
    this.assetTypeData = await this.baseSvc.getFormData(
      `AssetType/get_assettype?programId=${programId}&PageNo=1&PageSize=500`,
      function (res) {
        return res.data.asset || null;
      }
    );
    
    this.baseSvc.assetTypeData = this.assetTypeData;
    await this.loadAssetTypeData();
  }

  assetOptionsList = [];

  async loadAssetTypeData() {
    let dd = this.filterAssetTypeData("All Asset Type"); // Dropdown 2
    let optionsList = [];
    let baseAddress = "All Asset Type";
    let basePath = "All Asset Types / All Asset Type";
    dd.forEach((ele, index) => {
      let itemsList = this.filterAssetTypeData(ele.value); // Dropdown 3

      if (itemsList?.length == 0) {
        let fieldValue = ele.value + " / " + baseAddress;
        let path = basePath + " / " + ele.value;
        optionsList.push({
          label: fieldValue,
          value: { value: ele.value, id: ele.id, path: path },
        });
      } else {
        itemsList.forEach((eleA, indexA) => {
          let itemsList1 = this.filterAssetTypeData(eleA.value); // Dropdown 4
          if (itemsList1?.length == 0) {
            let fieldValue =
              eleA.value + " / " + ele.value + " / " + baseAddress;
            let path = basePath + " / " + ele.value + " / " + eleA.value;
            optionsList.push({
              label: fieldValue,
              value: { value: eleA.value, id: eleA.id, path: path },
            });
          } else {
            itemsList1.forEach((eleB) => {
              let fieldValue =
                eleB.value +
                " / " +
                eleA.value +
                " / " +
                ele.value +
                " / " +
                baseAddress;
              let path =
                basePath +
                " / " +
                ele.value +
                " / " +
                eleA.value +
                " / " +
                eleB.value;

              optionsList.push({
                label: fieldValue,
                value: { value: eleB.value, id: eleB.id, path: path },
              });
            });
          }
        });
      }

      // dd[index] = { ...ele, items: itemsList };
    });
    this.assetOptionsList = optionsList;
  }

  filterAssetTypeData(ownerId, assetTypeId?: any) {
    let filteredData = [];

    filteredData = this.assetTypeData?.filter(
      (item) => item.ownerId === ownerId
    );
    let dropDownData = filteredData.map((item) => ({
      label: item.name,
      value: item.name,
      id: item.assetTypeId,
    }));

    return dropDownData;
  }

  async selectAsset() {
    let asset = this.selectedAsset;

    this.mainForm?.get("assetTypeDD")?.patchValue(asset?.value);
    this.mainForm?.get("assetTypeModalValues")?.patchValue(asset?.path);
    this.mainForm?.get("assetTypeId")?.patchValue(asset?.id);
    let defaults = [];
    this.baseFormData.assetTypeDD = asset?.value;
    this.baseFormData.assetTypeModalValues = asset?.path;
    this.baseFormData.assetTypeId = asset?.id;
    
    // For AFV, save user's selection to preserve across preview calls
    if (this.baseFormData.productCode === 'AFV') {
      this.baseSvc.afvUserSelectedAssetType = {
        assetTypeDD: asset?.value,
        assetTypeId: asset?.id,
        assetTypeModalValues: asset?.path
      };
    }
    
    if (this.baseFormData.productCode === 'AFV') {
      if (this.baseFormData?.assetTypeId) {
        this.mainForm?.get('programId')?.patchValue(null);
        this.baseSvc.setBaseDealerFormData({ 
          programId: null,
          programExtName: null,
          programCode: null
        });
        this.baseSvc.afvProgramsLoaded.next([]);
        this.cd.detectChanges();
        const hasProgramsFetched = await this.fetchAfvPrograms();
        this.clearSerach();
        
        return;
      }
    }
    const previewResponse = await this.baseSvc.contractPreview(
      this.baseFormData, 
      defaults, 
      "asset"
    );
    
    if (previewResponse && this.productCode === 'OL') {
      const effectiveDate = this.baseFormData.leaseDate || this.baseFormData.loanDate;
      const assetTypeId = this.baseFormData.assetTypeId || 0;
      const depreciationRateCurve = this.baseFormData.depreciationRateCurve || "IRD ful Life Rates";
      
      await this.getUsefulLife(
        effectiveDate,
        assetTypeId,
        depreciationRateCurve
      );
      
      if (this.baseFormData?.usefulLife !== undefined) {
        this.mainForm.get("usefulLife").patchValue(this.baseFormData.usefulLife);
        this.cd.detectChanges();
      }
    }
    
    this.clearSerach();
}

async fetchAfvPrograms(): Promise<boolean> {
  try {
    const introducerId = this.baseFormData?.originatorId || sessionStorage.getItem('dealerPartyId');
    const assetTypesId = this.baseFormData?.assetTypeId;
    
    if (!introducerId || !assetTypesId) {
      return false;
    }
    const response = await this.svc.data
      .get(`Product/get_programs_products?introducerId=${introducerId}&AssetId=${assetTypesId}`)
      .pipe(map((res: any) => res))
      .toPromise();
    
    if (response?.data?.programs && response?.data?.programs.length > 0) {
      const programList = response.data.programs.map((item) => ({
        label: item.programName || item.extName || item.name,
        value: item.programId,
      }));
       this.baseSvc.setBaseDealerFormData({ 
        afvProgramList: programList  // Add this new field
      });
      
      // this.mainForm?.updateList('programId', programList);
      this.baseSvc.afvProgramsLoaded.next(programList);
      
      return true;
    } else {
      this.baseSvc.afvProgramsLoaded.next([]);
      return false;
    }
  } catch (error) {
    this.baseSvc.afvProgramsLoaded.next([]);
    return false;
  }
}

  clearSerach() {
    setTimeout(() => {
      if (this.assetListbox) {
        this.assetListbox.filterValue = "";
        if (this.assetListbox._filter) {
          this.assetListbox._filter(); // reset the filtered list
        }

        // Clear the actual input DOM value (visual)
        const inputEl =
          this.assetListbox.el.nativeElement.querySelector(".p-listbox-filter");
        if (inputEl) inputEl.value = "";
      }
    }, 100);
  }
  override async onValueTyped(event: any): Promise<void> {
    if (event.name == "assetTypeDD") {
      this.baseSvc?.forceCalculateBeforeSchedule.next(true);
      // this.baseSvc.forceToClickCalculate.next(true);
      // this.baseSvc.changedDefaults = {
      //   ...this.baseSvc.changedDefaults,
      //   asset: true,
      // };
    }

    if (event.name == "cashPriceValue") {
      let asset = this.selectedAsset;

      this.mainForm?.get("assetTypeDD")?.patchValue(asset?.value);
      this.mainForm?.get("assetTypeModalValues")?.patchValue(asset?.path);
      this.mainForm?.get("assetTypeId")?.patchValue(asset?.id);

      this.baseSvc?.forceCalculateBeforeSchedule.next(true);
      this.baseSvc.forceToClickCalculate.next(true);
    }
  }
  override async onStepChange(stepperDetails: any): Promise<void> {
    this.activeStepNum = stepperDetails?.activeStep || 0;
    if (stepperDetails?.type !== "tabNav") {
      var result: any = await this.updateValidation("onSubmit");
      if (!result?.status) {
        // this.toasterSvc.showToaster({
        //   severity: 'error',
        //   detail: 'I7',
        // });
      }
    }
    // this.checkValidate();
  }

  override async onFormEvent(event: any): Promise<void> {

    if (event.name == "conditionDD") {
      this.conditionDDValue.emit(event?.value);
     }

    if (
      event.name == "conditionDD" &&
      (this.baseFormData?.productCode == "CSA" ||
        this.baseFormData?.productCode == "FL" ||
        this.baseFormData?.productCode == "TL" ||
        this.baseFormData?.productCode == "OL" || this.baseFormData?.productCode == "AFV") // Add OL here
    ) {
      await this.assetCondition();
      this.baseSvc.setBaseDealerFormData({
        conditionDDValue: event.value,
      });

      // Handle retail price visibility based on condition value
      if (event.value == 781) {
        
        this.mainForm.updateHidden({
          retailPrice: false,
          retailPriceValue: false,
        });
      } else {
       
        this.mainForm.updateHidden({
          retailPrice: true,
          retailPriceValue: true,
        });
      }
    }

    if(event.name == "assetTypeDD"){
      if (this.baseFormData.programId) {
        const assetDetailsResponse = await firstValueFrom(
          this.svc.data.post("LookUpServices/CustomData", {
            parameterValues: [
              "Asset Type Override",
              String(this.baseFormData?.programId),
            ],
            procedureName: configure.SPProgramListExtract,
          })
        );
             
        // if(this.baseFormData?.AFworkflowStatus == "Quote" || this.baseFormData?.workflowStatus == "Open Quote"){
        if (assetDetailsResponse?.data?.table?.length == 0) {
          this.mainForm?.updateProps("assetTypeDD", { disabled: true });
        } else {
          this.mainForm?.updateProps("assetTypeDD", { disabled: false });
        }
      // }
      }

      if(this.mainForm && this.mainForm?.form.get("assetTypeDD").disabled == true){
        this.mainForm?.updateProps("assetTypeDD", { disabled: true });
      }
      
    }
    super.onFormEvent(event);
  }

  showAssetSummaryPopup() {
    this.svc.dialogSvc
      .show(AssetInsuranceSummaryComponent, "Asset & Insurance Summary", {
        templates: {
          footer: null,
        },
        width: "60vw",
      })
      .onClose.subscribe((data: any) => {
        if (data?.submitType == "submit") {
          if (this.mainForm.get("assetTypeDD").value) {
            this.svc.dialogSvc
              .show(SearchAssetComponent, data.submitFor, {
                templates: {
                  footer: null,
                },
                data: {
                  modalType: data?.submitFor,
                },
                width: "55vw",
              })
              .onClose.subscribe((data) => {
                if (data?.action != "closeAssetInsuranceSummaryTable") {
                  this.showAssetSummaryPopup();
                }
              });
          } else {
            this.toasterService.showToaster({
              severity: "error",
              detail: "Please select the financial asset to proceed",
            });
          }
        }
      });
  }

  async getDefaultBrand() {
    await this.svc.data.get("Brand/default_brand_logo").subscribe((res) => {
      res.Data.BrandImage = this.updateBrandImage(res.Data.BrandImage); // Adjust MIME type as needed
      this.assets = [res?.Data];
      this.defaultAsset = [res?.Data];

      this.baseSvc.setBaseDealerFormData({ defaultAsset: this.assets });
      this.cd.detectChanges();
    });
  }

  updateBrandImage(brandImage: string) {
    const searchString: string = "data:image/png;base64,";
    const occurrences: number = brandImage.split(searchString)?.length - 1;

    // Check if the substring occurs multiple times or is not found
    if (occurrences === 0) {
      brandImage = searchString + brandImage;
    }

    return brandImage;
  }
  showAssetSearchPopup(header) {
    if (this.mainForm.get("assetTypeDD").value) {
      this.svc.dialogSvc
        .show(SearchAssetComponent, header, {
          templates: {
            footer: null,
          },
          data: {
            modalType: header,
          },

          width: "55vw",
        })
        .onClose.subscribe((data: CloseDialogData) => {});
    } else {
      this.toasterService.showToaster({
        severity: "error",
        detail: "Please select the financial asset to proceed",
      });
    }
  }

  showSelectBrands() {
    const tempAssets = [];

    this.svc.dialogSvc
      .show(SelectBrandsComponent, "Select Brands", {
        templates: {
          footer: null,
        },
        width: "55vw",
        data: {
          brands: this.brands,
          tempAssets: this.revertBackAsset,
        },
      })
      .onClose.subscribe((data: CloseDialogData) => {
        if (data) {
          this.assets = data?.data;
          this.baseSvc.setBaseDealerFormData({ defaultAsset: this.assets });
        } else {
          this.assets = this.defaultAsset;
        }
        this.cd.detectChanges();
      });
  }

  async showSelectAssetType() {
    // Prevent opening dialog if field is disabled
    if (this.mainForm?.form?.get("assetTypeDD")?.disabled) {
      return;
    }
    
    if (this.baseFormData.productCode === "AFV") {
     
      this.svc.dialogSvc
        .show(AfvAssetTypesComponent, "Asset Type", {
          templates: {
            footer: null,
          },
          data: {
            assetTypeData: this.assetTypeData,
            assetTypeModalValues: this.mainForm?.get("assetTypeModalValues")
              .value,
            // afvMake: this.baseFormData?.afvMake,
            // afvModel: this.baseFormData?.afvModel,
            afvYear: this.baseFormData?.afvYear,
            // afvVariant: this.baseFormData?.afvVariant,
          },
          width: "60vw",
        })
        .onClose.subscribe(async (data) => {
          if (data?.btnType == "submit") {
            (this.baseFormData.physicalAsset[0].make = data?.data?.afvMake),
              (this.baseFormData.physicalAsset[0].model = data?.data?.afvModel),
              (this.baseFormData.physicalAsset[0].year = data?.data?.afvYear),
              (this.baseFormData.physicalAsset[0].variant =
                data?.data?.afvVariant);
            
            (this.baseFormData.afvMake = data?.data?.afvMake),
              (this.baseFormData.afvModel = data?.data?.afvModel),
              (this.baseFormData.afvYear = data?.data?.afvYear),
              (this.baseFormData.afvVariant = data?.data?.afvVariant);

            // Save to baseFormData and notify other components - NO preview or get programs calls
            this.baseSvc.setBaseDealerFormData({
              afvMake: data?.data?.afvMake,
              afvModel: data?.data?.afvModel,
              afvYear: data?.data?.afvYear,
              afvVariant: data?.data?.afvVariant,
            });
            
            // Trigger form refresh in afv-details and other components
            this.baseSvc.patchDataOnPreview.next({ mode: 'update' });
            
            if (this.productCode === "OL" && this.baseFormData.assetTypeId) {
            const effectiveDate = this.baseFormData.leaseDate || this.baseFormData.loanDate;
            const assetTypeId = this.baseFormData.assetTypeId || 0;
            const depreciationRateCurve = 
              this.baseFormData.depreciationRateCurve || "IRD ful Life Rates";
            
            const usefulLife = await this.getUsefulLife(
              effectiveDate,
              assetTypeId,
              depreciationRateCurve
            );
            if (this.baseFormData?.usefulLife !== undefined) {
              this.mainForm.get("usefulLife").patchValue(usefulLife);
          }
        }
      }
        });
    } else {
      this.svc.dialogSvc
        .show(AssetTypesComponent, "Asset Type", {
          templates: {
            footer: null,
          },
          data: {
            assetTypeData: this.assetTypeData,
            assetTypeModalValues: this.mainForm?.get("assetTypeModalValues")?.value,
          },
          width: "60vw",
        })
        .onClose.subscribe(async (data) => {
          if (data?.btnType == "submit") {
            this.mainForm
              ?.get("assetTypeDD")
              .patchValue(data?.assetTypeData || "");
            this.assetTypeModalValues = data?.assetTypeValues || "";
            this.mainForm
              ?.get("assetTypeModalValues")
              .patchValue(this.assetTypeModalValues);
            this.mainForm?.get("assetTypeId").patchValue(data?.assetTypeId);

            let defaults = [];
            this.baseFormData.assetTypeDD = data?.assetTypeData || "";
            this.baseFormData.assetTypeModalValues =
              data?.assetTypeValues || "";
            this.baseFormData.assetTypeId = data?.assetTypeId || "";
            await this.baseSvc.contractPreview(
              this.baseFormData,
              defaults,
              "asset"
            );
          }
        });
    }
  }

  override onButtonClick(event: any): void {
    if (event.field.name == "assetTypeDD") {
      // Check if the field is disabled before opening the dialog
      if (this.mainForm?.form?.get("assetTypeDD")?.disabled) {
        return;
      }
      this.showSelectAssetType();
    }
  }

  override onFormDataUpdate(res: any): void {
    if (this.cashPriceValue != res?.cashPriceValue && res?.cashPriceValue) {
      this.cashPriceValue = res?.cashPriceValue || 0;
    }
    if (
      this.totalBorrowedAmount != res?.totalBorrowedAmount &&
      res?.totalBorrowedAmount
    ) {
      this.totalBorrowedAmount = res?.totalBorrowedAmount || 0;
    }
    if (this.gstFee != res?.inclOfGST && res?.inclOfGST) {
      this.gstFee = res?.inclOfGST || 0;
    }
    if (this.loanFee != res?.loanMaintenanceFee && res?.loanMaintenanceFee) {
      this.loanFee = res?.loanMaintenanceFee || 0;
    }


   


    // if( this.cashPriceValue!=res?.cashPriceValue&&res?.cashPriceValue){
    //   this.cashPriceValue=res?.cashPriceValue
    // }
    // if( this.cashPriceValue!=res?.cashPriceValue&&res?.cashPriceValue){
    //   this.cashPriceValue=res?.cashPriceValue
    // }

    // if (res?.changedField?.productId) {
    //   if (res.productId == 16) {
    //     this.mainForm?.updateHidden({
    //       retailPriceValue: true,
    //       retailPrice: true,
    //       cashPriceValue: true,
    //       cashPrice: true,
    //     });
    //   } else if (
    //     res.productId == 9 ||
    //     res.productId == 53 ||
    //     res.productId == 14
    //   ) {
    //     this.mainForm?.updateHidden({
    //       retailPriceValue: true,
    //       retailPrice: true,
    //       cashPriceValue: true,
    //       cashPrice: true,
    //       usefulLifeMonths: false,
    //       usefulLifeLabel: false,
    //       usefulLife: false,
    //     });
    //   } else {
    //     this.mainForm?.updateHidden({
    //       retailPriceValue: true,
    //       retailPrice: true,
    //       cashPriceValue: false,
    //       cashPrice: false,
    //       usefulLifeMonths: true,
    //       usefulLifeLabel: true,
    //       usefulLife: true,
    //     });
    //   }
    // }
  }

  pageCode: string = "StandardQuoteComponent";
  modelName: string = "AssetSummaryComponent";

  override async onFormReady(): Promise<void> {
    super.onFormReady();

    // For AFV, skip patching asset type from assetListSubject to preserve user selection
    if (this.baseFormData?.physicalAsset?.length == 1 && this.baseFormData?.productCode !== 'AFV') {
      this.tradeSvc.assetListSubject.subscribe((res) => {
        this.mainForm
          ?.get("assetTypeDD")
          ?.patchValue(res[0]?.assetType?.assetTypeName);
        this.mainForm
          ?.get("assetTypeModalValues")
          ?.patchValue(res[0]?.assetType?.assetTypePath);
        this.mainForm
          ?.get("assetTypeId")
          ?.patchValue(res[0]?.assetType?.assetTypeId);
      });
    }

    const productCode = sessionStorage.getItem("productCode");
    if (productCode == "OL") {
      this.mainForm.updateHidden({
        usefulLifeMonths: false,
        usefulLifeLabel: false,
        usefulLife: false,
      });
    }
    await this.updateValidation("onInit");
  }

  override async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  override async onValueEvent(event): Promise<void> {
    if (event.name === 'usefulLife') {
    this.userModifiedUsefulLife = true;  
  }
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
    if (!responses.status && responses?.updatedFields?.length) {
      await this.mainForm.applyValidationUpdates(responses);
    }

    return responses.status;
  }
}
