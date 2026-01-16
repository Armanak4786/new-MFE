import { Component, Input, ViewChild } from '@angular/core';
import { GenTableComponent, PrintService } from 'auro-ui';
import { buildSheetData } from '../../../utils/common-utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pi-schedule',
  //standalone: true,
  //imports: [],
  templateUrl: './pi-schedule.component.html',
  styleUrls: ['./pi-schedule.component.scss'],
})
export class PiScheduleComponent {
  @Input() piScheduleDataList;
  @Input() piScheduleColumnDefs;
  @ViewChild('piScheduleDt') piScheduleDt: GenTableComponent;
  tableId: string = 'PiScheduleList';
  constructor(
    public printSer: PrintService,
    public translateService: TranslateService
  ) {}

  ngOnInit() {}
  // export() {
  //   const tableId = this.tableId;
  //   const dt = this.piScheduleDt;
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
    const dt = this.piScheduleDt;

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
