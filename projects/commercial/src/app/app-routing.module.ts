import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'auro-ui';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'assetlink',
    loadChildren: () =>
      import('./assetlink/assetlink.module').then((m) => m.AssetlinkModule),
    data: { breadcrumb: 'Assetlink' },
  },
  {
    path: 'easylink',
    loadChildren: () =>
      import('./easylink/easylink.module').then((m) => m.EasylinkModule),
    data: { breadcrumb: 'Easylink' },
  },
  {
    path: 'creditlines',
    loadChildren: () =>
      import('./creditlines/creditlines.module').then(
        (m) => m.CreditlinesModule
      ),
    data: { breadcrumb: 'Creditline' },
  },
  {
    path: 'operating-lease',
    loadChildren: () =>
      import('./operating-lease/operating-lease.module').then(
        (m) => m.OperatingLeaseModule
      ),
    data: { breadcrumb: 'Operating lease' },
  },
  {
    path: 'non-facility-loan',
    loadChildren: () =>
      import('./non-facility-loans/non-facility-loans.module').then(
        (m) => m.NonFacilityLoansModule
      ),
    data: { breadcrumb: 'Non facility loans' },
  },
  {
    path: 'buyback',
    loadChildren: () =>
      import('./buyback/buyback.module').then((m) => m.BuybackModule),
    data: { breadcrumb: 'Buyback' },
  },
  {
    path: 'bailment',
    loadChildren: () =>
      import('./bailments/bailments.module').then((m) => m.BailmentsModule),
    data: { breadcrumb: 'Bailment' },
  },
  {
    path: 'fixedfloorplan',
    loadChildren: () =>
      import('./fixed-floor-plan/fixed-floor-plan.module').then(
        (m) => m.FixedFloorPlanModule
      ),
    data: { breadcrumb: 'Fixed Floorplan' },
  },
  {
    path: 'floatingfloorplan',
    loadChildren: () =>
      import('./floating-floor-plan/floating-floor-plan-module').then(
        (m) => m.FloatingFloorPlanModule
      ),
    data: { breadcrumb: 'Floating Floorplan' },
  },
  {
    path: 'introducer',
    loadChildren: () =>
      import('./introducer/introducer-module').then((m) => m.IntroducerModule),
    data: { breadcrumb: 'Introducer Transaction Summary' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
