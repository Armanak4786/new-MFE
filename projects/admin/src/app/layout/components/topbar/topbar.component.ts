import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService, ValidationService, CurrencyService, DataService } from 'auro-ui';
import { MenuItem, ConfirmationService } from 'primeng/api';
import { Subscription, Subject, timer, takeUntil, filter } from 'rxjs';
import { LayoutService } from 'shared-lib';
import { SidemenuService } from '../../services/sidemenu.service';

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

    constructor(
        public layoutService: LayoutService,
        public authSvc: AuthenticationService,
        private sidemenuService: SidemenuService,
        private validationSvc: ValidationService,
        public currencyService: CurrencyService,
        private dataService: DataService,
        private router: Router,
        private confirmationService: ConfirmationService,
        private translateSvc: TranslateService
    ) { }

    isSidemenuExpanded: boolean = false;

    async ngOnInit() {
        let accessToken = sessionStorage.getItem("accessToken");
        if (accessToken) {
            this.currencyService.initializeCurrency();
        }
        this.userName = this.decodeToken(accessToken)?.sub?.replace(".", " ");
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

        await this.validationSvc.getValidations().subscribe(async (data) => { });
    }

    decodeToken(token: string): any {
        try {
            const payload = token?.split('.')[1];
            return JSON.parse(atob(payload));
        } catch (e) {
            return null;
        }
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

    @HostListener("document:click", ["$event"])
    closeDropdown(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest(".custom-dropdown")) {
        }
    }
}
