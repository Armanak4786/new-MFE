import { Component } from '@angular/core';
import { CommonService } from 'auro-ui';
import { GenericDialogService } from 'auro-ui';
import { ProductTransferRequestComponent } from './product-transfer-request.component';
import { FacilityAssetsService } from '../../../assetlink/services/facility-assets.service';
import { BailmentComponentLoaderService } from '../../services/bailment-component-loader.service';

@Component({
  selector: 'app-productTransfer-facility-assets-actions',
  template: `
    <div class="flex-column cursor-pointer">
      <div
        class="flex justify-content-center action-item padding-class"
        (click)="productTransferRequest()"
      >
        Product Transfer Request
      </div>
      <div class="flex justify-content-left action-item padding-class">
        Purchase Asset Request
      </div>
      <div class="flex justify-content-left action-item padding-class">
        Swap Request
      </div>
    </div>
  `,
  styles: [
    `
      .action-item {
        transition: background-color 0.3s, color 0.3s;
      }
      ::ng-deep {
        .p-overlaypanel .p-overlaypanel-content {
          padding-top: 0.8rem;
          padding-bottom: 0.8rem;
          padding-left: 0.9rem;
          padding-right: 0.9rem;
        }
      }
      .action-item:hover {
        background-color: var(
          --primary-color
        ); /* Change to your desired background color */
        color: white; /* Change to your desired text color */
      }
    `,
  ],
})
export class productTransferfacilityassetsactions {
  assetList = [];
  constructor(
    public svc: CommonService,
    public dialogSVC: GenericDialogService,
    public facilityAssetsService: FacilityAssetsService,
    public bailmentComponentLoaderService: BailmentComponentLoaderService
  ) {}
  ngOnInIt() {}

  productTransferRequest() {
    this.assetList = this.bailmentComponentLoaderService.getData();

    this.svc.dialogSvc
      .show(ProductTransferRequestComponent, 'Product Transfer', {
        templates: {
          footer: null,
        },
        data: this.assetList,
        width: '78vw',
        height: '70vw',
      })
      .onClose.subscribe((data: any) => {});
  }
}
