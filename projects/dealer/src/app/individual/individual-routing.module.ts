import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IndividualComponent } from './individual.component';

@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: IndividualComponent }]),
  ],
  exports: [RouterModule],
})
export class IndividualRoutingModule {}
