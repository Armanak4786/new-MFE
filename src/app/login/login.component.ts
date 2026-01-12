import { Component } from '@angular/core';
import { AuthenticationService } from 'auro-ui';
import { LayoutService } from 'shared-lib';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    pageType: string = "login";
    loginQuote: any = [
        {
            heading: "Financing New Zealand Since 1937",
            text: "UDC takes great pride in helping transform New Zealander’s dreams into reality, through specialised consumer, equipment, and asset financing.",
        },
        {
            heading: "Financing New Zealand Since 1937",
            text: "UDC takes great pride in helping transform New Zealander’s dreams into reality, through specialised consumer, equipment, and asset financing.",
        },
        {
            heading: "Financing New Zealand Since 1937",
            text: "UDC takes great pride in helping transform New Zealander’s dreams into reality, through specialised consumer, equipment, and asset financing.",
        },
    ];

    constructor(
        public layoutService: LayoutService,
        private authService: AuthenticationService,
    ) { }

    ngOnInit(): void { }

    loginWithOidc() {
        this.authService.oidcLogin();
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
