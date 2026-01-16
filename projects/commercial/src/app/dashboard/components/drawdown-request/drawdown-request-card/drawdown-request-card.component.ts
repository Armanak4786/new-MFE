import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { CommonService, GenericFormConfig } from 'auro-ui';
import { BaseDashboardClass } from '../../../base-dashboard.class';
import { DrawdownService } from '../../../drawdown.service';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';
import { BaseDashboardServiceService } from '../../../services/base-dashboard-service.service';

@Component({
  selector: 'app-drawdown-request-card',
  templateUrl: './drawdown-request-card.component.html',
  styleUrls: ['./drawdown-request-card.component.scss'],
})
export class DrawdownRequestCardComponent extends BaseDashboardClass {
  public facilityValue: any;
  financialSummaryData;
  facilityTypeOptionList = [];
  facilityOptionList = [];
  loanList = [];
  override formConfig: GenericFormConfig = {
    autoResponsive: true,
    api: ``,
    goBackRoute: '',
    cardType: 'non-border',
    fields: [
      {
        type: 'dropdown',
        label: 'Facility Type',
        name: 'facilityType',
        labelClass: 'drawdown-label pb-1',
        className: 'drawdown_details_card',
        alignmentType: 'vertical',
        validators: [Validators.required],
        cols: 4,
        nextLine: false,
        options: [
          { label: 'AssetLink', value: 'Asset Link' },
          { label: 'EasyLink', value: 'Easy Link' },
          { label: 'Operating Lease', value: 'Operating Lease' },
          { label: 'Floating Floorplan', value: 'Floating Floorplan' },
          { label: 'Fixed Floorplan', value: 'Fixed Floorplan' },
          { label: 'Bailments', value: 'Bailments' },
          { label: 'CreditLines', value: 'CreditLines' },
          { label: 'Buyback Facility', value: 'Buyback Facility' },
          { label: 'Non facility loan', value: 'Non facility loan' },
          { label: 'Originator Account', value: 'Originator Account' },
        ],
        // options: this.facilityTypeOptionList,
      },
      {
        type: 'dropdown',
        label: 'Facility',
        labelClass: 'drawdown-label pb-1',
        name: 'facility',
        className: 'drawdown_details_card',
        alignmentType: 'vertical',
        cols: 4,
        validators: [Validators.required],
        nextLine: false,
        options: [
          { label: 'Facility1', value: 'Facility1' },
          { label: 'Facility2', value: 'Facility2' },
          { label: 'Current Account', value: 'Current Account' },
          { label: 'Facility4', value: 'Facility4' },
        ],
        // options: this.facilityOptionList,
      },
      {
        type: 'dropdown',
        label: 'Loan',
        labelClass: 'drawdown-label pb-1',
        name: 'loan',
        className: 'drawdown_details_card',
        alignmentType: 'vertical',
        cols: 4,
        validators: [Validators.required],
        nextLine: false,
        options: [{ label: 'newLoan', value: 'newLoan' }],
        // options: this.loanList
        errorMessage: 'Please select a Loan',
      },
    ],
  };

  constructor(
    public formDataService: DrawdownService,
    public override svc: CommonService,
    public override route: ActivatedRoute,
    public override baseSvc: BaseDashboardServiceService,
    public dashSvc: DashboardService
  ) {
    super(route, svc, baseSvc);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();

    this.financialSummaryData = this.dashSvc.getFinancialSummaryData();
    this.getFacilityTypeList();
  }

  getFacilityTypeList() {
    const allTypeMap = {
      AssetLink: 'assetLinkDetails',
      EasyLink: 'easyLinkDetails',
      Bailments: 'bailmentDetails',
      BuyBack: 'buybackDetails',
      CreditLine: 'creditlineDetails',
      FixedFloorPlan: 'fixedFloorplanDetails',
      FloatingFloorPlan: 'floatingFloorplanDetails',
      IntroducerTransactionSummary: 'introducerTransactionDetails',
      NonFacilityLoan: 'nonFacilityLoansDetails',
      OperatingLease: 'operatingLeaseDetails',
    };

    // Step 1: Filter only those types that exist in financialSummaryData
    const typeMap = Object.fromEntries(
      Object.entries(allTypeMap).filter(
        ([_, key]) => key in this.financialSummaryData
      )
    );

    // Step 2: Create facilityType array
    this.facilityTypeOptionList = Object.keys(typeMap).map((key) => ({
      label: key,
      value: key,
    }));
    this.mainForm?.updateList('facilityType', this.facilityTypeOptionList);
  }

  override onButtonClick($event) {}

  override onFormEvent(event) {
    if (event.name == 'facilityType') {
      // this.mainForm.form.controls['facility'].reset();
      // this.mainForm.form.controls['loan'].reset();
      this.facilityValue = event.value;
      this.facilityOptionList = this.updateFacilityList(event.value);
      this.mainForm?.updateList('facility', this.facilityOptionList);
    }
    if (event.name == 'facility') {
      this.loanList = this.getLoansByFacility(event.value);
      this.mainForm?.updateList('loan', this.loanList);
    }
    this.facilityValue = event.value;
    super.onFormEvent(event);
  }

  updateFacilityList(event) {
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

    const facilityList = [];

    // Check if event matches a type in typeMap
    if (event in typeMap) {
      const listKey = typeMap[event];

      // Check if the corresponding key exists in financialSummaryData
      if (this.financialSummaryData.hasOwnProperty(listKey)) {
        const items = this.financialSummaryData[listKey];

        // Iterate over the items and extract facilityName if it exists
        items.forEach((item) => {
          if (item.facilityName) {
            facilityList.push({
              label: item.facilityName,
              value: item.facilityName,
            });
          }
        });
      }
    }
    return facilityList;
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
      'Non-facility loan': 'nonFacilityLoansDetails',
      OperatingLease: 'operatingLeaseDetails',
    };

    const facilityKey =
      typeMap[this.mainForm.form.controls['facilityType'].value];
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
  override onValueChanges(event) {}

  override onFormReady() {
    this.mainForm?.form.valueChanges.subscribe((value) => {
      this.formDataService.updateFormData(this.mainForm?.form?.value);
    });
  }
}
