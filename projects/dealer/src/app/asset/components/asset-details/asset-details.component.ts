import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, ValidationService } from "auro-ui";
import { AssetTypesComponent } from "../../../components/asset-types/asset-types.component";
import { BaseAssetClass } from "../../base-asset.class";
import { AddAssetService } from "../../services/addAsset.service";
import { ToasterService } from "auro-ui";
import { StandardQuoteService } from "../../../standard-quote/services/standard-quote.service";
import { catchError, distinctUntilChanged, map, of, retry, skip, takeUntil } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AssetTradeSummaryService } from "../../../standard-quote/components/asset-insurance-summary/asset-trade.service";
import configure from "src/assets/configure.json";
import { isWorkflowStatusInViewOrEdit } from "../../../standard-quote/utils/workflow-status.utils";

@Component({
  selector: "app-asset-details",
  templateUrl: "./asset-details.component.html",
  styleUrl: "./asset-details.component.scss",
})
export class AssetDetailsComponent extends BaseAssetClass {
  standardQuoteBaseFormData: any
  addType: any = "";
  countryListData = [];
  lastSelectedAsset: number = 0;
  previousAssetClass: any;
  assetTypeData = [];
  assetSelectData: any;
  assetPath: string;
  assetTypeId: number = 0;
  countryFirstRegistered: any;
  override title: string = "Quote Originator";
  @ViewChild('assetListbox') assetListbox: any;

  // Do not remove below commented code - kept for reference
  // override formConfig: GenericFormConfig = {
  //   headerTitle: this.addType == "addAsset" ? "Add Asset" : "Add Trade",
  //   autoResponsive: true,
  //   api: "",
  //   goBackRoute: "",
  //   fields: [
  //     {
  //       type: "text-select",
  //       // placeholder: "Asset Type",
  //       name: "assetName",
  //       label: "Asset Type",
  //       cols: 4,
  //       className: "mb-2 pr-8 assetType ",
  //       labelClass: "w-8",
  //       inputClass: "w-7",
  //       disabled: false
  //       // //validators: [Validators.required], // validation Comment
  //     },
  //     {
  //       type: "amount",
  //       label: "Asset Value",
  //       name: "costOfAsset",
  //       cols: 2,
  //       maxLength: 13,
  //       placeholder: "Enter asset value",
  //       // //validators: [Validators.required, Validators.max(9999999)],  // validation Comment
  //       className: "my-0",
  //       inputType: "vertical",
  //       inputClass: "w-8",
  //       labelClass:"b7"
  //     },
  //     {
  //       type: "select",
  //       label: "Condition",
  //       name: "conditionOfGood",
  //       cols: 2,
  //       // list$:
  //       //   "LookUpServices/custom_lookups?PageNo=1&PageSize=100&LookupSetName=AssetDealType",
  //       options: [],
  //       // //validators: [Validators.required], // validation Comment
  //       nextLine: true,
  //       className: "px-0 py-1 customLabel",
  //       alignmentType: "vertical",
  //       labelClass: "w-8 -my-3 pt-1",
  //     },
  //     {
  //       type: "text",
  //       label: "Year",
  //       name: "year",
  //       cols: 2,
  //       inputType: "vertical",
  //       // //validators: [Validators.required],  // validation Comment
  //       className: "my-2 pl-3",
  //       inputClass: "w-8",
  //       // maxLength:4
  //     },
  //     {
  //       type: "text",
  //       label: "Make",
  //       name: "make",
  //       //regexPattern: "[^a-zA-Z0-9 ]*",
  //       // maxLength: 20,
  //       inputType: "vertical",
  //       cols: 2,
  //       // //validators: [Validators.required],  // validation Comment
  //       className: "my-2",
  //       inputClass: "w-8",
  //       // labelClass:'w-full'
  //     },
  //     {
  //       type: "text",
  //       label: "Model",
  //       name: "model",
  //       //regexPattern: "[^a-zA-Z0-9 ]*",
  //       // maxLength: 20,
  //       cols: 2,
  //       className: "my-2",
  //       // //validators: [Validators.required],  // validation Comment
  //       inputType: "vertical",
  //       inputClass: "w-8",
  //     },
  //     {
  //       type: "text",
  //       label: "Variant",
  //       //regexPattern: "[^a-zA-Z0-9 ]*",
  //       // maxLength: 20,
  //       name: "variant",
  //       cols: 2,
  //       // //validators: [Validators.required],  // validation Comment
  //       className: "my-2",
  //       inputType: "vertical",
  //       inputClass: "w-8",
  //     },
  //     {
  //       type: "text",
  //       label: "Rego No.",
  //       name: "regoNumber",
  //       cols: 2,
  //       //regexPattern: "[^a-zA-Z0-9]*",
  //       // maxLength: 10,
  //       // //validators: [Validators.required],  // validation Comment
  //       className: "my-2",
  //       inputType: "vertical",
  //       inputClass: "w-8",
  //     },
  //     {
  //       type: "text",
  //       label: "VIN",
  //       name: "vin",
  //       //regexPattern: "[^a-zA-Z0-9]*",
  //       // maxLength: 17,
  //       cols: 2,
  //       // //validators: [Validators.required, Validators.minLength(5)],  // validation Comment
  //       // errorMessage: 'Common ErrorMessage',
  //       errorMessageMap: {
  //         minlength: "hello",
  //         required: "Byree",
  //       },
  //       className: "my-2",
  //       inputType: "vertical",
  //       inputClass: "w-8",
  //       // nextLine:true
  //     },
  //     {
  //       type: "text",
  //       label: "HIN",
  //       name: "hin",
  //       cols: 2,
  //       errorMessageMap: {
  //         minlength: "hello",
  //         required: "Byree",
  //       },
  //       className: "my-2",
  //       inputType: "vertical",
  //       inputClass: "w-8",
  //       hidden: true,
  //       nextLine: true,
  //     },
  //     {
  //       type: "text",
  //       label: "Odometer",
  //       name: "odometer",
  //       // maxLength: 7,
  //       //placeholder: "KM",
  //       // suffix: "KM",
  //       // errorMessage: "Maximun 4 digits allowed",
  //       cols: 2,
  //       className: "my-2 pl-3 odo-wrapper",
  //       inputType: "vertical",
  //       inputClass: "w-8",
  //     },
  //     {
  //       type: "text",
  //       label: "Colour",
  //       name: "colour",
  //       //regexPattern: "[^a-zA-Z ]*",
  //       //  maxLength: 30,
  //       // //validators: [Validators.maxLength(10)],  // validation Comment
  //       cols: 2,
  //       className: "my-2",
  //       inputType: "vertical",
  //       inputClass: "w-8",
  //     },
  //     {
  //       type: "text",
  //       label: "Serial / Chassis No.",
  //       name: "serialChassisNumber",
  //       //regexPattern: "[^a-zA-Z0-9]*",
  //       //maxLength: 10,
  //       cols: 2,
  //       // //validators: [Validators.required],  // validation Comment
  //       className: "my-2",
  //       inputType: "vertical",
  //       inputClass: "w-8",
  //     },
  //     {
  //       type: "text",
  //       label: "Engine No",
  //       name: "engineNumber",
  //       cols: 2,
  //       // //regexPattern: "[^a-zA-Z0-9]*",
  //       maxLength: 30,
  //       // //validators: [Validators.required], // validation Comment
  //       className: "my-2",
  //       inputType: "vertical",
  //       inputClass: "w-8",
  //     },
  //     {
  //       type: "text",
  //       label: "CC Rating",
  //       name: "ccRating",
  //       // //validators: [Validators.min(0)], // validation Comment
  //       //  maxLength: 8,
  //       cols: 2,
  //       // maxFractionDigits: 2,
  //       placeholder: "CC",
  //       className: "my-2 cc-wrapper",
  //       inputType: "vertical",
  //       inputClass: "w-8 ",
  //       //  suffix: "CC"
  //     },

