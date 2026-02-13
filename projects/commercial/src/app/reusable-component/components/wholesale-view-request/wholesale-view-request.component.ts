import { Component, ViewChild } from '@angular/core';
import { CommonApiService } from '../../../services/common-api.service';
import { CommonService, ToasterService } from 'auro-ui';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import {
  documentActions,
  notesActions,
  notesColumnDefs,
  requestHistoryDocs,
} from '../../../utils/common-header-definition';
import {
  base64ToBlob,
  base64ToBytes,
  clearUploadedDocuments,
  downloadBase64File,
  formatDateTime,
  generateColumnDefs,
  getMimeTypeFromName,
  mapAttachments,
  mapRowsWithCaptions,
  removeSimpleActionColumn,
} from '../../../utils/common-utils';
import {
  NotesDocsParams,
  NotesDocumentParams,
  NotesParams,
  SearchRequestParams,
  SwapRequestParams,
  TaskDocumentByIdParams,
} from '../../../utils/common-interface';
import { DocumentViewComponent } from '../../../assetlink/components/document-view/document-view.component';
import { DocumentsComponent } from '../documents/documents.component';
import { WholesaleRequestHistoryType } from '../../../utils/common-enum';
import { notesDocs } from '../../../bailments/utils/bailment-header.utils';

@Component({
  selector: 'app-wholesale-view-request',
  templateUrl: './wholesale-view-request.component.html',
  styleUrls: ['./wholesale-view-request.component.scss'],
})
export class WholesaleViewRequestComponent {
  @ViewChild(DocumentsComponent) documentsComponent: DocumentsComponent;

  transferRequestDetails: any;
  selectedRowData: any;
  notesDataList: any;
  documentsDataList: any;
  headerList: any;
  requestTypeList: any;
  ws_request_history_datalist: any;
  ws_request_history_columnDefs: any;
  seletectedNote: any;

  notesColumnDefs: any = notesColumnDefs;
  documentsColumnDefs = requestHistoryDocs;

  selectedType: string;
  selectedTypeValue: string;
  facilityType: string;
  selectedPaymentOption: string;
  selectedRequest:string;

  constructor(
    public dialogService: DialogService,
    public toasterService: ToasterService,
    public dynamicDialogConfig: DynamicDialogConfig,
    private commonApiService: CommonApiService
  ) {}

  ngOnInit() {
    const data = this.dynamicDialogConfig?.data;
    if (data) {
      this.selectedType = data.type;
      this.selectedTypeValue = data.selectedType;
      this.selectedRowData = data.selectedRowData;
      this.facilityType = data.facilityType;
      this.selectedPaymentOption = data.selectedPaymentOption;
      this.selectedRequest = data.selectedRequest;
      const id = this.selectedRowData?.[this.selectedType];
      if (this.selectedType === 'Request No.' && (this.selectedRequest === 'swap' || this.selectedRequest === 'productTransfer')) {
        this.fetchTransferRequestDetails({ transferRequestId: id });
      } else if (this.selectedType === 'Request No.') {
        this.fetchPaymentRequestDetails({ paymentRequestId: id });
      }
    }
  }

  onTabChange(event: any) {
    const taskId = this.dynamicDialogConfig.data.selectedRowData?.taskId;

    if (this.selectedType === 'taskId') {
      this.fetchNotesByTaskId({ taskId });
    } else {
      const params: SwapRequestParams = {
        inboxViewType: WholesaleRequestHistoryType.TANSFERR_REQUEST_NOTES_INBOX,
      };
      this.fetchSwapRequestList(params);
    }
  }

  async fetchTransferRequestDetails(params: any) {
    try {
      this.transferRequestDetails =
        await this.commonApiService.getTransferRequestList(params);
    } catch (error) {
      console.error('Error fetching transfer request:', error);
    }
  }

  async fetchPaymentRequestDetails(params: any) {
    try {
      const result =
        await this.commonApiService.getPaymentRequestList(params);
        if(result){
          this.transferRequestDetails = result?.filter(x=>x.include === true)
        }
    } catch (error) {
      console.error('Error fetching payment request:', error);
    }
  }

  async fetchSwapRequestList(params: SwapRequestParams) {
    try {
      const data = await this.commonApiService.getSwapRequestTypeList(params);
      this.headerList = data[0]?.fields;

      if (this.headerList) {
        const searchParams: SearchRequestParams = {
          typeId: data[0].id,
          transferRequestId: this.selectedRowData['Request No.'],
          inboxViewType: params.inboxViewType,
        };
        this.fetchTransferRequestList(searchParams);
      }
    } catch (error) {
      console.error('Error fetching swap list:', error);
    }
  }

  async fetchTransferRequestList(params: SearchRequestParams) {
    try {
      this.requestTypeList =
        await this.commonApiService.getSearchRequestTypeList(params);
      const data = mapRowsWithCaptions(this.headerList, this.requestTypeList);

      data.forEach((item) => (item.action = notesActions));

      this.notesDataList = data;
      this.notesColumnDefs = removeSimpleActionColumn(
        generateColumnDefs(data, this.headerList).concat({
          headerName: 'view',
          field: 'action',
          action: 'view',
          name: 'view',
          format: '#icons',
          color: '--primary-color',
          actions: 'onCellClick',
        })
      );
    } catch (error) {
      console.error('Error fetching request list:', error);
    }
  }

