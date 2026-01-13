import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'business',
    loadChildren: () => import('./business/business.module').then(m => m.BusinessModule)
  },
  {
    path: 'individual',
    loadChildren: () => import('./individual/individual.module').then(m => m.IndividualModule)
  },
  {
    path: 'sole-trade',
    loadChildren: () => import('./sole-trade/sole-trade.module').then(m => m.SoleTradeModule)
  },
  {
    path: 'trust',
    loadChildren: () => import('./trust/trust.module').then(m => m.TrustModule)
  },
  {
    path: 'partnership',
    loadChildren: () => import('./partnership/partnership.module').then(m => m.PartnershipModule)
  },
  {
    path: 'standard-quote',
    loadChildren: () => import('./standard-quote/standard-quote.module').then(m => m.StandardQuoteModule)
  },
  {
    path: 'quick-quote',
    loadChildren: () => import('./quick-quote/quick-quote.module').then(m => m.QuickQuoteModule)
  },
  {
    path: 'asset',
    loadChildren: () => import('./asset/asset.module').then(m => m.AssetModule)
  },
  {
    path: 'customer-statement',
    loadChildren: () => import('./customer-statement/customer-statement.module').then(m => m.CustomerStatementModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
