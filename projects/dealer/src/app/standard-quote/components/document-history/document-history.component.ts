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
      public config: DynamicDialogConfig,
      public toasterService: ToasterService
    ) {
      super(route, svc, baseSvc);
    }

    documentHistoryColumns: any = [
    
    {
      field: "Portal Display Name (Child)",
      headerName: "Document",
      columnHeaderClass: "justify-content-center",
      class: "table-data",

    },
    {
      field: "loaded",
      headerName: "Date & Time",
      format:"#date",
      dateFormat: "dd/MM/yyyy | h:mm a",
      columnHeaderClass: "justify-content-center",
      class: "table-data"
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

    async onCellClick(event: any) {
     // console.log(event, this.baseFormData, "Cell Clicked");

      if(event?.colName == "preview") {
        const contractId = this.baseFormData?.contractId;
        const documentId = event?.rowData?.documentId;

        if (!contractId) {
          this.toasterService.showToaster({
            severity: 'error',
            detail: 'Contract ID not found',
          });
          return;
        }

        if (!documentId) {
          this.toasterService.showToaster({
            severity: 'error',
            detail: 'Document ID not found',
          });
          return;
        }

        // Open new tab immediately
        const newWindow = window.open('', '_blank');
        if (!newWindow) {
          this.toasterService.showToaster({
            severity: 'error',
            detail: 'Please allow pop-ups for this website',
          });
          return;
        }

        try {
          // Call DownloadFile API
          const response: any = await this.svc.data.get(
            `DocumentServices/DownloadFile?ContractId=${contractId}&documentId=${documentId}`
          ).toPromise();

          if (response?.data?.fileDetails && response?.data?.fileDetails?.length > 0) {
            const fileDetail = response.data.fileDetails[0];
            const fileContents = fileDetail?.fileContents;
            const contentType = fileDetail?.contentType || 'application/pdf';

            if (fileContents) {
              const blob = this.base64ToBlob(fileContents, 'application/pdf');
              
              if (blob && newWindow && !newWindow.closed) {
                const fileURL = URL.createObjectURL(blob);
                
                // Write iframe into the new window to display PDF
                newWindow.document.write(`
                  <html>
                    <head>
                      <title>Document Preview</title>
                      <style>
                        body { margin: 0; padding: 0; }
                        iframe { border: none; width: 100%; height: 100vh; }
                      </style>
                    </head>
                    <body>
                      <iframe src="${fileURL}"></iframe>
                    </body>
                  </html>
                `);
                newWindow.document.close();
                
                // Clean up blob URL after a delay
                setTimeout(() => URL.revokeObjectURL(fileURL), 30000);
              }
            } else {
              newWindow.close();
              this.toasterService.showToaster({
                severity: 'error',
                detail: 'No file content received',
              });
            }
          } else {
            newWindow.close();
            this.toasterService.showToaster({
              severity: 'error',
              detail: 'Failed to download document',
            });
          }
        } catch (error) {
          newWindow.close();
          this.toasterService.showToaster({
            severity: 'error',
            detail: 'Failed to preview document',
          });
          console.error('Preview error:', error);
        }
      }

      if(event?.colName == "download") {
        const contractId = this.baseFormData?.contractId;
        const documentId = event?.rowData?.documentId;

        if (!contractId) {
          this.toasterService.showToaster({
            severity: 'error',
            detail: 'Contract ID not found',
          });
          return;
        }

        if (!documentId) {
          this.toasterService.showToaster({
            severity: 'error',
            detail: 'Document ID not found',
          });
          return;
        }

        try {
          // Call DownloadFile API
          const response: any = await this.svc.data.get(
            `DocumentServices/DownloadFile?ContractId=${contractId}&documentId=${documentId}`
          ).toPromise();

          if (response?.data?.fileDetails && response?.data?.fileDetails?.length > 0) {
            const fileDetail = response.data.fileDetails[0];
            const fileContents = fileDetail?.fileContents;
            const fileName = fileDetail?.fileDownloadName || 'document.pdf';

            if (fileContents) {
              const blob = this.base64ToBlob(fileContents, 'application/pdf');
              
              if (blob) {
                // Create download link
                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);
                link.href = url;
                link.download = fileName;
                
                // Trigger download
                document.body.appendChild(link);
                link.click();
                
                // Clean up
                document.body.removeChild(link);
                setTimeout(() => URL.revokeObjectURL(url), 100);
                
                this.toasterService.showToaster({
                  severity: 'success',
                  detail: 'Document downloaded successfully',
                });
              }
            } else {
              this.toasterService.showToaster({
                severity: 'error',
                detail: 'No file content received',
              });
            }
          } else {
            this.toasterService.showToaster({
              severity: 'error',
              detail: 'Failed to download document',
            });
          }
        } catch (error) {
          this.toasterService.showToaster({
            severity: 'error',
            detail: 'Failed to download document',
          });
          console.error('Download error:', error);
        }
      }
    }

    base64ToBlob(base64: string, contentType = "", sliceSize = 512) {
      const byteCharacters = atob(base64);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters?.length; offset += sliceSize) {
        const slice = byteCharacters?.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice?.length);
        for (let i = 0; i < slice?.length; i++) {
          byteNumbers[i] = slice?.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays?.push(byteArray);
      }

      return new Blob(byteArrays, { type: contentType });
    }

    onCellValueChange(event: any) {
      console.log(event, "Cell Value Changed");
    }

}
