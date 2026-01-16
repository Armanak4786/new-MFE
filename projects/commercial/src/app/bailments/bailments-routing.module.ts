import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BailmentsComponent } from './bailments.component';
import { ProductTransferDisclaimerComponent } from './components/product-transfer-disclaimer/product-transfer-disclaimer.component';
import { AssetDetailsComponent } from '../reusable-component/components/asset-details/asset-details.component';
import { BailmentSummaryDashboardComponent } from '../reusable-component/components/bailment-summary-dashboard/bailment-summary-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: BailmentsComponent,
    data: { breadcrumb: 'Bailments' },
  },
  {
    path: 'productTransferDisclaimer',
    component: ProductTransferDisclaimerComponent,
    data: { breadcrumb: 'Product Transfer' },
  },
  {
    path: 'asset-details/:id',
    component: AssetDetailsComponent,
    data: { breadcrumb: 'Asset details' },
  },
  {
    path: 'purchase-asset-request',
    component: BailmentSummaryDashboardComponent,
    data: { breadcrumb: 'Purchase Asset' },
  },
  {
    path: 'swaps',
    component: BailmentSummaryDashboardComponent,
    data: { breadcrumb: 'Swaps' },
  },
  {
    path: 'same-day-payout',
    component: BailmentSummaryDashboardComponent,
    data: { breadcrumb: 'Same Day Payout' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BailmentsRoutingModule {}
