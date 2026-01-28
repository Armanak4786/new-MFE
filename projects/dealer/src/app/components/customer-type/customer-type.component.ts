import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  BaseFormClass,
  CommonService,
  GenericFormConfig,
  Mode,
  ToasterService,
  ValidationService,
} from "auro-ui";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
// import { BaseIndividualClass } from "../../../base-individual.class";
// import { IndividualService } from "../../../services/individual.service";
// import { StandardQuoteService } from "../../../../standard-quote/services/standard-quote.service";
import { takeUntil } from "rxjs";
import { IndividualService } from "../../individual/services/individual.service";
import { StandardQuoteService } from "../../standard-quote/services/standard-quote.service";
import { BaseDealerClass } from "../../base/base-dealer.class";
import { BaseDealerService } from "../../base/base-dealer.service";
import { Validators } from "@angular/forms";
import configure from "../../../../public/assets/configure.json";



@Component({
  selector: "app-customer-type",
  templateUrl: "./customer-type.component.html",
  styleUrl: "./customer-type.component.scss",
})
export class CustomerTypeComponent extends BaseDealerClass {
  @Input() rowData: any;
  @Input() parent: string;
  @Input() IndividualformConfig: any;
  @Input() BusinessformConfig: any;
  @Input() modalType: any;
  @Input() signatoriesData: any;
  isEditEnabled: boolean = false;
  formConfig1: any;
  formConfig2: any;
  baseFormdata: any;

  searchType: any = "Individual";
 
 individualClassificationDisabled: boolean;
  businessClassificationDisabled: boolean;