  async fetchNotesByTaskId(params: { taskId: number }) {
    try {
      const response = await this.commonApiService.getNotesByTaskId(params);
      this.notesDataList = response;
      this.documentsDataList = response
        .filter((doc) => doc.fileName)
        .map((doc) => ({ ...doc, actions: [...documentActions] }));
    } catch (error) {
      console.error('Error fetching task notes:', error);
    }
  }

  async fetchDocumentById(params: NotesDocumentParams) {
    try {
      return await this.commonApiService.downloadWholesaleRequestHistoryDocuments(
        params
      );
    } catch (error) {
      console.error('Error fetching document by ID:', error);
    }
  }

  async fetchTaskDocumentById(params: TaskDocumentByIdParams) {
    try {
      return await this.commonApiService.getTaskDocumentById(params);
    } catch (error) {
      console.error('Error fetching task document:', error);
    }
  }

  async fetchNotesDocumentsById(params: NotesParams) {
    try {
      const documents =
        await this.commonApiService.getWholesaleRequestHistoryNotes(params);
      const processedData = mapAttachments(documents).map((doc) => ({
        ...doc,
        actions: documentActions,
        loaded: doc.loaded ? formatDateTime(doc.loaded) : undefined,
      }));
      return processedData;
    } catch (error) {
      console.error('Error fetching note documents:', error);
    }
  }

  onSeletedData(event: any) {
    this.documentsColumnDefs = notesDocs;
    this.documentsDataList = event.documentList;
    this.seletectedNote = event.seletedNote;
  }

  async onDocumentClick(event: any) {
    const { actionName, rowData } = event;

    const isUDC = this.selectedPaymentOption === 'udc';
    const fetchMethod = isUDC
      ? this.fetchTaskDocumentById.bind(this)
      : this.fetchDocumentById.bind(this);
    const params = isUDC
      ? { noteId: rowData.noteId, attachmentId: rowData.noteAttachmentId }
      : { noteId: rowData.noteId, id: rowData.id };

    const document = await fetchMethod(params);

    if (!document?.fileContents) {
      this.toasterService.showToaster({
        severity: 'error',
        detail: 'Document Not Available for Preview',
      });
      return;
    }

    if (actionName === 'download') {
      return downloadBase64File(document);
    }

    if (actionName === 'previewDoc') {
      this.previewDocument(document);
    }
  }

  previewDocument(document: any) {
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

    this.dialogService.open(DocumentViewComponent, {
      data: { displayDoc: url, displayDocType: contentType },
      header: 'Document Preview',
      width: '80%',
      height: '80%',
      contentStyle: { overflow: 'auto' },
    });
  }

    async onDocUploadClick(event) {
    if (this.selectedPaymentOption !== 'udc') {
      const formData = new FormData();
      formData.append('id', String(this.seletectedNote));
 
      for (const doc of event) {
        const base64 = doc.file;
        const fileName = doc.name;
        const fileType = doc.type;
 
        const byteArray = base64ToBytes(base64);
        const buffer = byteArray.buffer as ArrayBuffer;
 
        const finalFileName = fileName.includes('.')
          ? fileName
          : `${fileName}.${fileType}`;
 
        const mimeType = getMimeTypeFromName(finalFileName);
        const blob = new Blob([buffer], { type: mimeType });
 
        formData.append('noteAttachment', blob, finalFileName);
      }
 
      await this.uploadDocs(formData);
    } else {
      const payload = {
        comments: '',
        subject: this.selectedRowData.externalData.subjectLine,
        apAttachmentFiles: event.map((doc) => ({
          file: doc.file,
          fileName: doc.name,
          fileType: doc.type,
          noteAttachmentId: [doc.documentId],
        })),
      };
 
      await this.uploadTaskDocs(
        { taskId: this.selectedRowData.taskId },
        payload
      );
    }
  }

  async uploadDocs(formData: FormData) {
    try {
      await this.commonApiService.uploadWholesaleRequestHistoryDocuments(
        formData
      );
      clearUploadedDocuments(this.documentsComponent.uploadedDocuments);
      this.toasterService.showToaster({
        severity: 'success',
        detail: 'Document Uploaded Successfully',
      });

      await this.fetchNotesDocumentsById({ noteId: this.seletectedNote });
    } catch (error) {
      console.error('Error uploading docs:', error);
      this.toasterService.showToaster({
        severity: 'error',
        detail: 'Failed to upload document. Please try again.',
      });
    }
  }

  async uploadTaskDocs(params: NotesDocsParams, documentBody: any) {
    try {
      await this.commonApiService.postNotesDocuments(params, documentBody);
      clearUploadedDocuments(this.documentsComponent.uploadedDocuments);
      this.toasterService.showToaster({
        severity: 'success',
        detail: 'Document Uploaded Successfully',
      });
      await this.fetchNotesByTaskId({ taskId: params.taskId });
    } catch (error) {
      console.error('Error uploading task docs:', error);
    }
  }
}
