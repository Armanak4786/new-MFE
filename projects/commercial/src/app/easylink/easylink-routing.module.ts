import { NgModule } from '@angular/core';
import { EasylinkComponent } from './easylink.component';
import { RouterModule, Routes } from '@angular/router';
import { LoanDashboardComponent } from '../reusable-component/components/loan-dashboard/loan-dashboard.component';
import { RequestSettlementQuoteComponent } from '../assetlink/components/request-settlement-quote/request-settlement-quote.component';
import { ReleaseSecurityRequestComponent } from '../reusable-component/components/release-security/release-security-request/release-security-request.component';

const routes: Routes = [
  { path: '', component: EasylinkComponent },
  {
    path: 'loan/:id',
    component: LoanDashboardComponent,
    data: {
      breadcrumb: (params) => `Loan Id - ${params['id']}`,
    },
  },
  {
    path: 'requestQuote',
    component: RequestSettlementQuoteComponent,
    data: { breadcrumb: 'Request Settlement Quote' },
  },
  {
    path: 'releaseSecurityRequest',
    component: ReleaseSecurityRequestComponent,
    data: { breadcrumb: 'Release Request' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EasylinkRoutingModule {}
