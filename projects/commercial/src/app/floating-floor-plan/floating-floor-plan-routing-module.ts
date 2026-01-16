import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FloatingFloorPlanComponent } from './floating-floor-plan.component';

const routes: Routes = [{ path: '', component: FloatingFloorPlanComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FloatingFloorPlanRoutingModule {}
