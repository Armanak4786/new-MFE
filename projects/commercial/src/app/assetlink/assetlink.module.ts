import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetlinkRoutingModule } from './assetlink-routing.module';
import { AssetlinkComponent } from './assetlink.component';
import { ChartModule } from 'primeng/chart';
import { AuroUiFrameWork } from 'auro-ui';
import { CurrentAccountComponent } from './components/current-account/current-account.component';
import { StatusComponent } from './components/status/status.component';
import { RequestSettlementQuoteComponent } from './components/request-settlement-quote/request-settlement-quote.component';
import { RequestAcknowledgmentComponent } from './components/request-acknowledgment/request-acknowledgment.component';
import { DocumentViewComponent } from './components/document-view/document-view.component';
import { AssetLinkSubfacilityComponent } from './components/asset-link-subfacility/asset-link-subfacility.component';
import { ViewAssetlinkFacilityComponent } from './components/view-assetlink-facility/view-assetlink-facility.component';
import { FacilityAssetsActionsComponent } from '../reusable-component/components/facility-assets/facility-assets-actions.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ReusableComponentModule } from '../reusable-component/reusable-component.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { CommercialModule } from '../commercial.module';
import { DrawdownRequestComponent } from './components/drawdown-request/drawdown-request.component';
import { DrawdownDetailsComponent } from './components/drawdown-details/drawdown-details.component';
import { DrawdownRequestCardComponent } from './components/drawdown-request-card/drawdown-request-card.component';
import { DrawdownRequestSubmitConfirmationComponent } from './components/drawdown-request-submit-confirmation/drawdown-request-submit-confirmation.component';
import { DrawdownRequestSubmitComponent } from './components/drawdown-request-submit/drawdown-request-submit.component';

@NgModule({
  declarations: [
    AssetlinkComponent,
    CurrentAccountComponent,
    StatusComponent,
    RequestSettlementQuoteComponent,
    RequestAcknowledgmentComponent,
    DocumentViewComponent,
    StatusComponent,
    AssetLinkSubfacilityComponent,
    ViewAssetlinkFacilityComponent,
    FacilityAssetsActionsComponent,
    DrawdownRequestComponent,
    DrawdownDetailsComponent,
    DrawdownRequestCardComponent,
    DrawdownRequestSubmitConfirmationComponent,
    DrawdownRequestSubmitComponent,
  ],
  imports: [
    CommonModule,
    AssetlinkRoutingModule,
    ChartModule,
    AuroUiFrameWork,
    ReactiveFormsModule,
    ReusableComponentModule,
    DashboardModule,
    CommercialModule,
  ],
})
export class AssetlinkModule {}
