import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BorrowerSearchResultComponent } from './components/borrower-search-result/borrower-search-result.component';
import { AssetSearchResultComponent } from './components/asset-search-result/asset-search-result.component';

const routes: Routes = [
  {
    path: 'borrower/:customerType',
    component: BorrowerSearchResultComponent,
    data: { breadcrumb: 'Borrower Search Result' },
  },
  {
    path: 'asset',
    component: AssetSearchResultComponent,
    data: { breadcrumb: 'Asset Search Result' },
  },
  {
    path: 'trade',
    component: AssetSearchResultComponent,
    data: { breadcrumb: 'Trade Search Result' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchResultsRoutingModule { }

