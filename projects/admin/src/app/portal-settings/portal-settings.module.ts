import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PortalSettingsComponent } from './portal-settings.component';
import { AuroUiFrameWork } from 'auro-ui';

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
        AuroUiFrameWork,
        RouterModule.forChild(routes)
    ]
})
export class PortalSettingsModule { }
