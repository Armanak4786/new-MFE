import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuroUiFrameWork } from 'auro-ui';
import { CommercialModule } from '../commercial.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { ReusableComponentModule } from '../reusable-component/reusable-component.module';
import { FloatingFloorPlanRoutingModule } from './floating-floor-plan-routing-module';
import { FloatingFloorPlanComponent } from './floating-floor-plan.component';
import { FloatingFloorPlanDrawdownRequestComponent } from './components/floating-floor-plan-drawdown-request/floating-floor-plan-drawdown-request.component';

@NgModule({
  declarations: [FloatingFloorPlanComponent, FloatingFloorPlanDrawdownRequestComponent],
  imports: [
    CommonModule,
    FloatingFloorPlanRoutingModule,
    AuroUiFrameWork,
    CommercialModule,
    ReactiveFormsModule,
    ChartModule,
    ReusableComponentModule,
  ],
})
export class FloatingFloorPlanModule { }
