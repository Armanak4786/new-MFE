import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuroUiFrameWork } from 'auro-ui';
import { SearchResultsRoutingModule } from './search-results-routing.module';
import { BorrowerSearchResultComponent } from './components/borrower-search-result/borrower-search-result.component';
import { AssetSearchResultComponent } from './components/asset-search-result/asset-search-result.component';

@NgModule({
  declarations: [
    BorrowerSearchResultComponent,
    AssetSearchResultComponent
  ],
  imports: [
    CommonModule,
    SearchResultsRoutingModule,
    AuroUiFrameWork
  ]
})
export class SearchResultsModule { }

