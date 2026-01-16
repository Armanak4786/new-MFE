import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntroducerComponent } from './introducer.component';

const routes: Routes = [{ path: '', component: IntroducerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntroducerRoutingModule {}
