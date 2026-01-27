import { Component } from '@angular/core';
import {
  productTransferRegistrationNumberSubmissionColumnDefs,
  productTransferSubmissionColumnDefs,
  purchaseassetrequestSubmissionColumnDefs,
  swaprequestSubmissionColumnDefs,
} from '../../utils/bailment-header.utils';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonService } from 'auro-ui';
import { Router } from '@angular/router';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';

@Component({
  selector: 'app-transfer-request-submission',
  templateUrl: './transfer-request-submission.component.html',
  styleUrls: ['./transfer-request-submission.component.scss'],
})
export class TransferRequestSubmissionComponent {
  productTransferTo;
  productTransferSubmissionList;
  requestNumber: any;
  searchBy;
  productTransferSubmissionColumnDefs = productTransferSubmissionColumnDefs;
  pageFrom;
  receiverParty;
  additionalMsg: boolean = false;
  typeofrequest;
  constructor(
    public ref: DynamicDialogRef,
    public svc: CommonService,
    private router: Router,
    public dynamicDialogConfig: DynamicDialogConfig,
    public commonSetterGetterSvc: CommonSetterGetterService
  ) {}

  ngOnInit() {
    this.productTransferTo = this.dynamicDialogConfig?.data?.productTransferTo;
    this.requestNumber = this.dynamicDialogConfig?.data?.RequestNumber;
    this.searchBy = this.dynamicDialogConfig?.data?.searchedBy;
    this.productTransferSubmissionList =
      this.dynamicDialogConfig?.data?.filteredProductTransferResponseList;
    this.pageFrom = this.dynamicDialogConfig?.data?.pageFrom;
    this.receiverParty = this.dynamicDialogConfig?.data?.receiverParty;
    this.additionalMsg = this.dynamicDialogConfig?.data?.additionalMsg;
    if (this.searchBy && this.searchBy != 17) {
      this.productTransferSubmissionColumnDefs =
        productTransferRegistrationNumberSubmissionColumnDefs;
    }
    if (this.dynamicDialogConfig?.data?.assetColumnDefs) {
      this.productTransferSubmissionColumnDefs =
        this.dynamicDialogConfig?.data?.assetColumnDefs;
    }
    if (this.pageFrom == 'swap') {
      this.productTransferSubmissionColumnDefs =
        swaprequestSubmissionColumnDefs;
    }
    if (this.pageFrom == 'purchase-asset') {
      this.productTransferSubmissionColumnDefs =
        purchaseassetrequestSubmissionColumnDefs;
    }
  }

  onCellClick(event) {
    //this.commonSetterGetterSvc.setTransferRequestContract(event.rowData);
  }
  backToDashboard() {
    this.router.navigate(['bailment']);
    this.svc?.dialogSvc?.ref?.close();
  }
}
