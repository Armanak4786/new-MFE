import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { LayoutModule } from './layout/layout.module';
import { AuroUiFrameWork } from 'auro-ui';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        data: { breadcrumb: 'Dashboard' },
      },
    ]
  }
];

@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    LayoutModule,
    AuroUiFrameWork,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { }
