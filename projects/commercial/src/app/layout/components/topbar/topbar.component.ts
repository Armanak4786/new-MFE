import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService, ValidationService, CurrencyService, DataService } from 'auro-ui';
import { MenuItem, ConfirmationService } from 'primeng/api';
import { Subscription, Subject, timer, takeUntil, filter } from 'rxjs';
import { LayoutService } from 'shared-lib';
import { SidemenuService } from '../../services/sidemenu.service';
import { DashboardService } from '../../../dashboard/services/dashboard.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
    items!: MenuItem[];

    @ViewChild("menubutton") menuButton!: ElementRef;

    @ViewChild("topbarmenubutton") topbarMenuButton!: ElementRef;

    @ViewChild("topbarmenu") menu!: ElementRef;
    currentServerTimeA: string;
    showFlag: boolean = false;
    searchInput: string = "";
    private timeSubscription: Subscription;
    oidcUser: any;
    userName: any;
    swingIcon = false;
    notificationValue = 0;
    private destroy$ = new Subject<void>();
    options: string[] = ["Dealer ", "Commercial"];
    selectedOption: string = "";
    isDropdownOpen: boolean = false;
    selectedValue: any;
    currentRoute: any;
    enabledRoutes: string[] = ["/dealer", "/dealer/quick-quote"];
    isDealerDropdownEnabled = false;
    showDealerDropdown: boolean = true;

    constructor(
        public layoutService: LayoutService,
        public authSvc: AuthenticationService,
        private sidemenuService: SidemenuService,
        public dashboardService: DashboardService,
        private validationSvc: ValidationService,
        public currencyService: CurrencyService,
        private dataService: DataService,
        private router: Router,
        private confirmationService: ConfirmationService,
        private translateSvc: TranslateService
    ) { }

    isSidemenuExpanded: boolean = false;

    async ngOnInit() {
        // sessionStorage.removeItem('currency_data');
        let accessToken = sessionStorage.getItem("accessToken");
        if (accessToken) {
            this.currencyService.initializeCurrency();
        }
        let decodedToken = this.dashboardService.decodeToken(accessToken);
        this.userName = decodedToken?.sub.replace(".", " ");
        this.dataService.setNotificationInfo(
            `${this.userName
            } logged-in at ${this.layoutService.getCurrentTimeString()}`
        );

        this.updateServerTime();

        this.timeSubscription = timer(0, 30000).subscribe(() => {
            this.updateServerTime();
        });

        this.sidemenuService.sidemenuExpanded$.subscribe((expanded: boolean) => {
            this.isSidemenuExpanded = expanded;
        });

        this.dataService.notificationSubject.pipe(takeUntil(this.destroy$)).subscribe((event) => {
            let length = 0;
            length =
                event?.errors?.length + event?.warnings?.length + event?.infos?.length;
            this.notificationValue = length;
            this.swingIcon = true;
            setTimeout(() => {
                this.swingIcon = false;
            }, 4000);
        });
        this.dashboardService.quoteRoute.next(false);
        if (this.userName) {
            this.dashboardService.callOriginatorApi();
        }
        await this.validationSvc.getValidations().subscribe(async (data) => { });
        this.checkRoute(this.router.url);

        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event: any) => {
                this.checkRoute(event.urlAfterRedirects);
            });
        this.layoutService.activeTab$.subscribe((tab) => {
            this.checkRoute(this.router.url);
        });

        this.showDealerDropdown = (sessionStorage.getItem("externalUserType") == "Internal") ? false : true;
    }

    showNotification(event: Event) {
        this.layoutService.showNotification(event);
        this.swingIcon = true;
        setTimeout(() => {
            this.swingIcon = false;
        }, 4000);
    }

    showInput() {
        this.showFlag = true;
    }

    onSearchClick(showSearch: boolean) {
        this.showFlag = showSearch;
        if (this.showFlag) {
            setTimeout(() => {
                const element: any = document.getElementById("searchInput");
                if (element) {
                    element?.focus();
                }
            });
        } else {
            this.searchInput = "";
        }
    }

    showOverlay(event: Event) {
        this.layoutService.showOverlay(event);
    }
    private updateServerTime() {
        this.currentServerTimeA = this.layoutService.getCurrentTimeString();
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        if (this.timeSubscription) {
            this.timeSubscription.unsubscribe();
        }
    }

    logout() { }

    toggleDropdown() {
        this.isDropdownOpen = this.isDropdownOpen ? false : true;
    }

    async onSelect(event: any) {
        this.selectedValue = event.value;

        this.currentRoute = this.router.url;
        let message = "dealerChangeWarningMsg";
        if (this.currentRoute === "/dealer") {
            this.dashboardService.setDealerToLocalStorage(event.value);
            this.dashboardService.quoteRoute.next(false);
            return;
        }
        if (this.currentRoute == "/dealer/quick-quote") {
            this.dashboardService.quoteRoute.next(true);
            this.confirmBox(event, message);
        } else {
            this.confirmBox(event, message);
            this.dashboardService.quoteRoute.next(false);
        }
    }

    confirmBox(event, message) {
        this.confirmationService.confirm({
            message: this.translateSvc.instant(message),
            icon: "", // or '' to remove
            acceptLabel: "Yes",
            rejectLabel: "No",
            acceptButtonStyleClass: "p-button-primary",
            rejectButtonStyleClass: "p-button-outlined",
            accept: () => {
                this.dashboardService?.quoteRoute.next(false);
                this.dashboardService.setDealerToLocalStorage(event.value);
            },
            reject: () => {
                const dealerValue = sessionStorage.getItem("dealerPartyNumber");
                const dealerName = sessionStorage.getItem("dealerPartyName");
                this.dashboardService.userSelectedOption = {
                    name: dealerName,
                    num: Number(dealerValue),
                };
            },
        });
        setTimeout(() => {
            const dialog = document.querySelector(".p-confirm-dialog");
            dialog?.classList.add("topbar-confirm-dialog");
        });
    }

    @HostListener("document:click", ["$event"])
    closeDropdown(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest(".custom-dropdown")) {
            this.isDropdownOpen = false;
        }
    }

    checkRoute(url: string) {
        if (this.enabledRoutes.includes(url)) {
            this.isDealerDropdownEnabled = true;
            return;
        }

        if (
            url.startsWith("/dealer/standard-quote/edit") ||
            url == "/dealer/standard-quote"
        ) {
            const activeTab = this.layoutService.getActiveTab();
            this.isDealerDropdownEnabled = activeTab === "asset_details";
            return;
        }

        this.isDealerDropdownEnabled = false;
    }
}
