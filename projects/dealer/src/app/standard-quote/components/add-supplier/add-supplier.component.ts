import { ChangeDetectorRef, Component, effect } from "@angular/core";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import {
  CloseDialogData,
  CommonService,
  MapFunc,
  Mode,
  ToasterService,
} from "auro-ui";
import { ActivatedRoute, Router } from "@angular/router";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { BusinessService } from "../../../business/services/business";
import { TrustService } from "../../../trust/services/trust.service";
import { ValidationService } from "auro-ui";
import { SoleTradeService } from "../../../sole-trade/services/sole-trade.service";
import { DashboardService } from "../../../dashboard/services/dashboard.service";
import { SearchSupplierComponent } from "../search-supplier/search-supplier.component";
import { addSupplierColumns } from "../../../dashboard/utils/internal-sales-header-utils";
import { IndividualService } from "../../../individual/services/individual.service";

@Component({
  selector: "app-add-supplier",
  templateUrl: "./add-supplier.component.html",
  styleUrl: "./add-supplier.component.scss",
})
export class AddSupplierComponent extends BaseStandardQuoteClass {
  dataList: any;

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public router: Router,
    override baseSvc: StandardQuoteService,
    private businessService: BusinessService,
    private trustSvc: TrustService,
    private toasterService: ToasterService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    private soleService: SoleTradeService,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private indicidualSvc: IndividualService
  ) {
    super(route, svc, baseSvc);
    effect(() => {
      this.dataList = this.baseSvc
        ?.searchResultForSupplier()
        .filter((c) => c.customerRole == 7 || c.roleName == "Third Party")
        .map((c) => ({
          customerName: c?.customerName,
          customerNo: c?.customerNo,
          customerType: c?.customerType,
          roleName: c?.roleName === "PrivateSaleParty" || "Third Party" ? "Third Party" : "",
          currentWorkflowStatus: c?.currentWorkflowStatus,
          delete: this.actions,
          email: c?.email,
          phoneNo: c?.phoneNo,
        }));
        this.cdr.detectChanges()
    });
  }

  partyRoleOptions = [
    { label: "Select", value: "" },
    { label: "Primary Supplier", value: "Primary Supplier" },
    { label: "Secondary Supplier", value: "Secondary Supplier" },
  ];

  actions = [
    {
      action: "delete",
      name: "delete",
      icon: "fa-light fa-trash-can text-lg",
      color: "--red-600",
    },
  ];
  columns = addSupplierColumns;


  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
  }

  showSearchSupplierPopup() {
    this.indicidualSvc.setBaseDealerFormData({
      contractId : this.baseFormData?.contractId
    })
    this.svc.dialogSvc
      .show(SearchSupplierComponent, "", {
        //  data: contractData,
        width: "62vw",
        templates: {
          footer: null,
        },
      })
      .onClose.subscribe((data) => {
        if (data?.data) {
          this.dataList.push({
            customerName: data?.data?.name,
            customerNo: data?.data?.udcNumber,
            customerType: data?.data?.type,
            roleName: data?.data?.role ,
            applyId: false,
            bud: false,
            action: this.actions,
          });
          this.cdr?.detectChanges();
        }
      });
  }

  onCellClick(event: any) {

        this.baseSvc?.customerRowData?.set(event?.rowData);
        
      if (event?.colName == "customerName") {
      if (event?.rowData?.customerType == "Business") {
        this.router.navigateByUrl(
          `/dealer/supplier/edit/${this.baseFormData.contractId}/${event.rowData.customerNo}/business`
        );
      }
      if (event.rowData?.customerType === "Individual") {
        this.router.navigateByUrl(
          `/dealer/supplier/edit/${this.baseFormData.contractId}/${event.rowData.customerNo}/individual`
        );
      }
    }

    if (event?.actionName == "delete") {
      const body = {
        contractId: this.baseFormData?.contractId,
        customerNo: event?.rowData?.customerNo,
        oldRole: 7,
      };

      this.svc?.data
        ?.post("CustomerDetails/remove_customer", body)
        .subscribe((res) => {
          if (res?.data) {
            this.dataList = []
            const index = this.baseFormData?.customerSummary?.findIndex(
              (c) =>
                String(c?.customerNo) === String(event?.rowData?.customerNo)
            );
            if(index != -1){
              this.baseFormData?.customerSummary?.splice(index, 1);
            }
            this.baseSvc.searchResultForSupplier.set([]);
            this.cdr.detectChanges()
          }
        });
    }
  }
}
