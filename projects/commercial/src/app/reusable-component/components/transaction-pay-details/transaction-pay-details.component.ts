import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { CommonApiService } from '../../../services/common-api.service';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { TransactionAllocationParams } from '../../../utils/common-interface';
import { transationPaymentDetailsColumnDefs } from '../../../utils/common-header-definition';

@Component({
  selector: 'app-transaction-pay-details',
  templateUrl: './transaction-pay-details.component.html',
  styleUrls: ['./transaction-pay-details.component.scss'],
})
export class TransactionPayDetailsComponent implements OnInit, OnDestroy {
  transationPaymentDetailsdataList: any;
  transationPaymentDetailsColumnDefs = transationPaymentDetailsColumnDefs;
  transactionId: number;
  partyId: number;

  private subscriptions = new Subscription();
  private lastFetchedTransactionId: number | null = null;

  constructor(
    public commonSetterGetterService: CommonSetterGetterService,
    private commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService
  ) {}

  ngOnInit() {
    // Subscribe to party changes and track partyId
    this.subscriptions.add(
      this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
        this.partyId = currentParty?.id;
      })
    );

    // Subscribe to transactionId changes, fetch only if changed
    this.subscriptions.add(
      this.commonSetterGetterService
        .getTransactionIdData()
        .pipe(distinctUntilChanged())
        .subscribe((id) => {
          if (id && this.lastFetchedTransactionId !== id) {
            this.transactionId = id;
            this.lastFetchedTransactionId = id;

            const params: TransactionAllocationParams = {
              transactionId: this.transactionId,
            };
            this.fetchTransactionAllocatedTab(params);
          }
        })
    );
  }

  async fetchTransactionAllocatedTab(params: TransactionAllocationParams) {
    try {
      this.transationPaymentDetailsdataList =
        await this.commonApiService.getTransactionAllocatedDetails(params);
    } catch (error) {
      console.error('Error while loading payment allocated data', error);
    }
  }

  ngOnDestroy() {
    // Unsubscribe all subscriptions to prevent memory leaks and duplicate calls
    this.subscriptions.unsubscribe();
  }
}
