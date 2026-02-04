import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DealerNotificationsComponent } from './notifications.component';

const routes: Routes = [
    {
        path: '',
        component: DealerNotificationsComponent
    }
];

@NgModule({
    declarations: [DealerNotificationsComponent],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes)
    ]
})
export class DealerNotificationsModule { }
