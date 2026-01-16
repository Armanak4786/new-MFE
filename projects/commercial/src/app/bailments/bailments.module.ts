import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BailmentsRoutingModule } from './bailments-routing.module';
import { BailmentsComponent } from './bailments.component';
import { ChartModule } from 'primeng/chart';
import { AuroUiFrameWork } from 'auro-ui';
import { CommercialModule } from '../commercial.module';
import { ReusableComponentModule } from '../reusable-component/reusable-component.module';
import { BailmentDashboardComponent } from './components/bailment-dashboard/bailment-dashboard.component';
import { BailmentCurrentAccountComponent } from './components/bailment-current-account/bailment-current-account.component';
import { ProductTransferDisclaimerComponent } from './components/product-transfer-disclaimer/product-transfer-disclaimer.component';
import { TransferRequestSubmissionComponent } from './components/transfer-request-submission/transfer-request-submission.component';

import { ProductTransferRequestComponent } from './components/product-transfer-request/product-transfer-request.component';
import { productTransferfacilityassetsactions } from './components/product-transfer-request/product-transfer-request-actions';
import { BailmentCurtailmentDetailsComponent } from './components/bailment-curtailment-details/bailment-curtailment-details.component';
import { BailmentTransactionHistoryComponent } from './components/bailment-transaction-history/bailment-transaction-history.component';
import { AssetDetailsComponent } from '../reusable-component/components/asset-details/asset-details.component';
import { PurchaseAssetRequestComponent } from './components/purchase-asset-request/purchase-asset-request.component';
import { SameDayPayoutComponent } from './components/same-day-payout/same-day-payout.component';
import { SwapRequestComponent } from './components/swap-request/swap-request.component';
import { BailmentNotesComponent } from './components/bailment-notes/bailment-notes.component';
import { BailmentAssetConfirmationComponent } from './components/bailment-asset-confirmation/bailment-asset-confirmation.component';
import { BailmentAssetActionComponent } from './components/bailment-asset-action/bailment-asset-action.component';

@NgModule({
  declarations: [
    BailmentsComponent,
    BailmentDashboardComponent,
    BailmentCurrentAccountComponent,
    ProductTransferRequestComponent,
    ProductTransferDisclaimerComponent,
    TransferRequestSubmissionComponent,
    BailmentAssetConfirmationComponent,
    productTransferfacilityassetsactions,
    AssetDetailsComponent,
    BailmentCurtailmentDetailsComponent,
    BailmentTransactionHistoryComponent,
    AssetDetailsComponent,
    PurchaseAssetRequestComponent,
    SameDayPayoutComponent,
    SwapRequestComponent,
    BailmentNotesComponent,
    SwapRequestComponent,
    BailmentAssetActionComponent,
  ],
  imports: [
    CommonModule,
    ChartModule,
    BailmentsRoutingModule,
    AuroUiFrameWork,
    ReusableComponentModule,
    CommercialModule,
  ],
  providers: [],
})
export class BailmentsModule {}
