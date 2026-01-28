import { ChangeDetectorRef, Component } from "@angular/core";
import { interval, Subscription  } from "rxjs";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import {
  AuthenticationService,
  CommonApiService,
  CommonService,
  environment,
  ToasterService,
} from "auro-ui";
import { map } from "rxjs";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { StandardQuoteService } from "../../services/standard-quote.service";
import configure from "../../../../../public/assets/configure.json";
import { NgZone } from "@angular/core";

class DocumentData {
  documentId: number;
  name: string;
  previewBtn?: string = "";
  downloadBtn?: string = "";
  deleteBtn?: string = "";
  fileData?: any;
  checked?: boolean = false;
  category?: string = "Other Correspondence";
  description?: string = null;
  type?: string = "";
  loaded?: any = "";
  dateLoaded?: Date = new Date(this.loaded);
  loadedBy?: string = "";
  source?: string = "Upload Documents";
  isDocumentDeleted?: boolean = false;
  documentProvider?: string = "";
  securityClassification?: string = "";
  reference?: string = "";
  outputDt?: string = "";
  expiryDt?: string = "";
}

@Component({
  selector: "app-upload-document",
  templateUrl: "./upload-document.component.html",
  styleUrls: ["./upload-document.component.scss"],
})
export class UploadDocumentComponent extends BaseStandardQuoteClass {
  uploadDocument: any;
  loanVariationId: any;
  formdata: any;
  files = [];
  uploadedFiles = [];
  uiUploadedDocs: any[] = [];
  private subscriptions = new Subscription();
  private processedFiles = new Set<string>();

  docsColumns: any = [
    {
      field: "checked",
      headerName: "",
      format: "#checkbox",
      class: "justify-center pl-2",
      width: "500px"
       
    },
    
    {
      field: "name",
      headerName: "Name",
      sortable: true,
      width: "700px"

    },
    
    // {
    //   field: "category",
    //   headerName: "Category",
    //   sortable: true,
    //   width: "500px"
    // },
    // {
    //   field: "type",
    //   headerName: "Type",
    //   sortable: true,
    //   width: "500px"
    // },
    {
      field: "loaded",
      headerName: "Loaded On",
      format:"#date",
      dateFormat: "dd/MM/yyyy",
      sortable: true,
      width: "500px"
    },
    {
      field: "loadedBy",
      headerName: "Loaded By",
      sortable: true,
      width: "500px"
     

    },
    {
      field: "source",
      headerName: "Source",
      sortable: true,
      width: "500px"
    }
    

  ]

  //activeSteps = 0;
  //selectedDocType: string;

  
  documents: DocumentData[] = []; // for documents that are uploaded

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
  acceptedFormat: any = ".pdf, .jpg, .png, .gif";
  maxFileSize: any = 20971520;

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: StandardQuoteService,
    private toasterService: ToasterService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    public authSvc: AuthenticationService,
    private zone: NgZone,
  ) {
    super(route, svc, baseSvc);
  }
  responsedData: any;
  override async ngOnInit(): Promise<void> {
    let params: any = this.route.snapshot.params;
    this.id = params.id;
    this.getConfigurationData();
    await super.ngOnInit();


    this.subscriptions.add(
      this.baseSvc.isDocumentData.subscribe((res) => {
        if (res && this.baseFormData?.documentsData) {
          this.documents = this.baseFormData.documentsData.map((ele) => ({
            ...new DocumentData(),
            ...ele,
            dateLoaded: new Date(ele?.loaded)
          }));
          this.cd.detectChanges();
        }
      })
    );
  }

