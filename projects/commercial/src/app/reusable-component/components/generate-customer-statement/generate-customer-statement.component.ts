import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonApiService } from '../../../services/common-api.service';
import {
  AssetTransactionParams,
  CustomerStatementBody,
  DocumentByIdParams,
} from '../../../utils/common-interface';
import { CloseDialogData, CommonService, ToasterService } from 'auro-ui';
import { AcknowledgmentPopupComponent } from '../acknowledgment-popup/acknowledgment-popup.component';
import { downloadBase64File } from '../../../utils/common-utils';
import { GenerateCustomerStatementParams } from '../../../utils/common-enum';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-generate-customer-statement',
  //standalone: true,
  //imports: [],
  templateUrl: './generate-customer-statement.component.html',
  styleUrl: './generate-customer-statement.component.scss',
})
export class GenerateCustomerStatementComponent implements OnInit, OnDestroy {
  contractId?: number;  
  fromDate?: string;
  toDate?: string;  
  typeOfStatement?: string;
  scheduleType?: string;  
  private destroy$ = new Subject<void>();

  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private commonapiService: CommonApiService,
    private toasterService: ToasterService,
    private svc: CommonService,
    private ref: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    this.contractId = this.dynamicDialogConfig?.data?.contractId;
    this.typeOfStatement = this.dynamicDialogConfig?.data?.typeOfStatement;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFromDateChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.fromDate = inputElement?.value;
  }

  onToDateChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.toDate = inputElement?.value;
  }

  async generateStatement(): Promise<void> {
    try {
      const areDatesSelected = this.fromDate && this.toDate;
      if (!areDatesSelected) {
        this.toasterService.showToaster({
          severity: 'error',
          detail: 'Please select both From and To dates.',
        });
        return;
      }

      const fromDateObj = new Date(this.fromDate);
      const toDateObj = new Date(this.toDate);
      const isDateRangeValid = toDateObj >= fromDateObj;
      
      if (!isDateRangeValid) {
        this.toasterService.showToaster({
          severity: 'error',
          detail: 'To date cannot be earlier than From date.',
        });
        return;
      }
      const isPrincipalAndInterestSchedule = 
        this.typeOfStatement === GenerateCustomerStatementParams.GeneratePrincipalandInterestSchedule;
      
      this.scheduleType = isPrincipalAndInterestSchedule
        ? GenerateCustomerStatementParams.GeneratePrincipalandInterestSchedule
        : GenerateCustomerStatementParams.GenerateCustomerStatement;

      const requestParams: AssetTransactionParams = {
        ContractId: this.contractId,
      };

      const requestBody: CustomerStatementBody = {
        fromDate: this.fromDate,
        toDate: this.toDate,
        scheduleType: this.scheduleType,
      };

      const response = await this.commonapiService.generateCustomerStatement(
        requestParams,
        requestBody
      );
      if (!response || !response.documentId) {
        throw new Error('Invalid response from server');
      }
      const documentParams: DocumentByIdParams = {
        contractId: this.contractId,
        documentId: response.documentId,
      };
      const document = await this.fetchDocumentById(documentParams);

      if (!document) {
        throw new Error('Failed to fetch document');
      }

      downloadBase64File(document);

      const successMessage =
        'Your statement has been successfully generated. You can also view and download it from the Documents tab of your loan.';
      
      this.showSuccessDialog(successMessage);
    } catch (error) {
      console.error('Error generating customer statement:', error);
      this.toasterService.showToaster({
        severity: 'error',
        detail:
          'There was an error submitting your Request. Please try again or contact UDC on 0800 500 832',
      });
    }
  }

  async fetchDocumentById(params: DocumentByIdParams): Promise<any> {
    const document = await this.commonapiService.getDocumentById(params);
    return document;
  }

  private showSuccessDialog(message: string): void {
    this.svc.dialogSvc
      .show(AcknowledgmentPopupComponent, ' ', {
        templates: {
          footer: null,
        },
        data: {
          message: message,
        },
        height: '25vw',
        width: '35vw',
        contentStyle: { overflow: 'auto' },
        styleClass: 'dialogue-scroll',
        position: 'center',
      })
      .onClose.pipe(takeUntil(this.destroy$))
      .subscribe((data: CloseDialogData) => {
        this.ref.close(data);
      });
  }
}
