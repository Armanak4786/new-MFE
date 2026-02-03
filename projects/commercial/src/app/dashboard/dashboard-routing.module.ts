import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { RequestHistoryComponent } from '../reusable-component/components/request-history/request-history.component';
import { LoanDashboardComponent } from '../reusable-component/components/loan-dashboard/loan-dashboard.component';
import { DocumentsComponent } from '../reusable-component/components/documents/documents.component';
import { UpdatePartyDetailsComponent } from './components/update-party-details/update-party-details.component';
import { UpdateContactDetailsComponent } from './components/update-contact-details/update-contact-details.component';
import { UpdateAddressDetailsComponent } from './components/update-address-details/update-address-details.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, data: { breadcrumb: '' } },
 
  {
    path: 'update-party-details',
    component: UpdatePartyDetailsComponent,
    data: { breadcrumb: 'Update Party Details' },
  },

  {
    path: 'update-contact-details',
    component: UpdateContactDetailsComponent,
    data: { breadcrumb: 'Update Contact Details' },
  },
  {
    path: 'update-address-details',
    component: UpdateAddressDetailsComponent,
    data: { breadcrumb: 'Update Address Details' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
