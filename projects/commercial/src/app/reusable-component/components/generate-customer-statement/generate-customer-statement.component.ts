import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-generate-customer-statement',
  //standalone: true,
  //imports: [],
  templateUrl: './generate-customer-statement.component.html',
  styleUrls: ['./generate-customer-statement.component.scss'],
})
export class GenerateCustomerStatementComponent implements OnInit {
  contractId;
  fromDate;
  toDate;
  typeOfStatement;
  scheduleType;

  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    public commonapiService: CommonApiService,
    public toasterService: ToasterService,
    public svc: CommonService,
    public ref: DynamicDialogRef
  ) {}

  async ngOnInit() {
    this.contractId = this.dynamicDialogConfig?.data?.contractId;
    this.typeOfStatement = this.dynamicDialogConfig?.data?.typeOfStatement;
  }
  onFromDateChange(event: any) {
    this.fromDate = event?.target?.value;
  }

  onToDateChange(event: any) {
    this.toDate = event?.target?.value;
  }

  async generateStatement() {
    try {
      if (this.typeOfStatement === GenerateCustomerStatementParams.GeneratePrincipalandInterestSchedule) {
        this.scheduleType = GenerateCustomerStatementParams.GeneratePrincipalandInterestSchedule;
      } else {
        this.scheduleType = GenerateCustomerStatementParams.GenerateCustomerStatement;
      }
      const generateCustomerStatementParams: AssetTransactionParams = {
        ContractId: this.contractId,
      };

      const customerStatementBody: CustomerStatementBody = {
        fromDate: this.fromDate,
        toDate: this.toDate,
        scheduleType: this.scheduleType,
      };

      const response = await this.commonapiService.generateCustomerStatement(
        generateCustomerStatementParams,
        customerStatementBody
      );
      const message =
        'Your statement has been successfully generated. You can also view and download it from the Documents tab of your loan.';
      const params = {
        contractId: this.contractId,
        documentId: response.documentId,
      };
      const document = await this.fetchDocumentById(params);
      downloadBase64File(document);
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
        .onClose.subscribe((data: CloseDialogData) => {
          this.ref.close(data);
        });
    } catch (error) {
      console.error('Error generating customer statement:', error);
      this.toasterService.showToaster({
        severity: 'error',
        detail:
          'There was an error submitting your Request. Please try again or contact UDC on 0800 500 832',
      });
    }
  }

  async fetchDocumentById(params: DocumentByIdParams) {
    try {
      const document = await this.commonapiService.getDocumentById(params);
      return document;
    } catch (error) {
      console.log('Error while loadding document by Id data', error);
    }
  }
}
