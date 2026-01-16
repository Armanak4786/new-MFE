import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { AuroUiFrameWork } from 'auro-ui';
import { CommercialModule } from '../commercial.module';
import { ReusableComponentModule } from '../reusable-component/reusable-component.module';
import { DashboardComponent } from './dashboard.component';
import { PaymentAndLoanComponent } from './components/payment-and-loan/payment-and-loan.component';
import { QuickActionsComponent } from './components/quick-actions/quick-actions.component';
import { AssetLinkComponent } from './components/asset-link/asset-link.component';
import { EasyLinkComponent } from './components/easy-link/easy-link.component';
import { OperatingLeaseComponent } from './components/operating-lease/operating-lease.component';
import { CreditLinesComponent } from './components/credit-lines/credit-lines.component';
import { FloatingFloorplanComponent } from './components/floating-floorplan/floating-floorplan.component';
import { FixedFloorplanComponent } from './components/fixed-floorplan/fixed-floorplan.component';
import { BailmentComponent } from './components/bailment/bailment.component';
import { BuybackFacilityComponent } from './components/buyback-facility/buyback-facility.component';
import { NonFacilityComponent } from './components/non-facility/non-facility.component';
import { OriginatorAccountComponent } from './components/originator-account/originator-account.component';
import { FundsComponent } from './components/funds/funds.component';
import { DrawdownRequestSubmitComponent } from './components/drawdown-request/drawdown-request-submit/drawdown-request-submit.component';
import { DrawdownRequstSubmitConfirmationComponent } from './components/drawdown-request/drawdown-requst-submit-confirmation/drawdown-requst-submit-confirmation.component';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { UpdatePartyDetailsComponent } from './components/update-party-details/update-party-details.component';
import { UpdateContactDetailsComponent } from './components/update-contact-details/update-contact-details.component';
import { UpdateAddressDetailsComponent } from './components/update-address-details/update-address-details.component';

@NgModule({
  declarations: [
    DashboardComponent,
    PaymentAndLoanComponent,
    QuickActionsComponent,
    AssetLinkComponent,
    EasyLinkComponent,
    OperatingLeaseComponent,
    FloatingFloorplanComponent,
    FixedFloorplanComponent,
    BailmentComponent,
    CreditLinesComponent,
    BuybackFacilityComponent,
    NonFacilityComponent,
    OriginatorAccountComponent,
    FundsComponent,
    DrawdownRequestSubmitComponent,
    DrawdownRequstSubmitConfirmationComponent,
    UpdatePartyDetailsComponent,
    UpdateContactDetailsComponent,
    UpdateAddressDetailsComponent,
  ],
  imports: [
    DashboardRoutingModule,
    AuroUiFrameWork,
    ReusableComponentModule,
    CommercialModule,
    CommonModule,
    DividerModule,
    CardModule,
    DropdownModule,
    DynamicDialogModule,
    InputTextareaModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    DialogModule,
  ],
})
export class DashboardModule {}
