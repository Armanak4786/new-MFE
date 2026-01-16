import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetlinkComponent } from './assetlink.component';
import { LoanDashboardComponent } from '../reusable-component/components/loan-dashboard/loan-dashboard.component';
import { RequestSettlementQuoteComponent } from './components/request-settlement-quote/request-settlement-quote.component';
import { ReleaseSecurityRequestComponent } from '../reusable-component/components/release-security/release-security-request/release-security-request.component';

const routes: Routes = [
  {
    path: '',
    component: AssetlinkComponent,
    data: { breadcrumb: '' },
  },
  {
    path: 'loan/:id',
    component: LoanDashboardComponent,
    //data: { breadcrumb: 'Loan' },
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
    data: { breadcrumb: 'Release Security' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetlinkRoutingModule {}
