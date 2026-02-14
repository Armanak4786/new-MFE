import { Component, ViewChild } from '@angular/core';
import { AuthenticationService, environment } from 'auro-ui';
import { Router } from '@angular/router';
import { OverlayPanel } from 'primeng/overlaypanel';
import { LayoutService } from 'shared-lib';
import { jwtDecode } from 'jwt-decode';

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

    decodeToken(token: string): any {
        try {
            return jwtDecode(token);
        } catch (error) {
            return null;
        }
    }

    ngOnInit() {
        this.overlayService.toggleOverlay.subscribe((event) => {
            this.overlayPanel.toggle(event);
        });

        let accessToken = sessionStorage.getItem("accessToken");
        let decodedToken = this.decodeToken(accessToken);
        this.userName = decodedToken?.sub?.replace(".", " ");
    }

    logout() {
        if (environment.FIS) {
            this.authSvc.revokeAllToken().subscribe({
                next: (revokeAllToken) => {
                    localStorage.clear();
                    sessionStorage.clear();
                    this.authSvc.clearAuth();
                    this.router.navigate(["/login"]).then(() => {
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
