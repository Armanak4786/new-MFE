import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { AssociatedAssetsActionsComponent } from './associated-assets-actions.component';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FacilityAssetsService } from '../../../assetlink/services/facility-assets.service';

@Component({
  selector: 'app-associated-assets',
  //standalone: true,
  //imports: [],
  templateUrl: './associated-assets.component.html',
  styleUrls: ['./associated-assets.component.scss']
})
export class AssociatedAssetsComponent {
  facilityType;
  associatedAssetsDataList;
  associatedAsetscolumnDefs;
  filteredAssetsDataList;
  filteredAssetsDataListToRelease = [];
  constructor(
    private router: Router,
    public ref: DynamicDialogRef,
    public dynamicDialogConfig: DynamicDialogConfig,
    public facilityAsset: FacilityAssetsService,
  ) {
    if (this.dynamicDialogConfig?.data) {
      this.filteredAssetsDataList = [];
      this.associatedAssetsDataList = this.dynamicDialogConfig.data.assetDetailList;
      this.associatedAsetscolumnDefs =
        this.dynamicDialogConfig.data.assetReleasecolumnDefs;
    }
  }

  ngOnInit(): void {
    this.facilityType = this.dynamicDialogConfig.data.facilityType;
  }
  //   @Input() associatedAssetsDataList;
  //   @Input() associatedAsetscolumnDefs;

  // ngOnInit(){
  //   console.log(this.associatedAsetscolumnDefs);
  //   console.log(this.associatedAssetsDataList)
  // }
  onCancelClick() {
    this.ref.close();
  }
}
