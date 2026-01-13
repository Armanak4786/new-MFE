import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TrustComponent } from './trust.component';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: TrustComponent }])],
  exports: [RouterModule],
})
export class TrustRoutingModule {}
