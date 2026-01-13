import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuickQuoteComponent } from './quick-quote.component';

const routes: Routes = [{ path: '', component: QuickQuoteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuickQuoteRoutingModule { }
