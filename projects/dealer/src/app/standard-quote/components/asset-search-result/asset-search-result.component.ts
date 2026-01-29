import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CloseDialogData, CommonService, DataService, ToasterService } from "auro-ui";
import { AssetTradeSummaryService } from "../asset-insurance-summary/asset-trade.service";
import { PhysicalAsset } from "../../models/assetsTrade";
import { ValidationService } from "auro-ui";
import { SearchAssetComponent } from "../search-asset/search-asset.component";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { map } from "rxjs";

@Component({
  selector: "app-asset-search-result",
  templateUrl: "./asset-search-result.component.html",
  styleUrl: "./asset-search-result.component.scss",
})
export class AssetSearchResultComponent implements AfterViewInit, OnInit {
  formConfig: any;
  mainForm: any;
  assetData: any;
  constructor(
    public svc: CommonService,
    public route: ActivatedRoute,
    public dataSvc: DataService,
    public router: Router,
    public tradeSvc: AssetTradeSummaryService,
    public toasterService: ToasterService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef,
    public baseSvc: StandardQuoteService,
  ) { }

  apiData = [];
  motoCheckData: any;
  ngOnInit(): void {
    this.apiData = this.tradeSvc.assetSearchResult;
    this.mapData();
  }

  ngAfterViewInit(): void { }
  dataList = [];
  mapData() {
    this.dataList = this.apiData;
  }
  columns = [
    {field: "radio", headerName: "" },
    { field: "assetId", headerName: "Asset Id" },
    { field: "regoNumber", headerName: "Rego No" },
    { field: "make", headerName: "Make" },
    { field: "model", headerName: "Model" },
    { field: "variant", headerName: "Variant" },
    { field: "year", headerName: "Year" },
    { field: "vin", headerName: "VIN" },
    { field: "chassisNumber", headerName: "Serial / Chassis No" },
  ];

  selectedRowData: any;
  getSelectedRow(event) {
    this.selectedRowData = event;
  }

  redirectToHome() {
    this.svc.router.navigateByUrl('/standard-quote');
  }

  redirectToSearch() {
    this.svc.router.navigateByUrl('/standard-quote');
    this.svc.dialogSvc
      .show(SearchAssetComponent, 'Search Asset', {
        templates: {
          footer: null,
        },
        data: {
          modalType: 'Search Asset',
          searchType: "dealerInventory",
          bindData: true
        },

        width: '55vw',
      })
      .onClose.subscribe((data: CloseDialogData) => { });
  }



  onClickAdd() {
    let url = this.router.url;
    if (url == "/standard-quote/asset-search-result") {
      this.addAsset();
    }
    if (url == "/standard-quote/trade-search-result") {
      this.addTrade();
    }
  }

  // addAsset() {
  //   debugger
  //   const asset = this.selectedRowData;

  //   if (!asset.vin && !asset.regoNumber && !asset.chassisNumber) {
  //     // this.toasterService.showToaster({
  //     //   severity: 'error',
  //     //   detail: 'Not a valid asset.',
  //     // });
  //     // return;
  //   }

  //   let match;
  //   let matchFound = this.tradeSvc.assetList.find((ele) => {
  //     if (ele.vin && ele.vin == asset.vin) match = "vin";
  //     if (ele.regoNumber && ele.regoNumber == asset.regoNumber)
  //       match = "regoNumber";
  //     if (ele.chassisNumber && ele.chassisNumber == asset.chassisNumber)
  //       match = "chassisNumber";

  //     return (
  //       (ele.vin && ele.vin == asset.vin) ||
  //       (ele.regoNumber && ele.regoNumber == asset.regoNumber) ||
  //       (asset.chassisNumber && asset.chassisNumber == ele.chassisNumber)
  //     );
  //   });

  //   let tradematch;
  //   let tradematchFound = this.tradeSvc.tradeList.find((ele) => {
  //     if (ele.tradeVinNo && ele.tradeVinNo == asset.vin) tradematch = "vin";
  //     if (ele.tradeRegoNo && ele.tradeRegoNo == asset.regoNumber)
  //       tradematch = "regoNumber";
  //     if (
  //       ele.tradeSerialOrChassisNo &&
  //       ele.tradeSerialOrChassisNo == asset.chassisNumber
  //     )
  //       tradematch = "chassisNumber";