isUploadDisabled() {
  if(configure?.workflowStatus?.view?.includes(this.baseFormData?.AFworkflowStatus)){
    return true;
  }
  return false;
}


  onCheckboxChange(name, index: any) {
    this.currentIndex = index;
  }

  postdata: any;
  
  
 async onUploaded(event) {
    const currentBatchFiles = new Set<string>();
    for (const file of event.uploadedFiles) {
      const fileIdentifier = `${file.name}_${file.size}_${file.lastModified}`;

      if (currentBatchFiles.has(fileIdentifier)) {
        continue;
      }
      if (this.processedFiles.has(fileIdentifier)) {
        continue;
      }

      currentBatchFiles.add(fileIdentifier);
      this.processedFiles.add(fileIdentifier);

      const request = new FormData();
      request.append("files", file || "defaultFileURL");
      request.append("loadedBy",this.authSvc.oidcUser || "defaultUser");
      request.append("dc", JSON.stringify({
        name: file?.name || "defaultName",
        category: "Other Correspondence",
      }));

      try {
        let respon: any = await this.svc.data
          .post(
            `DocumentServices/Documents?ContractId=${this.baseFormData?.contractId}&PageNo=1&PageSize=100`,
            request
          )
          .toPromise();

        if (respon?.data?.data) {
          this.documents.push(respon.data.data);
          const uiDoc = {
            ...respon.data.data,
            totalSize: file.size,
            uploadedSize: 0,
            progress: 0,
            isUploading: true
          };
          this.uiUploadedDocs.push(uiDoc);

          const newIndex = this.uiUploadedDocs.length - 1;
          this.simulateUploadProgress(file, newIndex);
        }
      } catch (error) {
        console.error('Upload failed:', error);
        this.processedFiles.delete(fileIdentifier);
      }
    }
    this.uploadedFiles = [];
    if (event.uploadedFiles) {
      event.uploadedFiles.length = 0;
    }

    this.cd.detectChanges();
    currentBatchFiles.forEach(id => this.processedFiles.delete(id));
  }

  
  onCellClick(event) {

    // Handle Checkbox Selection
    if (event.column === 'checked') {
       this.documents[event.index].checked = !this.documents[event.index].checked;
       return; 
    }
    if (event.actionName == "removeDoc" && this.baseSvc?.accessMode != "view") {
      this.removeDoc(event.index, event?.rowData?.documentId);
    }
    if (event.actionName == "previewDoc") {
      this.onPreviewDoc(event.index);
    }
    if (event.actionName == "downloadDoc") {
      this.onDownloadDoc(event.index);
    }
  }

  onPreviewDoc(index) {
    // for Uploaded

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

  async removeDoc(index, documentId) {
    documentId;
    
    await this.svc.data
      .delete(
        `DocumentServices/Documents?documentId=${documentId}&contractId=${this.baseFormData.contractId}`
        // ,request    /* commented for lib-shared changes not present */
      )
      .pipe(
        map((res: any) => {
          if (res?.data?.data) {
            this.documents.splice(index, 1);
            this.cd.detectChanges();
          }
        })
      )
      .toPromise();
    this.baseSvc.setBaseDealerFormData({ documentsData: this.documents });
    this.cd.detectChanges();
  }


  beforeUpload(event: any) {
  const file = event.files[0];

  // Max size: 20MB
  // if (file.size > this.maxFileSize) {
  //   alert("Maximum allowed size is 20MB.");
  //   if (event.preventDefault) event.preventDefault();
  //   return false;
  // }
  
  // Valid extensions/types
  // const allowedExtensions = ["jpg", "jpeg", "png", "gif", "pdf"];
  // const extension = file.name.split('.').pop()?.toLowerCase();
  // if (!extension || !allowedExtensions.includes(extension)) {
  //   alert("Invalid file type. Only jpg, jpeg, png, gif, or pdf are allowed.");
  //   if (event.preventDefault) event.preventDefault();
  //   return false;
  // }
  const allowedExtensionsRegex = /\.(jpg|jpeg|png|gif|pdf)$/i;
  
  if (!allowedExtensionsRegex.test(file.name)) {
    alert("Invalid file type. Only JPG, JPEG, PNG, GIF, and PDF are allowed.");
    if (event.preventDefault) event.preventDefault();
    return false;
  }

  return true; // Accept file
}


  getConfigurationData() {
    this.svc.data
      .getData("assets/api-json/tabsValidation.json")
      .subscribe((res) => {
        var file = res.data?.find((obj) => obj.modelPropertyName == "file");
        const { maxFileSize, acceptedFormat } = file || {};
        if (maxFileSize) this.maxFileSize = maxFileSize;
        if (acceptedFormat) this.acceptedFormat = acceptedFormat;
      });
  }

  convertFileSize(filsize: any): string {
    var bytes = parseFloat(filsize);
    if (bytes < 1024) {
      return `${bytes} B`; // Bytes
    } else if (bytes < 1048576) {
      return `${(bytes / 1024).toFixed(2)} KB`; // Kilobytes (KB)
    } else if (bytes < 1073741824) {
      return `${(bytes / 1048576).toFixed(2)} MB`; // Megabytes (MB)
    } else {
      return `${(bytes / 1073741824).toFixed(2)} GB`; // Gigabytes (GB)
    }
  }

// Simulate upload progress for UI while actual upload is happening.
// it stops when progress reaches 100 or when the doc.isUploading is set false.

uploadSubscriptions = new Map<number, Subscription>();
private readonly MAX_SIMULATED_UPLOADS = 2;
private activeSimulations = 0;
simulateUploadProgress(file: File, uiIndex: number) {
  const docRef = this.uiUploadedDocs[uiIndex];
  if (!docRef) { return; }

  // if already simulating too many, just mark as done
  if (this.activeSimulations >= this.MAX_SIMULATED_UPLOADS) {
    docRef.isUploading = false;
    docRef.uploadedSize = file.size || docRef.totalSize || 1;
    docRef.progress = 100;
    this.cd.markForCheck();
    return;
  }

  // clear any existing subscription for this index
  const existing = this.uploadSubscriptions.get(uiIndex);
  if (existing) {
    existing.unsubscribe();
    this.uploadSubscriptions.delete(uiIndex);
  }

  const total = file.size || docRef.totalSize || 1;

  // 10 ticks, 300ms each ≈ 3s
  const TICKS = 8;
  const INTERVAL_MS = 350;
  const step = Math.max(Math.floor(total / TICKS), 1024);
  let uploaded = 0;

  docRef.isUploading = true;
  docRef.uploadedSize = 0;
  docRef.progress = 0;
  this.cd.markForCheck();
  this.activeSimulations++;

  this.zone.runOutsideAngular(() => {
    const sub = interval(INTERVAL_MS).subscribe(() => {
      uploaded = Math.min(total, uploaded + step);
      const newProgress = Math.round((uploaded / total) * 100);

      this.zone.run(() => {
        const current = this.uiUploadedDocs[uiIndex];
        if (!current || !docRef.isUploading) {
          this.cleanupSimulation(uiIndex, docRef, total, sub);
          return;
        }

        if (newProgress !== docRef.progress) {
          docRef.uploadedSize = uploaded;
          docRef.progress = newProgress;
          this.cd.markForCheck();
        }

        if (uploaded >= total) {
          this.cleanupSimulation(uiIndex, docRef, total, sub);
        }
      });
    });

    this.uploadSubscriptions.set(uiIndex, sub);
  });
}
private cleanupSimulation(
  uiIndex: number,
  docRef: any,
  total: number,
  sub: Subscription
) {
  docRef.isUploading = false;
  docRef.progress = 100;
  docRef.uploadedSize = total;

  sub.unsubscribe();
  this.uploadSubscriptions.delete(uiIndex);
  this.activeSimulations = Math.max(0, this.activeSimulations - 1);

  this.cd.markForCheck();
}

getDocumentIcon(mimeOrExt: string): string {
  // If you store MIME types in uiUploadedDocs.type, try to map to a font-awesome icon class
  const ext = (mimeOrExt || '').split('/').pop()?.toLowerCase() || mimeOrExt || 'pdf';
  switch (ext) {
    case 'png':
    case 'jpg':
    case 'jpeg':
      return 'fas fa-file-image';
    case 'pdf':
      return 'fas fa-file-pdf';
    case 'doc':
    case 'docx':
      return 'fas fa-file-word';
    case 'xls':
    case 'xlsx':
      return 'fas fa-file-excel';
    case 'txt':
      return 'fas fa-file-alt';
    default:
      return 'fas fa-file';
  }
}

formatSize(bytes: number): string {
  if (!bytes && bytes !== 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(2)} MB`;
  return `${(bytes / 1073741824).toFixed(2)} GB`;
}


deleteFile(index: number, doc: any) {
  this.uiUploadedDocs.splice(index, 1);
  this.cd.detectChanges();

  // if the uploaded file has a server documentId, call removeDoc to remove from server
  if (doc?.documentId) {
    // find index in documents array that matches documentId (safety)
    const docIndex = this.documents.findIndex(d => d.documentId === doc.documentId);
    if (docIndex !== -1) {
      // call existing removeDoc method which hits API and splices on success
      this.removeDoc(docIndex, doc.documentId);
    } else {
      // fallback: remove from uiUploadedDocs and documents if present
      this.uiUploadedDocs.splice(index, 1);
      this.documents = this.documents.filter(d => d.documentId !== doc.documentId);
      this.baseSvc.setBaseDealerFormData({ documentsData: this.documents });
      this.cd.detectChanges();
    }
  } else {
    // Not yet persisted on server: remove locally
    this.uiUploadedDocs.splice(index, 1);
    // also remove from documents (by name and loadedBy) to keep both lists in sync
    this.documents = this.documents.filter(d => !(d.name === doc.name && d.loadedBy === doc.loadedBy));
    this.baseSvc.setBaseDealerFormData({ documentsData: this.documents });
    this.cd.detectChanges();
  }
}


async downloadSelectedFiles() {
  // 1. Filter selected documents
  const selectedDocs = this.documents.filter(d => d.checked);

  if (!selectedDocs.length) {
    this.toasterService.showToaster({ severity: 'warn', summary: 'Warning', detail: 'Please select at least one file.' });
    return;
  }

  // 2. Loop through specific documents and FETCH data
  for (let doc of selectedDocs) {
    try {
      
      // We use await to wait for the API response before moving to the next line
      let responseData : any = await this.svc.data
        .get(
          `DocumentServices/DownloadFile?ContractId=${this.baseFormData?.contractId}&documentId=${doc.documentId}`,
        ).toPromise();

      // 3. Validate the specific JSON structure 
      if (responseData?.data?.fileDetails && responseData.data.fileDetails.length > 0) {
        
        const fileInfo = responseData.data.fileDetails[0];
        const base64Data = fileInfo.fileContents;
        const contentType = fileInfo.contentType || doc.type || 'application/octet-stream';
        const fileName = fileInfo.fileDownloadName || doc.name;

        // 4. Convert Base64 to Blob (Required because your API returns a string)
        const blob = this.base64ToBlob(base64Data, contentType);

        const downloadUrl = window.URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        
        a.href = downloadUrl;
        a.download = fileName;
        
        window.document.body.appendChild(a); // Append
        a.click(); // Trigger
        
        window.URL.revokeObjectURL(downloadUrl); // Cleanup
        a.remove(); // Remove
        // --- End Your Required DOM Logic ---

      } else {
        this.toasterService.showToaster({ severity: 'error', summary: 'Error', detail: 'File content not found on server.' });
      }

    } catch (error) {
      this.toasterService.showToaster({ severity: 'error', summary: 'Error', detail: 'Failed to download file.' });
    }
  }
}

async previewSelectedDocuments() {
  // 1. Get selected files
  const selectedDocs = this.documents.filter(d => d.checked);

  if (selectedDocs.length === 0) {
    this.toasterService.showToaster({ severity: 'warn', detail: 'Please select at least one file.' });
    return;
  }

  // 2. PRE-OPEN WINDOWS (Synchronous Loop)
  // We must open windows immediately on click to bypass popup blockers.
  const windowRefs: any[] = [];
  let blockedCount = 0;

  selectedDocs.forEach(doc => {
    // Check extension support
    const mimeType = this.getMimeTypeFromName(doc.name);
    // Note: Browsers natively support PDF, PNG, JPG, GIF, TXT, JSON, XML
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'text/plain'];
    
    if (!allowedTypes.includes(mimeType)) {
       this.toasterService.showToaster({ severity: 'warn', detail: `File type for ${doc.name} not supported for preview.` });
       return;
    }

    // Open blank window immediately
    const newTab = window.open('', '_blank');
    
    if (newTab) {  
      // Store reference
      windowRefs.push({ doc: doc, window: newTab, type: mimeType });
      
    } else {
      blockedCount++;
    }
  });

  if (blockedCount > 0) {
    this.toasterService.showToaster({ 
      severity: 'warn', 
      summary: 'Popups Blocked', 
      detail: `${blockedCount} files could not be opened. Please allow popups.` 
    });
  }

  // 3. FETCH DATA & REDIRECT WINDOW (Async Loop)
  for (const ref of windowRefs) {
    try {      
      // Call API
      let responseData : any = await this.svc.data
      
        .get(
          `DocumentServices/DownloadFile?ContractId=${this.baseFormData?.contractId}&documentId=${ref.doc.documentId}`,
        ).toPromise();

      if (responseData?.data?.fileDetails && responseData.data.fileDetails.length > 0) {
        const fileDetail = responseData.data.fileDetails[0];

        // Handle Logic Errors
        if (fileDetail.contentType === 'application/json') {
          this.toasterService.showToaster({ severity: 'error', detail: 'Error retrieving file from server.' } );
          continue;
        }

        // Create Blob
        const blob = this.base64ToBlob(fileDetail.fileContents, ref.type);
        const fileUrl = window.URL.createObjectURL(blob);
        // This triggers the browser's default PDF/Image viewer.
        ref.window.location.href = fileUrl;
//         if (ref.window) {
//         const docWindow = ref.window;
//         const docName = ref.doc.name;

//         // Set the title of the tab
//         docWindow.document.title = docName;

//         // Create an <embed> or <iframe> to show the file
//         const embed = docWindow.document.createElement('embed');
//         embed.src = fileUrl;
//         embed.type = ref.type;
//         embed.width = '100%';
//         embed.height = '100%';

//         // Clear any existing content in the body and append the embed
//         docWindow.document.body.innerHTML = '';
//         docWindow.document.body.appendChild(embed);
// }

        // Note: When using location.href with Blobs, you often lose control over the 
        // Tab Title (it might show the blob GUID). This is a browser limitation.

      } else {
        this.toasterService.showToaster({ severity: 'error', detail: 'No data received for this file.' } );
      }

    } catch (error) {
      console.error(error);
      if (ref.window) {      
        this.toasterService.showToaster({ severity: 'error', detail: 'Failed to load document.' } );
      }
    }
  }
}

getMimeTypeFromName(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  // These are the ONLY types browsers can natively preview
  const types: any = { 
    'pdf': 'application/pdf', 
    'jpg': 'image/jpeg', 
    'jpeg': 'image/jpeg', 
    'png': 'image/png', 
    'gif': 'image/gif',
    'txt': 'text/plain'
  };
  // If not found, default to octet-stream (which forces download)
  return types[ext!] || 'application/octet-stream';
}

async printSelectedDocument() {
  // 1. Filter selected documents
  const selectedDocs = this.documents.filter(d => d.checked);

  // Validation: No selection
  if (selectedDocs.length === 0) {
    this.toasterService.showToaster({ severity: 'warn', detail: 'Please select a file to print.' });
    return;
  }

  // Validation: More than one selection 
  if (selectedDocs.length > 1) {
    this.toasterService.showToaster({ severity: 'warn', detail: 'Cannot print more than one document at a time.' } );
    return;
  }

  const doc = selectedDocs[0];

  // 2. Determine File Type Logic
  // We use the same helper logic you used in Preview to strictly identify the type
  const strictMimeType = this.getMimeTypeFromName(doc.name);

  // CHECK: If it is NOT a printable type (e.g. it defaults to octet-stream), assume it's a Word Doc or Zip
  // In this case, we Download instead of Print.
  const printableTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'text/plain'];
  
  if (!printableTypes.includes(strictMimeType)) {
    this.toasterService.showToaster({ 
      severity: 'info', 
      summary: 'Download Started', 
      detail: 'This file format cannot be printed directly. Downloading instead...' 
    } );
    this.downloadSelectedFiles(); // Fallback to existing download function
    return;
  }
  
  // 3. Fetch Data
  try {
    let responseDownload : any = await this.svc.data
        .get(
          `DocumentServices/DownloadFile?ContractId=${this.baseFormData?.contractId}&documentId=${doc.documentId}`,
        ).toPromise();
    console.log('responseDownload', responseDownload);
   

    if (responseDownload?.data?.fileDetails && responseDownload.data.fileDetails.length > 0) {
      const fileDetail = responseDownload.data.fileDetails[0];

      // 4. Create Blob with FORCED Mime Type
      // CRITICAL: We ignore fileDetail.contentType if it is 'octet-stream' and use our calculated 'strictMimeType'
      // This prevents the browser from downloading the file when we put it in the iframe.
      const blob = this.base64ToBlob(fileDetail.fileContents, strictMimeType);
      const blobUrl = window.URL.createObjectURL(blob);

      // 5. The Hidden Iframe Trick
      // We create an invisible iframe, load the blob, and print the iframe's window.
      const iframe = document.createElement('iframe');
      
      // Hide it completely
      iframe.style.visibility = 'hidden';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      
      // Set source
      iframe.src = blobUrl;
      
      document.body.appendChild(iframe);

      // 6. Wait for load, then Print
      iframe.onload = () => {
        // Small delay to ensure PDF rendering is complete inside the iframe
        setTimeout(() => {
          try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
          } catch (e) {
            this.toasterService.showToaster({ severity: 'warn', detail: 'Print Blocked by Browser' } );
          } finally {
            // Cleanup: Remove iframe and revoke URL to free memory
            // We wait a bit to ensure the print dialog has taken control
            setTimeout(() => {
              document.body.removeChild(iframe);
              window.URL.revokeObjectURL(blobUrl);
            }, 2000); 
          }
        }, 0);
      };

    } else {
      this.toasterService.showToaster({ severity: 'error', detail: 'File content not found.' });
    }

  } catch (error) {
    console.error('Print Error', error);
    this.toasterService.showToaster({ severity: 'error', detail: 'Failed to prepare document for printing.' } );
  }
}
// used to delete selected files calling API for each file
// async deleteSelectedFiles() {
//   // Find all selected
//   const selectedDocs = this.documents
//     .map((doc, idx) => ({ doc, idx }))
//     .filter(item => item.doc.checked);

//   if (selectedDocs.length === 0) {
//     this.toasterService.showToaster({ severity: 'warn', detail: 'No files selected for deletion.' });
//     return;
//   }

//   // Optimistically update UI
//   selectedDocs.forEach(item => {
//     // Remove from UI arrays immediately
//     this.documents = this.documents.filter(d => d !== item.doc);
//     this.uiUploadedDocs = this.uiUploadedDocs.filter(d => d !== item.doc);
//   });
//   this.baseSvc.setBaseDealerFormData({ documentsData: this.documents });
//   this.cd.detectChanges();

//   // Launch API deletes in parallel
//   await Promise.all(
//     selectedDocs.map(async (item) => {
//       if (item.doc?.documentId) {
//         // Make sure removeDoc returns a Promise!
//         await this.removeDoc(item.idx, item.doc.documentId);
//       }
//       // If local, nothing more to do
//     })
//   );
// }

async deleteFiles() {
  const selectedDocs = this.documents
    .map((doc, idx) => ({ doc, idx }))
    .filter(item => item.doc.checked);

  if (selectedDocs.length === 0) {
    this.toasterService.showToaster({
      severity: 'warn',
      detail: 'No files selected for deletion.'
    });
    return;
  }

  const documentIds = selectedDocs
    .map(x => x.doc?.documentId)
    .filter((id): id is number => !!id);

  if (documentIds.length === 0) {
    this.toasterService.showToaster({
      severity: 'warn',
      detail: 'No valid document ids to delete.'
    });
    return;
  }

  try {
    
   const res: any = await this.svc.data
      .delete(
        `DocumentServices/DeleteMultipleDocuments?contractId=${this.baseFormData.contractId}`,
        documentIds
      )
      .toPromise(); 

    const deletedIds: number[] = Array.isArray(res?.data) ? res.data : [];

    if (!deletedIds.length) {
      this.toasterService.showToaster({
        severity: 'error',
        detail: 'Failed to delete documents.'
      });
      return;
    }

    // Update UI ONLY after successful API response
    this.documents = this.documents.filter(
      d => !deletedIds.includes(d.documentId)
    );
    this.uiUploadedDocs = this.uiUploadedDocs.filter(
      d => !deletedIds.includes(d.documentId)
    );

    this.baseSvc.setBaseDealerFormData({ documentsData: this.documents });
    this.cd.detectChanges();
  } catch (err) {
    console.error('DeleteMultipleDocuments error:', err);
    this.toasterService.showToaster({
      severity: 'error',
      detail: 'Failed to delete documents. Please try again.'
    });
  }
}
truncateName(name: string, max = 64): string {
  if (!name) { return ''; }
  return name.length > max ? name.slice(0, max) + '...' : name;
}

override ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.uploadSubscriptions.forEach(sub => sub.unsubscribe());
  }
}