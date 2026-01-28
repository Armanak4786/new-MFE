import { ChangeDetectorRef, Component } from "@angular/core";
import { CloseDialogData, CommonService } from "auro-ui";
import { ActivatedRoute, Router } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AssetTradeSummaryService } from "./asset-trade.service";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { cloneDeep } from "lodash";
import { ToasterService, ValidationService } from "auro-ui";
import { map } from "rxjs";
import { TradeInAssetChangeActions } from "../../models/assetsTrade";
import configure from "../../../../../public/assets/configure.json";


@Component({
  selector: "app-asset-insurance-summary",
  templateUrl: "./asset-insurance-summary.component.html",
  styleUrl: "./asset-insurance-summary.component.scss",
})
export class AssetInsuranceSummaryComponent extends BaseStandardQuoteClass {
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public router: Router,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public tradeSvc: AssetTradeSummaryService,
    public override baseSvc: StandardQuoteService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
  }

  AFworkflowStatus:boolean = false;

  override async ngOnInit(): Promise<void> {
   this.assetList = this.tradeSvc.assetList
.map(item => ({
  ...item,
  regoOrVin: this.getFirstAvailableField([
    item.regoNumber,
    item.vin, 
    item.serialChassisNumber
  ]) || "-"
}));

this.tradeList = this.tradeSvc.tradeList.map(item => ({
  ...item,
  regoOrVin: this.getFirstAvailableField([
    item.tradeRegoNo,
    item.tradeVinNo, 
    item.tradeSerialOrChassisNo
  ]) || "-"
}));

        this.updateVisibleTradeList()

     
     // console.log("assetList",this.assetList);
      
    this.insuranceList = this.tradeSvc.insuranceList;
    await super.ngOnInit();
    
    //  if((configure?.workflowStatus?.view?.includes(this.baseFormData?.AFworkflowStatus)) || (configure?.workflowStatus?.edit?.includes(this.baseFormData?.AFworkflowStatus))){
    //   this.AFworkflowStatus = true;
    // }
    this.baseSvc.isAssetSearch = false;
  }

  columnsAsset = [
    // { field: "assetId", headerName: "Id" },
    // { field: "vehicleClassId", headerName: "VId" },
    { field: "number", headerName: "Number", format: "#serialNo" },
    { field: "assetName", headerName: "Asset" },
    { field: "regoOrVin", headerName: "Rego / VIN"},
    {
      field: "costOfAsset",
      headerName: "Value ($)",
      format: "#currency",
    },
    { field: "insurer", headerName: "Insurer" },
    {
      field: "actions",
      headerName: "Action",
      format: "#icons",
    },
  ];

  assetList = this.tradeSvc.assetList;
  insuranceList = this.tradeSvc.insuranceList;
  columnsTrade = [
    { field: "number", headerName: "Number", format: "#serialNo" },
    { field: "tradeName", headerName: "Asset" },
    {
      field: "regoOrVin",
      headerName: "Rego / VIN",
    },
    {
      field: "tradeAssetValue",
      headerName: "Value ($)",
      format: "#currency",
    },
    {
      field: "actions",
      headerName: "Action",
      format: "#icons",
    },
  ];

  tradeList = this.tradeSvc.tradeList;
  visibleTradeList = this.tradeSvc.tradeList;

  showAssetSearchPopup(header) {
    this.ref.close({
      submitType: "submit",
      submitFor: header,
    });
  }
