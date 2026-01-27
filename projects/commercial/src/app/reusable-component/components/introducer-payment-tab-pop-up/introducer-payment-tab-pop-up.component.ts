import { Component, Input } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonApiService } from '../../../services/common-api.service';
import { paymentHeaders, transactionHeaders } from '../../../utils/common-enum';

@Component({
  selector: 'app-introducer-payment-tab-pop-up',
  templateUrl: './introducer-payment-tab-pop-up.component.html',
  styleUrl: './introducer-payment-tab-pop-up.component.scss',
})
export class IntroducerPaymentTabPopUpComponent {
  records;
  transactions;
  paymentHeaders = paymentHeaders
  transactionHeaders = transactionHeaders
  isPaymentTab
  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    private commonApiService: CommonApiService
    ) {}

  ngOnInit() {
    if(this.dynamicDialogConfig?.data?.transactionId){
      this.isPaymentTab = false;
      this.fetchTransactions(this.dynamicDialogConfig?.data?.transactionId)
    }else{
      this.isPaymentTab = true;
      this.buildRecords();
    }
  }

   buildRecords() {
    const source = this.dynamicDialogConfig?.data?.data || [];

   this.records = source.map((item: any) => ({
      Date: item?.date,
      Transaction: item?.transaction,
      Description: item?.description,
      Asset:  '',
      Reg: item.rego ||item.vin || item.chassis_no ||'',
      Dealer: item?.dealer,
      Amount: item?.amount
    }));
  }

  async fetchTransactions(transactionId){
    const params = {transactionId:transactionId}
    this.transactions = await this.commonApiService.getTransactionAllocatedDetails(params)
  }
}
