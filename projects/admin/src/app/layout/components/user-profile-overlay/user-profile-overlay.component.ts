import { Component, ViewChild } from '@angular/core';
import { AuthenticationService, environment } from 'auro-ui';
import { Router } from '@angular/router';
import { OverlayPanel } from 'primeng/overlaypanel';
import { LayoutService } from 'shared-lib';

@Component({
    selector: 'app-user-profile-overlay',
    templateUrl: './user-profile-overlay.component.html',
    styleUrls: ['./user-profile-overlay.component.scss']
})
export class UserProfileOverlayComponent {
    @ViewChild("overlayPanel") overlayPanel: OverlayPanel;

    userName: any;

    constructor(
        private overlayService: LayoutService,
        public authSvc: AuthenticationService,
        public layoutService: LayoutService,
        public router: Router
    ) { }

    ngOnInit() {
        this.overlayService.toggleOverlay.subscribe((event) => {
            this.overlayPanel.toggle(event);
        });

        let accessToken = sessionStorage.getItem("accessToken");
        if (accessToken) {
            try {
                const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
                this.userName = tokenPayload?.sub?.replace(".", " ") || 'Admin User';
            } catch {
                this.userName = 'Admin User';
            }
        }
    }

    logout() {
        if (environment.FIS) {
            this.authSvc.revokeAllToken().subscribe({
                next: (revokeAllToken) => {
                    localStorage.clear();
                    sessionStorage.clear();
                    this.authSvc.clearAuth();
                    this.router.navigate(["/authentication/login"]).then(() => {
                        window.location.reload();
                    });
                },
            });
        } else {
            this.authSvc.revokeSession().subscribe({
                next: (revokeSession) => {
                    this.authSvc.oidcLogout();
                },
            });
        }
    }

    changePassword() {
        this.router.navigateByUrl("/authentication/change-password");
    }
}



