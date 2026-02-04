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

interface MenuItem {
    id: string;
    label: string;
    icon: string;
    route?: string;
    children?: MenuItem[];
}

interface MenuSection {
    title: string;
    items: MenuItem[];
}

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
        private toasterSvc: ToasterService,
        private cookieAuthService: CookieAuthService
    ) { }

    isExpanded = true; // Always expanded
    isLocked = true; // Always locked open
    expandedMenus: { [key: string]: boolean } = { 'dealer-portal': true }; // Dealer Portal expanded by default
    activeMenuItem: string = 'dealer-logo-branding';

    // Menu structure matching the design
    menuSections: MenuSection[] = [
        {
            title: 'PLATFORM PORTALS',
            items: [
                {
                    id: 'dealer-portal',
                    label: 'Dealer Portal',
                    icon: 'fa-solid fa-building',
                    children: [
                        { id: 'dealer-logo-branding', label: 'Logo and Branding', icon: '', route: '/dealer/logo-branding' },
                        { id: 'dealer-legal-messages', label: 'Legal Messages', icon: '', route: '/dealer/legal-messages' },
                        { id: 'dealer-error-messages', label: 'Error Messages', icon: '', route: '/dealer/error-messages' },
                        { id: 'dealer-role-access', label: 'Role Base Access', icon: '', route: '/dealer/role-access' },
                        { id: 'dealer-notifications', label: 'Banner / Notifications', icon: '', route: '/dealer/notifications' }
                    ]
                },
                {
                    id: 'retail-portal',
                    label: 'Retail Portal',
                    icon: 'fa-solid fa-store',
                    children: [
                        { id: 'retail-logo-branding', label: 'Logo and Branding', icon: '', route: '/retail/logo-branding' },
                        { id: 'retail-legal-messages', label: 'Legal Messages', icon: '', route: '/retail/legal-messages' },
                        { id: 'retail-error-messages', label: 'Error Messages', icon: '', route: '/retail/error-messages' },
                        { id: 'retail-role-access', label: 'Role Base Access', icon: '', route: '/retail/role-access' },
                        { id: 'retail-notifications', label: 'Banner / Notifications', icon: '', route: '/retail/notifications' }
                    ]
                },
                {
                    id: 'commercial-portal',
                    label: 'Commercial Portal',
                    icon: 'fa-solid fa-briefcase',
                    children: [
                        { id: 'commercial-logo-branding', label: 'Logo and Branding', icon: '', route: '/commercial/logo-branding' },
                        { id: 'commercial-legal-messages', label: 'Legal Messages', icon: '', route: '/commercial/legal-messages' },
                        { id: 'commercial-error-messages', label: 'Error Messages', icon: '', route: '/commercial/error-messages' },
                        { id: 'commercial-role-access', label: 'Role Base Access', icon: '', route: '/commercial/role-access' },
                        { id: 'commercial-notifications', label: 'Banner / Notifications', icon: '', route: '/commercial/notifications' }
                    ]
                }
            ]
        },
        {
            title: 'INFRASTRUCTURE',
            items: [
                { id: 'portal-settings', label: 'Portal Settings', icon: 'fa-solid fa-cog', route: '/portal-settings' }
            ]
        }
    ];

    // Portal options for bottom selector
    portalOptions: Portal[] = [
        { name: 'Quotes & Applications', description: 'Dealer Operations', code: 'RETAIL', icon: 'assets/images/Quotes&Applications.svg', route: 'http://localhost:4201' },
        { name: 'Customer Information Portal', description: 'Commercial Operations', code: 'COMMERCIAL', icon: 'assets/images/building.svg', route: 'http://localhost:4202' },
        { name: 'Admin', description: 'Administration', code: 'ADMIN', icon: 'assets/images/setting-2.svg', route: 'http://localhost:4203' }
    ];
    selectedPortal: Portal = this.portalOptions[2];
    isPortalMenuOpen: boolean = false;

    onMouseEnter() {
        // Menu is always open - no action needed
    }

    onMouseLeave() {
        // Menu is always open - no action needed
    }

    toggleLock() {
        // Menu is always open - no action needed
    }

    toggleMenu(menuId: string, event: Event): void {
        event.stopPropagation();
        
        // Accordion behavior: close all other menus when opening a new one
        if (!this.expandedMenus[menuId]) {
            // Close all menus first
            Object.keys(this.expandedMenus).forEach(key => {
                this.expandedMenus[key] = false;
            });
        }
        
        // Toggle the clicked menu
        this.expandedMenus[menuId] = !this.expandedMenus[menuId];
    }

    isMenuExpanded(menuId: string): boolean {
        return this.expandedMenus[menuId] || false;
    }

    navigate(route: string, itemId: string): void {
        this.activeMenuItem = itemId;
        this.router.navigateByUrl(route);
    }

    isActive(itemId: string): boolean {
        return this.activeMenuItem === itemId;
    }

    @Output() iconClick = new EventEmitter<string>();

    onIconClick(icon: string): void {
        this.iconClick.emit(icon);
    }

    // Portal selector methods
    togglePortalMenu(event: Event): void {
        event.stopPropagation();
        this.isPortalMenuOpen = !this.isPortalMenuOpen;
    }

    selectPortal(portal: Portal, event: Event): void {
        event.stopPropagation();
        this.selectedPortal = portal;
        this.isPortalMenuOpen = false;
        this.navigateToPortal(portal.route);
    }

    navigateToPortal(route: string): void {
        if (route.startsWith('http://') || route.startsWith('https://')) {
            this.cookieAuthService.storeAuthToCookies();
            console.log('[Sidemenu] Auth stored to cookies, redirecting to:', route);
            window.location.href = route;
        } else {
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
