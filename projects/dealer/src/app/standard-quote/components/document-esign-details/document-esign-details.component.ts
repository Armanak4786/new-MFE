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


eSignDetails: any;

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
      field: "extName",
      headerName: "Party",
      columnHeaderClass: "font-bold",

    },
    {
      field: "businessEmail",
      headerName: "Email Address",
      columnHeaderClass: "font-bold",

    },
    {
      field: "eSignStatus",
      headerName: "Signing Status",
      columnHeaderClass: "font-bold",

    }
  ]
    
    override async ngOnInit(): Promise<void> {
      await super.ngOnInit();

      this.svc.data
      .post(
        `DocumentServices/eSignStatus?DocumentId=${this.config.data.documentId}`
      )
      .subscribe((res) => {
        const eSignSignatories = 
          res?.data?.generatedDocs?.[0]?.documentESignDetails?.[0]?.eSignSignatories || [];
        
        // Filter only valid signatories (those with actual party info and envelope)
        this.eSignDetails = eSignSignatories
          .filter((signatory: any) => signatory.party?.partyId > 0)
          .map((signatory: any) => ({
            extName: signatory.party?.extName || '',
            businessEmail: signatory.businessEmail || '',
            eSignStatus: signatory.eSignStatus || ''
          }));
        
        console.log(this.eSignDetails, "eSignDetails");
      });

      }

      
    onCellClick(event: any) {
      console.log(event, "Cell Clicked");
    }

    onCellValueChange(event: any) {
      console.log(event, "Cell Value Changed");
    }
}
