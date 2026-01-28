import { Component } from "@angular/core";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { SettlementQuotePopupComponent } from "../settlement-quote-popup/settlement-quote-popup.component";
import { CloseDialogData, CommonService } from "auro-ui";
import { DashboardService } from "../../../dashboard/services/dashboard.service";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-settlement-quote-details",
  templateUrl: "./settlement-quote-details.component.html",
  styleUrl: "./settlement-quote-details.component.scss",
})
export class SettlementQuoteDetailsComponent extends BaseStandardQuoteClass {
  contractId: any;
  quoteValidDate: any;
  custumerDetails: any = [];
  assetDetails: any[] = [];
  standardSettlementAmountData: any;
  refinancingSettlementAmountData: any;
  settlementContractId: any;
  creationMode: any;
  settlementTotalAmount: any;
  contractData;
  // header = [
  //   { field: "customerName", headerName: "UDC Customer Name" },
  //   { field: "customerNo", headerName: "UDC Customer Number" },
  //   { field: "customerType", headerName: "Customer Type" },
  //   { field: "roleName", headerName: "Customer Role" },
  // ];
  // assetHeader = [
  //   { field: "loanNumber", headerName: "Loan Number" },
  //   { field: "goodsDescription", headerName: "Goods Description" },
  //   { field: "description", headerName: "Description" },
  // ];
  header = [
    {
      field: "customerName",
      headerName: "UDC Customer Name",
      class: "text-600",
    },
    {
      field: "customerNo",
      headerName: "UDC Customer Number",
      class: "text-600",
    },
    { field: "customerType", headerName: "Customer Type", class: "text-600" },
    { field: "roleName", headerName: "Customer Role", class: "text-600" },
  ];

  assetHeader = [
    { field: "loanNumber", headerName: "Loan Number", class: "text-600" },
    {
      field: "goodsDescription",
      headerName: "Goods Description",
      class: "text-600",
    },
    { field: "description", headerName: "Description", class: "text-600" },
  ];

