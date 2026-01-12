import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogModule } from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AuroUiFrameWork } from 'auro-ui';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { NotificationBellComponent } from './components/notification-bell/notification-bell.component';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { UserProfileOverlayComponent } from './components/user-profile-overlay/user-profile-overlay.component';


@NgModule({
    declarations: [
        TopbarComponent,
        SidemenuComponent,
        FooterComponent,
        NotificationBellComponent,
        UserProfileOverlayComponent,

    ],
    imports: [
        CommonModule,
        RouterModule,
        DialogModule,
        OverlayPanelModule,
        AuroUiFrameWork
    ],
    exports: [
        TopbarComponent,
        SidemenuComponent,
        FooterComponent,
        NotificationBellComponent,
        UserProfileOverlayComponent,

    ]
})
export class LayoutModule { }
