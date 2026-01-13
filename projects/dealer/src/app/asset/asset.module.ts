import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuroUiFrameWork } from 'auro-ui';
import { AssetComponent } from './asset.component';
import { AssetRoutingModule } from './asset-routing.module';
import { AssetDetailsComponent } from './components/asset-details/asset-details.component';
import { InsuranceDetailsComponent } from './components/insurance-details/insurance-details.component';

@NgModule({
  declarations: [AssetComponent, AssetDetailsComponent, InsuranceDetailsComponent],
  imports: [CommonModule, AssetRoutingModule, AuroUiFrameWork],
})
export class AssetModule {}
