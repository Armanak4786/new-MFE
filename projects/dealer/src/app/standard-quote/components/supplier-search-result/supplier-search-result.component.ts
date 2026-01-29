import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, Mode } from "auro-ui";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { ToasterService } from "auro-ui";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { IndividualService } from "../../../individual/services/individual.service";
import { BusinessService } from "../../../business/services/business";
import { takeUntil } from "rxjs";


@Component({
  selector: "app-supplier-search-result",
  templateUrl: "./supplier-search-result.component.html",
  styleUrls: ["./supplier-search-result.component.scss"],
})
export class SupplierSearchResultComponent extends BaseStandardQuoteClass {

  searchType: string = "business";
  expandedSuppliers: boolean[] = [];
  suppliers: any[] = [];

  supplierColumns = [
    { field: "supplierName", headerName: "Supplier Name" },
    { field: "supplierNo", headerName: "UDC Number" },
    { field: "supplierType", headerName: "Type" },
    { field: "partyRole", headerName: "Role" }
  ];

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    public toasterSvc: ToasterService,
    public cdr: ChangeDetectorRef,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public individualSvc: IndividualService, 
    public businessSvc: BusinessService

  ) {
    super(route, svc, baseSvc);
  }

  override async ngOnInit(): Promise<void> {
  await super.ngOnInit();

  this.searchType = this.config?.data?.supplierType || "business";

  this.suppliers = this.config?.data?.suppliers || [];

  this.expandedSuppliers =
    this.suppliers.map(() => false);
}
 addSupplier(supplier: any) {
  const supplierNo = supplier?.supplierNo;

  const customerExists = this.baseFormData?.customerSummary?.some(
    c => (String(c?.customerNo) === String(supplierNo))
  );


  const supplierExists = this.baseSvc
        ?.searchResultForSupplier()?.some(
          c =>  c?.customerRole == 7 
        );

  if (customerExists) {
    const existing = this.baseFormData.customerSummary.find(
      c => String(c?.customerNo) === String(supplierNo)
    );

    this.toasterSvc.showToaster({
      severity: "error",
      summary: "Supplier Already Exists",
      detail: `Supplier ${existing?.customerName || supplierNo} already exists.`,
    });
    return;
  }
  else if (supplierExists) {
    this.toasterSvc.showToaster({
      severity: "error",
      summary: "Supplier Already Added",
      detail: `A supplier has already been added. Only one supplier is allowed per quote.`,
    });
    return;
  }
  
  const isBusiness =
  supplier?.supplierType === "Business" ||
  supplier?.raw?.businessDetails;
  

  
  const route = isBusiness
  ? `/dealer/supplier/edit/${this.baseFormData.contractId}/${supplierNo}/business`
  : `/dealer/supplier/edit/${this.baseFormData.contractId}/${supplierNo}/individual`;
  
  this.ref.close();
  this.svc.router.navigateByUrl(route);
}


  newSupplier() {

    const supplierExists = this.baseSvc
        ?.searchResultForSupplier()?.some(
          c =>  c?.customerRole == 7 
        );

    if (supplierExists) {
    this.toasterSvc.showToaster({
      severity: "error",
      summary: "Supplier Already Added",
      detail: `A supplier has already been added. Only one supplier is allowed per quote.`,
    });
    return;
  }
  const route =
    this.searchType === "individual"
      ? "/dealer/supplier/add-supplier-individual"
      : "/dealer/supplier/add-supplier-business";

  this.ref.close()
  this.svc.router.navigateByUrl(route);

}

  redirectToSearch() {
    if (this.ref) this.ref.close();

    this.baseSvc.activeStep = 1;
    this.svc.router.navigateByUrl("/standard-quote");
  }

  onClose(){
    this.ref.close()
  }
}
