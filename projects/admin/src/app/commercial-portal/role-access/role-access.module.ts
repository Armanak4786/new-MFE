import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CommercialRoleAccessComponent } from './role-access.component';
import { AuroUiFrameWork } from 'auro-ui';

const routes: Routes = [
    {
        path: '',
        component: CommercialRoleAccessComponent
    }
];

@NgModule({
    declarations: [CommercialRoleAccessComponent],
    imports: [
        CommonModule,
        FormsModule,
        AuroUiFrameWork,
        RouterModule.forChild(routes)
    ]
})
export class CommercialRoleAccessModule { }
