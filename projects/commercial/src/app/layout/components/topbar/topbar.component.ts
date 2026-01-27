import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService, ValidationService, CurrencyService, DataService, CommonService } from 'auro-ui';
import { MenuItem, ConfirmationService } from 'primeng/api';
import { Subscription, Subject, timer, takeUntil, filter } from 'rxjs';
import { LayoutService } from 'shared-lib';
import { SidemenuService } from '../../services/sidemenu.service';
import { jwtDecode } from 'jwt-decode';
import { ContactItem } from '../../../utils/common-interface';
import { transformSlashDate } from '../../../utils/common-utils';
import { NotificationComponent } from '../../../reusable-component/components/notification/notification.component';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { DashboardApiService } from '../../../dashboard/services/dashboard-api.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
   items!: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;
  currentServerTimeA: string;
  currentServerDate;
  currentServerTime;
  currentParty;
  showFlag: boolean = false;
  searchInput: string = '';
  private timeSubscription: Subscription;
  oidcUser: any;
  userName: any;
  userInfoData: any;
  partyDataList: any;
  disableParty: boolean;
  isTopbarExpanded: boolean; // track expand/collapse state
  private destroy$ = new Subject<void>();
  isTopbarCollapsed: boolean = false;
  businessDetails;
  addressDetails;
  physicalAddress;
  postalAddress;
  registeredAddress;
  currentRoute: string;
  showExpandableSection: boolean = false;
  addressFields = [];
  notificationCount;
  relatedParties;
  contactFields = [];
  annualReviewDate;
  constructor(
    public layoutService: LayoutService,
    public authSvc: AuthenticationService,
    public commonSetterGetterService: CommonSetterGetterService,
    private sidemenuService: SidemenuService,
    private router: Router,
    public dashboardApiSvc: DashboardApiService,
    public svc: CommonService,
    public currencyService: CurrencyService
  ) {}

  isSidemenuExpanded: boolean = false;

  decodeToken(token: any): any {
    try {
      if (!token || typeof token !== 'string') {
        console.warn('Invalid token: must be a non-empty string');
        return null;
      }

      return jwtDecode(token);
    } catch (error) {
      console.error('Token decode failed:', error);
      return null;
    }
  }

  async ngOnInit() {
    this.updateServerTime();
    this.commonSetterGetterService.isCollapsed$.subscribe((state) => {
      this.isTopbarCollapsed = state;
    });
    let accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      this.currencyService.initializeCurrency();
    }
    let decodedToken = sessionStorage.getItem('accessToken');
    this.userName = this.decodeToken(decodedToken)?.sub;

    // Update the server time every minute

    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkIfDashboardRoute(event.urlAfterRedirects);
        this.commonSetterGetterService.setCollapsed(true);
        if (this.showExpandableSection) {
          this.disableParty = true;
        } else {
          this.disableParty = false;
        }
      }
    });

    this.checkIfDashboardRoute(this.router.url);

    this.timeSubscription = timer(0, 60000).subscribe(() => {
      this.updateServerTime();
    });

    this.sidemenuService.sidemenuExpanded$.subscribe((expanded: boolean) => {
      //Sidemenu expansion check.
      this.isSidemenuExpanded = expanded;
      //this.handleSidemenuChange(expanded); if required to do other logic
    });
    this.commonSetterGetterService.partyList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((partyData) => {
        this.partyDataList = partyData;
        if (this.partyDataList.length === 0) {
          const partyData = sessionStorage.getItem('partyDetails');
          const partyDataList = JSON.parse(partyData);
          this.partyDataList = partyDataList;
        }
      });
    this.commonSetterGetterService.party$.subscribe((currentParty) => {
      this.currentParty = currentParty?.id;
      if (!this.currentParty) {
        const partyData = sessionStorage.getItem('currentParty');
        const partyId = JSON.parse(partyData);
        this.currentParty = partyId?.id;
      }
    });
    this.commonSetterGetterService.disablePartyDropdown$.subscribe((value) => {
      this.disableParty = value;
    });
    this.commonSetterGetterService.customerDetails$.subscribe((details) => {
      this.businessDetails = details?.business;
    });
    this.commonSetterGetterService.address$.subscribe((add) => {
      this.addressDetails = add;
      this.getAddress();
    });
    this.commonSetterGetterService.contactData$.subscribe((relatedParties) => {
      this.relatedParties = relatedParties;
      this.getRelatedParties();
    });
    this.commonSetterGetterService.transferRequestsSubject.subscribe((data) => {
      this.notificationCount = data.countOfNotifi;
    })
  }

  toggleTopbarCollapse() {
    // this.isTopbarCollapsed = !this.isTopbarCollapsed;
    this.commonSetterGetterService.toggleCollapse();
  }

  showInput() {
    this.showFlag = true;
  }

  onPartyChange(event) {
    const currentPartyObj = this.partyDataList.find(
      (item) => event.value === item.id
    );
    const selectedPartyNo = this.partyDataList.find(
      (item) => item.id === event.value
    )?.partyNo;
    this.currentParty = event.value;
    this.dashboardApiSvc.getIntroducerSummaryData(selectedPartyNo);
    this.commonSetterGetterService.setCurrentPartyData(currentPartyObj);
    sessionStorage.setItem('currentParty', JSON.stringify(currentPartyObj));
  }
  onEditClick() {
    this.toggleTopbarCollapse();
    this.svc.router.navigateByUrl('/dashboard/update-party-details');
  }
  onSearchClick(showSearch: boolean) {
    this.showFlag = showSearch;
    if (this.showFlag) {
      setTimeout(() => {
        const element: any = document.getElementById('searchInput');
        if (element) {
          element?.focus();
        }
      });
    } else {
      this.searchInput = '';
    }
  }

  showOverlay(event: Event) {
    this.layoutService.showOverlay(event);
  }

  private updateServerTime() {
    this.currentServerTimeA = this.layoutService.getCurrentTimeString();
    const dateTime = this.currentServerTimeA.split('|');
    if (dateTime.length === 2) {
      this.currentServerTime = dateTime[0].trim();
      this.currentServerDate = dateTime[1].trim(); // "14-11-2025"
    }
  }
  checkIfDashboardRoute(url: string) {
    const cleanUrl = url.split('?')[0].split('#')[0];
    const lastSegment = cleanUrl.split('/').filter(Boolean).pop();
    this.showExpandableSection = lastSegment === 'dashboard';
  }

  onBellClick() {
    this.svc.dialogSvc
      .show(NotificationComponent, '', {
        templates: {
          footer: null,
        },
        data: '',
        position: 'fixed',
        width: '30vw',
        dismissableMask: true,
        height: '90vh',
        style: {
          position: 'absolute',
          right: '0',
          'margin-top': '50px',
          height: '600px',
        },
        contentStyle: {
          height: '100%',
          overflow: 'auto',
        },
      })
      .onClose.subscribe((data: any) => {});
  }

  contactUdc() {
    // this.svc.dialogSvc
    //   .show(ContactUdcComponent, 'Contact UDC', {
    //     templates: {
    //       footer: null,
    //     },
    //     data: '',
    //     position: 'fixed',
    //     width: '30vw',
    //     dismissableMask: true,
    //     height: '90vh',
    //     style: {
    //       position: 'absolute',
    //       right: '0',
    //       'margin-top': '50px',
    //       height: '600px',
    //     },
    //     contentStyle: {
    //       height: '100%',
    //       overflow: 'auto',
    //     },
    //   })
    //   .onClose.subscribe((data: any) => {});
  }

  async getAddress() {
    this.addressFields = [
      {
        label: 'lbl_physical',
        value: this.addressDetails?.physicalAddress || '',
      },
      {
        label: 'lbl_postalAddress',
        value: this.addressDetails?.postalAddress || '',
      },
      {
        label: 'lbl_registeredAddress',
        value: this.addressDetails?.registeredAddress || '',
      },
    ];
  }

  async getRelatedParties() {
    this.annualReviewDate = transformSlashDate(this.relatedParties?.annualReviewDate)
  const grouped = this.relatedParties?.contactFields?.reduce((acc, item) => {
    if (!acc[item.contactName]) {
      acc[item.contactName] = { ...item };
    } else {
      acc[item.contactName].contactType += `, ${item.contactType}`;
    }
    return acc;
  }, {} as Record<string, ContactItem>) ?? {};   // <---- FIX

  const result: ContactItem[] = Object.values(grouped);

  this.contactFields = result.map((item) => ({
    label: item.contactName,
    value: item.contactType,
  }));
}


  ngOnDestroy() {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
      this.destroy$.next();
      this.destroy$.complete();
    }
  }

  goToHome() {
    this.router.navigate(['/dashboard']);
  }
  logout() {}
}
