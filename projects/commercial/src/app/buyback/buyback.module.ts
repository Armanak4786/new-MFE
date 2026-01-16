import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuybackRoutingModule } from './buyback-routing.module';
import { AuroUiFrameWork } from 'auro-ui';
import { ReusableComponentModule } from '../reusable-component/reusable-component.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { CommercialModule } from '../commercial.module';
import { BuybackComponent } from './buyback.component';
import { BuybackForcastComponent } from './components/buyback-forcast/buyback-forcast.component';
import { BuybackLeaseComponent } from './components/buyback-lease/buyback-lease.component';
import { BuybackRentalSummaryComponent } from './components/buyback-rental-summary/buyback-rental-summary.component';

@NgModule({
  declarations: [
    BuybackComponent,
    BuybackForcastComponent,
    BuybackLeaseComponent,
    BuybackRentalSummaryComponent,
  ],
  imports: [
    CommonModule,
    BuybackRoutingModule,
    AuroUiFrameWork,
    ReusableComponentModule,
    DashboardModule,
    CommercialModule,
  ],
})
export class BuybackModule {}
