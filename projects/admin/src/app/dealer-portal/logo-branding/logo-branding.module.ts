import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LogoBrandingComponent } from './logo-branding.component';

const routes: Routes = [
    {
        path: '',
        component: LogoBrandingComponent
    }
];

@NgModule({
    declarations: [LogoBrandingComponent],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes)
    ]
})
export class LogoBrandingModule { }
