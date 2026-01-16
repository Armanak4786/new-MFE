import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseFormClass, CommonService, GenericFormConfig } from 'auro-ui';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

export interface ReportConfig {
    title: string;
    reportType: string;
    fields: ReportField[];
}

export interface ReportField {
    name: string;
    label: string;
    type: 'text' | 'date' | 'select' | 'daterange';
    required?: boolean;
    options?: { label: string; value: any }[];
    placeholder?: string;
}

@Component({
    selector: 'app-report-dialog',
    templateUrl: './report-dialog.component.html',
    styleUrls: ['./report-dialog.component.scss']
})
export class ReportDialogComponent extends BaseFormClass implements OnInit {

    configData: any;
    fieldsToShow: any[] = [];

    constructor(
        public override route: ActivatedRoute,
        public override svc: CommonService,
        public dynamicDialogConfig: DynamicDialogConfig,
        public ref: DynamicDialogRef
    ) {
        super(route, svc);
    }

    override formConfig: GenericFormConfig = {
        api: '',
        cardType: 'non-border',
        fields: [
            {
                type: 'dropdown',
                label: 'Month',
                labelClass: 'mb-4',
                name: 'selectMonth',
                alignmentType: 'vertical',
                cols: 5,
                hidden: true,
            },
            {
                type: 'date',
                name: 'startDate',
                label: 'Start Date',
                inputType: 'vertical',
                cols: 6,
                hidden: true,
            },
            {
                type: 'date',
                name: 'endDate',
                label: 'End Date',
                inputType: 'vertical',
                cols: 6,
                hidden: true,
            },
        ],
    };

    override async ngOnInit() {
        await super.ngOnInit();
        this.dynamicDialogConfig.data?.Parameters.forEach((element: any) => {
            this.fieldsToShow.push(element?.Type);
            if (element?.Type === 'Dropdown') {
                const dropDownOptions = element?.SelectList.map((item: any) => {
                    return { label: item, value: item };
                });
                this.mainForm?.updateList('selectMonth', dropDownOptions || []);
            }
        });
    }

    override async onFormReady() {
        super.onFormReady();
        this.fieldsToShow.forEach((element: any) => {
            if (element === 'Dropdown') {
                this.mainForm?.updateHidden({ 'selectMonth': false });

            }
            if (element === 'DatePicker') {
                this.mainForm?.updateHidden({ 'startDate': false, 'endDate': false });
            }
        });
    }

    onSave() {

    }

    onCancel() {
        this.ref.close();
    }
}
