import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { RetailLogoBrandingComponent } from './logo-branding.component';
import { AuroUiFrameWork } from 'auro-ui';

const routes: Routes = [
    {
        path: '',
        component: RetailLogoBrandingComponent
    }
];

@NgModule({
    declarations: [RetailLogoBrandingComponent],
    imports: [
        CommonModule,
        FormsModule,
        AuroUiFrameWork,
        RouterModule.forChild(routes)
    ]
})
export class RetailLogoBrandingModule { }
