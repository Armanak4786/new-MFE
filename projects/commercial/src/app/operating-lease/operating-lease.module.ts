import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperatingLeaseRoutingModule } from './operating-lease-routing.module';
import { OperatingLeaseComponent } from './operating-lease.component';
import { AuroUiFrameWork } from 'auro-ui';
import { ReusableComponentModule } from '../reusable-component/reusable-component.module';

import { CommercialModule } from '../commercial.module';
import { OlLeaseDetailsComponent } from './components/ol-lease-details/ol-lease-details.component';
import { RentalForcastComponent } from './components/rental-forcast/rental-forcast.component';
import { RentalSummaryComponent } from './components/rental-summary/rental-summary.component';
import { RentalScheduleComponent } from './components/rental-schedule/rental-schedule.component';

@NgModule({
  declarations: [
    OperatingLeaseComponent,
    OlLeaseDetailsComponent,
    RentalForcastComponent,
    RentalSummaryComponent,
    RentalScheduleComponent,
  ],
  imports: [
    CommonModule,
    OperatingLeaseRoutingModule,
    // ChartModule,
    AuroUiFrameWork,
    // ReactiveFormsModule,
    ReusableComponentModule,
    CommercialModule,
  ],
})
export class OperatingLeaseModule {}
