import { Component } from '@angular/core';
import { BaseAssetlinkClass } from '../../base-assetlink.class';
import { CommonService, GenericFormConfig } from 'auro-ui';
import { ActivatedRoute } from '@angular/router';
import { BaseAssetlinkService } from '../../services/base-assetlink.service';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import { Validators } from '@angular/forms';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DrawdownService } from '../../../drawdown.service';
@Component({
  selector: 'app-drawdown-request-card',
  templateUrl: './drawdown-request-card.component.html',
  styleUrl: './drawdown-request-card.component.scss',
})
export class DrawdownRequestCardComponent extends BaseAssetlinkClass {
  facilityType;
  facilityList;
  financialSummaryData;
  facilityTypeOptionList = [];
  facilityOptions = [];
  selectedSubFacility;
  loanOptions = [];
  constructor(
    public formDataService: DrawdownService,
    public override svc: CommonService,
    public override route: ActivatedRoute,
    public override baseSvc: BaseAssetlinkService,
    private dashSvc: DashboardService,
    public commonSetterGetterService: CommonSetterGetterService,
    public dynamicDialogConfig: DynamicDialogConfig
  ) {
    super(route, svc, baseSvc);
  }
  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.facilityType = this.dynamicDialogConfig?.data?.facilityType;

    if (this.dynamicDialogConfig.data?.subfacility?.facilityName) {
      this.selectedSubFacility =
        this.dynamicDialogConfig.data.subfacility.facilityName;
    }
    this.commonSetterGetterService.facilityList$.subscribe((data) => {
      this.facilityList = data;
    });
    this.financialSummaryData = this.dashSvc.getFinancialSummaryData();
    this.getMatchingFacility(this.facilityType);
  }

  getMatchingFacility(facilityType) {
    this.facilityList.forEach((item) => {
      if (item.value === facilityType) {
        this.facilityTypeOptionList.push(item);
      }
    });
  }

  override formConfig: GenericFormConfig = {
    autoResponsive: true,
    api: ``,
    goBackRoute: '',
    cardType: 'non-border',
    fields: [
      {
        type: 'dropdown',
        label: 'facility_type',
        name: 'facilityType',
        labelClass: 'drawdown-label pb-2',
        alignmentType: 'vertical',
        validators: [Validators.required],
        className: 'drawdown_details_card',
        cols: 4,
        nextLine: false,
        options: this.facilityTypeOptionList,
        errorMessage: 'Please select facility type',
      },
      {
        type: 'dropdown',
        label: 'facility',
        labelClass: 'drawdown-label pb-2',
        name: 'facility',
        alignmentType: 'vertical',
        cols: 4,
        validators: [Validators.required],
        className: 'drawdown_details_card',
        nextLine: false,
        options: this.facilityOptions,
        errorMessage: 'Please select facility',
      },
      {
        type: 'dropdown',
        label: 'loan',
        labelClass: 'drawdown-label pb-2',
        name: 'loan',
        alignmentType: 'vertical',
        cols: 4,
        validators: [Validators.required],
        className: 'drawdown_details_card',
        nextLine: false,
        options: this.loanOptions,
        errorMessage: 'Please select a Loan',
      },
    ],
  };

  override onFormEvent(event) {
    if (event.name == 'facilityType') {
      this.facilityOptions = this.getFacilitiesByType(event.value);
      this.mainForm?.updateList('facility', this.facilityOptions);
    }
    if (event.name == 'facility') {
      if (event.value) {
        this.loanOptions = this.getLoansByFacility(event.value);
        this.mainForm?.updateList('loan', this.loanOptions);
      }
    }
    super.onFormEvent(event);
  }

  getLoansByFacility(value) {
    const typeMap = {
      AssetLink: 'assetLinkDetails',
      EasyLink: 'easyLinkDetails',
      Bailments: 'bailmentDetails',
      BuyBack: 'buybackDetails',
      'Credit Lines': 'creditlineDetails',
      FixedFloorPlan: 'fixedFloorplanDetails',
      FloatingFloorPlan: 'floatingFloorplanDetails',
      IntroducerTransactionSummary: 'introducerTransactionDetails',
      'Non Facility Loan': 'nonFacilityLoansDetails',
      OperatingLease: 'operatingLeaseDetails',
    };

    const facilityKey = typeMap[this.facilityType];
    const financialData = this.financialSummaryData?.[facilityKey];

    if (value === 'Current Account' && Array.isArray(financialData)) {
      const matchedItems = financialData.filter((item) => {
        const name = (item.facilityName || '').toLowerCase().trim();
        return (
          name.includes('current account') && item.contractId !== undefined
        );
      });

      if (matchedItems.length > 0) {
        return matchedItems.map((item) => ({
          label: item.contractId,
          value: item.contractId,
        }));
      }
    }

    return [{ label: 'New Loan', value: 'New Loan' }];
  }

  getFacilitiesByType(value) {
    const typeMap = {
      AssetLink: 'assetLinkDetails',
      EasyLink: 'easyLinkDetails',
      Bailments: 'bailmentDetails',
      BuyBack: 'buybackDetails',
      'Credit Lines': 'creditlineDetails',
      FixedFloorPlan: 'fixedFloorplanDetails',
      FloatingFloorPlan: 'floatingFloorplanDetails',
      IntroducerTransactionSummary: 'introducerTransactionDetails',
      'Non-facility loan': 'nonFacilityLoansDetails',
      OperatingLease: 'operatingLeaseDetails',
    };

    const dataKey = typeMap[value];
    if (!dataKey || !this.financialSummaryData[dataKey]) {
      return [];
    }
    if (
      this.selectedSubFacility !== '' &&
      this.selectedSubFacility !== undefined
    ) {
      return [
        {
          label: this.selectedSubFacility,
          value: this.selectedSubFacility,
        },
      ];
    } else {
      return this.financialSummaryData[dataKey]
        .filter((item) => item && item.facilityName && item.id) // skip empty or invalid objects
        .map((item) => ({
          label: item.facilityName,
          value: item.facilityName,
          id: item.id,
        }));
    }
  }

  override onFormReady() {
    this.mainForm?.form.valueChanges.subscribe((value) => {
      this.formDataService.updateFormData(this.mainForm?.form?.value);
    });
  }
}
