import { Component } from '@angular/core';
import { BaseAssetlinkClass } from '../../../assetlink/base-assetlink.class';
import { CommonService, GenericFormConfig } from 'auro-ui';
import { ActivatedRoute } from '@angular/router';
import { BaseAssetlinkService } from '../../../assetlink/services/base-assetlink.service';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import { Validators } from '@angular/forms';
import { DrawdownService } from '../../../drawdown.service';

@Component({
  selector: 'app-drawdown-request-card',
  templateUrl: './drawdown-request-card.component.html',
  styleUrls: ['./drawdown-request-card.component.scss'],
})
export class DrawdownRequestCardComponent extends BaseAssetlinkClass {
  formFieldFlag: any = '';
  financialSummaryData;
  facilityTypeOptions = [];
  facilityOptions = [];

  constructor(
    public formDataService: DrawdownService,
    public override svc: CommonService,
    public override route: ActivatedRoute,
    public override baseSvc: BaseAssetlinkService,
    private dashSvc: DashboardService
  ) {
    super(route, svc, baseSvc);
  }
  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.facilityTypeOptions = this.dashSvc.getFacilityTpe();

    console.log('this.facilityTypeOptions', this.facilityTypeOptions);

    this.financialSummaryData = this.dashSvc.getFinancialSummaryData();
    console.log('this.financialSummaryData', this.financialSummaryData);

    // for (const label in this.facilityType) {
    //   const key = this.keyMap[label];
    //   if (
    //     this.financialSummaryData[key] &&
    //     this.financialSummaryData[key].length > 0
    //   ) {
    //     this.facilityTypeOptions.push({
    //       label: label,
    //       value: this.facilityType[label],
    //     });
    //   }
    // }

    // console.log('checkResult', this.facilityTypeOptions);
    // console.log('this.facilityOptions???????', this.facilityOptions);
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
        labelClass: 'drawdown-label pb-1',
        alignmentType: 'vertical',
        validators: [Validators.required],
        className: 'drawdown_details_card',
        cols: 4,
        nextLine: false,
        options: this.facilityTypeOptions,
        errorMessage: 'Please select facility type',
      },
      {
        type: 'dropdown',
        label: 'facility',
        labelClass: 'drawdown-label pb-1',
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
        labelClass: 'drawdown-label pb-1',
        name: 'loan',
        alignmentType: 'vertical',
        cols: 4,
        validators: [Validators.required],
        className: 'drawdown_details_card',
        nextLine: false,
        options: [
          { label: 'New Loan', value: 'New Loan' },
          { label: 907352719, value: 907352719 },
          { label: 936528291, value: 936528291 },
          { label: 9753771961, value: 9753771961 },
        ],
        errorMessage: 'Please select a Loan',
      },
    ],
  };

  override onButtonClick($event) { }

  override onFormEvent(event) {
    this.facilityOptions = this.getFacilitiesByType(event.value);
    this.mainForm?.updateList('facility', this.facilityOptions);
    console.log('this.facilityOptions', this.facilityOptions);
    super.onFormEvent(event);
  }

  getFacilitiesByType(value) {
    const typeMap = {
      'Asset Link': 'assetLinkDetails',
      'Easy Link': 'easyLinkDetails',
      Bailments: 'bailmentDetails',
      BuyBack: 'buybackDetails',
      'Credit Line': 'creditlineDetails',
      'Fixed Floor Plan': 'fixedFloorplanDetails',
      'Floating Floor Plan': 'floatingFloorplanDetails',
      'Introducer Transaction Summary': 'introducerTransactionDetails',
      'Non Facility Loan': 'nonFacilityLoansDetails',
      'Operating Lease': 'operatingLeaseDetails',
    };

    const dataKey = typeMap[value];
    if (!dataKey || !this.financialSummaryData[dataKey]) {
      return [];
    }

    return this.financialSummaryData[dataKey]
      .filter((item) => item && item.facilityName) // skip empty or invalid objects
      .map((item) => ({
        label: item.facilityName,
        value: item.facilityName,
      }));
  }

  override onValueChanges(event) { }
  override onFormReady() {
    this.mainForm?.form.valueChanges.subscribe((value) => {
      this.formDataService.updateFormData(this.mainForm?.form?.value);
    });
    if (this.formFieldFlag == 'newLoanRequest') {
      // this.mainForm.form.controls['purchasePrice'];
      this.mainForm?.updateHidden({ purchasePrice: true });
    }
  }
}
