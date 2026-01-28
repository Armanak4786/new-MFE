import { ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService, MapFunc, ToasterService } from "auro-ui";
import { Subject, firstValueFrom } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { StandardQuoteService } from "../../../../standard-quote/services/standard-quote.service";
import { IndividualService } from "../../../services/individual.service";

@Component({
  selector: "app-add-supplier-individual",
  templateUrl: "./add-supplier-individual.component.html",
  styleUrls: ["./add-supplier-individual.component.scss"],
})
export class AddSupplierIndividualComponent implements OnDestroy {
  tabs = [
    { label: "1. Personal Details" },
    { label: "2. Bank Details" },
    { label: "3. Address Details" },
  ];

  isReady: boolean = false;
  bankData: any = {};
  steps = [];
  activeStep = 0;
  formData: any;
  contractId: any;
  // personalPatched = false;

  constructor(
    private router: Router,
    private svc: CommonService,
    private toaster: ToasterService,
    private standardQuoteSvc: StandardQuoteService,
    private baseSvc: IndividualService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}
 
  async ngOnInit() {
    this.steps = [
      { label: "Personal Details" },
      { label: "Bank Details" },
      { label: "Address Details" },
    ];

    this.baseSvc.getBaseDealerFormData().subscribe((res) => {
      this.formData = res;
    });
 
    await this.init();
  }
 
