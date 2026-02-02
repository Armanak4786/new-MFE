import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { CommonService, AuthenticationService, ToasterService } from 'auro-ui';
import { Router } from '@angular/router';
import { LayoutService, CookieAuthService } from 'shared-lib';
import { SidemenuService } from '../../services/sidemenu.service';

interface Portal {
    name: string;
    description: string;
    code: string;
    icon: string;
    route: string;
}

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
        private toasterSvc: ToasterService,
        private cookieAuthService: CookieAuthService
    ) { }

    isExpanded = false; // True when hovered
    isLocked = false; // True when locked
    isSubmenuOpen = false;

    // Portal options - using same routes as landing page
    portalOptions: Portal[] = [
        { name: 'Quotes & Applications', description: 'Dealer Operations', code: 'RETAIL', icon: 'assets/images/Quotes&Applications.svg', route: 'http://localhost:4201' },
        { name: 'Customer Information Portal', description: 'Commercial Operations', code: 'COMMERCIAL', icon: 'assets/images/building.svg', route: 'http://localhost:4202' },
        { name: 'Admin', description: 'Administration', code: 'ADMIN', icon: 'assets/images/setting-2.svg', route: 'http://localhost:4203' }
    ];
    selectedPortal: Portal = this.portalOptions[1]; // Commercial is selected by default
    isPortalMenuOpen: boolean = false;

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

    togglePortalMenu(event: Event): void {
        event.stopPropagation();
        this.isPortalMenuOpen = !this.isPortalMenuOpen;
    }

    selectPortal(portal: Portal, event: Event): void {
        event.stopPropagation();
        this.selectedPortal = portal;
        this.isPortalMenuOpen = false;

        // Navigate using same mechanism as landing page
        this.navigateToPortal(portal.route);
    }

    navigateToPortal(route: string): void {
        // Check if it's an external URL (different port)
        if (route.startsWith('http://') || route.startsWith('https://')) {
            // Store auth data to cookies before redirecting to different port
            this.cookieAuthService.storeAuthToCookies();
            console.log('[Sidemenu] Auth stored to cookies, redirecting to:', route);
            // Redirect to external URL
            window.location.href = route;
        } else {
            // Internal route - use Angular router
            this.router.navigate([route]);
        }
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (!target.closest('.portal-selector-container')) {
            this.isPortalMenuOpen = false;
        }
    }
}