  //     return (
  //       (ele.tradeVinNo && ele.tradeVinNo == asset.vin) ||
  //       (ele.tradeRegoNo && ele.tradeRegoNo == asset.regoNumber) ||
  //       (asset.chassisNumber &&
  //         asset.chassisNumber == ele.tradeSerialOrChassisNo)
  //     );
  //   });

  //   if (matchFound) {
  //     if (match == "vin") {
  //       this.toasterService.showToaster({
  //         severity: "error",
  //         detail: "Asset with same vin cannot be added.",
  //       });
  //     }
  //     if (match == "regoNumber") {
  //       this.toasterService.showToaster({
  //         severity: "error",
  //         detail: "Asset with same rego number cannot be added.",
  //       });
  //     }
  //     if (match == "chassisNumber") {
  //       this.toasterService.showToaster({
  //         severity: "error",
  //         detail: "Asset with same chassis number cannot be added.",
  //       });
  //     }
  //   } else if (tradematchFound) {
  //     if (tradematch == "vin") {
  //       this.toasterService.showToaster({
  //         severity: "error",
  //         detail: "Trade already added with the selected vin",
  //       });
  //     }
  //     if (tradematch == "regoNumber") {
  //       this.toasterService.showToaster({
  //         severity: "error",
  //         detail: "Trade already added with the selected rego number",
  //       });
  //     }
  //     if (tradematch == "chassisNumber") {
  //       this.toasterService.showToaster({
  //         severity: "error",
  //         detail: "Trade already added with the selected chassis number",
  //       });
  //     }
  //   } else {
  //     // Add asset to the service list and update the subject
  //     // this.tradeSvc.assetList.push({
  //     //   ...asset,
  //     //   actions: this.tradeSvc.actions,
  //     // });
  //     // this.tradeSvc.assetListSubject.next(this.tradeSvc.assetList);

  //     // Navigate to the desired route
  //     //this.svc.router.navigateByUrl("/dealer/standard-quote");
  //     this.svc.router.navigateByUrl("dealer/asset/addAsset");
  //   }
  // }

  async addAsset(): Promise<void> {
    const asset = this.selectedRowData;
    const selectedVinNo = asset[0]?.vin;
     const searchResultAsset = this.apiData.find(item => item.vin === selectedVinNo);
    await this.dataSvc
    this.dataSvc.get(`AssetType/get_asset?VinNo=${selectedVinNo}`)
      .pipe(map((res) => {
        let matchedAsset = res?.data;
        matchedAsset.assetId = 0;
        if (searchResultAsset) {
        matchedAsset = {
          ...matchedAsset,
          year: searchResultAsset.year || matchedAsset.year,
          // make: searchResultAsset.make || matchedAsset.make,
          // model: searchResultAsset.model || matchedAsset.model,
          // variant: searchResultAsset.variant || matchedAsset.variant,
          // regoNumber: searchResultAsset.regoNumber || matchedAsset.regoNumber,
          // vin: searchResultAsset.vin || matchedAsset.vin,
          // chassisNumber: searchResultAsset.chassisNumber || matchedAsset.chassisNumber,
          
        };
      }
        console.log('matched asset', matchedAsset);
        if (matchedAsset) {
          this.tradeSvc.assetEditData = {
            ...matchedAsset,
          };
          this.baseSvc.isAssetSearch = true;
          this.svc.router.navigateByUrl("asset/addAsset/edit");
        }
      })
      )
      .toPromise();
  }


  //   async addAsset(): Promise<void> {
  //   const asset = this.selectedRowData;
  //   const selectedVinNo = asset[0]?.vin;
  //   await this.dataSvc
  //   const matchedAsset = this.tradeSvc.searchAssetData?.find(
  //   (item) => item?.vin === selectedVinNo);

  //    if (matchedAsset) {
  //   this.tradeSvc.assetEditData = {
  //     ...matchedAsset,
  //   };

  //   this.baseSvc.isAssetSearch = true;
  //   this.tradeSvc.searchAssetData = [];
  //   this.svc.router.navigateByUrl("dealer/asset/addAsset/edit");
  //   }
  // }


