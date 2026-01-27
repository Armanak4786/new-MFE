import { EventEmitter, Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

export interface AppConfig {
    inputStyle: string;
    colorScheme: string;
    theme: string;
    ripple: boolean;
    menuMode: string;
    scale: number;
}

interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    profileSidebarVisible: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;
}

@Injectable({
    providedIn: "root",
})
export class LayoutService {
    config: AppConfig = {
        ripple: false,
        inputStyle: "filled",
        menuMode: "overlay",
        colorScheme: "light",
        theme: "lara-light-indigo",
        scale: 14,
    };

    state: LayoutState = {
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
    };

    private configUpdate = new Subject<AppConfig>();

    private overlayOpen = new Subject<any>();

    configUpdate$ = this.configUpdate.asObservable();

    overlayOpen$ = this.overlayOpen.asObservable();

    public toggleOverlay: EventEmitter<any> = new EventEmitter();

    public toggleNotification: EventEmitter<any> = new EventEmitter();

    notifications = {
        errors: [],
        warnings: [],
        infos: [],
        reminders: [],
    };
    notificationSubject = new BehaviorSubject<any>(this.notifications);
    notificationCacheUpdate = new BehaviorSubject<any>(this.notifications);
    private activeTabSource = new BehaviorSubject<string>('asset_details');
    activeTab$ = this.activeTabSource.asObservable();

    showOverlay(event: Event) {
        this.toggleOverlay.emit(event);
    }

      getCurrentTimeString() {
    // Create a new Date object
    const currentDate = new Date();

    // Extract hours, minutes, and AM/PM
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format

    // Format date as YYYY-MM-DD
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // Format final string (time | date)
    return `${String(formattedHours).padStart(2, '0')}:${String(
      minutes
    ).padStart(2, '0')} ${ampm} | ${formattedDate}`;
  }

    onMenuToggle() {
        if (this.isOverlay()) {
            this.state.overlayMenuActive = !this.state.overlayMenuActive;
            if (this.state.overlayMenuActive) {
                this.overlayOpen.next(null);
            }
        }

        if (this.isDesktop()) {
            this.state.staticMenuDesktopInactive =
                !this.state.staticMenuDesktopInactive;
        } else {
            this.state.staticMenuMobileActive = !this.state.staticMenuMobileActive;

            if (this.state.staticMenuMobileActive) {
                this.overlayOpen.next(null);
            }
        }
    }

    showNotification(event: Event, name?: any) {
        this.toggleNotification.emit(event);
    }

    setNotificationInfo(value) {
        if (!this.notifications.infos.includes(value)) {
            this.notifications.infos.push(value);
            this.notificationSubject.next(this.notifications);
        }
    }

    setNotificationError(value) {
        if (!this.notifications.errors.includes(value)) {
            this.notifications.errors.push(value);
            this.notificationSubject.next(this.notifications);
        }
    }

    setNotificationWarning(value) {
        if (!this.notifications.warnings.includes(value)) {
            this.notifications.warnings.push(value);
            this.notificationSubject.next(this.notifications);
        }
    }

    resetNotification() {
        this.notifications = {
            errors: [],
            warnings: [],
            infos: [],
            reminders: [],
        };
        this.notificationSubject.next(this.notifications);
    }

    showProfileSidebar() {
        this.state.profileSidebarVisible = !this.state.profileSidebarVisible;
        if (this.state.profileSidebarVisible) {
            this.overlayOpen.next(null);
        }
    }

    showConfigSidebar() {
        this.state.configSidebarVisible = true;
    }

    isOverlay() {
        return this.config.menuMode === "overlay";
    }

    isDesktop() {
        return window.innerWidth > 991;
    }

    isMobile() {
        return !this.isDesktop();
    }

    onConfigUpdate() {
        this.configUpdate.next(this.config);
    }
    setActiveTab(tab: string) {
        this.activeTabSource.next(tab);
    }
    getActiveTab(): string {
        return this.activeTabSource.value;
    }
}
