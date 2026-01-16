import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuybackComponent } from './buyback.component';
import { BuybackLeaseComponent } from './components/buyback-lease/buyback-lease.component';

const routes: Routes = [
  { path: '', component: BuybackComponent, data: { breadcrumb: 'Buyback' } },
  {
    path: 'lease/:id',
    component: BuybackLeaseComponent,
    data: { breadcrumb: 'lease' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuybackRoutingModule {}
