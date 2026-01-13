import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuroUiFrameWork } from 'auro-ui';
import { StandardQuoteComponent } from './standard-quote.component';
import { StandardQuoteRoutingModule } from './standard-quote-routing.module';
import { AssetSearchResultComponent } from './components/asset-search-result/asset-search-result.component';
import { AddOnAccessoriesComponent } from './components/add-on-accessories/add-on-accessories.component';
import { AdditionalApprovalComponent } from './components/additional-approval/additional-approval.component';
import { AfvDetailsComponent } from './components/afv-details/afv-details.component';
import { AssetInsuranceSummaryComponent } from './components/asset-insurance-summary/asset-insurance-summary.component';
import { AssetSummaryComponent } from './components/asset-summary/asset-summary.component';
import { BorrowerSearchResultComponent } from './components/borrower-search-result/borrower-search-result.component';
import { BorrowersGuarantorsComponent } from './components/borrowers-guarantors/borrowers-guarantors.component';
import { DealerUdcDeclarationComponent } from './components/dealer-udc-declaration/dealer-udc-declaration.component';
import { KeyInfoPopupComponent } from './components/key-info-popup/key-info-popup.component';
import { LessDepositComponent } from './components/less-deposit/less-deposit.component';
import { EditNotesComponent } from './components/notes/edit-notes.component';
import { NotesComponent } from './components/notes/notes.component';
import { ReadNotesComponent } from './components/notes/read-notes.component';
import { OtherChargesComponent } from './components/other-charges/other-charges.component';
import { PaymentScheduleComponent } from './components/payment-schedule/payment-schedule.component';
import { PaymentSummaryDeatilsComponent } from './components/payment-summary-deatils/payment-summary-deatils.component';
import { KeyInfoButtonComponent } from './components/payment-summary/key-info-button/key-info-button.component';
import { PaymentSummaryResultComponent } from './components/payment-summary/payment-summary-result/payment-summary-result.component';
import { PaymentSummaryComponent } from './components/payment-summary/payment-summary.component';
import { QuoteOriginatorComponent } from './components/quote-originator/quote-originator.component';
import { DealerInventoryTabComponent } from './components/search-asset/dealer-inventory-tab.component';
import { MotocheckTabComponent } from './components/search-asset/motocheck-tab/motocheck-tab.component';
import { MotocheckTabComponent as MotocheckTabAltComponent } from './components/search-asset/motocheck-tab.component';
import { SearchAssetComponent } from './components/search-asset/search-asset.component';
import { SearchCustomerComponent } from './components/search-customer/search-customer.component';
import { BusinessTabComponent } from './components/search-customer/searchTabs/business-tab.component';
import { IndividualTabComponent } from './components/search-customer/searchTabs/individual-tab.component';
import { TrustTabComponent } from './components/search-customer/searchTabs/trust-tab.component';
import { SelectBrandsComponent } from './components/select-brands/select-brands.component';
import { SettlementDisclosureComponent } from './components/settlement-disclosure/settlement-disclosure.component';
import { SettlementPopupComponent } from './components/settlement-popup/settlement-popup.component';
import { SettlementQuoteDetailsComponent } from './components/settlement-quote-details/settlement-quote-details.component';
import { StandardPaymentOptionsComponent } from './components/standard-payment-options/standard-payment-options.component';
import { UploadDocumentComponent } from './components/upload-document/upload-document.component';
import { DealerFinanceComponent } from './components/dealer-finance/dealer-finance.component';
import { EditPaymentScheduleTableComponent } from './components/payment-schedule/edit-payment-schedule-table/edit-payment-schedule-table.component';
import { EditPaymentScheduleComponent } from './components/payment-schedule/edit-payment-schedule/edit-payment-schedule.component';
import { FinanceLeaseComponent } from './components/finance-lease/finance-lease.component';
import { RentalScheduleComponent } from './components/rental-schedule/rental-schedule.component';
import { AccessoriesComponent } from './components/add-on-accessories/component/accessories/accessories.component';
import { ServicePlanComponent } from './components/add-on-accessories/component/service-plan/service-plan.component';
import { InsuranceRequirementComponent } from './components/add-on-accessories/component/insurance-requirement/insurance-requirement.component';
import { InsuranceRequirementComponent as InsuranceRequirementAltComponent } from './components/insurance-requirement/insurance-requirement.component';
import { ExcessAllowanceComponent } from './components/excess-allowance/excess-allowance.component';
import { AddNotesComponent } from './components/notes/add-notes.component';
import { AdditionalFundsComponent } from './components/additional-funds/additional-funds.component';
import { QuoteDetailsComponent } from './components/Quote-details/quote-details.component';
import { InsuranceDisclosureComponent } from './components/insurance-disclosure-popup/insurance-disclosure.component';
import { InsuranceFinalPopupComponent } from './components/insurance-final-popup/insurance-final-popup.component';
import { FinalConfirmationComponent } from './components/final-confirmation/final-confirmation.component';
import { OriginatorReferenceComponent } from './components/originator-reference/originator-reference.component';
import { DealerDisbursmentDetailsComponent } from './components/dealer-disbursment-details/dealer-disbursment-details.component';
import { DocumentTabViewComponent } from './components/document-tabview/document-tabview.component';
import { GenerateDocumentComponent } from './components/generate-document/generate-document.component';
import { SettlementQuotePopupComponent } from './components/settlement-quote-popup/settlement-quote-popup.component';
import { SignatoriesComponent } from './components/signatories/signatories.component';
import { AddExistingContactSignatoriesComponent } from './components/add-existing-contact-signatories/add-existing-contact-signatories.component';
import { IndividualModule } from '../individual/individual.module';
import { MaintenanceRequirementComponent } from './components/add-on-accessories/component/maintenance-requirement/maintenance-requirement.component';
import { ChargesAddOtherItemsComponent } from './components/add-on-accessories/component/charges-add-other-items/charges-add-other-items.component';
import { CreditConditionComponent } from './components/credit-condition/credit-condition.component';
import { PartyVerificationComponent } from './components/party-verification/party-verification.component';
import { AddSupplierComponent } from './components/add-supplier/add-supplier.component';
import { BankStatementVerificationComponent } from './components/bank-statement-verification/bank-statement-verification.component';
import { BankStatementVerificationOptionComponent } from './components/bank-statement-verification-option/bank-statement-verification-option.component';
import { SearchSupplierComponent } from './components/search-supplier/search-supplier.component';
import { SupplierIndividualTabComponent } from './components/search-supplier/searchTabs/supplier-individual-tab.component';
import { SupplierBusinessTabComponent } from './components/search-supplier/searchTabs/supplier-business-tab.component';
import { SupplierSearchResultComponent } from './components/supplier-search-result/supplier-search-result.component';
import { DocumentHistoryComponent } from './components/document-history/document-history.component';
import { DocumentEsignDetailsComponent } from './components/document-esign-details/document-esign-details.component';
import { ContractSummeryTabsComponent } from './components/contract-summery-tabs/contract-summery-tabs.component';