 async init() {
  const params: any = this.route.snapshot.params;
  this.contractId = Number(params?.contractId);

  if (params?.customerId) {
    const customerUrl = `CustomerDetails/get_customer?customerNo=${params.customerId}&contractId=${params.contractId}`;
    const supplierCustomer = await this.baseSvc.getFormData(customerUrl, (res) => res?.data || null);

    if (!supplierCustomer) {
      this.isReady = true;
      return;
    }

    const personal = supplierCustomer?.personalDetails || {};
    const mobilePhone = personal?.phone?.find((p: any) => p.type === "PhoneMobile") || {};

    let individualSupplierMobile = "";
    let individualSupplierAreaCode = "";
    let individualSupplierPhoneNumber = "";

    if (mobilePhone?.value) {
      const phoneValue = mobilePhone.value;
      const codeMatch = phoneValue.match(/^([^\(]+)/);
      if (codeMatch) {
        individualSupplierMobile = codeMatch[1];
      }
      const numberPart = phoneValue.replace(/^\+?\d+/, "");
      let value = numberPart;
      const areacodeMatch = numberPart.match(/\((\d+)\)/);
      if (areacodeMatch) {
        individualSupplierAreaCode = areacodeMatch[1];
        value = numberPart.replace(/\((\d+)\)/, "");
      }
      individualSupplierPhoneNumber = value.replace(/\D/g, "");
    }

    const PersonalDetails = {
      title: personal?.title || "",
      firstName: personal?.firstName || "",
      middleName: personal?.middleName || "",
      lastName: personal?.lastName || "",
      knownAs: personal?.knownAs || "",
      individualSupplierEmail:  personal?.emails?.find(e => e.type === "EmailHome" && e.value)?.value ??
       personal?.emails?.find(e => e.type === "EmailOther" && e.value)?.value ??
      "",
      individualSupplierPhoneNumber:individualSupplierPhoneNumber,
      individualSupplierAreaCode: individualSupplierAreaCode ,
      individualSupplierMobile: individualSupplierMobile,
    };

    const bank = supplierCustomer?.bankDetails || {};
    const BankDetails = {
      supplierAccountName: bank?.name || "",
      supplierAccountNumber: bank?.accountNumber?.replace(/-/g, '') || "",
      supplierBranchCode: bank?.branchCode?.replace(/-/g, '') || "",
      settlementBankInfoId: bank?.settlementBankInfoId || "",
    };

    const physicalAddress = supplierCustomer?.addressDetails?.find(
      (a: any) => a.addressType?.toLowerCase() === "street" && a.isCurrent
    );
    const addressComponents = physicalAddress?.addressComponents || [];

    const AddressDetails = {
      buildingName: addressComponents.find((c: any) => c.type === "BuildingName")?.value || "",
      unitFloorType: addressComponents.find((c: any) => c.type === "UnitType")?.value || "",
      unitLotNumber: addressComponents.find((c: any) => c.type === "UnitLot")?.value || "",
      streetNumber: addressComponents.find((c: any) => c.type === "StreetNo")?.value || "",
      streetName: addressComponents.find((c: any) => c.type === "StreetName")?.value || "",
      streetType: addressComponents.find((c: any) => c.type === "StreetType")?.value || "",
      streetDirection: addressComponents.find((c: any) => c.type === "StreetDirection")?.value || "",
      ruralDelivery: addressComponents.find((c: any) => c.type === "RuralDelivery")?.value || "",
      suburb: physicalAddress?.suburb || "",
      city: physicalAddress?.city?.extName || "",
      physicalCityLocationId: physicalAddress?.city?.locationId,
      postcode: physicalAddress?.zipCode || "",
      country: physicalAddress?.countryRegion?.extName || "",
      previousYear: this.getTimeDifference(physicalAddress?.effectDtFrom, new Date().toISOString(), "year"),
    previousMonth: this.getTimeDifference(physicalAddress?.effectDtFrom, new Date().toISOString(), "month"),
    };

    const SupplierData = {
      ...(this.formData || {}),
      supplierCustomerId: supplierCustomer?.customerId,
      supplierCustomerNo: supplierCustomer?.customerNo,
      ...PersonalDetails,
      ...BankDetails,
      ...AddressDetails,
    };

this.isReady = true;
this.cdr.detectChanges();

this.baseSvc.setBaseDealerFormData(SupplierData);




  }
   else {
    this.isReady = true;
  }
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



  onBankUpdate(data: any) {
    // const bank = data?.supplierBankDetails ?? data;
    this.bankData = {
      supplierAccountName: data?.supplierAccountName || "",
      supplierAccountNumber: data?.supplierAccountNumber || "",
      supplierBranchCode: data?.supplierBranchCode || "",
    };
    this.baseSvc.setBaseDealerFormData({ ...this.bankData });
  }

  ngOnDestroy(): void {
      this.baseSvc.resetBaseDealerFormData();
    }

  async changeStep(params: any) {
    const paramsUrl: any = this.route.snapshot.params;
    if (params.type === "submit") {
      if (this.formData?.supplierCustomerId) {
        await this.updateSupplier().subscribe((res) => {
          if (res?.data) {
            this.svc.router.navigateByUrl("/dealer/standard-quote");
          }
        });
      }

         let requestBody = {
                nextState: "Start Verification",
                isForced: true
              }
       await this.putFormData(`WorkFlows/update_party_workflowstate?PartyNo=${this.formData?.supplierCustomerNo }&WorkflowName=ID Party Verification`, requestBody);
    }

    if (params.type === "previous") {
      this.activeStep = params.activeStep;
    }

    if (params.type === "next") {
      console.log("hi ther eindividual", this.formData, params.activeStep);

      if (params.activeStep == 1 && !this.formData?.supplierCustomerId) {
        this.createSupplier();
      } else if (this.formData?.supplierCustomerId) {
        await this.updateSupplier().subscribe((res) => {
          if (res?.data) {
            this.formData.settlementBankInfoId = res?.data?.bankDetails?.settlementBankInfoId
                let requestBody = {
                nextState: "Start Verification",
                isForced: true
              }
            this.putFormData(`WorkFlows/update_party_workflowstate?PartyNo=${this.formData?.supplierCustomerNo }&WorkflowName=ID Party Verification`, requestBody);
            this.activeStep = params?.activeStep;
          }
        });
      }
    }

    if (params.type === "draft") {
        if (params.activeStep == 0 && !this.formData?.supplierCustomerId) {
        this.createSupplier();
      } else if (this.formData?.supplierCustomerId) {
        await this.updateSupplier().subscribe((res) => {
          if (res?.data) {
            this.formData.settlementBankInfoId = res?.data?.bankDetails?.settlementBankInfoId
            this.activeStep = params?.activeStep;
          }
        });
      }
    }

    if (params.type === "tabNav") {
      this.activeStep = params.activeStep;
    }
  }
  onSubmit() {
      console.log("hi ther eindividual submit", this.formData);

  }
  cancel() {
    const params: any = this.route.snapshot.params;
    this.svc?.ui?.showOkDialog(
      "Any unsaved changes will be lost. Are you sure you want to cancel?",
      "Customer",
      () => {
        this.svc.router.navigateByUrl("/dealer/standard-quote");
      }
    );
  }

   async putFormData(api: string, payload: any, mapFunc?: MapFunc) {
      return await this.svc.data
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

  async createSupplier() {
    const payload = {
      business: null,
      isConfirmed: false,
      contractId: this.formData.contractId || this.contractId,
      individual: {
        partyType: ["Third Party"],
        addressDetails: null,
        businessIndividual: "Individual",
        customerId: -1,
        customerNo: -1,
        role: 7,
        employementDetails: null,
        financialDetails: null,
        personalDetails: {
          title: this.formData?.title,
          countryOfIssue: "New Zealand",
          dateOfBirth: "2007-11-01T00:00:00",
          dependentsAge: "",
          emails: [
            {
              value: "",
              type: "EmailOther",
              emailChk: false,
            },
            {
              value: "",
              type: "EmailBusiness",
            },
            {
              value: this.formData?.individualSupplierEmail,
              type: "EmailHome",
            },
          ],
          firstName: this.formData?.firstName,
          gender: "Male",
          knownAs: this.formData?.knownAs,
          lastName: this.formData?.lastName,
          licenceNumber: null,
          licenceType: null,
          maritalStatus: "Married",
          middleName: this.formData?.middleName,
          partyStatus: "",
          phone: [
            {
              value: `${this.formData?.individualSupplierMobile}(${this.formData?.individualSupplierAreaCode})${this.formData?.individualSupplierPhoneNumber}`,
              type: "PhoneMobile",
              areacode: this.formData?.individualSupplierAreaCode,
              code: this.formData?.individualSupplierMobile,
            },
          ],
          phoneBusinessExtension: "",
          preferredContactMethod: "",
          reference: "",
          versionNumber: null,
          isNewZealandResident: "",
          countryOfCitizenship1: "",
          countryOfCitizenship2: "",
          countryOfCitizenship3: "",
        },
        referenceDetails: null,
        bankDetails: {
          settlementBankInfoId: 0,
          currency: {
            id: 105,
            name: "New Zealand Dollars",
            code: "NZD",
          },
          flowDirection: "Payment",
          flowMethod: {
            flowMethodId: 0,
            name: "Direct Credit",
            paymentMethod: "Direct Credit",
          },
          paymentRuleClassification: "",
          reference: "",
          bank: {
            partyId: 28,
            partyNo: 1000028,
            reference: "",
            extName: "Bank Not Required",
          },
          name: "",
          description: "",
          accountCategory: "",
          accountNumber: "",
          accountClassification: "Personal",
          branchCode: "",
        },
      },
    };

    await this.svc?.data
      ?.post("CustomerDetails/add_customer", payload)
      .subscribe((res) => {
        if (res?.data) {
          this.formData.supplierCustomerId = res?.data?.customerId;
          this.formData.supplierCustomerNo = res?.data?.customerNo;
          this.formData.settlementBankInfoId = res?.data?.bankDetails?.settlementBankInfoId
          this.activeStep = 1;
        }
      });
  
}

  updateSupplier() {
    let rawAccNo = this.formData?.supplierAccountNumber || "";
    rawAccNo = rawAccNo?.toString()
    const formattedAccNo = rawAccNo !== "" ? rawAccNo?.slice(0, 7) + "-" + rawAccNo?.slice(7)
                          : "";
    let rawBranchCode = this.formData?.supplierBranchCode || "";
    rawBranchCode = rawBranchCode?.toString()
    const formattedBranchCode = rawBranchCode !== "" ?
      rawBranchCode?.slice(0, 2) + "-" + rawBranchCode?.slice(2) : "";
    const payload = {
      business: null,
      isConfirmed: false,
      contractId: this.formData?.contractId || this.contractId,
      individual: {
        partyType: ["Third Party"],
        businessIndividual: "Individual",
        customerId: this.formData?.supplierCustomerId,
        customerNo: this.formData?.supplierCustomerNo,
        role: 7,
        employementDetails: null,
        financialDetails: null,
        personalDetails: {
          title: this.formData?.title,
          countryOfIssue: "New Zealand",
          dateOfBirth: "2007-11-01T00:00:00",
          dependentsAge: "",
          emails: [
            {
              value: "",
              type: "EmailOther",
              emailChk: false,
            },
            {
              value: "",
              type: "EmailBusiness",
            },
            {
              value: this.formData?.individualSupplierEmail,
              type: "EmailHome",
            },
          ],
          firstName: this.formData?.firstName,
          gender: "Male",
          knownAs: this.formData?.knownAs,
          lastName: this.formData?.lastName,
          licenceNumber: null,
          licenceType: null,
          maritalStatus: "Married",
          middleName: this.formData?.middleName,
          partyStatus: "",
          phone: [
            {
              value: `${this.formData?.individualSupplierMobile}(${this.formData?.individualSupplierAreaCode})${this.formData?.individualSupplierPhoneNumber}`,
              type: "PhoneMobile",
              areacode: this.formData?.individualSupplierAreaCode,
              code: this.formData?.individualSupplierMobile,
            },
          ],
          phoneBusinessExtension: "",
          preferredContactMethod: "",
          reference: "",
          versionNumber: null,
          isNewZealandResident: "",
          countryOfCitizenship1: "",
          countryOfCitizenship2: "",
          countryOfCitizenship3: "",
        },
        referenceDetails: null,
        bankDetails: {
          settlementBankInfoId: this.formData?.settlementBankInfoId ,
          currency: {
            id: 105,
            name: "New Zealand Dollars",
            code: "NZD",
          },
          flowDirection: "Payment",
          flowMethod: {
            flowMethodId: 0,
            name: "Direct Credit",
            paymentMethod: "Direct Credit",
          },
          paymentRuleClassification: "",
          reference: "",
          bank: {
            partyId: 28,
            partyNo: 1000028,
            reference: "",
            extName: "Bank Not Required",
          },
          name: this.formData?.supplierAccountName,
          description: this.formData?.supplierAccountName,
          accountCategory: "None",
          accountNumber: formattedAccNo,
          accountClassification: "Personal",
          branchCode: formattedBranchCode,
        },
        addressDetails: [
          {
            addressId: -1,
            residentType: "Freehold",
            postalType: null,
            postalNumber: null,
            addressType: "Street",
            county: null,
            stateProvince: null,
            countryRegion: {
              extName: this.formData?.country || "New Zealand",
            },
             city:
             this.formData?.country?.toLowerCase() == "new zealand"
            ? {
              locationId: this.formData?.physicalCityLocationId,
              extName: this.formData?.city,
            }
            : undefined,
            zipCode: this.formData?.postcode,
            suburb: this.formData?.suburb,
            street: "default",
            alternateSuburb: "",
            effectDtFrom: this.calculateNewDate(
          Number(this.formData?.previousYear),
          Number(this.formData?.previousMonth)
        ),
            effectDtTo: null,
            isCurrent: true,
            addressComponentTemplateHdrId: 1,
            addressComponents: [
              {
                type: "BuildingName",
                value: this.formData?.buildingName,
              },
              {
                type: "FloorType",
                value: "",
              },
              {
                type: "FloorNo",
                value: "",
              },
              {
                type: "UnitType",
                value: this.formData?.unitFloorType,
              },
              {
                type: "UnitLot",
                value: this.formData?.unitLotNumber,
              },
              {
                type: "StreetNo",
                value: this.formData?.streetNumber,
              },
              {
                type: "StreetName",
                value: this.formData?.streetName,
              },
              {
                type: "StreetType",
                value: this.formData?.streetType,
              },
              {
                type: "StreetDirection",
                value: this.formData?.streetDirection,
              },
              {
                type: "RuralDelivery",
                value: this.formData?.ruralDelivery,
              },
            ],
          },
        ],
      },
    };

    return this.svc?.data?.put("CustomerDetails/update_customer", payload);

    
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
}
