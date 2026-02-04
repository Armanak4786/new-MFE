import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DealerErrorMessagesComponent } from './error-messages.component';

const routes: Routes = [
    {
        path: '',
        component: DealerErrorMessagesComponent
    }
];

@NgModule({
    declarations: [DealerErrorMessagesComponent],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes)
    ]
})
export class DealerErrorMessagesModule { }
