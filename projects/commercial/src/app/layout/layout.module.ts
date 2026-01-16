import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuroUiFrameWork } from 'auro-ui';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { NotificationBellComponent } from './components/notification-bell/notification-bell.component';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import { SubSidemenuComponent } from './components/sub-sidemenu/sub-sidemenu.component';
import { ReportDialogComponent } from './components/report-dialog/report-dialog.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { UserProfileOverlayComponent } from './components/user-profile-overlay/user-profile-overlay.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';


@NgModule({
    declarations: [
        TopbarComponent,
        SidemenuComponent,
        SubSidemenuComponent,
        FooterComponent,
        NotificationBellComponent,
        UserProfileOverlayComponent,
        ReportDialogComponent,
        SidebarComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        DialogModule,
        OverlayPanelModule,
        CalendarModule,
        DropdownModule,
        InputTextModule,
        ButtonModule,
        AuroUiFrameWork
    ],
    exports: [
        TopbarComponent,
        SidemenuComponent,
        SubSidemenuComponent,
        FooterComponent,
        NotificationBellComponent,
        UserProfileOverlayComponent,
        ReportDialogComponent,
        SidebarComponent
    ]
})
export class LayoutModule { }
