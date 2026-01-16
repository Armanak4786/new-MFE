import { Component, Input, ViewChild } from '@angular/core';
import { buildSheetData, print } from '../../../utils/common-utils';
import { GenTableComponent, PrintService } from 'auro-ui';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-rental-summary',
  //standalone: true,
  //imports: [],
  templateUrl: './rental-summary.component.html',
  styleUrls: ['./rental-summary.component.scss'],
})
export class RentalSummaryComponent {
  @Input() rentalSummaryDataList;
  @Input() rentalSummaryColumnDefs;
  @ViewChild('rentalSummary') rentalSummary;
  tableId: string = 'Rental Summary';
  constructor(
    public printSer: PrintService,
    public translateService: TranslateService
  ) {}

  ngOnInit() {}

  // export() {
  //     const tableId = this.tableId;
  //     const dt = this.rentalSummary;
  //     if (!tableId || !dt) {
  //       console.error('Table ID or data is missing');
  //       return;
  //     }
  //     let columns = dt.columns || [];
  //     const data = dt.dataList || [];
  //     if (columns) {
  //       columns = columns.filter((column) => column.headerName !== 'Action');
  //     }
  //     this.printSer.export('xlsx', tableId, columns, data);
  //   }

  export() {
    const tableId = this.tableId;
    const dt = this.rentalSummary;

    if (!tableId || !dt) {
      console.error('Table ID or data is missing');
      return;
    }

    let columns = dt.columns || [];
    const dataListWithoutMonth = dt.dataList.map(({ month, ...rest }) => rest);
    const workbookData = [];

    workbookData.push(
      buildSheetData({
        sheetName: tableId,
        columns: columns,
        dataList: dataListWithoutMonth,
        translateService: this.translateService,
        excludedFields: ['Action', 'month'],
      })
    );

    this.printSer.export('xlsx', tableId, workbookData);
  }

  onPrint() {
    setTimeout(() => {
      window.print();
    }, 100);
  }
}
