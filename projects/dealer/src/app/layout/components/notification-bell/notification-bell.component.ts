import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { AuthenticationService, DataService } from 'auro-ui';
import { OverlayPanel } from 'primeng/overlaypanel';
import { LayoutService } from 'shared-lib';

@Component({
    selector: 'app-notification-bell',
    templateUrl: './notification-bell.component.html',
    styleUrls: ['./notification-bell.component.scss']
})
export class NotificationBellComponent {
    @ViewChild("overlayPanel") overlayPanel: OverlayPanel;
    name: any;
    errors = [];
    infos = [];
    reminders = [];
    warnings = [];
    @Input() target!: HTMLElement;

    notifications: any;

    selectedNotification = null;
    notificationValue: number = 0;

    constructor(
        private overlayService: LayoutService,
        public authSvc: AuthenticationService,
        private eRef: ElementRef,
        private dataService: DataService,
        // private quickquoteService: QuickQuoteService,
        // private standardQuoteService: StandardQuoteService
    ) { }

    @HostListener("document:click", ["$event"])
    clickOutside(event: Event) {
        const clickedElement = event.target as Node;

        if (
            this.overlayPanel.overlayVisible &&
            this.overlayPanel.el.nativeElement &&
            !this.eRef.nativeElement.contains(clickedElement) && // Click outside the overlay
            !this.target.contains(clickedElement) // Click outside the bell icon
        ) {
            this.overlayPanel.hide();
        }
    }

    ngOnInit() {
        this.overlayService.toggleNotification.subscribe((event) => {
            this.overlayPanel.toggle(event);
            setTimeout(() => {
                this.selectedNotification = null;
            }, 200);

            this.reset();
            this.notifications = this.dataService.notifications;
            let notilength =
                this.notifications?.errors?.length +
                this.notifications?.warnings?.length +
                this.notifications?.infos?.length;
            this.notificationValue = notilength;
            if (this.notifications?.errors) {
                this.errors = this.notifications?.errors;
            }

            if (this.notifications?.infos) {
                this.infos = this.notifications?.infos;
            }

            if (this.notifications?.reminders) {
                this.reminders = this.notifications?.reminders;
            }

            if (this.notifications?.warnings) {
                this.warnings = this.notifications?.warnings;
            }
        });
    }

    reset() {
        this.errors = [];
        this.infos = [];
        this.reminders = [];
        this.warnings = [];

        this.notifications = {};
    }

    logout() {
        // this.quickquoteService.quickQuoteData = [];
        // this.standardQuoteService.resetBaseDealerFormData();
    }

    dismissAll() {

        const emptyNotifications = {
            errors: [],
            warnings: [],
            infos: [],
            reminders: [],
        };

        this.dataService.notifications = emptyNotifications;
        this.overlayService.notifications = emptyNotifications;

        this.dataService.notificationSubject.next(emptyNotifications);
        this.overlayService.notificationSubject.next(emptyNotifications);

        this.notifications = emptyNotifications;
        this.errors = [];
        this.infos = [];
        this.reminders = [];
        this.warnings = [];

        this.notificationValue = 0;
        this.selectedNotification = null;
    }

}