private getFirstAvailableField(fields: (string | null | undefined)[]): string | null {
  return fields.find(field => 
    field && 
    field.trim() && 
    field.trim() !== "0" && 
    field.toLowerCase() !== "null"
  ) || null;
}

  async splitAsset(asset, index) {
    if (asset?.assetId > 0) {
      let request = {
        numberOfPhysicalAssets: 2,
        isApplyInsuranceToIndividualAssets: true,
        childPhysicalAssetsToCreate: [],
      };

      let res = await this.svc.data
        .post(
          `AssetType/create_split_asset?assetHdrId=${asset?.assetId}`,
          request
        )
        .pipe(
          map((res) => {
            return res?.items?.[0]?.childPhysicalAssetItems;
          })
        )
        .toPromise();

      console.log(res);

      if (res) {
        this.tradeSvc.assetList.splice(index, 1);

        let arr: [] = cloneDeep(
          res.map((obj) => ({
            ...asset,
            assetId: obj.assetHdrId,
            costOfAsset: this.baseFormData.cashPriceValue / 2,
            actions: this.tradeSvc.actions,
          }))
        );

        arr.forEach((ele) => {
          this.tradeSvc.assetList.push(ele);
        });
        this.tradeSvc.assetListSubject.next(this.tradeSvc.assetList);
      }
    }
  }

  onAssetCellClick(event) {
    if (this.accessMode !== "view") {
      console.log(this.baseFormData, "asset-insurance");
      
      if (event.actionName == "edit") {
        if (this.baseFormData?.financialAssetInsurance && [event.index]) {
          this.tradeSvc.assetEditIndex = event.index;

           this.baseFormData.physicalAsset[event.index] = {
             ...this.baseFormData.physicalAsset[event.index],
             isEdited: true
           };
         
           this.tradeSvc.assetEditData = {
             ...this.baseFormData.physicalAsset[event.index],
             ...this.baseFormData.financialAssetInsurance[event.index],
           };
        } else {
            this.baseFormData.physicalAsset[event.index] = {
            ...this.baseFormData.physicalAsset[event.index],
             isEdited: true
            };
            
          this.tradeSvc.assetEditData = {
            ...this.baseFormData?.physicalAsset[event.index],
          };
        }
        this.router.navigateByUrl("asset/addAsset/edit");
        this.ref.close();
      } else if (event.actionName == "delete") {

      if((configure?.workflowStatus?.view?.includes(this.baseFormData?.AFworkflowStatus)) || (configure?.workflowStatus?.edit?.includes(this.baseFormData?.AFworkflowStatus))){
        return;
      }

        let assetId = this.assetList?.[event.index]?.assetId
        if (assetId) {
          if (!this.tradeSvc?.deleteAssetList?.includes(assetId)) {
            this.tradeSvc?.deleteAssetList?.push(assetId);
          }
        }
        this.assetList.splice(event.index, 1);
        this.tradeSvc.assetList = this.assetList;
        this.tradeSvc.assetListSubject.next(this.tradeSvc.assetList);
        this.insuranceList.splice(event.index, 1);
        this.tradeSvc.insuranceList = this.insuranceList;
        this.tradeSvc.insuranceListSubject.next(this.tradeSvc.insuranceList);
      } else if (event.actionName == "copy") {

         if((configure?.workflowStatus?.view?.includes(this.baseFormData?.AFworkflowStatus)) || (configure?.workflowStatus?.edit?.includes(this.baseFormData?.AFworkflowStatus))){
            return;
          }

        // if (this.baseFormData?.contractId) {
        //   this.splitAsset(this.assetList[event.index], event.index);
        // } else {
        //   this.assetList.splice(
        //     event.index + 1,
        //     0,
        //     cloneDeep(this.assetList[event.index])
        //   );
        //   const cost = this.assetList?.[event.index]?.costOfAsset;
        //   this.assetList[event.index].costOfAsset = cost / 2;
        //   this.assetList[event.index + 1].costOfAsset = cost / 2;

        //   this.tradeSvc.assetList = this.assetList;
        //   this.tradeSvc.assetListSubject.next(this.tradeSvc.assetList);

        //   this.insuranceList.splice(
        //     event.index + 1,
        //     0,
        //     cloneDeep(this.insuranceList[event.index])
        //   );

        //   this.tradeSvc.insuranceList = this.insuranceList;
        //   this.tradeSvc.insuranceListSubject.next(this.tradeSvc.insuranceList);
        // }

        this.assetList.splice(
          event.index + 1,
          0,
          cloneDeep(this.assetList[event.index])
        );
        let assetId = this.assetList?.[event.index]?.assetId
        if (assetId) {
            // this.assetList[event.index] = {
            //   ...this.assetList[event.index],
            //   copyasset: true,
            // }

            this.assetList[event.index + 1] = {
              ...this.assetList[event.index + 1],
              copyasset: true,
            }
        }
        
        // const cost = this.assetList?.[event.index]?.costOfAsset;
        // this.assetList[event.index].costOfAsset = cost / 2;
        // this.assetList[event.index + 1].costOfAsset = cost / 2;

        this.tradeSvc.assetList = this.assetList;
        this.tradeSvc.assetListSubject.next(this.tradeSvc.assetList);

        this.insuranceList.splice(
          event.index + 1,
          0,
          cloneDeep(this.insuranceList[event.index])
        );

        this.tradeSvc.insuranceList = this.insuranceList;
        this.tradeSvc.insuranceListSubject.next(this.tradeSvc.insuranceList);

        //clone data
          if (this.baseFormData?.financialAssetInsurance && [event.index]) {
          console.log( this.tradeSvc.assetEditIndex,'index data')
          console.log(event.index,'event index data')
          this.tradeSvc.assetEditIndex = event.index + 1;

          this.tradeSvc.assetEditData = {
            ...this.baseFormData?.physicalAsset[event.index + 1],
            ...this.baseFormData?.financialAssetInsurance[event.index + 1],
          };
        } else {
          this.tradeSvc.assetEditData = {
            ...this.baseFormData?.physicalAsset[event.index + 1],
          };
        }
        this.router.navigateByUrl("asset/addAsset/edit");
        this.ref.close();
      }
    }
  }

  override onStatusChange(statusDetails: any): void {
    super.onStatusChange(statusDetails);

    if((configure?.workflowStatus?.view?.includes(statusDetails?.currentState)) || (configure?.workflowStatus?.edit?.includes(statusDetails?.currentState))){
      this.isDisable = true;
    }

  }

