import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StandardQuoteComponent } from './standard-quote.component';
import { AssetSearchResultComponent } from './components/asset-search-result/asset-search-result.component';
import { AddOnAccessoriesComponent } from './components/add-on-accessories/add-on-accessories.component';
import { QuoteOriginatorComponent } from './components/quote-originator/quote-originator.component';
import { SettlementQuoteDetailsComponent } from './components/settlement-quote-details/settlement-quote-details.component';
import { BorrowerSearchResultComponent } from './components/borrower-search-result/borrower-search-result.component';

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
        path: 'borrower-search-result/:customerType',
        component: BorrowerSearchResultComponent,
        data: { breadcrumb: 'Borrower Result' },
      },
      {
        path: 'asset-search-result',
        component: AssetSearchResultComponent,
        data: { breadcrumb: 'Asset Search Result' },

      },
      {
        path: 'trade-search-result',
        component: AssetSearchResultComponent,
        data: { breadcrumb: 'Trade Search Result' },

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
