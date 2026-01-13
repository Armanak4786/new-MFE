import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AssetComponent } from './asset.component';

@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: AssetComponent }]),
  ],
  exports: [RouterModule],
})
export class AssetRoutingModule {}
@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: AssetComponent }]),
  ],
  exports: [RouterModule],
})
export class StandardQuoteRoutingModule {}