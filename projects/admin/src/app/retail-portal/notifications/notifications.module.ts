import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { RetailNotificationsComponent } from './notifications.component';

const routes: Routes = [
    {
        path: '',
        component: RetailNotificationsComponent
    }
];

@NgModule({
    declarations: [RetailNotificationsComponent],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes)
    ]
})
export class RetailNotificationsModule { }