  settlementAmount: string = "Refinancing";
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService
  ) {
    super(route, svc, baseSvc);
  }

  override async ngOnInit() {
    await super.ngOnInit();
    
    this.contractId = this.baseFormData?.contractId
      ? this.baseFormData?.contractId
      : this.baseFormData?.getSettlementAmountData?.standardSettlementResponse
          ?.Data?.contractId;
    this.settlementContractId =
      this.baseFormData?.getSettlementAmountData?.SettlementContractId;
    this.creationMode =
      this.baseFormData?.getSettlementAmountData?.creationMode;
    if (this.settlementContractId != this.contractId) {
      // get FinancialDetail data
      this.contractData = await this.baseSvc.getFormData(
        `Contract/get_contract?ContractId=${this.settlementContractId}`,
        function (res) {
          return res?.data || null;
        }
      );
      if (this.contractData?.contractEtag) {
        this.svc.storage.setItem(
          "contractEtag",
          this.contractData?.contractEtag
        );
      }
    }
    if (this.contractId) {
      this.getCustomerDetails();
      this.getAssetDetails();
    }
    this.standardSettlementAmountData =
      this.baseFormData?.getSettlementAmountData?.standardSettlementResponse?.Data;
    this.refinancingSettlementAmountData =
      this.baseFormData?.getSettlementAmountData?.refinancingSettlementResponse?.Data;
     
  }

  getCustomerDetails() {
    let contractID;
    if (this.settlementContractId != this.contractId) {
      contractID = this.settlementContractId;
    } else {
      contractID = this.contractId;
    }
    this.baseSvc.getFormData(
      `CustomerDetails/get_contractSummery?ContractId=${contractID}`,
      (res) => {
        this.custumerDetails = res?.data;
      }
    );
  }

  getAssetDetails() {
    let physicalAsset;
    let contractID;
    let goodsDescription;
    if (this.settlementContractId != this.contractId) {
      physicalAsset = this.contractData?.financialAssets[0]?.physicalAsset;
      contractID = this.settlementContractId;
      goodsDescription =
        this.contractData?.financialAssets[0]?.physicalAsset.assetTypes
          ?.assetTypeName || "";
    } else if (this.baseFormData?.contractData) {
      physicalAsset =
        this.baseFormData?.contractData?.financialAssets?.[0]?.physicalAsset;
      contractID = this.contractId;
      goodsDescription =
        this.baseFormData?.contractData?.financialAssets?.[0]?.physicalAsset
          ?.assetTypes?.assetTypeName || "";
    } else {
      physicalAsset = this.baseFormData?.financialAssets?.[0]?.physicalAsset;
      contractID = this.contractId;
      goodsDescription =
        this.baseFormData?.financialAssets?.[0]?.physicalAsset?.assetTypes
          ?.assetTypeName || "";
    }

    let description = `${physicalAsset?.year || ""} ${
      physicalAsset?.make || ""
    } ${physicalAsset?.model || ""} ${physicalAsset?.variant || ""} 
                          Reg: ${physicalAsset?.regoNumber || ""} VIN: ${
      physicalAsset?.vin || ""
    }`.trim();

    let assetDetailsResponse = [
      {
        loanNumber: contractID, //this.contractId || "",
        goodsDescription: goodsDescription,
        description: description,
      },
    ];
    this.assetDetails = assetDetailsResponse;
  }

  addAmount(event: any) {
    //this.back();
    this.showDialog();
  }

  back() {
    let terminationQuoteId =
      this.settlementAmount == "Standard"
        ? this.standardSettlementAmountData?.terminationQuoteId
        : this.refinancingSettlementAmountData?.terminationQuoteId;
    let payload = {
      quoteId: this.baseFormData?.contractId || 0,
      settlementQuoteId: this.settlementContractId,
      terminationType: this.settlementAmount,
      standardTerminationQuoteId:
        this.standardSettlementAmountData?.terminationQuoteId,
      refinancingTerminationQuoteId:
        this.refinancingSettlementAmountData?.terminationQuoteId,
      standardTerminationQuoteAmount:
        this.standardSettlementAmountData?.SettlementAmount?.Total,
      refinancingTerminationQuoteAmount:
        this.refinancingSettlementAmountData?.SettlementAmount?.Total,
    };

    this.svc.data
      // .post(
      //   `Settlement/accept_settlementquote?ContractId=${this.contractId}&TerminationQuoteId=${terminationQuoteId}`,
      //   payload
      // )
      .post(`Settlement/AddNewQuoteDetails`, payload)
      .subscribe((res) => {
        this.baseSvc.setBaseDealerFormData({
          settlementType: this.settlementAmount,
          amtPayoutTotal: res?.Data?.amtPayoutTotal || 0,
        });

        const newSettlementContractId = res?.Data?.contractId;
        // if (
        //   this.baseFormData?.getSettlementAmountData?.settlementTypeName ==
        //   "DealerListing"
        // )
        if (!this.baseFormData?.contractId) {
          this.baseSvc.mode = "edit";

          if (this.settlementAmount == "Standard") {
            this.svc.router.navigateByUrl(`/dealer`);
            // return;
            // this.settlementTotalAmount =
            // this.baseFormData?.getSettlementAmountData?.standardSettlementResponse?.Data?.SettlementAmount?.Total;
          } else {
            this.settlementTotalAmount =
              this.baseFormData?.getSettlementAmountData?.refinancingSettlementResponse?.Data?.SettlementAmount?.Total;

            let params = {
              settlementAmount: this.settlementTotalAmount,
              settlementType: this.settlementAmount,
            };

            this.baseSvc.setBaseDealerFormData({
              getSettlementAmountDetails: params,
            });

            this.svc.router.navigateByUrl(
              `/standard-quote/${this.baseSvc.mode}/${newSettlementContractId}`
            );
          }
        } else {
          this.baseSvc.mode = "edit";

          if (this.settlementAmount == "Standard") {
            this.settlementTotalAmount =
              this.baseFormData?.getSettlementAmountData?.standardSettlementResponse?.Data?.SettlementAmount?.Total;
          } else {
            this.settlementTotalAmount =
              this.baseFormData?.getSettlementAmountData?.refinancingSettlementResponse?.Data?.SettlementAmount?.Total;
          }
          let params = {
            settlementAmount: this.settlementTotalAmount,
            settlementType: this.settlementAmount,
          };

          this.baseSvc.setBaseDealerFormData({
            getSettlementAmountDetails: params,
          });

          this.svc.router.navigateByUrl(
            `/standard-quote/${this.baseSvc.mode}/${this.contractId}`
          );
        }
      });
  }

  // cancelsettlement() {
  //   this.baseSvc.mode = "edit";

  //   if (!this.baseFormData?.contractId )
  //   {
  //     this.svc.router.navigateByUrl(`/dealer`);
  //   }
  //   else{
  //     this.svc.router.navigateByUrl(
  //     `/standard-quote/${this.baseSvc.mode}/${this.contractId}`
  //   );

  //   }

  // }

  async cancelsettlement() {
    this.baseSvc.mode = "edit";
    // const contractId = this.baseFormData?.contractId;
    const contractId =
      this.refinancingSettlementAmountData?.contractId ||
      this.standardSettlementAmountData?.contractId;

    const refinancingTermId =
      this.baseFormData?.changedField?.getSettlementAmountData
        ?.refinancingSettlementResponse?.Data?.terminationQuoteId;
    const standardTermId =
      this.baseFormData?.changedField?.getSettlementAmountData
        ?.standardSettlementResponse?.Data?.terminationQuoteId;

    try {
      // Both expire api call parallely
      const requests: Promise<any>[] = [];

      if (standardTermId) {
        const payload = {
          quoteId: contractId,
          terminationQuoteId: standardTermId,
        };
        requests.push(
          firstValueFrom(this.svc.data.post("Settlement/expire_quote", payload))
        );
      }

      if (refinancingTermId) {
        const payload = {
          quoteId: contractId,
          terminationQuoteId: refinancingTermId,
        };
        requests.push(
          firstValueFrom(this.svc.data.post("Settlement/expire_quote", payload))
        );
      }

      if (requests.length > 0) {
        const results = await Promise.allSettled(requests);
      }
    } catch (err) {
      console.error("Expire API error: ", err);
    }

    // After api call navigate back
    if (!contractId) {
      this.svc.router.navigateByUrl(`/dealer`);
    } else {
      this.svc.router.navigateByUrl(
        `/standard-quote/${this.baseSvc.mode}/${this.contractId}`
      );
    }
  }

  radiobuttonclick(event) {
    this.settlementAmount = event;
  }

  override onStatusChange(statusDetails: any): void {}

  showDialog() {
    this.svc.dialogSvc
      .show(SettlementQuotePopupComponent, "Settlement Quote", {
        templates: {
          footer: null,
        },
        width: "30vw",
      })
      .onClose.subscribe((data: CloseDialogData) => {
        if (data.data == "proceed") {
          this.back();
        }
      });
  }
}
