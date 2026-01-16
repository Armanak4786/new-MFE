import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperatingLeaseComponent } from './operating-lease.component';
import { OlLeaseDetailsComponent } from './components/ol-lease-details/ol-lease-details.component';

const routes: Routes = [
  { path: '', component: OperatingLeaseComponent },
  {
    path: 'lease/:id',
    component: OlLeaseDetailsComponent,
    data: { breadcrumb: 'lease' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperatingLeaseRoutingModule {}
