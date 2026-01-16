import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NonFacilityLoansComponent } from './non-facility-loans.component';
import { LoanDashboardComponent } from '../reusable-component/components/loan-dashboard/loan-dashboard.component';
import { LeaseComponent } from '../reusable-component/components/lease/lease.component';
import { LoanAfvComponent } from './components/loan-afv/loan-afv.component';

const routes: Routes = [
  { path: '', component: NonFacilityLoansComponent },
  {
    path: 'loan/:id',
    component: LoanDashboardComponent,
    // data: { breadcrumb: 'loan' },
    data: {
      breadcrumb: (params) => `Loan Id - ${params['id']}`,
    },
  },
  {
    path: 'lease/:id',
    component: LeaseComponent,
    //data: { breadcrumb: 'lease' },
    data: {
      breadcrumb: (params) => `Lease Id - ${params['id']}`,
    },
  },
  {
    path: 'afv-loan/:id',
    component: LoanAfvComponent,
    //data: { breadcrumb: 'loan' },
    data: {
      breadcrumb: (params) => `Loan Id - ${params['id']}`,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonFacilityLoansRoutingModule {}
