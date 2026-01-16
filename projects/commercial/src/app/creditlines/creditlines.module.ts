import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditlinesRoutingModule } from './creditlines-routing.module';
import { CreditlinesComponent } from './creditlines.component';
import { ChartModule } from 'primeng/chart';
import { AuroUiFrameWork } from 'auro-ui';
import { ReactiveFormsModule } from '@angular/forms';
import { ReusableComponentModule } from '../reusable-component/reusable-component.module';
import { CommercialModule } from '../commercial.module';
import { CreditlineFacilityComponent } from './components/creditline-facility/creditline-facility.component';
import { CreditlineCurrentAccountComponent } from './components/creditline-current-account/creditline-current-account.component';
import { ViewCreditlineComponent } from './components/view-creditline/view-creditline.component';
import { CreditLoansComponent } from './components/credit-loans/credit-loans.component';
import { CreditlineDrawdownRequestComponent } from './components/creditline-drawdown-request/creditline-drawdown-request.component';
import { CreditlineDrawdownRequestCardComponent } from './components/creditline-drawdown-request-card/creditline-drawdown-request-card.component';
import { CreditlineDrawdownRequestDetailsComponent } from './components/creditline-drawdown-request-details/creditline-drawdown-request-details.component';
import { CreditlineDrawdownRequestSubmitConfirmationComponent } from './components/creditline-drawdown-request-submit-confirmation/creditline-drawdown-request-submit-confirmation.component';
import { CreditlineDrawdownRequestSubmitComponent } from './components/creditline-drawdown-request-submit/creditline-drawdown-request-submit.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { RadioButtonModule } from 'primeng/radiobutton';

@NgModule({
  declarations: [
    CreditlinesComponent,
    CreditlineFacilityComponent,
    CreditlineCurrentAccountComponent,
    ViewCreditlineComponent,
    CreditLoansComponent,
    CreditlineDrawdownRequestComponent,
    CreditlineDrawdownRequestCardComponent,
    CreditlineDrawdownRequestDetailsComponent,
    CreditlineDrawdownRequestSubmitConfirmationComponent,
    CreditlineDrawdownRequestSubmitComponent,
  ],
  imports: [
    OverlayPanelModule,
    CommonModule,
    CreditlinesRoutingModule,
    ChartModule,
    AuroUiFrameWork,
    ReactiveFormsModule,
    ReusableComponentModule,
    CommercialModule,
    RadioButtonModule,
  ],
})
export class CreditlinesModule {}
