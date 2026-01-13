import { Component, ElementRef, ViewChild } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrintService, ToasterService } from 'auro-ui';

@Component({
  selector: 'app-export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.scss'], // Corrected property name
})
export class ExportDataComponent {
  exportData = [
    { name: 'CSV', code: 'csv' }, // Ensure lowercase codes match the PrintService type
    { name: 'PDF', code: 'pdf' },
    { name: 'Excel', code: 'xlsx' },
  ];
  selectedExportValue: string = '';
  exportDisplayName: 'csv' | 'pdf' | 'xlsx' | 'png' | 'txt' | '' = ''; 

  constructor(
    private printSer: PrintService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    public toasterService: ToasterService
  ) {}

  changeExportEvent(e: any) {
    this.exportDisplayName = e.value as 'csv' | 'pdf' | 'xlsx';
  }

  close() {
    this.ref.close({});
  }

  export() {
  const { tableId, dt } = this.config.data || {};
  if (!tableId || !dt) {
    return;
  }

  let columns = dt.columns || [];
  const data = dt.dataList || [];

  if (columns) {
    columns = columns.filter((column) => column.headerName !== 'Action');
  }
  if (this.selectedExportValue) {
    this.printSer.export(this.selectedExportValue as 'csv' | 'pdf' | 'xlsx', tableId, columns, data);
  } else {
     this.toasterService.showToaster({
            severity: "error",
            detail: "Please select export type",
          });
 
  }
}
}