  addNewContactCustomerId:any
  addNewContactcustomerNo:any
  maxSigningOrder: number = 0;
  controlsToDisable = [
    "individualCustomerName",
    "individualRole",
    "businessCustomerName",
    "businessRole",
    "businessPartyName",
    "businessPartyRole",
    "businessPartyLegalName",
    "businessPartyContactType",
    "businessPartyMobile",
    "businessPartyAreaCode",
    "businessPartyPhoneNumber",
    "businessPartyEmail",
    "individualPartyName",
    "individualPartyRole",
    "individualPartyFirstName",
    "individualPartyLastName",
    "individualPartyDateOfBirth",
    "individualPartyContactType",
    "individualPartyMobile",
    "individualPartyAreaCode",
    "individualPartyPhoneNumber",
    "individualPartyEmail",
  ];

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public indSvc: IndividualService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    // public override baseSvc : BaseDealerService,
    public sqsvc: StandardQuoteService
  ) {
    super(route, svc, indSvc);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    // this.updateValidation("onInit");

    this.sqsvc.getBaseDealerFormData().subscribe((data) => {

      this.baseSvc.setBaseDealerFormData({
        AFworkflowStatus: data?.AFworkflowStatus
      });
      return;
    });

    this.formConfig1 = this.IndividualformConfig;
    this.formConfig2 = this.BusinessformConfig;

    if (this.config.data?.classification == "Individual") {
      this.searchType = "Individual";
    }
    if (this.config.data?.classification == "Business") {
      this.searchType = "Business";
    }

    if(this.parent == "Contact" || this.parent == "Trustees"){
    if (this.config.data?.editReference) {
      let dataValue = this.config.data?.editReference;
      if (
        dataValue.classification == "Individual" &&
        this.parent == "Contact"
      ) {
        this.businessClassificationDisabled = true;
        this.individualClassificationDisabled = false;
        let dob;
        if (dataValue?.dateofBirth) {
          dob = new Date(dataValue?.dateofBirth);
        }
        this.baseFormData = {
          classification: dataValue.classification,
          individualContactType: dataValue.contactType,
          customerContactId: dataValue.customerContactId,
          customerId: dataValue.customerId || this.config.data?.customerId,
          customerNo: dataValue.customerNo || this.config.data?.customerNo,
          individualFirstName: dataValue.firstName,
          individualLastName: dataValue.lastName,
          individualPhoneNumber: dataValue.phoneNo,
          individualEmail: dataValue.email,
          individualSignatory: dataValue.isSignatory,
          contactOwnerRole: this.config.data?.contactOwnerRole || '',
          // individualesignatoryDetails: dataValue.esignatoryDetails,
          individualeSignatoryId: dataValue?.esignatoryDetails?.eSignatoryId,
          individualSigningOrder: dataValue?.esignatoryDetails?.signingOrder,
          // individualDateOfBirth : dataValue.dateofBirth,
          individualDateOfBirth: dob,
          individualMobile: dataValue.phoneExt,
          individualAreaCode: dataValue.areaCode,
          businessContactType: null,
          businessMobile: null,
          businessAreaCode: null,
          businessPhoneNumber: null,
          businessLegalName: null,
          businessEmail: null,
          businessSignatory: null,
        };
      } else if (
        dataValue.classification == "Individual" &&
        this.parent == "Trustees"
      ) {
          this.businessClassificationDisabled = true;
        this.individualClassificationDisabled = false;
        let dob;
        if (dataValue?.dateofBirth) {
          dob = new Date(dataValue?.dateofBirth);
        }

        this.baseFormData = {
          classification: dataValue.classification,
          TrusteeindividualContactType: dataValue.contactType,
          TrusteecustomerContactId: dataValue.customerContactId,
          customerId: dataValue.customerId || this.config.data?.customerId,
          customerNo: dataValue.customerNo || this.config.data?.customerNo,
          TrusteeindividualFirstName: dataValue.firstName,
          TrusteeindividualLastName: dataValue.lastName,
          TrusteeindividualPhoneNumber: dataValue.phoneNo,
          TrusteeindividualEmail: dataValue.email,
          contactOwnerRole: this.config.data?.contactOwnerRole || '',
          TrusteeindividualSignatory: dataValue.isSignatory,
          TrusteeindividualeSignatoryId: dataValue?.esignatoryDetails?.eSignatoryId,
          TrusteeindividualSigningOrder: dataValue?.esignatoryDetails?.signingOrder,
          // individualDateOfBirth : dataValue.dateofBirth,
          TrusteeindividualDateOfBirth: dob,
          TrusteeindividualMobile: dataValue.phoneExt,
          TrusteeindividualAreaCode: dataValue.areaCode,

          //Setting Business Fields null
          TrusteebusinessContactType: null,
          TrusteebusinessLegalName: null,
          TrusteebusinessPhoneNumber: null,
          TrusteebusinessEmail: null,
          TrusteebusinessSignatory: null,
          TrusteebusinessMobile: null,
          TrusteebusinessAreaCode: null,
        };
        // this.mainForm.form.get("individualDateOfBirth").patchValue(dob)
      } else if (
        dataValue.classification == "Business" &&
        this.parent == "Contact"
      ) {
          this.businessClassificationDisabled = false;
        this.individualClassificationDisabled = true;
        this.baseFormData = {
          classification: dataValue.classification,
          businessContactType: dataValue.contactType,
          customerContactId: dataValue.customerContactId,
          customerId: dataValue.customerId || this.config.data?.customerId,
          customerNo: dataValue.customerNo || this.config.data?.customerNo,
          // customerName : dataValue.customerName,
          businessMobile: dataValue.phoneExt,
          businessLegalName: dataValue.customerName,
          businessPhoneNumber: dataValue.phoneNo,
          businessEmail: dataValue.email,
          contactOwnerRole: this.config.data?.contactOwnerRole || '',
          businessSignatory: dataValue.isSignatory,
          businesseSignatoryId: dataValue?.esignatoryDetails?.eSignatoryId,
          businessSigningOrder: dataValue?.esignatoryDetails?.signingOrder,
          businessAreaCode: dataValue.areaCode,
          individualContactType: null,
          individualFirstName: null,
          individualLastName: null,
          individualPhoneNumber: null,
          individualEmail: null,
          individualSignatory: null,
          individualDateOfBirth: null,
          individualMobile: null,
          individualAreaCode: null,
        };
      } else if (
        dataValue.classification == "Business" &&
        this.parent == "Trustees"
      ) {
          this.businessClassificationDisabled = false;
        this.individualClassificationDisabled = true;
        this.baseFormData = {
          classification: dataValue.classification,
          TrusteebusinessContactType: dataValue.contactType,
          TrusteecustomerContactId: dataValue.customerContactId,
          customerId: dataValue.customerId || this.config.data?.customerId,
          customerNo: dataValue.customerNo || this.config.data?.customerNo,
          TrusteebusinessLegalName: dataValue.customerName,
          TrusteebusinessPhoneNumber: dataValue.phoneNo,
          TrusteebusinessEmail: dataValue.email,
          contactOwnerRole: this.config.data?.contactOwnerRole || '',
          TrusteebusinessSignatory: dataValue.isSignatory,
          TrusteebusinesseSignatoryId: dataValue?.esignatoryDetails?.eSignatoryId,
          TrusteebusinessSigningOrder: dataValue?.esignatoryDetails?.signingOrder,
          TrusteebusinessMobile: dataValue.phoneExt,
          TrusteebusinessAreaCode: dataValue.areaCode,

          //Setting Individual Fields Null
          TrusteeindividualContactType: null,
          TrusteeindividualFirstName: null,
          TrusteeindividualLastName: null,
          TrusteeindividualPhoneNumber: null,
          TrusteeindividualEmail: null,
          TrusteeindividualSignatory: null,
          TrusteeindividualDateOfBirth: null,
          TrusteeindividualMobile: null,
          TrusteeindividualAreaCode: null,
        };
      }
    } else {
      //For clearing data if cancel during Edit
        this.businessClassificationDisabled = false;
        this.individualClassificationDisabled = false;
      this.baseFormData = {
        classification: null,
        individualContactType: null,
        individualFirstName: null,
        individualLastName: null,
        individualPhoneNumber: null,
        individualEmail: null,
        individualSignatory: null,
        individualeSignatoryId: 0,
        individualSigningOrder: -1,
        individualDateOfBirth: null,
        individualMobile: "+64",
        individualAreaCode: null,
        businessContactType: null,
        customerContactId: null,
        customerId: this.config.data?.customerId,
        customerNo: this.config.data?.customerNo,
        businessLegalName: null,
        // businessTradingName : null,
        businessPhoneNumber: null,
        businessEmail: null,
        businessSignatory: null,
        businesseSignatoryId: 0,
        businessSigningOrder: -1,
        // businessDateOfBirth : null,
        businessMobile: "+64",
        businessAreaCode: null,
        TrusteeindividualContactType: null,
        TrusteecustomerContactId: null,
        TrusteeindividualFirstName: null,
        TrusteeindividualLastName: null,
        TrusteeindividualPhoneNumber: null,
        TrusteeindividualEmail: null,
        TrusteeindividualSignatory: null,
        TrusteeindividualeSignatoryId: 0,
        TrusteeindividualSigningOrder: -1,
        TrusteeindividualDateOfBirth: null,
        TrusteeindividualMobile: "+64",
        TrusteeindividualAreaCode: null,
        TrusteebusinessContactType: null,
        TrusteebusinessLegalName: null,
        // businessTradingName : null,
        TrusteebusinessPhoneNumber: null,
        TrusteebusinessEmail: null,
        TrusteebusinessSignatory: null,
        TrusteebusinesseSignatoryId: 0,
        TrusteebusinessSigningOrder: -1,
        // businessDateOfBirth : null,
        TrusteebusinessMobile: "+64",
        TrusteebusinessAreaCode: null,
      };
    }
  }
    // console.log(this.mainForm, "MainForm", this.baseFormData);
  }

  isDisabled(){
     if(configure?.workflowStatus?.view?.includes(this.baseFormData?.AFworkflowStatus)){
    return true;
  }
  return false;
  }

  override async onFormReady(): Promise<void> {
    // console.log(this.mainForm, "MainForm", this.baseFormData);

    if (this.parent == "Contact" || this.parent == "Signatories") {
    const contactTypes = [...(this.config?.data?.contactType || [])];
    contactTypes.sort((a, b) => a?.label?.localeCompare(b?.label));
    this.mainForm?.updateList("businessContactType", contactTypes);
    this.mainForm?.updateList("individualContactType", contactTypes);
    }

    if(this.parent == "Signatories"){
      this.individualClassificationDisabled = false;
      this.businessClassificationDisabled = false;
    }

    if (this.parent == "Signatories" && (this.modalType == "view" || this.modalType == "customerView")) {
      this.updateContactCustomerOptions();
    }
    else{
      this.addNewContactCustomerOptions();
    }

    if(this.parent == "Signatories"){
      this.findMaxSigningOrder()
    }
    if (
      this.parent == "Signatories" &&
      this.modalType == "view"
    ) {
      if (this.searchType == "Business") {
        this.individualClassificationDisabled = true;
        this.businessClassificationDisabled = false;

        this.baseFormData = {
          businessLegalName: this.rowData?.customerName || "",
          businessContactType: this.rowData?.contactType || "",
          businessSignatory: this.rowData?.isSignatory,
          businessMobile: this.rowData?.phoneExt || "",
          businessAreaCode: this.rowData?.areaCode || "",
          businessPhoneNumber: this.rowData?.phoneNo || "",
          businessEmail: this.rowData?.email || "",
          businessSigningOrder:
            this.rowData?.esignatoryDetails?.signingOrder || "",
        };
      }

      let dob;
      if (this.rowData?.dateofBirth) {
        dob = new Date(this.rowData?.dateofBirth);
      }

      if (this.searchType == "Individual") {
         this.individualClassificationDisabled = false;
        this.businessClassificationDisabled = true;
        this.baseFormData = {
          individualContactType: this.rowData?.contactType || "",
          individualFirstName: this.rowData?.firstName || "",
          individualLastName: this.rowData?.lastName || "",
          individualDateOfBirth: dob || "",
          individualMobile: this.rowData?.phoneExt || "",
          individualSignatory: this.rowData?.isSignatory,
          individualAreaCode: this.rowData?.areaCode || "",
          individualPhoneNumber: this.rowData?.phoneNo || "",
          individualEmail: this.rowData?.email || "",
          individualSigningOrder:
            this.rowData?.esignatoryDetails?.signingOrder || "",
        };
      }
    }

    if (this.parent == "Signatories" && this.modalType == "customerView") {
      if (this.searchType == "Business") {
         this.individualClassificationDisabled = true;
        this.businessClassificationDisabled = false;

        this.baseFormData = {
          businessPartyLegalName: this.rowData?.customerName || "",
          businessPartyContactType: this.rowData?.contactType || "",
          businessPartySignatory: this.rowData?.isCustomerSignatory,
          businessPartyMobile: this.rowData?.phoneExt || "",
          businessPartyAreaCode: this.rowData?.areaCode || "",
          businessPartyPhoneNumber: this.rowData?.phoneNo || "",
          businessPartyEmail: this.rowData?.email || "",
          businessPartySigningOrder: this.rowData?.esignatoryDetails?.signingOrder || null,
        };
      }

      let dob;
      if (this.rowData?.dateOfBirth) {
        dob = new Date(this.rowData?.dateOfBirth);
      }

      if (this.searchType == "Individual") {
         this.individualClassificationDisabled = false;
        this.businessClassificationDisabled = true;
        this.baseFormData = {
          // individualPartyName: this.rowData?.extName || "",
          // individualPartyRole: this.rowData?.partyRole || "",
          individualPartyContactType: this.rowData?.contactType || "",
          individualPartyFirstName: this.rowData?.firstName || "",
          individualPartyLastName: this.rowData?.lastName || "",
          individualPartyDateOfBirth: dob || "",
          individualPartyMobile: this.rowData?.phoneExt || "",
          individualPartySignatory: this.rowData?.isCustomerSignatory,
          individualPartyAreaCode: this.rowData?.areaCode || "",
          individualPartyPhoneNumber: this.rowData?.phoneNo || "",
          individualPartyEmail: this.rowData?.email || "",
          individualPartySigningOrder: this.rowData?.esignatoryDetails?.signingOrder || null,
        };
      }
    }

    if (
      (this.modalType == "view" && this.parent == "Signatories") ||
      (this.modalType == "customerView" && this.parent == "Signatories")
    ) {
      if (this.isEditEnabled) {
        this.mainForm?.form?.enable();

        this.controlsToDisable?.forEach((name) =>
          this.mainForm?.get(name)?.disable()
        );

        this.mainForm?.updateProps("individualPartySignatory", {
          mode: Mode.edit,
        });
        this.mainForm?.updateProps("businessPartySignatory", {
          mode: Mode.edit,
        });
        this.mainForm?.updateProps("businessSignatory", {
          mode: Mode.edit,
        });
         this.mainForm?.updateProps("individualSignatory", {
          mode: Mode.edit,
        });
      } else {

        this.mainForm?.form?.disable();
        this.mainForm?.updateProps("individualSignatory", {
          mode: Mode.view,
        });
        this.mainForm?.updateProps("businessSignatory", {
          mode: Mode.view,
        });
        this.mainForm?.updateProps("individualPartySignatory", {
          mode: Mode.view,
        });
        this.mainForm?.updateProps("businessPartySignatory", {
          mode: Mode.view,
        });
      }
    }

    await this.updateValidation("onInit");
    super.onFormReady();
  }

  private addNewContactCustomerOptions(){

     this.mainForm?.updateList(
      "individualCustomerName",
      this.getcustomerNameOptions()
    );
     this.mainForm?.updateList(
      "businessCustomerName",
      this.getcustomerNameOptions()
    );


  }

  getcustomerNameOptions() {
    return this.signatoriesData?.map((customer) => ({
      label: customer.customerName,
      value: customer.customerId,
    }));
  }

  onCustomerChange(customerId){
    let selectedCustomer = this.signatoriesData?.find(
      (c) => c.customerId === customerId
    );
    if (!selectedCustomer) return;

    const roleOptions = [
      {
        label: selectedCustomer.roleName,
        value: selectedCustomer.roleName,
      },
    ];
    this.mainForm?.updateList("individualRole", roleOptions);
    this.mainForm?.updateList("businessRole", roleOptions);
    this.mainForm
      ?.get("individualRole")
      ?.patchValue(selectedCustomer.roleName);
       this.mainForm
      ?.get("businessRole")
      ?.patchValue(selectedCustomer.roleName);

    this.addNewContactCustomerId = selectedCustomer?.customerId
    this.addNewContactcustomerNo = selectedCustomer?.customerNo
    
  }

  private updateContactCustomerOptions() {
    if (this.parent !== "Signatories") return;

    const customerNameOption = {
      label: this.config?.data?.customerName,
      value: this.config?.data?.customerName,
    };

    const customerRoleOption = {
      label: this.config?.data?.customerRole,
      value: this.config?.data?.customerRole,
    };

    const customerFields = [
      { name: "individualCustomerName", isRole: false },
      { name: "individualRole", isRole: true },
      { name: "businessCustomerName", isRole: false },
      { name: "businessRole", isRole: true },
      { name: "individualPartyName", isRole: false },
      { name: "individualPartyRole", isRole: true },
      { name: "businessPartyName", isRole: false },
      { name: "businessPartyRole", isRole: true },
    ];

    customerFields.forEach((field) => {
      this.mainForm?.updateList(field.name, [
        field.isRole ? customerRoleOption : customerNameOption,
      ]);

      this.mainForm
        ?.get(field.name)
        ?.patchValue(
          field.isRole
            ? this.config?.data?.customerRole
            : this.config?.data?.customerName
        );
    });

  }

  findMaxSigningOrder() {
  this.signatoriesData.forEach(customer => {
  if (customer.esignatoryDetails?.signingOrder > this.maxSigningOrder) {
    this.maxSigningOrder = customer.esignatoryDetails.signingOrder;
  }
  
  customer.contact?.forEach(contact => {
    if (contact.esignatoryDetails?.signingOrder > this.maxSigningOrder) {
      this.maxSigningOrder = contact.esignatoryDetails.signingOrder;
       }
     });
    });
  }

