import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
// import { BaseStandardQuoteClass } from '../../../../dealer/standard-quote/base-standard-quote.class';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService, CommonService, ToasterService } from 'auro-ui';
// import { StandardQuoteService } from '../../../../dealer/standard-quote/services/standard-quote.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DialogService } from 'primeng/dynamicdialog';
import { DocumentViewComponent } from '../../../assetlink/components/document-view/document-view.component';
import { BaseCommercialService } from '../../services/base-commercial.service';
import { getMimeTypeFromName } from '../../../utils/common-utils';

type FileTypeMapping = {
  type: string;
  fileType: string;
  image?: string;
};

interface Document {
  name: string;
  type: string;
  size: any; // in MB
  progress: number; // percentage
}

class DocumentData {
  documentId: number;
  name: string;
  previewBtn?: string = '';
  downloadBtn?: string = '';
  deleteBtn?: string = '';
  fileData?: any;
  checked?: boolean = true;
  category?: string = 'Asset Information';
  description?: string = null;
  type?: string = 'pdf';
  loaded?: string = '2024-09-08T17:19:49.337';
  dateLoaded?: Date = new Date(this.loaded);
  loadedBy?: string = '';
  source?: string = 'Uploaded';
  isDocumentDeleted?: boolean = false;
  documentProvider?: string = 'All';
  securityClassification?: string = 'Restricted to Internal Users';
  reference?: string = '2024\\0905\\2_TestDarshan.pdf';
  outputDt?: string = '1900-01-01T00:00:00';
  expiryDt?: string = '1900-01-01T00:00:00';
  status?: string = 'Pending';
  previewUrl?: string = '';
}

