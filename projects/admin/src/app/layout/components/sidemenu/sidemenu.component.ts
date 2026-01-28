import { Component, EventEmitter, Output } from '@angular/core';
import { CommonService, AuthenticationService, ToasterService } from 'auro-ui';
import { Router } from '@angular/router';
import { LayoutService } from 'shared-lib';
import { SidemenuService } from '../../services/sidemenu.service';

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

        const isSameRoute = currentUrl === targetPath;
        if (isSameRoute) {
            return;
        }
        callback();
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