  //     {
  //       type: "text",
  //       name: "assetPath",
  //       hidden: true,
  //     },
  //     {
  //       type: "text",
  //       name: "assetTypeId",
  //       hidden: true,
  //     },
  //     {
  //       type: "text",
  //       name: "assetCategory",
  //       hidden: true,
  //     },
  //     {
  //       type: "select",
  //       label: "Motive Power",
  //       name: "motivePower",
  //       options: [],
  //       // list$:
  //       //   "LookUpServices/custom_lookups?PageNo=1&PageSize=100&LookupSetName=VehicleFuelType",

  //       cols: 2,
  //       className: "px-0 customLabel",
  //       alignmentType: "vertical",
  //       // inputClass:"w-8",
  //       labelClass: "w-8 -my-2",
  //     },
  //     {
  //       type: "select",
  //       label: "Country First Registered",
  //       name: "countryFirstRegistered",
  //       options: [],
  //       //validators: [Validators.required], // validation Comment
  //       filter: true,
  //       cols: 2,
  //       // className: "my-2",
  //       hidden: this.addType == "addTrade",
  //       default: "New Zealand",
  //       alignmentType: "vertical",
  //       labelClass: "w-8 -my-2",
  //     },
  //     {
  //       type: "select",
  //       label: "Asset Location of Use",
  //       name: "assetLocationOfUse",
  //       list$: "LookUpServices/CustomData",
  //       // list$:'',
  //       apiRequest: {
  //         parameterValues: ["Asset location of use"],
  //         procedureName: configure.SPAssetHdrCfdLuExtract, // Assuming configure is imported from the correct path,
  //       },
  //       idKey: "value_text",
  //       idName: "value_text",
  //       cols: 2,
  //       className: "px-0 customLabel",
  //       alignmentType: "vertical",
  //       labelClass: "w-8 -my-2",
  //       errorMessage: "This field cannot be blank",
  //     },
  //     {
  //       type: "name",
  //       label: "Supplier Name",
  //       name: "supplierName",
  //       // //regexPattern: "[^a-zA-Z ]*",
  //       maxLength: 15,
  //       cols: 2,
  //       className: "mb-2 sname",
  //       inputType: "vertical",
  //       inputClass: "w-8",
  //     },
  //     {
  //       type: "toggle",
  //       label: "Will the asset be leased  ",
  //       name: "assetLeased",
  //       cols: 3,
  //       className: "mt-4",
  //       offLabel: "Yes",
  //       onLabel: "No",
  //       nextLine: true,
  //     },
  //     {
  //       type: "textArea",
  //       label: "Features",
  //       name: "features",
  //       inputType: "vertical",
  //       // inputClass:"w-11",
  //       // textAreaRows: 4,
  //       className: "pl-3 pr-7",
  //       textAreaType: "border",
  //       hidden: this.addType == "addTrade",

