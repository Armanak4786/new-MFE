import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-role-base-access',
  templateUrl: './role-base-access.component.html',
  styleUrl: './role-base-access.component.scss'
})
export class RoleBaseAccessComponent implements OnInit {

  @Input() selectedTab: string = 'quotesAndApps';

  baseForm!: FormGroup;

  roles = [
    { label: 'Ext-Read', value: 'EXT_READ' },
  ];

  permissionsMap: any = {
    quotesAndApps: [
      {
        title: '',
        fields: [
          { name: 'viewLoans', label: 'View Loans' },
          { name: 'submitApplications', label: 'Submit Applications' },
          { name: 'generateStatement', label: 'Generate Statement' },
          { name: 'settlementQuote', label: 'Generate Settlement Quote' },
          { name: 'dealerFinanceWidget', label: 'Dealer Finance Widget' },
        ]
      },
      {
        title: 'Dashboard Widgets',
        fields: [
          { name: 'monthlyVolumes', label: 'Monthly Volumes' },
          { name: 'avgSalePrice', label: 'Average Sale Price' },
          { name: 'avgCommission', label: 'Average Commission' },
          { name: 'avgAmountFinanced', label: 'Average Amount Financed' },
          { name: 'feesCommission', label: 'Fees & Commission' },
          { name: 'marginsPaidOut', label: 'Margins on Loans Paid Out' },
          { name: 'applicationOutcome', label: 'Application Outcome' },
          { name: 'onlineApplicationStatus', label: 'Online Application Status' },
          { name: 'workflowStatus', label: 'Workflow Status' },
        ]
      },
      {
        title: 'Dashboard Listing',
        fields: [
          { name: 'quoteListing', label: 'Quote Listings' },
          { name: 'activeLoanListing', label: 'Active Loans Listings' },
          { name: 'afvLoanListing', label: 'AFV Loans Listings' },
          { name: 'expiredQuoteListing', label: 'Expired Quotes Listing' },
        ]
      }
    ],

    retailSelfService: [
      {
        title: 'Contract / Summary',
        fields: [
          { name: 'rssViewLoans', label: 'View Loans' },
          { name: 'rssSubmitApplications', label: 'Submit Applications' },
          { name: 'rssGenerateStatement', label: 'Generate Statement' },
          { name: 'rssSettlementQuote', label: 'Generate Settlement Quote' },
          { name: 'rssViewDocuments', label: 'View Documents' },
        ]
      },
      {
        title: 'Requests',
        fields: [
          { name: 'rssViewRequest', label: 'View Request' },
          { name: 'rssContactUDC', label: 'Contact UDC' },
        ]
      }
    ],

    customerPortal: [
      {
        title: 'Financial Summary / Loans / Assets / Requests',
        fields: [
          { name: 'cipPartyDocuments', label: 'Party Documents' },
          { name: 'cipContractDocuments', label: 'Contract Documents' },
          { name: 'cipAssets', label: 'Assets' },
          { name: 'cipLoans', label: 'Loans' },
          { name: 'cipNonFacilityContracts', label: 'View Non-Facility Contracts' },
          { name: 'cipFacilityContracts', label: 'View Facility Contracts' },
          { name: 'cipFacilityAssets', label: 'View Facility Assets' },
          { name: 'cipCreditLimits', label: 'View Credit Limits' },
          { name: 'cipFacilitySummary', label: 'Facility Summary' },
          { name: 'cipRequests', label: 'Requests' },
        ]
      }
    ]
  };

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.baseForm = this.fb.group({
      role: ['EXT_READ'],

      viewLoans: [true],
      submitApplications: [false],
      generateStatement: [false],
      settlementQuote: [false],
      dealerFinanceWidget: [false],

      monthlyVolumes: [false],
      avgSalePrice: [false],
      avgCommission: [false],
      avgAmountFinanced: [false],
      feesCommission: [false],
      marginsPaidOut: [false],
      applicationOutcome: [false],
      onlineApplicationStatus: [false],
      workflowStatus: [false],

      quoteListing: [false],
      activeLoanListing: [false],
      afvLoanListing: [false],
      expiredQuoteListing: [false],

      rssViewLoans: [false],
      rssSubmitApplications: [false],
      rssGenerateStatement: [false],
      rssSettlementQuote: [false],
      rssViewDocuments: [false],

      rssViewRequest: [false],
      rssContactUDC: [false],

      cipPartyDocuments: [false],
      cipContractDocuments: [false],
      cipAssets: [false],
      cipLoans: [false],
      cipNonFacilityContracts: [false],
      cipFacilityContracts: [false],
      cipFacilityAssets: [false],
      cipCreditLimits: [false],
      cipFacilitySummary: [false],
      cipRequests: [false],
    });
  }
}
