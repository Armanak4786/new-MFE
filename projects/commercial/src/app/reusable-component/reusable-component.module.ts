import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuroUiFrameWork } from 'auro-ui';
import { AddAssetComponent } from './components/add-asset/add-asset.component';
import { UploadDocsComponent } from './components/upload-docs/upload-docs.component';
import { AdditionalInfoComponent } from './components/additional-info/additional-info.component';
import { CancelPopupComponent } from './components/cancel-popup/cancel-popup.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { LoansComponent } from './components/loans/loans.component';
import { RequestRepaymentComponent } from './components/request-repayment/request-repayment.component';
import { PaymentSummaryAccountForcastComponent } from './components/payment-summary-account-forcast/payment-summary-account-forcast.component';
import { LoanActionComponent } from './components/loan-action/loan-action.component';
import { LoanPartiesComponent } from './components/loan-parties/loan-parties.component';
import { FacilityAssetsComponent } from './components/facility-assets/facility-assets.component';
import { ReleaseSecurityComponent } from './components/release-security/release-security.component';
import { ReleaseSecurityRequestComponent } from './components/release-security/release-security-request/release-security-request.component';
import { ReleaseSecurityConfirmationComponent } from './components/release-security/release-security-confirmation/release-security-confirmation.component';
import { AssociatedAssetsComponent } from './components/associated-assets/associated-assets.component';
import { GenerateCustomerStatementComponent } from './components/generate-customer-statement/generate-customer-statement.component';
import { PiScheduleComponent } from './components/pi-schedule/pi-schedule.component';
import { PaymentSummaryComponent } from './components/payment-summary/payment-summary.component';
import { LoanDashboardComponent } from './components/loan-dashboard/loan-dashboard.component';
import { TransactionFlowComponent } from './components/transaction-flow/transaction-flow.component';
import { InterestPaymentForcastComponent } from './components/interest-payment-forcast/interest-payment-forcast.component';
import { TransactionPayDetailsComponent } from './components/transaction-pay-details/transaction-pay-details.component';
import { PaymentForcastComponent } from './components/payment-forcast/payment-forcast.component';
import { PaymentDetailsComponent } from './components/payment-details/payment-details.component';
import { DrawdownRequestAdditionalInfoComponent } from './components/drawdown-request-additional-info/drawdown-request-additional-info.component';
import { TabViewModule } from 'primeng/tabview';
import { LeaseComponent } from './components/lease/lease.component';
import { LeaseSummaryComponent } from './components/lease-summary/lease-summary.component';
import { LeaseScheduleComponent } from './components/lease-schedule/lease-schedule.component';
import { ReleaseSecurityAcknowledgementComponent } from './components/release-security-acknowledgement/release-security-acknowledgement.component';
import { DrawdownRequestComponent } from './components/drawdown-request/drawdown-request.component';
import { DrawdownDetailsComponent } from './components/drawdown-details/drawdown-details.component';
import { DrawdownRequestCardComponent } from './components/drawdown-request-card/drawdown-request-card.component';
import { DrawdownRequestSubmitComponent } from './components/drawdown-request-submit/drawdown-request-submit.component';
import { DrawdownRequestSubmitConfirmationComponent } from './components/drawdown-request-submit-confirmation/drawdown-request-submit-confirmation.component';
import { BailmentSummaryDashboardComponent } from './components/bailment-summary-dashboard/bailment-summary-dashboard.component';
import { ViewRequestComponent } from './components/view-request/view-request.component';
import { FacilitySummaryComponent } from './components/facility-summary/facility-summary.component';
import { NotesComponent } from './notes/notes.component';
import { ViewRequestDescriptionComponent } from './components/view-request-description/view-request-description.component';
import { RequestHistoryComponent } from './components/request-history/request-history.component';
import { StatusNoteComponent } from './components/status-note/status-note.component';
import { WarningPopupComponent } from './components/warning-popup/warning-popup.component';
import { AcknowledgmentPopupComponent } from './components/acknowledgment-popup/acknowledgment-popup.component';
import { WholesaleRequestHistoryComponent } from './components/wholesale-request-history/wholesale-request-history.component';
import { WholesaleViewRequestComponent } from './components/wholesale-view-request/wholesale-view-request.component';
import { SameDayPayoutViewRequestComponent } from './components/same-day-payout-view-request/same-day-payout-view-request.component';
import { PurchasePaymentViewRequestComponent } from './components/purchase-payment-view-request/purchase-payment-view-request.component';
import { SwapAssetTransferComponent } from './components/swap-asset-transfer/swap-asset-transfer.component';
import { WsRequestHistoryActionsComponent } from './components/ws-request-history-actions/ws-request-history-actions.component';
import { SwapViewRequestComponent } from './components/swap-view-request/swap-view-request.component';
import { SwapAssetTransferDescriptionComponent } from './components/swap-asset-transfer-description/swap-asset-transfer-description.component';
import { WRepaymentViewRequestComponent } from './components/w-repayment-view-request/w-repayment-view-request.component';
import { WDrawdownViewRequestComponent } from './components/w-drawdown-view-request/w-drawdown-view-request.component';
import { PartyDetailsAcknowledgementComponent } from './components/party-details-acknowledgement/party-details-acknowledgement.component';
import { AddressNotFoundPopupComponent } from './components/address-not-found-popup/address-not-found-popup.component';
import { NotificationComponent } from './components/notification/notification.component';

