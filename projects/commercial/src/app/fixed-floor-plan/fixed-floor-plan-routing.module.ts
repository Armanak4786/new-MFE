import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FixedFloorPlanComponent } from './fixed-floor-plan.component';
import { AssetDetailsComponent } from '../reusable-component/components/asset-details/asset-details.component';
import { BailmentSummaryDashboardComponent } from '../reusable-component/components/bailment-summary-dashboard/bailment-summary-dashboard.component';

const routes: Routes = [
  { path: '', component: FixedFloorPlanComponent },
  {
    path: 'asset-details/:id',
    component: AssetDetailsComponent,
    data: { breadcrumb: 'Asset details' },
  },
  {
    path: 'payment-request',
    component: BailmentSummaryDashboardComponent,
    data: { breadcrumb: 'Payment Request' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FixedFloorPlanRoutingModule {}
