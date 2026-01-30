import { Component, Inject, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { LayoutService } from 'shared-lib';
import { TopbarComponent } from './layout/components/topbar/topbar.component';
import { SidebarComponent } from './layout/components/sidebar/sidebar.component';
import { SidemenuService } from './layout/services/sidemenu.service';

@Component({
  selector: 'app-commercial-root',
  template: `
    <div class="layout-wrapper" [ngClass]="containerClass">
      <app-topbar></app-topbar>
      <app-sidemenu></app-sidemenu>
      <div class="layout-sidebar">
        <app-sidebar></app-sidebar>
      </div>
      <div class="layout-main-container" [ngClass]="{ expanded: isSidemenuLocked, auth: authRoute }">
        <app-breadcrumb></app-breadcrumb>
        <div class="layout-main">
          <router-outlet></router-outlet>
        </div>
      </div>
      <app-footer></app-footer>
      <div class="layout-mask"></div>
    </div>
  `
})
export class CommercialComponent {
  isSidemenuLocked: boolean = false;
  authRoute: boolean = true;
  currentRoute: string = '';
  overlayMenuOpenSubscription: Subscription;
  menuOutsideClickListener: any;
  profileMenuOutsideClickListener: any;

  @ViewChild(SidebarComponent) appSidebar!: SidebarComponent;
  @ViewChild(TopbarComponent) appTopbar!: TopbarComponent;

  constructor(
    public layoutService: LayoutService,
    public renderer: Renderer2,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private sidemenuService: SidemenuService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
      if (!this.menuOutsideClickListener) {
        this.menuOutsideClickListener = this.renderer.listen("document", "click", (event) => {
          const isOutsideClicked = !(
            this.appSidebar?.el?.nativeElement?.isSameNode(event.target) ||
            this.appSidebar?.el?.nativeElement?.contains(event.target) ||
            this.appTopbar?.menuButton?.nativeElement?.isSameNode(event.target) ||
            this.appTopbar?.menuButton?.nativeElement?.contains(event.target)
          );
          if (isOutsideClicked) {
            this.hideMenu();
          }
        });
      }

      if (!this.profileMenuOutsideClickListener) {
        this.profileMenuOutsideClickListener = this.renderer.listen("document", "click", (event) => {
          const isOutsideClicked = !(
            this.appTopbar?.menu?.nativeElement?.isSameNode(event.target) ||
            this.appTopbar?.menu?.nativeElement?.contains(event.target) ||
            this.appTopbar?.topbarMenuButton?.nativeElement?.isSameNode(event.target) ||
            this.appTopbar?.topbarMenuButton?.nativeElement?.contains(event.target)
          );
          if (isOutsideClicked) {
            this.hideProfileMenu();
          }
        });
      }

      if (this.layoutService.state.staticMenuMobileActive) {
        this.blockBodyScroll();
      }
    });

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.hideMenu();
      this.hideProfileMenu();
    });
  }

  ngOnInit() {
    this.sidemenuService.sidemenuExpanded$.subscribe((expanded: boolean) => {
      this.isSidemenuLocked = expanded;
      this.currentRoute = this.router.url;
      this.authRoute = !this.currentRoute.includes("/authentication");
    });

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: any) => {
      this.authRoute = !this.currentRoute.includes("/authentication");
    });
  }

  hideMenu() {
    this.layoutService.state.overlayMenuActive = false;
    this.layoutService.state.staticMenuMobileActive = false;
    this.layoutService.state.menuHoverActive = false;
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
      this.menuOutsideClickListener = null;
    }
    this.unblockBodyScroll();
  }

  hideProfileMenu() {
    this.layoutService.state.profileSidebarVisible = false;
    if (this.profileMenuOutsideClickListener) {
      this.profileMenuOutsideClickListener();
      this.profileMenuOutsideClickListener = null;
    }
  }

  blockBodyScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (document.body.classList) {
      document.body.classList.add("blocked-scroll");
    } else {
      document.body.className += " blocked-scroll";
    }
  }

  unblockBodyScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (document.body.classList) {
      document.body.classList.remove("blocked-scroll");
    } else {
      document.body.className = document.body.className.replace(
        new RegExp("(^|\\b)" + "blocked-scroll".split(" ").join("|") + "(\\b|$)", "gi"),
        " "
      );
    }
  }

  get containerClass() {
    return {
      "layout-theme-light": this.layoutService.config.colorScheme === "light",
      "layout-theme-dark": this.layoutService.config.colorScheme === "dark",
      "layout-overlay": this.layoutService.config.menuMode === "overlay",
      "layout-static": this.layoutService.config.menuMode === "static",
      "layout-static-inactive": this.layoutService.state.staticMenuDesktopInactive && this.layoutService.config.menuMode === "static",
      "layout-overlay-active": this.layoutService.state.overlayMenuActive,
      "layout-mobile-active": this.layoutService.state.staticMenuMobileActive,
      "p-input-filled": this.layoutService.config.inputStyle === "filled",
      "p-ripple-disabled": !this.layoutService.config.ripple,
    };
  }

  ngOnDestroy() {
    if (this.overlayMenuOpenSubscription) {
      this.overlayMenuOpenSubscription.unsubscribe();
    }
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
    }
  }
}
