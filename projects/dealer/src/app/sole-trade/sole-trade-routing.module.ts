import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SoleTradeComponent } from './sole-trade.component';


@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: SoleTradeComponent }]),
  ],
  exports: [RouterModule],
})
export class SoleTradeRoutingModule {}
