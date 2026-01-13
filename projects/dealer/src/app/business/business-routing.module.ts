import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BusinessComponent } from './business.component';

@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: BusinessComponent }]),
  ],
  exports: [RouterModule],
})
export class BusinessRoutingModule {}
