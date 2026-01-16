import { Component, Input, ViewChild } from '@angular/core';
import { GenTableComponent, PrintService } from 'auro-ui';

@Component({
  selector: 'app-rental-schedule',
  // standalone: true,
  // imports: [],
  templateUrl: './rental-schedule.component.html',
  styleUrls: ['./rental-schedule.component.scss']
})
export class RentalScheduleComponent {
    @Input() rentalScheduleDataList;
    @Input() rentalScheduleColumnDefs;
    @ViewChild('rentalSchedule') rentalSchedule : GenTableComponent
    tableId : string ='Rental Schedule'

    constructor(public printSer: PrintService){}

    ngOnInit(){}

    export() { 
      const tableId = this.tableId;
      const dt = this.rentalSchedule;
      if (!tableId || !dt) {
        console.error('Table ID or data is missing');
        return;
      }
      let columns = dt.columns || [];
      const data = dt.dataList || [];
      if (columns) {
        columns = columns.filter((column) => column.headerName !== 'Action');
      }
      this.printSer.export('xlsx', tableId, columns, data);
    }
    
    onPrint() {
      print();
    }
}
