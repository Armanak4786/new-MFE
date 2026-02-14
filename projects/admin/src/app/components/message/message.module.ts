import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MessageComponent } from './message.component';
import { EditMessageDialogComponent } from './edit-message-dialog/edit-message-dialog.component';
import { AddMessageTypeDialogComponent } from './add-message-type-dialog/add-message-type-dialog.component';
import { AuroUiFrameWork } from 'auro-ui';
import { DialogService } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';

const routes: Routes = [
    {
        path: '',
        component: MessageComponent
    }
];

@NgModule({
    declarations: [
        MessageComponent,
        EditMessageDialogComponent,
        AddMessageTypeDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        AuroUiFrameWork,
        DropdownModule
    ],
    providers: [DialogService],
    exports: [
        MessageComponent,
        EditMessageDialogComponent,
        AddMessageTypeDialogComponent
    ]
})
export class MessageModule { }

