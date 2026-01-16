import { Component } from '@angular/core';
import { CommonService } from 'auro-ui';
import { ReportDialogComponent } from '../report-dialog/report-dialog.component';
@Component({
    selector: 'app-sub-sidemenu',
    templateUrl: './sub-sidemenu.component.html',
    styleUrls: ['./sub-sidemenu.component.scss']
})
export class SubSidemenuComponent {
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
            Id: 1,
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
            ReportName: 'Monthly Lending Application and Total Amount',
        },
        {
            AccessLevel: 'Internal',
            ExtensionOutput: 'CSV',
            Id: 1,
            IsActuive: true,
            Parameters: [
                {
                    Type: 'DatePicker',
                    Name: 'Start Date',
                    DefaultValue: '',
                    MinValue: '12-05-2025',
                    MaxValue: '12-12-2025',
                },
                {
                    Type: 'DatePicker',
                    Name: 'End Date',
                    DefaultValue: '',
                    MinValue: '12-05-2025',
                    MaxValue: '12-12-2025',
                    Validation: '',
                },
                {
                    Type: 'TextBox',
                    Name: 'Filter',
                    DefaultValue: 'PQR',
                    Validation: '',
                },
            ],
            ReportName: 'Dealer Listing - Active Loans',
        },
        {
            AccessLevel: 'Internal',
            ExtensionOutput: 'CSV',
            Id: 1,
            IsActuive: true,
            Parameters: [
                {
                    Type: 'Dropdown',
                    Name: 'Month',
                    DefaultValue: '',
                    SelectList: ['Wholesome Report 1', 'Wholesome Report 2', 'Wholesome Report 3'],
                    Validation: '',
                },
                {
                    Type: 'DatePicker',
                    Name: 'Start Date',
                    DefaultValue: '',
                    MinValue: '12-05-2025',
                    MaxValue: '12-12-2025',
                },
                {
                    Type: 'DatePicker',
                    Name: 'End Date',
                    DefaultValue: '',
                    MinValue: '12-05-2025',
                    MaxValue: '12-12-2025',
                    Validation: '',
                },
            ],
            ReportName: 'Wholesome Interest',
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
