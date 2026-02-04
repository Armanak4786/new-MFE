import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PortalSettingsComponent } from './portal-settings.component';

const routes: Routes = [
    {
        path: '',
        component: PortalSettingsComponent
    }
];

@NgModule({
    declarations: [PortalSettingsComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class PortalSettingsModule { }