  addTrade() {
    let asset = this.selectedRowData;

    if (!asset.vin && !asset.regoNumber && !asset.chassisNumber) {
      this.toasterService.showToaster({
        severity: "error",
        detail: "Not a valid trade asset.",
      });
      return;
    }

    let match;
    let matchFound = this.tradeSvc.tradeList.find((ele) => {
      if (ele.tradeVinNo && ele.tradeVinNo == asset.vin) match = "vin";
      if (ele.tradeRegoNo && ele.tradeRegoNo == asset.regoNumber)
        match = "regoNumber";
      if (
        ele.tradeSerialOrChassisNo &&
        ele.tradeSerialOrChassisNo == asset.chassisNumber
      )
        match = "chassisNumber";

      return (
        (ele.tradeVinNo && ele.tradeVinNo == asset.vin) ||
        (ele.tradeRegoNo && ele.tradeRegoNo == asset.regoNumber) ||
        (ele.tradeSerialOrChassisNo &&
          asset.chassisNumber == ele.tradeSerialOrChassisNo)
      );
    });

    let assetmatch;
    let assetmatchFound = this.tradeSvc.assetList.find((ele) => {
      if (ele.vin && ele.vin == asset.vin) assetmatch = "vin";
      if (ele.regoNumber && ele.regoNumber == asset.regoNumber)
        assetmatch = "regoNumber";
      if (ele.chassisNumber && ele.chassisNumber == asset.chassisNumber)
        assetmatch = "chassisNumber";

      return (
        (ele.vin && ele.vin == asset.vin) ||
        (ele.regoNumber && ele.regoNumber == asset.regoNumber) ||
        (ele.chassisNumber && asset.chassisNumber == ele.chassisNumber)
      );
    });

    if (matchFound) {
      if (match == "vin") {
        this.toasterService.showToaster({
          severity: "error",
          detail: "Trade with same vin cannot be added.",
        });
      }
      if (match == "regoNumber") {
        this.toasterService.showToaster({
          severity: "error",
          detail: "Trade with same rego number cannot be added.",
        });
      }
      if (match == "chassisNumber") {
        this.toasterService.showToaster({
          severity: "error",
          detail: "Trade with same chassis number cannot be added.",
        });
      }
    } else if (assetmatchFound) {
      if (assetmatch == "vin") {
        this.toasterService.showToaster({
          severity: "error",
          detail: "Asset already added with the selected vin",
        });
      }
      if (assetmatch == "regoNumber") {
        this.toasterService.showToaster({
          severity: "error",
          detail: "Asset already added with the selected rego number",
        });
      }
      if (assetmatch == "chassisNumber") {
        this.toasterService.showToaster({
          severity: "error",
          detail: "Asset already added with the selected chassis number",
        });
      }
    } else {
      // Add asset to the service list and update the subject

      let formattedAsset = {
        tradeName: asset?.assetName || "",
        tradeAssetValue: asset?.costOfAsset || 0,
        conditionOfGood: asset?.conditionOfGood || "",
        tradeYear: asset?.year || 0,
        tradeMake: asset?.make || "",
        tradeModel: asset?.model || "",
        tradeVariant: asset?.variant || "",
        tradeRegoNo: asset?.regoNumber || "",
        tradeVinNo: asset?.vin || "",
        tradeOdometer: asset?.odometer || "",
        tradeColour: asset?.colour || "",
        serialChassisNumber: asset?.chassisNumber || "",
        tradeSerialOrChassisNo: asset?.chassisNumber || "",
        tradeEngineNo: asset?.engineNumber || "",
        tradeCCNo: asset?.ccRating || "",
        tradePath: "",
        tradeMotivePower: asset?.motivePower || "",
      };
      this.tradeSvc.tradeList.push({
        ...formattedAsset,
        actions: this.tradeSvc.actions,
      });
      this.tradeSvc.tradeListSubject.next(this.tradeSvc.tradeList);

      // Navigate to the desired route
      this.svc.router.navigateByUrl("/standard-quote");
    }
  }

  pageCode: string = "";
  modelName: string = "";

  async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
  }

  async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  async onValueEvent(event): Promise<void> {
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