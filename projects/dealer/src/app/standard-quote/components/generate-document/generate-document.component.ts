import { ChangeDetectorRef, Component, Input, ViewChild } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import {
  AuthenticationService,
  CommonService,
  DataService,
  StatusProgressList,
  ToasterService,
} from "auro-ui";
import { cloneDeep } from "lodash";
import { map, Subscription, takeUntil } from "rxjs";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { CalculationService } from "../payment-summary/calculation.service";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { Contract } from "../../../asset/asset.component";
import { ValidationService } from "auro-ui";
import { DocumentHistoryComponent } from "../document-history/document-history.component";
import { DocumentEsignDetailsComponent } from "../document-esign-details/document-esign-details.component";
import { Table } from "primeng/table";


type FileTypeMapping = {
  type: string;
  fileType: string;
  image?: string;
};

class DocumentData {
  documentId: number;
  name: string;
  previewBtn?: string = "";
  downloadBtn?: string = "";
  deleteBtn?: string = "";
  fileData?: any;
  checked?: boolean = true;
  category?: string = "Asset Information";
  description?: string = null;
  type?: string = "pdf";
  loaded?: string = "2024-09-08T17:19:49.337";
  dateLoaded?: Date = new Date(this.loaded);
  loadedBy?: string = "";
  source?: string = "Uploaded";
  isDocumentDeleted?: boolean = false;
  documentProvider?: string = "All";
  securityClassification?: string = "Restricted to Internal Users";
  reference?: string = "2024\\0905\\2_TestDarshan.pdf";
  outputDt?: string = "1900-01-01T00:00:00";
  expiryDt?: string = "1900-01-01T00:00:00";
}

