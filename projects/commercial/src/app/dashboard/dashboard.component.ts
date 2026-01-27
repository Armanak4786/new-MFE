import { Component } from '@angular/core';
import { DashboardApiService } from './services/dashboard-api.service';
import {
  FacilityType,
  WholesaleRequestHistoryType,
} from '../utils/common-enum';
import { CommonSetterGetterService } from '../services/common-setter-getter/common-setter-getter.service';
import { jwtDecode } from 'jwt-decode';
import { DashboardSetterGetterService } from './services/dashboard-setter-getter.service';
import { CommonApiService } from '../services/common-api.service';
import {
  SearchRequestParams,
  SwapRequestParams,
} from '../utils/common-interface';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { BreadcrumbService } from 'auro-ui';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  facilityType = FacilityType;
  financialSummaryData;
  userInfoData;
  facilityTypeOptions = [];
  currentParty: any;
  userDetails: any;
  total: {
    totalRepaymentsDueToday: 0;
    totalNewLoanDueToday: 0;
  };
  facilityList: any[];
  partyId;
  partyName;
  private destroy$ = new Subject<void>();
  swapRequestList: any[];
  transformedSwapRequestList;
  cutOffTime;
  constructor(
    private dashboardApiSvc: DashboardApiService,
    public commonSetterGetterService: CommonSetterGetterService,
    public dashboardSetterGetterSvc: DashboardSetterGetterService,
    private commonApiService: CommonApiService,
    public breadSvc: BreadcrumbService,
  ) {}

  keyMap = {
    Assetlink: 'assetLinkDetails',
    Bailment: 'bailmentDetails',
    Buyback: 'buybackDetails',
    CreditLines: 'creditlineDetails',
    Easylink: 'easyLinkDetails',
    FixedFloorPlan: 'fixedFloorplanDetails',
    FloatingFloorPlan: 'floatingFloorplanDetails',
    IntroducerTransactionSummary: 'introducerTransactionDetails',
    NonFacilityLoan: 'nonFacilityLoansDetails',
    OperatingLease: 'operatingLeaseDetails',
  };

  ngOnInit() {
    let sub;
    let decodedToken = sessionStorage.getItem('accessToken');
    sub = this.decodeToken(decodedToken)?.sub;
    this.breadSvc.homeBreadcrumb = [
      {
        label: '',
        icon: 'pi pi-home',
        url: '/dashboard',
      },
    ];
    this.commonSetterGetterService.dashboardRefresh$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fetchTransferRequestList();
      });
    this.commonSetterGetterService.party$.subscribe((currentParty) => {
      this.partyName = currentParty?.name;
      this.partyId = currentParty?.id;
      if (this.partyId) {
        this.fetchFinancialSummary(this.partyId);
        this.fetchCustomerDetails(this.partyId);
        this.fetchTransferRequestList();
        this.fetchRelatedParties(this.partyId);
      } else {
        this.fetchUserInfo(sub);
      }
    });

    this.fetchAllProducts();
    this.getCutOffTime();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async getCutOffTime() {
    try {
      this.cutOffTime = await this.commonApiService.getCutOffTimeCompare();
      sessionStorage.setItem('cutOffTime', JSON.stringify(this.cutOffTime));
    } catch (error) {
      console.log('Error while loading data', error);
    }
  }

  getFacilityTypeList(data) {
    // Function to get unique facility names from the whole input
    const uniqueFacilityNames = new Set();

    // Iterate over all properties in the input data
    for (let key in data) {
      // If the value is an array, process it
      if (Array.isArray(data[key])) {
        // Extract the `facilityName` from each item and add it to the set
        data[key].forEach((item) => {
          if (item.facilityName) {
            uniqueFacilityNames.add(item.facilityName);
          }
        });
      }
    }

    // Convert the set to an array and return the result
    return [...uniqueFacilityNames];
  }

  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid Token', error);
      return null;
    }
  }

  async fetchFinancialSummary(partyId) {
    try {
      const financialSummary =
        await this.dashboardApiSvc.getFinancialSummaryData(partyId);
      this.financialSummaryData = financialSummary.financialSummaryList;
      if (this.financialSummaryData) {
        this.dashboardSetterGetterSvc.setFinanacialSummary(
          this.financialSummaryData,
        );
        sessionStorage.setItem(
          'financialSummaryData',
          JSON.stringify(this.financialSummaryData),
        );
        this.total = {
          totalRepaymentsDueToday:
            financialSummary?.repaymentsAmountDueToday ?? 0,
          totalNewLoanDueToday: financialSummary?.newLoanAmountDueToday ?? 0,
        };
        this.facilityTypeOptions = [];
        for (const label in this.facilityType) {
          const key = this.keyMap[label];
          if (
            this.financialSummaryData[key] &&
            this.financialSummaryData[key].length > 0
          ) {
            this.facilityTypeOptions.push({
              label: label,
              value: this.facilityType[label],
            });
          }
        }
        this.commonSetterGetterService.setAllFacilities(
          this.facilityTypeOptions,
        );
      }
    } catch (error) {
      console.log('Error while loading facility data', error);
    }
  }

  async fetchCustomerDetails(customerNo: string) {
    const customerDetails =
      await this.dashboardApiSvc.getCustomerDetails(customerNo);

    this.storeFormattedAddess(customerDetails?.addressDetails || []);
    const isIndividual =
      customerDetails?.businessIndividual?.toLowerCase() === 'individual';
    if (isIndividual) {
      this.commonSetterGetterService.setIndividualPartyFlag(isIndividual);
      this.commonSetterGetterService.setCustomerDetails({
        personalDetails: customerDetails?.personalDetails,
      });
    } else {
      this.commonSetterGetterService.setCustomerDetails({
        business: customerDetails?.business,
      });
    }
  }
  async fetchTransferRequestList() {
    const params = {
      inboxViewType: WholesaleRequestHistoryType.TRSANSFER_REQUEST_INBOX,
    };
    await this.fetchSwapRequestList(params, 'swap');
    const paramsSearch: SearchRequestParams = {
      typeId: this.transformedSwapRequestList?.find(
        (x) => x.label === 'Swap Pending',
      )?.value,
    };

    const paramsSearchComplete: SearchRequestParams = {
      typeId: this.transformedSwapRequestList?.find(
        (x) => x.label === 'Swap Complete',
      )?.value,
    };

    forkJoin({
      pending: this.commonApiService.getSearchRequestTypeList(paramsSearch),
      complete:
        this.commonApiService.getSearchRequestTypeList(paramsSearchComplete),
    }).subscribe({
      next: ({ pending, complete }) => {
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);
        this.filterAllTransfers(pending, complete);
      },
      error: (err) => {
        console.error('Error while fetching swap request', err);
      },
    });
  }
  async fetchSwapRequestList(params: SwapRequestParams, value) {
    try {
      this.swapRequestList =
        await this.commonApiService.getSwapRequestTypeList(params);
      if (this.swapRequestList) {
        if (value === 'swap') {
          this.transformedSwapRequestList = this.swapRequestList
            .filter((item) => item.name?.toLowerCase().includes('swap'))
            .map((item) => ({
              label: item.name,
              value: item.id,
            }));
        }
      }
    } catch (error) {
      console.log('Error while loading swap list data', error);
    }
  }
  async fetchUserInfo(usercode) {
    try {
      const userInfoData = await this.dashboardApiSvc.getUserInfoData(usercode);

      this.currentParty = userInfoData?.partyDetails?.find(
        (item) => item.isDefault === true,
      );
      this.userDetails = userInfoData.userDetails;
      this.commonSetterGetterService.setUserDetails(this.userDetails);
      this.commonSetterGetterService.setPartyData(userInfoData?.partyDetails);
      this.commonSetterGetterService.setCurrentPartyData(this.currentParty);
      sessionStorage.setItem('currentParty', JSON.stringify(this.currentParty));
      sessionStorage.setItem(
        'partyDetails',
        JSON.stringify(userInfoData?.partyDetails),
      );
      sessionStorage.setItem('userDetails', JSON.stringify(this.userDetails));
    } catch (error) {
      console.log('Error while loading facility data', error);
    }
  }

  async fetchAllProducts() {
    try {
      const allProducts = await this.commonApiService.getAllProducts();
      this.commonSetterGetterService.setAllProductsData(allProducts);
    } catch (error) {
      console.log('Error while loading facility data', error);
    }
  }

  async fetchRelatedParties(partyNo) {
    try {
      const relatedParties =
        await this.dashboardApiSvc.getRelatedParties(partyNo);
      this.commonSetterGetterService.setContactItems(relatedParties);
    } catch (error) {
      console.log('Error while loading facility data', error);
    }
  }

  storeFormattedAddess(addressDetails: any[]) {
    const physicalAddressObj = addressDetails.find(
      (s) => s.addressType === 'Street' && s.isCurrent === true,
    );
    const postalAddressObj = addressDetails.find(
      (s) => s.addressType === 'Mailing' && s.isCurrent === true,
    );
    const registeredAddressObj = addressDetails.find(
      (s) => s.addressType === 'Registered',
    );

    const physicalAddress = this.getFormattedAddress(physicalAddressObj);
    const postalAddress = this.getFormattedAddress(postalAddressObj);
    const registeredAddress = this.getFormattedAddress(registeredAddressObj);

    // store in observable
    this.commonSetterGetterService.setFormattedAddresses({
      physicalAddress,
      postalAddress,
      registeredAddress,
    });
  }
  getFormattedAddress(addr: any): string {
    if (!addr || !addr.addressComponents) return '';
    const componentMap = addr.addressComponents.reduce(
      (map, comp) => {
        map[comp.type] = comp.value;
        return map;
      },
      {} as { [key: string]: string },
    );

    const fullAddress = [
      componentMap.BuildingName,
      `${componentMap.FloorType || ''} ${componentMap.FloorNo || ''}`.trim(),
      `${componentMap.UnitType || ''} ${componentMap.UnitLot || ''}`.trim(),
      componentMap.StreetNo,
      componentMap.StreetName,
      componentMap.StreetType,
      componentMap.StreetDirection,
      componentMap.RuralDelivery,
      addr.suburb,
      addr.city?.extName,
      addr.countryRegion?.extName,
      addr.zipCode !== 'undefined' ? addr.zipCode : '',
    ];

    return fullAddress.filter((part) => part && part !== 'null').join(', ');
  }

  filterAllTransfers(data: any[], resultComplete) {
    const pending = data
      .filter((item) => {
        const wfThree = item.values.find((v: any) => v.name === 'WFThree');
        const newParty = item.values.find(
          (v: any) => v.name === 'NewPartyExtName',
        );
        return (
          wfThree?.value === 'Pending Transfer' &&
          newParty?.value === this.partyName
        );
      })
      .reverse();

    const declined = data.filter((item) => {
      const wfThree = item.values.find((v: any) => v.name === 'WFThree');
      const originalParty = item.values.find(
        (v: any) => v.name === 'OriginalPartyExtName',
      );
      return (
        wfThree?.value === 'Declined' && originalParty?.value === this.partyName
      );
    });
    const filterDecline = this.getFilteredResultByDate(declined);

    const completed = resultComplete.filter((item) => {
      const wfThree = item.values.find((v: any) => v.name === 'WFThree');
      const originalParty = item.values.find(
        (v: any) => v.name === 'OriginalPartyExtName',
      );
      return (
        wfThree?.value === 'Complete' && originalParty?.value === this.partyName
      );
    });
    const filterCompleted = this.getFilteredResultByDate(completed);
    const countOfNotifi =
      pending.length + filterDecline.length + filterCompleted.length;

    // Update observable
    this.commonSetterGetterService.transferRequestsSubject.next({
      pending,
      declined: filterDecline,
      completed: filterCompleted,
      countOfNotifi,
      isClearAll: false,
    });
  }

  getFilteredResultByDate(result: any) {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    const recentRecords: any[] = [];
    for (let i = result.length - 1; i >= 0; i--) {
      const item = result[i];
      const inputDtObj = item.values.find((v: any) => v.name === 'InputDt');
      if (!inputDtObj) continue;
      const inputDt = new Date(inputDtObj.value);
      if (inputDt < oneMonthAgo) {
        break;
      }
      recentRecords.push(item);
    }
    return recentRecords;
  }
}
