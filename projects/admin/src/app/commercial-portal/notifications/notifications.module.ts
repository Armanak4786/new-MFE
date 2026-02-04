import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CommercialNotificationsComponent } from './notifications.component';

const routes: Routes = [
    {
        path: '',
        component: CommercialNotificationsComponent
    }
];

@NgModule({
    declarations: [CommercialNotificationsComponent],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes)
    ]
})
export class CommercialNotificationsModule { }
