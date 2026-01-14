import { Component, Output, EventEmitter, ElementRef } from '@angular/core';
import { AuthenticationService } from 'auro-ui';
import { Router } from '@angular/router';
import { LayoutService } from 'shared-lib';
import { QuickQuoteService } from '../../../quick-quote/services/quick-quote.service';
import { AssetTradeSummaryService } from '../../../standard-quote/components/asset-insurance-summary/asset-trade.service';
import { StandardQuoteService } from '../../../standard-quote/services/standard-quote.service';

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
        private standardQuoteSvc: StandardQuoteService,
        private assetTradeSvc: AssetTradeSummaryService,
        private router: Router,
        private quickquoteService: QuickQuoteService
    ) { }

    @Output() iconClick = new EventEmitter<string>();

    onIconClick(icon: string): void {
        //Placeholder until paths are decided. Use navigation().
        this.iconClick.emit(icon);
    }

    navigate(path: string) {
        //Function to redirect from sidebar.
        sessionStorage.removeItem('productCode');
        this.standardQuoteSvc.resetBaseDealerFormData();
        this.standardQuoteSvc.activeStep = 0;
        this.assetTradeSvc.resetData();
        this.quickquoteService.resetData();
        this.router.navigateByUrl(path);
    }
}