@NgModule({
  declarations: [
    AddAssetComponent,
    UploadDocsComponent,
    AdditionalInfoComponent,
    CancelPopupComponent,
    DocumentsComponent,
    RequestRepaymentComponent,
    LoansComponent,
    PaymentSummaryAccountForcastComponent,
    LoanActionComponent,
    LoanPartiesComponent,
    LoanDashboardComponent,
    FacilityAssetsComponent,
    AssociatedAssetsComponent,
    ReleaseSecurityComponent,
    ReleaseSecurityRequestComponent,
    ReleaseSecurityConfirmationComponent,
    PiScheduleComponent,
    PaymentSummaryComponent,
    TransactionFlowComponent,
    PaymentForcastComponent,
    TransactionPayDetailsComponent,
    InterestPaymentForcastComponent,
    PaymentDetailsComponent,
    GenerateCustomerStatementComponent,
    DrawdownRequestAdditionalInfoComponent,
    LeaseComponent,
    LeaseSummaryComponent,
    LeaseScheduleComponent,
    ReleaseSecurityAcknowledgementComponent,
    DrawdownRequestComponent,
    DrawdownDetailsComponent,
    DrawdownRequestCardComponent,
    DrawdownRequestSubmitComponent,
    DrawdownRequestSubmitConfirmationComponent,
    BailmentSummaryDashboardComponent,
    ViewRequestComponent,
    FacilitySummaryComponent,
    NotesComponent,
    ViewRequestDescriptionComponent,
    RequestHistoryComponent,
    StatusNoteComponent,
    WarningPopupComponent,
    AcknowledgmentPopupComponent,
    WholesaleRequestHistoryComponent,
    WholesaleViewRequestComponent,
    SameDayPayoutViewRequestComponent,
    PurchasePaymentViewRequestComponent,
    SwapAssetTransferComponent,
    WsRequestHistoryActionsComponent,
    SwapViewRequestComponent,
    SwapAssetTransferDescriptionComponent,
    WRepaymentViewRequestComponent,
    WDrawdownViewRequestComponent,
    PartyDetailsAcknowledgementComponent,
    AddressNotFoundPopupComponent,
    NotificationComponent,
  ],
  imports: [CommonModule, AuroUiFrameWork, TabViewModule],
  exports: [
    AddAssetComponent,
    UploadDocsComponent, // Export the component here
    AdditionalInfoComponent,
    CancelPopupComponent,
    DocumentsComponent,
    RequestRepaymentComponent,
    LoanDashboardComponent,
    PaymentSummaryAccountForcastComponent,
    LoansComponent,
    LoanActionComponent,
    LoanPartiesComponent,
    FacilityAssetsComponent,
    AssociatedAssetsComponent,
    ReleaseSecurityComponent,
    ReleaseSecurityRequestComponent,
    ReleaseSecurityConfirmationComponent,
    GenerateCustomerStatementComponent,
    PiScheduleComponent,
    PaymentSummaryComponent,
    TransactionFlowComponent,
    InterestPaymentForcastComponent,
    TransactionPayDetailsComponent,
    PaymentForcastComponent,
    PaymentDetailsComponent,
    DrawdownRequestAdditionalInfoComponent,
    LeaseComponent,
    LeaseSummaryComponent,
    LeaseScheduleComponent,
    ViewRequestComponent,
    FacilitySummaryComponent,
    NotesComponent,
    ViewRequestDescriptionComponent,
    RequestHistoryComponent,
    WarningPopupComponent,
    AcknowledgmentPopupComponent,
    WholesaleRequestHistoryComponent,
    WholesaleViewRequestComponent,
    SameDayPayoutViewRequestComponent,
    PurchasePaymentViewRequestComponent,
    SwapAssetTransferComponent,
    WsRequestHistoryActionsComponent,
    SwapViewRequestComponent,
    SwapAssetTransferDescriptionComponent,
    WRepaymentViewRequestComponent,
    WDrawdownViewRequestComponent,
    NotificationComponent
  ],
})
export class ReusableComponentModule {}
