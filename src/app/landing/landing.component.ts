import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { DataService } from 'auro-ui';
import { LayoutService, CookieAuthService } from 'shared-lib';
import { DashboardService } from '../../../projects/dealer/src/app/dashboard/services/dashboard.service';

export interface ModuleCard {
    title: string;
    icon: string;
    route: string;
    color: string;
    size: 'large' | 'small';
}

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
    user_role: any;
    private readonly oidcSecurityService = inject(OidcSecurityService);

    // Dynamic module cards configuration
    // Routes use internal Angular paths to maintain sessionStorage sharing
    modules: ModuleCard[] = [
        {
            title: 'Customer Information Portal',
            icon: 'assets/images/building.svg',
            route: 'http://localhost:4202',
            color: '#B7C200',
            size: 'large'
        },
        {
            title: 'Quotes & Applications',
            icon: 'assets/images/Quotes&Applications.svg',
            route: 'http://localhost:4201',
            color: '#B7C200',
            size: 'small'
        },
        {
            title: 'Admin',
            icon: 'assets/images/setting-2.svg',
            route: 'http://localhost:4203',
            color: '#B7C200',
            size: 'small'
        }
    ];

    // Getters for filtered modules
    get largeModules(): ModuleCard[] {
        return this.modules.filter(m => m.size === 'large');
    }

    get smallModules(): ModuleCard[] {
        return this.modules.filter(m => m.size === 'small');
    }

    constructor(
        public layoutService: LayoutService,
        private dataSvc: DataService,
        private router: Router,
        public dashboardService: DashboardService,
        private cookieAuthService: CookieAuthService
    ) {
        let accessToken = sessionStorage.getItem("accessToken");
        if (accessToken) {
            // Store auth data to cookies immediately after login for cross-port sharing
            this.cookieAuthService.storeAuthToCookies();
            this.dashboardService?.callOriginatorApi();
            console.log("getRoleBasedPermissions");
            this.getRoleBasedPermissions();
        }
    }

    ngOnInit(): void {

    }

    navigateTo(route: string): void {
        // Check if it's an external URL (different port)
        if (route.startsWith('http://') || route.startsWith('https://')) {
            // Store auth data to cookies before redirecting to different port
            this.cookieAuthService.storeAuthToCookies();
            console.log('[Landing] Auth stored to cookies, redirecting to:', route);
            // Redirect to external URL
            window.location.href = route;
        } else {
            // Internal route - use Angular router
            this.router.navigate([route]);
        }
    }

    getRoleBasedPermissions() {
        this.dataSvc.get("RolePermissions/RolePermissionsNew").subscribe((res) => {
            this.user_role = res;
            if (this.user_role?.data?.functions) {
                const functionNames = this.user_role.data.functions
                    .filter((item: any) => item?.functionName)
                    .map((item: any) => item.functionName);

                const structuredData = {
                    roleName: this.user_role.data.roleName,
                    functions: functionNames,
                };

                sessionStorage.setItem("user_role", JSON.stringify(structuredData));
                // Update cookies with new user role data
                this.cookieAuthService.storeAuthToCookies();
            }
        });
    }

    get containerClass() {
        return {
            "layout-theme-light": this.layoutService.config.colorScheme === "light",
            "layout-theme-dark": this.layoutService.config.colorScheme === "dark",
            "layout-overlay": this.layoutService.config.menuMode === "overlay",
            "layout-static": this.layoutService.config.menuMode === "static",
            "layout-static-inactive":
                this.layoutService.state.staticMenuDesktopInactive &&
                this.layoutService.config.menuMode === "static",
            "layout-overlay-active": this.layoutService.state.overlayMenuActive,
            "layout-mobile-active": this.layoutService.state.staticMenuMobileActive,
            "p-input-filled": this.layoutService.config.inputStyle === "filled",
            "p-ripple-disabled": !this.layoutService.config.ripple,
        };
    }
}
