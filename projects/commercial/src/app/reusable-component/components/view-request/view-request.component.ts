import { Component, ViewChild } from '@angular/core';
import { CommonApiService } from '../../../services/common-api.service';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';

import { ToasterService } from 'auro-ui';
import {
  DocumentByIdParams,
  DocumentsParams,
  DocumentUploadRequest,
  NotesDocsParams,
  TaskDocumentByIdParams,
  UploadDocsParams,
} from '../../../utils/common-interface';
import {
  base64ToBlob,
  clearUploadedDocuments,
  convertFileToBase64,
  downloadBase64File,
  getMimeTypeFromName,
} from '../../../utils/common-utils';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { assetlinkDocumentsColumnDefs } from '../../../assetlink/utils/assetlink-header.util';
import { DocumentViewComponent } from '../../../assetlink/components/document-view/document-view.component';
import {
  documentActions,
  notesActions,
  notesColumnDefs,
  requestHistoryDocs,
} from '../../../utils/common-header-definition';
import { DocumentsComponent } from '../documents/documents.component';

@Component({
  selector: 'app-view-request',
  //standalone: true,
  //imports: [],
  templateUrl: './view-request.component.html',
  styleUrls: ['./view-request.component.scss'],
})
export class ViewRequestComponent {
  @ViewChild(DocumentsComponent) documentsComponent: DocumentsComponent;
  partyId: number;
  documentsDataList: any = [];
  selectedRequest;
  documentsColumnDefs = requestHistoryDocs;
  notesColumnDefs = notesColumnDefs;
  notesDataList: any = [];

  constructor(
    private commonApiService: CommonApiService,
    public toasterService: ToasterService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public ref: DynamicDialogRef,
    public dynamicDialogConfig: DynamicDialogConfig,
    public dialogService: DialogService
  ) {}
  ngOnInit() {
    this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
      this.partyId = currentParty?.id;
    });
    if (this.dynamicDialogConfig?.data) {
      const taskId = this.dynamicDialogConfig?.data.selectedRow.taskId;
      const params = {
        taskId: taskId,
      };
      this.fetchNotesByTaskId(params);
      this.selectedRequest = this.dynamicDialogConfig.data.selectedRow;
    }
  }
  onTabChange(event: any) {
    const index = event.index;
    // Optionally load tab-specific data here
  }

  async fetchDocumentById(params: TaskDocumentByIdParams) {
    try {
      const document = await this.commonApiService.getTaskDocumentById(params);
      // downloadBase64File(document);
      return document;
    } catch (error) {
      console.log('Error while loadding document by Id data', error);
    }
  }

  // async fetchDocuments(params: DocumentsParams) {
  //   try {
  //     this.documentsDataList = await this.commonApiService.getDocumentsData(
  //       params
  //     );
  //   } catch (error) {
  //     console.log('Error while loading documents data', error);
  //   }
  // }

  async fetchNotesByTaskId(params) {
    try {
      const response = await this.commonApiService.getNotesByTaskId(params);

      const seenNoteIds = new Set();
      const uniqueNotes = response.filter((item) => {
        if (seenNoteIds.has(item.noteId)) return false;
        seenNoteIds.add(item.noteId);
        return true;
      });

      this.notesDataList = uniqueNotes;

      this.documentsDataList = response;
      this.documentsDataList = response.map((doc) => ({
        ...doc,
        actions: [...documentActions],
      }));
    } catch (error) {
      console.log('Error while loading documents data', error);
    }
  }

  async onDocumentClick(event) {
    if (event.actionName == 'download') {
      const params = {
        noteId: event.rowData.noteId,
        attachmentId: event.rowData.noteAttachmentId,
      };
      const document = await this.fetchDocumentById(params);
      downloadBase64File(document);
    } else if (event.actionName == 'previewDoc') {
      const params = {
        noteId: event.rowData.noteId,
        attachmentId: event.rowData.noteAttachmentId,
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

  onDocUploadClick(event) {
    const payload = {
      comments: '',
      subject: this.selectedRequest.externalData.subjectLine,
      apAttachmentFiles: event.map((doc) => ({
        file: doc.file,
        fileName: doc.name,
        fileType: doc.type,
        noteAttachmentId: [doc.documentId],
      })),
    };
    this.uploadDocs({ taskId: this.selectedRequest.taskId }, payload);
  }

  async uploadDocs(params: NotesDocsParams, documentBody) {
    try {
      await this.commonApiService.postNotesDocuments(params, documentBody);
      clearUploadedDocuments(this.documentsComponent.uploadedDocuments);
      this.toasterService.showToaster({
        severity: 'success',
        detail: 'Document Uploaded Successfully',
      });
      const paramsDoc = {
        taskId: params.taskId,
      };

      await this.fetchNotesByTaskId(paramsDoc);
    } catch (error) {
      console.log('Error while loading uploading docs', error);
    }
  }
}
