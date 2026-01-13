import { Component } from '@angular/core';
import { BaseStandardQuoteClass } from '../../base-standard-quote.class';
import { ActivatedRoute } from '@angular/router';
import { CommonService, ToasterService } from 'auro-ui';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { StandardQuoteService } from '../../services/standard-quote.service';

@Component({
  selector: 'app-document-esign-details',
  templateUrl: './document-esign-details.component.html',
  styleUrl: './document-esign-details.component.scss'
})
export class DocumentEsignDetailsComponent extends BaseStandardQuoteClass {

  
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

    eSignDetailsColumns: any = [
    
    {
      field: "name",
      headerName: "Party",
      columnHeaderClass: "font-bold",

    },
    {
      field: "email",
      headerName: "Email Address",
      columnHeaderClass: "font-bold",

    },
    {
      field: "signingStatus",
      headerName: "Signing Status",
      columnHeaderClass: "font-bold",

    }
  ]
    
    override async ngOnInit(): Promise<void> {
      await super.ngOnInit();
      }

      
    onCellClick(event: any) {
      console.log(event, "Cell Clicked");
    }

    onCellValueChange(event: any) {
      console.log(event, "Cell Value Changed");
    }
}
