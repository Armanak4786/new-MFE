import { Component, Output, EventEmitter, ElementRef } from '@angular/core';
import { AuthenticationService } from 'auro-ui';
import { Router } from '@angular/router';
import { LayoutService } from 'shared-lib';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    constructor(
        public layoutService: LayoutService,
        public el: ElementRef,
        public authSvc: AuthenticationService,
        private router: Router
    ) { }

    @Output() iconClick = new EventEmitter<string>();

    onIconClick(icon: string): void {
        //Placeholder until paths are decided. Use navigation().
        this.iconClick.emit(icon);
    }

    navigate(path: string) {
        //Function to redirect from sidebar.
        sessionStorage.removeItem('productCode');
        this.router.navigateByUrl(path);
    }
}
