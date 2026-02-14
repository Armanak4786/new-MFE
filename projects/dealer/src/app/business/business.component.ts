import { ChangeDetectorRef, Component, effect, OnDestroy, OnInit } from "@angular/core";
import { BusinessService } from "./services/business";
import { map, skip, Subject, takeUntil } from "rxjs";
import { CommonService, MapFunc, Mode, ToasterService } from "auro-ui";
import { ActivatedRoute } from "@angular/router";
import { StandardQuoteService } from "../standard-quote/services/standard-quote.service";

import { ValidationService } from "auro-ui";
import { DashboardService } from "../dashboard/services/dashboard.service";
import { SearchAddressService } from "../standard-quote/services/search-address.service";

@Component({
  selector: "app-business",
  templateUrl: "./business.component.html",
  styleUrl: "./business.component.scss",
})
export class BusinessComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  data: any = {};
  isReady: boolean;
  formData: any;
  mode: any;
  detailsConfirmation: boolean;
  contractId: number;
  customerId: any;
  businessCustomerId: any;
  businesscustomerContactId: any;
  accountantcustomerContactId: any;
  solicitorCustomerContactId: any;
  user_role: any;
  accessGranted: any;
  formConfig: any;
  mainForm: any;
  businessCustomerContractRole: any;
  updatedCustomerSummary: any;

  constructor(
    public dashboardService: DashboardService,
    private businessSvc: BusinessService,
    public commonSvc: CommonService,
    private standardQuoteSvc: StandardQuoteService,
    private toasterService: ToasterService,

    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef,
    private searchAddressService: SearchAddressService

  ) {
    this.commonSvc.data.setCacheableRoutes([
      "LookUpServices/locations?LocationType=country",
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
    }, { allowSignalWrites: true }
    )
  }

  params: any = this.route.snapshot.params;

  async ngOnInit() {

    this.businessSvc.iconfirmCheckbox.subscribe((valid: any[]) => {

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
      if(sessionStorageCustomerSummary){
      const updateServiceRole = sessionStorageCustomerSummary?.find(c => c.customerRole == 1 || c.roleName == "Borrower")
      if(updateServiceRole){
        this.businessSvc.role = 1
      }
    }

    if(sessionStorageCustomerSummary?.length > 0){
      this.updatedCustomerSummary = sessionStorageCustomerSummary
    }

    this.standardQuoteSvc.getBaseDealerFormData().subscribe((data) => {

      // this.updatedCustomerSummary = data?.updatedCustomerSummary

      this.businessSvc.setBaseDealerFormData({
        updatedCustomerSummary: this.updatedCustomerSummary,
        customerSummary: data?.customerSummary

      })

    })

    let params: any = this.route.snapshot.params;
    this.activeStep = this.businessSvc.activeStep;
    // this.activeStep = 0;

    this.mode = params.mode || Mode.create;

    ///RBAC
    // this.businessSvc.accessMode = this.standardQuoteSvc.accessMode;
    // this.user_role = JSON.parse(sessionStorage.getItem('user_role'));
    // if (this.user_role.functions) {
    //   Object.keys(this.user_role.functions).forEach((key) => {
    //     this.businessSvc.accessGranted[key] = this.businessSvc.validateAction(key);
    //   });
    //   this.accessGranted = this.businessSvc.accessGranted;
    //   this.steps = [];
    //   'Business Details',
    //   'Address Details',
    //   'Financial Accounts',
    //   'Contact Details',
    //   if (this.accessGranted['personal_details']) this.steps.push('Business Details');
    //   if (this.accessGranted['address_details_personal']) this.steps.push('Address Details');
    //   if (this.accessGranted['financial_position_personal']) this.steps.push('Financial Accounts');
    //   if (this.accessGranted['reference_details_personal']) this.steps.push('Reference Details');
    // }
    //RBAC

    this.businessSvc
      .getBaseDealerFormData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.detailsConfirmation = res?.detailsConfirmation;
        this.formData = res;
      });
    this.standardQuoteSvc
      .getBaseDealerFormData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.contractId = res?.contractId;
      });

    this.businessSvc.setBaseDealerFormData({
      ReferenceDetailContactType: await this.getContactLookUpRes("ContactType"),
    });

    await this.init();
    // this.dashboardService?.onOriginatorChange.pipe(takeUntil(this.destroy$),skip(1)).subscribe(async (dealer) => {
    //             if(this.dashboardService.isDealerCalculated)
    //               {
    //                       this.toasterSvc.showToaster({
    //                         severity: "error",
    //                         detail:"err_calculateMsg",
    //                       });
    //               }

    // })
  }


  getContactLookUpRes(LookupSetName: string): Promise<any> {
    return this.businessSvc.getFormData(
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
    { label: "Business Details" },
    { label: "Address Details" },
    { label: "Financial Accounts" },
    { label: "Contact Details" },
  ];

  async changeStep(params) {
    // if (params.type === "submit") {
    //   if (this.detailsConfirmation) {
    //     this.standardQuoteSvc.activeStep = 1;
    //     this.businessSvc.stepper.next(params);
    //     this.contactDetailPost();
    //     this.commonSvc.router.navigateByUrl("dealer/standard-quote");
    //   } else {
    //     this.toasterService.showToaster({
    //       severity: "error",
    //       detail: "Please Confirm your details are correct ",
    //     });
    //   }

    //   //  this.businessSvc.stepper.next(params);
    //   // if (this.mode === 'create') {

    //   // await this.businessDetailPost();

    //   //   this.commonSvc.router.navigateByUrl('dealer/standard-quote');
    //   // }
    // }

  if (params.type === "submit") {
    const updateCustomerIcon = this.updatedCustomerSummary?.find(
      (c) => c.customerNo === this.formData.customerNo
    );
    if (updateCustomerIcon) {
      updateCustomerIcon.showInfoIcon = false;
      updateCustomerIcon.isConfirmed = this.formData?.detailsConfirmation;
    }

    this.standardQuoteSvc.setBaseDealerFormData({
      updatedCustomerSummary: this.updatedCustomerSummary,
    });

    this.businessSvc.setBaseDealerFormData({
      updatedCustomerSummary: this.updatedCustomerSummary,
    });

    sessionStorage.setItem(
      "updatedCustomerSummary",
      JSON.stringify(this.updatedCustomerSummary)
    );

    if (this.detailsConfirmation) {
      this.businessSvc.stepper.next({
        activeStep: this.activeStep,
        validate: true,
      });
      const statusInvalid =
        this.businessSvc?.formStatusArr?.includes("INVALID");
      this.businessSvc.formStatusArr = [];
      if (!statusInvalid) {
        this.businessSvc.iconfirmCheckbox.next(null);
        this.businessSvc.showValidationMessage = false;
        this.activeStep = params.activeStep;
        this.standardQuoteSvc.activeStep = 1;
        this.businessSvc.stepper.next(params);
        let contactDetailPostResponse = await this.contactDetailPost();

        if (this.mode == "create") {
          this.standardQuoteSvc.mode = "create";
          let mode = this.standardQuoteSvc.mode;
          if (contactDetailPostResponse) {
            this.commonSvc.router.navigateByUrl(
              `/dealer/standard-quote/edit/${this.contractId || Number(this.params.contractId)
              }`
            );
            this.standardQuoteSvc.activeStep = 1;
          }
        } else if (this.mode == "edit" || this.mode == "view") {
          this.standardQuoteSvc.mode = "edit";
          let mode = this.standardQuoteSvc.mode;
          if (contactDetailPostResponse) {
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
    this.businessSvc.activeStep = this.activeStep;
    this.businessSvc.stepper.next(params);
  }

  if (params.type == "next") {
    this.businessSvc.stepper.next({
      activeStep: this.activeStep,
      validate: true,
    });
    // const statusInvalid = this.businessSvc?.formStatusArr?.includes("INVALID");
    // this.businessSvc.formStatusArr = [];
    // if (!statusInvalid) {

    if (this.formData?.role && this.formData.role != 0) {
      let res = null;
      try {
        //  CHECK FOR isNetProfitLastYear IN FINANCIAL ACCOUNTS STEP (activeStep === 2)
        if (this.activeStep === 2) {
          
          if (this.formData?.isNetProfitLastYear === null || this.formData?.isNetProfitLastYear === undefined) {
            this.toasterService.showToaster({
              severity: "error",
              detail: "Please fill the mandatory field",
            });
            return; 
          }
        }

        if (this.mode == "edit") {
          const borrowerExists = this.businessSvc?.role === 1;
          const isAddingExistingCustomer =
            this.businessSvc?.addingExistingCustomer;
          const newCustomerIsBorrower = this.formData?.role === 1;

          if (
            borrowerExists &&
            isAddingExistingCustomer &&
            newCustomerIsBorrower
          ) {
            this.toasterSvc.showToaster({
              severity: "error",
              detail: "Borrower already exists.",
            });
            return;
          } else if (!borrowerExists && !newCustomerIsBorrower) {
            // Allow this case - No borrower exists and we're adding a borrower
              // You might want to add your operation code here too
            this.toasterSvc.showToaster({
              severity: "error",
              detail: "Kindly add Borrower first.",
            });
            return;
          } else {
            // if (borrowerExists && !isAddingExistingCustomer) {
            if (this.activeStep == 0) {
              // await this.updateAddressDetails();
              res = await this.businessDetailUpdate();
            }
            if (this.activeStep == 1) {
              res = await this.updateAddressDetails();
            }
            if (this.activeStep == 2) {
              res = await this.financialAccountUpdate();
            }
            if (this.activeStep == 3) {
              res = await this.contactDetailPost();
            }

            if (res) {
              const updateCustomerIsConfirmAsPerApiResponse =
                this.updatedCustomerSummary?.find(
                  (c) => c.customerNo === this.formData?.customerNo
                );
              if (updateCustomerIsConfirmAsPerApiResponse) {
                updateCustomerIsConfirmAsPerApiResponse.isConfirmed =
                  res?.data?.customerContractRole?.isConfirmed;
              }
              this.formData.detailsConfirmation =
                res?.data?.customerContractRole?.isConfirmed;
            }

            const updateCustomerIcon = this.updatedCustomerSummary?.find(
              (c) => c.customerNo === this.formData.customerNo
            );
            if (updateCustomerIcon) {
              updateCustomerIcon.showInfoIcon = false;
            }

            this.standardQuoteSvc.setBaseDealerFormData({
              updatedCustomerSummary: this.updatedCustomerSummary,
            });

            this.businessSvc.setBaseDealerFormData({
              updatedCustomerSummary: this.updatedCustomerSummary,
            });

            sessionStorage.setItem(
              "updatedCustomerSummary",
              JSON.stringify(this.updatedCustomerSummary)
            );
          }
        }

        if (this.mode == "create") {
          if (this.activeStep == 0 && !this.formData?.businessCustomerNo) {
            res = await this.businessDetailPost();
          } else if (this.activeStep == 1) {
            res = await this.updateAddressDetails();
          } else if (this.activeStep == 2) {
            res = await this.financialAccountUpdate();
          } else if (this.activeStep == 3) {
            res = await this.contactDetailPost();
          } else if (
            this.activeStep == 0 &&
            this.formData?.businessCustomerNo
          ) {
              //await this.updateAddressDetails();
            res = await this.businessDetailUpdate();
          }
        }

        if (!res?.apiError?.errors.length) {
          this.activeStep = params.activeStep;
          this.businessSvc.activeStep = this.activeStep;
          this.businessSvc.stepper.next(params);
        }
      } catch (error) {
        return;
      }
    }
    // this.activeStep = params.activeStep;
      // this.businessSvc.activeStep = this.activeStep;
      // this.businessSvc.stepper.next(params);
      // }
      // this.businessSvc.formStatusArr.length = 0;
    // }
  }

  if (params.type == "draft") {
    this.businessSvc.stepper.next({
      activeStep: this.activeStep,
      validate: true,
    });
    const statusInvalid = this.businessSvc.formStatusArr?.includes("INVALID");
    this.businessSvc.formStatusArr = [];
    // if (!statusInvalid) {
    if (this.formData?.role && this.formData.role != 0) {
      // VALIDATION: CHECK FOR isNetProfitLastYear IN FINANCIAL ACCOUNTS STEP (activeStep === 2)
      if (this.activeStep === 2) {
        
        if (this.formData?.isNetProfitLastYear === null || this.formData?.isNetProfitLastYear === undefined) {
          this.toasterService.showToaster({
            severity: "error",
            detail: "Please fill the mandatory field",
          });
          return; //BLOCK SAVE
        }
      }

      if (this.mode == "edit") {
        const borrowerExists = this.businessSvc?.role === 1;
        const isAddingExistingCustomer =
          this.businessSvc?.addingExistingCustomer;
        const newCustomerIsBorrower = this.formData?.role === 1;
        let res = null;

        if (
          borrowerExists &&
          isAddingExistingCustomer &&
          newCustomerIsBorrower
        ) {
          this.toasterSvc.showToaster({
            severity: "error",
            detail: "Borrower already exists.",
          });
          return;
        } else if (!borrowerExists && !newCustomerIsBorrower) {

          
          this.toasterSvc.showToaster({
            severity: "error",
            detail: "Kindly add Borrower first.",
          });
          return;
        } else {
          if (this.activeStep == 0) {
            // await this.updateAddressDetails();
            res = await this.businessDetailUpdate();
          }
          if (this.activeStep == 3) {
            res = await this.contactDetailPost();
          }
          if (this.activeStep == 1) {
            res = await this.updateAddressDetails();
          }
          if (this.activeStep == 2) {
            res = await this.financialAccountUpdate();
          }

          if (res) {
            const updateCustomerIsConfirmAsPerApiResponse =
              this.updatedCustomerSummary?.find(
                (c) => c.customerNo === this.formData?.customerNo
              );
            if (updateCustomerIsConfirmAsPerApiResponse) {
              updateCustomerIsConfirmAsPerApiResponse.isConfirmed =
                res?.data?.customerContractRole?.isConfirmed;
            }
            this.formData.detailsConfirmation =
              res?.data?.customerContractRole?.isConfirmed;
          }

          const updateCustomerIcon = this.updatedCustomerSummary?.find(
            (c) => c.customerNo === this.formData.customerNo
          );
          if (updateCustomerIcon) {
            updateCustomerIcon.showInfoIcon = false;
          }

          this.standardQuoteSvc.setBaseDealerFormData({
            updatedCustomerSummary: this.updatedCustomerSummary,
          });

          this.businessSvc.setBaseDealerFormData({
            updatedCustomerSummary: this.updatedCustomerSummary,
          });

          sessionStorage.setItem(
            "updatedCustomerSummary",
            JSON.stringify(this.updatedCustomerSummary)
          );
        }
      }

      if (this.mode == "create") {
        if (this.activeStep == 0 && !this.formData?.businessCustomerNo) {
          await this.businessDetailPost();
        } else if (
          this.activeStep == 0 &&
          this.formData?.businessCustomerNo
        ) {
          await this.businessDetailUpdate();
        }

        if (this.activeStep == 1 && this.formData?.businessCustomerNo) {
          await this.updateAddressDetails();
        }
          // if (this.activeStep == 0 && this.formData?.businessCustomerNo) {
          //   await this.businessDetailPost();
          // }

          if (this.activeStep == 3) {
            await this.contactDetailPost();
          }
          if (this.activeStep == 2) {
            await this.financialAccountUpdate();
          }
        }
        this.toasterService.showToaster({
          severity: "success",
          detail: "Customer Details Saved Successfully",
        });
        this.activeStep = params.activeStep;
        this.businessSvc.activeStep = this.activeStep;
        this.businessSvc.stepper.next(params);
        // }
      }
      this.businessSvc.formStatusArr.length = 0;
    }

    if (params.type == "tabNav") {
      this.activeStep = params.activeStep;
      this.businessSvc.activeStep = this.activeStep;
      this.businessSvc.stepper.next(params);
    }
  }
  async init() {
    let params: any = this.route.snapshot.params;

    if (this.mode == "edit") {
      let businessCustomer = await this.businessSvc.getFormData(
        `CustomerDetails/get_customer?customerNo=${params?.customerId
        }&contractId=${this.contractId || params?.contractId}`,
        function (res) {
          return res?.data || null;
        }
      );

      if (this.formData) {
        this.formData.customerId = businessCustomer?.customerId;
        this.formData.customerNo = businessCustomer?.customerNo;
        this.formData.customerContractRole =
          businessCustomer?.customerContractRole;
      }

      this.businessCustomerContractRole = businessCustomer;
      this.businesscustomerContactId =
        businessCustomer?.contactDetails?.[0]?.customerContactId;
      this.accountantcustomerContactId =
        businessCustomer?.contactDetails?.[1]?.customerContactId;
      this.solicitorCustomerContactId =
        businessCustomer?.contactDetails?.[2]?.customerContactId;

      let BusinessFinancialBaseDetailRes =
        businessCustomer?.financialDetails?.financialPositionBase;

      let FinancialDetail = {
        isSharedFinancialPosition:
          BusinessFinancialBaseDetailRes?.isSharedFinancialPosition,
        financialPositionBaseId:
          BusinessFinancialBaseDetailRes?.financialPositionBaseId,
        isNetProfitLastYear:
          BusinessFinancialBaseDetailRes?.isNetProfitLastYear || false,
        amtLastYearNetProfit:
          BusinessFinancialBaseDetailRes?.amtLastYearNetProfit,
        amtTurnoverLatestYear:
          BusinessFinancialBaseDetailRes?.amtTurnoverLatestYear,
        turnoverLatestYearEndingDt:
          BusinessFinancialBaseDetailRes?.turnoverLatestYearEndingDt,
        amtTurnoverPrevYear:
          BusinessFinancialBaseDetailRes?.amtTurnoverPrevYear,
        turnoverPrevYearEndingDt:
          BusinessFinancialBaseDetailRes?.turnoverPrevYearEndingDt,
        amtCashBalLatestYr: BusinessFinancialBaseDetailRes?.amtCashBalLatestYr,
        cashBalLatestYrEndDt:
          BusinessFinancialBaseDetailRes?.cashBalLatestYrEndDt,
        amtDebtorBalLatestYr:
          BusinessFinancialBaseDetailRes?.amtDebtorBalLatestYr,
        debtorBalLatestYrEndDt:
          BusinessFinancialBaseDetailRes?.debtorBalLatestYrEndDt,
        amtCreditorBalLatestYr:
          BusinessFinancialBaseDetailRes?.amtCreditorBalLatestYr,
        creditorBalLatestYrEndDt:
          BusinessFinancialBaseDetailRes?.creditorBalLatestYrEndDt,
        amtOverdraftBalLatestYr:
          BusinessFinancialBaseDetailRes?.amtOverdraftBalLatestYr,
        overdraftBalLastYrEndDt:
          BusinessFinancialBaseDetailRes?.overdraftBalLastYrEndDt,
      };
      let dataMapper = {
        //business Details
        legalName: businessCustomer?.business?.legalName,
        organisationType: businessCustomer?.business?.organisationType,
        tradingName: businessCustomer?.business?.tradingName,
        registeredCompanyNumber:
          businessCustomer?.business?.registeredCompanyNumber,
        newZealandBusinessNumber:
          businessCustomer?.business?.newZealandBusinessNumber,
        taxNumber: businessCustomer?.business?.taxNumber,
        businessDescription: businessCustomer?.business?.businessDescription,
        natureOfBusiness: businessCustomer?.business?.natureOfBusiness,
        sourceOfWealth: businessCustomer?.business?.sourceOfWealth,
        timeInBusinessMonths:
          (await this.getTimeDifference(
            businessCustomer?.business?.establishedDt,
            this.commonSvc.data.convertDateToString(new Date()),
            "month"
          )) ?? 0,
        timeInBusinessYears:
          (await this.getTimeDifference(
            businessCustomer?.business?.establishedDt,
            this.commonSvc.data.convertDateToString(new Date()),
            "year"
          )) ?? 0,
        //accountant contact details
        accountantFirstName: businessCustomer?.contactDetails?.[1]?.firstName,
        accountantLastName: businessCustomer?.contactDetails?.[1]?.lastName,
        accountantEmail: businessCustomer?.contactDetails?.[1]?.email,
        accountantAreaCode: businessCustomer?.contactDetails?.[1]?.areaCode,
        accountantPhoneCode: businessCustomer?.contactDetails?.[1]?.phoneExt,
        accountantNumberr: businessCustomer?.contactDetails?.[1]?.phoneNo,

        businessContactFirstName:
          businessCustomer?.contactDetails?.[0]?.firstName,
        businessContactLastName:
          businessCustomer?.contactDetails?.[0]?.lastName,
        businessEmail: businessCustomer?.contactDetails?.[0]?.email,
        businessContactAreaCode:
          businessCustomer?.contactDetails?.[0]?.areaCode,
        businessContactPhoneCode:
          businessCustomer?.contactDetails?.[0]?.phoneExt,
        businessNumberr: businessCustomer?.contactDetails?.[0]?.phoneNo,

        solicitorFirstName: businessCustomer?.contactDetails?.[2]?.firstName,
        solicitorLastName: businessCustomer?.contactDetails?.[2]?.lastName,
        solicitorEmail: businessCustomer?.contactDetails?.[2]?.email,
        solicitorAreaCode: businessCustomer?.contactDetails?.[2]?.areaCode,
        solicitorPhoneCode: businessCustomer?.contactDetails?.[2]?.phoneExt,
        solicitorNumber: businessCustomer?.contactDetails?.[2]?.phoneNo,
        website: businessCustomer?.business?.website,

        //Contact Details
        referenceDetailsTemp: businessCustomer?.contactDetails,
        detailsConfirmation: businessCustomer?.customerContractRole?.isConfirmed

        // solicitorFirstName
        // solicitorLastName
        // solicitorAreaCode
        // solicitorPhoneCode
        // solicitorNumberr
        // solicitorEmail
      };

      if (businessCustomer?.contactDetails) {
      }

      let AddressDetails = {};
      if (businessCustomer?.addressDetails?.length) {
        const getAddress = (type: string, isCurrent: boolean = true) =>
          businessCustomer.addressDetails.find(
            (address) =>
              address.addressType?.toLowerCase() == type &&
              address.isCurrent === isCurrent
          );

        const physicalAddress = getAddress("street", true);
        const previousAddress = getAddress("street", false);
        const postalAddress = getAddress("mailing", true);
        const registeredAddress = getAddress("registered", true);

        AddressDetails = {
          physicalAddressId: physicalAddress?.addressId,
          postalAddressId: postalAddress?.addressId,
          previousAddressId: previousAddress?.addressId,
          registeredAddressId: registeredAddress?.addressId,
          physicalResidenceType: physicalAddress?.residentType,
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
          physicalCityLocationId: physicalAddress?.city?.locationId || "",
          physicalPostcode: physicalAddress?.zipCode || "",
          physicalCountry: physicalAddress?.countryRegion?.extName || "",

          physicalTextArea: physicalAddress?.street || "",
          copyToPreviousAddress: !!previousAddress?.street,

          previousResidenceType: previousAddress?.residentType || "",
          previousYear: previousAddress
            ? await this.getTimeDifference(
              previousAddress?.effectDtFrom,
              physicalAddress?.effectDtFrom,
              "year"
            )
            : null,
          previousMonth: previousAddress
            ? await this.getTimeDifference(
              previousAddress?.effectDtFrom,
              physicalAddress?.effectDtFrom,
              "month"
            )
            : null,

          previousBuildingName:
            previousAddress?.addressComponents?.find(
              (comp) => comp.type === "BuildingName"
            )?.value || "",

          previousFloorNumber:
            previousAddress?.addressComponents?.find(
              (comp) => comp.type === "FloorNo"
            )?.value || "",

          previousUnitType:
            previousAddress?.addressComponents?.find(
              (comp) => comp.type === "UnitType"
            )?.value || "",

          previousFloorType:
            previousAddress?.addressComponents?.find(
              (comp) => comp.type === "FloorType"
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
          previousPostcode: previousAddress?.zipCode || "",
          previousCountry: previousAddress?.countryRegion?.extName || "",
          overseasAddress:
            previousAddress?.addressComponentTemplateHdrId == 1 ? false : true,
          previousTextArea: previousAddress?.street || "",

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
          postalPostcode: postalAddress?.zipCode || "",
          postalCountry: postalAddress?.countryRegion?.extName || "",

          postalStreetArea: this.searchAddressService.sanitizeStreetValue(postalAddress?.street || ""),

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
          registerPostcode: registeredAddress?.zipCode || "",
          registerCountry: registeredAddress?.countryRegion?.extName || "",
          registerTextArea: registeredAddress?.street || "",
          postalAddressType:
            registeredAddress?.addressComponentTemplateHdrId === 0
              ? "po"
              : "street",
        };

      }

      this.data = {
        ...this.data,
        ...dataMapper,
        ...businessCustomer,
        ...AddressDetails,
        ...FinancialDetail,
      };

      if (this.data) {
        this.businessSvc.setBaseDealerFormData(this.data);
      }

      this.changeDetectorRef.detectChanges();
    }

    this.isReady = true;
  }

  async financialAccountUpdate() {
    let params: any = this.route.snapshot.params;

    const financialDetailbody = {
      financialPositionBase: {
        isSharedFinancialPosition: this.formData?.role === 2 ? this.formData?.isSharedFinancialPosition : false,
        financialPositionBaseId:
          this.formData?.financialPositionBaseId ||
          this.formData.BusinessFinancialDetailRes?.data?.financialDetails
            ?.financialPositionBase?.financialPositionBaseId ||
          0,
        contractId: this.contractId || Number(params?.contractId) || 0,
        partyId: this.formData?.customerId,
        partyNo: this.formData?.customerNo,
        partyName: this.formData?.customerContractRole?.customerName
          ? this.formData?.customerContractRole?.customerName
          : this.businessCustomerContractRole?.customerContractRole
            ?.customerName,
        contractPartyRole:
          this.formData?.customerContractRole?.roleName ||
          this.businessCustomerContractRole?.customerContractRole?.roleName,
        lastUpdatedDt:
          new Date().toISOString().split("T")[0] + "T00:00:00" || "",
        homeOwnership: this.formData.assestHomeOwnerType ?? 0,
        amtHomeValue: this.formData.financialAssetDetails?.[0]?.amount || 0,
        amtVehicleValue: this.formData.financialAssetDetails?.[1]?.amount || 0,
        amtFurnitureValue:
          this.formData.financialAssetDetails?.[2]?.amount || 0,
        amtTakeHomePay: this.formData.incomeDetails?.[0]?.amount || 0,
        takeHomePayFrequency:
          this.formData.incomeDetails?.[0]?.frequency || 3535,
        amtSpousePay: this.formData.incomeDetails?.[1]?.amount || 0,
        spousePayFrequency: this.formData.incomeDetails?.[1]?.frequency ?? 3533,
        isIncomeLikelyToDecrease:
          this.formData.isIncomeDecrease != null ? Boolean(this.formData.isIncomeDecrease) : false,
        incomeDecrDetail: this.formData.details || "TestBusiness1",
        amtTotalMonthlyExpenditure: 0,
        turnoverLatestYearEndingDt:
          this.formData.turnoverLatestYearEndingDt ||
          new Date("1900-01-01").toISOString().split("T")[0] + "T00:00:00",
        amtTurnoverLatestYear:
          this.formData.amtTurnoverLatestYear !== null
            ? this.formData.amtTurnoverLatestYear
            : 0,
        turnoverPrevYearEndingDt:
          this.formData.turnoverPrevYearEndingDt ||
          // new Date().toISOString().split("T")[0] + "T00:00:00",
          new Date("1900-01-01").toISOString().split("T")[0] + "T00:00:00",
        amtTurnoverPrevYear:
          this.formData.amtTurnoverPrevYear !== null
            ? this.formData.amtTurnoverPrevYear
            : 0,
        cashBalLatestYrEndDt:
          this.formData.cashBalLatestYrEndDt ||
          // new Date().toISOString().split("T")[0] + "T00:00:00",
          new Date("1900-01-01").toISOString().split("T")[0] + "T00:00:00",
        amtCashBalLatestYr:
          this.formData.amtCashBalLatestYr !== null
            ? this.formData.amtCashBalLatestYr
            : 0,
        debtorBalLatestYrEndDt:
          this.formData.debtorBalLatestYrEndDt ||
          // new Date().toISOString().split("T")[0] + "T00:00:00",
          new Date("1900-01-01").toISOString().split("T")[0] + "T00:00:00",
        amtDebtorBalLatestYr:
          this.formData.amtDebtorBalLatestYr !== null
            ? this.formData.amtDebtorBalLatestYr
            : 0,
        creditorBalLatestYrEndDt:
          this.formData.creditorBalLatestYrEndDt ||
          // new Date().toISOString().split("T")[0] + "T00:00:00",
          new Date("1900-01-01").toISOString().split("T")[0] + "T00:00:00",
        amtCreditorBalLatestYr:
          this.formData.amtCreditorBalLatestYr !== null
            ? this.formData.amtCreditorBalLatestYr
            : 0,
        overdraftBalLastYrEndDt:
          this.formData.overdraftBalLastYrEndDt ||
          // new Date().toISOString().split("T")[0] + "T00:00:00",
          new Date("1900-01-01").toISOString().split("T")[0] + "T00:00:00",
        amtOverdraftBalLatestYr:
          this.formData.amtOverdraftBalLatestYr !== null
            ? this.formData.amtOverdraftBalLatestYr
            : 0,
        isNetProfitLastYear: this.formData.isNetProfitLastYear,
        amtLastYearNetProfit:
          this.formData.amtLastYearNetProfit !== null
            ? this.formData.amtLastYearNetProfit
            : 0,
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
      contractId: this.contractId || Number(params?.contractId) || 0,
      isConfirmed: false,
      business: {
        businessIndividual: "Business",
        customerId: this.formData?.customerId,
        customerNo: this.formData?.customerNo,
        partyType: ["Direct Customer"],
        role: this.formData?.role,
        customerContractRole: this.formData?.customerContractRole
          ? this.formData?.customerContractRole
          : this.businessCustomerContractRole?.customerContractRole,
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

    this.businessSvc.setBaseDealerFormData({
      BusinessFinancialDetailRes: res,
    });
  }

  async businessDetailPost() {
    let body = {
      contractId: this.contractId || Number(this.params?.contractId),
      isConfirmed: false,
      Business: {
        customerId: -1,
        customerNo: -1,
        role: this.formData.role,
        businessIndividual: "Business",
        partyType: ["Direct Customer"],
        business: {
          organisationType: this.formData?.organisationType,
          legalName: this.formData?.legalName,
          tradingName: this.formData?.tradingName,
          registeredCompanyNumber: this.formData?.registeredCompanyNumber,
          newZealandBusinessNumber: this.formData?.newZealandBusinessNumber,
          taxNumber: this.formData?.taxNumber,
          businessDescription: this.formData?.businessDescription,
          natureOfBusiness:
            this.formData?.natureOfBusiness !== "undefined"
              ? this.decodeHtmlEntities(this.formData.natureOfBusiness)
              : null,
          sourceOfWealth: this.formData?.sourceOfWealth,
          timeInBusinessYears: this.formData?.timeInBusinessYears
            ? String(this.formData.timeInBusinessYears)
            : "",
          timeInBusinessMonths: this.formData?.timeInBusinessMonths
            ? String(this.formData.timeInBusinessMonths)
            : "",
          //establishedDt: '2000-09-12T10:46:29.398Z',
          // establishedDt: new Date().toISOString(),
          establishedDt:
            this.formData?.timeInBusinessYears ||
              this.formData?.timeInBusinessMonths
              ? this.calculateNewDate(
                Number(this.formData?.timeInBusinessYears),
                Number(this.formData?.timeInBusinessMonths)
              )
              : null,
          phoneBusinessExtension: "",
          preferredContactMethod: "Unspecified",
          phone: this.formData?.businessDetailPhone,
          emails: this.getBusinessDetailEmail(
            this.formData?.businessDetailEmail
          ),
          website: this.formData?.website,
        },
        addressDetails: null,
        financialDetails: null,
        contactDetails: null,
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

    this.formData.businessCustomerId = res?.data?.customerId;
    this.formData.businessCustomerNo = res?.data?.customerNo;
    this.formData.customerId = res?.data?.customerId;
    this.formData.customerNo = res?.data?.customerNo;
    this.formData.customerContractRole = res?.data?.customerContractRole;
    // this.contractId = res.data.customerId;
    // (this.businessCustomerId = res.data.customerNo);

    if (this.mode == "create") {
      this.standardQuoteSvc.businessData.push(res);
      this.standardQuoteSvc.businessDataSubject.next(
        this.standardQuoteSvc.businessData
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
            : "default",
        alternateSuburb: "",
        // effectDtFrom: this.formData?.physicalYear
        //   ? this.calculateNewDate(
        //     Number(this.formData?.physicalYear),
        //     Number(this.formData?.physicalMonth)
        //   )
        //   : new Date().toISOString(),
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
        suburb: this.formData?.postalSuburbs,
        street:
          this.formData?.postalAddressType?.toLowerCase() === "street"
            ? "default"
            : this.formData?.postalStreetArea,
        alternateSuburb: "",
        effectDtFrom: this.formData?.postalYear
          ? this.calculateNewDate(
            Number(this.formData?.postalYear),
            Number(this.formData?.postalMonth)
          )
          : new Date().toISOString(),
        effectDtTo: null,
        isCurrent: true,
        residentType: null,
        addressComponentTemplateHdrId:
          this.formData?.postalAddressType?.toLowerCase() === "po" ? 0 : 1,
        addressComponents:
          this.formData?.postalAddressType?.toLowerCase() === "po"
            ? []
            : [
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
            ],
      },
      {
        addressId: this.formData?.registeredAddressId || -1,
        addressType: "Registered",
        county: null,
        stateProvince: null,
        countryRegion: {
          extName: this.formData?.registerCountry || "New Zealand",
        },
        city: {
          LocationId: this.formData?.registerCityLocationId,
          extName: this.formData?.registerCity,
        },
        zipCode: String(this.formData?.registerPostcode),
        suburb: this.formData?.registerSuburbs,
        street:
          this.formData?.registerCountry?.toLowerCase() !== "new zealand"
            ? this.formData?.registerStreetArea
            : "default",
        alternateSuburb: "",
        effectDtFrom: new Date().toISOString()?.split(".")[0],
        effectDtTo: null,
        isCurrent: true,
        residentType: null,
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
              {
                type: "FloorType",
                value: this.formData?.registerFloorType,
              },
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
        residentType: null,
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
          this.formData?.previousCountry?.toLowerCase() !== "new zealand"
            ? this.formData?.previousStreetArea
            : "default",
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
        effectDtTo: null,
        isCurrent: false,
        // addressComponentTemplateHdrId:
        //   this.formData?.previousCountry?.toLowerCase() === "new zealand"
        //     ? 1
        //     : 0,
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
      contractId: this.contractId || Number(this.params?.contractId),
      isConfirmed: false,
      business: {
        businessIndividual: "Business",
        customerId: this.formData.customerId,
        customerNo: this.formData.customerNo,
        partyType: ["Direct Customer"],
        role: this.formData?.role,
        customerContractRole: this.formData?.customerContractRole
          ? this.formData?.customerContractRole
          : this.businessCustomerContractRole?.customerContractRole,
        addressDetails: addressBody,
        employementDetails: null,
        financialDetails: null,
        referenceDetails: null,
        business: null,
      },
    };

    let res = await this.putFormData("CustomerDetails/update_customer", body);
    if (res?.data?.addressDetails?.length > 0) {
      // const getAddress = (type: string, isCurrent: boolean = true) =>
      //   res?.data?.addressDetails?.find(
      //     (address) =>
      //       address.addressType =='Registered'? address.addressType : address.addressType?.toLowerCase() === type &&
      //       address.isCurrent === isCurrent
      //   );

      // const physicalAddress = getAddress("street", true);
      // const previousAddress = getAddress("street", false);
      // const postalAddress = getAddress("mailing", true);
      // const registeredAddress =getAddress("Registered",true)

      const getAddress = (type: string, isCurrent: boolean = true) =>
        res?.data?.addressDetails.find(
          (address) =>
            address.addressType?.toLowerCase() === type &&
            address.isCurrent === isCurrent
        );

      const physicalAddress = getAddress("street", true);
      const previousAddress = getAddress("street", false);
      const postalAddress = getAddress("mailing", true);
      const registerAddress = getAddress("registered", true);

      this.businessSvc.setBaseDealerFormData({
        physicalAddressId: physicalAddress?.addressId,
        postalAddressId: postalAddress?.addressId,
        previousAddressId: previousAddress?.addressId,
        registeredAddressId: registerAddress?.addressId,
      });
    }
    return res;
    // }
  }

  async businessDetailUpdate() {
    let body = {
      contractId: this.contractId || Number(this.params?.contractId),
      isConfirmed: false,
      business: {
        businessIndividual: "Business",
        customerId: this.formData.customerId,
        customerNo: this.formData.customerNo,
        partyType: ["Direct Customer"],
        role: this.formData?.role,
        customerContractRole:
          this.formData?.customerContractRole !== undefined || null
            ? this.formData?.customerContractRole
            : this.businessCustomerContractRole?.customerContractRole,
        business: {
          organisationType: this.formData?.organisationType,
          legalName: this.formData.legalName,
          tradingName: this.formData.tradingName,
          registeredCompanyNumber: this.formData.registeredCompanyNumber,
          newZealandBusinessNumber: this.formData.newZealandBusinessNumber,
          taxNumber: this.formData.taxNumber,
          businessDescription: this.formData.businessDescription,
          // natureOfBusiness: this.decodeHtmlEntities(this.formData?.natureOfBusiness),
          natureOfBusiness:
            this.formData?.natureOfBusiness !== "undefined"
              ? this.decodeHtmlEntities(this.formData.natureOfBusiness)
              : null,
          sourceOfWealth: this.formData.sourceOfWealth,
          timeInBusinessYears: this.formData.timeInBusinessYears
            ? String(this.formData.timeInBusinessYears)
            : "",
          timeInBusinessMonths: this.formData.timeInBusinessMonths
            ? String(this.formData.timeInBusinessMonths)
            : "",
          // establishedDt: '2000-09-12T10:46:29.398Z',
          // establishedDt: this.calculateNewDate(
          //   Number(this.formData?.timeInBusinessYears),
          //   Number(this.formData?.timeInBusinessMonths)
          // ),
          establishedDt:
            this.formData?.timeInBusinessYears ||
              this.formData?.timeInBusinessMonths
              ? this.calculateNewDate(
                Number(this.formData?.timeInBusinessYears),
                Number(this.formData?.timeInBusinessMonths)
              )
              : null,
          phoneBusinessExtension: "",
          preferredContactMethod: "Unspecified",
          phone: this.formData.businessDetailPhone,
          emails: this.getBusinessDetailEmail(
            this.formData.businessDetailEmail
          ),
          website: this.formData.website,
        },
        addressDetails: null,
        financialDetails: null,
        contactDetails: null,
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
    if (this.mode == "edit") {
      let index = this.standardQuoteSvc.businessData.findIndex(
        (ele) => ele.data?.customerNo == res?.data?.customerNo
      );
      this.standardQuoteSvc.businessData[index] = { ...res };
      this.standardQuoteSvc.businessDataSubject?.next(
        this.standardQuoteSvc.businessData
      );
    }

    this.formData.customerContractRole = res?.data?.customerContractRole;
    return res;
  }

  getBusinessDetailEmail(emailArray) {
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
  async contactDetailPost() {
    let body = {
      contractId: this.contractId || Number(this.params.contractId),
      isConfirmed: this.formData?.detailsConfirmation,
      Business: {
        customerId: this.formData.customerId,
        customerNo: this.formData.customerNo,
        businessIndividual: "Business",
        customerContractRole: this.formData?.customerContractRole
          ? this.formData?.customerContractRole
          : this.businessCustomerContractRole?.customerContractRole,
        PARTYTYPE: ["Direct Customer"],
        role: this.formData?.role,
        business: null,
        contactDetails: this.formData?.referenceDetailsTemp,

        //[
        //   {
        //     customerContactId: this.formData.businesscustomerContactId || -1,
        //     customerId: this.formData.customerId,
        //     customerNo: this.formData.customerNo,
        //     firstName: this.formData?.businessContactFirstName,
        //     lastName: this.formData?.businessContactLastName,
        //     customerName: "",
        //     phoneExt: this.formData?.businessContactPhoneCode,
        //     areaCode: String(this.formData?.businessContactAreaCode),
        //     phoneNo: String(this.formData?.businessNumberr),
        //     email: this.formData?.solicitorEmail,
        //     relationship: "Manager",
        //     classification: "Individual",
        //     contactType: "Business Manager",
        //   },
        //   {
        //     customerContactId: this.formData.accountantcustomerContactId || -1,
        //     customerId: this.formData.customerId,
        //     customerNo: this.formData.customerNo,
        //     firstName: this.formData?.accountantFirstName,
        //     lastName: this.formData?.accountantLastName,
        //     customerName: "",
        //     phoneExt: this.formData?.accountantPhoneCode,
        //     areaCode: String(this.formData?.accountantAreaCode),
        //     phoneNo: String(this.formData?.accountantNumberr),
        //     email: this.formData?.accountantEmail,
        //     relationship: "Accountant",
        //     classification: "Individual",
        //     contactType: "Accountant",
        //   },
        //   {
        //     customerContactId: this.formData.solicitorCustomerContactId || -1,
        //     customerId: this.formData.customerId,
        //     customerNo: this.formData.customerNo,
        //     firstName: this.formData?.solicitorFirstName,
        //     lastName: this.formData?.solicitorLastName,
        //     customerName: "",
        //     phoneExt: this.formData?.solicitorPhoneCode,
        //     areaCode: String(this.formData?.solicitorAreaCode),
        //     phoneNo: String(this.formData?.solicitorNumber),
        //     email: this.formData?.solicitorEmail,
        //     relationship: "Solicitor",
        //     classification: "Individual",
        //     contactType: "Solicitor",
        //   },
        // ],
      },
    };

    let res: any = await this.putFormData(
      "CustomerDetails/update_customer",
      body
    );

    this.formData.referenceDetailsTemp = res?.data?.contactDetails;
    // this.formData.businesscustomerContactId =
    //   res?.data?.contactDetails[0]?.customerContactId;
    // this.formData.accountantcustomerContactId =
    //   res?.data?.contactDetails[1]?.customerContactId;
    // this.formData.solicitorCustomerContactId =
    //   res?.data?.contactDetails[2]?.customerContactId;
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
  cancel() {
    this.businessSvc.activeStep = 0;
    // todo
    const params: any = this.route.snapshot.params;
    this.commonSvc?.ui?.showOkDialog(
      "Any unsaved changes will be lost. Are you sure you want to cancel?",
      " Customer",
      () => {
        this.businessSvc.iconfirmCheckbox.next(null);  //setting empty value to checkbox observable which is used for tab validations 
        this.businessSvc.showValidationMessage = false; //this flag is for mark all as read for all the customer components
        // if (this.mode == "create") {
        //   this.commonSvc.router.navigateByUrl("/dealer/standard-quote");
        // } else if (this.mode == "edit") {
        //   this.commonSvc.router.navigateByUrl("/dealer/standard-quote");
        //   this.standardQuoteSvc.activeStep = 1;
        // }

        if (this.mode == "create") {
          this.standardQuoteSvc.mode = "create";
          this.standardQuoteSvc.setBaseDealerFormData({
            CustomerID: this.formData.CustomerID,
          });
          this.commonSvc.router.navigateByUrl("/dealer/standard-quote");
          this.businessSvc.resetBaseDealerFormData();
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
          this.businessSvc.resetBaseDealerFormData();
          this.standardQuoteSvc.activeStep = 1;
        }
      }
    ); // Ensure the event is passed here
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

  pageCode: string = "StandardQuoteComponent";
  modelName: string = ""; // Will be set dynamically

  async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
  }

  async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  async onValueEvent(event: any) {
    const value = event?.target?.value ?? event; // extract value if it's an Event
    await this.updateValidation(value);
  }

  async updateValidation(event: any) {
    // Normalize: if it's an InputEvent, get its input value
    const normalizedEvent = event?.target?.value ?? event;

    const req = {
      form: this.mainForm?.form,
      formConfig: this.formConfig,
      event: normalizedEvent,
      modelName: this.modelName,
      pageCode: this.pageCode,
    };

    const responses = await this.validationSvc.updateValidation(req);

    if (!responses.status && responses.updatedFields.length) {
      await this.mainForm.applyValidationUpdates(responses);
    }

    return responses.status;
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