AddContacts() {
  this.mainForm.form.markAllAsTouched();
  if(this.mainForm.form.valid){
    
 
    // this.searchType = "individual"
    if (this.searchType == "Individual" && this.parent == "Contact") {
 
      const IndividualcontactDetails = {
      customerContactId : this.baseFormData?.customerContactId || 0,
      // contactPartyNo : this.baseFormData?.contactPartyNo || 0,
      customerId : this.baseFormData?.customerId || 0,
      customerNo : this.baseFormData?.customerNo || 0,
      firstName:  this.baseFormData?.individualFirstName || '',
      lastName: this.baseFormData?.individualLastName || '',
      customerName : this.baseFormData?.customerName,
      phoneExt: this.baseFormData?.individualMobile || '',
      areaCode: this.baseFormData?.individualAreaCode || '',
      phoneNo: this.baseFormData?.individualPhoneNumber || '',
      email: this.baseFormData?.individualEmail || '',
      contactOwnerRole: this.config?.data?.contactOwnerRole || this.baseFormData?.contactOwnerRole ||'',
      // dateofBirth: this.baseFormData?.individualDateOfBirth || null,
      ...(this.baseFormData?.individualDateOfBirth && { dateofBirth: this.baseFormData.individualDateOfBirth }),
      classification : "Individual",
      contactType: this.baseFormData?.individualContactType,
      isSignatory: this.baseFormData?.individualSignatory || false,
      // esignatoryDetails: this.baseFormData?.individualesignatoryDetails || null
      esignatoryDetails: {
        eSignatoryId: this.baseFormData?.individualeSignatoryId || 0,
        signingOrder: this.baseFormData?.individualSigningOrder ? this.baseFormData?.individualSigningOrder : -1 ,
        // groupSigningOrder: this.rowData?.esignatoryDetails?.groupSigningOrder,
        // eSignatoryRole: this.rowData?.esignatoryDetails?.eSignatoryRole,
      },
    };
   
    // this.indSvc.setBaseDealerFormData({
    //   referenceDetails : IndividualcontactDetails
    // })
 
      this.ref.close({
      action: "editContact",
      data : IndividualcontactDetails
    });
   
      // this.router.navigateByUrl("dealer/asset/addAsset");
    }
    if (this.searchType == "Individual" && this.parent == "Trustees") {
 
      const IndividualcontactDetails = {
      customerContactId : this.baseFormData?.TrusteecustomerContactId || 0,
      customerId : this.baseFormData?.customerId || 0,
      customerNo : this.baseFormData?.customerNo || 0,
      firstName:  this.baseFormData?.TrusteeindividualFirstName || '',
      lastName: this.baseFormData?.TrusteeindividualLastName || '',
      customerName : this.baseFormData?.TrusteecustomerName,
      phoneExt: this.baseFormData?.TrusteeindividualMobile || '',
      areaCode: this.baseFormData?.TrusteeindividualAreaCode || '',
      phoneNo: this.baseFormData?.TrusteeindividualPhoneNumber || '',
      email: this.mainForm.form.get('TrusteeindividualEmail')?.value || '',
      contactOwnerRole: this.config?.data?.contactOwnerRole || this.baseFormData?.contactOwnerRole || '',
      // dateofBirth: this.baseFormData?.TrusteeindividualDateOfBirth,
        ...(this.baseFormData?.TrusteeindividualDateOfBirth && { dateofBirth: this.baseFormData.TrusteeindividualDateOfBirth }),
      classification : "Individual",
      contactType: this.baseFormData?.TrusteeindividualContactType,
      isSignatory: this.baseFormData?.TrusteeindividualSignatory || false,
      esignatoryDetails: {
        eSignatoryId: this.baseFormData?.TrusteeindividualeSignatoryId || 0,
        signingOrder: this.baseFormData?.TrusteeindividualSigningOrder ? this.baseFormData?.TrusteeindividualSigningOrder : -1 ,
        // groupSigningOrder: this.rowData?.esignatoryDetails?.groupSigningOrder,
        // eSignatoryRole: this.rowData?.esignatoryDetails?.eSignatoryRole,
      },
    };
   
    // this.indSvc.setBaseDealerFormData({
    //   referenceDetails : IndividualcontactDetails
    // })
      this.ref.close({
      action: "editContact",
      data : IndividualcontactDetails
    });
   
    }
    if (this.searchType == "Business" && this.parent == "Contact") {
     
      const BusinesscontactDetails = {
      customerContactId : this.baseFormData?.customerContactId || 0,
      customerId : this.baseFormData?.customerId || 0,
      customerNo : this.baseFormData?.customerNo || 0,
      customerName:  this.baseFormData?.businessLegalName || '',
      phoneExt: this.baseFormData?.businessMobile || '',
      areaCode: this.baseFormData?.businessAreaCode || '',
      phoneNo: this.baseFormData?.businessPhoneNumber || '',
      email: this.baseFormData?.businessEmail || '',
      classification : "Business",
      contactType: this.baseFormData?.businessContactType,
      isSignatory: this.baseFormData?.businessSignatory || false,
      contactOwnerRole: this.config?.data?.contactOwnerRole || this.baseFormData?.contactOwnerRole || '',
      esignatoryDetails: {
        eSignatoryId: this.baseFormData?.businesseSignatoryId || 0,
        signingOrder: this.baseFormData?.businessSigningOrder ? this.baseFormData?.businessSigningOrder : -1 ,
        // groupSigningOrder: this.rowData?.esignatoryDetails?.groupSigningOrder,
        // eSignatoryRole: this.rowData?.esignatoryDetails?.eSignatoryRole,
      },
    };
 
      this.ref.close({
      action: "editContact",
      data : BusinesscontactDetails
    });
 
    }
    if (this.searchType == "Business" && this.parent == "Trustees") {
     
      const BusinesscontactDetails = {
      customerContactId : this.baseFormData?.TrusteecustomerContactId || 0,
      customerId : this.baseFormData?.customerId || 0,
      customerNo : this.baseFormData?.customerNo || 0,
      customerName:  this.baseFormData?.TrusteebusinessLegalName || '',
      phoneExt: this.baseFormData?.TrusteebusinessMobile || '',
      areaCode: this.baseFormData?.TrusteebusinessAreaCode || '',
      phoneNo: this.baseFormData?.TrusteebusinessPhoneNumber || '',
      email: this.baseFormData?.TrusteebusinessEmail || '',
      classification : "Business",
      contactType: this.baseFormData?.TrusteebusinessContactType,
      isSignatory: this.baseFormData?.TrusteebusinessSignatory || false,
      contactOwnerRole: this.config?.data?.contactOwnerRole || this.baseFormData?.contactOwnerRole || '',
      esignatoryDetails: {
        eSignatoryId: this.baseFormData?.TrusteebusinesseSignatoryId || 0,
        signingOrder: this.baseFormData?.TrusteebusinessSigningOrder ? this.baseFormData?.TrusteebusinessSigningOrder : -1 ,
        // groupSigningOrder: this.rowData?.esignatoryDetails?.groupSigningOrder,
        // eSignatoryRole: this.rowData?.esignatoryDetails?.eSignatoryRole,
      },
    };
 
      this.ref.close({
      action: "editContact",
      data : BusinesscontactDetails
    });
 
    }
 
 
 
    this.baseSvc.setBaseDealerFormData({   //subhashish
      referenceDetails : null,
      individualContactType : null,
        individualFirstName : null,
        individualLastName : null,
        individualPhoneNumber : null,
        individualEmail : null,
        individualSignatory : null,
        individualDateOfBirth : null,
        individualMobile : null,
        individualAreaCode : null,
        businessContactType : null,
        businessLegalName : null,
        // businessTradingName : null,
        businessPhoneNumber : null,
        businessEmail : null,
        businessSignatory : null,
        // businessDateOfBirth : null,
        businessMobile : null,
        businessAreaCode : null,
        TrusteeindividualContactType : null,
        TrusteeindividualFirstName : null,
        TrusteeindividualLastName : null,
        TrusteeindividualPhoneNumber : null,
        TrusteeindividualEmail : null,
        TrusteeindividualSignatory : null,
        TrusteeindividualDateOfBirth : null,
        TrusteeindividualMobile : null,
        TrusteeindividualAreaCode : null,
        TrusteebusinessContactType : null,
        TrusteebusinessLegalName : null,
        // businessTradingName : null,
        TrusteebusinessPhoneNumber : null,
        TrusteebusinessEmail : null,
        TrusteebusinessSignatory : null,
        // businessDateOfBirth : null,
        TrusteebusinessMobile : null,
        TrusteebusinessAreaCode : null,
        individualeSignatoryId: 0,
        individualSigningOrder: -1,
        businesseSignatoryId: 0,
        businessSigningOrder: -1,
        TrusteeindividualeSignatoryId: 0,
        TrusteeindividualSigningOrder: -1,
        TrusteebusinesseSignatoryId: 0,
        TrusteebusinessSigningOrder: -1,
    })
 
  }
 
}

  closeDialog(btnType: "submit" | "cancel") {
    const isViewMode =
      this.modalType === "view" || this.modalType === "customerView";

    if (btnType === "cancel" && isViewMode) {
      // const confirmCancel = window.confirm(
      //   "Are you sure you want to cancel? Unsaved changes will be lost."
      // );
      // if (!confirmCancel) return;
      this.svc.ui.showOkDialog("Are you sure you want to cancel? Unsaved changes will be lost.",
        "",
        () => {
     
        this.svc.dialogSvc.ref.close({
          btnType: btnType,
        });
      },
       () => {     
      }
      )
    }
    else{
    this.svc.dialogSvc.ref.close({
      btnType: btnType,
    });
  }
  }

  async AddOrUpdateSignatories() {
     this.mainForm.form.markAllAsTouched();

    if (this.modalType == "view") {
   
      this.creatOrUpdateContact();
    }
    else if(this.modalType == "customerView"){
      this.updateCustomerSignatory();
    }
    else{
 
    
      let updatedFields:any;
      if (this.searchType == "Individual") {
     
      updatedFields = {
        customerContactId: this.rowData?.customerContactId || 0,
        contactPartyId: this.rowData?.contactPartyId || -1,
        contactPartyNo: this.rowData?.contactPartyNo || -1,
        customerId: this.addNewContactCustomerId,
        customerNo: this.addNewContactcustomerNo,
        firstName: this.baseFormData?.individualFirstName,
        lastName: this.baseFormData?.individualLastName,
        customerName:
          this.baseFormData?.individualFirstName +
          " " +
          this.baseFormData?.individualLastName,
        phoneExt: this.baseFormData?.individualMobile,
        areaCode: this.baseFormData?.individualAreaCode,
        phoneNo: this.baseFormData?.individualPhoneNumber,
        email: this.baseFormData?.individualEmail,
        dateofBirth: this.baseFormData?.individualDateOfBirth|| null,
        classification: this.searchType,
        contactType: this.baseFormData?.individualContactType,
        contactOwnerRole: this.baseFormData?.individualRole,
        isSignatory: this.baseFormData?.individualSignatory || false,
        esignatoryDetails: {
          eSignatoryId:  0,
          signingOrder: this.baseFormData?.individualSigningOrder ? this.baseFormData?.individualSigningOrder : -1 ,
          // groupSigningOrder: this.rowData?.esignatoryDetails?.groupSigningOrder,
          // eSignatoryRole: this.rowData?.esignatoryDetails?.eSignatoryRole,
        },
      };
       }

      if(this.searchType == "Business"){

       updatedFields = {
        customerContactId: this.rowData?.customerContactId || 0,
        contactPartyId: this.rowData?.contactPartyId || -1,
        contactPartyNo: this.rowData?.contactPartyNo ||-1,
        customerId: this.addNewContactCustomerId,
        customerNo: this.addNewContactcustomerNo,
        firstName: "",
        lastName: "",
        customerName: this.baseFormData?.businessLegalName,
        phoneExt: this.baseFormData?.businessMobile,
        areaCode: this.baseFormData?.businessAreaCode,
        phoneNo: this.baseFormData?.businessPhoneNumber,
        email: this.baseFormData?.businessEmail,
        // dateofBirth: "",
        classification: this.searchType,
        contactType: this.baseFormData?.businessContactType,
        contactOwnerRole: this.baseFormData?.businessRole,
        isSignatory: this.baseFormData?.businessSignatory || false,
        esignatoryDetails: {
          eSignatoryId: 0,
          signingOrder: this.baseFormData?.businessSigningOrder ? this.baseFormData?.businessSigningOrder : -1,
          // groupSigningOrder: this.rowData?.esignatoryDetails?.groupSigningOrder,
          // eSignatoryRole: this.rowData?.esignatoryDetails?.eSignatoryRole,
        },
      };
       }

       if(this.mainForm?.form?.valid){
      this.svc.data.post(`CustomerDetails/add_contactDetails?contractId=${this.signatoriesData[0].contractId} `, updatedFields).subscribe((res)=>{
      this.svc?.dialogSvc?.ref?.close({
         data: res
       })
     })
    }
   }
 }

  creatOrUpdateContact() {
    let updatedFields: any;
    if (this.searchType == "Individual") {
      updatedFields = {
        customerContactId: this.rowData?.customerContactId,
        contactPartyId: this.rowData?.contactPartyId,
        contactPartyNo: this.rowData?.contactPartyNo,
        customerId: this.rowData?.customerId,
        customerNo: this.rowData?.customerNo,
        firstName: this.baseFormData?.individualFirstName,
        lastName: this.baseFormData?.individualLastName,
        customerName:
          this.baseFormData?.individualFirstName +
          " " +
          this.baseFormData?.individualLastName,
        phoneExt: this.baseFormData?.individualMobile,
        areaCode: this.baseFormData?.individualAreaCode,
        phoneNo: this.baseFormData?.individualPhoneNumber,
        email: this.baseFormData?.individualEmail,
        dateofBirth: this.baseFormData?.individualDateOfBirth|| null,
        classification: this.searchType,
        contactType: this.baseFormData?.individualContactType,
        contactOwnerRole: this.baseFormData?.individualRole,
        isSignatory: this.baseFormData?.individualSignatory,
        esignatoryDetails: {
          eSignatoryId: this.rowData?.esignatoryDetails?.eSignatoryId,
          signingOrder: this.baseFormData?.individualSigningOrder ? this.baseFormData?.individualSigningOrder : this.rowData?.signingOrder ,
          groupSigningOrder: this.rowData?.esignatoryDetails?.groupSigningOrder,
          eSignatoryRole: this.rowData?.esignatoryDetails?.eSignatoryRole,
        },
      };
      if(!updatedFields.esignatoryDetails.signingOrder){
        updatedFields.esignatoryDetails.signingOrder = -1
      }
    }

    if(this.searchType == "Business"){

       updatedFields = {
        customerContactId: this.rowData?.customerContactId,
        contactPartyId: this.rowData?.contactPartyId,
        contactPartyNo: this.rowData?.contactPartyNo,
        customerId: this.rowData?.customerId,
        customerNo: this.rowData?.customerNo,
        firstName: "",
        lastName: "",
        customerName: this.baseFormData?.businessLegalName,
        phoneExt: this.baseFormData?.businessMobile,
        areaCode: this.baseFormData?.businessAreaCode,
        phoneNo: this.baseFormData?.businessPhoneNumber,
        email: this.baseFormData?.businessEmail,
        // dateofBirth: "",
        classification: this.searchType,
        contactType: this.baseFormData?.businessContactType,
        contactOwnerRole: this.baseFormData?.businessRole,
        isSignatory: this.baseFormData?.businessSignatory,
        esignatoryDetails: {
          eSignatoryId: this.rowData?.esignatoryDetails?.eSignatoryId,
          signingOrder: this.baseFormData?.businessSigningOrder ? this.baseFormData?.businessSigningOrder : this.rowData?.signingOrder,
          groupSigningOrder: this.rowData?.esignatoryDetails?.groupSigningOrder,
          eSignatoryRole: this.rowData?.esignatoryDetails?.eSignatoryRole,
        },
      };
        if(!updatedFields.esignatoryDetails.signingOrder){
        updatedFields.esignatoryDetails.signingOrder = -1
      }
    }

    if(this.mainForm?.form?.valid){
    this.svc.data.update(`CustomerDetails/update_contactDetails?contractId=${this.config?.data?.contractId}`, updatedFields).subscribe((res)=>{
      this.svc?.dialogSvc?.ref?.close({
      data: res
    });
    })
  }
   
  
  }

  updateCustomerSignatory(){
    let updateFields:any

    if(this.searchType == "Individual"){
    updateFields={
    contractId: this.rowData?.contractId,
    customerNo: this.rowData?.customerNo,
    customerId: this.rowData?.customerId,

    customerName: this.rowData?.customerName,
    customerRole: this.rowData?.customerRole,
    roleName: this.rowData?.roleName,
    classification: this.rowData?.classification,
    contactType: this.rowData?.contactType ,
    firstName: this.rowData?.firstName ,
    lastName: this.rowData?.lastName,
    dateOfBirth: this.rowData?.dateOfBirth,
    phoneExt: this.rowData?.phoneExt ,
    areaCode: this.rowData?.areaCode,
    phoneNo: this.rowData?.phoneNo,
    email: this.rowData?.email,
    contact: null,
    esignatoryDetails: {
          eSignatoryId: this.rowData?.esignatoryDetails?.eSignatoryId || 0,
          signingOrder: this.baseFormData?.individualPartySigningOrder ? this.baseFormData?.individualPartySigningOrder : this.rowData?.esignatoryDetails?.signingOrder ,
          groupSigningOrder: this.rowData?.esignatoryDetails?.groupSigningOrder,
          eSignatoryRole: this.rowData?.esignatoryDetails?.eSignatoryRole,
      },
    isCustomerSignatory: this.baseFormData?.individualPartySignatory||false
    
  }
      if(!updateFields.esignatoryDetails.signingOrder){
        updateFields.esignatoryDetails.signingOrder = -1
      }
    }
    if(this.searchType == "Business"){
    updateFields={
    contractId: this.rowData?.contractId,
    customerNo: this.rowData?.customerNo,
    customerId: this.rowData?.customerId,
  
    customerName: this.rowData?.customerName,
    customerRole: this.rowData?.customerRole,
    roleName: this.rowData?.roleName,
    classification: this.rowData?.classification,
    contactType: this.rowData?.contactType,
    firstName: this.rowData?.firstName ,
    lastName: this.rowData?.lastName,
    // dateOfBirth: this.rowData?.dateOfBirth,
    phoneExt: this.rowData?.phoneExt ,
    areaCode: this.rowData?.areaCode,
    phoneNo: this.rowData?.phoneNo,
    email: this.rowData?.email,
    contact: null,
    esignatoryDetails: {
          eSignatoryId: this.rowData?.esignatoryDetails?.eSignatoryId || 0,
          signingOrder: this.baseFormData?.businessPartySigningOrder ? this.baseFormData?.businessPartySigningOrder : this.rowData?.esignatoryDetails?.signingOrder ,
          groupSigningOrder: this.rowData?.esignatoryDetails?.groupSigningOrder,
          eSignatoryRole: this.rowData?.esignatoryDetails?.eSignatoryRole,
    },
    isCustomerSignatory: this.baseFormData?.businessPartySignatory || false,
   }
     if(!updateFields.esignatoryDetails.signingOrder){
        updateFields.esignatoryDetails.signingOrder = -1
      }
  }


  if(this.mainForm?.form?.valid){
  if(!this.rowData?.isCustomerSignatory){
  this.svc.data.post(`CustomerDetails/add_customerEsignatory`, updateFields).subscribe((res)=>{
        this.ref.close({
         // action: "editContact",
         data : res
        });
   })
  }

else{

  this.svc.data.update(`CustomerDetails/update_customerEsignatory`, updateFields).subscribe((res)=>{
        this.ref.close({
         // action: "editContact",
         data : res
        });
       })
     }
   }

  }

  edit() {
    if(configure?.workflowStatus?.view?.includes(this.baseFormData?.AFworkflowStatus)){
      return;
    }
    this.isEditEnabled = !this.isEditEnabled;
    if (this.isEditEnabled) {
      this.mainForm?.form?.enable();
      this.mainForm?.updateProps("individualSignatory", { mode: Mode.edit });
      this.mainForm?.updateProps("individualPartySignatory", {
        mode: Mode.edit,
      });
      this.mainForm?.updateProps("businessPartySignatory", { mode: Mode.edit });
      this.mainForm?.updateProps("businessSignatory", { mode: Mode.edit });
    } else {
      this.mainForm?.updateProps("individualSignatory", { mode: Mode.view });
      this.mainForm?.updateProps("individualPartySignatory", {
        mode: Mode.view,
      });
      this.mainForm?.updateProps("businessPartySignatory", { mode: Mode.view });
      this.mainForm?.updateProps("businessSignatory", { mode: Mode.view });
      this.mainForm?.form?.disable();
    }
    if (this.modalType == "view" || this.modalType == "customerView") {
      // this.mainForm?.get("individualCustomerName")?.disable();
      // this.mainForm?.get("individualRole")?.disable();
      // this.mainForm?.get("businessCustomerName")?.disable();
      // this.mainForm?.get("businessRole")?.disable();

      this.controlsToDisable.forEach((name) =>
        this.mainForm?.get(name)?.disable()
      );
    }
  }

  override ngOnDestroy(): void {
    if (this.parent == "Signatories") {
      Object.keys(this.baseFormData).forEach((key) => {
        // this.baseFormData[key] = "";
        this.baseFormData[key] = null;
      });
      super.ngOnDestroy();
    }
  }

  pageCode: string = "CustomerTypeComponent";
  modelName: string = "CustomerTypeComponent";

  override async onFormEvent(event: any): Promise<void> {
    if (this.parent == "Signatories") {
     
      if (
        event.name == "individualSignatory" ||
        event.name == "businessSignatory" ||
        event.name == "individualPartySignatory" ||
        event.name == "businessPartySignatory"
      ) {
        if (event.value) {
          this.mainForm?.updateProps("individualSigningOrder", {
            mode: Mode.edit,
          });
          this.mainForm?.updateProps("businessSigningOrder", {
            mode: Mode.edit,
          });
          this.mainForm?.updateProps("individualPartySigningOrder", {
            mode: Mode.edit,
          });
          this.mainForm?.updateProps("businessPartySigningOrder", {
            mode: Mode.edit,
          });
          

          if(this.rowData?.isCustomerSignatory || this.rowData?.isSignatory){
              this.mainForm?.get("individualPartySigningOrder")?.setValidators([Validators.required,Validators.min(1),Validators.max(this.maxSigningOrder)])
              this.mainForm?.get("businessPartySigningOrder")?.setValidators([Validators.required,Validators.min(1),Validators.max(this.maxSigningOrder)])
              this.mainForm?.get("individualSigningOrder")?.setValidators([Validators.required,Validators.min(1),Validators.max(this.maxSigningOrder)])
              this.mainForm?.get("businessSigningOrder")?.setValidators([Validators.required,Validators.min(1),Validators.max(this.maxSigningOrder)])
    
              this.mainForm?.updateProps("individualPartySigningOrder", {errorMessage: `Signing order must be between 1 and ${this.maxSigningOrder}`})
              this.mainForm.get("individualPartySigningOrder")?.updateValueAndValidity();
              this.mainForm?.updateProps("businessPartySigningOrder", {errorMessage: `Signing order must be between 1 and ${this.maxSigningOrder}`})
              this.mainForm.get("businessPartySigningOrder")?.updateValueAndValidity();
              this.mainForm?.updateProps("individualSigningOrder", {errorMessage: `Signing order must be between 1 and ${this.maxSigningOrder}`})
              this.mainForm.get("individualSigningOrder")?.updateValueAndValidity();
              this.mainForm?.updateProps("businessSigningOrder", {errorMessage: `Signing order must be between 1 and ${this.maxSigningOrder}`})
              this.mainForm.get("businessSigningOrder")?.updateValueAndValidity();
           }
           else{
              this.mainForm?.get("individualPartySigningOrder")?.setValidators([Validators.required,Validators.min(1),Validators.max(this.maxSigningOrder+1)])
              this.mainForm?.get("businessPartySigningOrder")?.setValidators([Validators.required,Validators.min(1),Validators.max(this.maxSigningOrder+1)])
              this.mainForm?.get("individualSigningOrder")?.setValidators([Validators.required,Validators.min(1),Validators.max(this.maxSigningOrder+1)])
              this.mainForm?.get("businessSigningOrder")?.setValidators([Validators.required,Validators.min(1),Validators.max(this.maxSigningOrder+1)])

              this.mainForm?.updateProps("individualPartySigningOrder", {errorMessage: `Signing order must be between 1 and ${this.maxSigningOrder + 1}`})
              this.mainForm.get("individualPartySigningOrder")?.updateValueAndValidity();
              this.mainForm?.updateProps("businessPartySigningOrder", {errorMessage: `Signing order must be between 1 and ${this.maxSigningOrder + 1}`})
              this.mainForm.get("businessPartySigningOrder")?.updateValueAndValidity();
              this.mainForm?.updateProps("individualSigningOrder", {errorMessage: `Signing order must be between 1 and ${this.maxSigningOrder + 1}`})
              this.mainForm.get("individualSigningOrder")?.updateValueAndValidity();
              this.mainForm?.updateProps("businessSigningOrder", {errorMessage: `Signing order must be between 1 and ${this.maxSigningOrder + 1}`})
              this.mainForm.get("businessSigningOrder")?.updateValueAndValidity();
            }
        } else {
          this.mainForm?.updateProps("individualSigningOrder", {
            mode: Mode.view,
          });
          this.mainForm?.form?.get("individualSigningOrder")?.patchValue(null);
          this.mainForm?.updateProps("businessSigningOrder", {
            mode: Mode.view,
          });
          this.mainForm?.form?.get("businessSigningOrder")?.patchValue(null);

          this.mainForm?.updateProps("individualPartySigningOrder", {
            mode: Mode.view,
          });
          this.mainForm?.form
            ?.get("individualPartySigningOrder")
            ?.patchValue(null);
          this.mainForm?.updateProps("businessPartySigningOrder", {
            mode: Mode.view,
          });
          this.mainForm?.form?.get("businessPartySigningOrder")?.patchValue(null);

          this.mainForm?.get("individualPartySigningOrder")?.clearValidators();
          this.mainForm?.get("businessPartySigningOrder")?.clearValidators();
          this.mainForm?.get("individualSigningOrder")?.clearValidators();
          this.mainForm?.get("businessSigningOrder")?.clearValidators();
        }
         
      }

      if(event.name == "individualCustomerName" || event.name == "businessCustomerName"){
        this.onCustomerChange(event.value);
      }
      
    }

    if (
      event?.name == "individualSignatory" ||
      event?.name == "businessSignatory" ||
      event?.name == "TrusteeindividualSignatory" ||
      event?.name == "TrusteebusinessSignatory"||
      event?.name == "individualPartySignatory" ||
      event?.name == "businessPartySignatory" 

    ) {
      await this.updateValidation("onInit");
    }
    // await this.updateValidation(event);
    super.onFormEvent(event);
  }

  override async onBlurEvent(event): Promise<void> {
    await this.updateValidation("onInit");
  }


  override async onValueTyped(event: any): Promise<void> {
    await this.updateValidation("onInit");
  }

  override async onValueEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

   override async onValueChanges(event: any): Promise<void> {
    //  if(!this.config.data?.editReference && (this.baseFormData?.TrusteeindividualDateOfBirth || this.baseFormData?.individualDateOfBirth)){
    //   this.mainForm.form?.get("individualDateOfBirth")?.patchValue(new Date(this.baseFormData?.individualDateOfBirth))
    //   this.mainForm.form?.get("TrusteeindividualDateOfBirth")?.patchValue(new Date(this.baseFormData?.TrusteeindividualDateOfBirth))
    // }
 
    // await this.updateValidation("onInit");
  }

  // override async onFormDataUpdate(res : any): Promise<void> {
  //   await this.updateValidation("onInit");
  //   super.onFormDataUpdate(res)
  // }

  async updateValidation(event) {
    const req = {
      form: this.mainForm?.form,
      formConfig: this.formConfig1,
      event: event,
      modelName: this.modelName,
      pageCode: this.pageCode,
    };

    const responses = await this.validationSvc.updateValidation(req);
    // console.log("responses: ",responses)
    if (!responses.status && responses.updatedFields.length) {
      await this.mainForm.applyValidationUpdates(responses);
    }
    
    return responses.status;
  }

 // override onStepChange(stepperDetails: any): void {
 // this.indSvc.updateComponentStatus("Reference Details", "individualCustomerType", this.mainForm.form.valid)
 // this.indSvc.updateComponentStatus("Reference Details", "businessCustomerType", this.mainForm.form.valid)

  //}
}
