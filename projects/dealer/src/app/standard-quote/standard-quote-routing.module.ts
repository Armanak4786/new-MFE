import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StandardQuoteComponent } from './standard-quote.component';
import { AddOnAccessoriesComponent } from './components/add-on-accessories/add-on-accessories.component';
import { QuoteOriginatorComponent } from './components/quote-originator/quote-originator.component';
import { SettlementQuoteDetailsComponent } from './components/settlement-quote-details/settlement-quote-details.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: StandardQuoteComponent },
      {
        path: 'add-on-accessories',
        component: AddOnAccessoriesComponent,
        data: { breadcrumb: 'Add On Accessories' },
      },
      {
        path: 'add-on-accessories/:mode/:id',
        component: AddOnAccessoriesComponent,
        data: { breadcrumb: 'Add On Accessories' },
      },
      {
        path: 'settlement-quote-details',
        component: SettlementQuoteDetailsComponent,
      },
      { path: 'quote-originator', component: QuoteOriginatorComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class StandardQuoteRoutingModule { }
