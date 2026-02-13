import { Component, Input, ViewChild } from '@angular/core';
import { CommonService, GenTableComponent, PrintService, ToasterService } from 'auro-ui';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { buildSheetData, printTable } from '../../../utils/common-utils';
import { TranslateService } from '@ngx-translate/core';
import { IntroducerPaymentTabPopUpComponent } from '../introducer-payment-tab-pop-up/introducer-payment-tab-pop-up.component';

@Component({
  selector: 'app-transaction-flow',
  templateUrl: './transaction-flow.component.html',
  styleUrl: './transaction-flow.component.scss',
})
export class TransactionFlowComponent {
  @Input() facilityType;
  @Input() paymentDataList;
  @Input() paymentColumnDefs;
  @Input() transactionDataList;
  @Input() transactionsColumnDef;
  @Input() paymentNotYetAllocated;
  @Input() overDue;
  id: number;
  @ViewChild('dt1')
  dt1: GenTableComponent;
  @ViewChild('dt2')
  dt2: GenTableComponent;
  allocatedPayments: any;
 selectedRow: any;

  tableId: string = 'Payments';
  currentPaymentId: number;
  currentTransactionId: number;
  constructor(
    public commonSetterGetterService: CommonSetterGetterService,
    public printSer: PrintService,
    public translateService: TranslateService,
    public toasterService: ToasterService,
    public svc: CommonService
  ) {}
  ngOnInit() {}

  onTransactionCellClick(event) {
    if (event.cellData == 'View') {
      this.getTransactionId(event.rowData.id);
    }else if(event.colName === 'paymentId'){
       this.svc.dialogSvc
        .show(IntroducerPaymentTabPopUpComponent, ' ', {
          templates: {
            footer: null,
          },
          data: { transactionId:event?.rowData?.flowId},
          height: '100px',
          width: '47vw',
        })
        .onClose.subscribe((data: any) => {
        });
     
    }
    this.tableId = 'Transaction';
  }

  // getPaymentId(id) {
  //   this.commonSetterGetterService.setPaymentIdData(id);
  // }

  // getTransactionId(id) {
  //   this.commonSetterGetterService.setTransactionIdData(id);
  // }

  getPaymentId(id: number) {
    if (this.currentPaymentId === id) return; // prevent duplicate emissions
    this.currentPaymentId = id;
    this.commonSetterGetterService.setPaymentIdData(id);
  }

  getTransactionId(id: number) {
    if (this.currentTransactionId === id) return; // prevent duplicate emissions
    this.currentTransactionId = id;
    this.commonSetterGetterService.setTransactionIdData(id);
  }

  onPaymentCellClick(event) {
    if (event.cellData == 'View') {
      this.getPaymentId(event.rowData.id);
    }else if(event.colName === 'paymentId'){
      
      const result = sessionStorage.getItem('transactions')
      const transactions = result ? JSON.parse(result) : [];

      const data = transactions.filter(x=>x.paymentId === event.cellData)
      
      this.svc.dialogSvc
        .show(IntroducerPaymentTabPopUpComponent, ' ', {
          templates: {
            footer: null,
          },
          data: { data,component:"Payment" },
          height: '100px',
          width: '80vw',
        })
        .onClose.subscribe((data: any) => {
        });
     }
  }

  // export() {
  //   const tableId = this.tableId;
  //   let dt = null;
  //   if (tableId == 'Payments') {
  //     dt = this.dt1;
  //   } else {
  //     dt = this.dt2;
  //   }

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
    if (!tableId) {
      console.error('Table ID is missing');
      return;
    }

    let dt1 = this.dt1;
    let dt2 = this.dt2;

    if (!dt1 && !dt2) {
      console.error('No data found to export for', tableId);
      return;
    }

    const workbookData = [];

    // Sheet 1: dt1 (if exists)
    if (dt1?.columns && dt1?.dataList) {
      workbookData.push(
        buildSheetData({
          sheetName: 'Payments', // You can change to `Payments`, `Summary`, etc.
          columns: dt1.columns,
          dataList: dt1.dataList,
          translateService: this.translateService,
          excludedFields: ['Action'],
        })
      );
    }

    // Sheet 2: dt2 (if exists)
    if (dt2?.columns && dt2?.dataList) {
      // Optional: remove `month` from each row
      const cleanedDataList = dt2.dataList.map(({ month, ...rest }) => rest);

      workbookData.push(
        buildSheetData({
          sheetName: 'Transactions', // Change this name if needed
          columns: dt2.columns,
          dataList: cleanedDataList,
          translateService: this.translateService,
          excludedFields: ['Action', 'month'],
        })
      );
    }

    if (workbookData.length === 0) {
      this.toasterService.showToaster({
        severity: 'error',
        detail: 'No Data to Export',
      });
      return;
    }
    this.printSer.export('xlsx', tableId, workbookData);
  }

  onPrint() {
    if (this.tableId === 'Payments') {
      printTable(
        this.paymentColumnDefs,
        this.paymentDataList,
        this.translateService,
        'portrait'
      );
    } else {
      printTable(
        this.transactionsColumnDef,
        this.transactionDataList,
        this.translateService,
        'portrait'
      );
    }
  }

  onTabChange(event) {
    if (event.index == 0) {
      this.tableId = 'Payments';
    } else {
      this.tableId = 'Transactions';
    }
  }
}
