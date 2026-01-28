import { ChangeDetectorRef, Component, effect, OnDestroy, OnInit } from "@angular/core";
import { map, skip, Subject, takeUntil } from "rxjs";
import { SoleTradeService } from "./services/sole-trade.service";
import { CommonService, MapFunc, Mode, ToasterService } from "auro-ui";
import { ActivatedRoute } from "@angular/router";
import { StandardQuoteService } from "../standard-quote/services/standard-quote.service";
import configure from "../../../public/assets/configure.json";
import { DashboardService } from "../dashboard/services/dashboard.service";
import { SearchAddressService } from "../standard-quote/services/search-address.service";

@Component({
  selector: "app-sole-trade",
  templateUrl: "./sole-trade.component.html",
  styleUrl: "./sole-trade.component.scss",
})
export class SoleTradeComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  data: any = {};
  formData: any;
  contractId: any;
  mode: string = "create";
  isReady: boolean = false;
  soleTradeConfirmation: boolean = false;
  financialPositionLiability: any[] = [];
  soleindividualCustomerDetails: any;
  currentEmployeeInfoId: number;
  previousEmployeeInfoId: number;
  customerContactId: any;
  updatedCustomerSummary: any;

  constructor(
    private soleTradeSvc: SoleTradeService,
    private commonSvc: CommonService,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    public standardQuoteSvc: StandardQuoteService,
    public toasterService: ToasterService,
    public dashboardService: DashboardService,
    private searchAddressService: SearchAddressService
  ) {
    this.standardQuoteSvc.formDataCacheableRoute([
      "LookUpServices/custom_lookups?LookupSetName=UdcExpenditureDescription",
      "LookUpServices/custom_lookups?LookupSetName=UdcAssetDescription",
      "LookUpServices/lookups?LookupSetName=ContactType",
    ]);

    effect(() => {
      setTimeout(() => {
        if (this.dashboardService.isDealerCalculated) {
          this.toasterService.showToaster({
            severity: "error",
            detail: "err_calculateMsg",
          });
        }

      }, 3000);

    });

  }
  params: any = this.route.snapshot.params;
  async ngOnInit() {

    this.soleTradeSvc.iconfirmCheckbox.subscribe((valid: any[]) => {

      if (valid && valid.length > 0) {
        this.steps = this.steps.map(step => {
          // Check if this step label exists in the valid array
          const isValidStep = valid.some(validItem => validItem.label === step.label);

          // Return the step with updated validStatus
          return {
            ...step,
            validStatus: isValidStep ? false : true
          };
        });
      } else {
        // If no valid data, set all steps to validStatus: true
        this.steps = this.steps.map(step => ({
          ...step,
          validStatus: true
        }));
      }


    });

    let sessionStorageCustomerSummary = JSON.parse(sessionStorage?.getItem("updatedCustomerSummary"))
      if(sessionStorageCustomerSummary?.length > 0){
      const updateServiceRole = sessionStorageCustomerSummary?.find(c => c.customerRole == 1 || c.roleName == "Borrower")
      if(updateServiceRole){
        this.soleTradeSvc.role = 1
      }
      this.updatedCustomerSummary = sessionStorageCustomerSummary
    }

    this.standardQuoteSvc.getBaseDealerFormData().subscribe((data) => {

      // this.updatedCustomerSummary = data?.updatedCustomerSummary

      this.soleTradeSvc.setBaseDealerFormData({
        updatedCustomerSummary: this.updatedCustomerSummary,
        customerSummary: data?.customerSummary

      })

    })

    

    // Initialize route params
    this.activeStep = this.soleTradeSvc.activeStep;
    let params: any = this.route.snapshot.params;
    this.mode = params.mode || Mode.create;
    this.soleTradeSvc
      ?.getBaseDealerFormData()
      ?.pipe(takeUntil(this.destroy$))
      ?.subscribe((res) => {
        this.formData = res;
      });

    // Fetch contract ID from StandardQuoteService
    this.standardQuoteSvc
      ?.getBaseDealerFormData()
      ?.pipe(takeUntil(this.destroy$))
      ?.subscribe((res) => {
        this.contractId = res?.contractId || this.contractId;
      });

    //Subhashish
    this.soleTradeSvc.setBaseDealerFormData({
      // UdcFrequency : await this.getLookUpRes('UdcFrequency'),
      UdcHomeOwnership: await this.getLookUpRes("UdcHomeOwnership"),
      UdcExpenditureDescription: await this.getLookUpRes(
        "UdcExpenditureDescription"
      ),
      UdcAssetDescription: await this.getLookUpRes("UdcAssetDescription"),
      contractId: this?.contractId,
      ReferenceDetailContactType: await this.getContactLookUpRes("ContactType"),
      // UdcAdditionalIncomeDescription : await this.getLookUpRes('UdcAdditionalIncomeDescription')
    });

    this.soleTradeSvc
      .getBaseDealerFormData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.formData = res;
        this.soleTradeConfirmation = res?.soleTradeConfirmation;
      });

    // Initialize data
    await this.init();
    //  this.dashboardService?.onOriginatorChange.pipe(takeUntil(this.destroy$),skip(1)).subscribe(async (dealer) => {
    //                             if(this.dashboardService.isDealerCalculated)
    //                               {
    //                                       this.toasterService.showToaster({
    //                                         severity: "error",
    //                                         detail:"err_calculateMsg",
    //                                       });
    //                               }

    //                 })
  }

  //Subhashish
  getLookUpRes(LookupSetName: string): Promise<any> {
    return this.standardQuoteSvc.getFormData(
      `LookUpServices/custom_lookups?LookupSetName=${LookupSetName}`,
      function (res) {
        return res?.data;
      }
    );
  }

  getContactLookUpRes(LookupSetName: string): Promise<any> {
    return this.standardQuoteSvc.getFormData(
      `LookUpServices/lookups?LookupSetName=${LookupSetName}`,
      function (res) {
        if (res.data && Array.isArray(res.data)) {
          return res.data.map((item) => ({
            label: item.lookupValue,
            value: item.lookupValue,
          }));
        }
      }
    );
  }

  async fetchBaseDealerFormData() {
    this.soleTradeSvc
      .getBaseDealerFormData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (res) => {
        this.formData = res || {};
        if (this.mode === "edit" && this.formData) {
          // await this.patchFormData();
        }
        this.isReady = true;
        this.changeDetectorRef.detectChanges();
      });
  }

  async init(): Promise<void> {
    const params: any = this.route.snapshot.params;
    if (this.mode === "edit" || this.mode === "view") {
      const customerUrl = `CustomerDetails/get_customer?customerNo=${params.customerId
        }&contractId=${params.contractId || this.contractId}`;

      // Fetch customer details
      const soleTradeCustomer: any = await this.soleTradeSvc.getFormData(
        customerUrl,
        (res) => res?.data || null
      );

      this.soleindividualCustomerDetails = soleTradeCustomer;
      // if (!soleTradeCustomer) {
      //   // this.toasterService.showToaster({
      //   //   severity: 'error',
      //   //   detail: 'Failed to fetch customer details.',
      //   // });
      //   this.isReady = true;
      //   return;
      // }

      // Financial Details Mapping
      const FinancialDetails = {
        IsSharedFinancialPosition:
          soleTradeCustomer?.financialDetails?.financialPositionBase
            ?.isSharedFinancialPosition || false,
        customerId: soleTradeCustomer?.customerId || -1,
        customerNo: soleTradeCustomer?.customerNo || -1,

        //Subhashish Changes :
        soleTradeisNetProfitLastYear:
          soleTradeCustomer?.financialDetails?.financialPositionBase
            ?.isNetProfitLastYear || false,
        soleTradeAmtLastYearNetProfit:
          soleTradeCustomer?.financialDetails?.financialPositionBase
            ?.amtLastYearNetProfit || 0,

        //TurnOver Information
        soleTradeAmtTurnoverLatestYear:
          soleTradeCustomer?.financialDetails?.financialPositionBase
            ?.amtTurnoverLatestYear,
        soleTradeturnoverLatestYearEndingDt:
          soleTradeCustomer?.financialDetails?.financialPositionBase
            ?.turnoverLatestYearEndingDt,
        soleTradeAmtTurnoverPrevYear:
          soleTradeCustomer?.financialDetails?.financialPositionBase
            ?.amtTurnoverPrevYear,
        soleTradeTurnoverPrevYearEndingDt:
          soleTradeCustomer?.financialDetails?.financialPositionBase
            ?.turnoverPrevYearEndingDt,

        //Balance Information
        soleTradeAmtCashBalLatestYr:
          soleTradeCustomer?.financialDetails?.financialPositionBase
            ?.amtCashBalLatestYr,
        soleTradeCashBalLatestYrEndDt:
          soleTradeCustomer?.financialDetails?.financialPositionBase
            ?.cashBalLatestYrEndDt,
        soleTradeAmtDebtorBalLatestYr:
          soleTradeCustomer?.financialDetails?.financialPositionBase
            ?.amtDebtorBalLatestYr,
        soleTradeDebtorBalLatestYrEndDt:
          soleTradeCustomer?.financialDetails?.financialPositionBase
            ?.debtorBalLatestYrEndDt,
        soleTradeAmtCreditorBalLatestYr:
          soleTradeCustomer?.financialDetails?.financialPositionBase
            ?.amtCreditorBalLatestYr,
        soleTradeCreditorBalLatestYrEndDt:
          soleTradeCustomer?.financialDetails?.financialPositionBase
            ?.creditorBalLatestYrEndDt,
        soleTradeAmtOverdraftBalLatestYr:
          soleTradeCustomer?.financialDetails?.financialPositionBase
            ?.amtOverdraftBalLatestYr,
        soleTradeOverdraftBalLastYrEndDt:
          soleTradeCustomer?.financialDetails?.financialPositionBase
            ?.overdraftBalLastYrEndDt,

        //Asset
        financialPositionBase:
          soleTradeCustomer?.financialDetails?.financialPositionBase,
        financialPositionAsset:
          soleTradeCustomer?.financialDetails?.financialPositionAsset,

        //Liability
        financialPositionLiability:
          soleTradeCustomer?.financialDetails?.financialPositionLiability,
      };

      // Address Details Mapping
      let AddressDetails: any = {};
      if (soleTradeCustomer?.addressDetails?.length) {
        const getAddress = (type: string, isCurrent: boolean = true) =>
          soleTradeCustomer.addressDetails.find(
            (address) =>
              address.addressType?.toLowerCase() === type &&
              address.isCurrent === isCurrent
          );

        const physicalAddress = getAddress("street", true);
        const previousAddress = getAddress("street", false);
        const postalAddress = getAddress("mailing", true);
        const registeredAddress = getAddress("registered", true);

        AddressDetails = {
          physicalAddressId: physicalAddress?.addressId || -1,
          postalAddressId: postalAddress?.addressId || -1,
          previousAddressId: previousAddress?.addressId || -1,
          registerAddressId: registeredAddress?.addressId || -1,
          physicalResidenceType: physicalAddress?.residentType || "",
          physicalYear: physicalAddress
            ? await this.getTimeDifference(
              physicalAddress?.effectDtFrom,
              this.commonSvc.data.convertDateToString(new Date()),
              "year"
            )
            : 0,
          physicalMonth: physicalAddress
            ? await this.getTimeDifference(
              physicalAddress?.effectDtFrom,
              this.commonSvc.data.convertDateToString(new Date()),
              "month"
            )
            : 0,
          physicalReuseOff:
            physicalAddress?.street === postalAddress?.street || false,
          physicalBuildingName:
            physicalAddress?.addressComponents?.find(
              (comp) => comp.type === "BuildingName"
            )?.value || "",
          physicalFloorType:
            physicalAddress?.addressComponents?.find(
              (comp) => comp.type === "FloorType"
            )?.value || "",
          physicalFloorNumber:
            physicalAddress?.addressComponents?.find(
              (comp) => comp.type === "FloorNo"
            )?.value || "",
          physicalUnitType:
            physicalAddress?.addressComponents?.find(
              (comp) => comp.type === "UnitType"
            )?.value || "",
          physicalUnitNumber:
            physicalAddress?.addressComponents?.find(
              (comp) => comp.type === "UnitLot"
            )?.value || "",
          physicalStreetNumber:
            physicalAddress?.addressComponents?.find(
              (comp) => comp.type === "StreetNo"
            )?.value || "",
          physicalStreetName:
            physicalAddress?.addressComponents?.find(
              (comp) => comp.type === "StreetName"
            )?.value || "",
          physicalStreetType:
            physicalAddress?.addressComponents?.find(
              (comp) => comp.type === "StreetType"
            )?.value || "",
          physicalStreetDirection:
            physicalAddress?.addressComponents?.find(
              (comp) => comp.type === "StreetDirection"
            )?.value || "",
          physicalRuralDelivery:
            physicalAddress?.addressComponents?.find(
              (comp) => comp.type === "RuralDelivery"
            )?.value || "",
          physicalSuburbs: physicalAddress?.suburb || "",
          physicalCity: physicalAddress?.city?.extName || "",
          physicalPostcode: physicalAddress?.zipCode || 0,
          physicalCountry:
            physicalAddress?.countryRegion?.extName || "New Zealand",
          physicalTextArea: physicalAddress?.street || "",
          previousResidenceType: previousAddress?.residentType || "",
          previousYear: previousAddress && physicalAddress
              ? await this.getTimeDifference(
                  previousAddress?.effectDtFrom,
                  physicalAddress?.effectDtFrom,
              "year"
                )
              : 0,
         previousMonth: previousAddress && physicalAddress
              ? await this.getTimeDifference(
                  previousAddress?.effectDtFrom,
                  physicalAddress?.effectDtFrom,
              "month"
                )
              : 0,
          previousBuildingName:
            previousAddress?.addressComponents?.find(
              (comp) => comp.type === "BuildingName"
            )?.value || "",
          previousFloorType:
            previousAddress?.addressComponents?.find(
              (comp) => comp.type === "FloorType"
            )?.value || "",
          previousFloorNumber:
            previousAddress?.addressComponents?.find(
              (comp) => comp.type === "FloorNo"
            )?.value || "",
          previousUnitType:
            previousAddress?.addressComponents?.find(
              (comp) => comp.type === "UnitType"
            )?.value || "",
          previousUnitNumber:
            previousAddress?.addressComponents?.find(
              (comp) => comp.type === "UnitLot"
            )?.value || "",
          previousStreetNumber:
            previousAddress?.addressComponents?.find(
              (comp) => comp.type === "StreetNo"
            )?.value || "",
          previousStreetName:
            previousAddress?.addressComponents?.find(
              (comp) => comp.type === "StreetName"
            )?.value || "",
          previousStreetType:
            previousAddress?.addressComponents?.find(
              (comp) => comp.type === "StreetType"
            )?.value || "",
          previousStreetDirection:
            previousAddress?.addressComponents?.find(
              (comp) => comp.type === "StreetDirection"
            )?.value || "",
          previousRuralDelivery:
            previousAddress?.addressComponents?.find(
              (comp) => comp.type === "RuralDelivery"
            )?.value || "",
          previousSuburbs: previousAddress?.suburb || "",
          previousCity: previousAddress?.city?.extName || "",
          previousPostcode: previousAddress?.zipCode || 0,
          previousCountry:
            previousAddress?.countryRegion?.extName || "New Zealand",
          previousTextArea: previousAddress?.street || "",
          overseasAddress:
            previousAddress?.addressComponentTemplateHdrId === 1 ? false : true,
          postalBuildingName:
            postalAddress?.addressComponents?.find(
              (comp) => comp.type === "BuildingName"
            )?.value || "",
          postalFloorType:
            postalAddress?.addressComponents?.find(
              (comp) => comp.type === "FloorType"
            )?.value || "",
          postalFloorNumber:
            postalAddress?.addressComponents?.find(
              (comp) => comp.type === "FloorNo"
            )?.value || "",
          postalUnitType:
            postalAddress?.addressComponents?.find(
              (comp) => comp.type === "UnitType"
            )?.value || "",
          postalUnitNumber:
            postalAddress?.addressComponents?.find(
              (comp) => comp.type === "UnitLot"
            )?.value || "",
          postalStreetNumber:
            postalAddress?.addressComponents?.find(
              (comp) => comp.type === "StreetNo"
            )?.value || "",
          postalStreetName:
            postalAddress?.addressComponents?.find(
              (comp) => comp.type === "StreetName"
            )?.value || "",
          postalStreetType:
            postalAddress?.addressComponents?.find(
              (comp) => comp.type === "StreetType"
            )?.value || "",
          postalStreetDirection:
            postalAddress?.addressComponents?.find(
              (comp) => comp.type === "StreetDirection"
            )?.value || "",
          postalRuralDelivery:
            postalAddress?.addressComponents?.find(
              (comp) => comp.type === "RuralDelivery"
            )?.value || "",
          postalSuburbs: postalAddress?.suburb || "",
          postalCity: postalAddress?.city?.extName || "",
          postalPostcode: postalAddress?.zipCode || 0,
          postalCountry: postalAddress?.countryRegion?.extName || "New Zealand",
          postalStreetArea: this.searchAddressService.sanitizeStreetValue(postalAddress?.street || ""),
          postalAddressType:
            postalAddress?.addressComponentTemplateHdrId === 1
              ? "street"
              : "po",
          registerBuildingName:
            registeredAddress?.addressComponents?.find(
              (comp) => comp.type === "BuildingName"
            )?.value || "",
          registerFloorType:
            registeredAddress?.addressComponents?.find(
              (comp) => comp.type === "FloorType"
            )?.value || "",
          registerFloorNumber:
            registeredAddress?.addressComponents?.find(
              (comp) => comp.type === "FloorNo"
            )?.value || "",
          registerUnitType:
            registeredAddress?.addressComponents?.find(
              (comp) => comp.type === "UnitType"
            )?.value || "",
          registerUnitNumber:
            registeredAddress?.addressComponents?.find(
              (comp) => comp.type === "UnitLot"
            )?.value || "",
          registerStreetNumber:
            registeredAddress?.addressComponents?.find(
              (comp) => comp.type === "StreetNo"
            )?.value || "",
          registerStreetName:
            registeredAddress?.addressComponents?.find(
              (comp) => comp.type === "StreetName"
            )?.value || "",
          registerStreetType:
            registeredAddress?.addressComponents?.find(
              (comp) => comp.type === "StreetType"
            )?.value || "",
          registerStreetDirection:
            registeredAddress?.addressComponents?.find(
              (comp) => comp.type === "StreetDirection"
            )?.value || "",
          registerRuralDelivery:
            registeredAddress?.addressComponents?.find(
              (comp) => comp.type === "RuralDelivery"
            )?.value || "",
          registerSuburbs: registeredAddress?.suburb || "",
          registerCity: registeredAddress?.city?.extName || "",
          registerPostcode: registeredAddress?.zipCode || 0,
          registerCountry:
            registeredAddress?.countryRegion?.extName || "New Zealand",
          registerStreetArea: registeredAddress?.street || "",
          registerYear: registeredAddress
            ? await this.getTimeDifference(
              registeredAddress?.effectDtFrom,
              this.commonSvc.data.convertDateToString(new Date()),
              "year"
            )
            : 0,
          registerMonth: registeredAddress
            ? await this.getTimeDifference(
              registeredAddress?.effectDtFrom,
              this.commonSvc.data.convertDateToString(new Date()),
              "month"
            )
            : 0,
        };
      }

      // Employee and Contact IDs
      this.currentEmployeeInfoId =
        soleTradeCustomer?.employementDetails?.[0]?.employmentInfoId || null;
      this.previousEmployeeInfoId =
        soleTradeCustomer?.employementDetails?.[1]?.employmentInfoId || null;
      this.customerContactId =
        soleTradeCustomer?.referenceDetails?.[0]?.customerContactId || null;

      // Data Mapping
      const DataMapper = {
        // Business Details
        tradingName: soleTradeCustomer?.personalDetails?.tradingName || "",
        gstNum: soleTradeCustomer?.personalDetails?.taxNumber || "",
        businessDescription:
          soleTradeCustomer?.personalDetails?.businessDescription || "",
        natureOfBusiness:
          soleTradeCustomer?.personalDetails?.natureOfBusiness || "",
        timeInBusinessYears:
          soleTradeCustomer?.personalDetails?.timeInBusinessYears || 0,
        timeInBusinessMonths:
          soleTradeCustomer?.personalDetails?.timeInBusinessMonths || 0,
        // Personal Details
        title: soleTradeCustomer?.personalDetails?.title || "",
        firstName: soleTradeCustomer?.personalDetails?.firstName || "",
        middleName: soleTradeCustomer?.personalDetails?.middleName || "",
        lastName: soleTradeCustomer?.personalDetails?.lastName || "",
        knownAs: soleTradeCustomer?.personalDetails?.knownAs || "",
        maritalStatus: soleTradeCustomer?.personalDetails?.maritalStatus || "",
        gender: soleTradeCustomer?.personalDetails?.gender || "",
        noOfDependents:
          soleTradeCustomer?.personalDetails?.noOfDependents || "0",
        dependentsAge : soleTradeCustomer?.personalDetails?.dependentsAge || "0",
        dateOfBirth: soleTradeCustomer?.personalDetails?.dateOfBirth || "",
        versionNumber: soleTradeCustomer?.personalDetails?.versionNumber || null,
        licenceNumber: soleTradeCustomer?.personalDetails?.licenceNumber || null,
        licenseType: soleTradeCustomer?.personalDetails?.licenceType || "",
        countryOfIssue:
          soleTradeCustomer?.personalDetails?.countryOfIssue || "",
        newZealand: soleTradeCustomer?.citizenship?.newZealandResident || false,
        countryOfBirth: soleTradeCustomer?.citizenship?.countryOfBirth || "",
        countryOfCitizenship:
          soleTradeCustomer?.citizenship?.countryOfCitizenship || "",
        // Employment Details
        currentEmployer:
          soleTradeCustomer?.employmentDetails?.currentEmployer || "",
        currentOccupation:
          soleTradeCustomer?.employmentDetails?.currentOccupation || "",
        currentEmploymentType:
          soleTradeCustomer?.employmentDetails?.currentEmploymentType || "",
        currentEmployeeYear:
          soleTradeCustomer?.employmentDetails?.currentEmployeeYear || 0,
        currentEmployeeMonth:
          soleTradeCustomer?.employmentDetails?.currentEmployeeMonth || 0,
        previousEmployer:
          soleTradeCustomer?.employmentDetails?.previousEmployer || "",
        previousOccupation:
          soleTradeCustomer?.employmentDetails?.previousOccupation || "",
        previousEmploymentType:
          soleTradeCustomer?.employmentDetails?.previousEmploymentType || "",
        previousEmployeeYear:
          soleTradeCustomer?.employmentDetails?.previousEmployeeYear || 0,
        previousEmployeeMonth:
          soleTradeCustomer?.employmentDetails?.previousEmployeeMonth || 0,
        // Contact Details
        // emailArr: soleTradeCustomer?.contactDetails?.emails || [],
        // mobileArr: soleTradeCustomer?.contactDetails?.phones || [],
        // Reference Details
        referenceFirstName:
          soleTradeCustomer?.referenceDetails?.[0]?.firstName || "",
        referenceLastName:
          soleTradeCustomer?.referenceDetails?.[0]?.lastName || "",
        relationshipToCustomer:
          soleTradeCustomer?.referenceDetails?.[0]?.relationship || "",
        referencePhoneExt:
          soleTradeCustomer?.referenceDetails?.[0]?.phoneExt || "",
        referenceAreaCode:
          soleTradeCustomer?.referenceDetails?.[0]?.areaCode || "",
        referencePhoneNo:
          soleTradeCustomer?.referenceDetails?.[0]?.phoneNo || "",
        referenceDetailsTemp: soleTradeCustomer?.referenceDetails || [],
      };

      // Merge data
      this.data = {
        ...this.data,
        ...DataMapper,
        ...AddressDetails,
        ...FinancialDetails,
        ...soleTradeCustomer,
      };

      // Update form data and trigger change detection
      if (this.data) {
        // this.formData = soleTradeCustomer; // Ensure formData is set for consistency
        this.soleTradeSvc.setBaseDealerFormData(this.data);
        this.changeDetectorRef.detectChanges();
        this.isReady = true;
        if (this.mode === "view") {
          this.soleTradeSvc.appState.next(true);
        }
      }
    } else {
      this.isReady = true;
    }

    // let liabilitiesOptionRes = await this.getLookUpRes("UdcExpenditureDescription")   //Subhashish

    let liability: any = {
      mortageId: null,
      soleTrademortgageBalance: 0,
      soleTradeMortgageAmount: 0,
      // rentId: null,
      // soleTradeRentBalance: 0,
      // soleTradeRentAmount: 0,
      loanId: null,
      soleTradeloansBalance: 0,
      soleTradeloansAmount: 0,
      creditId: null,
      soleTradecreditcardBalance: 0,
      soleTradecreditcardAmount: 0,
      otherLiabilitiesId: null,
      soleTradeotherBalance: 0,
      soleTradeotherAmount: 0,
      mortagefinancialPositionLiabilityId: 0,
      loanfinancialPositionLiabilityId: 0,
      creditfinancialPositionLiabilityId: 0,
      otherfinancialPositionLiabilityId: 0,
    };

    if (this.formData?.financialPositionLiability?.length > 0) {
      this.formData.financialPositionLiability.forEach((item: any) => {
        switch (item.expenseCategory) {
          case "1LA": // Mortgage
            liability.mortagefinancialPositionLiabilityId =
              item.financialPositionLiabilityId;
            liability.mortageId = item.liabilityDescription;
            liability.soleTrademortgageBalance = item.amtBalanceLimit;
            liability.soleTradeMortgageAmount = item.amtLiability;
            break;

          // case "1LB": // Rent
          //   liability.rentfinancialPositionLiabilityId =
          //     item.financialPositionLiabilityId;
          //   liability.rentId = item.liabilityDescription;
          //   liability.soleTradeRentBalance = item.amtBalanceLimit;
          //   liability.soleTradeRentAmount = item.amtLiability;
          //   break;

          case "2L": // Loans
            liability.loanfinancialPositionLiabilityId =
              item.financialPositionLiabilityId;
            liability.loanId = item.liabilityDescription;
            liability.soleTradeloansBalance = item.amtBalanceLimit;
            liability.soleTradeloansAmount = item.amtLiability;
            break;

          case "3LBA": // Credit Cards
            liability.creditfinancialPositionLiabilityId =
              item.financialPositionLiabilityId;
            liability.creditId = item.liabilityDescription;
            liability.soleTradecreditcardBalance = item.amtBalanceLimit;
            liability.soleTradecreditcardAmount = item.amtLiability;
            break;

          case "4L": // Other Liabilities
            liability.otherfinancialPositionLiabilityId =
              item.financialPositionLiabilityId;
            liability.otherLiabilitiesId = item.liabilityDescription;
            liability.soleTradeotherBalance = item.amtBalanceLimit;
            liability.soleTradeotherAmount = item.amtLiability;
            break;
        }
      });
    }

    const liabilitiesOptionRes = await this.getLookUpRes(
      "UdcExpenditureDescription"
    );
    liabilitiesOptionRes.forEach((item) => {
      switch (item.lookupValue.toLowerCase()) {
        case "mortgage":
          liability.mortageId = item.lookupId;
          // optionally assign values if you have balance/rent from another source
          break;

        // case "rent":
        //   liability.rentId = item.lookupId;
        //   // optionally assign values if you have balance/rent from another source
        //   break;

        case "loans":
          liability.loanId = item.lookupId;
          break;

        case "credit cards":
          liability.creditId = item.lookupId;
          break;

        case "other liabilities":
          liability.otherLiabilitiesId = item.lookupId;
          break;
      }
    });

    this.soleTradeSvc.setBaseDealerFormData({
      ...liability,
    });
  }
  //Subhashish
  async financialAccountUpdate() {

    this.financialPositionLiability = [
      {
        financialPositionLiabilityId:
          this.formData?.mortagefinancialPositionLiabilityId || 0,
        // "financialPositionBaseId": 127,
        liabilityDescription: this.formData?.mortageId,
        amtBalanceLimit: this.formData?.soleTrademortgageBalance || 0,
        amtLiability: this.formData?.soleTradeMortgageAmount || 0,
        liabilityFrequency: configure?.financialPosition?.defaultFrequency,
        // "expenseCategory": "1LA"
      },
      // {
      //   financialPositionLiabilityId:
      //     this.formData?.rentfinancialPositionLiabilityId || 0,
      //   // "financialPositionBaseId": 127,
      //   liabilityDescription: this.formData?.rentId,
      //   amtBalanceLimit: this.formData?.soleTradeRentBalance || 0,
      //   amtLiability: this.formData?.soleTradeRentAmount || 0,
      //   liabilityFrequency: configure?.financialPosition?.defaultFrequency,
      //   // "expenseCategory": "1LA"
      // },
      {
        financialPositionLiabilityId:
          this.formData?.loanfinancialPositionLiabilityId || 0,
        // "financialPositionBaseId": 127,
        liabilityDescription: this.formData?.loanId,
        amtBalanceLimit: this.formData?.soleTradeloansBalance || 0,
        amtLiability: this.formData?.soleTradeloansAmount || 0,
        liabilityFrequency: configure?.financialPosition?.defaultFrequency,
        // "expenseCategory": "2L"
      },
      {
        financialPositionLiabilityId:
          this.formData?.creditfinancialPositionLiabilityId || 0,
        // "financialPositionBaseId": 127,
        liabilityDescription: this.formData?.creditId,
        amtBalanceLimit: this.formData?.soleTradecreditcardBalance || 0,
        amtLiability: this.formData?.soleTradecreditcardAmount || 0,
        liabilityFrequency: configure?.financialPosition?.defaultFrequency,
        // "expenseCategory": "3LBA"
      },
      {
        financialPositionLiabilityId:
          this.formData?.otherfinancialPositionLiabilityId || 0,
        // "financialPositionBaseId": 127,
        liabilityDescription: this.formData?.otherLiabilitiesId,
        amtBalanceLimit: this.formData?.soleTradeotherBalance || 0,
        amtLiability: this.formData?.soleTradeotherAmount || 0,
        liabilityFrequency: configure?.financialPosition?.defaultFrequency,
        // "expenseCategory": "3LBA"
      },
    ];

    let params: any = this.route.snapshot.params;

    const financialDetailbody = {
      financialPositionBase: {
        IsSharedFinancialPosition:
          this.formData?.role === 2 ? this.formData?.IsSharedFinancialPosition : false,
        financialPositionBaseId:
          this.formData?.financialPositionBaseId ||
          this.formData?.financialPositionBase?.financialPositionBaseId ||
          this.formData.SoleTradeFinancialDetailRes?.data?.financialDetails
            ?.financialPositionBase?.financialPositionBaseId ||
          0,
        contractId: this.contractId || Number(params.contractId),
        partyId: this.formData?.customerId,
        partyNo: this.formData?.customerNo,
        partyName: this.formData?.customerContractRole?.customerName,
        contractPartyRole: this.formData?.customerContractRole?.roleName,
        lastUpdatedDt: new Date().toISOString().slice(0, 19) || "",
        homeOwnership: this.formData?.assestHomeOwnerType || 0,
        amtHomeValue: this.formData?.financialAssetDetails?.[0]?.amount || 0,
        amtVehicleValue: this.formData?.financialAssetDetails?.[1]?.amount || 0,
        amtFurnitureValue:
          this.formData?.financialAssetDetails?.[2]?.amount || 0,
        amtTakeHomePay: this.formData?.incomeDetails?.[0]?.amount,
        takeHomePayFrequency: this.formData?.incomeDetails?.[0]?.frequency,
        amtSpousePay: this.formData?.incomeDetails?.[1]?.amount,
        spousePayFrequency: this.formData?.incomeDetails?.[1]?.frequency,
        isIncomeLikelyToDecrease: Boolean(this.formData?.isIncomeDecrease),
        incomeDecrDetail: this.formData?.details || "",
        amtTotalMonthlyExpenditure: 0,
        turnoverLatestYearEndingDt:
          this.formData?.soleTradeturnoverLatestYearEndingDt ||
          new Date("1900-01-01").toISOString().split("T")[0] + "T00:00:00",
        amtTurnoverLatestYear: this.formData?.soleTradeAmtTurnoverLatestYear,
        turnoverPrevYearEndingDt:
          this.formData?.soleTradeTurnoverPrevYearEndingDt ||
          new Date("1900-01-01").toISOString().split("T")[0] + "T00:00:00",
        amtTurnoverPrevYear: this.formData?.soleTradeAmtTurnoverPrevYear,
        cashBalLatestYrEndDt:
          this.formData?.soleTradeCashBalLatestYrEndDt ||
          new Date("1900-01-01").toISOString().split("T")[0] + "T00:00:00",
        amtCashBalLatestYr: this.formData?.soleTradeAmtCashBalLatestYr,
        debtorBalLatestYrEndDt:
          this.formData?.soleTradeDebtorBalLatestYrEndDt ||
          new Date("1900-01-01").toISOString().split("T")[0] + "T00:00:00",
        amtDebtorBalLatestYr: this.formData?.soleTradeAmtDebtorBalLatestYr,
        creditorBalLatestYrEndDt:
          this.formData?.soleTradeCreditorBalLatestYrEndDt ||
          new Date("1900-01-01").toISOString().split("T")[0] + "T00:00:00",
        amtCreditorBalLatestYr: this.formData?.soleTradeAmtCreditorBalLatestYr,
        overdraftBalLastYrEndDt:
          this.formData?.soleTradeOverdraftBalLastYrEndDt ||
          new Date("1900-01-01").toISOString().split("T")[0] + "T00:00:00",
        amtOverdraftBalLatestYr:
          this.formData?.soleTradeAmtOverdraftBalLatestYr,
        IsNetProfitLastYear: Boolean(
          this.formData?.soleTradeisNetProfitLastYear
        ),
        amtLastYearNetProfit: this.formData?.soleTradeAmtLastYearNetProfit,
      },
      financialPositionAsset: this.formData?.financialPositionAsset || [],
      financialPositionIncome: this.formData?.financialPositionIncome || [],
      financialPositionExpenditure:
        this.formData?.financialPositionExpenditure || [],
      financialPositionRegularRecurring:
        this.formData?.financialPositionRegularRecurring || [],
      financialPositionLiability: this.financialPositionLiability || [],
    };

    let body = {
      contractId: this.contractId || Number(params?.contractId) || 0,
      isConfirmed: false,
      individual: {
        businessIndividual: "Individual",
        customerId: this.formData?.customerId,
        customerNo: this.formData?.customerNo,
        partyType: ["Direct Customer"],
        role: this.formData?.role,
        customerContractRole: this.formData?.customerContractRole,
        addressDetails: null,
        employementDetails: null,
        financialDetails: financialDetailbody,
        personalDetails: null,
        referenceDetails: null,
      },
    };

    let res: any = await this.putFormData(
      //Subhashish
      "CustomerDetails/update_customer",
      body
    );

    this.soleTradeSvc.setBaseDealerFormData({
      SoleTradeFinancialDetailRes: res,
      //  financialPositionAsset: res?.data?.financialDetails?.financialPositionAsset || [],
      //  financialPositionLiability: res?.data?.financialDetails?.financialPositionLiability || [],
    });

    const financialDetails = res?.data?.financialDetails;

    if (financialDetails?.financialPositionAsset?.length > 0) {
      this.soleTradeSvc.setBaseDealerFormData({
        financialPositionAsset: financialDetails?.financialPositionAsset,
      });
    }

    if (financialDetails?.financialPositionLiability?.length > 0) {
      this.soleTradeSvc.setBaseDealerFormData({
        financialPositionLiability:
          financialDetails?.financialPositionLiability,
      });

      financialDetails?.financialPositionLiability?.forEach((item: any) => {
        switch (item.expenseCategory) {
          case "1LA": // Mortgage
            this.formData.mortagefinancialPositionLiabilityId =
              item.financialPositionLiabilityId;
            break;

          // case "1LB": // Rent
          // this.formData.rentfinancialPositionLiabilityId =
          //   item.financialPositionLiabilityId;
          // break;

          case "2L": // Loans
            this.formData.loanfinancialPositionLiabilityId =
              item.financialPositionLiabilityId;
            break;

          case "3LBA": // Credit Cards
            this.formData.creditfinancialPositionLiabilityId =
              item.financialPositionLiabilityId;
            break;

          case "4L": // Other Liabilities
            this.formData.otherfinancialPositionLiabilityId =
              item.financialPositionLiabilityId;
            break;
        }
      });
    }

    const updateSSOPColor = this.updatedCustomerSummary?.find(c => c.customerNo === this.formData.customerNo)
    if (updateSSOPColor) {
      updateSSOPColor.isSharedFinancialPosition = financialDetails?.financialPositionBase?.isSharedFinancialPosition || res?.data?.customerContractRole?.isSharedFinancialPosition;
    }

    this.standardQuoteSvc.setBaseDealerFormData({
      updatedCustomerSummary: this.updatedCustomerSummary
    })

    sessionStorage.setItem("updatedCustomerSummary", JSON.stringify(this.updatedCustomerSummary));
  }

  async referenceDetailPost() {
    let body = {
      contractId: this.contractId || Number(this.params?.contractId),
      isConfirmed: this.formData?.soleTradeConfirmation,
      individual: {
        business: null,
        addressDetails: null,
        businessIndividual: "Individual",
        customerId: this.formData?.customerId,
        customerNo: this.formData?.customerNo,
        role: this.formData?.role,
        customerContractRole: this.formData?.customerContractRole,
        employementDetails: null,
        financialDetails: null,
        personalDetails: null,
        partyType: ["Direct Customer"],
        referenceDetails: this.formData?.referenceDetailsTemp,
      },
    };
    let res: any = await this.putFormData(
      "CustomerDetails/update_customer",
      body
    );

    this.formData.referenceDetailsTemp = res?.data?.referenceDetails;

    return res;
  }

  async soleTradeDetailsPost() {
    const body = {
      contractId: this.contractId,
      isConfirmed: false,
      individual: {
        customerId: -1,
        customerNo: -1,
        role: this.formData?.role,
        businessIndividual: "Individual",
        employementDetails: null,
        financialDetails: null,
        addressDetails: null,
         partyType: ["Direct Customer"],
        personalDetails: {
          title: this.formData?.title,
          firstName: this.formData?.firstName,
          middleName: this.formData?.middleName,
          lastName: this.formData?.lastName,
          knownAs: this.formData?.knownAs,
          gender: this.formData?.gender,
          dateOfBirth: this.formData?.dateOfBirth,
          maritalStatus: this.formData?.maritalStatus,
          noOfDependents: String(this.formData?.noOfDependents || "0"),
          dependentsAge: this.formData?.noOfDependentArr
            .map((obj) => obj.age)
            .join(", "),
          licenceType: this.formData?.licenseType,
          countryOfIssue: this.formData?.countryOfIssue,
          licenceNumber: this.formData?.licenceNumber,
          versionNumber: this.formData?.versionNumber,
          isNewZealandResident: "Yes",
          countryOfBirth: this.formData?.countryOfBirth,
          countryOfCitizenship1: this.formData?.countryOfCitizenship1,
          countryOfCitizenship2: this.formData?.countryOfCitizenship2,
          countryOfCitizenship3: this.formData?.countryOfCitizenship3,
          emails: this.getIndividualDetailEmail(
            this.formData?.personalDetailsEmail
          ),
          phone: this.formData?.personalDetailsPhone,
          partyType: ["Direct Customer"],
          partyStatus: "",
          phoneBusinessExtension: "",
          preferredContactMethod: "",
          reference: "",
        },
        referenceDetails: null,
      },
      business: {
        business: {
          tradingName: this.formData?.tradingName,
          taxNumber: this.formData?.gstNum,
          businessDescription: this.formData?.businessDescription,
          natureOfBusiness:
            this.formData?.natureOfBusiness !== "undefined"
              ? this.decodeHtmlEntities(this.formData.natureOfBusiness)
              : null,
          timeInBusinessYears: String(
            this.formData?.timeInBusinessYears || "0"
          ),
          timeInBusinessMonths: String(
            this.formData?.timeInBusinessMonths || ""
          ),
        },
      },
    };

    const res = await this.postFormData("CustomerDetails/add_customer", body);
    this.formData.customerId = res?.data?.customerId;
    this.formData.customerNo = res?.data?.customerNo;
    this.formData.customerContractRole = res?.data?.customerContractRole;

    if(res?.data?.customerContractRole){
       if (this.updatedCustomerSummary) {
        const index = this.updatedCustomerSummary.findIndex(
          (c) => c.customerNo === this.formData?.customerNo
        );

        if (index !== -1) {
        this.updatedCustomerSummary[index] = res?.data?.customerContractRole;
        sessionStorage.setItem("updatedCustomerSummary", JSON.stringify(this.updatedCustomerSummary));
        }

      }

    }

    if (this.mode === "create") {
      this.soleTradeSvc.standardQuoteData.push(res);
      this.soleTradeSvc.standardQuoteDataSubject?.next(
        this.soleTradeSvc.standardQuoteData
      );
    }

    return res;
  }

  async soleTradeDetailsUpdate() {
    const body = {
      contractId: this.contractId || Number(this.params?.contractId),
      isConfirmed: false,
      individual: {
        customerId: this.formData?.customerId,
        customerNo: this.formData?.customerNo,
        role: this.formData?.role,
        businessIndividual: "Individual",
        employementDetails: null,
        financialDetails: null,
        addressDetails: null,
        partyType: ["Direct Customer"],
        personalDetails: {
          title: this.formData?.title,
          firstName: this.formData?.firstName,
          middleName: this.formData?.middleName,
          lastName: this.formData?.lastName,
          knownAs: this.formData?.knownAs,
          gender: this.formData?.gender,
          dateOfBirth: this.formData?.dateOfBirth,
          maritalStatus: this.formData?.maritalStatus,
          noOfDependents: String(this.formData?.noOfDependents || "0"),
          dependentsAge: this.formData?.noOfDependentArr
            .map((obj) => obj.age)
            .join(", "),
          licenceType: this.formData?.licenseType,
          countryOfIssue: this.formData?.countryOfIssue,
          licenceNumber: this.formData?.licenceNumber,
          versionNumber: this.formData?.versionNumber,
          isNewZealandResident: this.formData?.isNewZealandResident,
          countryOfBirth: this.formData?.countryOfBirth,
          countryOfCitizenship1: this.formData?.countryOfCitizenship1 || "",
          countryOfCitizenship2: this.formData?.countryOfCitizenship2 || "",
          countryOfCitizenship3: this.formData?.countryOfCitizenship3 || "",
          emails: this.getIndividualDetailEmail(
            this.formData?.personalDetailsEmail
          ),
          phone: this.formData?.personalDetailsPhone,
          // partyType: ["Direct Customer"],
          partyStatus: "",
          phoneBusinessExtension: "",
          preferredContactMethod: "",
          reference: "",
        },
        referenceDetails: null,
      },
      business: {
        business: {
          tradingName: this.formData?.tradingName,
          taxNumber: this.formData?.gstNum,
          businessDescription: this.formData?.businessDescription,
          natureOfBusiness:
            this.formData?.natureOfBusiness !== "undefined"
              ? this.decodeHtmlEntities(this.formData.natureOfBusiness)
              : null,
          timeInBusinessYears: String(
            this.formData?.timeInBusinessYears || "0"
          ),
          timeInBusinessMonths: String(
            this.formData?.timeInBusinessMonths || ""
          ),
        },
      },
    };

    let res = await this.putFormData("CustomerDetails/update_customer", body);

    this.formData.customerId = res?.data?.customerId;
    this.formData.customerNo = res?.data?.customerNo;
    this.formData.customerContractRole = res?.data?.customerContractRole;

    if(res?.data?.customerContractRole){
       if (this.updatedCustomerSummary) {
        const index = this.updatedCustomerSummary.findIndex(
          (c) => c.customerNo === this.formData?.customerNo
        );

        if (index !== -1) {
        this.updatedCustomerSummary[index] = res?.data?.customerContractRole;
        sessionStorage.setItem("updatedCustomerSummary", JSON.stringify(this.updatedCustomerSummary));
        }

      }

    }

    if (this.mode === "edit") {
      let index = this.soleTradeSvc.standardQuoteData.findIndex(
        (ele) => ele.data?.customerNo == res?.data?.customerNo
      );
      this.soleTradeSvc.standardQuoteData[index] = { ...res };
      this.soleTradeSvc.standardQuoteDataSubject.next(
        this.soleTradeSvc.standardQuoteData
      );
    }

    return res;
  }

  decodeHtmlEntities(value: string): string {
    const txt = document.createElement("textarea");
    txt.innerHTML = value;
    return txt.value;
  }

  async updateAddressDetails() {
    let addressBody: any = [
      {
        addressId: this.formData?.physicalAddressId || -1,
        addressType: "Street",
        residentType: this.formData?.physicalResidenceType || null,
        county: null,
        stateProvince: null,
        countryRegion: {
          extName: this.formData?.physicalCountry || "New Zealand",
        },
        city:
          this.formData?.physicalCountry?.toLowerCase() === "new zealand"
            ? {
              LocationId: this.formData?.physicalCityLocationId,
              extName: this.formData?.physicalCity,
            }
            : undefined,
        zipCode: String(this.formData?.physicalPostcode),
        suburb: this.formData?.physicalSuburbs,
        street:
          this.formData?.physicalCountry?.toLowerCase() !== "new zealand"
            ? this.formData?.physicalStreetArea
            : "default",
        alternateSuburb: "",
       effectDtFrom: this.calculateNewDate(
          Number(this.formData?.physicalYear || 0),
          Number(this.formData?.physicalMonth || 0)
        ),
        // this.calculateNewDate(
        //   Number(this.formData?.physicalYear),
        //   Number(this.formData?.physicalMonth)
        // ),
       // "2025-09-22T15:20:08",
        effectDtTo:null,
        isCurrent: true,
        addressComponentTemplateHdrId:
          this.formData?.physicalCountry?.toLowerCase() === "new zealand"
            ? 1
            : 0,
        addressComponents:
          this.formData?.physicalCountry?.toLowerCase() === "new zealand"
            ? [
              {
                type: "BuildingName",
                value: this.formData?.physicalBuildingName,
              },
              { type: "FloorType", value: this.formData?.physicalFloorType },
              {
                type: "FloorNo",
                value: String(this.formData?.physicalFloorNumber),
              },
              { type: "UnitType", value: this.formData?.physicalUnitType },
              { type: "UnitLot", value: this.formData?.physicalUnitNumber },
              {
                type: "StreetNo",
                value: this.formData?.physicalStreetNumber,
              },
              {
                type: "StreetName",
                value: this.formData?.physicalStreetName,
              },
              {
                type: "StreetType",
                value: this.formData?.physicalStreetType,
              },
              {
                type: "StreetDirection",
                value: this.formData?.physicalStreetDirection,
              },
              {
                type: "RuralDelivery",
                value: this.formData?.physicalRuralDelivery,
              },
            ]
            : null,
      },
      {
        addressId: this.formData?.postalAddressId || -1,
        //postal address 
        addressType: "Mailing",
        county: null,
        stateProvince: null,
        countryRegion: {
          extName: this.formData?.postalCountry || "New Zealand",
        },
        city:
          this.formData?.postalCountry?.toLowerCase() === "new zealand"
            ? {
              LocationId: this.formData?.postalCityLocationId,
              extName: this.formData?.postalCity,
            }
            : undefined,
        zipCode: String(this.formData?.postalPostcode),
        // postalNumber: String(this.formData?.postalPostalNumber),
        suburb: this.formData?.postalSuburbs,
        street:
          this.formData?.postalAddressType?.toLowerCase() === "street"
            ? "default"
            : this.formData?.postalStreetArea,
        alternateSuburb: "",
        effectDtFrom: new Date().toISOString()?.split(".")[0],
        effectDtTo:null,
        isCurrent: true,
        residentType:null,
        addressComponentTemplateHdrId:
          this.formData?.postalAddressType?.toLowerCase() === "street" ? 1 : 0,
        addressComponents:
          this.formData?.postalAddressType?.toLowerCase() === "street"
            ? [
              {
                type: "BuildingName",
                value: this.formData?.postalBuildingName,
              },
              { type: "FloorType", value: this.formData?.postalFloorType },
              {
                type: "FloorNo",
                value: String(this.formData?.postalFloorNumber),
              },
              { type: "UnitType", value: this.formData?.postalUnitType },
              { type: "UnitLot", value: this.formData?.postalUnitNumber },
              { type: "StreetNo", value: this.formData?.postalStreetNumber },
              { type: "StreetName", value: this.formData?.postalStreetName },
              { type: "StreetType", value: this.formData?.postalStreetType },
              {
                type: "StreetDirection",
                value: this.formData?.postalStreetDirection,
              },
              {
                type: "RuralDelivery",
                value: this.formData?.postalRuralDelivery,
              },
            ]
            : [],
      },
      {
        addressId: this.formData?.registerAddressId || -1,
        addressType: "Registered",
        county: null,
        stateProvince: null,
        // postalNumber: String(this.formData?.registerPostalNumber),
        countryRegion: {
          extName: this.formData?.registerCountry || "New Zealand",
        },
        city:
          this.formData?.registerCountry?.toLowerCase() === "new zealand"
            ? {
              LocationId: this.formData?.registerCityLocationId,
              extName: this.formData?.registerCity,
            }
            : undefined,
        zipCode: String(this.formData?.registerPostcode),
        suburb: this.formData?.registerSuburbs,
        street:
          this.formData?.registerCountry?.toLowerCase() !== "new zealand"
            ? this.formData?.registerStreetArea
            : "default",
        alternateSuburb: "",
        effectDtFrom: new Date().toISOString()?.split(".")[0],
        effectDtTo:null,
        residentType:null,
        isCurrent: true,
        addressComponentTemplateHdrId:
          this.formData?.registerCountry?.toLowerCase() === "new zealand"
            ? 1
            : 0,
        addressComponents:
          this.formData?.registerCountry?.toLowerCase() === "new zealand"
            ? [
              {
                type: "BuildingName",
                value: this.formData?.registerBuildingName,
              },
              { type: "FloorType", value: this.formData?.registerFloorType },
              {
                type: "FloorNo",
                value: String(this.formData?.registerFloorNumber),
              },
              { type: "UnitType", value: this.formData?.registerUnitType },
              { type: "UnitLot", value: this.formData?.registerUnitNumber },
              {
                type: "StreetNo",
                value: this.formData?.registerStreetNumber,
              },
              {
                type: "StreetName",
                value: this.formData?.registerStreetName,
              },
              {
                type: "StreetType",
                value: this.formData?.registerStreetType,
              },
              {
                type: "StreetDirection",
                value: this.formData?.registerStreetDirection,
              },
              {
                type: "RuralDelivery",
                value: this.formData?.registerRuralDelivery,
              },
            ]
            : null,
      },
    ];

    if (
      this.formData?.copyToPreviousAddress ||
      this.formData?.previousTextArea ||
      Number(this.formData?.physicalYear) * 12 +
      Number(this.formData?.physicalMonth) <
      36
    ) {
    
      addressBody.push({
        addressId: this.formData?.previousAddressId || -1,
        addressType: "Street",
        county: null,
        stateProvince: null,
        residentType:null,
        countryRegion: {
          extName: this.formData?.previousCountry || "New Zealand",
        },
        city: {
          LocationId: this.formData?.previousCityLocationId,
          extName: this.formData?.previousCity,
        },
        zipCode: String(this.formData?.previousPostcode),
        suburb: this.formData?.previousSuburbs,
        street: this.formData?.overseasAddress
          ? this.formData?.previousStreetArea
          : "default",
        alternateSuburb: "",


        
        //effectDtFrom:
        //  this.calculateNewPreviousDate(
        //   this.calculateNewDate(
        //     Number(this.formData?.physicalYear),
        //     Number(this.formData?.physicalMonth)
        //   ),
        //   Number(this.formData?.previousYear),
        //   Number(this.formData?.previousMonth)
        // ),
        
        
        // ),
        // new Date().toISOString()?.split(".")[0],
        effectDtFrom: this.calculateNewPreviousDate(
          this.calculateNewDate(
            Number(this.formData?.physicalYear || 0),
            Number(this.formData?.physicalMonth || 0)
          ),
          Number(this.formData?.previousYear || 0),
          Number(this.formData?.previousMonth || 0)
        ),
       // "2025-09-22T15:20:08",
        effectDtTo: null,
        // new Date().toISOString(),
         // new Date().toISOString()?.split(".")[0],
        isCurrent: false,
        addressComponentTemplateHdrId: this.formData?.overseasAddress ? 0 : 1,
        addressComponents: this.formData?.overseasAddress
          ? []
          : [
            {
              type: "BuildingName",
              value: this.formData?.previousBuildingName,
            },
            { type: "FloorType", value: this.formData?.previousFloorType },
            {
              type: "FloorNo",
              value: String(this.formData?.previousFloorNumber),
            },
            { type: "UnitType", value: this.formData?.previousUnitType },
            { type: "UnitLot", value: this.formData?.previousUnitNumber },
            { type: "StreetNo", value: this.formData?.previousStreetNumber },
            { type: "StreetName", value: this.formData?.previousStreetName },
            { type: "StreetType", value: this.formData?.previousStreetType },
            {
              type: "StreetDirection",
              value: this.formData?.previousStreetDirection,
            },
            {
              type: "RuralDelivery",
              value: this.formData?.previousRuralDelivery,
            },
          ],
      });
    }

    let body = {
      contractId: this.contractId || Number(this.params?.contractId),
      isConfirmed: false,
      individual: {
        businessIndividual: "Individual",
        customerId: this.formData?.customerId,
        customerNo: this.formData?.customerNo,
        role: this.formData?.role,
        partyType: ["Direct Customer"],
        customerContractRole: this.formData?.customerContractRole
          ? this.formData?.customerContractRole
          : this.soleindividualCustomerDetails?.customerContractRole,
        addressDetails: addressBody,
        financialDetails: null,
        personalDetails: null,
        employementDetails: null,
        referenceDetails: null,
      },
      business: null,
    };

    let res = await this.putFormData("CustomerDetails/update_customer", body);

    if (res?.data?.addressDetails?.length > 0) {
      const getAddress = (type: string, isCurrent: boolean = true) =>
        res?.data?.addressDetails?.find(
          (address) =>
            address.addressType?.toLowerCase() === type &&
            address.isCurrent === isCurrent
        );

      const physicalAddress = getAddress("street", true);
      const previousAddress = getAddress("street", false);
      const postalAddress = getAddress("mailing", true);
      const registerAddress = getAddress("registered", true);

      this.soleTradeSvc.setBaseDealerFormData({
        physicalAddressId: physicalAddress?.addressId,
        postalAddressId: postalAddress?.addressId,
        previousAddressId: previousAddress?.addressId,
        registerAddressId: registerAddress?.addressId,
      });
    }

    return res;
  }

  async employmentDetailsPost() {
    let body = {
      contractId: this.contractId || Number(this.params?.contractId),
      isConfirmed: false,
        partyType: ["Direct Customer"],
      individual: {
        personalDetails: null,
        addressDetails: null,
        employementDetails: this.formData?.previousEmployer
          ? [
            // Current employment details
            {
              employmentInfoId: this.currentEmployeeInfoId || -1,
              isCurrent: true,
              employmentStatus: this.formData?.currentEmploymentType,
              occupationType: this.formData?.currentOccupation,
              employerName: this.formData?.currentEmployer,
              comment: "",
              primaryIncomeSource: null,
              jobTitle: this.formData?.currentOccupation,
              grossIncome: 0,
              effectDtFrom: this.calculateNewDate(
                this.formData?.currentEmployeeYear,
                this.formData?.currentEmployeeMonth
              ),
              effectDtTO: this.calculateNewDate(0, 0),
            },
            // Previous employment details
            {
              employmentInfoId: this.previousEmployeeInfoId || -1,
              isCurrent: false, // Mark the previous one as not current
              employmentStatus: this.formData?.previousEmploymentType,
              occupationType: this.formData?.previousOccupation,
              employerName: this.formData?.previousEmployer,
              comment: null,
              primaryIncomeSource: null,
              jobTitle: this.formData?.previousOccupation,
              grossIncome: 0,
              effectDtFrom: this.calculateNewPreviousDate(
                this.calculateNewDate(
                  this.formData?.currentEmployeeYear,
                  this.formData?.currentEmployeeMonth
                ),
                this.formData?.previousEmployeeYear,
                this.formData?.previousEmployeeMonth
              ),
              effectDtTO: this.calculateNewDate(
                this.formData?.currentEmployeeYear,
                this.formData?.currentEmployeeMonth
              ),
            },
          ]
          : [
            // Only current employment details if no previous employment exists
            {
              employmentInfoId: this.currentEmployeeInfoId || -1,
              isCurrent: true,
              employmentStatus: this.formData?.currentEmploymentType,
              occupationType: this.formData?.currentOccupation,
              employerName: this.formData?.currentEmployer,
              comment: null,
              primaryIncomeSource: null,
              jobTitle: this.formData?.currentOccupation,
              grossIncome: 0,
              effectDtFrom: this.calculateNewDate(
                this.formData?.currentEmployeeYear,
                this.formData?.currentEmployeeMonth
              ),
              effectDtTO: this.calculateNewDate(0, 0),
            },
          ],
        financialDetails: null,
        referenceDetails: null,
        customerId: this.formData?.customerId,
        customerNo: this.formData?.customerNo,
        businessIndividual: "Individual",
        partyType: ["Direct Customer"],
      },
    };

    // Perform the update or create operation
    let res: any = await this.putFormData(
      "CustomerDetails/update_customer",
      body
    );

    if (this.mode == "edit") {
      let index = this.standardQuoteSvc?.individualData?.findIndex(
        (ele) => ele.data?.customerNo == res?.data?.customerNo
      );
      this.standardQuoteSvc.individualData[index] = { ...res };
      this.standardQuoteSvc.individualDataSubject.next(
        this.standardQuoteSvc.individualData
      );
    } else if (this.mode == "create") {
      this.standardQuoteSvc.individualData.push(res);
      this.standardQuoteSvc.individualDataSubject.next(
        this.standardQuoteSvc.individualData
      );
    }

    this.soleTradeSvc.setBaseDealerFormData({
      employementDetails: res?.data?.employementDetails,
    });

    return res;
  }

  async putFormData(api: string, payload: any, mapFunc?: MapFunc) {
    return await this.commonSvc.data
      ?.put(api, payload)
      ?.pipe(
        map((res) => {
          if (mapFunc) {
            res = mapFunc(res);
          }
          return res;
        })
      )
      .toPromise();
  }

  async postFormData(api: string, payload: any, mapFunc?: MapFunc) {
    return await this.commonSvc.data
      ?.post(api, payload)
      ?.pipe(
        map((res) => {
          if (mapFunc) {
            res = mapFunc(res);
          }
          return res;
        })
      )
      .toPromise();
  }

  calculateNewDate(yearsToSubtract, monthsToSubtract) {
    const date = new Date();
    const totalMonthsToSubtract = yearsToSubtract * 12 + monthsToSubtract;
    date.setMonth(date.getMonth() - totalMonthsToSubtract);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

 calculateNewPreviousDate(referenceDate, yearsToSubtract, monthsToSubtract) {
    const date = new Date(referenceDate);
    const totalMonthsToSubtract = yearsToSubtract * 12 + monthsToSubtract;
    date.setMonth(date.getMonth() - totalMonthsToSubtract);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  getTimeDifference(
    fromDate: string,
    toDate: string = new Date().toISOString(),
    unit: "year" | "month" = "year"
  ): number {
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return 0;
    }

    let yearsDifference = endDate.getFullYear() - startDate.getFullYear();
    let monthsDifference = endDate.getMonth() - startDate.getMonth();

    if (monthsDifference < 0) {
      yearsDifference -= 1;
      monthsDifference += 12;
    }

    return unit === "year" ? yearsDifference : monthsDifference;
  }

  async onSubmit(params) {
    const paramsUrl: any = this.route.snapshot.params;

    const updateCustomerIcon = this.updatedCustomerSummary?.find(c => c.customerNo === this.formData.customerNo)
    if (updateCustomerIcon) {
      updateCustomerIcon.showInfoIcon = false
      updateCustomerIcon.isConfirmed = this.formData?.soleTradeConfirmation
    }


    this.standardQuoteSvc.setBaseDealerFormData({
      updatedCustomerSummary: this.updatedCustomerSummary
    })

    this.soleTradeSvc.setBaseDealerFormData({
      updatedCustomerSummary: this.updatedCustomerSummary
    })

    sessionStorage.setItem("updatedCustomerSummary", JSON.stringify(this.updatedCustomerSummary));

    //The above code is for handling red-icon from the UI

    if (this.soleTradeConfirmation) {
      this.soleTradeSvc.stepper.next({
        activeStep: this.activeStep,
        validate: true,
      });
      const statusInvalid =
        this.soleTradeSvc?.formStatusArr?.includes("INVALID");
      this.soleTradeSvc.formStatusArr = [];
      if (!statusInvalid) {
        this.soleTradeSvc.iconfirmCheckbox.next(null);  //setting empty value to checkbox observable which is used for tab validations 
        this.soleTradeSvc.showValidationMessage = false; //this flag is for mark all as read for all the customer components
        this.activeStep = params.activeStep;
        this.standardQuoteSvc.activeStep = 1;
        this.soleTradeSvc.stepper.next(params);
        let referenceDetailResponse = await this.referenceDetailPost();

         const isAddingExistingCustomer = this.soleTradeSvc?.addingExistingCustomer;

          if(isAddingExistingCustomer && this.updatedCustomerSummary?.currentWorkflowStatus != "Start Verification" ){ //To change workflow state of the party when adding existing customer to new contract
              let requestBody = {
                nextState: "Start Verification",
                isForced: true
              }

              await this.putFormData(`WorkFlows/update_party_workflowstate?PartyNo=${this.formData?.customerNo}&WorkflowName=ID Party Verification`, requestBody);
            }

        if (this.mode == "create") {
          this.standardQuoteSvc.mode = "create";
          let mode = this.standardQuoteSvc.mode;
          if (referenceDetailResponse) {
            this.commonSvc.router.navigateByUrl(
              `/dealer/standard-quote/edit/${this.contractId || Number(paramsUrl?.contractId)
              }`
            );
            this.soleTradeSvc.resetBaseDealerFormData();
            this.standardQuoteSvc.activeStep = 1;
          }
        } else if (this.mode == "edit" || this.mode == "view") {
          this.standardQuoteSvc.mode = "edit";
          let mode = this.standardQuoteSvc.mode;
          if (referenceDetailResponse) {
            this.commonSvc.router.navigateByUrl(
              `/dealer/standard-quote/edit/${this.contractId || Number(paramsUrl?.contractId)
              }`
            );
            this.soleTradeSvc.resetBaseDealerFormData();
            this.standardQuoteSvc.activeStep = 1;
          }
        }
      }
    } else {
      this.toasterService.showToaster({
        severity: "error",
        detail: "Please Confirm your details are correct",
      });
    }
  }

  activeStep = 0;
  steps = [
    { label: "Business Individual" },
    { label: "Address Details" },
    { label: "Employment Details" },
    { label: "Financial Position" },
    { label: "Reference Details" },
  ];

  async changeStep(params) {
    if (params.type === "submit") {
      await this.onSubmit(params);
    }

    if (params.type === "previous") {
      this.activeStep = params.activeStep;
      this.soleTradeSvc.activeStep = this.activeStep;
      this.soleTradeSvc.stepper.next(params);
      this.soleTradeSvc.formStatusArr.length = 0;
    }

    if (params.type === "next") {
      this.soleTradeSvc.stepper.next({
        activeStep: this.activeStep,
        validate: true,
      });
      // const statusInvalid = this.soleTradeSvc.formStatusArr?.includes("INVALID");

      let res = null;
      // if (!statusInvalid) {
      if (this.formData?.role && this.formData.role !== 0) {
        try {
          if (this.mode === "create") {
            if (this.activeStep === 0 && !this.formData?.customerNo) {
              res = await this.soleTradeDetailsPost();
            } else if (this.activeStep === 0 && this.formData?.customerNo) {
              res = await this.soleTradeDetailsUpdate();
            }
            if (this.activeStep === 1) {
              res = await this.updateAddressDetails();
            }
            if (this.activeStep == 2) {
              res = await this.employmentDetailsPost();
            }
            if (this.activeStep === 3) {
              res = await this.financialAccountUpdate();
            }
            if (this.activeStep === 4) {
              res = await this.referenceDetailPost();
            }
          }
          if (this.mode === "edit") {
            const borrowerExists = this.soleTradeSvc?.role === 1;
            const isAddingExistingCustomer = this.soleTradeSvc?.addingExistingCustomer;
            const newCustomerIsBorrower = this.formData?.role === 1;

            if (borrowerExists && isAddingExistingCustomer && newCustomerIsBorrower) {
              // Show error - Borrower exists AND we're trying to add existing customer as borrower
              this.toasterService.showToaster({
                severity: "error",
                detail: "Borrower already exists.",
              });
              return;
            }
            else if (!borrowerExists && !newCustomerIsBorrower) {
              // Allow this case - No borrower exists and we're adding a borrower
              // You might want to add your operation code here too
              this.toasterService.showToaster({
                severity: "error",
                detail: "Kindly add Borrower first.",
              });
              return;
            }

            else {
            // if (borrowerExists && !isAddingExistingCustomer) {
              if (this.activeStep === 0) {
                //alert()
                res = await this.soleTradeDetailsUpdate();
              }
              if (this.activeStep === 1) {
                res = await this.updateAddressDetails();
              }
              if (this.activeStep == 2) {
                res = await this.employmentDetailsPost();
              }
              if (this.activeStep === 3) {
                res = await this.financialAccountUpdate();
              }
              if (this.activeStep === 4) {
                res = await this.referenceDetailPost();
              }

              if(res){
                const updateCustomerIsConfirmAsPerApiResponse = this.updatedCustomerSummary?.find(c => c.customerNo === this.formData?.customerNo)
                if(updateCustomerIsConfirmAsPerApiResponse){
                  updateCustomerIsConfirmAsPerApiResponse.isConfirmed = res?.data?.customerContractRole?.isConfirmed 
                }
                this.formData.soleTradeConfirmation = res?.data?.customerContractRole?.isConfirmed
              }

              const updateCustomerIcon = this.updatedCustomerSummary?.find(c => c.customerNo === this.formData.customerNo)
              if (updateCustomerIcon) {
                updateCustomerIcon.showInfoIcon = false
              }


              this.standardQuoteSvc.setBaseDealerFormData({
                updatedCustomerSummary: this.updatedCustomerSummary
              })

              this.soleTradeSvc.setBaseDealerFormData({
                updatedCustomerSummary: this.updatedCustomerSummary
              })

              sessionStorage.setItem("updatedCustomerSummary", JSON.stringify(this.updatedCustomerSummary));

              this.standardQuoteSvc.updateIndividualCustomerWarning = false;
            }


            if(isAddingExistingCustomer && this.updatedCustomerSummary?.currentWorkflowStatus != "Start Verification" ){  //To change workflow state of the party when adding existing customer to new contract
              let requestBody = {
                nextState: "Start Verification",
                isForced: true
              }

              await this.putFormData(`WorkFlows/update_party_workflowstate?PartyNo=${this.formData?.customerNo}&WorkflowName=ID Party Verification`, requestBody);
            }
           
          }

          if (!res?.apiError?.errors.length) {
            this.activeStep = params.activeStep; //change
            this.soleTradeSvc.activeStep = this.activeStep;
            this.soleTradeSvc.stepper.next(params);
          }
        }
        catch (error) {
          return;
        }
      }
      // this.activeStep = params.activeStep;
      // this.soleTradeSvc.activeStep = this.activeStep;
      // this.soleTradeSvc.stepper.next(params);
      // }
      // this.soleTradeSvc.formStatusArr.length = 0;
    }

    if (params.type === "draft") {
      this.soleTradeSvc.stepper.next({
        activeStep: this.activeStep,
        validate: true,
      });
      const statusInvalid = this.soleTradeSvc.formStatusArr.includes("INVALID");
      // if (!statusInvalid) {
      if (this.formData?.role && this.formData.role !== 0) {
        if (this.mode === "create") {
          if (this.activeStep === 0 && !this.formData?.customerNo) {
            await this.soleTradeDetailsPost();
          } else if (this.activeStep === 0 && this.formData?.customerNo) {
            await this.soleTradeDetailsUpdate();
          }
          if (this.activeStep === 1) {
            await this.updateAddressDetails();
          }
          if (this.activeStep == 2) {
            await this.employmentDetailsPost();
          }
          if (this.activeStep === 3) {
            await this.financialAccountUpdate();
          }
          if (this.activeStep === 4) {
            await this.referenceDetailPost();
          }
        }
        if (this.mode === "edit") {
          const borrowerExists = this.soleTradeSvc?.role === 1;
          const isAddingExistingCustomer = this.soleTradeSvc?.addingExistingCustomer;
          const newCustomerIsBorrower = this.formData?.role === 1;
          let res = null;

          if (borrowerExists && isAddingExistingCustomer && newCustomerIsBorrower) {
            // Show error - Borrower exists AND we're trying to add existing customer as borrower
            this.toasterService.showToaster({
              severity: "error",
              detail: "Borrower already exists.",
            });
            return;
          }
          else if (!borrowerExists && !newCustomerIsBorrower) {
            // Allow this case - No borrower exists and we're adding a borrower
            // You might want to add your operation code here too
            this.toasterService.showToaster({
              severity: "error",
              detail: "Kindly add Borrower first.",
            });
            return;
          }

          else{
          // if (borrowerExists && !isAddingExistingCustomer) {
            if (this.activeStep === 0) {
              res = await this.soleTradeDetailsUpdate();
            }
            if (this.activeStep === 1) {
              res = await this.updateAddressDetails();
            }
            if (this.activeStep == 2) {
              res = await this.employmentDetailsPost();
            }
            if (this.activeStep === 3) {
              res = await this.financialAccountUpdate();
            }
            if (this.activeStep === 4) {
              res = await this.referenceDetailPost();
            }

            if(res){
                const updateCustomerIsConfirmAsPerApiResponse = this.updatedCustomerSummary?.find(c => c.customerNo === this.formData?.customerNo)
                if(updateCustomerIsConfirmAsPerApiResponse){
                  updateCustomerIsConfirmAsPerApiResponse.isConfirmed = res?.data?.customerContractRole?.isConfirmed 
                }
                this.formData.soleTradeConfirmation = res?.data?.customerContractRole?.isConfirmed
              }

            const updateCustomerIcon = this.updatedCustomerSummary?.find(c => c.customerNo === this.formData.customerNo)
            if (updateCustomerIcon) {
              updateCustomerIcon.showInfoIcon = false
            }


            this.standardQuoteSvc.setBaseDealerFormData({
              updatedCustomerSummary: this.updatedCustomerSummary
            })

            this.soleTradeSvc.setBaseDealerFormData({
              updatedCustomerSummary: this.updatedCustomerSummary
            })

            sessionStorage.setItem("updatedCustomerSummary", JSON.stringify(this.updatedCustomerSummary));

            this.standardQuoteSvc.updateIndividualCustomerWarning = false; //when loan purpose is changed and there is individual customer role as borrower
          }

          if(isAddingExistingCustomer && this.updatedCustomerSummary?.currentWorkflowStatus != "Start Verification" ){  //To change workflow state of the party when adding existing customer to new contract
              let requestBody = {
                nextState: "Start Verification",
                isForced: true
              }

              await this.putFormData(`WorkFlows/update_party_workflowstate?PartyNo=${this.formData?.customerNo}&WorkflowName=ID Party Verification`, requestBody);
            }
         
        }
        // this.commonSvc.ui.showToaster({
        //   severity: 'success',
        //   detail: 'Customer Details Saved Successfully',
        // });
        this.activeStep = params.activeStep;
        this.soleTradeSvc.activeStep = this.activeStep;
        this.soleTradeSvc.stepper.next(params);
        // }
      }
      this.soleTradeSvc.formStatusArr.length = 0;
    }

    if (params.type === "tabNav") {
      this.activeStep = params.activeStep;
      this.soleTradeSvc.activeStep = this.activeStep;
      this.soleTradeSvc.stepper.next(params);
    }
  }

  cancel() {
    this.soleTradeSvc.activeStep = 0;
    const params: any = this.route.snapshot.params;
    this.commonSvc.ui.showOkDialog(
      "Any unsaved changes will be lost. Are you sure you want to cancel?",
      "Customer",
      () => {
        this.soleTradeSvc.iconfirmCheckbox.next(null);
        this.soleTradeSvc.showValidationMessage = false;
        if (this.mode == "create") {
          this.standardQuoteSvc.mode = "create";
          this.standardQuoteSvc.setBaseDealerFormData({
            CustomerID: this.formData.CustomerID,
          });
          this.commonSvc.router.navigateByUrl("/dealer/standard-quote");
          this.soleTradeSvc.resetBaseDealerFormData();
          this.standardQuoteSvc.activeStep = 1;
        } else if (this.mode == "edit" || this.mode == "view") {
          this.standardQuoteSvc.mode = "edit";
          let mode = this.standardQuoteSvc.mode;
          this.standardQuoteSvc.setBaseDealerFormData({
            CustomerID: this.formData.CustomerID,
          });
          this.commonSvc.router.navigateByUrl(
            `/dealer/standard-quote/${mode}/${params.contractId}`
          );
          this.soleTradeSvc.resetBaseDealerFormData();
          this.standardQuoteSvc.activeStep = 1;
        }
      }
    );
  }

  getIndividualDetailEmail(emailArray) {
    if (emailArray?.length === 3) {
      return emailArray;
    } else {
      let temp = ["EmailBusiness", "EmailHome"];
      temp.forEach((ele) => {
        let Obj = emailArray?.find((email) => {
          return email.type === ele;
        });

        if (!Obj) {
          emailArray?.push({
            value: "",
            type: ele,
          });
        }
      });

      return emailArray;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
