import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnershipRoutingModule } from './partnership-routing.module';
import { PartnershipComponent } from './partnership.component';
import { PartnershipDetailsComponent } from './components/partnership-details/partnership-details.component';
import { AuroUiFrameWork } from 'auro-ui';

@NgModule({
  declarations: [PartnershipComponent, PartnershipDetailsComponent],
  imports: [CommonModule, PartnershipRoutingModule, AuroUiFrameWork],
})
export class PartnershipModule {}
