import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CommercialLogoBrandingComponent } from './logo-branding.component';

const routes: Routes = [
    {
        path: '',
        component: CommercialLogoBrandingComponent
    }
];

@NgModule({
    declarations: [CommercialLogoBrandingComponent],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes)
    ]
})
export class CommercialLogoBrandingModule { }
