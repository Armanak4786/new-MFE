import { ChangeDetectorRef, Component, effect, OnDestroy, OnInit } from "@angular/core";
import { lastValueFrom, map, skip, Subject, takeUntil } from "rxjs";
import { IndividualService } from "./services/individual.service";
import { CommonService, MapFunc, Mode, ToasterService } from "auro-ui";
import { ActivatedRoute } from "@angular/router";
import { StandardQuoteService } from "../standard-quote/services/standard-quote.service";
import { IndividualData } from "./model/individual";
import { ValidationService } from "auro-ui";
import { DashboardService } from "../dashboard/services/dashboard.service";

@Component({
  selector: "app-individual",
  templateUrl: "./individual.component.html",
  styleUrl: "./individual.component.scss",
})
export class IndividualComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  id: any;
  // mode: Mode | string = Mode.create;
  data: any = {};
  isReady: boolean;
  formData: any;
  mode: any;
  contractId: any;
  individualDetailsConfirmation: boolean;
  customerId: any;
  user_role: any;
  accessGranted: any;
  customerNo: any;
  customerCpntractRole: any;
  individualCustomerDetails: any;
  mainForm: any;
  formConfig: any;

  updatedCustomerSummary: any;

  constructor(
    private individualSvc: IndividualService,
    private commonSvc: CommonService,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private standardQuoteSvc: StandardQuoteService,
    private toasterService: ToasterService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public dashboardService: DashboardService
  ) {
    this.standardQuoteSvc.formDataCacheableRoute([
      "LookUpServices/custom_lookups?LookupSetName=UdcFrequency",
      "LookUpServices/custom_lookups?LookupSetName=UdcHomeOwnership",
      "LookUpServices/custom_lookups?LookupSetName=UdcExpenditureDescription",
      "LookUpServices/custom_lookups?LookupSetName=UdcAssetDescription",
      "LookUpServices/custom_lookups?LookupSetName=UdcAdditionalIncomeDescription",
      "LookUpServices/lookups?LookupSetName=ContactType",
    ]);

    effect(() => {
      setTimeout(() => {
        if (this.dashboardService.isDealerCalculated) {
          this.toasterSvc.showToaster({
            severity: "error",
            detail: "err_calculateMsg",
          });
        }

      }, 3000);

    });
  }

  params: any = this.route.snapshot.params;
  async ngOnInit() {

    this.individualSvc.iconfirmCheckbox.subscribe((valid: any[]) => {
      // console.log("Iconfirm Check ", valid, this.steps);

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

      // console.log("Final validated steps", this.steps);

      // const hasInvalidStep = this.steps.some(step => step.validStatus === false);
      //   if (hasInvalidStep) {
      //     this.toasterSvc.showToaster({
      //       severity: "error",
      //       detail: "Please confirm all the mandatory fields",
      //     });
      //   }
    });

    let sessionStorageCustomerSummary = JSON.parse(sessionStorage?.getItem("updatedCustomerSummary"))
      if(sessionStorageCustomerSummary){
      const updateServiceRole = sessionStorageCustomerSummary?.find(c => c.customerRole == 1 || c.roleName == "Borrower")
      if(updateServiceRole){
        this.individualSvc.role = 1
      }
    }

    if(sessionStorageCustomerSummary?.length > 0){
      this.updatedCustomerSummary = sessionStorageCustomerSummary
    }

    this.standardQuoteSvc.getBaseDealerFormData().subscribe((data) => {

      // this.updatedCustomerSummary = data?.updatedCustomerSummary

      this.individualSvc.setBaseDealerFormData({
        updatedCustomerSummary: this.updatedCustomerSummary,
        customerSummary: data?.customerSummary,
        AFworkflowStatus:data?.AFworkflowStatus,
        workflowStatus:data?.workflowStatus
      })

    })

    this.activeStep = this.individualSvc.activeStep;
    let params: any = this.route.snapshot.params;
    this.mode = params.mode || Mode.create;

    this.customerNo = params.customerNo;

    this.individualSvc.accessMode = this.standardQuoteSvc.accessMode;
    this.user_role = JSON.parse(sessionStorage.getItem("user_role"));
    if (this.user_role?.functions) {
      Object.keys(this.user_role?.functions).forEach((key) => {
        this.individualSvc.accessGranted[key] =
          this.individualSvc.validateAction(key);
      });
      this.accessGranted = this.individualSvc.accessGranted;

     this.steps = [
  { label: "Personal Details" },
  { label: "Address Details" },
  { label: "Employment Details" },
  { label: "Financial Position" },
  { label: "Reference Details" }
];
    }

    ///RBAC
    this.individualSvc
      .getBaseDealerFormData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.formData = res;
        this.individualDetailsConfirmation = res?.individualDetailsConfirmation;
      });

    // Check if all amounts are 0
    // const allAssetsZero = res?.financialAssetDetails?.every(item => item.amount === 0) ?? true;
    // const allLiabilitiesZero = res?.liabilitiesDetails?.every(item => item.amount === 0) ?? true;
    // const allIncomeZero = res?.incomeDetails?.every(item => item.amount === 0) ?? true;
    // const allExpenditureZero = res?.expenditureDetails?.every(item => item.amount === 0) ?? true;

    this.standardQuoteSvc
      .getBaseDealerFormData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.contractId = res?.contractId;
      });

    this.individualSvc.setBaseDealerFormData({
      UdcFrequency: await this.getLookUpRes("UdcFrequency"),
      UdcHomeOwnership: await this.getLookUpRes("UdcHomeOwnership"),
      UdcExpenditureDescription: await this.getLookUpRes(
        "UdcExpenditureDescription"
      ),
      UdcAssetDescription: await this.getLookUpRes("UdcAssetDescription"),
      UdcAdditionalIncomeDescription: await this.getLookUpRes(
        "UdcAdditionalIncomeDescription"
      ),
      ReferenceDetailContactType: await this.getContactLookUpRes("ContactType"),
    });
    await this.init();
    // this.dashboardService?.onOriginatorChange.pipe(takeUntil(this.destroy$),skip(1)).subscribe(async (dealer) => {
    //                   if(this.dashboardService.isDealerCalculated)
    //                     {
    //                             this.toasterSvc.showToaster({
    //                               severity: "error",
    //                               detail:"err_calculateMsg",
    //                             });
    //                     }

    //       })
  }
  currentEmployeeInfoId: number;
  previousEmployeeInfoId: number;
  customerContactId: number;

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

  async init() {
    const params: any = this.route.snapshot.params;

    if (this.mode === "edit" || this.mode === "view") {
      const customerUrl = `CustomerDetails/get_customer?customerNo=${params.customerId
        }&contractId=${params.contractId || this.contractId}`;
      // const getCustomerFinanceUrl = `CustomerDetails/get_customerFiannceDetails?customerId=${params.customerId}&contractId=${this.contractId}`;
      // const customerFinanceDetails = await this.individualSvc.getFormData(
      //   getCustomerFinanceUrl,
      //   (res) => res?.data || null
      // );
      // const customerUrl = `CustomerDetails/get_customer?customerNo=12766&contractId=5499`;

      // Fetch customer details
      const individualCustomer = await this.individualSvc.getFormData(
        customerUrl,
        (res) => res?.data || null
      );

      const FinancialDetails = {
        IsSharedFinancialPosition:
          individualCustomer?.financialDetails?.financialPositionBase
          ?.isSharedFinancialPosition
    ?? this.formData?.IsSharedFinancialPosition,
        amtTakeHomePay: this.formData?.incomeDetails?.[0].amount,
        amtSpousePay: this.formData?.incomeDetails?.[1].amount,
        financialPositionBase:
          individualCustomer?.financialDetails?.financialPositionBase
          ?? this.formData?.financialPositionBase,
        financialPositionAsset:
        individualCustomer?.financialDetails?.financialPositionAsset
        ?? this.formData?.financialPositionAsset
        ?? [],
        financialPositionIncome:
        individualCustomer?.financialDetails?.financialPositionIncome
    ?? this.formData?.financialPositionIncome
    ?? [],
        financialPositionLiability:
    individualCustomer?.financialDetails?.financialPositionLiability
    ?? this.formData?.financialPositionLiability
    ?? [],
        financialPositionExpenditure:
    individualCustomer?.financialDetails?.financialPositionExpenditure
    ?? this.formData?.financialPositionExpenditure
    ?? [],
        financialPositionRegularRecurring:
    individualCustomer?.financialDetails?.financialPositionRegularRecurring
        ?? this.formData?.financialPositionRegularRecurring
    ?? [],
        customerId: individualCustomer?.customerId,
        customerNo: individualCustomer?.customerNo,
      };
      let AddressDetails: any = {};
      this.individualCustomerDetails = individualCustomer;
      if (individualCustomer?.addressDetails?.length) {
        const getAddress = (type: string, isCurrent: boolean = true) =>
          individualCustomer.addressDetails.find(
            (address) =>
              address.addressType?.toLowerCase() === type &&
              address.isCurrent === isCurrent
          );

        const physicalAddress = getAddress("street", true);
        const previousAddress = getAddress("street", false);
        const postalAddress = getAddress("mailing", true);

        AddressDetails = {
          physicalAddressId: physicalAddress?.addressId,
          postalAddressId: postalAddress?.addressId,
          previousAddressId: previousAddress?.addressId,
          physicalResidenceType: physicalAddress?.residentType,
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
          // physicalReuseOff: physicalAddress?.street === postalAddress?.street,
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
          // copyToPreviousAddress: !!previousAddress?.street,

          previousResidenceType: previousAddress?.residentType || "",
          previousYear: previousAddress && physicalAddress
           // ? await this.getTimeDifference(
            //   previousAddress?.effectDtFrom,
            //   physicalAddress?.effectDtFrom,
            //   "year"
            // )
            // : null,

        ? await this.getTimeDifference(
            previousAddress?.effectDtFrom,
            physicalAddress?.effectDtFrom,
            "year"
          )
        : 0,  
      previousMonth: previousAddress && physicalAddress
       // ? await this.getTimeDifference(
            //   previousAddress?.effectDtFrom,
            //   physicalAddress?.effectDtFrom,
            //   "month"
            // )
            // : null,

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
          previousUnitType:
            previousAddress?.addressComponents?.find(
              (comp) => comp.type === "UnitType"
            )?.value || "",

          previousUnitNumber:
            previousAddress?.addressComponents?.find(
              (comp) => comp.type === "UnitLot"
            )?.value || "",
          previousFloorNumber:
            previousAddress?.addressComponents?.find(
              (comp) => comp.type === "FloorNo"
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
          previousPostcode: previousAddress?.zipCode || "",
          previousCountry: previousAddress?.countryRegion?.extName || "",
          overseasAddress:
            previousAddress?.addressComponentTemplateHdrId == 1 ? false : true,

          previousTextArea: previousAddress?.street || "",

          postalType: null,
          postalNumber: null,

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
          postalPostcode: postalAddress?.zipCode || "",
          postalCountry: postalAddress?.countryRegion?.extName || "",

          postalStreetArea: postalAddress?.street || "",
          postalAddressType:
            postalAddress?.addressComponentTemplateHdrId == 1 ? "street" : "po",
        };
      }

      // Employee and Contact IDs
      this.currentEmployeeInfoId =
        individualCustomer?.employementDetails?.[0]?.employmentInfoId || null;
      this.previousEmployeeInfoId =
        individualCustomer?.employementDetails?.[1]?.employmentInfoId || null;
      this.customerContactId =
        individualCustomer?.referenceDetails?.[0]?.customerContactId || null;

      // Data Mapping
      const DataMapper = {
        // Personal Details
        title: individualCustomer?.personalDetails?.title || "",
        firstName: individualCustomer?.personalDetails?.firstName || "",
        middleName: individualCustomer?.personalDetails?.middleName || "",
        lastName: individualCustomer?.personalDetails?.lastName || "",
        knownAs: individualCustomer?.personalDetails?.knownAs || "",
        maritalStatus: individualCustomer?.personalDetails?.maritalStatus || "",
        gender: individualCustomer?.personalDetails?.gender || "",
        // noOfDependents: parseInt(individualCustomer?.personalDetails?.noOfDependents) || 0,
        noOfDependents:
          individualCustomer?.personalDetails?.noOfDependents || "0",
        dateOfBirth: individualCustomer?.personalDetails?.dateOfBirth || "",
        versionNumber: individualCustomer?.personalDetails?.versionNumber ? (individualCustomer?.personalDetails?.versionNumber === 0 || individualCustomer?.personalDetails?.versionNumber === "0" ? "" : individualCustomer?.personalDetails?.versionNumber) : "",
        licenceNumber: individualCustomer?.personalDetails?.licenceNumber ? (individualCustomer?.personalDetails?.licenceNumber === 0 || individualCustomer?.personalDetails?.licenceNumber === "0" ? "" : individualCustomer?.personalDetails?.licenceNumber) : "",

        licenseType: individualCustomer?.personalDetails?.licenceType || "",
        age: individualCustomer?.personalDetails?.dependentsAge || "0",
        // Reference Details
        referenceFirstName:
          individualCustomer?.referenceDetails?.[0]?.firstName || "",
        referenceLastName:
          individualCustomer?.referenceDetails?.[0]?.lastName || "",
        relationshipToCustomer:
          individualCustomer?.referenceDetails?.[0]?.relationship || "",
        referencePhoneExt:
          individualCustomer?.referenceDetails?.[0]?.phoneExt || "",
        referenceAreaCode:
          individualCustomer?.referenceDetails?.[0]?.areaCode || "",
        referencePhoneNo:
          individualCustomer?.referenceDetails?.[0]?.phoneNo || "",
        referenceDetailsTemp: individualCustomer?.referenceDetails,
        individualDetailsConfirmation: individualCustomer?.customerContractRole?.isConfirmed

      };

      // Merge data
      this.data = {
        ...this.data,
        ...DataMapper,
        ...individualCustomer,
        ...AddressDetails,
        ...FinancialDetails,
      };

      // Update form data and trigger change detection
      if (this.data) {
        this.individualSvc.setBaseDealerFormData(this.data);
        this.changeDetectorRef.detectChanges();
        this.isReady = true;
        if (this.mode === "view") {
          this.individualSvc.appState.next(true);
        }
      }
    } else {
      this.isReady = true;
    }
  }

  async updateAddressDetails() {
    
    
    let addressBody: any = [
      {
        addressId: this.formData?.physicalAddressId || -1,
        residentType: this.formData?.physicalResidenceType || null,
        postalType: this.formData?.postalType || null,
        postalNumber: this.formData?.postalNumber || null,
        addressType: "Street",
        county: null,
        stateProvince: null,
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
        street:this.formData?.physicalStreetArea || "default",
          // this.formData?.physicalCountry?.toLowerCase() !== "new zealand"
          //   ? this.formData?.physicalStreetArea
          //   : "default",
        alternateSuburb: "",
        effectDtFrom: this.calculateNewDate(
          Number(this.formData?.physicalYear),
          Number(this.formData?.physicalMonth)
        ),
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
        addressType: "Mailing",
        county: null,
        residentType:null,
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
        suburb: this.formData?.postalSuburbs,
        street:
          this.formData?.postalAddressType?.toLowerCase() === "po"
            ? this.formData?.postalStreetArea
            :"default",
        alternateSuburb: "",
        effectDtFrom: new Date().toISOString()?.split(".")[0],
        effectDtTo:null,
        isCurrent: true,
        addressComponentTemplateHdrId:
          this.formData?.postalAddressType?.toLowerCase() === "street" ? 1 : 0,
        addressComponents:
          this.formData?.postalAddressType?.toLowerCase() === "street"
            ? [
              {
                type: "Building Name",
                value: this.formData?.postalBuildingName,
              },
              { type: "Floor Type", value: this.formData?.postalFloorType },
              {
                type: "Floor No",
                value: String(this.formData?.postalFloorNumber),
              },
              { type: "Unit Type", value: this.formData?.postalUnitType },
              { type: "Unit Lot", value: this.formData?.postalUnitNumber },
              { type: "Street No", value: this.formData?.postalStreetNumber },
              { type: "Street Name", value: this.formData?.postalStreetName },
              { type: "Street Type", value: this.formData?.postalStreetType },
              {
                type: "Street Direction",
                value: this.formData?.postalStreetDirection,
              },
              {
                type: "Rural Delivery",
                value: this.formData?.postalRuralDelivery,
              },
            ]
            : [],
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
        street:
          // this.formData?.previousCountry?.toLowerCase() !== "new zealand"
          //   ? this.formData?.previousStreetArea
          //   : "default",

              this.formData?.overseasAddress
            ? this.formData?.previousStreetArea
            : "default",
        alternateSuburb: "",
        effectDtFrom: this.calculateNewPreviousDate(
          this.calculateNewDate(
            Number(this.formData?.physicalYear),
            Number(this.formData?.physicalMonth)
          ),
          Number(this.formData?.previousYear),
          Number(this.formData?.previousMonth)
        ),
      //  effectDtFrom: this.calculateNewDate(
      //     Number(this.formData?.previousYear)||0,
      // Number(this.formData?.previousMonth) || 0
      //   ),
        effectDtTo: null,
        residenceType:null,
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
      business: null,
      isConfirmed: false,
      contractId: this.contractId || Number(this.params?.contractId),

      individual: {
        businessIndividual: "Individual",
        customerId: this.formData?.customerId,
        customerNo: this.formData?.customerNo,
        role: this.formData?.role,
        customerContractRole: this.formData?.customerContractRole
          ? this.formData?.customerContractRole
          : this.individualCustomerDetails?.customerContractRole,
        partyType: ["Direct Customer"],
        addressDetails: addressBody,
        employementDetails: null,
        financialDetails: null,
        personalDetails: null,
        referenceDetails: null,
      },
    };

    let res: any = await this.putFormData(
      `CustomerDetails/update_customer`,
      body
    );

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

      this.individualSvc.setBaseDealerFormData({
        physicalAddressId: physicalAddress?.addressId,
        postalAddressId: postalAddress?.addressId,
        previousAddressId: previousAddress?.addressId,
      });
    }

    return res;
  }

  async personalDetailUpdate() {
    let body = {
      business: null,
      isConfirmed: false,
      contractId: this.contractId || Number(this.params?.contractId),
      individual: {
        businessIndividual: "Individual",
        customerId: this.formData?.customerId,
        customerNo: this.formData?.customerNo,
        role: this.formData?.role,
        customerContractRole:
          this.individualCustomerDetails?.customerContractRole,
        addressDetails: null,
        employementDetails: null,
        financialDetails: null,
        partyType: ["Direct Customer"],
        personalDetails: {
          // countryOfBirth: this.formData?.countryOfIssue,
          title: this.formData?.title,
          countryOfCitizenship: this.formData?.countryOfCitizenship,
          countryOfIssue: this.formData?.countryOfIssue,
          dateOfBirth: this.formData?.dateOfBirth,
          dependentsAge: this.formData?.noOfDependentArr
            .map((obj) => obj.age)
            .join(", "),
          emails: this.getIndividualDetailEmail(
            this.formData?.personalDetailsEmail
          ),
          firstName: this.formData?.firstName,
          gender: this.formData?.gender,
          knownAs: this.formData?.knownAs,
          lastName: this.formData?.lastName,
          licenceNumber: this.formData?.licenceNumber,
          licenceType: this.formData?.licenseType,
          maritalStatus: this.formData?.maritalStatus,
          middleName: this.formData?.middleName,
          noOfDependents: String(this.formData?.noOfDependents || "0"),
          
          partyStatus: "",
          // partyType: ["Direct Customer"],
          phone: this.formData?.personalDetailsPhone,
          phoneBusinessExtension: "",
          preferredContactMethod: "",
          reference: "",
          versionNumber: this.formData?.versionNumber,
          isNewZealandResident: this.formData?.isNewZealandResident,
          countryOfBirth: this.formData?.countryOfBirth,
          countryOfCitizenship1: this.formData?.countryOfCitizenship1 || "",
          countryOfCitizenship2: this.formData?.countryOfCitizenship2 || "",
          countryOfCitizenship3: this.formData?.countryOfCitizenship3 || "",
        },
        referenceDetails: null,
      },
    };
    let res: any = await this.putFormData(
      "CustomerDetails/update_customer",
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

    this.individualSvc.setBaseDealerFormData({ ...res?.data });

    this.formData.customerContractRole = res?.data?.customerContractRole;
    return res;
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

  async personalDetailPost() {
    let body: IndividualData = {
      business: null,
      isConfirmed: false,
      contractId: this.contractId || Number(this.params?.contractId),
      individual: {
        addressDetails: null,
        businessIndividual: "Individual",
        customerId: -1,
        customerNo: -1,
        role: this.formData?.role,
        employementDetails: null,
        financialDetails: null,
        partyType: ["Direct Customer"],
        personalDetails: {
          title: this.formData?.title,
          // countryOfCitizenship: this.formData?.countryOfCitizenship,
          countryOfIssue: this.formData?.countryOfIssue,
          dateOfBirth: this.formData?.dateOfBirth,
          dependentsAge: this.formData?.noOfDependentArr
            .map((obj) => obj.age)
            .join(", "),
          emails: this.getIndividualDetailEmail(
            this.formData?.personalDetailsEmail
          ),
          firstName: this.formData?.firstName,
          gender: this.formData?.gender,
          knownAs: this.formData?.knownAs,
          lastName: this.formData?.lastName,
          licenceNumber: this.formData?.licenceNumber,
          licenceType: this.formData?.licenseType,
          maritalStatus: this.formData?.maritalStatus,
          middleName: this.formData?.middleName,
          noOfDependents: String(this.formData?.noOfDependents || "0"),
          partyStatus: "",
          partyType: ["Direct Customer"],
          phone: this.formData?.personalDetailsPhone,
          phoneBusinessExtension: "",
          preferredContactMethod: "",
          reference: "",
          versionNumber: this.formData?.versionNumber,
          isNewZealandResident: this.formData.isNewZealandResident || "",
          countryOfBirth: this.formData?.countryOfBirth,
          countryOfCitizenship1: this.formData?.countryOfCitizenship1 || "",
          countryOfCitizenship2: this.formData?.countryOfCitizenship2 || "",
          countryOfCitizenship3: this.formData?.countryOfCitizenship3 || "",
        },
        referenceDetails: null,
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
    this.individualCustomerDetails = res?.data;
    return res;
  }
  async referenceDetailPost() {

    let body = {
      contractId: this.contractId || Number(this.params?.contractId),
      isConfirmed: this.formData?.individualDetailsConfirmation,
      individual: {
        business: null,
        addressDetails: null,
        businessIndividual: "Individual",
        customerId: this.formData?.customerId,
        customerNo: this.formData?.customerNo,
        role: this.formData?.role,
        customerContractRole: this.formData?.customerContractRole
          ? this.formData?.customerContractRole
          : this.individualCustomerDetails?.customerContractRole,
        employementDetails: null,
        financialDetails: null,
        personalDetails: null,
        partyType: ["Direct Customer"],
        referenceDetails: this.formData?.referenceDetailsTemp,
        // [
        //   {
        //     customerContactId: this.customerContactId || -1,
        //     customerId: this.formData?.customerId,
        //     customerNo: this.formData?.customerNo,
        //     firstName: this.formData?.referenceFirstName,
        //     lastName: this.formData?.referenceLastName,
        //     customerName: "",
        //     phoneExt: this.formData?.referencePhoneExt.toString(),
        //     areaCode: this.formData?.referenceAreaCode.toString(),
        //     phoneNo: this.formData?.referencePhoneNo.toString(),
        //     email: "abc@example.com",
        //     relationship: this.formData?.relationshipToCustomer,
        //     classification: "Individual",
        //     contactType: "Nearest Relative not living with you",
        //   },
        // ],
      },
    };
    let res: any = await this.putFormData(
      "CustomerDetails/update_customer",
      body
    );
    // this.formData.customerContactId = res?.data?.referenceDetails?.customerContactId;
    this.formData.referenceDetailsTemp = res?.data?.referenceDetails;

    return res;
  }
async employmentDetailsPost() {
  // function to determine jobTitle based on employment status
  const getJobTitle = (employmentStatus: string, occupationType: string): string | null => {
    const excludedStatuses = ["Retired", "Seasonal", "Unknown", "others"];
    return excludedStatuses.includes(employmentStatus) ? null : occupationType;
  };

  let body = {
    contractId: this.contractId || Number(this.params?.contractId),
    isConfirmed: false,
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
            jobTitle: getJobTitle(this.formData?.currentEmploymentType, this.formData?.currentOccupation),
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
            jobTitle: getJobTitle(this.formData?.previousEmploymentType, this.formData?.previousOccupation),
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
            jobTitle: getJobTitle(this.formData?.currentEmploymentType, this.formData?.currentOccupation),
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
      role: this.formData?.role,
      customerContractRole: this.formData?.customerContractRole
        ? this.formData?.customerContractRole
        : this.individualCustomerDetails?.customerContractRole,
      businessIndividual: "Individual",
      partyType: ["Direct Customer"],
    },
  };

  // Perform the update or create operation
  let res: any = await this.putFormData(
    "CustomerDetails/update_customer",
    body
  );

  this.individualSvc.setBaseDealerFormData({
    employementDetails: res?.data?.employementDetails,
  });

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

  return res;
}



  // async financialPositionPost() {
  //   let body = {
  //     customerFinanceDetails: [
  //       ...(this.formData?.financialAssetDetails?.map((asset, index) => ({
  //         id: 0,
  //         contractId: this.contractId,
  //         customerId: this.formData.customerNo,
  //         assestType: asset.assestType || "",
  //         assestAmount: (asset.amount || 0).toString(),
  //         // assestType: asset.addedAssetType || "",
  //         // assestAmount: (asset.addedAssetAmount || 0).toString(),
  //         AssestHomeOwnerType: "",
  //         incomeType: "",
  //         incomeAmount: "",
  //         incomeFrequency: "",
  //         incomeDetails: "",
  //         IsIncomeDecrease: "",
  //         expenditure: "",
  //         expenditureAmount: "",
  //         expenditureFrequency: "",
  //         outgoingType: "",
  //         outgoingAmount: "",
  //         outgoingFrequency: "",
  //         liabilitiesType: "",
  //         liabilitiesBalance: "",
  //         liabilitiesAmount: "",
  //         liabilitiesFrequency: "",
  //       })) || []),
  //       {
  //         id: 0,
  //         contractId: this.contractId,
  //         customerId: this.formData.customerNo,
  //         assestType: "",
  //         assestAmount: "",
  //         AssestHomeOwnerType:
  //           this.formData?.financialAssetDetails?.[0]?.assestHomeOwnerType,
  //         incomeType: "",
  //         incomeAmount: "",
  //         incomeFrequency: "",
  //         incomeDetails: "",
  //         IsIncomeDecrease: "",
  //         expenditure: "",
  //         expenditureAmount: "",
  //         expenditureFrequency: "",
  //         outgoingType: "",
  //         outgoingAmount: "",
  //         outgoingFrequency: "",
  //         liabilitiesType: "",
  //         liabilitiesBalance: "",
  //         liabilitiesAmount: "",
  //         liabilitiesFrequency: "",
  //       },
  //       ...(this.formData?.incomeDetails?.map((income, index) => ({
  //         id: 0,
  //         contractId: this.contractId,
  //         customerId: this.formData.customerNo,
  //         assestType: "",
  //         assestAmount: "",
  //         AssestHomeOwnerType: "",
  //         incomeType: income.incomeType || "",
  //         incomeAmount: (income.amount || 0).toString(),
  //         incomeFrequency: income.frequency || "",
  //         // incomeType: income.addedIncomeType || "",
  //         // incomeAmount: (income.addedIncomeAmount || 0).toString(),
  //         // incomeFrequency: income.addedIncomeFrequency || "",
  //         incomeDetails: "",
  //         IsIncomeDecrease: "",
  //         expenditure: "",
  //         expenditureAmount: "",
  //         expenditureFrequency: "",
  //         outgoingType: "",
  //         outgoingAmount: "",
  //         outgoingFrequency: "",
  //         liabilitiesType: "",
  //         liabilitiesBalance: "",
  //         liabilitiesAmount: "",
  //         liabilitiesFrequency: "",
  //       })) || []),
  //       {
  //         id: 0,
  //         contractId: this.contractId,
  //         customerId: this.formData.customerNo,
  //         assestType: "",
  //         assestAmount: "",
  //         AssestHomeOwnerType: "",
  //         incomeType: "",
  //         incomeAmount: "",
  //         incomeFrequency: "",
  //         incomeDetails: this.formData.details,
  //         IsIncomeDecrease: "",
  //         expenditure: "",
  //         expenditureAmount: "",
  //         expenditureFrequency: "",
  //         outgoingType: "",
  //         outgoingAmount: "",
  //         outgoingFrequency: "",
  //         liabilitiesType: "",
  //         liabilitiesBalance: "",
  //         liabilitiesAmount: "",
  //         liabilitiesFrequency: "",
  //       },
  //       {
  //         id: 0,
  //         contractId: this.contractId,
  //         customerId: this.formData.customerNo,
  //         assestType: "",
  //         assestAmount: "",
  //         AssestHomeOwnerType: "",
  //         incomeType: "",
  //         incomeAmount: "",
  //         incomeFrequency: "",
  //         incomeDetails: "",
  //         IsIncomeDecrease: this.formData.IsIncomeDecrease,
  //         expenditure: "",
  //         expenditureAmount: "",
  //         expenditureFrequency: "",
  //         outgoingType: "",
  //         outgoingAmount: "",
  //         outgoingFrequency: "",
  //         liabilitiesType: "",
  //         liabilitiesBalance: "",
  //         liabilitiesAmount: "",
  //         liabilitiesFrequency: "",
  //       },
  //       ...(this.formData?.expenditureDetails?.map((expenditure, index) => ({
  //         id: 0,
  //         contractId: this.contractId,
  //         customerId: this.formData.customerNo,
  //         assestType: "",
  //         assestAmount: "",
  //         AssestHomeOwnerType: "",
  //         incomeType: "",
  //         incomeAmount: "",
  //         incomeFrequency: "",
  //         incomeDetails: "",
  //         IsIncomeDecrease: "",
  //         expenditure: expenditure.expenditure || "",
  //         // expenditure: expenditure.addedExpenditureType || "",
  //         expenditureAmount: (expenditure.amount || 0).toString(),
  //         expenditureFrequency: expenditure.frequency || "",
  //         // expenditureAmount: (expenditure.addedExpenditureAmount || 0).toString(),
  //         // expenditureFrequency: expenditure.addedExpenditureFrequency || "",
  //         outgoingType: "",
  //         outgoingAmount: "",
  //         outgoingFrequency: "",
  //         liabilitiesType: "",
  //         liabilitiesBalance: "",
  //         liabilitiesAmount: "",
  //         liabilitiesFrequency: "",
  //       })) || []),
  //       ...(this.formData?.liabilitiesDetails?.map((liability, index) => ({
  //         id: 0,
  //         contractId: this.contractId,
  //         customerId: this.formData.customerNo,
  //         assestType: "",
  //         assestAmount: "",
  //         AssestHomeOwnerType: "",
  //         incomeType: "",
  //         incomeAmount: "",
  //         incomeFrequency: "",
  //         incomeDetails: "",
  //         IsIncomeDecrease: "",
  //         expenditure: "",
  //         expenditureAmount: "",
  //         expenditureFrequency: "",
  //         outgoingType: "",
  //         outgoingAmount: "",
  //         outgoingFrequency: "",
  //         liabilitiesType: liability.liabilitiesType || "",
  //         liabilitiesBalance: (liability.balance || 0).toString(),
  //         liabilitiesAmount: (liability.amount || 0).toString(),
  //         liabilitiesFrequency: liability.frequency || "",
  //         // liabilitiesType: liability.addedLiabilitiesType || "",
  //         // liabilitiesBalance: (liability.addedLiabilitiesBalance || 0).toString(),
  //         // liabilitiesAmount: (liability.addedLiabilitiesAmount || 0).toString(),
  //         // liabilitiesFrequency: liability.addedLiabilitiesFrequency || "",
  //       })) || []),
  //       ...(this.formData?.regularOutgoingDetails?.map((outgoing, index) => ({
  //         id: 0,
  //         contractId: this.contractId,
  //         customerId: this.formData.customerNo,
  //         assestType: "",
  //         assestAmount: "",
  //         AssestHomeOwnerType: "",
  //         incomeType: "",
  //         incomeAmount: "",
  //         incomeFrequency: "",
  //         incomeDetails: "",
  //         IsIncomeDecrease: "",
  //         expenditure: "",
  //         expenditureAmount: "",
  //         expenditureFrequency: "",
  //         outgoingType: outgoing.outgoingType || "",
  //         outgoingAmount: (outgoing.amount || 0).toString(),
  //         outgoingFrequency: outgoing.frequency,
  //         // outgoingType: outgoing.addedregularOutgoingType || "",
  //         // outgoingAmount: (outgoing.addedregularOutgoingAmount || 0).toString(),
  //         // outgoingFrequency: outgoing.addedregularOutgoingFrequency,
  //         liabilitiesType: "",
  //         liabilitiesBalance: "",
  //         liabilitiesAmount: "",
  //         liabilitiesFrequency: "",
  //       })) || []),
  //     ],
  //   };

  //   let res: any = await this.postFormData(
  //     "CustomerDetails/add_customerFiannceDetails",
  //     body
  //   );
  //   this.mode = "edit";
  //   return res;
  // }

  async financialPositionUpdate() {

    let params: any = this.route.snapshot.params;
    const financialDetailbody = {
      financialPositionBase: {
        IsSharedFinancialPosition:
          this.formData?.role === 2 ? this.formData?.IsSharedFinancialPosition : false,
        financialPositionBaseId:
          this.formData?.financialPositionBase?.financialPositionBaseId ||
          this.formData.CustomerDetailsResponse?.data?.financialDetails
            ?.financialPositionBase?.financialPositionBaseId ||
          0,
        contractId: this.contractId || Number(params?.contractId) || 0,
        partyId: this.formData?.customerId,
        partyNo: this.formData?.customerNo,
        partyName: this.formData?.customerContractRole?.customerName
          ? this.formData?.customerContractRole.customerName
          : this.individualCustomerDetails?.customerContractRole?.customerName,
        contractPartyRole:
          this.formData?.customerContractRole?.roleName ||
          this.individualCustomerDetails?.customerContractRole?.roleName,
        lastUpdatedDt:
          new Date().toISOString().split("T")[0] + "T00:00:00" || "",
        homeOwnership: this.formData.assestHomeOwnerType || 0,
        amtHomeValue: this.formData.financialAssetDetails?.[0]?.amount || 0,
        amtVehicleValue: this.formData.financialAssetDetails?.[1]?.amount || 0,
        amtFurnitureValue:
          this.formData.financialAssetDetails?.[2]?.amount || 0,
        amtTakeHomePay: this.formData.incomeDetails?.[0]?.amount || 0,
        takeHomePayFrequency:
          this.formData.incomeDetails?.[0]?.frequency || 3534,
        amtSpousePay: this.formData.incomeDetails?.[1]?.amount || 0,
        spousePayFrequency: this.formData.incomeDetails?.[1]?.frequency,
        isIncomeLikelyToDecrease: Boolean(this.formData.isIncomeDecrease),
        incomeDecrDetail: this.formData.details || "",
        amtTotalMonthlyExpenditure: 0,
        turnoverLatestYearEndingDt:
          new Date().toISOString().split("T")[0] + "T00:00:00" || "",
        amtTurnoverLatestYear: 0,
        turnoverPrevYearEndingDt:
          new Date().toISOString().split("T")[0] + "T00:00:00" || "",
        amtTurnoverPrevYear: 0,
        cashBalLatestYrEndDt:
          new Date().toISOString().split("T")[0] + "T00:00:00" || "",
        amtCashBalLatestYr: 0,
        debtorBalLatestYrEndDt:
          new Date().toISOString().split("T")[0] + "T00:00:00" || "",
        amtDebtorBalLatestYr: 0,
        creditorBalLatestYrEndDt:
          new Date().toISOString().split("T")[0] + "T00:00:00" || "",
        amtCreditorBalLatestYr: 0,
        overdraftBalLastYrEndDt:
          new Date().toISOString().split("T")[0] + "T00:00:00" || "",
        amtOverdraftBalLatestYr: 0,
        IsNetProfitLastYear: false,
        amtLastYearNetProfit: 0,
      },
      financialPositionAsset: this.formData.financialPositionAsset || [],
      financialPositionIncome: this.formData.financialPositionIncome || [],
      financialPositionExpenditure:
        this.formData.financialPositionExpenditure || [],
      financialPositionRegularRecurring:
        this.formData.financialPositionRegularRecurring || [],
      financialPositionLiability:
        this.formData.financialPositionLiability || [],
    };

    let body = {
      business: null,
      isConfirmed: false,
      contractId: this.contractId || Number(params?.contractId) || 0,

      individual: {
        businessIndividual: "Individual",
        customerId: this.formData?.customerId,
        customerNo: this.formData?.customerNo,
        role: this.formData?.role,
        customerContractRole: this.formData?.customerContractRole
          ? this.formData?.customerContractRole
          : this.individualCustomerDetails?.customerContractRole,
        partyType: ["Direct Customer"],
        addressDetails: null,
        employementDetails: null,
        financialDetails: financialDetailbody,
        personalDetails: null,
        referenceDetails: null,
      },
    };

    let res: any = await this.putFormData(
      "CustomerDetails/update_customer",
      body
    );

    this.individualSvc.setBaseDealerFormData({
      CustomerDetailsResponse: res, //For FinancialPositionBaseId
      // financialPositionExpenditure: res?.data?.financialDetails?.financialPositionExpenditure,
      // financialPositionLiability: res?.data?.financialDetails?.financialPositionLiability,
      // financialPositionIncome: res?.data?.financialDetails?.financialPositionIncome,
      // financialPositionAsset: res?.data?.financialDetails?.financialPositionAsset,
      // financialPositionRegularRecurring: res?.data?.financialDetails?.financialPositionRegularRecurring,
    });

    const financialDetails = res?.data?.financialDetails;

    if (financialDetails?.financialPositionExpenditure?.length > 0) {
      this.individualSvc.setBaseDealerFormData({
        financialPositionExpenditure:
          res?.data?.financialDetails?.financialPositionExpenditure,
      });
    }

    if (financialDetails?.financialPositionLiability?.length > 0) {
      this.individualSvc.setBaseDealerFormData({
        financialPositionLiability:
          res?.data?.financialDetails?.financialPositionLiability,
      });
    }

    if (financialDetails?.financialPositionIncome?.length > 0) {
      this.individualSvc.setBaseDealerFormData({
        financialPositionIncome:
          res?.data?.financialDetails?.financialPositionIncome,
      });
    }

    if (financialDetails?.financialPositionAsset?.length > 0) {
      this.individualSvc.setBaseDealerFormData({
        financialPositionAsset:
          res?.data?.financialDetails?.financialPositionAsset,
      });
    }

    if (financialDetails?.financialPositionRegularRecurring?.length > 0) {
      this.individualSvc.setBaseDealerFormData({
        financialPositionRegularRecurring:
          res?.data?.financialDetails?.financialPositionRegularRecurring,
      });
    }


    const updateSSOPColor = this.updatedCustomerSummary?.find(c => c.customerNo === this.formData.customerNo)
    if (updateSSOPColor) {
      updateSSOPColor.isSharedFinancialPosition = financialDetails?.financialPositionBase?.isSharedFinancialPosition || res?.data?.customerContractRole?.isSharedFinancialPosition;
    }

    this.standardQuoteSvc.setBaseDealerFormData({
      updatedCustomerSummary: this.updatedCustomerSummary
    })

  }
  async postFormData(api: string, payload: any, mapFunc?: MapFunc) {
    return await this.commonSvc.data
      ?.post(api, payload)
      .pipe(
        map((res) => {
          if (mapFunc) {
            res = mapFunc(res);
          }

          return res; //this.formConfig.data(res);
        })
      )
      .toPromise();
  }
  async putFormData(api: string, payload: any, mapFunc?: MapFunc) {
    return await this.commonSvc.data
      ?.put(api, payload)
      .pipe(
        map((res) => {
          if (mapFunc) {
            res = mapFunc(res);
          }

          return res; //this.formConfig.data(res);
        })
      )
      .toPromise();
  }

  calculateNewDate(yearsToSubtract, monthsToSubtract) {
    const date = new Date();
    const totalMonthsToSubtract = yearsToSubtract * 12 + monthsToSubtract;
    date.setMonth(date.getMonth() - totalMonthsToSubtract);
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

  calculateFromNewDate(
    fromDate: string,
    yearsToAdd: number,
    monthsToAdd: number
  ): string {
    const date = new Date(fromDate);

    // Convert years to months and add to monthsToAdd
    const totalMonthsToAdd = yearsToAdd * 12 + monthsToAdd;

    // Add the total number of months
    date.setMonth(date.getMonth() + totalMonthsToAdd);

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() { }

  activeStep = 0;
  // steps = [
  //   'Personal Details',
  //   'Address Details',
  //   'Employment Details',
  //   'Financial Position',
  //   'Reference Details',
  // ];

  steps = [];
  async changeStep(params: any) {
    const paramsUrl: any = this.route.snapshot.params;
    if (params.type === "submit") {

      const updateCustomerIcon = this.updatedCustomerSummary?.find(c => c.customerNo === this.formData.customerNo)
      if (updateCustomerIcon) {
        updateCustomerIcon.showInfoIcon = false
        updateCustomerIcon.isConfirmed = this.formData?.individualDetailsConfirmation
      }


      this.standardQuoteSvc.setBaseDealerFormData({
        updatedCustomerSummary: this.updatedCustomerSummary
      })

      this.individualSvc.setBaseDealerFormData({
        updatedCustomerSummary: this.updatedCustomerSummary
      })

       sessionStorage.setItem("updatedCustomerSummary", JSON.stringify(this.updatedCustomerSummary));

      //The above code is for handling red-icon from the UI

      if (this.individualDetailsConfirmation) {
        this.individualSvc.stepper.next({
          activeStep: this.activeStep,
          validate: true,
        });
        const statusInvalid =
          this.individualSvc?.formStatusArr?.includes("INVALID");
        this.individualSvc.formStatusArr = [];
        if (!statusInvalid) {
          this.individualSvc.iconfirmCheckbox.next(null);  //setting empty value to checkbox observable which is used for tab validations
          this.individualSvc.showValidationMessage = false; //this flag is for mark all as read for all the customer components
          this.activeStep = params.activeStep;
          this.standardQuoteSvc.activeStep = 1;
          this.individualSvc.stepper.next(params);
          let referenceDetailResponse = await this.referenceDetailPost();

          const isAddingExistingCustomer = this.individualSvc?.addingExistingCustomer;

          if(isAddingExistingCustomer && this.updatedCustomerSummary?.currentWorkflowStatus != "Start Verification" ){ //To change workflow state of the party when adding existing customer to new contract
              let requestBody = {
                nextState: "Start Verification",
                isForced: true
              }

              await this.putFormData(`WorkFlows/update_party_workflowstate?PartyNo=${this.formData?.customerNo || this.customerNo}&WorkflowName=ID Party Verification`, requestBody);
            }

          if (this.mode == "create") {
            this.standardQuoteSvc.mode = "create";
            let mode = this.standardQuoteSvc.mode;
            if (referenceDetailResponse) {
              this.commonSvc.router.navigateByUrl(
                `/dealer/standard-quote/edit/${this.contractId || Number(paramsUrl?.contractId)
                }`
              );
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
      this.individualSvc.activeStep = this.activeStep;
      this.individualSvc.stepper.next(params);
      this.individualSvc.formStatusArr.length = 0;
    }

    if (params.type === "next") {
      this.individualSvc.stepper.next({
        activeStep: this.activeStep,
        validate: true,
      });

      // this.updateAddressDetails();
      // const statusInvalid = this.individualSvc.formStatusArr?.includes("INVALID");
      // this.individualSvc.formStatusArr = [];
      // if (!statusInvalid) {
      if (this.formData?.role && this.formData.role !== 0) {
        let res: any = null;
        try {
          if (this.mode == "edit") {
            const borrowerExists = this.individualSvc?.role === 1;
            const isAddingExistingCustomer = this.individualSvc?.addingExistingCustomer;
            const newCustomerIsBorrower = this.formData?.role === 1;

            if (borrowerExists && isAddingExistingCustomer && newCustomerIsBorrower) {
              // Show error - Borrower exists AND we're trying to add existing customer as borrower
              this.toasterSvc.showToaster({
                severity: "error",
                detail: "Borrower already exists.",
              });
              return;
            }
            else if (!borrowerExists && !newCustomerIsBorrower) {
              // Allow this case - No borrower exists and we're adding a borrower
              // You might want to add your operation code here too
              this.toasterSvc.showToaster({
                severity: "error",
                detail: "Kindly add Borrower first.",
              });
              return;
            }

            else {
            // if (borrowerExists===false || !isAddingExistingCustomer) {
              // Allow operation - Borrower exists but we're NOT adding existing customer
              if (this.activeStep == 0) {
                res = await this.personalDetailUpdate();
              }
              if (this.activeStep == 1) {
                res = await this.updateAddressDetails();
              }
              if (this.activeStep == 2) {
                res = await this.employmentDetailsPost();
              }
              if (this.activeStep == 3) {
                res = await this.financialPositionUpdate();
              }

              if(res){
                const updateCustomerIsConfirmAsPerApiResponse = this.updatedCustomerSummary?.find(c => c.customerNo === this.formData?.customerNo)
                if(updateCustomerIsConfirmAsPerApiResponse){
                  updateCustomerIsConfirmAsPerApiResponse.isConfirmed = res?.data?.customerContractRole?.isConfirmed 
                }
                this.formData.individualDetailsConfirmation = res?.data?.customerContractRole?.isConfirmed
              }

              const updateCustomerIcon = this.updatedCustomerSummary?.find(c => c.customerNo === this.formData.customerNo)
              if (updateCustomerIcon) {
                updateCustomerIcon.showInfoIcon = false
              }

              this.standardQuoteSvc.setBaseDealerFormData({
                updatedCustomerSummary: this.updatedCustomerSummary
              })

              this.individualSvc.setBaseDealerFormData({
                updatedCustomerSummary: this.updatedCustomerSummary
              })

              sessionStorage.setItem("updatedCustomerSummary", JSON.stringify(this.updatedCustomerSummary));

              this.standardQuoteSvc.updateIndividualCustomerWarning = false;
            }
            // else if (borrowerExists && isAddingExistingCustomer && newCustomerIsBorrower) {
            //   // Show error - Borrower exists AND we're trying to add existing customer as borrower
            //   this.toasterSvc.showToaster({
            //     severity: "error",
            //     detail: "Borrower already exists.",
            //   });
            //   return;
            // }
            // else if (!borrowerExists && !newCustomerIsBorrower) {
            //   // Allow this case - No borrower exists and we're adding a borrower
            //   // You might want to add your operation code here too
            //   this.toasterSvc.showToaster({
            //     severity: "error",
            //     detail: "Kindly add Borrower first.",
            //   });
            //   return;
            // }

            if(isAddingExistingCustomer && this.updatedCustomerSummary?.currentWorkflowStatus != "Start Verification"){ //To change workflow state of the party when adding existing customer to new contract
              let requestBody = {
                nextState: "Start Verification",
                isForced: true
              }

              await this.putFormData(`WorkFlows/update_party_workflowstate?PartyNo=${this.formData?.customerNo || this.customerNo}&WorkflowName=ID Party Verification`, requestBody);
            }
          }

          if (this.mode == "create") {
            if (this.activeStep == 0 && !this.formData?.customerNo) {
              res = await this.personalDetailPost();
            } else if (this.activeStep == 0 && this.formData?.customerNo) {
              res = await this.personalDetailUpdate();
            } else if (this.activeStep == 1 && this.formData?.customerNo) {
              res = await this.updateAddressDetails();
            }
            if (this.activeStep == 2) {
              res = await this.employmentDetailsPost();
            }
            if (this.activeStep == 3) {
              // await this.financialPositionPost();
              res = await this.financialPositionUpdate();
            }
          }

          if (!res?.apiError?.errors.length) {
            this.activeStep = params.activeStep; //change
            this.individualSvc.activeStep = this.activeStep;
            this.individualSvc.stepper.next(params);
          }
        }
        catch (error) {
          return;
        }
      }
      // }
      // this.individualSvc.formStatusArr.length = 0;
    }

    if (params.type === "draft") {
      // this.toasterService.showToaster({
      //   severity: 'success',
      //   detail: 'Customer Details Saved Successfully',
      // });
      this.individualSvc.stepper.next({
        activeStep: this.activeStep,
        validate: true,
      });
      const statusInvalid =
        this.individualSvc.formStatusArr?.includes("INVALID");
      // if (!statusInvalid) {
      if (this.formData?.role && this.formData.role !== 0) {
        let res = null;
        if (this.mode == "edit") {
          const borrowerExists = this.individualSvc?.role === 1;
          const isAddingExistingCustomer = this.individualSvc?.addingExistingCustomer;
          const newCustomerIsBorrower = this.formData?.role === 1;

          if (borrowerExists && isAddingExistingCustomer && newCustomerIsBorrower) {
            // Show error - Borrower exists AND we're trying to add existing customer as borrower
            this.toasterSvc.showToaster({
              severity: "error",
              detail: "Borrower already exists.",
            });
            return;
          }
          else if (!borrowerExists && !newCustomerIsBorrower) {
            // Allow this case - No borrower exists and we're adding a borrower
            // You might want to add your operation code here too
            this.toasterSvc.showToaster({
              severity: "error",
              detail: "Kindly add Borrower first.",
            });
            return;
          }
          else{
          // if (borrowerExists===false && !isAddingExistingCustomer) {
            if (this.activeStep == 0) {
              res = await this.personalDetailUpdate();
            }
            if (this.activeStep == 1) {
              res = await this.updateAddressDetails();
            }
            if (this.activeStep == 2) {
              res = await this.employmentDetailsPost();
            }
            if (this.activeStep == 3) {
              // await this.financialPositionPost();
             res = await this.financialPositionUpdate();
            }
            if (this.activeStep == 4) {
              res = await this.referenceDetailPost();
            }

            if(res){
                const updateCustomerIsConfirmAsPerApiResponse = this.updatedCustomerSummary?.find(c => c.customerNo === this.formData?.customerNo)
                if(updateCustomerIsConfirmAsPerApiResponse){
                  updateCustomerIsConfirmAsPerApiResponse.isConfirmed = res?.data?.customerContractRole?.isConfirmed 
                }
                this.formData.individualDetailsConfirmation = res?.data?.customerContractRole?.isConfirmed
              }

            const updateCustomerIcon = this.updatedCustomerSummary?.find(c => c.customerNo === this.formData.customerNo)
            if (updateCustomerIcon) {
              updateCustomerIcon.showInfoIcon = false
            }


            this.standardQuoteSvc.setBaseDealerFormData({
              updatedCustomerSummary: this.updatedCustomerSummary
            })

            this.individualSvc.setBaseDealerFormData({
              updatedCustomerSummary: this.updatedCustomerSummary
            })

            sessionStorage.setItem("updatedCustomerSummary", JSON.stringify(this.updatedCustomerSummary));

            this.standardQuoteSvc.updateIndividualCustomerWarning = false; //when loan purpose is changed and there is individual customer role as borrower
          }

          if(isAddingExistingCustomer && this.updatedCustomerSummary?.currentWorkflowStatus != "Start Verification"){ //To change workflow state of the party when adding existing customer to new contract
              let requestBody = {
                nextState: "Start Verification",
                isForced: true
              }

              await this.putFormData(`WorkFlows/update_party_workflowstate?PartyNo=${this.formData?.customerNo || this.customerNo}&WorkflowName=ID Party Verification`, requestBody);
            }
          
        }
        if (this.mode == "create") {
          if (this.activeStep == 0 && !this.formData?.customerNo) {
            res = await this.personalDetailPost();
          } else if (this.activeStep == 0 && this.formData?.customerNo) {
            res = await this.personalDetailUpdate();
          }
          if (this.activeStep == 1) {
            res = await this.updateAddressDetails();
          }
          if (this.activeStep == 2) {
            res = await this.employmentDetailsPost();
          }
          if (this.activeStep == 3) {
            // await this.financialPositionPost();
            res = await this.financialPositionUpdate();
          }
          if (this.activeStep == 4) {
            res = await this.referenceDetailPost();
          }
        }

        this.toasterService.showToaster({
          severity: "success",
          detail: "Customer Details Saved Successfully",
        });
        this.activeStep = params.activeStep; //change
        this.individualSvc.activeStep = this.activeStep;
        this.individualSvc.stepper.next(params);
        // }
      }
      this.individualSvc.formStatusArr.length = 0;
    }

    if (params.type === "tabNav") {
      this.activeStep = params.activeStep;
      this.individualSvc.activeStep = this.activeStep;
      this.individualSvc.stepper.next(params);
    }
  }
  cancel() {
    this.individualSvc.activeStep = 0;
    const params: any = this.route.snapshot.params;
    this.commonSvc?.ui?.showOkDialog(
      "Any unsaved changes will be lost. Are you sure you want to cancel?",
      "Customer",
      () => {
        this.individualSvc.iconfirmCheckbox.next(null);  //setting empty value to checkbox observable which is used for tab validations
        this.individualSvc.showValidationMessage = false; //this flag is for mark all as read for all the customer components
        if (this.mode == "create") {
          this.standardQuoteSvc.mode = "create";
          this.standardQuoteSvc.setBaseDealerFormData({
            CustomerID: this.formData.CustomerID,
          });
          this.commonSvc.router.navigateByUrl("/dealer/standard-quote");
          this.individualSvc.resetBaseDealerFormData();
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
          this.individualSvc.resetBaseDealerFormData();
          this.standardQuoteSvc.activeStep = 1;
        }
      }
    ); // Ensure the event is passed here
  }
async getTimeDifference(
  fromDate: string, 
  toDate: string = new Date().toISOString(), 
  unit: 'year' | 'month' = 'year'
): Promise<number> {
  if (!fromDate) return 0;
  
  const startDate = new Date(fromDate);
  const endDate = toDate ? new Date(toDate) : new Date();
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return 0;
  }
  
  let yearsDifference = endDate.getFullYear() - startDate.getFullYear();
  let monthsDifference = endDate.getMonth() - startDate.getMonth();
  
  // Adjust for negative month difference
  if (monthsDifference < 0) {
    yearsDifference -= 1;
    monthsDifference += 12;
  }
  
  // Return the appropriate value
  return unit === 'year' 
    ? Math.max(0, yearsDifference)
    : Math.max(0, monthsDifference);
}

  pageCode: string = "IndividualComponent";
  modelName: string = "IndividualComponent";

  async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
  }

  async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  async onValueEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  async updateValidation(event) {
    const req = {
      form: this.mainForm?.form,
      formConfig: this.formConfig,
      event: event,
      modelName: this.modelName,
      pageCode: this.pageCode,
    };

    var responses: any = await this.validationSvc.updateValidation(req);
    if (responses.formConfig && !responses.status) {
      this.formConfig = { ...responses.formConfig };

      this.changeDetectorRef.detectChanges();
      return false;
    }
    return true;
  }

  async onStepChange(quotesDetails: any): Promise<void> {
    if (quotesDetails.type !== "tabNav") {
      var result: any = await this.updateValidation("onSubmit");
      if (!result?.status) {
        this.toasterSvc.showToaster({
          severity: "error",
          detail: "I7",
        });
      }
    }
  }
}
