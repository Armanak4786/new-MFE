import { Component } from '@angular/core';
import { PaymentAllocationParams } from '../../../utils/common-interface';
import { CommonApiService } from '../../../services/common-api.service';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { paymentDetailsColumnDefs } from '../../../utils/common-header-definition';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrl: './payment-details.component.scss',
})
export class PaymentDetailsComponent {
  paymentId;
  paymentDetailscolumnDefs = paymentDetailsColumnDefs;
  paymentAllocatedDetails;
  partyId: number;
  allocatedTransactions;
  paymentIdFromSync;
  constructor(
    private commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService
  ) {}

  ngOnInit() {
    this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
      this.partyId = currentParty?.id;
    });

    this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
      this.partyId = currentParty?.id;
    });
    this.commonSetterGetterSvc.getPaymentIdData().subscribe(paymentId => {
                    this.paymentIdFromSync = paymentId;
});

    // const paymentIdFromSync = this.commonSetterGetterSvc.getPaymentIdData()

    if (this.paymentIdFromSync) {
      // this.paymentId = this.paymentIdFromSync;
      this.fetchAllocatedPaymentsTab({ paymentId: this.paymentIdFromSync });
    }

    this.commonSetterGetterSvc.paymentId
      .pipe(distinctUntilChanged())
      .subscribe((id) => {
        if (id && id !== this.paymentId) {
          this.paymentId = id;
          this.fetchAllocatedPaymentsTab({ paymentId: this.paymentId });
        }
      });
  }

  async fetchAllocatedPaymentsTab(params: PaymentAllocationParams) {
    try {
      this.paymentAllocatedDetails =
        await this.commonApiService.getPaymentAllocatedDetails(params);
    } catch (error) {
      console.log('Error while loading payment allocated data', error);
    }
  }
}
