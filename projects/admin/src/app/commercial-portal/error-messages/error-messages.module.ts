import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CommercialErrorMessagesComponent } from './error-messages.component';

const routes: Routes = [
    {
        path: '',
        component: CommercialErrorMessagesComponent
    }
];

@NgModule({
    declarations: [CommercialErrorMessagesComponent],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes)
    ]
})
export class CommercialErrorMessagesModule { }
