import { Component, EventEmitter, Output } from '@angular/core';
import { CommonService, AuthenticationService, ToasterService } from 'auro-ui';
import { Router } from '@angular/router';
import { LayoutService } from 'shared-lib';
import { SidemenuService } from '../../services/sidemenu.service';
import { DashboardService } from '../../../dashboard/services/dashboard.service';

@Component({
    selector: 'app-sidemenu',
    templateUrl: './sidemenu.component.html',
    styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent {
    activeStep: number;
    //This is the sidemenu, for Devices with width > 992px
    constructor(
        public layoutService: LayoutService,
        public svc: CommonService,
        public authSvc: AuthenticationService,
        private router: Router,
        private sidemenuService: SidemenuService,
        private dashboardSvc: DashboardService,
        private toasterSvc: ToasterService
    ) { }

    isExpanded = false; // True when hovered
    isLocked = false; // True when locked
    isSubmenuOpen = false;

    onMouseEnter() {
        //Mouse enter logic, expands sidemenu
        if (!this.isLocked) {
            this.isExpanded = true;
            this.sidemenuService.toggleSidemenu(false);
        }
    }
    showConfirmationDialog(targetPath: string, callback: () => void): void {
        const currentUrl = this.router.url.split("?")[0]; // remove query params

        const onStandardQuote =
            currentUrl.includes("/standard-quote") ||
            currentUrl.includes("/individual") ||
            currentUrl.includes("/business") ||
            currentUrl.includes("/trust") ||
            currentUrl.includes("/sole-trade")

        const isSameRoute = currentUrl === targetPath;
        if (isSameRoute) {
            return;
        }
        if (onStandardQuote) {
            this.svc.ui.showOkDialog(
                "Any unsaved changes will be lost. Are you sure you want to cancel?",
                "",
                () => callback(),
                () => { }
            );
        } else {
            callback();
        }
    }

    onMouseLeave() {
        //Shrinks sidemenu on mouse leave
        if (!this.isLocked) {
            this.isExpanded = false;
            this.sidemenuService.toggleSidemenu(false);
            this.isSubmenuOpen = false;
        }
    }

    toggleLock() {
        //To toggle the locking of the sidemenu
        this.isLocked = !this.isLocked;
        this.sidemenuService.toggleSidemenu(this.isLocked); // Notify the service
    }

    @Output() iconClick = new EventEmitter<string>(); // Placeholder to emulate click behavior

    onIconClick(icon: string): void {
        this.showConfirmationDialog("menu", () => {
            this.isSubmenuOpen = false;
            //Remove once paths are decided. Use naviagate below.
            this.iconClick.emit(icon);
        });
    }

    navigate(path: string) {
        this.showConfirmationDialog(path, () => {
            this.isSubmenuOpen = false;
            const isExternalUser = sessionStorage.getItem("externalUserType");
            if (isExternalUser?.includes("External")) {
                if (!this.dashboardSvc.userSelectedOption) {
                    this.dashboardSvc.dealerAnimate = true;
                    setTimeout(() => {
                        this.dashboardSvc.dealerAnimate = false;
                    }, 5000);

                    this.toasterSvc.showToaster({
                        detail: "Please select a dealer.",
                    });
                    return;
                }
            }

            //Function to redirect from menu.
            sessionStorage.removeItem("productCode");
            this.router.navigateByUrl(path);
        });
    }

    toggleSubmenu() {
        this.showConfirmationDialog("reports", () => {
            this.isSubmenuOpen = !this.isSubmenuOpen;
        });
    }

    closeSubmenu() {
        this.isSubmenuOpen = false;
    }
}
