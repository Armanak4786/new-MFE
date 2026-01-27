import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import {
  CommonService,
  GenericDialogService,
  GenTableComponent,
  PrintService,
} from 'auro-ui';
@Component({
  selector: 'app-facility-summary',
  templateUrl: './facility-summary.component.html',
  styleUrl: './facility-summary.component.scss',
})
export class FacilitySummaryComponent {
  @Input() facilityType;
  @Input() todaysActivityColDef;
  @Input() assetSummaryColDef;
  @Input() facilitySummaryDatalist;

  constructor(
    public svc: CommonService,
    public dialogSVC: GenericDialogService,
    // public dialogService: DialogService,
    // public facilityAsset: FacilityAssetsService,
    public printSer: PrintService
  ) {}

  ngOnChanges(changes) {
    if (changes['assetSummaryColDef']) {
    }
  }
  onCellClick(event) {}
}
