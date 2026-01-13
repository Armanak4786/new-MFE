import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
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
import { map, Subscription } from "rxjs";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { CalculationService } from "../payment-summary/calculation.service";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { Contract } from "../../../asset/asset.component";
import { ValidationService } from "auro-ui";
import { DocumentHistoryComponent } from "../document-history/document-history.component";
import { DocumentEsignDetailsComponent } from "../document-esign-details/document-esign-details.component";

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

    this.baseSvc.formDataCacheableRoute([
      "WorkFlows/get_config_matrix_datset?MatrixName=DO Portal Documents Dataset",
    ]);

    this.baseSvc.getFormData(
      `WorkFlows/get_config_matrix_datset?MatrixName=DO Portal Documents Dataset`
    );
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

  // init() {
  //   this.svc.data.get(`DocumentServices/documents?PageNo=1&PageSize=100&Category=CreditAdvices&ContractId=${this.baseFormData?.contractId}`).pipe(
  //         map((res) => {
  //           this.generatedDocuments = res;
  //         })
  //       )
  //       .toPromise();
  // }

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
override async ngOnInit(): Promise<void> {
  let params: any = this.route.snapshot.params;
  this.id = params.id;

  await super.ngOnInit();

  this.documentMatrixData = await this.baseSvc.getFormData(
    `WorkFlows/get_config_matrix_datset?MatrixName=DO Portal Documents Dataset`
  );

  

  if (this.baseFormData) {
    this.baseFormData?.documentsData?.forEach((ele) => {
      const obj = new DocumentData();
      this.documents.push({
        dateLoaded: new Date(ele?.loaded),
        ...obj,
        ...ele,
      });
    });

    // this.generatedDocuments = [
    //   {name: 'Credit Advice', loaded: '2025-10-17T00:25:51', history: 'Pending', eSignDetails: 'Pending', checked: false},
    //   {name: 'Credit Advice', loaded: '2025-10-17T00:25:52', history: 'Pending', eSignDetails: 'Pending', checked: false},
    //   {name: 'Credit Advice', loaded: '2025-10-17T00:25:53', history: 'Pending', eSignDetails: 'Pending', checked: false},
    //   {name: 'Disclosure Statement', loaded: '2024-09-10T10:32:00', history: 'Pending', eSignDetails: 'Sent', checked: true},
    //   {name: 'Direct Debit Authority', loaded: '2024-09-10T10:35:00', history: 'Generated', eSignDetails: 'Completed', checked: true},
    // ]

    // this.processGeneratedDocuments(this.generatedDocuments);
    // this.generatedDocuments = this.displayDocuments;
    // console.log('Processed Generated Documents:', this.generatedDocuments);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // if (this.baseFormData?.generatedDocuments) {

    //   console.log('Document Matrix Data:', this.documentMatrixData?.data, this.baseFormData?.generatedDocuments, this.baseFormData?.workFlowStatus, this.baseFormData);
      
    //   this.processGeneratedDocuments(this.baseFormData.generatedDocuments);  //To process duplicate documents
    //   this.generatedDocuments = this.displayDocuments;
    // }

    this.matrixApiCombinedDetail = this.combineMatrixAndGeneratedDocuments();

    let filterDocumentByStatus = this.matrixApiCombinedDetail.filter(doc => {
      return doc.applicationWorkflowState === this.baseFormData?.workFlowStatus;
    });

    this.generatedDocuments = filterDocumentByStatus;
    console.log('Final Generated Documents to Display:', this.generatedDocuments);
    
  }
}

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
}
