import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonService, ToasterService } from 'auro-ui';
import { DialogService } from 'primeng/dynamicdialog';
import {
  DocumentByIdParams,
  DocumentsParams,
  DocumentUploadRequest,
  UploadDocsParams,
} from '../../../utils/common-interface';
import { CommonApiService } from '../../../services/common-api.service';
import {
  base64ToBlob,
  clearUploadedDocuments,
  convertFileToBase64,
  downloadBase64File,
  getMimeTypeFromName,
} from '../../../utils/common-utils';
import { assetlinkDocumentsColumnDefs } from '../../../assetlink/utils/assetlink-header.util';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { DocumentViewComponent } from '../../../assetlink/components/document-view/document-view.component';
import { UploadDocsComponent } from '../upload-docs/upload-docs.component';

interface Document {
  name: string;
  type: string;
  size: any; // in MB
  totalSize: number; // Total size in bytes
  uploadedSize: number; // Uploaded size in bytes
  progress: number; // Percentage
  progressMode: string;
  isUploading: boolean;
  previewUrl: any;
}

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss',
})
export class DocumentsComponent {
  @ViewChild(UploadDocsComponent) uploadDocsComponent: UploadDocsComponent;
  @Input() documentsColumnDefs: any[];
  @Input() documentsDataList;
  @Input() facilityType;
  @Output() documentEmitter = new EventEmitter<any>();
  @Output() docUploadEmitter = new EventEmitter<any>();
  uploadedDocuments = [];
  previewDocPopUp: boolean = false;
  displayDoc;
  displayDocType;
  partyId: any;

  constructor(
    public commonSvc: CommonService,
    public commonApiService: CommonApiService,
    public toasterService: ToasterService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public dialogService: DialogService
  ) {}

  ngOnInit() {
    // this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
    //   this.partyId = currentParty?.id;
    // });
    this.partyId = JSON.parse(sessionStorage.getItem('currentParty'))?.id;
    if (!this.partyId) {
      this.commonSvc.router.navigateByUrl('commercial');
    }
    if (!this.facilityType?.trim()) {
      this.documentsColumnDefs = assetlinkDocumentsColumnDefs;
      const params = {
        partyId: this.partyId,
      };
      this.fetchDocuments(params);
    }
  }

  getDocumentIcon(type: string): string {
    // Return the appropriate icon class based on the document type
    switch (type) {
      case 'application/pdf':
        return 'pi pi-file-pdf text-red-500'; // Red for PDF
      case 'image/jpeg':
      case 'image/png':
        return 'pi pi-image text-green-500'; // Green for images
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'pi pi-file-word text-blue-500'; // Blue for Word documents
      default:
        return 'pi pi-file text-gray-500'; // Gray for unknown types
    }
  }

  previewDoc(index: number) {
    const document = this.uploadedDocuments[index];
    if (document.previewUrl) {
      this.previewDocPopUp = true;
      this.displayDoc = document.previewUrl; // Assign the preview URL
      this.displayDocType = document.type;
    }
  }

  onFilesUploaded(event) {
    Array.from(event).forEach((file: File) => {
      // Check for duplicates based on the file name
      const isDuplicate = this.uploadedDocuments.some(
        (doc) => doc.name === file.name
      );

      if (!isDuplicate) {
        const doc: Document = {
          name: file.name,
          type: file.type,
          size: 0,
          progress: 0,
          uploadedSize: 0,
          totalSize: 0,
          progressMode: '',
          isUploading: false,
          previewUrl: '',
        };

        this.uploadedDocuments.push(doc);
        console.log(this.uploadedDocuments);

        // Simulate an upload
        this.uploadDocumentData(file, doc);
      }
    });
  }

  async onFilesSubmit(event) {
    try {
      const docs: DocumentUploadRequest[] = await Promise.all(
        event.map(async (file) => {
          const base64Content = await convertFileToBase64(file);
          return {
            file: base64Content,
            documentId: 0,
            name: file.name.substring(0, file.name.lastIndexOf('.')),
            category: 'Other Correspondence',
            description: '',
            type: file.name.split('.').pop()?.toLowerCase() || '',
            loaded: new Date().toISOString(),
            loadedBy: '',
            source: '',
            isDocumentDeleted: false,
            documentProvider: '',
            securityClassification: 'General',
            reference: '',
            generatedDocs: [],
          };
        })
      );
      if (this.facilityType) {
        this.docUploadEmitter.emit(docs);
      } else {
        this.uploadDocs({ partyId: this.partyId }, docs);
      }
    } catch (error) {
      console.error('Error while preparing or uploading documents:', error);
    }
  }

