import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () =>
  //     import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  // },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    data: { breadcrumb: 'Dashboard' },
  },
  {
    path: 'portal-settings',
    loadChildren: () =>
      import('./portal-settings/portal-settings.module').then((m) => m.PortalSettingsModule),
    data: { breadcrumb: 'Portal Settings' },
  },
  {
    path: 'dealer/legal-messages',
    loadChildren: () =>
      import('./dealer-portal/legal-messages/legal-messages.module').then((m) => m.LegalMessagesModule),
    data: { breadcrumb: 'Legal Messages' },
  },
  {
    path: '',
    loadChildren: () =>
      import('./dealer-portal/logo-branding/logo-branding.module').then((m) => m.LogoBrandingModule),
    data: { breadcrumb: 'Logo and Branding' },
  },
  {
    path: 'dealer/error-messages',
    loadChildren: () =>
      import('./dealer-portal/error-messages/error-messages.module').then((m) => m.DealerErrorMessagesModule),
    data: { breadcrumb: 'Error Messages' },
  },
  {
    path: 'dealer/notifications',
    loadChildren: () =>
      import('./dealer-portal/notifications/notifications.module').then((m) => m.DealerNotificationsModule),
    data: { breadcrumb: 'Banner / Notifications' },
  },
  {
    path: 'dealer/role-access',
    loadChildren: () =>
      import('./dealer-portal/role-access/role-access.module').then((m) => m.DealerRoleAccessModule),
    data: { breadcrumb: 'Role Base Access' },
  },
  {
    path: 'retail/legal-messages',
    loadChildren: () =>
      import('./retail-portal/legal-messages/legal-messages.module').then((m) => m.RetailLegalMessagesModule),
    data: { breadcrumb: 'Legal Messages' },
  },
  {
    path: 'retail/logo-branding',
    loadChildren: () =>
      import('./retail-portal/logo-branding/logo-branding.module').then((m) => m.RetailLogoBrandingModule),
    data: { breadcrumb: 'Logo and Branding' },
  },
  {
    path: 'retail/notifications',
    loadChildren: () =>
      import('./retail-portal/notifications/notifications.module').then((m) => m.RetailNotificationsModule),
    data: { breadcrumb: 'Banner / Notifications' },
  },
  {
    path: 'retail/role-access',
    loadChildren: () =>
      import('./retail-portal/role-access/role-access.module').then((m) => m.RetailRoleAccessModule),
    data: { breadcrumb: 'Role Base Access' },
  },
  {
    path: 'commercial/legal-messages',
    loadChildren: () =>
      import('./commercial-portal/legal-messages/legal-messages.module').then((m) => m.CommercialLegalMessagesModule),
    data: { breadcrumb: 'Legal Messages' },
  },
  {
    path: 'commercial/logo-branding',
    loadChildren: () =>
      import('./commercial-portal/logo-branding/logo-branding.module').then((m) => m.CommercialLogoBrandingModule),
    data: { breadcrumb: 'Logo and Branding' },
  },
  {
    path: 'commercial/notifications',
    loadChildren: () =>
      import('./commercial-portal/notifications/notifications.module').then((m) => m.CommercialNotificationsModule),
    data: { breadcrumb: 'Banner / Notifications' },
  },
  {
    path: 'commercial/role-access',
    loadChildren: () =>
      import('./commercial-portal/role-access/role-access.module').then((m) => m.CommercialRoleAccessModule),
    data: { breadcrumb: 'Role Base Access' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }




