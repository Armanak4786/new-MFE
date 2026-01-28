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
        let decodedToken = this.decodeToken(accessToken);
        this.userName = decodedToken?.sub?.replace(".", " ");
    }

    decodeToken(token: string): any {
        try {
            const payload = token?.split('.')[1];
            return JSON.parse(atob(payload));
        } catch (e) {
            return null;
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
