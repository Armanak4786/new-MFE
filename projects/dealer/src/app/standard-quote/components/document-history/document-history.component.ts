import { Component } from '@angular/core';
import { BaseStandardQuoteClass } from '../../base-standard-quote.class';
import { ActivatedRoute } from '@angular/router';
import { CommonService, ToasterService } from 'auro-ui';
import { StandardQuoteService } from '../../services/standard-quote.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-document-history',
  templateUrl: './document-history.component.html',
  styleUrl: './document-history.component.scss'
})
export class DocumentHistoryComponent extends BaseStandardQuoteClass {

  historyDocuments: any;
  constructor(
      public override route: ActivatedRoute,
      public override svc: CommonService,
      public override baseSvc: StandardQuoteService,
      public toasterSvc: ToasterService,
      public ref: DynamicDialogRef,
      public config: DynamicDialogConfig
    ) {
      super(route, svc, baseSvc);
    }

    documentHistoryColumns: any = [
    
    {
      field: "name",
      headerName: "Document",
      columnHeaderClass: "font-bold",

    },
    {
      field: "loaded",
      headerName: "Date & Time",
      format:"#date",
      dateFormat: "dd/MM/yyyy | h:mm a",
      columnHeaderClass: "font-bold",
    },
    {
      field : "preview",
      // format: `<i class="fa-regular fa-clock-rotate-left text-blue-500 px-2"></i>`,
      format: (row) => {
        let html = `<i class="far fa-eye text-base text-blue-500"></i> <a class="cursor-pointer text-blue-500">Preview</a> <i class="fa-light fa-pipe text-blue-500 pl-2"></i>`;
        return html;
      },
    },
    {
      field : "download",
      // format: `<i class="fa-regular fa-clock-rotate-left text-blue-500 px-2"></i>`,
      format: (row) => {
        let html = `<i class="fa-regular text-blue-500 fa-arrow-down-to-square"></i> <a class="cursor-pointer text-blue-500">Download</a> <i class="fa-light fa-pipe text-blue-500 pl-2"></i>`;
        return html;
      },
    },
    {
      field : "print",
      // format: `<i class="fa-regular fa-clock-rotate-left text-blue-500 px-2"></i>`,
      format: (row) => {
        let html = `<i class="fa-regular text-blue-500 fa-print"></i> <a class="cursor-pointer text-blue-500">Print</a>`;
        return html;
      },
    },
  

  ]

    override async ngOnInit(): Promise<void> {
    await super.ngOnInit();

    this.historyDocuments = this.config?.data?.duplicateDocuments;

    console.log(this.historyDocuments, this.config.data, "Document History Data")
    
    }

    onCellClick(event: any) {
      console.log(event, "Cell Clicked");
    }

    onCellValueChange(event: any) {
      console.log(event, "Cell Value Changed");
    }

}
