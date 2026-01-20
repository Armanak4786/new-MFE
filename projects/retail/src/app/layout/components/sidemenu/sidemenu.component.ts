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

    constructor(
        public layoutService: LayoutService,
        public svc: CommonService,
        public authSvc: AuthenticationService,
        private router: Router,
        private sidemenuService: SidemenuService,
        private toasterSvc: ToasterService
    ) { }

    isExpanded = false;
    isLocked = false;
    isSubmenuOpen = false;

    onMouseEnter() {
        if (!this.isLocked) {
            this.isExpanded = true;
            this.sidemenuService.toggleSidemenu(false);
        }
    }

    showConfirmationDialog(targetPath: string, callback: () => void): void {
        const currentUrl = this.router.url.split("?")[0];
        const isSameRoute = currentUrl === targetPath;
        if (isSameRoute) {
            return;
        }
        callback();
    }

    onMouseLeave() {
        if (!this.isLocked) {
            this.isExpanded = false;
            this.sidemenuService.toggleSidemenu(false);
            this.isSubmenuOpen = false;
        }
    }

    toggleLock() {
        this.isLocked = !this.isLocked;
        this.sidemenuService.toggleSidemenu(this.isLocked);
    }

    @Output() iconClick = new EventEmitter<string>();

    onIconClick(icon: string): void {
        this.showConfirmationDialog("menu", () => {
            this.isSubmenuOpen = false;
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

