import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonFacilityLoansRoutingModule } from './non-facility-loans-routing.module';
import { AuroUiFrameWork } from 'auro-ui';
import { ReusableComponentModule } from '../reusable-component/reusable-component.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { CommercialModule } from '../commercial.module';
import { NonFacilityLoansComponent } from './non-facility-loans.component';
import { ReducingLoansComponent } from './components/reducing-loans/reducing-loans.component';
import { NonFacilityLoansCurrentAccountComponent } from './components/non-facility-loans-current-account/non-facility-loans-current-account.component';
import { NonFacilityLoanRequestComponent } from './components/non-facility-loan-request/non-facility-loan-request.component';
import { NonFacilityLoanRequestCardComponent } from './components/non-facility-loan-request-card/non-facility-loan-request-card.component';
import { NonFacilityLoanDetailsComponent } from './components/non-facility-loan-details/non-facility-loan-details.component';
import { LoanAfvComponent } from './components/loan-afv/loan-afv.component';
@NgModule({
  declarations: [
    NonFacilityLoansComponent,
    ReducingLoansComponent,
    NonFacilityLoansCurrentAccountComponent,
    NonFacilityLoanRequestComponent,
    NonFacilityLoanRequestCardComponent,
    NonFacilityLoanDetailsComponent,
    LoanAfvComponent,
  ],
  imports: [
    CommonModule,
    NonFacilityLoansRoutingModule,
    AuroUiFrameWork,
    ReusableComponentModule,
    DashboardModule,
    CommercialModule,
  ],
})
export class NonFacilityLoansModule {}