  deleteFile(doc: any) {
    const fileName = doc.name;
    const index = this.uploadedDocuments.findIndex(
      (item) => item.name === fileName
    );

    if (index > -1) {
      console.log(`Deleting file: ${this.uploadedDocuments[index].name}`);
      this.uploadedDocuments.splice(index, 1); // Remove the document from display

      // Also remove from upload-docs component to prevent submission
      if (this.uploadDocsComponent) {
        this.uploadDocsComponent.removeFileByName(fileName);
      }
    } else {
      console.log(`Document with name ${fileName} not found.`);
    }
  }

  onCellClick(event) {
    if (this.facilityType) {
      this.documentEmitter.emit(event);
    } else {
      this.onDocumentClick(event);
    }
  }

  downloadDoc(index: number) {
    const documentItem = this.uploadedDocuments[index];
    if (documentItem.progressMode == 'determinate') {
      const a = window.document.createElement('a'); // Use window.document
      a.href = documentItem.previewUrl;
      a.download = documentItem.name; // Set the file name for download
      window.document.body.appendChild(a); // Use window.document
      a.click(); // Trigger the download
      window.URL.revokeObjectURL(documentItem.previewUrl); // Clean up
      a.remove(); // Remove the link from the DOM
    } else {
      console.error('No file data available for download.');
    }
  }

  uploadDocumentData(file: File, doc: Document) {
    doc.totalSize = file.size; // Set total size
    doc.uploadedSize = 0; // Initialize uploaded size
    const totalChunks = 10; // Number of increments
    const chunkSize = file.size / totalChunks; // Size of each increment
    doc.progressMode = 'indeterminate';
    const blob = new Blob([file], { type: file.type });
    const url = window.URL.createObjectURL(blob);
    doc.previewUrl = url;
    doc.isUploading = true;
    const interval = setInterval(() => {
      if (doc.uploadedSize < doc.totalSize) {
        doc.uploadedSize += chunkSize; // Simulate uploading a chunk
        doc.progress = Math.min(
          Math.round((doc.uploadedSize / doc.totalSize) * 100),
          100
        ); // Update progress
      } else {
        clearInterval(interval);
        doc.progressMode = 'determinate';
        doc.isUploading = false;
        console.log(`Uploaded: ${file.name}`);
      }
    }, 1000);
  }

  async fetchDocumentById(params: DocumentByIdParams) {
    try {
      const document = await this.commonApiService.getDocumentById(params);
      // downloadBase64File(document);
      return document;
    } catch (error) {
      console.log('Error while loadding document by Id data', error);
    }
  }

  async fetchDocuments(params: DocumentsParams) {
    try {
      this.documentsDataList = await this.commonApiService.getDocumentsData(
        params
      );
    } catch (error) {
      console.log('Error while loading documents data', error);
    }
  }

  async onDocumentClick(event) {
    if (event.actionName == 'download') {
      const params = {
        partyId: this.partyId,
        documentId: event.rowData.documentId,
        // contractId: this.contractId
      };
      const document = await this.fetchDocumentById(params);
      downloadBase64File(document);
    } else if (event.actionName == 'previewDoc') {
      const params = {
        partyId: this.partyId,
        documentId: event.rowData.documentId,
        // contractId: this.contractId
      };
      const document = await this.fetchDocumentById(params);
      if (!document?.fileContents) {
        this.toasterService.showToaster({
          severity: 'error',
          detail: 'Document Not Available for Preview',
        });
        return;
      }
      const base64Data = document.fileContents;
      const contentType = getMimeTypeFromName(document.fileDownloadName);
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
      const blob = base64ToBlob(base64Data, contentType);
      const url = URL.createObjectURL(blob);

      const ref = this.dialogService.open(DocumentViewComponent, {
        data: {
          displayDoc: url,
          displayDocType: contentType,
        },
        header: 'Document Preview',
        width: '80%',
        height: '80%',
        contentStyle: { overflow: 'auto' }, // Let content determine size
      });
    }
  }

  async uploadDocs(params: UploadDocsParams, documentBody) {
    try {
      await this.commonApiService.postDocuments(params, documentBody);
      clearUploadedDocuments(this.uploadedDocuments);
      this.toasterService.showToaster({
        severity: 'success',
        detail: 'Document Uploaded Successfully',
      });
      await this.fetchDocuments({ partyId: this.partyId });
    } catch (error) {
      console.log('Error while loading uploading docs', error);
    }
  }
}