const fileTypeMappings: FileTypeMapping[] = [
  { type: "doc", fileType: "application/msword" },
  {
    type: "docx",
    fileType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  { type: "pdf", fileType: "application/pdf" },
  { type: "txt", fileType: "text/plain" },
  { type: "tif", fileType: "image/tiff" },
  { type: "tiff", fileType: "image/tiff" },
  { type: "csv", fileType: "text/csv" },
  { type: "xls", fileType: "application/vnd.ms-excel" },
  {
    type: "xlsx",
    fileType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  { type: "jpg", fileType: "image/jpeg" },
  { type: "jpeg", fileType: "image/jpeg" },
  { type: "png", fileType: "image/png" },
];


@Component({
  selector: "app-generate-document",
  templateUrl: "./generate-document.component.html",
  styleUrls: ["./generate-document.component.scss"],
})
export class GenerateDocumentComponent extends BaseStandardQuoteClass {
  uploadDocument: any;
  loanVariationId: any;
  formdata: any;
  steps: any;
  files = [];
  uploadedFiles = [];
  stepss = ["Additional Approval", "Uploade Documents", "Generate Documents"];

  activeSteps = 0;
  selectedDocType: string;

  columns: any = [
    {
      field: "name",
      width: "3rem",
      headerName: "",
    },
    {
      field: "previewBtn",
      headerName: "",
      format: '<i class="fa-regular fa-eye text-base text-blue-500"></i>',
      // minWidth: '3rem',
      // maxWidth: '3rem',
      // width: '3rem',
      action: "previewDoc",
    },
    {
      field: "downloadBtn",
      headerName: "",
      format:
        '<i class="fa-regular fa-arrow-down-to-square text-base text-blue-500"></i>',
      // minWidth: '3rem',
      // maxWidth: '3rem',
      // width: '3rem',
      action: "downloadDoc",
    },
    {
      field: "deleteBtn",
      headerName: "",
      format: '<i class="fa-regular fa-trash-can text-base text-red-500"></i>',
      // minWidth: '3rem',
      // maxWidth: '3rem',
      // width: '3rem',
      action: "removeDoc",
    },
  ];

  generatedDocsColumns: any = [
    {
      field: "checkbox",
      // headerName: "Check",
      // format: "#checkbox",
      class: "justify-center pl-2",

      // width: "3rem",
    },
    {
      field: "name",
      headerName: "Documents",

    },
    {
      field: "loaded",
      headerName: "Date & Time",
      format:"#date",
      dateFormat: "dd/MM/yyyy | h:mm a",
    },
    {
      field : "history",
      // format: `<i class="fa-regular fa-clock-rotate-left text-blue-500 px-2"></i>`,
      format: (row) => {
        let html;
        if (row?.hasDuplicates) {
          html = `<i class="fa-regular fa-clock-rotate-left text-blue-500 px-2"></i>`;
        }else{
          html = ` <i class="fa-regular fa-hyphen text-blue-500 px-2"></i>`;
        }
        html += `</a>`;
        return html;
      },
    },
    {
      field: "eSignDetails",
      headerName: "E-sign Status",
       format: (row) => {
        let html = `<i class="far fa-eye text-base text-blue-500 ml-1"></i> <a class="cursor-pointer text-primary">View</a>`;
        // if (row.showInfoIcon || !row.isConfirmed) {
        //   html += ` <i class="fa-solid fa-exclamation-circle text-red-700"></i>`;
        // }
        // html += `</a>`;
        return html;
      },
    }
    

  ]
  documents: DocumentData[] = []; // for documents that are uploaded
  generatedDocuments: any = [];
  documentMatrixData: any;

  imageTypes = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "application/pdf": "pdf",
  };

  imagePaths = {
    jpg: "assets/images/documentsType/JPG.svg",
    png: "assets/images/documentsType/PNG.svg",
    docx: "assets/images/documentsType/DOC.svg",
    pdf: "assets/images/documentsType/PDF.svg",
  };

  //preview
  previewDocPopUp: boolean = false;
  displayDoc?: string;
  displayDocType: any = null;
  currentIndex: number = -1;

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: StandardQuoteService,
    private toasterService: ToasterService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    public authSvc: AuthenticationService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService
  ) {
    super(route, svc, baseSvc);

    // this.baseSvc.formDataCacheableRoute([
    //   "WorkFlows/get_config_matrix_datset?MatrixName=DO Portal Documents Dataset",
    // ]);

    // this.baseSvc.getFormData(
    //   `WorkFlows/get_config_matrix_datset?MatrixName=DO Portal Documents Dataset`
    // );

    // this.baseSvc.formDataCacheableRoute([
    //   "WorkFlows/get_static_config_matrix",
    // ]);

    // this.baseSvc.getFormData(
    //   `WorkFlows/get_static_config_matrix`
    // );
  }
  responsedData: any;



  // override async ngOnInit(): Promise<void> {
  //   let params: any = this.route.snapshot.params;
  //   this.id = params.id;

  //   await super.ngOnInit();

  //   // this.generatedDocuments = [
  //   //   {name: 'Credit Agreement', loaded: '2025-10-17T00:25:50', status: 'Pending', eSignDetails: 'Pending', checked: false},
  //   //   {name: 'Disclosure Statement', loaded: '2024-09-10T10:32:00', status: 'Pending', eSignDetails: 'Sent', checked: true},
  //   //   {name: 'Direct Debit Authority', loaded: '2024-09-10T10:35:00', status: 'Generated', eSignDetails: 'Completed', checked: true},
  //   // ]

  //   // this.init();

  //   // if (this.accessGranted?.['preview_document']) {
  //   //   this.columns.push({
  //   //     field: 'previewBtn',
  //   //     headerName: '',
  //   //     format: '<i class="fa-regular fa-eye text-base text-blue-500"></i>',
  //   //     minWidth: '3rem',
  //   //     maxWidth: '3rem',
  //   //     width: '3rem',
  //   //   })
  //   // };

  //   // if (this.accessGranted?.['download_document']) {
  //   //   this.columns.push({
  //   //     field: 'downloadBtn',
  //   //     headerName: '',
  //   //     format:
  //   //       '<i class="fa-regular fa-arrow-down-to-square text-base text-blue-500"></i>',
  //   //     minWidth: '3rem',
  //   //     maxWidth: '3rem',
  //   //     width: '3rem',
  //   //   });
  //   // };
  //   // if (this.accessGranted?.['delete_document']) {
  //   //   this.columns.push({
  //   //     field: 'deleteBtn',
  //   //     headerName: '',
  //   //     format: '<i class="fa-regular fa-trash-can text-base text-red-500"></i>',
  //   //     minWidth: '3rem',
  //   //     maxWidth: '3rem',
  //   //     width: '3rem',
  //   //     action: 'removeDoc',
  //   //   });
  //   // };

  //   if (this.baseFormData) {
  //     this.baseFormData?.documentsData?.forEach((ele) => {
  //       const obj = new DocumentData();
  //       this.documents.push({
  //         dateLoaded: new Date(ele?.loaded),
  //         ...obj,
  //         ...ele,
  //       });
  //     });

  //     this.baseFormData?.generatedDocuments?.forEach((ele) => {
  //       this.generatedDocuments.push({
  //         checked: false,
  //         ...ele,
  //       });
  //     });
  //   }

  //   await this.updateValidation("onInit");
  // }

  async init() {
    const response = await this.svc.data.get(
      `DocumentServices/documents?PageNo=1&PageSize=100&Category=CreditAdvices&ContractId=${this.baseFormData?.contractId}`
    ).toPromise();
    
    // Extract items array and filter only documents with source === "Generated"
    if (response?.items && Array.isArray(response.items)) {
      this.generatedDocuments = response.items.filter(
        (doc) => doc.source === "Generated"
      );
    } else {
      this.generatedDocuments = [];
    }
    
    console.log(this.generatedDocuments, "Generated Documents (filtered by source: Generated)");
  }

  // Add these properties
duplicateDocumentsMap: Map<string, any[]> = new Map();
displayDocuments: any[] = [];
 matrixApiCombinedDetail: any[] = [];

// Updated processing method
processGeneratedDocuments(documents: any[]): void {
  const nameMap = new Map();
  const duplicatesMap = new Map();
  
  // First pass: group by name and identify duplicates
  documents.forEach(doc => {
    const docName = doc.name;
    
    if (!nameMap.has(docName)) {
      nameMap.set(docName, []);
    }
    nameMap.get(docName).push(doc);
  });
  
  // Second pass: find latest and store duplicates
  nameMap.forEach((docs, name) => {
    if (docs.length > 1) {
      // Sort by loaded date descending and get the latest
      const sortedDocs = docs.sort((a, b) => 
        new Date(b.loaded).getTime() - new Date(a.loaded).getTime()
      );
      
      // Store all duplicates including the latest one
      duplicatesMap.set(name, sortedDocs);
      
      // The first one in sorted array is the latest
      this.displayDocuments.push({
        checked: false,
        ...sortedDocs[0],
        hasDuplicates: true,
        totalDuplicates: sortedDocs.length
      });
    } else {
      // No duplicates, just add the single document
      this.displayDocuments.push({
        checked: false,
        ...docs[0],
        hasDuplicates: false,
        totalDuplicates: 1
      });
    }
  });
  
  this.duplicateDocumentsMap = duplicatesMap;
}

// Update your ngOnInit
// override async ngOnInit(): Promise<void> {
//   let params: any = this.route.snapshot.params;
//   this.id = params.id;

//   await super.ngOnInit();

//   this.documentMatrixData = await this.baseSvc.getFormData(
//     `WorkFlows/get_config_matrix_datset?MatrixName=DO Portal Documents Dataset`
//   );

  

//   if (this.baseFormData) {
//     this.baseFormData?.documentsData?.forEach((ele) => {
//       const obj = new DocumentData();
//       this.documents.push({
//         dateLoaded: new Date(ele?.loaded),
//         ...obj,
//         ...ele,
//       });
//     });

//     // this.generatedDocuments = [
//     //   {name: 'Credit Advice', loaded: '2025-10-17T00:25:51', history: 'Pending', eSignDetails: 'Pending', checked: false},
//     //   {name: 'Credit Advice', loaded: '2025-10-17T00:25:52', history: 'Pending', eSignDetails: 'Pending', checked: false},
//     //   {name: 'Credit Advice', loaded: '2025-10-17T00:25:53', history: 'Pending', eSignDetails: 'Pending', checked: false},
//     //   {name: 'Disclosure Statement', loaded: '2024-09-10T10:32:00', history: 'Pending', eSignDetails: 'Sent', checked: true},
//     //   {name: 'Direct Debit Authority', loaded: '2024-09-10T10:35:00', history: 'Generated', eSignDetails: 'Completed', checked: true},
//     // ]

//     // this.processGeneratedDocuments(this.generatedDocuments);
//     // this.generatedDocuments = this.displayDocuments;
//     // console.log('Processed Generated Documents:', this.generatedDocuments);

//     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//     // if (this.baseFormData?.generatedDocuments) {

//     //   console.log('Document Matrix Data:', this.documentMatrixData?.data, this.baseFormData?.generatedDocuments, this.baseFormData?.workFlowStatus, this.baseFormData);
      
//     //   this.processGeneratedDocuments(this.baseFormData.generatedDocuments);  //To process duplicate documents
//     //   this.generatedDocuments = this.displayDocuments;
//     // }

//     this.matrixApiCombinedDetail = this.combineMatrixAndGeneratedDocuments();

//     let filterDocumentByStatus = this.matrixApiCombinedDetail.filter(doc => {
//       return doc.applicationWorkflowState === this.baseFormData?.workFlowStatus;
//     });

//     this.generatedDocuments = filterDocumentByStatus;
//     console.log('Final Generated Documents to Display:', this.generatedDocuments);
    
//   }
// }

private combineMatrixAndGeneratedDocuments(): any[] {
  const matrixApiCombinedDetail = [];

  // Process generated documents with matches
  if (this.baseFormData?.generatedDocuments) {
    this.baseFormData.generatedDocuments.forEach(generatedDoc => {
      let hasMatch = false;
      
      generatedDoc.generatedDocs?.forEach(doc => {
        const matchingMatrixRow = this.documentMatrixData?.data?.dataRowList?.find(matrixRow => 
          matrixRow.customFields['Doc Template Name'] === doc.documentTemplateName &&
          matrixRow.customFields['Doc Rule (DPR) Name'] === doc.documentRuleName
        );

        if (matchingMatrixRow) {
          hasMatch = true;
          matrixApiCombinedDetail.push({
            ...generatedDoc,
            matrixRowNo: matchingMatrixRow.rowNo,
            applicationWorkflowState: matchingMatrixRow.customFields['Application Workflow State'],
            portalDisplayName: matchingMatrixRow.customFields['Portal Display Name'],
            product: matchingMatrixRow.customFields['Product'],
            docTemplateName: matchingMatrixRow.customFields['Doc Template Name'],
            docRuleName: matchingMatrixRow.customFields['Doc Rule (DPR) Name'],
            alwaysRefresh: matchingMatrixRow.customFields['Always Refresh'],
            autoGenerated: matchingMatrixRow.customFields['Auto Generated'],
            viewLatest: matchingMatrixRow.customFields['View Latest'],
            signatureRequired: matchingMatrixRow.customFields['Signature Required'],
            documentPack: matchingMatrixRow.customFields['Document Pack'],
            additionalInfo: matchingMatrixRow.customFields['Additional Info'],
            isMatched: true
          });
        }
      });

      // Add unmatched generated documents
      if (!hasMatch && generatedDoc.generatedDocs?.length > 0) {
        generatedDoc.generatedDocs.forEach(doc => {
          matrixApiCombinedDetail.push({
            ...generatedDoc,
            isMatched: false
          });
        });
      }
    });
  }

  // Add matrix-only documents
  if (this.documentMatrixData?.data?.dataRowList) {
    this.documentMatrixData.data.dataRowList.forEach(matrixRow => {
      const hasMatch = matrixApiCombinedDetail.some(doc =>
        doc.docTemplateName === matrixRow.customFields['Doc Template Name'] &&
        doc.docRuleName === matrixRow.customFields['Doc Rule (DPR) Name']
      );

      if (!hasMatch) {
        matrixApiCombinedDetail.push({
          documentId: 0,
          name: matrixRow.customFields['Portal Display Name'] || '',
          category: 'Matrix Only',
          description: 'From matrix configuration',
          type: 'config',
          loaded: '',
          loadedBy: '',
          source: 'Matrix Configuration',
          isDocumentDeleted: false,
          documentProvider: '',
          securityClassification: '',
          reference: '',
          generatedDocs: [],
          outputDt: '',
          expiryDt: '',
          fileDetails: null,
          matrixRowNo: matrixRow.rowNo,
          applicationWorkflowState: matrixRow.customFields['Application Workflow State'],
          portalDisplayName: matrixRow.customFields['Portal Display Name'],
          product: matrixRow.customFields['Product'],
          docTemplateName: matrixRow.customFields['Doc Template Name'],
          docRuleName: matrixRow.customFields['Doc Rule (DPR) Name'],
          alwaysRefresh: matrixRow.customFields['Always Refresh'],
          autoGenerated: matrixRow.customFields['Auto Generated'],
          viewLatest: matrixRow.customFields['View Latest'],
          signatureRequired: matrixRow.customFields['Signature Required'],
          documentPack: matrixRow.customFields['Document Pack'],
          additionalInfo: matrixRow.customFields['Additional Info'],
          isMatched: false
        });
      }
    });
  }

  console.log('Combined Matrix API Details:', matrixApiCombinedDetail);
  return matrixApiCombinedDetail;
}

 onCellClick(event) {

    console.log('onCellClick', event, this.getDuplicatesForDocument(event.rowData.name));

    if(event?.colName == "history" && event.rowData?.hasDuplicates) {
      const duplicates = this.getDuplicatesForDocument(event.rowData.name);
      
      this.svc.dialogSvc
            .show(
              DocumentHistoryComponent,
              "Credit Advice",
              {
                templates: {
                  footer: null,
                },
                data: {
                  duplicateDocuments: duplicates,
                },
                width: "50vw",
              }
            )
            .onClose.subscribe((res: any) => {
              console.log(res, "closed");
            });
    }


    if(event?.colName == "eSignDetails") {
      
      this.svc.dialogSvc
            .show(
              DocumentEsignDetailsComponent,
              "e-Signature Details",
              {
                templates: {
                  footer: null,
                },
                data: {
                eSignDetails: [],
                },
                width: "50vw",
              }
            )
            .onClose.subscribe((res: any) => {
              console.log(res, "closed");
            });
    }

    if (event.actionName == "removeDoc" && this.baseSvc?.accessMode != "view") {
      this.removeDoc(event.index);
    }
    if (event.actionName == "previewDoc") {
      this.onPreviewDoc(event.index);
    }
    if (event.actionName == "downloadDoc") {
      this.onDownloadDoc(event.index);
    }
  }

// Method to get duplicates for display
getDuplicatesForDocument(documentName: string): any[] {
  return this.duplicateDocumentsMap.get(documentName) || [];
}

  onCheckboxChange(name, index: any) {
    this.currentIndex = index;
  }
updateCustRole(event: any): void {
  
  
}

  postdata: any;
  manageSelectedRow(activeStep) {
    // this.selectedRow = null;
    // }
  }
  // trialData = [];
  onUploaded(event) {
    event.uploadedFiles.forEach(async (file) => {
      const request = new FormData();
      // request.append('ContractId', this.id);
      request.append("files", file || "defaultFileURL");
      request.append(
        "loadedBy",
        this.authSvc.oidcUser?.given_name +
          " " +
          this.authSvc.oidcUser?.family_name
      );
      request.append(
        "dc",
        JSON.stringify({
          name: file?.name || "defaultName",
          category: "Asset Information",
        })
      );

      let respon = await this.svc.data
        .post(
          `DocumentServices/documents?ContractId=${this.baseFormData?.contractId}&PageNo=1&PageSize=100`,
          request
        )
        .pipe(
          map((res) => {
            this.postdata = res;
          })
        )
        .toPromise();

      if (this.postdata) {
        let maxDocumentId = 1;
        if (this.documents.length > 0) {
          Math.max(...this.documents.map((doc) => doc.documentId));
        }

        let fileDetailsValue;
        this.convertFileToBase64(file).then((base64Content) => {
          fileDetailsValue = [
            {
              fileContents: base64Content,
              contentType: file.type,
              fileDownloadName: file.name,
            },
          ];

          this.documents.push({
            name: file.name,
            fileData: fileDetailsValue,
            documentId: maxDocumentId,
            type: this.imageTypes[file.type],
            dateLoaded: new Date(),
          });
          this.cd.detectChanges();

          this.baseSvc.setBaseDealerFormData({ documentsData: this.documents });
        });
      }
    });

    this.cd.detectChanges();
  }

  readFile(file) {
    const reader = new FileReader();
    var fileText;
    reader.addEventListener(
      "load",
      (loadFile) => {
        this.displayDoc = reader.result as string;
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
    return fileText;
  }

  onPreviewFile(dataIndex, type?: any) {
    // for Generated
    if (this.generatedDocuments?.[0]) {
      let displayDoc = this.generatedDocuments?.[0].fileDetails[0].fileContents;
      const pdfBlob = this.base64ToBlob(displayDoc, "application/pdf");
      let fileText = this.readFile(pdfBlob);
    }
  }

 

  // onCellValueChange(event, rowIndex) {
  //   console.log("onCellValueChange", event, rowIndex);
  // }

  onPreviewDoc(index) {
    if (this.documents?.[index]?.fileData) {
      let file = this.documents?.[index]?.fileData;
      const fileDetails = file?.[0].fileContents;

      // const fileName = formGroup?.get('name')?.value || 'document.pdf';

      const blob = this.base64ToBlob(fileDetails, file?.[0].contentType);

      if (!blob) {
        return;
      }

      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, "_blank");
    }
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result?.toString().split(",")[1];
        resolve(base64String || "");
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  base64ToBlob(base64: string, contentType = "", sliceSize = 512) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  getSanitizedUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onDownloadDoc(index) {
    if (this.documents?.[index]?.fileData) {
      let file = this.documents?.[index]?.fileData;

      const fileDetails = file?.[0].fileContents;
      const fileName = file?.[0].fileDownloadName;
      const blob = this.base64ToBlob(fileDetails, file?.[0].contentType);

      if (!blob) {
        return;
      }
      const fileURL = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = fileURL;
      downloadLink.download = fileName;
      downloadLink.style.display = "none";

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  }

  removeDoc(index) {
    this.documents.splice(index, 1);
    this.baseSvc.setBaseDealerFormData({ documentsData: this.documents });
  }
  //   fetch(fileUrl)
  //     .then((response) => response.blob())
  //     .then((blob) => {
  //       const url = window.URL.createObjectURL(blob);
  //       const iframe = document.createElement('iframe');
  //       iframe.style.display = 'none';
  //       iframe.src = url;
  //       document.body.appendChild(iframe);
  //       iframe.onload = () => {
  //         iframe.contentWindow?.focus();
  //         iframe.contentWindow?.print();
  //         this.monitorPrintDialog(iframe, url);
  //       };
  //     })
  //     .catch((error) => console.error('Print failed:', error));
  // }

  // private monitorPrintDialog(iframe: HTMLIFrameElement, url: string): void {
  //   const interval = setInterval(() => {
  //     if (iframe.contentWindow?.closed) {
  //       clearInterval(interval);
  //       document.body.removeChild(iframe);
  //       window.URL.revokeObjectURL(url);
  //     }
  //   }, 500);
  // }

  // getSanitizedUrl(url: string): SafeUrl {
  //   return this.sanitizer.bypassSecurityTrustUrl(url);
  // }

  // getSanitizedResourceUrl(url: string): SafeUrl {
  //   return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  // }
  // Dead Code ends

  pageCode: string = "GenerateDocumentComponent";
  modelName: string = "GenerateDocumentComponent";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();
  }

  override async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  override async onValueEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  async updateValidation(event) {
    const req = {
      form: this.mainForm?.form,
      formConfig: this.formConfig,
      event: event,
      modelName: this.modelName,
      pageCode: this.pageCode,
    };

    var responses: any = await this.validationSvc.updateValidation(req);
    if (responses.formConfig && !responses.status) {
      this.formConfig = { ...responses.formConfig };

      this.cd.detectChanges();
    }
  }

  override async onStepChange(quotesDetails: any): Promise<void> {
    if (quotesDetails.type !== "tabNav") {
      var result: any = await this.updateValidation("onSubmit");
      if (!result?.status) {
        // this.toasterSvc.showToaster({
        //   severity: 'error',
        //   detail: 'I7',
        // });
      }
    }
  }


  @ViewChild('dt') dt: Table;

  @Input() documentsData: any[] = [];

  selectAll: boolean = false;
  selectedDocuments: any[] = [];

  override async ngOnInit(): Promise<void>{

    this.baseSvc.getBaseDealerFormData().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.baseFormData = data;
      console.log(this.baseFormData);
      
    });

  this.documentMatrixData = [];
  // await this.baseSvc.getFormData(
  //   `WorkFlows/get_static_config_matrix`
  // );

  await this.init();

  
  console.log(this.baseFormData, this.documentMatrixData, "Generate DOcs Implementation");
    // Process the data to handle parent-child relationships
    // this.documentsData = [
    //   ...DUMMY_DOCUMENTS_DATA,
    //   ...LOAN_CHILD_DOCUMENTS
    // ];
    this.documentsData =await this.filterDocumentMatrix();

    console.log(this.documentsData, "SUbhashishsss");
    
    this.organizeDocumentsData();

    console.log(this.documentsData, "After organizing data");
    
  }

filterDocumentMatrix() {
  if (!this.documentMatrixData || !this.documentMatrixData?.data?.dataRowList) {
    return [];
  }

  const workflowStatus = this.baseFormData?.AFworkflowStatus;
  const productCode = this.baseFormData?.product?.productCode;
  const generatedDocuments = this.generatedDocuments || this.baseFormData?.generatedDocuments || [];

  if (!workflowStatus || !productCode) {
    console.warn('Missing workflow status or product code for filtering');
    return [];
  }

  // Helper function to clean and split product codes
  const cleanAndSplitProductCodes = (productCodesString) => {
    if (!productCodesString) return [];
    
    // Remove newlines, trim spaces, and split by comma
    return productCodesString
      .replace(/\n/g, ',')  // Replace newlines with commas
      .split(',')          // Split by comma
      .map(code => code.trim())  // Trim whitespace from each code
      .filter(code => code.length > 0);  // Remove empty strings
  };

  // Helper function to normalize string for comparison (trim and collapse multiple spaces)
  const normalizeString = (str: string) => {
    if (!str) return '';
    return str.trim().replace(/\s+/g, ' ');
  };

  // Helper function to find matching generated document by documentRuleName
  // Returns the LATEST document (by loaded date) when multiple documents have the same documentRuleName
  const findMatchingGeneratedDocument = (dprName: string) => {
    if (!dprName) return null;

    const normalizedDprName = normalizeString(dprName);

    // Find ALL matching documents
    const matchingDocs = generatedDocuments.filter(generatedDoc => {
      const matchingGeneratedDocItem = generatedDoc.generatedDocs?.find(
        (doc) => normalizeString(doc.documentRuleName) === normalizedDprName
      );
      return matchingGeneratedDocItem !== undefined;
    });

    if (matchingDocs.length === 0) {
      return null;
    }

    // Sort by loaded date descending (newest first) and return the latest one
    const sortedDocs = matchingDocs.sort((a, b) => {
      const dateA = new Date(a.loaded).getTime();
      const dateB = new Date(b.loaded).getTime();
      return dateB - dateA; // Descending order (newest first)
    });

    return sortedDocs[0]; // Return the latest document
  };

  // Filter the data by workflowStatus and productCode (dprName matching handled in map step)
  const filteredMatrixItems = this.documentMatrixData?.data?.dataRowList.filter(item => {
    const customFields = item.customFields;
    
    // Condition 1: Check if workflow state matches (STRICT)
    const workflowMatch = customFields["Application Workflow State"] === workflowStatus;
    if (!workflowMatch) return false;
    
    // Condition 2: Check product code match
    const matrixProductCode = customFields["Product (Code)"];
    
    // If matrix product code is null, undefined, or empty - it's applicable for ALL products
    if (!matrixProductCode || matrixProductCode.trim() === '') {
      return true; // Product is valid (applicable for all)
    }
    
    // Clean and split the product codes from matrix
    const matrixProductCodes = cleanAndSplitProductCodes(matrixProductCode);
    const productMatch = matrixProductCodes.includes(productCode);
    
    return productMatch;
  });

  // Map filtered items and combine with matching generatedDocuments if dprName matches
  const combinedResults = filteredMatrixItems.map(item => {
    const customFields = item.customFields;
    const dprName = customFields["Doc Rule (DPR) Name (UDC Required DPR Name)"];
    
    // Try to find matching generated document by dprName
    const matchingGeneratedDoc = findMatchingGeneratedDocument(dprName);
    
    if (matchingGeneratedDoc) {
      // dprName matched - Combine both objects: matrix customFields + generatedDocument properties
      return {
        ...customFields,
        documentId: matchingGeneratedDoc.documentId,
        name: matchingGeneratedDoc.name,
        category: matchingGeneratedDoc.category,
        description: matchingGeneratedDoc.description,
        type: matchingGeneratedDoc.type,
        loaded: matchingGeneratedDoc.loaded,
        loadedBy: matchingGeneratedDoc.loadedBy,
        source: matchingGeneratedDoc.source,
        isDocumentDeleted: matchingGeneratedDoc.isDocumentDeleted,
        documentProvider: matchingGeneratedDoc.documentProvider,
        securityClassification: matchingGeneratedDoc.securityClassification,
        reference: matchingGeneratedDoc.reference,
        generatedDocs: matchingGeneratedDoc.generatedDocs,
        outputDt: matchingGeneratedDoc.outputDt,
        expiryDt: matchingGeneratedDoc.expiryDt,
        fileDetails: matchingGeneratedDoc.fileDetails,
        isMatched: true,
        eSignStatus : matchingGeneratedDoc.eSignStatus,
      };
    } else {
      // dprName not matched - Return matrix data only (workflowStatus & productCode are valid)
      return {
        ...customFields,
        isMatched: false
      };
    }
  });

  return combinedResults;
}

  /**
   * Organize documents into parent-child structure
   * Assumes documents with Portal Display Name (Child) belong to their parent
   */
  organizeDocumentsData() {
    // Group documents by parent name
    const parentMap = new Map();
    const standaloneDocs = [];
    
    this.documentsData.forEach(doc => {
      // Check if this is a child document
      if (doc['Portal Display Name (Parent)'] && doc['Portal Display Name (Child)']) {
        const parentName = doc['Portal Display Name (Parent)'];
        
        if (!parentMap.has(parentName)) {
          // Create parent document structure
          parentMap.set(parentName, {
            documentId: `parent_${parentName}`,
            name: parentName,
            'Portal Display Name (Parent)': parentName,
            'Portal Display Name (Child)': null,
            selected: false,
            isParent: true,
            children: []
          });
        }
        
        // Add as child
        doc.selected = false;
        parentMap.get(parentName).children.push(doc);
      } else {
        // Standalone document
        doc.selected = false;
        doc.isParent = false;
        standaloneDocs.push(doc);
      }
    });
    
    // Combine parent documents with their children and standalone docs
    const organizedData = [];
    
    // Add parent documents
    parentMap.forEach(parent => {
      organizedData.push(parent);
    });
    
    // Add standalone documents
    organizedData.push(...standaloneDocs);
    
    this.documentsData = organizedData;
  }
  
  /**
   * Check if document has child documents
   */
  hasChildDocuments(rowData: any): boolean {
    return rowData.children && rowData.children.length > 0;
  }
  
  /**
   * Get child documents for a parent
   */
  getChildDocuments(rowData: any): any[] {
    return rowData.children || [];
  }
  
  /**
   * Get display name for document
   */
  getDocumentDisplayName(rowData: any): string {
    if (rowData['Portal Display Name (Parent)'] && !rowData['Portal Display Name (Child)']) {
      return rowData['Portal Display Name (Parent)'];
    }
    else if (!rowData['Portal Display Name (Parent)'] && rowData['Portal Display Name (Child)']) {
      return rowData['Portal Display Name (Child)'];
    }
    return 'Unnamed Document';
  }
  
  /**
   * Get display name for child document
   */
  getChildDocumentDisplayName(childDoc: any): string {
    return childDoc['Portal Display Name (Child)'] || childDoc.name || 'Unnamed Document';
  }
  
  /**
   * Format date time for display
   */
  formatDateTime(dateTimeString: string): string {
    if (!dateTimeString) return '-';
    
    try {
      const date = new Date(dateTimeString);
      // return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      // Format date as DD/MM/YYYY
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      
      // Format time as h:mm AM/PM
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      const formattedTime = `${hour12}:${minutes} ${ampm}`;
      
      return `${formattedDate} | ${formattedTime}`;
    } catch {
      return dateTimeString;
    }
  }
  
  /**
   * Check if document has duplicates based on DPR Name
   */
  hasDuplicateDocuments(rowData: any): boolean {
    // Logic to check for duplicates based on Doc Rule (DPR) Name
    // This assumes you have access to all documents for comparison
    const dprName = rowData['Doc Rule (DPR) Name (UDC Required DPR Name)'];
    
    if (!dprName) return false;
    
    // Count occurrences of this DPR name
    const count = this.documentsData.filter(doc => 
      doc['Doc Rule (DPR) Name (UDC Required DPR Name)'] === dprName
    ).length;
    
    return count > 1;
  }
  
  /**
   * Toggle select all checkboxes
   */
  toggleSelectAll(event: any) {
    const checked = event.checked;
    this.selectAll = checked;
    
    this.documentsData.forEach(doc => {
      if (!this.shouldDisableCheckbox(doc)) {
        doc.selected = checked;
        
        // Also select/deselect children if this is a parent
        if (this.hasChildDocuments(doc)) {
          doc.children.forEach(child => {
            if (!this.shouldDisableCheckbox(child)) {
              child.selected = checked;
            }
          });
        }
      }
    });
    
    this.updateSelectedDocuments();
  }
  
  /**
   * Handle individual row selection
   */
  onRowSelect(rowData: any, event: any) {
    rowData.selected = event.checked;
    
    // If this is a parent, select/deselect all children
    if (rowData.isParent && this.hasChildDocuments(rowData)) {
      rowData.children.forEach(child => {
        if (!this.shouldDisableCheckbox(child)) {
          child.selected = event.checked;
        }
      });
    }
    
    // If this is a child, update parent selection state
    if (!rowData.isParent) {
      this.updateParentSelectionState(rowData);
    }
    
    this.updateSelectedDocuments();
    this.updateSelectAllState();
  }
  
  /**
   * Update parent selection state based on children
   */
  updateParentSelectionState(childDoc: any) {
    // Find the parent of this child
    const parent = this.documentsData.find(doc => 
      doc.isParent && doc.children?.some(child => child.documentId === childDoc.documentId)
    );
    
    if (parent) {
      const allChildrenSelected = parent.children.every(child => 
        this.shouldDisableCheckbox(child) || child.selected
      );
      const anyChildSelected = parent.children.some(child => 
        !this.shouldDisableCheckbox(child) && child.selected
      );
      
      parent.selected = allChildrenSelected ? true : anyChildSelected ? null : false;
    }
  }
  
  /**
   * Update the select all checkbox state
   */
  updateSelectAllState() {
    const selectableDocs = this.documentsData.filter(doc => !this.shouldDisableCheckbox(doc));
    
    if (selectableDocs.length === 0) {
      this.selectAll = false;
      return;
    }
    
    const allSelected = selectableDocs.every(doc => doc.selected === true);
    const anySelected = selectableDocs.some(doc => doc.selected === true);
    
    this.selectAll = allSelected ? true : anySelected ? null : false;
  }
  
  /**
   * Update the selected documents array
   */
  updateSelectedDocuments() {
    this.selectedDocuments = [];
    
    this.documentsData.forEach(doc => {
      if (doc.selected) {
        this.selectedDocuments.push(doc);
      }
      
      if (this.hasChildDocuments(doc)) {
        doc.children.forEach(child => {
          if (child.selected) {
            this.selectedDocuments.push(child);
          }
        });
      }
    });
  }
  
  /**
   * Check if checkbox should be disabled for a document
   */
  shouldDisableCheckbox(rowData: any): boolean {
    // Add your logic here for when checkboxes should be disabled
    // For example: if document is deleted, expired, etc.
    return false;
    // return rowData.isDocumentDeleted || 
    //        new Date(rowData.expiryDt) < new Date() ||
    //        rowData['Always Refresh'] === 'true';
  }
  
  /**
   * Check if select all should be disabled
   */
  isSelectAllDisabled(): boolean {
    // Disable select all if all documents are not selectable
    return this.documentsData.every(doc => this.shouldDisableCheckbox(doc));
  }
  
  /**
   * Show document history
   */
  showDocumentHistory(document: any) {
    console.log('Show history for:', document);
    // Implement your history viewing logic here
    // You might want to open a modal or navigate to a history page
  }
  
  /**
   * Show e-sign status
   */
  showEsignStatus(document: any) {
    console.log('Show e-sign status for:', document);

    this.svc.dialogSvc
            .show(
              DocumentEsignDetailsComponent,
              "e-Signature Details",
              {
                templates: {
                  footer: null,
                },
                data: {
                // eSignDetails: [],
                documentId: document.documentId,
                },
                width: "50vw",
              }
            )
            .onClose.subscribe((res: any) => {
              console.log(res, "closed");
            });
      
    // Implement your e-sign status viewing logic here
  }
}
