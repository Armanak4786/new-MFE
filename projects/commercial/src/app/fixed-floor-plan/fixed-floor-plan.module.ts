import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FixedFloorPlanComponent } from './fixed-floor-plan.component';
import { AuroUiFrameWork } from 'auro-ui';
import { CommercialModule } from '../commercial.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { ReusableComponentModule } from '../reusable-component/reusable-component.module';
import { FixedFloorPlanRoutingModule } from './fixed-floor-plan-routing.module';
import { FixedFloorPlanFacilityComponent } from './components/fixed-floor-plan-facility/fixed-floor-plan-facility.component';
import { FixedFloorPlanDrawdownRequestComponent } from './components/fixed-floor-plan-drawdown-request/fixed-floor-plan-drawdown-request.component';
import { FixedFloorAssetActionComponent } from './components/fixed-floor-asset-action/fixed-floor-asset-action.component';
import { MotocheckComponent } from './components/motocheck/motocheck.component';


@NgModule({
  declarations: [FixedFloorPlanComponent, FixedFloorPlanFacilityComponent,
    FixedFloorPlanDrawdownRequestComponent,
    FixedFloorAssetActionComponent, MotocheckComponent
  ],
  imports: [
    CommonModule,
    FixedFloorPlanRoutingModule,
    AuroUiFrameWork,
    CommercialModule,
    ReactiveFormsModule,
    ChartModule,
    ReusableComponentModule,
  ],
})
export class FixedFloorPlanModule { }
