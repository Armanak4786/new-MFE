import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditlinesComponent } from './creditlines.component';
import { CreditLoansComponent } from './components/credit-loans/credit-loans.component';
import { LeaseComponent } from '../reusable-component/components/lease/lease.component';
import { LoanAfvComponent } from '../non-facility-loans/components/loan-afv/loan-afv.component';

const routes: Routes = [
  {
    path: '',
    component: CreditlinesComponent,
  },
  {
    path: 'loan/:id',
    component: CreditLoansComponent,
    //data: { breadcrumb: 'loan' },
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditlinesRoutingModule {}