  //       // cols: 6,
  //     },
  //     {
  //       type: "textArea",
  //       label: "Description",
  //       name: "description",
  //       inputType: "vertical",
  //       // inputClass:"w-11",
  //       className: "pl-3 pr-8",
  //       textAreaType: "border",
  //       hidden: this.addType == "addTrade",

  //       // textAreaRows: 4,
  //       // cols: 6,
  //     },
  //   ],
  // };

  override formConfig: any = {
    headerTitle: this.addType == "addAsset" ? "Add Asset" : "Add Trade",
    autoResponsive: true,
    api: "",
    goBackRoute: "",
    fields: [],
  };

  selectedAsset: any;
  programId: any;
  AFworkflowStatus: any;

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: AddAssetService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef,
    public standardQuoteSvc: StandardQuoteService,
    public toasterService: ToasterService,
    private http: HttpClient,
    public tradeSvc: AssetTradeSummaryService,
  ) {
    super(route, svc, baseSvc);

    const config = this.validationSvc?.validationConfigSubject.getValue();
    const filteredValidations = this.validationSvc?.filterValidation(
    config,this.modelName,this.pageCode);
    this.formConfig = { ...this.formConfig, fields: filteredValidations };
    console.log('Asset Details Field : ', filteredValidations);


    this.baseSvc.formDataCacheableRoute([
      "LookUpServices/locations?LocationType=country",
      "LookUpServices/custom_lookups?PageNo=1&PageSize=100&LookupSetName=VehicleFuelType",
      "LookUpServices/custom_lookups?PageNo=1&PageSize=100&LookupSetName=AssetDealType",
    ]);
  }

  assetTypeDD: any;
  addAssetData: any;
