import { ChangeDetectorRef, Component, effect, OnDestroy, OnInit } from "@angular/core";
import { TrustService } from "./services/trust.service";
import { map, skip, Subject, takeUntil } from "rxjs";
import { CommonService, MapFunc, Mode, ToasterService } from "auro-ui";
import { ActivatedRoute } from "@angular/router";
import { StandardQuoteService } from "../standard-quote/services/standard-quote.service";
import { DashboardService } from "../dashboard/services/dashboard.service";
import { SearchAddressService } from "../standard-quote/services/search-address.service";

@Component({
  selector: "app-trust",
  templateUrl: "./trust.component.html",
  styleUrl: "./trust.component.scss",
})
export class TrustComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  mode: any;
  contractId: number;
  data: any = {};
  isReady: boolean;
  formData: any;
  trustCustomerContactId: any;
  accountantcustomerContactId: any;
  trustSolicitorCustomerContactId: any;
  trusteeDetailsIndividualCustomerContactId: any;
  trusteeDetailsBusinessCustomerContactId: any;
  trustDetailsConfirmation: any;
  liabilitiesTypeOptions: any;
  financialPositionLiability: any[] = [];
  trustCustomerContractRole: any;
  updatedCustomerSummary: any;

  constructor(
    private trustSvc: TrustService,
    private commonSvc: CommonService,
    private route: ActivatedRoute,
    public standardQuoteSvc: StandardQuoteService,
    private changeDetectorRef: ChangeDetectorRef,
    private toasterService: ToasterService,
    public dashboardService: DashboardService,
    private searchAddressService: SearchAddressService
  ) {
    this.commonSvc.data.setCacheableRoutes([
      "LookUpServices/locations?LocationType=country",
    ]);
    this.trustSvc.formDataCacheableRoute([

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

    this.trustSvc.iconfirmCheckbox.subscribe((valid: any[]) => {

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
        this.trustSvc.role = 1
      }
      this.updatedCustomerSummary = sessionStorageCustomerSummary
    }


    this.standardQuoteSvc.getBaseDealerFormData().subscribe((data) => {
      // this.updatedCustomerSummary = data?.updatedCustomerSummary

      this.trustSvc.setBaseDealerFormData({
        updatedCustomerSummary: this.updatedCustomerSummary,
        customerSummary: data?.customerSummary

      })
    })

    

    this.activeStep = this.trustSvc.activeStep;
    let params: any = this.route.snapshot.params;
    this.mode = params.mode || Mode.create;
    this.trustSvc
      ?.getBaseDealerFormData()
      ?.pipe(takeUntil(this.destroy$))
      ?.subscribe((res) => {

        this.formData = res;
        this.trustDetailsConfirmation = res?.trustDetailsConfirmation;
      });
    this.standardQuoteSvc
      ?.getBaseDealerFormData()
      ?.pipe(takeUntil(this.destroy$))
      ?.subscribe((res) => {
        // this.contractId = 1564;
        this.contractId = res?.contractId;
      });

    this.trustSvc.setBaseDealerFormData({
      // UdcFrequency : await this.getLookUpRes('UdcFrequency'),
      // UdcHomeOwnership : await this.getLookUpRes('UdcHomeOwnership'),
      UdcExpenditureDescription: await this.getLookUpRes(
        "UdcExpenditureDescription"
      ),
      UdcAssetDescription: await this.getLookUpRes("UdcAssetDescription"),
      contractId: this?.contractId,
      ReferenceDetailContactType: await this.getContactLookUpRes("ContactType"),
      // UdcAdditionalIncomeDescription : await this.getLookUpRes('UdcAdditionalIncomeDescription')
    });

    await this.init();
    //  this.dashboardService?.onOriginatorChange.pipe(takeUntil(this.destroy$),skip(1)).subscribe(async (dealer) => {
    //                     if(this.dashboardService.isDealerCalculated)
    //                       {
    //                               this.toasterService.showToaster({
    //                                 severity: "error",
    //                                 detail:"err_calculateMsg",
    //                               });
    //                       }

    //         })
  }

  getLookUpRes(LookupSetName: string): Promise<any> {
    return this.trustSvc.getFormData(
      `LookUpServices/custom_lookups?LookupSetName=${LookupSetName}`,
      function (res) {
        return res?.data;
      }
    );
  }

  getContactLookUpRes(LookupSetName: string): Promise<any> {
    return this.trustSvc.getFormData(
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

  async init() {
    let params: any = this.route.snapshot.params;

    if (this.mode == "edit") {
      let trustCustomer = await this.trustSvc.getFormData(
        `CustomerDetails/get_customer?customerNo=${params.customerId
        }&contractId=${this.contractId || params.contractId}`,
        function (res) {
          return res?.data || null;
        }
      );

      this.trustCustomerContractRole = trustCustomer;
      let trusteeDetails;
      let trusteeMapper;
      let trusteeBusinessMapper;
      if (trustCustomer?.trusteeDetails) {
        trusteeDetails = trustCustomer?.trusteeDetails;
        trusteeDetails?.forEach((trustee) => {
          if (trustee.classification === "Individual") {
            trusteeMapper = {
              trusteesFirstName: trustee?.firstName,
              trusteesLastName: trustee?.lastName,
              trusteesDob: trustee?.dateofBirth,
              trusteePhoneCode: trustee?.mobileExt,
              trusteeAreaCode: trustee?.mobileCode,
              trusteeNumber: trustee?.mobileNo,
              trusteesEmail: trustee?.email,
            };
          } else if (trustee.classification === "Business") {
            trusteeBusinessMapper = {
              trusteesBusinessName: trustee?.lastName,
              trusteesBusinessPhoneCode: trustee?.mobileExt,
              trusteesBusinessAreaCode: trustee?.mobileCode,
              trusteesBusinessNumber: trustee?.mobileNo,
              trusteesBusinessEmail: trustee?.email,
            };
          }
        });
      }

      let FinancialDetail = {
        financialPositionBase:
          trustCustomer?.financialDetails?.financialPositionBase,
        financialPositionAsset:
          trustCustomer?.financialDetails?.financialPositionAsset,
        financialPositionBaseId: trustCustomer?.financialDetails?.financialPositionBase?.financialPositionBaseId,
        amtHomeValue:
          trustCustomer?.financialDetails?.financialPositionBase?.amtHomeValue,
        amtVehicleValue:
          trustCustomer?.financialDetails?.financialPositionBase
            ?.amtVehicleValue,
        amtFurnitureValue:
          trustCustomer?.financialDetails?.financialPositionBase
            ?.amtFurnitureValue,
        isNetProfitLastYear:
          trustCustomer?.financialDetails?.financialPositionBase
            ?.isNetProfitLastYear || false,
        amtLastYearNetProfit:
          trustCustomer?.financialDetails?.financialPositionBase
            ?.amtLastYearNetProfit,
        amtTurnoverLatestYear:
          trustCustomer?.financialDetails?.financialPositionBase
            ?.amtTurnoverLatestYear,
        turnoverLatestYearEndingDt:
          trustCustomer?.financialDetails?.financialPositionBase
            ?.turnoverLatestYearEndingDt,
        amtTurnoverPrevYear:
          trustCustomer?.financialDetails?.financialPositionBase
            ?.amtTurnoverPrevYear,
        turnoverPrevYearEndingDt:
          trustCustomer?.financialDetails?.financialPositionBase
            ?.turnoverPrevYearEndingDt,
        amtCashBalLatestYr:
          trustCustomer?.financialDetails?.financialPositionBase
            ?.amtCashBalLatestYr,
        cashBalLatestYrEndDt:
          trustCustomer?.financialDetails?.financialPositionBase
            ?.cashBalLatestYrEndDt,
        amtDebtorBalLatestYr:
          trustCustomer?.financialDetails?.financialPositionBase
            ?.amtDebtorBalLatestYr,
        debtorBalLatestYrEndDt:
          trustCustomer?.financialDetails?.financialPositionBase
            ?.debtorBalLatestYrEndDt,
        amtCreditorBalLatestYr:
          trustCustomer?.financialDetails?.financialPositionBase
            ?.amtCreditorBalLatestYr,
        creditorBalLatestYrEndDt:
          trustCustomer?.financialDetails?.financialPositionBase
            ?.creditorBalLatestYrEndDt,
        amtOverdraftBalLatestYr:
          trustCustomer?.financialDetails?.financialPositionBase
            ?.amtOverdraftBalLatestYr,
        overdraftBalLastYrEndDt:
          trustCustomer?.financialDetails?.financialPositionBase
            ?.overdraftBalLastYrEndDt,
        financialPositionLiability:
          trustCustomer?.financialDetails?.financialPositionLiability,
      };

      let dataMapper = {
        trust: trustCustomer?.trust,
        trustType: trustCustomer?.trust?.trustType,
        trustDetailsEmail: trustCustomer?.trust?.emails,
        trustDetailPhone: trustCustomer?.trust?.phone,
        taxNumber: trustCustomer?.trust?.taxNumber,
        primaryNatureTrust: trustCustomer?.trust?.primaryNatureOfTrust,
        sourceOfWealth: trustCustomer?.trust?.sourceOfWealth,
        timeInTrustMonths: trustCustomer?.trust?.timeInTrustMonths,
        timeInTrustYears: trustCustomer?.trust?.timeInTrustYears,
        trustTradingName: trustCustomer?.trust?.tradingName,
        trustName: trustCustomer?.trust?.trustName,
        trustPurpose: trustCustomer?.trust?.trustPurpose,
        trustRegNum: trustCustomer?.trust?.registeredNumber,
        role: trustCustomer?.role,
        totalAssets: trustCustomer?.trust?.totalAssets,
        // trusteeDetails: trustCustomer?.trusteeDetails,

        trustContactfirstName: trustCustomer?.contactDetails?.[0]?.firstName,
        trustContactlastName: trustCustomer?.contactDetails?.[0]?.lastName,
        trustContactPhoneCode: trustCustomer?.contactDetails?.[0]?.phoneExt,
        trustContactAreaCode: trustCustomer?.contactDetails?.[0]?.areaCode,
        trustContactNumber: trustCustomer?.contactDetails?.[0]?.phoneNo,
        trustContactemail: trustCustomer?.contactDetails?.[0]?.email,
        //
        trustAccountfirstName: trustCustomer?.contactDetails?.[1]?.firstName,
        trustAccountlastName: trustCustomer?.contactDetails?.[1]?.lastName,
        trustAccountPhoneCode: trustCustomer?.contactDetails?.[1]?.phoneExt,
        trustAccountAreaCode: trustCustomer?.contactDetails?.[1]?.areaCode,
        trustAccountNumber: trustCustomer?.contactDetails?.[1]?.phoneNo,
        trustAccountemail: trustCustomer?.contactDetails?.[1]?.email,
        //
        trustSolicitorfirstName: trustCustomer?.contactDetails?.[0]?.firstName,
        trustSolicitorlastName: trustCustomer?.contactDetails?.[0]?.lastName,
        trustSolicitorPhoneCode: trustCustomer?.contactDetails?.[0]?.phoneExt,
        trustSolicitorAreaCode: trustCustomer?.contactDetails?.[0]?.areaCode,
        trustSolicitorNumber: trustCustomer?.contactDetails?.[0]?.phoneNo,
        trustSolicitoremail: trustCustomer?.contactDetails?.[0]?.email,

        //Contact Details
        referenceDetailsTemp: trustCustomer?.contactDetails,
        //Trustee Detaiks
        TrusteereferenceDetailsTemp: trustCustomer?.trusteeDetails,
        trustDetailsConfirmation: trustCustomer?.customerContractRole?.isConfirmed
      };

      let AddressDetails = {};
      if (trustCustomer?.addressDetails?.length) {
        const getAddress = (type: string, isCurrent: boolean = true) =>
          trustCustomer.addressDetails.find(
            (address) =>
              address.addressType?.toLowerCase() === type &&
              address.isCurrent === isCurrent
          );

        const physicalAddress = getAddress("street", true);
        const previousAddress = getAddress("street", false);
        const postalAddress = getAddress("mailing", true);
        const registerAddress = getAddress("registered", true);

        AddressDetails = {
          physicalAddressId: physicalAddress?.addressId,
          postalAddressId: postalAddress?.addressId,
          registerAddressId: registerAddress?.addressId,
          previousAddressId: previousAddress?.addressId,
          physicalResidenceType: null,
          physicalYear: physicalAddress
            ? await this.getTimeDifference(
              physicalAddress?.effectDtFrom,
              this.commonSvc.data.convertDateToString(new Date()),
              "year"
            )
            : null,
          physicalMonth: physicalAddress
            ? await this.getTimeDifference(
              physicalAddress?.effectDtFrom,
              this.commonSvc.data.convertDateToString(new Date()),
              "month"
            )
            : null,
          physicalReuseOff: false,

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
          physicalPostcode: physicalAddress?.zipCode || "",
          physicalCountry: physicalAddress?.countryRegion?.extName || "",

          physicalTextArea: physicalAddress?.street || "",
          isPreviousAddress: previousAddress ? true : false,

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
          previousLotNumber:
            previousAddress?.addressComponents?.find(
              (comp) => comp.type === "UnitLot"
            )?.value || "",
          previousFloorNumber:
            previousAddress?.addressComponents?.find(
              (comp) => comp.type === "FloorNo"
            )?.value || "",

          previousUnitType:
            previousAddress?.addressComponents?.find(
              (comp) => comp.type === "UnitType"
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
          previousUnitNumber:
            previousAddress?.addressComponents?.find(
              (comp) => comp.type === "UnitLot"
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
          previousPostcode: previousAddress?.zipCode || "",
          previousCountry: previousAddress?.countryRegion?.extName || "",

          previousStreetArea: previousAddress?.street || "",
          previousTextArea: previousAddress?.street || "",
          overseasAddress:
            previousAddress?.addressComponentTemplateHdrId == 1 ? false : true,

          postalType: null,
          postalNumber: null,
          postalYear: postalAddress
            ? await this.getTimeDifference(
              postalAddress?.effectDtFrom,
              this.commonSvc.data.convertDateToString(new Date()),
              "year"
            )
            : null,
          postalMonth: postalAddress
            ? await this.getTimeDifference(
              postalAddress?.effectDtFrom,
              this.commonSvc.data.convertDateToString(new Date()),
              "month"
            )
            : null,

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
          postalLotNumber:
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
          postalUnitNumber:
            postalAddress?.addressComponents?.find(
              (comp) => comp.type === "UnitLot"
            )?.value || "",
          postalRuralDelivery:
            postalAddress?.addressComponents?.find(
              (comp) => comp.type === "RuralDelivery"
            )?.value || "",
          postalSuburbs: postalAddress?.suburb || "",
          postalCity: postalAddress?.city?.extName || "",
          postalPostcode:postalAddress?.zipCode || "",
          postalCountry: postalAddress?.countryRegion?.extName || "",

          postalStreetArea: this.searchAddressService.sanitizeStreetValue(postalAddress?.street || ""),
          postalAddressType:
            postalAddress?.addressComponentTemplateHdrId == 1 ? "street" : "po",

          registerType: null,
          registerNumber: null,
          registerYear: registerAddress
            ? await this.getTimeDifference(
              registerAddress?.effectDtFrom,
              this.commonSvc.data.convertDateToString(new Date()),
              "year"
            )
            : null,
          registerMonth: registerAddress
            ? await this.getTimeDifference(
              registerAddress?.effectDtFrom,
              this.commonSvc.data.convertDateToString(new Date()),
              "month"
            )
            : null,

          registerBuildingName:
            registerAddress?.addressComponents?.find(
              (comp) => comp.type === "BuildingName"
            )?.value || "",
          registerFloorType:
            registerAddress?.addressComponents?.find(
              (comp) => comp.type === "FloorType"
            )?.value || "",
          registerFloorNumber:
            registerAddress?.addressComponents?.find(
              (comp) => comp.type === "FloorNo"
            )?.value || "",

          registerUnitType:
            registerAddress?.addressComponents?.find(
              (comp) => comp.type === "UnitType"
            )?.value || "",
          registerLotNumber:
            registerAddress?.addressComponents?.find(
              (comp) => comp.type === "UnitLot"
            )?.value || "",
          registerStreetNumber:
            registerAddress?.addressComponents?.find(
              (comp) => comp.type === "StreetNo"
            )?.value || "",
          registerStreetName:
            registerAddress?.addressComponents?.find(
              (comp) => comp.type === "StreetName"
            )?.value || "",
          registerStreetType:
            registerAddress?.addressComponents?.find(
              (comp) => comp.type === "StreetType"
            )?.value || "",
          registerStreetDirection:
            registerAddress?.addressComponents?.find(
              (comp) => comp.type === "StreetDirection"
            )?.value || "",
          registerUnitNumber:
            registerAddress?.addressComponents?.find(
              (comp) => comp.type === "UnitLot"
            )?.value || "",
          registerRuralDelivery:
            registerAddress?.addressComponents?.find(
              (comp) => comp.type === "RuralDelivery"
            )?.value || "",
          registerSuburbs: registerAddress?.suburb || "",
          registerCity: registerAddress?.city?.extName || "",
          registerPostcode: registerAddress?.zipCode || "",
          registerCountry: registerAddress?.countryRegion?.extName || "",

          registerStreetArea: registerAddress?.street || "",
        };
      }

      // customerId: 1486,customerNo: 11542
      if (trustCustomer?.contactDetails) {
        this.trustCustomerContactId =
          trustCustomer?.contactDetails?.[0]?.customerContactId;
        this.accountantcustomerContactId =
          trustCustomer?.contactDetails[1]?.customerContactId;
        this.trustSolicitorCustomerContactId =
          trustCustomer?.contactDetails[2]?.customerContactId;
      }

      if (trustCustomer?.trusteeDetails) {
        this.trusteeDetailsIndividualCustomerContactId =
          trustCustomer?.trusteeDetails[0]?.customerContactId;
        this.trusteeDetailsBusinessCustomerContactId =
          trustCustomer?.trusteeDetails[1]?.customerContactId;
      }

      this.data = {
        ...this.data,
        ...trusteeMapper,
        ...trusteeBusinessMapper,
        ...dataMapper,
        ...trustCustomer,
        ...AddressDetails,
        ...FinancialDetail,
      };

      if (this.data) {
        this.trustSvc.setBaseDealerFormData(this.data);
      }

      this.changeDetectorRef.detectChanges();
    }

    let liabilitiesOptionRes = await this.getLookUpRes(
      "UdcExpenditureDescription"
    ); //Subhashish

    // this.liabilitiesTypeOptions = liabilitiesOptionRes
    // .filter((item: any) => item.lookupCode.includes("L"))
    // .map((item: any) => ({
    //   name: item.lookupValue,
    //   code: item.lookupId,
    // }));

    let liability: any = {
      mortageId: null,
      trustmortgageBalance: 0,
      trustMortgageRentAmount: 0,
      // rentId: null,
      // trustRentBalance: 0,
      // trustRentAmount: 0,
      loanId: null,
      trustloansBalance: 0,
      trustloansAmount: 0,
      creditId: null,
      trustcreditcardBalance: 0,
      trustcreditcardAmount: 0,
      otherLiabilitiesId: null,
      trustotherBalance: 0,
      trustotherAmount: 0,
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
            liability.trustmortgageBalance = item.amtBalanceLimit;
            liability.trustMortgageRentAmount = item.amtLiability;
            break;

          // case "1LB": // Rent
          //   liability.rentfinancialPositionLiabilityId =
          //     item.financialPositionLiabilityId;
          //   liability.rentId = item.liabilityDescription;
          //   liability.trustRentBalance = item.amtBalanceLimit;
          //   liability.trustRentAmount = item.amtLiability;
          //   break;

          case "2L": // Loans
            liability.loanfinancialPositionLiabilityId =
              item.financialPositionLiabilityId;
            liability.loanId = item.liabilityDescription;
            liability.trustloansBalance = item.amtBalanceLimit;
            liability.trustloansAmount = item.amtLiability;
            break;

          case "3LBA": // Credit Cards
            liability.creditfinancialPositionLiabilityId =
              item.financialPositionLiabilityId;
            liability.creditId = item.liabilityDescription;
            liability.trustcreditcardBalance = item.amtBalanceLimit;
            liability.trustcreditcardAmount = item.amtLiability;
            break;

          case "4L": // Other Liabilities
            liability.otherfinancialPositionLiabilityId =
              item.financialPositionLiabilityId;
            liability.otherLiabilitiesId = item.liabilityDescription;
            liability.trustotherBalance = item.amtBalanceLimit;
            liability.trustotherAmount = item.amtLiability;
            break;
        }
      });
    }

    liabilitiesOptionRes?.forEach((item) => {
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

    this.trustSvc.setBaseDealerFormData({
      ...liability,
    });

    this.isReady = true;
  }

  async financialAccountUpdate() {

    this.financialPositionLiability = [
      {
        financialPositionLiabilityId:
          this.formData.mortagefinancialPositionLiabilityId || 0,
        // "financialPositionBaseId": 127,
        liabilityDescription: this.formData.mortageId,
        amtBalanceLimit: this.formData.trustmortgageBalance,
        amtLiability: this.formData.trustMortgageRentAmount,
        liabilityFrequency: 3533,
        // "expenseCategory": "1LA"
      },
      // {
      //   financialPositionLiabilityId:
      //     this.formData.rentfinancialPositionLiabilityId || 0,
      //   // "financialPositionBaseId": 127,
      //   liabilityDescription: this.formData.rentId,
      //   amtBalanceLimit: this.formData.trustRentBalance,
      //   amtLiability: this.formData.trustRentAmount,
      //   liabilityFrequency: 3533,
      //   // "expenseCategory": "1LA"
      // },
      {
        financialPositionLiabilityId:
          this.formData.loanfinancialPositionLiabilityId || 0,
        // "financialPositionBaseId": 127,
        liabilityDescription: this.formData.loanId,
        amtBalanceLimit: this.formData.trustloansBalance,
        amtLiability: this.formData.trustloansAmount,
        liabilityFrequency: 3533,
        // "expenseCategory": "2L"
      },
      {
        financialPositionLiabilityId:
          this.formData.creditfinancialPositionLiabilityId || 0,
        // "financialPositionBaseId": 127,
        liabilityDescription: this.formData.creditId,
        amtBalanceLimit: this.formData.trustcreditcardBalance,
        amtLiability: this.formData.trustcreditcardAmount,
        liabilityFrequency: 3533,
        // "expenseCategory": "3LBA"
      },
      {
        financialPositionLiabilityId:
          this.formData.otherfinancialPositionLiabilityId || 0,
        // "financialPositionBaseId": 127,
        liabilityDescription: this.formData.otherLiabilitiesId,
        amtBalanceLimit: this.formData.trustotherBalance,
        amtLiability: this.formData.trustotherAmount,
        liabilityFrequency: 3533,
        // "expenseCategory": "3LBA"
      },
    ];

    let params: any = this.route.snapshot.params;

    const financialDetailbody = {
      financialPositionBase: {
        financialPositionBaseId: this.formData?.financialPositionBaseId || (this.formData.TrustFinancialDetailRes?.data?.financialDetails?.financialPositionBase?.financialPositionBaseId) || 0,
        contractId: this.contractId || Number(params.contractId),
        partyId: this.formData?.customerId,
        partyNo: this.formData?.customerNo,
        partyName: this.formData?.customerContractRole?.customerName,
        contractPartyRole:
          this.formData?.customerContractRole?.roleName ||
          this.trustCustomerContractRole?.customerContractRole?.roleName,
        lastUpdatedDt: new Date().toISOString().slice(0, 19) || "",
        homeOwnership: this.formData.assestHomeOwnerType || 0,
        amtHomeValue: this.formData.financialAssetDetails?.[0]?.amount || 0,
        amtVehicleValue: this.formData.financialAssetDetails?.[1]?.amount || 0,
        amtFurnitureValue:
          this.formData.financialAssetDetails?.[2]?.amount || 0,
        amtTakeHomePay: this.formData.incomeDetails?.[0]?.amount,
        takeHomePayFrequency: this.formData.incomeDetails?.[0]?.frequency,
        amtSpousePay: this.formData.incomeDetails?.[1]?.amount,
        spousePayFrequency: this.formData.incomeDetails?.[1]?.frequency,
        isIncomeLikelyToDecrease: Boolean(this.formData.isIncomeDecrease),
        incomeDecrDetail: this.formData.details || "",
        amtTotalMonthlyExpenditure: 0,
        turnoverLatestYearEndingDt:
          this.formData.turnoverLatestYearEndingDt ||
          new Date("1900-01-01").toISOString().split("T")[0] + "T00:00:00",
        amtTurnoverLatestYear: this.formData.amtTurnoverLatestYear,
        turnoverPrevYearEndingDt:
          this.formData.turnoverPrevYearEndingDt ||
          new Date("1900-01-01").toISOString().split("T")[0] + "T00:00:00",
        amtTurnoverPrevYear: this.formData.amtTurnoverPrevYear,
        cashBalLatestYrEndDt:
          this.formData.cashBalLatestYrEndDt ||
          new Date("1900-01-01").toISOString().split("T")[0] + "T00:00:00",
        amtCashBalLatestYr: this.formData.amtCashBalLatestYr,
        debtorBalLatestYrEndDt:
          this.formData.debtorBalLatestYrEndDt ||
          new Date("1900-01-01").toISOString().split("T")[0] + "T00:00:00",
        amtDebtorBalLatestYr: this.formData.amtDebtorBalLatestYr,
        creditorBalLatestYrEndDt:
          this.formData.creditorBalLatestYrEndDt ||
          new Date("1900-01-01").toISOString().split("T")[0] + "T00:00:00",
        amtCreditorBalLatestYr: this.formData.amtCreditorBalLatestYr,
        overdraftBalLastYrEndDt:
          this.formData.overdraftBalLastYrEndDt ||
          new Date("1900-01-01").toISOString().split("T")[0] + "T00:00:00",
        amtOverdraftBalLatestYr: this.formData.amtOverdraftBalLatestYr,
        IsNetProfitLastYear: this.formData.isNetProfitLastYear,
        amtLastYearNetProfit: this.formData.amtLastYearNetProfit,
      },
      financialPositionAsset: this.formData.financialPositionAsset || [],
      financialPositionIncome: this.formData.financialPositionIncome || [],
      financialPositionExpenditure:
        this.formData.financialPositionExpenditure || [],
      financialPositionRegularRecurring:
        this.formData.financialPositionRegularRecurring || [],
      financialPositionLiability: this.financialPositionLiability || [],
    };

    let body = {
      contractId: this.contractId || Number(params.contractId),
      isConfirmed: false,
      business: null,
      individual: null,
      trust: {
        customerId: this.formData?.customerId,
        customerNo: this.formData?.customerNo,
        businessIndividual: "Business",
        partyType: ["Direct Customer"],
        role: this.formData?.role,
        //  customerContractRole: {
        //   customerId: this.formData.customerId,
        //   customerNo: this.formData.customerNo,
        //   customerRole: this.formData?.role,
        //   customerType: "Trust"
        // },
        customerContractRole: this.formData?.customerContractRole,
        trust: null,
        // trust: {
        //   trustType: this.formData?.trustType,
        //   trustName: this.formData?.trustName,
        //   tradingName: this.formData?.trustTradingName,
        //   registeredNumber: this.formData?.trustRegNum,
        //   taxNumber: this.formData?.taxNumber,
        //   trustPurpose: this.formData?.trustPurpose,
        //   primaryNatureOfTrust: this.formData?.primaryNatureTrust,
        //   sourceOfWealth: this.formData?.sourceOfWealth,
        //   totalAssets: this.formData?.totalAssets,
        //   timeInTrustYears: String(this.formData?.timeInTrustYears || 0),
        //   timeInTrustMonths: String(this.formData?.timeInTrustMonths || 0),
        //   website: this.formData?.website || "",
        //   phone: this.formData?.trustDetailPhone,
        //   emails: this.formData?.trustDetailsEmail,
        // },
        addressDetails: [],
        financialDetails: financialDetailbody,
        trusteeDetails: [],
        contactDetails: [],
      },
    };

    let res: any = await this.putFormData(
      //Subhashish
      "CustomerDetails/update_customer",
      body
    );

    // this.trustSvc.setBaseDealerFormData({
    //   TrustFinancialDetailRes: res,
    //    financialPositionAsset: res?.data?.financialDetails?.financialPositionAsset || [],
    //    financialPositionLiability: res?.data?.financialDetails?.financialPositionLiability || [],

    // });

    this.trustSvc.setBaseDealerFormData({
      financialPositionBaseId: res?.data?.financialDetails?.financialPositionBase?.financialPositionBaseId
    })

    const financialDetails = res?.data?.financialDetails;

    if (financialDetails?.financialPositionAsset?.length > 0) {
      this.trustSvc.setBaseDealerFormData({
        financialPositionAsset: financialDetails?.financialPositionAsset,
      });
    }

    if (financialDetails?.financialPositionLiability?.length > 0) {
      this.trustSvc.setBaseDealerFormData({
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
          //   this.formData.rentfinancialPositionLiabilityId =
          //     item.financialPositionLiabilityId;
          //   break;

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

  async trustDetailsUpdate() {
    // let params: any = this.route.snapshot.params;
    let body = {
      contractId: this.contractId || Number(this.params.contractId),
      isConfirmed: false,
      business: null,
      individual: null,
      trust: {
        businessIndividual: "Business",
        customerId: this.formData?.customerId,
        customerNo: this.formData.customerNo,
        role: this.formData?.role,
        partyType: ["Direct Customer"],
        // customerContractRole: {
        //   customerId: this.formData.customerId,
        //   customerNo: this.formData.customerNo,
        //   customerRole: this.formData?.role,
        //   customerType: "Trust"
        // },
        customerContractRole: this.formData?.customerContractRole,
        trust: {
          taxNumber: this.formData?.taxNumber,
          primaryNatureOfTrust:
            this.formData?.primaryNatureTrust !== "undefined"
              ? this.decodeHtmlEntities(this.formData?.primaryNatureTrust)
              : null,
          registeredNumber: this.formData?.trustRegNum,
          timeInTrustMonths: String(this.formData?.timeInTrustMonths || 0),
          timeInTrustYears: String(this.formData?.timeInTrustYears || 0),
          sourceOfWealth: this.formData?.sourceOfWealth,
          totalAssets: this.formData?.totalAssets,
          trustPurpose: this.formData?.trustPurpose,
          tradingName: this.formData?.trustTradingName,
          trustName: this.formData?.trustName,
          trustType: this.formData?.trustType,
          website: this.formData?.website,
          emails: this.getTrustDetailEmail(this.formData?.trustDetailsEmail),
          phone: this.formData?.trustDetailPhone,
        },
        addressDetails: null,
        financialDetails: null,
        trusteeDetails: null,
        ContactDetails: null,
      },
    };

    let res: any = await this.putFormData(
      "CustomerDetails/update_customer",
      body
    );
    this.formData.customerId = res?.data?.customerId;
    this.formData.customerNo = res?.data?.customerNo;

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

    if (this.mode == "edit") {
      let index = this.standardQuoteSvc.trustData.findIndex(
        (ele) => ele.data?.customerNo == res?.data?.customerNo
      );
      this.standardQuoteSvc.trustData[index] = { ...res };
      this.standardQuoteSvc.trustDataSubject.next(
        this.standardQuoteSvc.trustData
      );
    }

    this.formData.customerContractRole = res?.data?.customerContractRole;
    return res;
  }

  getTrustDetailEmail(emailArray) {
    if (emailArray?.length === 3) {
      return emailArray;
    } else {
      let temp = ["EmailHome", "EmailOther"];
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

  async trustDetailsPost() {
    let body = {
      contractId: this.contractId || Number(this.params.contractId),
      isConfirmed: false,
      business: null,
      individual: null,
       partyType: ["Direct Customer"],
      trust: {
        businessIndividual: "Business",
        customerId: -1,
        customerNo: -1,
        partyType: ["Direct Customer"],
        role: this.formData?.role,
        trust: {
          taxNumber: this.formData?.taxNumber,
          // primaryNatureOfTrust: this.decodeHtmlEntities(this.formData?.primaryNatureTrust),
          primaryNatureOfTrust:
            this.formData?.primaryNatureTrust !== "undefined"
              ? this.decodeHtmlEntities(this.formData?.primaryNatureTrust)
              : null,
          registeredNumber: this.formData?.trustRegNum,
          timeInTrustMonths: String(this.formData?.timeInTrustMonths || 0),
          timeInTrustYears: String(this.formData?.timeInTrustYears || 0),
          sourceOfWealth: this.formData?.sourceOfWealth,
          totalAssets: this.formData?.totalAssets,
          trustPurpose: this.formData?.trustPurpose,
          tradingName: this.formData?.trustTradingName,
          trustName: this.formData?.trustName,
          trustType: this.formData?.trustType,
          website: this.formData?.website,
          emails: this.getTrustDetailEmail(this.formData?.trustDetailsEmail),
          phone: this.formData?.trustDetailPhone,
        },
        addressDetails: null,
        financialDetails: null,
        trusteeDetails: null,
        ContactDetails: null,
      },
    };

    let res: any = await this.postFormData(
      "CustomerDetails/add_customer",
      body
    );

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

    this.formData.customerId = res?.data?.customerId;
    this.formData.customerNo = res?.data?.customerNo;
    this.formData.customerContractRole = res?.data?.customerContractRole;

    if (this.mode == "create") {
      this.standardQuoteSvc.trustData.push(res);
      this.standardQuoteSvc.trustDataSubject?.next(
        this.standardQuoteSvc.trustData
      );
    }

    return res;
  }

  decodeHtmlEntities(value: string): string {
    const txt = document.createElement("textarea");
    txt.innerHTML = value;
    return txt.value;
  }

  async trusteeDetailsUpdate() {
    // let trusteeDetails = [];

    // // Check if individual trustee details are present

    // if (this.formData?.trusteeDetails?.[0]?.classification === "Individual") {
    //   trusteeDetails.push({
    //     customerContactId: this.trusteeDetailsIndividualCustomerContactId || -1,
    //     customerId: this.formData?.customerId,
    //     customerNo: this.formData.customerNo,
    //     trustType: "Trustee",
    //     firstName: this.formData.trusteeDetails?.[0].trusteesFirstName,
    //     lastName: this.formData.trusteeDetails?.[0].trusteesLastName,
    //     dateofBirth: this.formData.trusteeDetails?.[0].trusteesDob,
    //     mobileExt: this.formData.trusteeDetails?.[0].trusteePhoneCode,
    //     mobileCode: String(this.formData.trusteeDetails?.[0].trusteeAreaCode),
    //     mobileNo: String(this.formData.trusteeDetails?.[0].trusteeNumber),
    //     email: this.formData.trusteeDetails?.[0].trusteesEmail,
    //     classification: "Individual",
    //   });
    // }

    // // Check if business trustee details are present
    // if (this.formData?.trusteeDetails?.[1]?.classification === "Business") {
    //   trusteeDetails.push({
    //     customerContactId: this.trusteeDetailsBusinessCustomerContactId || -1,
    //     customerId: this.formData?.customerId,
    //     customerNo: this.formData?.customerNo,
    //     trustType: "Trustee",
    //     lastName: this.formData.trusteeDetails?.[1].trusteesBusinessName,
    //     dateofBirth:
    //       this.formData.trusteeDetails?.[1].trusteeDetails?.[1]?.trusteesDob,
    //     mobileExt: this.formData.trusteeDetails?.[1].trusteesBusinessPhoneCode,
    //     mobileCode: String(
    //       this.formData.trusteeDetails?.[1].trusteesBusinessAreaCode
    //     ),
    //     mobileNo: String(
    //       this.formData.trusteeDetails?.[1].trusteesBusinessNumber
    //     ),
    //     email: this.formData.trusteeDetails?.[1].trusteesBusinessEmail,
    //     classification: "Business",
    //   });
    // }
    // check if both are present
    // if (
    //   this.formData.trusteeDetails?.[1]?.trusteesBusinessorIndividual ===
    //     'Business' &&
    //   this.formData.trusteeDetails?.[1]?.trusteesBusinessorIndividual ===
    //     'Individual'
    // ) {
    //   trusteeDetails.push(
    //     {
    //       customerContactId:
    //         this.trusteeDetailsIndividualCustomerContactId || -1,
    //       customerId: this.formData.trusteeDetails?.[0].trustCustomerId,
    //       customerNo: this.formData.trusteeDetails?.[0].customerNo,
    //       trustType: 'Trustee',
    //       firstName: this.formData.trusteeDetails?.[0].trusteesFirstName,
    //       lastName: this.formData.trusteeDetails?.[0].trusteesLastName,
    //       dateofBirth: this.formData.trusteeDetails?.[0].trusteesDob,
    //       mobileExt: this.formData.trusteeDetails?.[0].trusteePhoneCode,
    //       mobileCode: String(this.formData.trusteeDetails?.[0].trusteeAreaCode),
    //       mobileNo: String(
    //         this.formData.trusteeDetails?.[0].trusteeNumber
    //       ),
    //       email: this.formData.trusteeDetails?.[0].trusteesEmail,
    //       classification: 'Individual',
    //     },
    //     {
    //       customerContactId: this.trusteeDetailsBusinessCustomerContactId || -1,
    //       customerId: this.formData.trusteeDetails?.[1].trustCustomerId,
    //       customerNo: this.formData.trusteeDetails?.[1].trustCustomerNo,
    //       trustType: 'Trustee',
    //       firstName: this.formData.trusteeDetails?.[1].trusteesBusinessName,
    //       lastName: this.formData.trusteeDetails?.[1].trusteesBusinessName,
    //       dateofBirth:
    //         this.formData.trusteeDetails?.[1].trusteeDetails?.[1]?.trusteesDob,
    //       mobileExt:
    //         this.formData.trusteeDetails?.[1].trusteesBusinessPhoneCode,
    //       mobileCode: String(
    //         this.formData.trusteeDetails?.[1].trusteesBusinessAreaCode
    //       ),
    //       mobileNo: String(
    //         this.formData.trusteeDetails?.[1].trusteesBusinessNumber
    //       ),
    //       email: this.formData.trusteeDetails?.[1].trusteesBusinessEmail,
    //       classification: 'Business',
    //     }
    //   );
    // }
    let body = {
      contractId: this.contractId || Number(this.params.contractId),
      isConfirmed: false,
      business: null,
      individual: null,
      trust: {
        businessIndividual: "Business",
        customerId: this.formData?.customerId,
        customerNo: this.formData?.customerNo,
        partyType: ["Business Unit"],
        // customerContractRole: {
        //   customerId: this.formData.customerId,
        //   customerNo: this.formData.customerNo,
        //   customerRole: this.formData?.role,
        //   customerType: "Trust"
        // },
        customerContractRole: this.formData.customerContractRole,
        role: this.formData?.role,
        trust: null,
        addressDetails: null,
        financialDetails: null,
        trusteeDetails: this.formData?.TrusteereferenceDetailsTemp,
        ContactDetails: null,
      },
    };

    let res: any = await this.putFormData(
      "CustomerDetails/update_customer",
      body
    );

    this.formData.TrusteereferenceDetailsTemp = res?.data?.trusteeDetails;
    // if (this.mode == 'create') {
    //   this.standardQuoteSvc.trustData.push(res);
    //   this.standardQuoteSvc.trustDataSubject.next(
    //     this.standardQuoteSvc.trustData
    //   );
    // }

    return res;
  }
  async trusteeContactUpdate() {
    let body = {
      contractId: this.contractId || Number(this.params.contractId),
      isConfirmed: this.formData?.trustDetailsConfirmation,
      business: null,
      individual: null,
      trust: {
        businessIndividual: "Business",
        customerId: this.formData?.customerId,
        customerNo: this.formData?.customerNo,
        role: this.formData?.role,
        partyType: ["Direct Customer"],
        // customerContractRole: {
        //   customerId: this.formData.customerId,
        //   customerNo: this.formData.customerNo,
        //   customerRole: this.formData?.role,
        //   customerType: "Trust"
        // },
        customerContractRole: this.formData?.customerContractRole,
        trust: null,
        addressDetails: null,
        financialDetails: null,
        trusteeDetails: null,
        ContactDetails: this.formData?.referenceDetailsTemp,

        // [
        //   {
        //     customerContactId: this.trustCustomerContactId || -1,
        //     customerId: this.formData?.customerId,
        //     customerNo: this.formData.customerNo,
        //     firstName: this.formData?.trustContactfirstName,
        //     lastName: this.formData?.trustContactlastName,
        //     customername: "",
        //     phoneExt: this.formData?.trustContactPhoneCode,
        //     areaCode: String(this.formData?.trustContactAreaCode),
        //     phoneNo: String(this.formData?.trustContactNumber),
        //     email: this.formData?.trustContactemail,
        //     relationship: "Other",
        //     //contact allow only Individual
        //     classification: "Individual",
        //     contacttype: "Contact",
        //     dateofBirth: "1998-10-04T08:50:31.138Z",
        //   },
        //   {
        //     customerContactId: this.accountantcustomerContactId || -1,
        //     customerId: this.formData?.customerId,
        //     customerNo: this.formData.customerNo,
        //     firstName: this.formData?.trustAccountfirstName,
        //     lastName: this.formData?.trustAccountlastName,
        //     customerName: "",
        //     phoneExt: this.formData?.trustAccountPhoneCode,
        //     areaCode: String(this.formData?.trustAccountAreaCode),
        //     phoneNo: String(this.formData?.trustAccountNumber),
        //     email: this.formData?.trustAccountemail,
        //     relationship: "Other",
        //     //contact allow only Individual
        //     classification: "Individual",
        //     contacttype: "Accountant",
        //     dateofBirth: "1998-10-04T08:50:31.138Z",
        //   },
        //   {
        //     customerContactId: this.trustSolicitorCustomerContactId || -1,
        //     customerId: this.formData?.customerId,
        //     customerNo: this.formData?.customerNo,
        //     firstName: this.formData?.trustSolicitorfirstName,
        //     lastName: this.formData?.trustSolicitorlastName,
        //     customerName: "",
        //     phoneExt: this.formData?.trustSolicitorPhoneCode,
        //     areaCode: String(this.formData?.trustSolicitorAreaCode),
        //     phoneNo: String(this.formData?.trustSolicitorNumber),
        //     email: this.formData?.trustSolicitoremail,
        //     relationship: "Other",
        //     classification: "Individual",
        //     contacttype: "Solicitor",
        //     dateofBirth: "1998-10-04T08:50:31.138Z",
        //   },
        // ],
      },
    };

    let res: any = await this.putFormData(
      "CustomerDetails/update_customer",
      body
    );

    this.formData.referenceDetailsTemp = res?.data?.contactDetails;

    // if (this.mode == 'create') {
    //   this.standardQuoteSvc.trustData.push(res);
    //   this.standardQuoteSvc.trustDataSubject.next(
    //     this.standardQuoteSvc.trustData
    //   );
    // }ss

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

          return res; //this.formConfig.data(res);
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

          return res; //this.formConfig.data(res);
        })
      )
      .toPromise();
  }
  ngOnDestroy(): void {
    // Unsubscribe from the destroy$ subject
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    // todo
  }

  activeStep = 0;
  steps = [
    { label: "Trust Details" },
    { label: "Address Details" },
    { label: "Finance Accounts" },
    { label: "Trustee Details" },
    { label: "Contact Details" },
  ];

  getTimeDifference(
    fromDate: string,
    toDate: string = new Date().toISOString(),
    unit: "year" | "month" = "year"
  ): number {
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return 0; // Return 0 if dates are invalid
    }

    let yearsDifference = endDate.getFullYear() - startDate.getFullYear();
    let monthsDifference = endDate.getMonth() - startDate.getMonth();

    // Adjust if monthsDifference is negative
    if (monthsDifference < 0) {
      yearsDifference -= 1;
      monthsDifference += 12;
    }

    return unit === "year" ? yearsDifference : monthsDifference;
  }

  async changeStep(params) {
    if (params.type === "submit") {

      const updateCustomerIcon = this.updatedCustomerSummary?.find(c => c.customerNo === this.formData.customerNo)
      if (updateCustomerIcon) {
        updateCustomerIcon.showInfoIcon = false
        updateCustomerIcon.isConfirmed = this.formData?.trustDetailsConfirmation
      }


      this.standardQuoteSvc.setBaseDealerFormData({
        updatedCustomerSummary: this.updatedCustomerSummary
      })

      this.trustSvc.setBaseDealerFormData({
        updatedCustomerSummary: this.updatedCustomerSummary
      })

      sessionStorage.setItem("updatedCustomerSummary", JSON.stringify(this.updatedCustomerSummary));

      //The above code is for handling red-icon from the UI

      if (this.trustDetailsConfirmation) {
        this.trustSvc.stepper.next({
          activeStep: this.activeStep,
          validate: true,
        });
        const statusInvalid = this.trustSvc.formStatusArr?.includes("INVALID");
        this.trustSvc.formStatusArr.length = 0;

        if (!statusInvalid) {
          this.trustSvc.iconfirmCheckbox.next(null);  //setting empty value to checkbox observable which is used for tab validations 
          this.trustSvc.showValidationMessage = false; //this flag is for mark all as read for all the customer components
          let trusteeContactUpdateResponse = await this.trusteeContactUpdate();
          this.activeStep = params.activeStep;
          this.standardQuoteSvc.activeStep = 1;
          this.trustSvc.stepper.next(params);
          // this.commonSvc.router.navigateByUrl("dealer/standard-quote");
          this.trustSvc.resetBaseDealerFormData();

          if (this.mode == "create") {
            this.standardQuoteSvc.mode = "create";
            let mode = this.standardQuoteSvc.mode;
            if (trusteeContactUpdateResponse) {
              this.commonSvc.router.navigateByUrl(
                `/dealer/standard-quote/edit/${this.contractId || Number(this.params.contractId)
                }`
              );
              this.standardQuoteSvc.activeStep = 1;
            }
          } else if (this.mode == "edit" || this.mode == "view") {
            this.standardQuoteSvc.mode = "edit";
            let mode = this.standardQuoteSvc.mode;
            if (trusteeContactUpdateResponse) {
              this.commonSvc.router.navigateByUrl(
                `/dealer/standard-quote/edit/${this.contractId || Number(this.params.contractId)
                }`
              );
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

    if (params.type === "previous") {
      this.activeStep = params.activeStep;
      this.trustSvc.activeStep = this.activeStep;
      this.trustSvc.stepper.next(params);
      this.trustSvc.formStatusArr.length = 0;
    }

    if (params.type == "next") {
      this.trustSvc.stepper.next({
        activeStep: this.activeStep,
        validate: true,
      });
      // const statusInvalid = this.trustSvc.formStatusArr?.includes("INVALID");
      // if (!statusInvalid) {
      if (this.formData?.role && this.formData?.role !== 0) {
        let res = null;
        try {
          if (this.mode == "create") {
            if (this.activeStep == 0 && !this.formData?.customerNo) {
              res = await this.trustDetailsPost();
            } else if (this.activeStep == 0 && this.formData?.customerNo) {
              res = await this.trustDetailsUpdate();
            }
            if (this.activeStep == 1) {
              res = await this.updateAddressDetails();
            }
            if (this.activeStep == 2) {
              res = await this.financialAccountUpdate();
            }
            if (this.activeStep == 3) {
              res = await this.trusteeDetailsUpdate();
            }
          }
          if (this.mode == "edit") {
            const borrowerExists = this.trustSvc?.role === 1;
            const isAddingExistingCustomer = this.trustSvc?.addingExistingCustomer;
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
              if (this.activeStep == 0) {
                res = await this.trustDetailsUpdate();
              }

              if (this.activeStep == 1) {
                res = await this.updateAddressDetails();
              }
              if (this.activeStep == 2) {
                res = await this.financialAccountUpdate();
              }
              if (this.activeStep == 3) {
                res = await this.trusteeDetailsUpdate();
              }

              if(res){
                const updateCustomerIsConfirmAsPerApiResponse = this.updatedCustomerSummary?.find(c => c.customerNo === this.formData?.customerNo)
                if(updateCustomerIsConfirmAsPerApiResponse){
                  updateCustomerIsConfirmAsPerApiResponse.isConfirmed = res?.data?.customerContractRole?.isConfirmed 
                }
                this.formData.trustDetailsConfirmation = res?.data?.customerContractRole?.isConfirmed
              }

              const updateCustomerIcon = this.updatedCustomerSummary?.find(c => c.customerNo === this.formData.customerNo)
              if (updateCustomerIcon) {
                updateCustomerIcon.showInfoIcon = false
              }


              this.standardQuoteSvc.setBaseDealerFormData({
                updatedCustomerSummary: this.updatedCustomerSummary
              })

              this.trustSvc.setBaseDealerFormData({
                updatedCustomerSummary: this.updatedCustomerSummary
              })

              sessionStorage.setItem("updatedCustomerSummary", JSON.stringify(this.updatedCustomerSummary));
            }
            
          }

          if (!res?.apiError?.errors.length) {
            this.activeStep = params.activeStep; //change
            this.trustSvc.activeStep = this.activeStep;
            this.trustSvc.stepper.next(params);
          }

        }
        catch (error) {
          return;
        }
      }
      // this.activeStep = params.activeStep;
      // this.trustSvc.activeStep = this.activeStep;
      // this.trustSvc.stepper.next(params);
      // }
      // this.trustSvc.formStatusArr.length = 0;
    }

    if (params.type == "draft") {
      this.trustSvc.stepper.next({
        activeStep: this.activeStep,
        validate: true,
      });
      const statusInvalid = this.trustSvc.formStatusArr?.includes("INVALID");
      // if (!statusInvalid) {
      if (this.formData?.role && this.formData.role !== 0) {
        if (this.mode == "create") {
          if (this.activeStep == 0 && !this.formData?.customerNo) {
            await this.trustDetailsPost();
          } else if (this.activeStep == 0 && this.formData?.customerNo) {
            await this.trustDetailsUpdate();
          }
          if (this.activeStep == 1) {
            await this.updateAddressDetails();
          }
          if (this.activeStep == 2) {
            await this.financialAccountUpdate();
          }
          if (this.activeStep == 3) {
            await this.trusteeDetailsUpdate();
          }
          if (this.activeStep == 4) {
            await this.trusteeContactUpdate();
          }
        }
        if (this.mode == "edit") {
          const borrowerExists = this.trustSvc?.role === 1;
          const isAddingExistingCustomer = this.trustSvc?.addingExistingCustomer;
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

          else {
          // if (borrowerExists && !isAddingExistingCustomer) {
            if (this.activeStep == 0) {
              res = await this.trustDetailsUpdate();
            }
            if (this.activeStep == 1) {
              res = await this.updateAddressDetails();
            }
            if (this.activeStep == 2) {
              res = await this.financialAccountUpdate();
            }

            if (this.activeStep == 3) {
              res = await this.trusteeDetailsUpdate();
            }
            if (this.activeStep == 4) {
              res = await this.trusteeContactUpdate();
            }

            if(res){
                const updateCustomerIsConfirmAsPerApiResponse = this.updatedCustomerSummary?.find(c => c.customerNo === this.formData?.customerNo)
                if(updateCustomerIsConfirmAsPerApiResponse){
                  updateCustomerIsConfirmAsPerApiResponse.isConfirmed = res?.data?.customerContractRole?.isConfirmed 
                }
                this.formData.detailsConfirmation = res?.data?.customerContractRole?.isConfirmed
              }

            const updateCustomerIcon = this.updatedCustomerSummary?.find(c => c.customerNo === this.formData.customerNo)
            if (updateCustomerIcon) {
              updateCustomerIcon.showInfoIcon = false
            }


            this.standardQuoteSvc.setBaseDealerFormData({
              updatedCustomerSummary: this.updatedCustomerSummary
            })

            sessionStorage.setItem("updatedCustomerSummary", JSON.stringify(this.updatedCustomerSummary));
          }
         
        }
        this.toasterService.showToaster({
          severity: "success",
          detail: "Customer Details Saved Successfully",
        });
        this.activeStep = params.activeStep;
        this.trustSvc.activeStep = this.activeStep;
        this.trustSvc.stepper.next(params);
        // }
      }
      this.trustSvc.formStatusArr.length = 0;
    }

    if (params.type == "tabNav") {
      this.activeStep = params.activeStep;
      this.trustSvc.activeStep = this.activeStep;
      this.trustSvc.stepper.next(params);
    }
  }

  async updateAddressDetails() {

    let addressBody: any = [
      {
        addressId: this.formData?.physicalAddressId || -1,
        addressType: "Street",
        county: null,
        stateProvince: null,
        residentType: this.formData?.physicalResidenceType || null,
        countryRegion: {
          extName: this.formData?.physicalCountry || "New Zealand",
        },
        city:
          this.formData?.physicalCountry?.toLowerCase() == "new zealand"
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
            : "ABC",
        alternateSuburb: "",
        effectDtFrom: this.calculateNewDate(
          Number(this.formData?.physicalYear),
          Number(this.formData?.physicalMonth)
        ),
        effectDtTo: null,
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
        addressType: "Mailing",
        county: null,
        stateProvince: null,
        countryRegion: {
          extName: this.formData?.postalCountry || "New Zealand",
        },
        city:
          this.formData?.postalCountry?.toLowerCase() == "new zealand"
            ? {
              LocationId: this.formData?.postalCityLocationId,
              extName: this.formData?.postalCity,
            }
            : undefined,
        zipCode: String(this.formData?.postalPostcode),
        postalNumber: this.formData?.registerPostalNumber ? String(this.formData.registerPostalNumber) : null,

        suburb: this.formData?.postalSuburbs,
        street:
          this.formData?.postalAddressType?.toLowerCase() === "street"
            ? ""
            : this.formData?.postalStreetArea,
        alternateSuburb: "",
        effectDtFrom:
          this.formData?.postalCountry?.toLowerCase() !== "new zealand"
            ? this.calculateNewDate(
              Number(this.formData?.postalYear),
              Number(this.formData?.postalMonth)
            )
            : new Date().toISOString()?.split('.')[0],
        isCurrent: true,
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
        postalNumber: this.formData?.registerPostalNumber ? String(this.formData.registerPostalNumber) : null,

        countryRegion: {
          extName: this.formData?.registerCountry || "New Zealand",
        },
        city:
          this.formData?.registerCountry?.toLowerCase() == "new zealand"
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
            : "",
        alternateSuburb: "",
        effectDtFrom: this.calculateNewDate(
          Number(this.formData?.registerYear),
          Number(this.formData?.registerMonth)
        ),
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
          : "",
        alternateSuburb: "",
        // effectDtFrom: null,
        effectDtFrom: this.calculateNewPreviousDate(
          this.calculateNewDate(
            Number(this.formData?.physicalYear),
            Number(this.formData?.physicalMonth)
          ),
          Number(this.formData?.previousYear),
          Number(this.formData?.previousMonth)
        ),
        // effectDtTo: new Date(),
        effectDtTo:null,
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
            {
              type: "StreetNo",
              value: this.formData?.previousStreetNumber,
            },
            {
              type: "StreetName",
              value: this.formData?.previousStreetName,
            },
            {
              type: "StreetType",
              value: this.formData?.previousStreetType,
            },
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
      contractId: this.contractId || Number(this.params.contractId),
      isConfirmed: false,
      trust: {
        businessIndividual: "Business",
        // customerId: this.formData?.customerId,
        customerNo: this.formData.customerNo,
        role: this.formData?.role,
        partyType: ["Direct Customer"],
        customerContractRole: {
          // customerId: this.formData?.customerId,
          customerNo: this.formData.customerNo,
          customerRole: this.formData?.role,
          customerType: "Trust",
        },
        trust: null,
        addressDetails: addressBody,
        employementDetails: null,
        financialDetails: null,
        personalDetails: null,
        referenceDetails: null,
      },
    };

    // console.log("🔍 Sending addressBody:", addressBody.map(addr => ({
    //  type: addr.addressType,
    //  id: addr.addressId
    // })));

    let res = await this.putFormData("CustomerDetails/update_customer", body);

    // 🔍 Debug: Check API response
    // console.log("🔍 API Response addressDetails:", res?.data?.addressDetails);

    if (res?.data?.addressDetails?.length > 0) {
      const getAddress = (type: string, isCurrent: boolean = true) =>
        res.data.addressDetails.find(
          address => address.addressType?.toLowerCase() === type && address.isCurrent === isCurrent
        );

      const physicalAddress = getAddress("street", true);
      const registerAddress = getAddress("registered", true);
      const postalAddress = getAddress("mailing", true);
      const previousAddress = getAddress("street", false);

      // 🔍 Debug: Check extracted addresses
      // console.log("🔍 Extracted addresses:", {
      //   physical: physicalAddress?.addressId,
      //   register: registerAddress?.addressId,
      //   postal: postalAddress?.addressId,
      //   previous: previousAddress?.addressId
      // });

      // Update service
      this.trustSvc.setBaseDealerFormData({
        physicalAddressId: physicalAddress?.addressId,
        postalAddressId: postalAddress?.addressId,
        previousAddressId: previousAddress?.addressId,
        registerAddressId: registerAddress?.addressId,
      });

      // 🔥 CRITICAL: Update local formData
      this.formData.physicalAddressId = physicalAddress?.addressId;
      this.formData.postalAddressId = postalAddress?.addressId;
      this.formData.previousAddressId = previousAddress?.addressId;
      this.formData.registerAddressId = registerAddress?.addressId;

      // 🔍 Debug: Confirm formData updated
      // console.log("🔍 After update - formData IDs:", {
      //   physical: this.formData.physicalAddressId,
      //   register: this.formData.registerAddressId,
      //   postal: this.formData.postalAddressId,
      //   previous: this.formData.previousAddressId
      // });



    }
    return res;
    // }
  }

  calculateNewDate(yearsToSubtract, monthsToSubtract) {
    // Get the current date

    const date = new Date();

    // Convert years to months and add to monthsToSubtract
    const totalMonthsToSubtract = yearsToSubtract * 12 + monthsToSubtract;

    // Subtract the total number of months
    date.setMonth(date.getMonth() - totalMonthsToSubtract);

    // Format the date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  calculateNewPreviousDate(referenceDate, yearsToSubtract, monthsToSubtract) {
    const date = new Date(referenceDate);

    // Convert years to months and add to monthsToSubtract
    const totalMonthsToSubtract = yearsToSubtract * 12 + monthsToSubtract;

    // Subtract the total number of months
    date.setMonth(date.getMonth() - totalMonthsToSubtract);

    // Format the date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Return the formatted date string
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  cancel() {
    this.trustSvc.activeStep = 0;
    const params: any = this.route.snapshot.params;
    // todo
    this.commonSvc?.ui?.showOkDialog(
      "Any unsaved changes will be lost. Are you sure you want to cancel?",
      "Customer",
      () => {
        this.trustSvc.iconfirmCheckbox.next(null);  //setting empty value to checkbox observable which is used for tab validations 
        this.trustSvc.showValidationMessage = false; //this flag is for mark all as read for all the customer components
        // if (this.mode == "create") {
        //   this.standardQuoteSvc.mode = "create";
        //   this.commonSvc.router.navigateByUrl(`/dealer/standard-quote/edit/${this.contractId || Number(this.params.contractId)}`);
        //   this.standardQuoteSvc.activeStep = 1;
        // } else if (this.mode == "edit" || this.mode == "view") {
        //   this.standardQuoteSvc.mode = "edit";
        //   this.commonSvc.router.navigateByUrl(`/dealer/standard-quote/edit/${this.contractId || Number(this.params.contractId)}`);
        //   this.standardQuoteSvc.activeStep = 1;
        // }

        if (this.mode == "create") {
          this.standardQuoteSvc.mode = "create";
          this.standardQuoteSvc.setBaseDealerFormData({
            CustomerID: this.formData.CustomerID,
          });
          this.commonSvc.router.navigateByUrl("/dealer/standard-quote");
          this.trustSvc.resetBaseDealerFormData();
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
          this.trustSvc.resetBaseDealerFormData();
          this.standardQuoteSvc.activeStep = 1;
        }
      }
    ); // Ensure the event is passed here
  }
}
