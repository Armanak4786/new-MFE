import { Component, OnInit } from "@angular/core";
import { CommonService, CurrencyService, StorageService } from "auro-ui";
import { StandardQuoteService } from "../standard-quote/services/standard-quote.service";
import { QuickQuoteService } from "../quick-quote/services/quick-quote.service";
import { IndividualService } from "../individual/services/individual.service";
import { BusinessService } from "../business/services/business";
import { TrustService } from "../trust/services/trust.service";
import { activatedLoansColumnList, afvLoansColumnList, expiredQuoteColumnList, internalQuoteColumnList } from "./utils/internal-sales-header-utils";
import { DashboardService } from "./services/dashboard.service";
import { SoleTradeService } from "../sole-trade/services/sole-trade.service";
import { BaseStandardQuoteClass } from "../standard-quote/base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent extends BaseStandardQuoteClass implements OnInit {
  
  showCommonDashboard:boolean=false;
  internalQuoteColumnList = internalQuoteColumnList
  expiredQuoteColumnList = expiredQuoteColumnList
  afvLoansColumnList = afvLoansColumnList
  activatedLoansColumnList = activatedLoansColumnList

  userRole: any = {}; 
  constructor(
    private standardQuoteSvc: StandardQuoteService,
    private quickquoteService: QuickQuoteService,
    private indvidualSvc: IndividualService,
    private businessSvc: BusinessService,
    private trustSvc: TrustService,
    private dashboardSvc:DashboardService,
    private soleTradeSvc: SoleTradeService,
    private storageSvc: StorageService,
     public override route: ActivatedRoute, 
    public override svc: CommonService, 
    override baseSvc: StandardQuoteService,
  ) {
    super(route, svc, baseSvc);
    // Todo for reset for other service too
    // this.currencyService.initializeCurrency();
    this.standardQuoteSvc.resetBaseDealerFormData();
    this.standardQuoteSvc.onLoanPurposeChange.next(null);
    this.quickquoteService.quickQuoteData = [];
    this.indvidualSvc.resetBaseDealerFormData();
    this.indvidualSvc.role = 0;
    this.businessSvc.resetBaseDealerFormData();
    this.businessSvc.role = 0;
    this.trustSvc.resetBaseDealerFormData();
    this.trustSvc.role = 0;
    this.standardQuoteSvc.showResult = false;
    standardQuoteSvc.appStatus.next(null) //empty the application workflow 

     this.baseSvc.formDataCacheableRoute([
      "WorkFlows/get_config_matrix_datset?MatrixName=DO Portal Workflow Steps",
    ]);

    this.baseSvc.getFormData(
      `WorkFlows/get_config_matrix_datset?MatrixName=DO Portal Workflow Steps`
    );
  }

  override async ngOnInit():  Promise<void> {
    await super.ngOnInit();
    this.userRole = JSON.parse(sessionStorage.getItem("user_role") || "{}");
  //  console.log('monthly_volumes exists?', this.userRole?.functions?.includes('workflow_status'));
  
    // this.accessGranted = userRole.functions || {};
    
    this.standardQuoteSvc.resetBaseDealerFormData();
    this.quickquoteService.quickQuoteData = [];
    this.indvidualSvc.resetBaseDealerFormData();
    this.indvidualSvc.role = 0;
    this.indvidualSvc.showValidationMessage = false;
    this.businessSvc.resetBaseDealerFormData();
    this.businessSvc.role = 0;
    this.businessSvc.showValidationMessage = false;
    this.trustSvc.resetBaseDealerFormData();
    this.trustSvc.role = 0;
    this.trustSvc.showValidationMessage = false;
    // sessionStorage.removeItem('dealerPartyNumber');
    this.soleTradeSvc.showValidationMessage = false;
    this.standardQuoteSvc.defautltUDCEstablishmentFee = {};
    this.standardQuoteSvc.dealerOriginationFeeopenOnEdit = false;
    this.standardQuoteSvc.isAssetTrade = false;
    this.standardQuoteSvc.updatedCustomerSummary.clear()  //Mapper is cleared when returned to dashboard
    this.storageSvc.removeItem("contractEtag");
    this.storageSvc.removeItem("updatedCustomerSummary");
    this.standardQuoteSvc.activeStep = 0;

    this.showCommonDashboard = sessionStorage?.getItem("externalUserType") === "Internal" ? false : true;

  }
}