@NgModule({
  declarations: [
    GenerateDocumentComponent,
    DocumentTabViewComponent,
    StandardQuoteComponent,
    QuoteOriginatorComponent,
    AddOnAccessoriesComponent,
    ServicePlanComponent,
    AccessoriesComponent,
    InsuranceRequirementComponent,
    QuoteDetailsComponent,
    PaymentSummaryComponent,
    KeyInfoPopupComponent,
    LessDepositComponent,
    StandardPaymentOptionsComponent,
    AssetInsuranceSummaryComponent,
    SearchAssetComponent,
    DealerDisbursmentDetailsComponent,
    PaymentScheduleComponent,
    EditPaymentScheduleComponent,
    DealerUdcDeclarationComponent,
    NotesComponent,
    OtherChargesComponent,
    BorrowersGuarantorsComponent,
    SearchCustomerComponent,
    IndividualTabComponent,
    BusinessTabComponent,
    TrustTabComponent,
    PaymentSummaryResultComponent,
    KeyInfoButtonComponent,
    ReadNotesComponent,
    EditNotesComponent,
    MotocheckTabComponent,
    DealerInventoryTabComponent,
    AdditionalApprovalComponent,
    SettlementPopupComponent,
    SettlementQuotePopupComponent,
    SettlementDisclosureComponent,
    SelectBrandsComponent,
    UploadDocumentComponent,
    BorrowerSearchResultComponent,
    AfvDetailsComponent,
    SettlementQuoteDetailsComponent,
    PaymentSummaryDeatilsComponent,
    AssetSearchResultComponent,
    DealerFinanceComponent,
    EditPaymentScheduleTableComponent,
    FinanceLeaseComponent,
    RentalScheduleComponent,
    ExcessAllowanceComponent,
    AddNotesComponent,
    AdditionalFundsComponent,
    AssetSummaryComponent,
    InsuranceDisclosureComponent,
    InsuranceFinalPopupComponent,
    FinalConfirmationComponent,
    OriginatorReferenceComponent,
    SignatoriesComponent,
    AddExistingContactSignatoriesComponent,
    MaintenanceRequirementComponent,
    ChargesAddOtherItemsComponent,
    CreditConditionComponent,
    PartyVerificationComponent,
    AddSupplierComponent,
    BankStatementVerificationComponent,
    BankStatementVerificationOptionComponent,
    SearchSupplierComponent,
    SupplierIndividualTabComponent,
    SupplierBusinessTabComponent,
    SupplierSearchResultComponent,
    DocumentHistoryComponent,
    DocumentEsignDetailsComponent,
    ContractSummeryTabsComponent,
    MotocheckTabAltComponent,
    InsuranceRequirementAltComponent
  ],
  imports: [CommonModule, StandardQuoteRoutingModule, AuroUiFrameWork, IndividualModule],
  exports: [
    QuoteOriginatorComponent,
    AssetSummaryComponent,
    BorrowersGuarantorsComponent,
    PaymentScheduleComponent,
    AddExistingContactSignatoriesComponent
  ],
})
export class StandardQuoteModule { }
