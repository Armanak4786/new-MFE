import { Component, OnInit } from '@angular/core';
import { CommonService } from 'auro-ui';
import { GenericDialogService } from 'auro-ui';
import { FacilityAssetsService } from '../../../assetlink/services/facility-assets.service';

import { Router } from '@angular/router';
import { BailmentComponentLoaderService } from '../../../bailments/services/bailment-component-loader.service';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { associatedAssetsColumnDefs } from '../../../creditlines/utils/creditline-header-definition';

@Component({
  selector: 'app-facility-assets-actions',
  template: `
    <div class="flex-column cursor-pointer">
      <div
        class="flex justify-content-center action-item padding-class"
        *ngIf="hasAccess('perform_requests')"
        (click)="releaseSecurity($event)"
      >
        {{ 'release_security' | translate }}
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
export class FacilityAssetsActionsComponent implements OnInit {
  data: any = [];
  releasecolumnDefs = associatedAssetsColumnDefs;
  facilityType: any;
  accessGranted;
  assetsDataList;
  constructor(
    public svc: CommonService,
    public dialogSVC: GenericDialogService,
    public facilityAssets: FacilityAssetsService,
    private router: Router,
    public bailmentComponentLoaderService: BailmentComponentLoaderService,
    public commonSetterGetterSvc: CommonSetterGetterService
  ) {}

  ngOnInit() {
    const roleBased = JSON.parse(sessionStorage.getItem('RoleBasedActions'));
    if (
      roleBased &&
      roleBased.functions &&
      typeof roleBased.functions === 'object'
    ) {
      this.accessGranted = Object.keys(roleBased.functions).map((fn) =>
        fn.trim()
      );
    } else {
      this.accessGranted = [];
    }
    this.assetsDataList = this.bailmentComponentLoaderService.getData();
    this.facilityAssets.facilityAssetToRelease.subscribe((data: any) => {
      this.data = data;
    });
    this.facilityType = this.assetsDataList[0].facilityType;
  }

  releaseSecurity(event: any) {
    const assetDetailList = Array.isArray(this.data) ? this.data : [this.data];

    // Data Stored in the service
    this.facilityAssets.setData(assetDetailList);

    if (this.facilityType == 'AssetLink') {
      this.svc.router.navigateByUrl('assetlink/releaseSecurityRequest');
    } else if (this.facilityType == 'EasyLink') {
      this.svc.router.navigateByUrl('easylink/releaseSecurityRequest');
    }
  }

  hasAccess(key) {
    if (!this.accessGranted || !Array.isArray(this.accessGranted)) {
      return true;
    }
    return !this.accessGranted?.includes(key);
  }
}
