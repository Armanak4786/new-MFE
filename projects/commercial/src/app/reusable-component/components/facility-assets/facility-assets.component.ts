import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import {
  CommonService,
  GenericDialogService,
  GenTableComponent,
  PrintService,
} from 'auro-ui';
import { DialogService } from 'primeng/dynamicdialog';
import { FacilityAssetsService } from '../../../assetlink/services/facility-assets.service';
import { NgForm } from '@angular/forms';
import { BailmentComponentLoaderService } from '../../../bailments/services/bailment-component-loader.service';
import { FacilityType } from '../../../utils/common-enum';
import { TranslateService } from '@ngx-translate/core';
import {
  buildSheetData,
  exportWorkbook,
  printTable,
} from '../../../utils/common-utils';

@Component({
  selector: 'app-facility-assets',
  templateUrl: './facility-assets.component.html',
  styleUrl: './facility-assets.component.scss',
})
export class FacilityAssetsComponent {
  @Input() columnsFacilityAsset;
  @Input() facilityAsssetsDatalist;
  @Input() facilityType;
  @Input() searchLabel: string = 'assetNumber';
  @ViewChild('dt')
  dt: GenTableComponent;
  rowData: any[] = [];
  selectionMode: any;
  tableId: string = 'Associated Assets';
  searchAsset = '';
  leaseId: number = null;
  searchfacilityAssetErrorMessage = null;
  accessGranted;

  constructor(
    public svc: CommonService,
    public dialogSVC: GenericDialogService,
    public dialogService: DialogService,
    public facilityAsset: FacilityAssetsService,
    public printSer: PrintService,
    public bailmentComponentLoaderService: BailmentComponentLoaderService,
    public translateService: TranslateService
  ) {}

  ngOnChanges(changes) {
    if (changes['facilityAsssetsDatalist']) {
      this.rowData = this.facilityAsssetsDatalist;
    }
  }

  onCellClick(event) {
    const rowWithType = {
      ...event.rowData,
      facilityType: this.facilityType,
    };
    this.facilityAsset.pushDataToRelease(rowWithType); // push enriched row
    this.bailmentComponentLoaderService.setData([rowWithType]);
    if (FacilityType.Bailment_Group === this.facilityType) {
      this.getBailmentEvaluated(event);
    } else if (this.facilityType === FacilityType.FixedFloorPlan_Group) {
      this.getFixedFloorPlanEvaluated(event);
    } else if (this.facilityType === FacilityType.CreditLines) {
      this.getCreditlineEvaluated(event);
    }
    if (FacilityType.Assetlink === this.facilityType) {
      this.getAssetlinkEvaluated(event);
    } else if (FacilityType.Easylink === this.facilityType) {
      this.getEasylinkEvaluated(event);
    }
  }

  getBailmentEvaluated(event) {
    if (event.colName == 'contractId') {
      this.svc.router.navigateByUrl(
        `/bailment/asset-details/${event.rowData.contractId}`
      );
    }
  }
  getFixedFloorPlanEvaluated(event) {
    if (event.colName == 'contractId') {
      this.svc.router.navigateByUrl(
        `/fixedfloorplan/asset-details/${event.rowData.contractId}`
      );
    }
  }
  getCreditlineEvaluated(event) {
    console.log(event.rowData);
    if (event.colName == 'contractId') {
      this.svc.router.navigateByUrl(
        `/creditlines/loan/${event.rowData.contractId}`
      );
    }
  }
  getAssetlinkEvaluated(event) {
    console.log(event.rowData);
    if (event.colName == 'contractId') {
      this.svc.router.navigateByUrl(
        `/assetlink/loan/${event.rowData.contractId}`
      );
    }
  }
  getEasylinkEvaluated(event) {
    console.log(event.rowData);
    if (event.colName == 'contractId') {
      this.svc.router.navigateByUrl(
        `/easylink/loan/${event.rowData.contractId}`
      );
    }
  }
  onPrint() {
    //Default Landscape
    printTable(
      this.columnsFacilityAsset,
      this.facilityAsssetsDatalist,
      this.translateService
    );
  }

  onGetAssetValue(event) {
    this.searchAsset = event;
    console.log(event);
  }

  export() {
    const tableId = this.tableId;
    const dt = this.dt;
    if (!tableId || !dt) {
      console.error('Table ID or data is missing');
      return;
    }

    const workbookData = [];
    workbookData.push(
      buildSheetData({
        sheetName: 'Sheet 1',
        columns: dt.columns,
        dataList: dt.dataList,
        translateService: this.translateService,
        excludedFields: ['actions'],
      })
    );

    // Call exportMultipleSheets with single sheet object
    this.printSer.export('xlsx', tableId, workbookData);
  }

  onAssetSearch() {
    if (this.searchAsset) {
      const searchTerm = this.searchAsset.toLowerCase();
      if (!/^\d+$/.test(searchTerm)) {
        this.searchfacilityAssetErrorMessage =
          'The provided search asset value must be numeric.';
        this.facilityAsssetsDatalist = []; // Clear previous results on error
      } else {
        this.searchfacilityAssetErrorMessage = '';
        this.facilityAsssetsDatalist = this.rowData.filter((item) => {
          return item.assetNo?.toString().toLowerCase().includes(searchTerm);
        });
      }
    } else {
      this.facilityAsssetsDatalist = this.rowData;
      this.searchfacilityAssetErrorMessage = 'Please enter valid asset number';
    }
  }
  reset() {
    this.searchAsset = '';
    this.facilityAsssetsDatalist = [...this.rowData];
    this.searchfacilityAssetErrorMessage = '';
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
  }
   getFacilityTypeLabel(facilityType: string): string {
    if (!facilityType) return '';
    const type = facilityType;
    switch (type) {
      case 'AssetLink':
        return 'Assetlink Facility';
      case 'EasyLink':
        return 'Easylink Facility';
      case 'CreditLines':
        return 'Creditline Facility';
      case 'OperatingLease':
        return 'Operating Lease';
      default:
        return facilityType;
    }
  }
}