//   isDisabled() {
//   if(configure?.workflowStatus?.view?.includes(this.baseFormData?.AFworkflowStatus) || (configure?.workflowStatus?.edit?.includes(this.baseFormData?.AFworkflowStatus))){
//     // this.AFworkflowStatus = true; 
//     return true;
//   }
//   return false;
// }

  onTradeCellClick(event) {

    if (this.accessMode !== "view") {
      
      if (event.actionName == "edit") {
         const itemToEdit = this.visibleTradeList[event.index]; 
      const originalIndex = this.tradeList.findIndex(t => t === itemToEdit); 
        this.tradeSvc.tradeEditIndex = originalIndex;
        if (this.baseFormData?.tradeInAssetRequest) {
          this.tradeSvc.tradeEditData = {
            ...this.baseFormData?.tradeInAssetRequest[originalIndex],
          };
        }
        this.router.navigateByUrl("dealer/trade/addTrade/edit");
        this.ref.close();
      } else if (event.actionName == "delete") {
       
        
        
        const itemToDelete = this.visibleTradeList[event.index];
      const originalIndex = this.tradeList.findIndex(t => t === itemToDelete); 
        //  const itemToDelete = this.tradeList[event.index];

              if (itemToDelete.isExist) {
                this.tradeList[originalIndex].changeAction = TradeInAssetChangeActions.delete;
              } else {
                this.tradeList.splice(originalIndex, 1);
              }

        this.tradeSvc.tradeList = this.tradeList;
        this.updateVisibleTradeList()
        this.tradeSvc.tradeListSubject.next(this.tradeSvc.tradeList);
      } else if (event.actionName == "copy") {
        // this.tradeList.splice(
        //   event.index + 1,
        //   0,
        //   cloneDeep(this.tradeList[event.index])
        // );
        // this.tradeSvc.tradeList = this.tradeList;
        // this.tradeSvc.tradeListSubject.next(this.tradeSvc.tradeList);
      const itemToCopy = this.visibleTradeList[event.index]; // from UI
      const originalIndex = this.tradeList.findIndex(t => t === itemToCopy);
      const clonedTrade = cloneDeep(itemToCopy);
		  delete clonedTrade.tradeRegoNo;
		  delete clonedTrade.tradeVinNo;
		  delete clonedTrade.tradeSerialOrChassisNo;
      delete clonedTrade.regoOrVin;
        clonedTrade['changeAction']=TradeInAssetChangeActions.create
		  this.tradeList.splice(originalIndex  + 1, 0, clonedTrade);
		  this.tradeSvc.tradeList = this.tradeList;
      this.updateVisibleTradeList()
		  this.tradeSvc.tradeListSubject.next(this.tradeSvc.tradeList);

        this.insuranceList.splice(
          originalIndex  + 1,
          0,
          cloneDeep(this.insuranceList[originalIndex ])
        );
        this.tradeSvc.insuranceList = this.insuranceList;
        this.tradeSvc.insuranceListSubject.next(this.tradeSvc.tradeList);
      }
    }
  }

  updateVisibleTradeList(): void {
  this.visibleTradeList = this.tradeList.filter(t => t.changeAction !== 'delete');
  
}
  pageCode: string = "";
  modelName: string = "";

  override onFormEvent(event: any): void {
    super.onFormEvent(event);
  }

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

  override async onStepChange(quotesDetails: any): Promise<void> {
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