private isUpdatingCostFromService = false;
  override async ngOnInit(): Promise<void> {

    await super.ngOnInit();

    // await this.callApi();
    this.assetTypeData = this.standardQuoteSvc.assetTypeData;
    await this.loadAssetTypeData();
   let params: any = this.route.snapshot.params;

    this.addType = params?.type;
    this.mode = params?.mode || "create";
    this.standardQuoteSvc
      .getBaseDealerFormData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        
        this.standardQuoteBaseFormData = res
        this.AFworkflowStatus = res?.AFworkflowStatus,
          //  this.baseFormData = res;
          this.addAssetData = res?.addAssetData;
          // // Convert conditionDD (lookupId) to conditionOfGood (lookupValue string)
          // // 781 = New, 782 = Used
          // console.log('[ASSET-DETAILS] SUBSCRIPTION - res.conditionDD:', res?.conditionDD);
          // console.log('[ASSET-DETAILS] SUBSCRIPTION - current conditionOfGood:', this.mainForm?.get('conditionOfGood')?.value);
          // if (res?.conditionDD && this.mainForm?.get('conditionOfGood')) {
          //     const conditionLabel = res.conditionDD == 781 ? 'New' : res.conditionDD == 782 ? 'Used' : null;
          //     console.log('[ASSET-DETAILS] SUBSCRIPTION - conditionLabel to patch:', conditionLabel);
          //     if (conditionLabel) {
          //       this.mainForm.get('conditionOfGood').patchValue(conditionLabel, { emitEvent: false });
          //       console.log('[ASSET-DETAILS] SUBSCRIPTION - AFTER PATCH conditionOfGood:', this.mainForm.get('conditionOfGood').value);
          //     }
          //   }
        // For AFV, preserve user's selected asset type - don't overwrite from preview
        if (res?.productCode !== 'AFV') {
          this.assetTypeDD = res?.assetTypeDD;
          this.assetTypeId = res?.assetTypeId;
        }
        this.programId = res?.programId;
      });

        this.tradeSvc.assetSearchSubject
    .pipe(
      takeUntil(this.destroy$),
      skip(1), 
      distinctUntilChanged((prev, curr) => 
        JSON.stringify(prev) === JSON.stringify(curr)
      )
    )
    .subscribe((data) => {
     
      if (data && Object.keys(data).length > 0 && data.vin) {
        const assetType = data.assetType || this.baseFormData?.assetType;
        // For AFV, don't patch asset type from search results - preserve user selection
        if (this.standardQuoteBaseFormData?.productCode !== 'AFV') {
          this.baseSvc.setBaseDealerFormData({
            ...data,
            assetType: assetType,
          });
          this.mainForm.form.patchValue({
            ...data,
            assetTypeId: assetType?.assetTypeId,
            assetName: assetType?.assetTypeName,
            assetPath: assetType?.assetTypePath,
            costOfAsset: data.costOfAsset || this.baseFormData?.costOfAsset,
          });
        } else {
          // For AFV, patch other data but NOT asset type
         
          this.baseSvc.setBaseDealerFormData({
            ...data,
          });
          this.mainForm.form.patchValue({
            ...data,
            costOfAsset: data.costOfAsset || this.baseFormData?.costOfAsset,
          });
        }
      }
    });

    this.dynamicValidationBasedonAssetType(this.assetTypeData, this.baseFormData?.assetType?.assetTypeId || this.assetTypeId);

    if (this.addType == "addTrade") {



      // this.mainForm.updateValidators("odometer", [Validators.required]);
      this.mainForm.updateProps("supplierName", {
        className: "my-2 pl-3",
      });
      this.mainForm.updateProps("costOfAsset", {
        className: "my-2 pl-3",
      });
      // this.mainForm.get()
      // if (this.mode != "edit") {
      //   this.mainForm.get("conditionOfGood").patchValue("Used");
      // }
      this.mainForm.updateHidden({
        countryFirstRegistered: true,
        assetLocationOfUse: true,
        // supplierName: false,
        assetLeased: true,
        description: true,
        features: true,
        conditionOfGood: true,
        assetName: true,
        //assetCategory : true,
        hin: true,
      });

      this.mainForm.updateList("conditionOfGood", {
        list$: "LookUpServices/lookups?LookupSetName=AssetCondition",
        idKey: "lookupValue",
        idName: "lookupValue",
      });
      this.mainForm.form?.get("assetCategory")?.patchValue("Other");
    //   this.tradeSvc.tradeAmountForAddTrade$.pipe(
    //   takeUntil(this.destroy$),
    //   distinctUntilChanged()
    // ).subscribe((tradeAmount) => {
    //   if (tradeAmount !== null && tradeAmount !== undefined && this.mainForm?.get("costOfAsset")) {
    //     this.isUpdatingCostFromService = true;
    //       this.mainForm.get("costOfAsset").patchValue(tradeAmount, { emitEvent: false });
    //       console.log('Patched costOfAsset with tradeAmount:', tradeAmount);
    //       this.baseFormData.costOfAsset = tradeAmount;
    //        this.isUpdatingCostFromService = false;

    //   }
    // });
  
    }
    else {

      this.mainForm?.updateHidden({
        // countryFirstRegistered: false,
        // assetLocationOfUse: false,
        // supplierName: false,
        // assetLeased: false,
        description: false,
        features: false,
        conditionOfGood: false,
        assetName: false,
        //assetCategory : false,
        // hin: false,
      });
      // this.mainForm.get()
      //this.mainForm.get("odometer").removeValidators;
      // this.mainForm.updateValidators('odometer', [
      //   Validators.required
      // ]);
      let assetType = this.baseFormData?.assetType;
     

      if (this.mode != "edit") {
        this.mainForm.get("conditionOfGood").reset();
      } else {
        // For AFV, don't patch asset type from baseFormData - preserve user selection
        if (this.standardQuoteBaseFormData?.productCode !== 'AFV') {
          this.mainForm?.get("assetTypeId")?.patchValue(assetType?.assetTypeId);
          this.mainForm?.get("assetName")?.patchValue(assetType?.assetTypeName);
          this.mainForm?.get("assetPath")?.patchValue(assetType?.assetTypePath);
        } else {
        }
        this.countryFirstRegistered =
          this.baseFormData.countryFirstRegistered ?? "New Zealand";
      }
      if (this.mode == "edit" && assetType?.assetTypeId) {
        //console.log(this.assetTypeData);
        var assetFilterData = this.assetTypeData.find(
          (data) => data.assetTypeId === assetType.assetTypeId
        )?.assetCategory;
        this.assetSelectData = assetFilterData;
        this.updateFields(assetFilterData);
      }

      this.mainForm?.updateHidden({
        countryFirstRegistered: false,
        assetLocationOfUse: false,
        supplierName: false,
        assetLeased: false,
      });

      if (this.standardQuoteBaseFormData?.purposeofLoan == configure.LoanPurpose) {
        this.mainForm?.updateHidden({
          assetLeased: true,
        })
      }
    }
    this.formConfig.headerTitle =
      this.addType == "addAsset" ? "Add Asset" : "Add Trade";
    // await this.updateValidation("onInit");

    //  let today = new Date();
    //   if (!this?.mainForm?.get('conditionOfGood')?.value && this.baseFormData?.year > 999) {
    //     if (this.baseFormData?.year >= today?.getFullYear()) {
    //       this?.mainForm?.get('conditionOfGood')?.patchValue('New');
    //     } else {
    //       this?.mainForm?.get('conditionOfGood')?.patchValue('Used');

    //     }
    //   }

    if(this.addType == "addAsset"){
    await this.assetIncreaseDecreaseValidation();
    }
    else{
      await this.tradeIncreaseDecreaseValidation();
    }
    await this.updateAssetData();

  }

  tradeIncreaseDecreaseValidation(){
    const matchTrade = this.standardQuoteBaseFormData?.apiTradeAssetData?.find(
      (trade: any) => trade?.rowNo === this.baseFormData?.rowNo
    );
    if(matchTrade){
      const selectedApiTradeAmount = matchTrade?.tradeAssetValue;

      this.baseSvc.setBaseDealerFormData({
          selectedApiTradeAmount: selectedApiTradeAmount,
      });

    }else {
      console.warn('No matching trade found for tradeRowNo:', this.baseFormData?.rowNo);
    }
  }

  assetIncreaseDecreaseValidation() {
    // Filter the physicalAsset array to find the matching asset based on assetHdrId
    const matchedAsset = this.standardQuoteBaseFormData?.apiPhysicalAssetData?.find(
      (asset: any) => {
        const assetIdentifier = asset?.assetHdrId ?? asset?.id;
        return assetIdentifier === this.baseFormData?.assetHdrId || assetIdentifier === this.baseFormData?.assetId;
      }
    );

    // If a matching asset is found, extract amount and year
    if (matchedAsset) {
      const selectedApiAssetAmount = matchedAsset?.amount || matchedAsset?.costOfAsset;
      const selectedApiAssetYear = matchedAsset?.vehicle?.subModelYear || matchedAsset?.year;

      // Update the base dealer form data with the extracted values
      this.baseSvc.setBaseDealerFormData({
        selectedApiAssetAmount: selectedApiAssetAmount,
        selectedApiAssetYear: selectedApiAssetYear
      });
    } else {
      console.warn('No matching asset found for assetHdrId:', this.baseFormData?.assetHdrId);
    }
  }

 dynamicValidationBasedonAssetType(assetTypeData : any, assetTypeId: any){
    //  const assetTypeData = this.standardQuoteSvc.assetTypeData;
          const assetCategory = assetTypeData.find(
            (data) => data.assetTypeId === assetTypeId
          )?.assetCategory;
          sessionStorage.setItem("assetType", assetCategory || "");
  }

  ngAfterViewInit() {
  this.mainForm?.textSelectOP?.onHide.subscribe(() => {
    this.clearSerach();
  });
}

  clearSerach(){
      setTimeout(() => {
    if (this.assetListbox) {
      this.assetListbox.filterValue = '';
      this.assetListbox._filter(); // reset the filtered list

      // Clear the actual input DOM value (visual)
      const inputEl = this.assetListbox.el.nativeElement.querySelector('.p-listbox-filter');
      if (inputEl) inputEl.value = '';
    }
  }, 100);
  }

  async updateAssetData() {

    //   this.mainForm?.updateProps("assetLocationOfUse", {
    //    list$: "LookUpServices/CustomData",
    //     apiRequest: {
    //       parameterValues: ["Asset location of use"],
    //       procedureName: configure.SPAssetHdrCfdLuExtract, // Assuming configure is imported from the correct path,
    //     },
    //     idName: "value_text"
    // })

    await this.svc.data
      .post("LookUpServices/CustomData", {
        parameterValues: ["Asset location of use"],
        procedureName: configure?.SPAssetHdrCfdLuExtract,
      })
      .subscribe((res) => {
        if (res) {
          const assetLocationOfUse = res?.data?.table.map((item: any) => ({
            label: item.value_text,
            value: item.value_text,
          }));

          this.mainForm.updateList("assetLocationOfUse", assetLocationOfUse);
          return assetLocationOfUse;
        }
      });


    await this.baseSvc.getFormData(
      `LookUpServices/locations?LocationType=country`,
      (res) => {
        let list = res.data;

        const countryFirstRegisteredList = list.map((item) => ({
          label: item.name,
          value: item.name,
        }));

        this.mainForm?.updateList(
          "countryFirstRegistered",
          countryFirstRegisteredList
        );

        return countryFirstRegisteredList;
      }
    );


    await this.baseSvc.getFormData(
      `LookUpServices/locations?LocationType=country`,
      (res) => {
        let list = res.data;

        const countryFirstRegisteredList = list.map((item) => ({
          label: item.name,
          value: item.name,
        }));

        this.mainForm?.updateList(
          "countryFirstRegistered",
          countryFirstRegisteredList
        );

        return countryFirstRegisteredList;
      }
    );

    await this.baseSvc.getFormData(
      `LookUpServices/custom_lookups?PageNo=1&PageSize=100&LookupSetName=VehicleFuelType`,
      (res) => {
        let list = res.data;

        const motivePowerList = list.map((item) => ({
          label: item.lookupValue,
          value: item.lookupValue,
        }));

        this.mainForm?.updateList("motivePower", motivePowerList);

        return motivePowerList;
      }
    );

    await this.baseSvc.getFormData(
      `LookUpServices/custom_lookups?PageNo=1&PageSize=100&LookupSetName=AssetDealType`,
      (res) => {
        let list = res.data;

        const conditionOfGoodList = list.map((item) => ({
          label: item.lookupValue,
          value: item.lookupValue,
        }));

        this.mainForm?.updateList("conditionOfGood", conditionOfGoodList);

        return conditionOfGoodList;
      }
    );
  }

  async callApi() {
    // this.assetTypeData = this.standardQuoteSvc.assetTypeData;
    // console.log(this.standardQuoteSvc?.assetTypeData);

    // await this.loadAssetTypeData();
  }

  assetOptionsList = [];

  async loadAssetTypeData() {
    let dd = this.filterAssetTypeData("All Asset Type"); // Dropdown 2
    let optionsList = [];
    let baseAddress = "All Asset Type";
    let basePath = "All Asset Types / All Asset Type";
    dd.forEach((ele, index) => {
      let itemsList = this.filterAssetTypeData(ele.value); // Dropdown 3

      if (itemsList.length == 0) {
        let fieldValue = ele.value + " / " + baseAddress;
        let path = basePath + " / " + ele.value;
        optionsList.push({
          label: fieldValue,
          value: { value: ele.value, id: ele.id, path: path },
        });
      } else {
        itemsList.forEach((eleA, indexA) => {
          let itemsList1 = this.filterAssetTypeData(eleA.value); // Dropdown 4
          if (itemsList1.length == 0) {
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

  selectAsset() {
    let asset = this.selectedAsset;

    this.mainForm.get("assetName").patchValue(asset.value);
    this.mainForm.get("assetPath").patchValue(asset.path);
    this.mainForm.get("assetTypeId").patchValue(asset.id);

    this.updateAgriculturalValidation();

    this.baseFormData.assetType = {
      assetTypeId: asset.id,
      assetTypeName: asset.value,
      assetTypePath: asset.path,
    };
    
    // For AFV, save user's selection to preserve across updates
    if (this.standardQuoteBaseFormData?.productCode === 'AFV') {
      this.standardQuoteSvc.afvUserSelectedAssetType = {
        assetTypeDD: asset.value,
        assetTypeId: asset.id,
        assetTypeModalValues: asset.path
      };
    }
    
    if (asset.id !== this.assetTypeId) {
      this.toasterService.showToaster({
        severity: "warn",
        detail:
          "You have selected `" +
          this.assetTypeDD +
          "` for Financial Asset. Selecting different Asset Type will replace the Financial Asset Type.",
      });
    }

    var assetFilterData = this.assetTypeData.find(
      (data) => data.assetTypeId === asset.id
    )?.assetCategory;

    // if (this.previousAssetClass != assetFilterData) {
    //   const fieldsToPreserve = ["assetTypeId", "assetName", "assetPath"];

    //   const currentValues = this.mainForm.form.getRawValue();

    //   const preservedValues = {};
    //   fieldsToPreserve.forEach((key) => {
    //     preservedValues[key] = currentValues[key];
    //   });
    //   this.mainForm.form.reset();

    //   this.mainForm.form.patchValue(preservedValues);
    //   this.previousAssetClass = assetFilterData;
    // }
    this.updateFields(assetFilterData);

    // this.mainForm.get('assetTypeModalValues').patchValue()
  }

  async updateFields(data) {
    this.mainForm?.updateHidden({
      regoNumber: false,
      vin: false,
      odometer: false,
      colour: false,
      engineNumber: false,
      ccRating: false,
      motivePower: false,
      features: false,
    });
    // const vinLabel = data === "Marine" ? "HIN" : "VIN";
    // this.mainForm.updateProps("vin", { label: vinLabel });
    this.assetSelectData = data;
    if (data === "Vehicle") {
      this.mainForm?.updateHidden({
        features: true,
        hin: true,
      });
    } else if (data === "Plant") {
      this.mainForm?.updateHidden({
        regoNumber: true,
        vin: true,
        features: true,
        hin: true,
      });
    } else if (data === "Marine") {
      this.mainForm?.updateHidden({
        regoNumber: true,
        features: true,
        vin: true,
        hin: false,
      });
    } else if (data === "EV/Clean Tech") {
      this.mainForm?.updateHidden({
        regoNumber: true,
        odometer: true,
        colour: true,
        engineNumber: true,
        ccRating: true,
        motivePower: true,
        features: true,
        hin: true,
        vin: true,
      });
    } else {
      this.mainForm?.updateHidden({
        regoNumber: false,
        vin: false,
        odometer: false,
        colour: false,
        engineNumber: false,
        ccRating: false,
        motivePower: false,
        features: this.addType == "addAsset" ? false : true,
        hin: true,
      });
    }
    this.mainForm?.form?.get("assetCategory").patchValue(data);
    await this.updateValidation("onInit");
  }

  override async onFormEvent(event: any): Promise<void> {
    super.onFormEvent(event);

    if(event?.name == "assetName"){
      this.dynamicValidationBasedonAssetType(this.assetTypeData, this.baseFormData?.assetType?.assetTypeId || this.assetTypeId);
    }
    // if (event.name == "conditionOfGood" && event.value == "Used") {
    //   this.mainForm.form.controls["odometer"].setValidators(
    //     Validators.required
    //   );
    // } else
    // if (this.addType == "addAsset") {
    //   if (
    //     event.name == "conditionOfGood" &&
    //     (event.value == "New" || event.value == "Demo" || event.value == "DPP")
    //   ) {
    //     this.mainForm.form.controls["odometer"].clearValidators();
    //   }
    // }
    const currentYear = new Date().getFullYear();
    if (event.name === "year" && event?.value?.length > 3) {
      if (event?.value > currentYear + 1) {
        this.toasterSvc.showToaster({
          severity: "error",
          detail: "Year cannot be greater than current year + 1",
        });
      }
    }
  }

  showSelectAssetType() {
    this.svc.dialogSvc
      .show(AssetTypesComponent, "Asset Type", {
        templates: {
          footer: null,
        },
        data: {
          assetTypeData: this.assetTypeData,
          assetTypeModalValues: this.baseFormData?.assetType?.assetTypePath,
        },
        width: "60vw",
      })
      .onClose.subscribe((data) => {
        if (data?.assetTypeData && data?.btnType == "submit") {
          this.mainForm.get("assetName").patchValue(data?.assetTypeData);

          this.assetPath = data?.assetTypeValues;
          this.assetTypeId = data?.assetTypeId;

          this.mainForm.get("assetPath").patchValue(this.assetPath);
          this.mainForm.get("assetTypeId").patchValue(this.assetTypeId);
          this.baseSvc.setBaseDealerFormData({
            assetType: {
              assetTypeId: data?.assetTypeId,
              assetTypeName: data?.assetTypeData,
              assetTypePath: data?.assetTypeValues,
            },
          });
          
          // For AFV, save user's selection to preserve across updates
          if (this.standardQuoteBaseFormData?.productCode === 'AFV') {
            this.standardQuoteSvc.afvUserSelectedAssetType = {
              assetTypeDD: data?.assetTypeData,
              assetTypeId: data?.assetTypeId,
              assetTypeModalValues: data?.assetTypeValues
            };
          }

          this.updateAgriculturalValidation();
        }

        var assetFilterData = this.assetTypeData.find(
          (data) => data.assetTypeId === data?.assetTypeId
        )?.assetCategory;
        // if (this.previousAssetClass != assetFilterData) {
        //   const fieldsToPreserve = ["assetTypeId", "assetName", "assetPath"];

        //   const currentValues = this.mainForm.form.getRawValue();

        //   const preservedValues = {};
        //   fieldsToPreserve.forEach((key) => {
        //     preservedValues[key] = currentValues[key];
        //   });
        //   this.mainForm.form.reset();

        //   this.mainForm.form.patchValue(preservedValues);
        //   this.previousAssetClass = assetFilterData;
        // }
        this.updateFields(assetFilterData);
      });
  }

  override onButtonClick(event: any): void {
    if (event.field.name == "assetName") {
      this.showSelectAssetType();
    }
  }

  pageCode: string = "AssetComponent";
  modelName: string = "AssetDetailsComponent";

  override async onFormReady(): Promise<void> {
    // this.mainForm && this.mainForm?.form.get("assetName").disabled == true
    if(isWorkflowStatusInViewOrEdit(this.AFworkflowStatus)){

      this.mainForm?.updateProps("assetName", { disabled: true });
    }
    else{
      this.mainForm?.updateProps("assetName", { disabled: false });
    }

    if (this.addType == "addTrade") {
      this.mainForm.form.get("assetCategory").patchValue("Other");

      // Only pre-populate costOfAsset for the FIRST trade being added
      // For subsequent trades, user must enter the value manually
      const existingActiveTrades = this.tradeSvc.tradeList.filter(t => t.changeAction !== 'delete');
      if (existingActiveTrades.length === 0 && this.mode !== "edit") {
        this.tradeSvc.tradeAmountForAddTrade$.pipe(
          takeUntil(this.destroy$),
          distinctUntilChanged()
        ).subscribe((tradeAmount) => {
          if (tradeAmount > 0 && this.mainForm?.get("costOfAsset")) {
            
              this.mainForm.get("costOfAsset").patchValue(tradeAmount, { emitEvent: false });
              this.baseFormData.costOfAsset = tradeAmount;
            
          }
        });
      }
    }

    await this.updateValidation("onInit");

    setTimeout(() => this.updateAgriculturalValidation());

    if (this.mode == "edit" && this.addType == "addAsset") {
      this.mainForm
        .get("countryFirstRegistered")
        .patchValue(this.countryFirstRegistered);

      if (this.baseFormData?.costOfAsset) {
        this.mainForm.get("costOfAsset").patchValue(this.baseFormData.costOfAsset, {
          emitEvent: false
        });
      }
    }
    super.onFormReady();
    if (this.mode == "edit" && this.addType == "addAsset") {
      // For AFV, don't patch asset type from baseFormData - preserve user selection
      if (this.standardQuoteBaseFormData?.productCode !== 'AFV') {
        this.mainForm.form
          .get("assetName")
          .patchValue(this.baseFormData?.assetType?.assetTypeName);
      } else {
       
      }
    }
  }

  override async onBlurEvent(event): Promise<void> {

    // if(event.name == "costOfAsset" && this.baseFormData?.AFworkflowStatus == "Ready for Documentation"){
    //   let currentcostOfAsset = this.mainForm.get("costOfAsset").value;
    //   if(currentcostOfAsset > this.baseFormData?.costOfAsset){        
    //     this.toasterSvc.showToaster({
    //       severity: "error",
    //       detail: "Dealer Origination Fee cannot be increased in Ready for Documentation state.",
    //     });
    //     // return;
    //   }
    // }

    let sessionWorkFlowState = sessionStorage?.getItem("workFlowStatus");
    
    if (sessionWorkFlowState == "Approved") {
      if (this.addType == "addAsset") {
        if (event.name == "costOfAsset") {
          const currentCostOfAsset = this.mainForm.get("costOfAsset")?.value;
          if (currentCostOfAsset > this.baseFormData?.selectedApiAssetAmount) {
            this.toasterService.showToaster({
              severity: "error",
              detail: "Cost of Asset cannot be increased in Ready for Documentation state.",
            });
            return;
          }
        }

        if (event.name == "year") {
          const currentYear = this.mainForm.get("year")?.value;
          if (currentYear < this.baseFormData?.selectedApiAssetYear) {
            this.toasterService.showToaster({
              severity: "error",
              detail: "Year cannot be decreased in Ready for Documentation state.",
            });
            return;
          }
        }
      } else {
        if (event.name == "costOfAsset") {
          const currentCostOfAsset = this.mainForm.get("costOfAsset")?.value;
          if (currentCostOfAsset < this.baseFormData?.selectedApiTradeAmount) {
            this.toasterService.showToaster({
              severity: "error",
              detail: "Cost of Trade-in cannot be decreased in Ready for Documentation state.",
            });
            return;
          }
        }
      }
    }
    if (event.name !== "conditionOfGood") {
      const conditionalFields = ['regoNumber', 'vin', 'serialChassisNumber', 'hin'];

      if (conditionalFields.includes(event.name)) {
        if (this.mainForm.get(event.name)?.value && this.mainForm.get(event.name)?.dirty) {
          await this.updateValidation(event);
        }
      } else {
        if (this.mainForm.get(event.name)?.value || this.mainForm.get(event.name)?.dirty) {
          await this.updateValidation(event);
        }
      }
    }

  }

  override async onValueTyped(event) {
    if (event?.name == "year") {
      let today = new Date();
      if (event?.data?.length > 3) {
        if (event?.data == today?.getFullYear()) {
          this?.mainForm?.get("conditionOfGood")?.patchValue("New");
        } else if (event?.data < today?.getFullYear()) {
          this?.mainForm?.get("conditionOfGood")?.patchValue("Used");
        } else {
          this?.mainForm?.get("conditionOfGood")?.patchValue("New");
        }
      }
    }
    if (event.name === "costOfAsset" && this.addType === "addTrade" && !this.isUpdatingCostFromService) {
    const costValue = event.data || 0;
    this.tradeSvc.updateTradeAssetValue(costValue);
    this.baseFormData.costOfAsset = costValue;
   if (this.tradeSvc.tradeEditIndex >= 0) {
      this.tradeSvc.tradeList[this.tradeSvc.tradeEditIndex] = {
        ...this.tradeSvc.tradeList[this.tradeSvc.tradeEditIndex],
        tradeAssetValue: costValue
      };
    }
    this.tradeSvc.updateTradeAssetValue(costValue);
     this.standardQuoteSvc.isAssetTrade = true;
  }
    // if (event.name != "vin") {
    await this.updateValidation(event);
    // }
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
    if (quotesDetails?.type !== "tabNav") {
      var result: any = await this.updateValidation("onSubmit");
      if (!result?.status) {
        // this.toasterSvc.showToaster({
        //   severity: "error",
        //   detail: "I7",
        // });
      }
    }
  }

  // override renderComponentWithNewData(data?: any): void {
  //   let params: any = this.route.snapshot.params;

  //   this.addType = params?.type;
  //   if (this.standardQuoteSvc?.isMotoCheckSearch) {
  //     if(this.addType == 'addTrade'){
  //     this.mainForm.form.patchValue(this.tradeSvc?.tradeEditData);
  //     }else{
  //             this.mainForm.form.patchValue(this.tradeSvc?.assetEditData);

  //     }
  //   }
  //   console.log(this.tradeSvc?.tradeEditData)
  //   super.renderComponentWithNewData()
  //   this.cdr.detectChanges()
  // }

  updateAgriculturalValidation() {
    const assetPath =
      this.mainForm.get("assetPath")?.value?.toLowerCase() || "";
    const isAgricultural = assetPath.includes("agricultural");
    const control = this.mainForm.get("assetLocationOfUse");

    if (isAgricultural) {
      control.setValidators([Validators.required]);
    } else {
      control.clearValidators();
    }
    control.updateValueAndValidity();
  }

  // Override patchApiData to protect asset type for AFV
  override patchApiData(data?: any): void {
    const dataToUse = data || this.baseFormData;
    
    // For AFV, preserve current asset type values
    if (this.standardQuoteBaseFormData?.productCode === 'AFV') {
      // First check if we have a saved value from the service
      const savedAssetType = this.standardQuoteSvc.afvUserSelectedAssetType;
      const currentAssetName = savedAssetType?.assetTypeDD || this.mainForm?.get('assetName')?.value;
      const currentAssetTypeId = savedAssetType?.assetTypeId || this.mainForm?.get('assetTypeId')?.value;
      const currentAssetPath = savedAssetType?.assetTypeModalValues || this.mainForm?.get('assetPath')?.value;
      
      // Call parent's patch
      super.patchApiData(dataToUse);
      
      // Restore asset type values for AFV
      if (currentAssetName) {
        this.mainForm?.get('assetName')?.patchValue(currentAssetName, { emitEvent: false });
      }
      if (currentAssetTypeId) {
        this.mainForm?.get('assetTypeId')?.patchValue(currentAssetTypeId, { emitEvent: false });
      }
      if (currentAssetPath) {
        this.mainForm?.get('assetPath')?.patchValue(currentAssetPath, { emitEvent: false });
      }
      this.restoreConditionFromSummary();
    } else {
      super.patchApiData(dataToUse);
      this.restoreConditionFromSummary();
    }
  }
  private restoreConditionFromSummary(): void {
    const conditionDD = this.standardQuoteBaseFormData?.conditionDD;
    if (conditionDD && this.mainForm?.get('conditionOfGood')) {
      let conditionLabel: string | null = null;
      if (conditionDD === 781) {
        conditionLabel = "New";
      } else if (conditionDD === 782) {
        conditionLabel = "Used";
      }
      if (conditionLabel) {
        this.mainForm.get('conditionOfGood').patchValue(conditionLabel, { emitEvent: false });
      }
    }
  }
}
