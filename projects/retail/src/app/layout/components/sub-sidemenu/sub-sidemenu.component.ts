import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonService } from 'auro-ui';
import { ReportDialogComponent } from '../report-dialog/report-dialog.component';

@Component({
    selector: 'app-sub-sidemenu',
    templateUrl: './sub-sidemenu.component.html',
    styleUrls: ['./sub-sidemenu.component.scss']
})
export class SubSidemenuComponent {
    @Input() isExpanded: boolean = false;
    @Output() closeSubmenu = new EventEmitter<void>();
    @Output() navigate = new EventEmitter<string>();

    constructor(
        private commonsvc: CommonService,
    ) { }

    reports: any = [
        {
            AccessLevel: 'Internal',
            ExtensionOutput: 'CSV',
            Id: 1,
            IsActuive: true,
            Parameters: [],
            ReportName: 'User Access Report',
        },
        {
            AccessLevel: 'Internal',
            ExtensionOutput: 'CSV',
            Id: 2,
            IsActuive: true,
            Parameters: [
                {
                    Type: 'Dropdown',
                    Name: 'Month',
                    DefaultValue: '',
                    SelectList: ['Report 1', 'Report 2', 'Report 3'],
                    Validation: '',
                },
                {
                    Type: 'TextBox',
                    Name: 'Filter',
                    DefaultValue: 'PQR',
                    Validation: '',
                },
            ],
            ReportName: 'Monthly Report',
        },
    ];

    reportSelected(report: any) {
        this.commonsvc?.dialogSvc
            ?.show(ReportDialogComponent, report?.ReportName, {
                templates: {
                    footer: null,
                },
                data: report,
                width: '40vw',
            })
            .onClose.subscribe((data: any) => { });
    }
}

