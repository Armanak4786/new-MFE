import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DealerComponent } from './dealer.component';

const routes: Routes = [
  {
    path: '',
    component: DealerComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'standard-quote/:mode/:id',
        loadChildren: () =>
          import('./standard-quote/standard-quote.module').then(
            (m) => m.StandardQuoteModule
          ),
        data: { breadcrumb: 'Standard Quote' },
      },
      {
        path: 'standard-quote',
        loadChildren: () =>
          import('./standard-quote/standard-quote.module').then(
            (m) => m.StandardQuoteModule
          ),
        data: { breadcrumb: 'Standard Quote' },
      },
      {
        path: 'asset/:type/:mode',
        loadChildren: () =>
          import('./asset/asset.module').then((m) => m.AssetModule),
        data: { breadcrumb: 'Add Asset' },
      },
      {
        path: 'asset/:type',
        loadChildren: () =>
          import('./asset/asset.module').then((m) => m.AssetModule),
        data: { breadcrumb: 'Add Asset' },
      },
      {
        path: 'trade/:type/:mode',
        loadChildren: () =>
          import('./asset/asset.module').then((m) => m.AssetModule),
        data: { breadcrumb: 'Add Trade' },
      },
      {
        path: 'trade/:type',
        loadChildren: () =>
          import('./asset/asset.module').then((m) => m.AssetModule),
        data: { breadcrumb: 'Add Trade' },
      },
      {
        path: 'business/:mode/:contractId/:customerId',
        loadChildren: () =>
          import('./business/business.module').then((m) => m.BusinessModule),
        data: { breadcrumb: 'Business' },
      },
      {
        path: 'business',
        loadChildren: () =>
          import('./business/business.module').then((m) => m.BusinessModule),
        data: { breadcrumb: 'Business' },
      },
      {
        path: 'individual/:mode/:contractId/:customerId',
        loadChildren: () =>
          import('./individual/individual.module').then((m) => m.IndividualModule),
        data: { breadcrumb: 'Individual' },
      },
      {
        path: 'individual',
        loadChildren: () =>
          import('./individual/individual.module').then((m) => m.IndividualModule),
        data: { breadcrumb: 'Individual' },
      },
      {
        path: 'trust/:mode/:contractId/:customerId',
        loadChildren: () =>
          import('./trust/trust.module').then((m) => m.TrustModule),
        data: { breadcrumb: 'Trust' },
      },
      {
        path: 'trust',
        loadChildren: () =>
          import('./trust/trust.module').then((m) => m.TrustModule),
        data: { breadcrumb: 'Trust' },
      },
      {
        path: 'sole-trade/:mode/:contractId/:customerId',
        loadChildren: () =>
          import('./sole-trade/sole-trade.module').then((m) => m.SoleTradeModule),
        data: { breadcrumb: 'Business Individual' },
      },
      {
        path: 'sole-trade',
        loadChildren: () =>
          import('./sole-trade/sole-trade.module').then((m) => m.SoleTradeModule),
        data: { breadcrumb: 'Sole Trade' },
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        data: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'quick-quote',
        loadChildren: () =>
          import('./quick-quote/quick-quote.module').then(
            (m) => m.QuickQuoteModule
          ),
        data: { breadcrumb: 'Create Quick Quote' },
      },
      {
        path: 'customer-statement/:mode/:id',
        loadChildren: () =>
          import('./customer-statement/customer-statement.module').then(
            (m) => m.CustomerStatementModule
          ),
      },
      {
        path: 'customer-statement/:contractId',
        loadChildren: () =>
          import('./customer-statement/customer-statement.module').then(
            (m) => m.CustomerStatementModule
          ),
      },
      {
        path: 'customer-statement',
        loadChildren: () =>
          import('./customer-statement/customer-statement.module').then(
            (m) => m.CustomerStatementModule
          ),
      },
      {
        path: 'partnership',
        loadChildren: () =>
          import('./partnership/partnership.module').then(
            (m) => m.PartnershipModule
          ),
        data: { breadcrumb: 'Partnership' },
      },
      {
        path: 'supplier/:mode/:contractId/:customerId',
        loadChildren: () =>
          import('./individual/components/Supplier/supplier.module').then(
            (m) => m.SupplierModule
          ),
        data: { breadcrumb: 'Supplier' },
      },
      {
        path: 'supplier',
        loadChildren: () =>
          import('./individual/components/Supplier/supplier.module').then(
            (m) => m.SupplierModule
          ),
        data: { breadcrumb: 'Add Supplier' },
      },
    ]
  }
];

@NgModule({
  declarations: [DealerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class DealerModule { }