const fileTypeMappings: FileTypeMapping[] = [
  { type: 'doc', fileType: 'application/msword' },
  {
    type: 'docx',
    fileType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
  { type: 'pdf', fileType: 'application/pdf' },
  { type: 'txt', fileType: 'text/plain' },
  { type: 'tif', fileType: 'image/tiff' },
  { type: 'tiff', fileType: 'image/tiff' },
  { type: 'csv', fileType: 'text/csv' },
  { type: 'xls', fileType: 'application/vnd.ms-excel' },
  {
    type: 'xlsx',
    fileType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  },
  { type: 'jpg', fileType: 'image/jpeg' },
  { type: 'jpeg', fileType: 'image/jpeg' },
  { type: 'png', fileType: 'image/png' },
];

@Component({
  selector: 'app-upload-docs',
  //standalone: true,
  //imports: [],
  templateUrl: './upload-docs.component.html',
  styleUrls: ['./upload-docs.component.scss'],
})
export class UploadDocsComponent {
  @Input() showActionIcons = false;
  @Output() onFilesUploaded = new EventEmitter<any>();
  @Output() onFilesSubmit = new EventEmitter<any>();
  uploadedDocuments: Document[] = [];
  baseFormData: any;
  uploadDocument: any;
  loanVariationId: any;
  formdata: any;
  isUploadReady = false;
  files = [];
  uploadedFiles = [];
  selectedDocType: string;

  columns = [
    {
      field: 'name',
      headerName: '',
      minWidth: '4rem',
      maxWidth: '5rem',
      width: '5rem',
      class: 'text-overflow-ellipsis',
    },
    {
      field: 'previewBtn',
      headerName: '',
      format: '<i class="fa-regular fa-eye text-base text-blue-500"></i>',
      minWidth: '1rem',
      maxWidth: '1rem',
      width: '1rem',
      action: 'previewDoc',
    },

    {
      field: 'downloadBtn',
      headerName: '',
      format:
        '<i class="fa-solid fa-arrow-down-to-square text-base text-blue-500" (click)="downloadDoc($event)"></i>',
      minWidth: '1rem',
      maxWidth: '1rem',
      width: '1rem',
      action: 'downloadDoc',
    },
    {
      field: 'deleteBtn',
      headerName: '',
      format: '<i class="fa-regular fa-trash-can text-base text-red-500"></i>',
      minWidth: '1rem',
      maxWidth: '1rem',
      width: '1rem',
      action: 'removeDoc',
    },
  ];
  documents: DocumentData[] = []; // for documents that are uploaded
  generatedDocuments: any = [];

  imageTypes = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'application/pdf': 'pdf',
    gif: 'gif',
    msg: 'msg',
  };

  imagePaths = {
    jpg: 'assets/images/documentsType/JPG.svg',
    png: 'assets/images/documentsType/PNG.svg',
    docx: 'assets/images/documentsType/DOC.svg',
    pdf: 'assets/images/documentsType/PDF.svg',
  };

  //preview
  previewDocPopUp: boolean = false;
  displayDoc?: string;
  displayDocType: any = null;
  currentIndex: number = -1;
  isDragging: boolean = false;
  private subscriptions = [];
  errorMessage: string;

  constructor(
    public route: ActivatedRoute,
    public svc: CommonService,
    public baseSvc: BaseCommercialService,
    private toasterService: ToasterService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    public authSvc: AuthenticationService,
    private dialogService: DialogService
  ) { }
  responsedData: any;
  async ngOnInit(): Promise<void> {
    let params: any = this.route.snapshot.params;
    // this.id = params.id;
    if (this.baseFormData) {
      // console.log(this.baseFormData?.documentsData);

      this.baseFormData?.documentsData?.forEach((ele) => {
        const obj = new DocumentData();
        this.documents.push({
          dateLoaded: new Date(ele?.loaded),
          ...obj,
          ...ele,
        });
      });

      this.baseFormData?.generatedDocuments?.forEach((ele) => {
        this.generatedDocuments.push({
          checked: false,
          ...ele,
        });
      });
    }
  }

  downloadDoc(index: number) {
    const documentItem = this.documents[index];
    if (documentItem.fileData) {
      const blob = new Blob([documentItem.fileData], {
        type: documentItem.type,
      });
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a'); // Use window.document
      a.href = url;
      a.download = documentItem.name; // Set the file name for download
      window.document.body.appendChild(a); // Use window.document
      a.click(); // Trigger the download
      window.URL.revokeObjectURL(url); // Clean up
      a.remove(); // Remove the link from the DOM
    } else {
      console.error('No file data available for download.');
    }
  }

  onFileSelected(event: any) {
    this.onFilesUploaded.emit(event.uploadedFiles);
    const files = event.uploadedFiles;

    Array.from(files).forEach((file: File) => {
      const doc: Document = {
        name: file.name,
        type: file.type,
        size: 0,
        progress: 0,
      };

      this.uploadedDocuments.push(doc);

      // Simulate an upload
      this.uploadDocumentData(file, doc);
      // this.isUploadReady = true;
    });
  }

  onUpload() {
    if (!this.uploadedFiles || this.uploadedFiles.length === 0) {
      this.toasterService.showToaster({
        severity: 'error',
        detail: 'Please select files',
      });
      return;
    }
    this.onFilesSubmit.emit(this.uploadedFiles);
    this.uploadedFiles = [];
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); // Prevent default behavior (Prevent file from being opened)
    this.isDragging = true; // Indicate dragging state
  }

  onDragLeave() {
    this.isDragging = false; // Reset dragging state
  }

  // onDrop(event: DragEvent) {
  //   event.preventDefault(); // Prevent default behavior
  //   this.isDragging = false; // Reset dragging state

  //   const files = event.dataTransfer?.files; // Get the dropped files
  //   if (files) {
  //     this.onFilesUploaded.emit(files); // Emit the files
  //     this.handleFiles(files); // Process the files
  //   }
  // }

  onDrop(event: DragEvent) {
    event.preventDefault(); // Prevent default behavior
    this.isDragging = false; // Reset dragging state

    const files = event.dataTransfer?.files; // Get the dropped files
    if (files) {
      const allowedExtensions = [
        'pdf',
        'jpg',
        'jpeg',
        'png',
        'doc',
        'docx',
        'html',
        'msg',
        'gif',
      ];
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (ext && allowedExtensions.includes(ext)) {
          validFiles.push(file);
        } else {
          invalidFiles.push(file.name);
        }
      }

      if (invalidFiles.length > 0) {
        this.toasterService.showToaster({
          severity: 'error',
          detail: 'This format of file is not supported',
        });
        return;
      }
      if (validFiles) {
        const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB
        const oversizedFiles = validFiles.filter(
          (file) => file.size > maxSizeInBytes
        );

        if (oversizedFiles.length > 0) {
          this.toasterService.showToaster({
            severity: 'error',
            detail: 'One or more files exceed the 2 MB limit.',
          });
          return; // Stop further processing
        } else {
          this.errorMessage = null; // Clear any previous error
        }
      }
      // Emit and handle only the valid files
      const validFileList = new DataTransfer();
      validFiles.forEach((file) => validFileList.items.add(file));

      this.onFilesUploaded.emit(validFileList.files); // Emit the valid files
      this.handleFiles(validFileList.files); // Process the valid files
    }
  }

  handleFiles(files: FileList) {
    Array.from(files).forEach((file: File) => {
      const doc: Document = {
        name: file.name,
        type: file.type,
        size: 0,
        progress: 0,
      };

      this.uploadedDocuments.push(doc);
      this.uploadDocumentData(file, doc); // Simulate upload
    });
  }

  uploadDocumentData(file: File, doc: Document) {
    const totalChunks = 10; // Number of increments
    const chunkSize = file.size / totalChunks; // Size of each increment
    let uploadedBytes = 0; // Track uploaded bytes

    const interval = setInterval(() => {
      if (uploadedBytes < file.size) {
        uploadedBytes += chunkSize; // Simulate uploading a chunk
        doc.progress = Math.min(
          Math.round((uploadedBytes / file.size) * 100),
          100
        ); // Update progress

        // Update the document size in MB (optional)
        doc.size = (uploadedBytes / (1024 * 1024)).toFixed(2); // Convert to MB
      } else {
        clearInterval(interval);
        console.log(`Uploaded: ${file.name}`);
      }
    }, 1000);
  }

  getDocumentIcon(type: string): string {
    // Return the appropriate icon class based on the document type
    switch (type) {
      case 'application/pdf':
        return 'pi pi-file-pdf';
      case 'image/jpeg':
      case 'image/png':
        return 'pi pi-image';
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'pi pi-file-word';
      default:
        return 'pi pi-file'; // default icon
    }
  }

  onCheckboxChange(name, index: any) {
    this.currentIndex = index;
  }

  onUploaded(event) {
    const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB

    if (event.uploadedFiles) {
      const oversizedFiles = event.uploadedFiles.filter(
        (file) => file.size > maxSizeInBytes
      );

      if (oversizedFiles.length > 0) {
        this.toasterService.showToaster({
          severity: 'error',
          detail: 'One or more files exceed the 2 MB limit.',
        });
        return; // Stop further processing
      } else {
        this.errorMessage = null; // Clear any previous error
      }
    }
    if (event.file.type === 'application/pdf') {
      const blob = new Blob([event.file], { type: event.file.type });

      // Now you can use the Blob, e.g., create an object URL
      const url = URL.createObjectURL(blob);
      event.file.objectURL = url;
    }
    if (!this.showActionIcons) {
      this.onFileSelected(event);
    } else {
      this.onFilesUploaded.emit(event.uploadedFiles);
      event.uploadedFiles.forEach((file) => {
        // this.trialData.push(file);

        // const objectURL = URL.createObjectURL(file);
        // const safeFileUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);

        const request = new FormData();
        // request.append('ContractId', this.id);
        request.append('files', file || 'defaultFileURL');
        request.append(
          'loadedBy',
          this.authSvc.oidcUser?.given_name +
          ' ' +
          this.authSvc.oidcUser?.family_name
        );
        request.append(
          'dc',
          JSON.stringify({
            name: file?.name || 'defaultName',
            category: 'Asset Information',
          })
        );

        // this.svc.data
        //   .post(
        //     `DocumentServices/documents?ContractId=${this.baseFormData?.contractId}`,
        //     request
        //   )
        //   .subscribe(
        //     (res) => {
        //       this.postdata = res;
        //     },
        //     (error) => {
        //       // console.error('Error:', error);
        //     }
        //   );

        let maxDocumentId = 1;
        if (this.documents.length > 0) {
          Math.max(...this.documents.map((doc) => doc.documentId));
          this.isUploadReady = this.documents.length > 0;
        }

        this.documents.push({
          name: file.name,
          fileData: file,
          documentId: maxDocumentId,
          type: this.imageTypes[file.type],
          dateLoaded: new Date(),
          status: 'Uploaded',
        });

        this.baseSvc.setBaseCommercialFormData({
          documentsData: this.documents,
        });
      });

      this.cd.detectChanges();
    }
  }

  readFile(file) {
    const reader = new FileReader();
    var fileText;
    reader.addEventListener(
      'load',
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

  onPreviewFile(dataIndex) {
    if (this.generatedDocuments?.[0]) {
      let displayDoc = this.generatedDocuments?.[0].fileDetails[0].fileContents;
      const pdfBlob = this.base64ToBlob(displayDoc, 'application/pdf');
      let fileText = this.readFile(pdfBlob);
    }
  }

  base64ToBlob(base64: string, contentType = '', sliceSize = 512) {
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

  onCellClick(event) {
    event.rowData.rowIndex = event.rowIndex;
    if (event.actionName == 'removeDoc') {
      this.removeDoc(event.rowIndex);
    } else if (event.actionName === 'previewDoc') {
      this.previewDoc(event.index);
    } else if (event.actionName === 'downloadDoc') {
      this.downloadDoc(event.index);
    }
  }

  previewDoc(index: number) {
    const document = this.documents[index];

    const contentType = getMimeTypeFromName(document.name);
    const previewableTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'images/gif',
    ];

    if (!previewableTypes.includes(contentType)) {
      this.toasterService.showToaster({
        severity: 'error',
        detail: 'Preview not supported for this file type.',
      });
      return;
    }
    if (document.fileData) {
      const ref = this.dialogService.open(DocumentViewComponent, {
        data: {
          displayDoc:
            document.fileData.objectURL.changingThisBreaksApplicationSecurity,
          displayDocType: document.name,
        },
        header: 'Document Preview',
        width: '80%',
        height: '80%',
        contentStyle: { 'max-height': '80vh', overflow: 'auto' },
      });
    }
  }

  removeDoc(index) {
    this.documents.splice(index, 1);
    this.baseSvc.setBaseCommercialFormData({ documentsData: this.documents });
  }

  ngOnDestroy(): void {
    // Clean up any subscriptions
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = []; // clear subscriptions if needed

    // If you have any other cleanup logic, add it here
    console.log('UploadDocsComponent destroyed');
  }


  clearDocuments(): void {
    console.log('Clearing documents - before:', {
      uploadedDocuments: this.uploadedDocuments.length,
      documents: this.documents.length
    });

    // Clear all document-related arrays
    this.uploadedDocuments = [];
    this.documents = [];
    this.uploadedFiles = [];
    this.files = [];

    // Update the base service data
    this.baseSvc.setBaseCommercialFormData({ documentsData: [] });

    // Force change detection
    this.cd.detectChanges();

    console.log('Clearing documents - after:', {
      uploadedDocuments: this.uploadedDocuments.length,
      documents: this.documents.length
    });
  }
}
