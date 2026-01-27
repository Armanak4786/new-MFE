import { Component } from '@angular/core';
import { FacilityType } from '../../../utils/common-enum';
import { bailmentProductTransferRequestColumnDefs } from '../../utils/bailment-header.utils';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonService } from 'auro-ui';
import { BailmentComponentLoaderService } from '../../services/bailment-component-loader.service';
import { AssetsParams } from '../../../utils/common-interface';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { CommonApiService } from '../../../services/common-api.service';
import { DashboardSetterGetterService } from '../../../dashboard/services/dashboard-setter-getter.service';
import { CancelPopupComponent } from '../../../reusable-component/components/cancel-popup/cancel-popup.component';

@Component({
  selector: 'app-product-transfer-request',
  templateUrl: './product-transfer-request.component.html',
  styleUrls: ['./product-transfer-request.component.scss'],
})
export class ProductTransferRequestComponent {
  facilityType: string = FacilityType.Bailment;
  selectedOption: string = 'DEMO';
  bailmentProductTransferRequestColumnDefs =
    bailmentProductTransferRequestColumnDefs;

  bailmentsDataList: any[] = [];
  filteredAssetsDataList: any[] = [];
  subFailityOptionList: any[] = [];
  facilityAssetList: any[] = [];

  assetToSearch: string = '';
  partyId: number;

  selectedSubFacility: string;
  selectedSubFacilityID: number | null = null;

  disablebProceedButtonFlag: boolean = true;
  showAssetList: boolean = false;
  allBailmentsDataList: any[] = [];

  constructor(
    private router: Router,
    public ref: DynamicDialogRef,
    public svc: CommonService,
    public dynamicDialogConfig: DynamicDialogConfig,
    public bailmentComponentLoaderService: BailmentComponentLoaderService,
    private commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public dashboardSetterGetterSvc: DashboardSetterGetterService
  ) {}

  ngOnInit() {
    const data = this.dynamicDialogConfig.data;
    const bailmentList = data?.bailmentFacilityDataList || [];
    const clicked = data?.clickedSubfacility;
    const selected = data?.selectedSubFacility;

    if (bailmentList && !selected?.facilityName.trim()) {
      this.subFailityOptionList = bailmentList
        .filter((item) => item.facilityName?.trim())
        .map((item) => ({
          label: item.facilityName,
          value: item.facilityName,
          id: item.id,
        }));
    }
    if (selected?.facilityName.trim()) {
      this.setSelectedSubFacility(selected.facilityName, selected.id);
    } else if (
      (clicked?.subFacilityId && clicked?.subFacilityType) ||
      !selected
    ) {
      this.bailmentsDataList = this.bailmentComponentLoaderService.getData();
      this.fetchSubfacilityByContractId(this.bailmentsDataList[0].contractId);
      this.showAssetList = true;
      this.disablebProceedButtonFlag = true;
    }
    // this.commonSetterGetterSvc.party$.subscribe((party) => {
    //   this.partyId = party.id;
    // });
    this.partyId = JSON.parse(sessionStorage.getItem('currentParty'))?.id;
    if (selected?.facilityName && selected?.facilityType) {
      const params = {
        partyId: this.partyId,
        subFacilityId: selected.id,
      };
      this.fetchFacilityAssets(params);
      this.showAssetList = true;
    }
  }

  fetchSubfacilityByContractId(loanid: any) {
    // this.dashboardSetterGetterSvc.financialList$.subscribe((list) => {
    const financialList=JSON.parse(sessionStorage.getItem('financialSummaryData')||'[]');
      const bailmentDetails = financialList?.bailmentDetails ?? [];
      const matchingSubfacility = bailmentDetails.find(
        (item) => item.contractId === loanid
      );
      if (matchingSubfacility) {
        this.setSelectedSubFacility(
          matchingSubfacility.facilityName,
          matchingSubfacility.id
        );
      }
    // });
  }

  private setSelectedSubFacility(name: string, id: number) {
    const trimmedName = name?.trim();

    if (trimmedName) {
      this.selectedSubFacility = trimmedName;
      this.selectedSubFacilityID = id;

      const exists = this.subFailityOptionList.find((item) => item.id === id);
      if (!exists) {
        this.subFailityOptionList.push({
          label: trimmedName,
          value: trimmedName,
          id: id,
        });
      }
    }
  }

