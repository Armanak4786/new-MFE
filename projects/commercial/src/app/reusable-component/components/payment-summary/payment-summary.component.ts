import { Component, Input, ViewChild } from '@angular/core';
import { GenTableComponent, PrintService } from 'auro-ui';
import { buildSheetData, print } from '../../../utils/common-utils';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-payment-summary',
  //standalone: true,
  //imports: [],
  templateUrl: './payment-summary.component.html',
  styleUrls: ['./payment-summary.component.scss'],
})
export class PaymentSummaryComponent {
  @Input() paymentSummaryDataList;
  @Input() paymentSummaryColumnDefs;
  @ViewChild('dt') dt: GenTableComponent;
  tableId: string = 'PaymentSummary';
  constructor(
    public printSer: PrintService,
    public translateService: TranslateService
  ) {}

  ngOnInit() {}
  //  export() {
  //   const tableId = this.tableId;
  //   const dt = this.dt;

  //   if (!tableId || !dt) {
  //     console.error('Table ID or data is missing');
  //     return;
  //   }
  //   let columns = dt.columns || [];
  //   const data = dt.dataList || [];
  //   if (columns) {
  //     columns = columns.filter((column) => column.headerName !== 'Action');
  //   }
  //   this.printSer.export('xlsx', tableId, columns, data);
  // }

  export() {
    const tableId = this.tableId;
    const dt = this.dt;

    if (!tableId || !dt) {
      console.error('Table ID or data is missing');
      return;
    }

    let columns = dt.columns || [];
    const data = dt.dataList || [];

    if (columns) {
      columns = columns.filter((column) => column.headerName !== 'Action');
    }

    const workbookData = [];

    workbookData.push(
      buildSheetData({
        sheetName: tableId,
        columns: columns,
        dataList: data,
        translateService: this.translateService,
        excludedFields: ['Action'],
      })
    );

    this.printSer.export('xlsx', tableId, workbookData);
  }

  onPrint() {
    print();
  }
}
