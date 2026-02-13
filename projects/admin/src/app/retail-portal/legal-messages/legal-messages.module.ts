import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { RetailLegalMessagesComponent } from './legal-messages.component';
import { AuroUiFrameWork } from 'auro-ui';

const routes: Routes = [
    {
        path: '',
        component: RetailLegalMessagesComponent
    }
];

@NgModule({
    declarations: [RetailLegalMessagesComponent],
    imports: [
        CommonModule,
        FormsModule,
        AuroUiFrameWork,
        RouterModule.forChild(routes)
    ]
})
export class RetailLegalMessagesModule { }