  async fetchFacilityAssets(params: AssetsParams) {
    try {
      const allAssets = await this.commonApiService.getAssetsData(params);
      const selected = this.selectedOption?.toLowerCase();

      const filteredAssets = allAssets.filter((asset) => {
        const status = asset.dealTypeName?.toLowerCase();
        if (!status || !selected) return false;

        if (selected === 'dpp') return ['demo', 'new'].includes(status);
        if (selected === 'demo') return status === 'new';
        return false;
      });
      this.allBailmentsDataList = filteredAssets;
      this.bailmentsDataList = [...filteredAssets];
    } catch (error) {
      console.error('Error loading assets:', error);
    }
  }

  onSearch() {
    const query = this.assetToSearch?.toLowerCase() || '';

    if (!query) {
      this.bailmentsDataList = [...this.allBailmentsDataList];
      return;
    }

    this.bailmentsDataList = this.allBailmentsDataList.filter(
      (item) =>
        item.assetNo?.toString().toLowerCase().includes(query) ||
        item.registrationNumber?.toLowerCase().includes(query) ||
        item.vehicleIdentificationNumber?.toLowerCase().includes(query)
    );
  }

  onCellClick(event) {
    const isSelected = event.cellData === true;
    const asset = event.rowData;

    if (isSelected) {
      if (!this.filteredAssetsDataList.includes(asset)) {
        this.filteredAssetsDataList.push(asset);
      }
    } else {
      this.filteredAssetsDataList = this.filteredAssetsDataList.filter(
        (a) => a.assetNo !== asset.assetNo
      );
    }

    this.disablebProceedButtonFlag = this.filteredAssetsDataList.length === 0;
  }

  onCancelClick() {
    this.unCheckFilteredAssetsList();
    // this.ref.close({ data: 'check' });
    this.svc.dialogSvc
      .show(CancelPopupComponent, '', {
        templates: {
          footer: null,
        },
        data: '',
        width: '30vw',
        height: '16vw',
      })
      .onClose.subscribe((data: any) => {
        if (data?.data == 'cancel') {
          this.ref.close();
        }
      });
  }

  onProceedClick() {
    if (
      this.disablebProceedButtonFlag ||
      this.filteredAssetsDataList.length === 0
    ) {
      return;
    }
    const params = {
      partyId: this.partyId,
      facilityType: 'Bailments',
      exculdeDealTypeId: this.selectedOption,
      subFacilityValue: this.selectedSubFacility,
      subFacilityId: this.selectedSubFacilityID,
      searchedBy: this.assetToSearch?.length,
    };

    if (
      this.dynamicDialogConfig.data.clickedSubfacility ||
      this.filteredAssetsDataList
    ) {
      this.unCheckFilteredAssetsList();
      // this.bailmentComponentLoaderService.setData(this.filteredAssetsDataList);
      sessionStorage.setItem('filteredAssetsDataList',JSON.stringify(this.filteredAssetsDataList));
      this.router.navigate(['bailment/productTransferDisclaimer'], {
        state: { params },
      });
      this.ref.close({ data: 'confirm' });
    }
  }

  searchInput(value: string) {
    this.assetToSearch = value;
  }

  onRadioChange(event: Event) {
    this.selectedOption = (event.target as HTMLInputElement).value;

    if (this.selectedSubFacilityID) {
      this.showAssetList = true;
      const params = {
        partyId: this.partyId,
        subFacilityId: this.selectedSubFacilityID,
      };
      if (this.dynamicDialogConfig.data.bailmentFacilityDataList) {
        this.fetchFacilityAssets(params);
      }
    }
  }

  subFacilityChange(event) {
    const selectedObj = this.subFailityOptionList.find(
      (x) => x.value === event?.value
    );
    const { id, value } = selectedObj;
    this.setSelectedSubFacility(value, id);

    const params = {
      partyId: this.partyId,
      subFacilityId: this.selectedSubFacilityID,
    };

    this.showAssetList = true;
    if (this.dynamicDialogConfig.data.bailmentFacilityDataList) {
      this.fetchFacilityAssets(params);
    }
  }

  //  subFacilityChange(event) {
  //   const selectedObj = this.subFailityOptionList.find(
  //     (x) => x.value === event?.value
  //   );
  //   this.selectedSubFacilityID = selectedObj?.id;
  //   this.selectedSubFacility = selectedObj?.value;
  //   const params = {
  //     partyId: this.partyId,
  //     subFacilityId:this.selectedSubFacilityID,
  //   };
  //   this.showAssetList = true;
  //   this.fetchFacilityAssets(params);
  // }

  private unCheckFilteredAssetsList() {
    this.filteredAssetsDataList.forEach((item) => {
      item.id = false;
    });
  }
}
