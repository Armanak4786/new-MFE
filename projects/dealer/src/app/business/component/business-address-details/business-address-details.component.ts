import { ChangeDetectorRef, Component, SimpleChanges } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig } from "auro-ui";
import { BusinessService } from "../../services/business";
import { BaseBusinessClass } from "../../base-business.class";
import { takeUntil } from "rxjs";
import { ToasterService, ValidationService } from "auro-ui";
import { SearchAddressService } from "../../../standard-quote/services/search-address.service";

@Component({
  selector: "app-business-address-details",
  templateUrl: "./business-address-details.component.html",
  styleUrl: "./business-address-details.component.scss",
})
export class BusinessAddressDetailsComponent extends BaseBusinessClass {
  copyToPreviousAddress: any;
  borrowedAmount: any;
  copyFromborrowerAddress: boolean = false;
  params: any;
  year: any;
  role: any;
  sendYearForPrevious: boolean;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: BusinessService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef,
    private searchAddressService: SearchAddressService
  ) {
    super(route, svc, baseSvc);
  }
override async ngOnInit(): Promise<void> {
  await super.ngOnInit(); // Call parent class initialization first
  this.baseSvc
    .getBaseDealerFormData()
    .pipe(takeUntil(this.destroy$))
    .subscribe((res) => {
        // if (res.copyToPreviousAddress != this.copyToPreviousAddress) {
        //   this.copyToPreviousAddress = res.copyToPreviousAddress;
        // }
        // if (res?.physicalYear || res?.physicalMonth) {
        //   this.year = (Number(res?.physicalYear) * 12 + Number(res?.physicalMonth)) < 36 ? true : false
        // }
      this.role = res?.role;
    });

  // Subscribe to previousAddressHiddenStatus observable
  // This updates when physical address duration < 36 months
  this.baseSvc.previousAddressHiddenStatus$
    .pipe(takeUntil(this.destroy$))
    .subscribe((res) => {
      this.year = res;
       
    });

  // Get route parameters
  this.params = this.route.snapshot.params;
  // Initialize role and copyToPreviousAddress from baseFormData
  this.role = this.baseFormData?.role;  
  this.copyToPreviousAddress = this.baseFormData?.copyToPreviousAddress;
  // This ensures the previous address component shows up immediately if data exists
  if (this.baseFormData?.previousTextArea) {
    // Previous address exists from API, no need to set year
    // The HTML template will show the component based on baseFormData?.previousTextArea
  }
}

  receiveData($event) {
    this.year = $event;
  }
  getvalue(event) {
    this.baseSvc?.setBaseDealerFormData({
      copyToPreviousAddress: event,
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.mainForm?.form &&
      changes["copyToPreviousAddress"].currentValue !=
        changes["copyToPreviousAddress"].previousValue
    ) {
      this.mainForm.form
        .get("copyToPreviousAddress")
        .patchValue(changes["copyToPreviousAddress"].currentValue);
    }
  }

  override async onFormEvent(event: any): Promise<void> {
    // if (this.copyFromborrowerAddress) {
    //   const params = this.baseSvc.copyBorrowerAddress.value;
    //   if(params.customerNo && params.contractId){
    //   const customerUrl = `CustomerDetails/get_customer?customerNo=${params.customerNo}&contractId=${params.contractId}`;
    //   const businessCustomer = await this.baseSvc.getFormData(customerUrl, (res) => res?.data || null);

    //   const addressData = businessCustomer.addressDetails.find(
    //     (a) => a.addressType === 'Street' && a.isCurrent
    //   );

    //   console.log(this.baseFormData)
    //   if (addressData) {
    //     const mapped = this.searchAddressService.mapAddressJsonToFormControls({ data: addressData }, 'physical');
    //     this.searchAddressService.setPhysicalAddressData(mapped);
    //   }
    // }

    // }else{
    //   this.searchAddressService.setPhysicalAddressData(null);
    // }
    if (this.copyFromborrowerAddress) {
      let params: any = this.route.snapshot.params;
      let customerNo = await this.baseSvc.getFormData(
        `CustomerDetails/get_contractSummery?ContractId=${params.contractId}`,
        (res) => {
          if (res.data && Array.isArray(res.data)) {
            let obj = res.data?.find((ele) => {
              return ele?.customerRole == 1;
            });
            return obj?.customerNo;
          }
        }
      );
      if (customerNo) {
        const customerUrl = `CustomerDetails/get_customer?customerNo=${customerNo}&contractId=${params.contractId}`;
        const individualCustomer = await this.baseSvc.getFormData(
          customerUrl,
          (res) => res?.data || null
        );

        const addressData = individualCustomer.addressDetails.find(
          (a) => a.addressType === "Street" && a.isCurrent
        );
        // const addressData = individualCustomer.addressDetails.find(
        //   (a) => a.addressType === 'Street' && a.isCurrent
        // );
        // const mapped = this.searchAddressService.mapAddressJsonToFormControls({ data: addressData }, 'physical');
        // this.baseSvc?.setBaseDealerFormData(
        //   mapped
        // );
        if (addressData) {
          const mapped = this.searchAddressService.mapAddressJsonToFormControls(
            { data: addressData },
            "physical"
          );

          this.searchAddressService.setPhysicalAddressData(mapped);
        }
      }
    } else {
      this.searchAddressService.setPhysicalAddressData(null);
    }

    super.onFormEvent(event);
  }

  override async onSuccess(data: any) {}

  override onFormDataUpdate(res: any): void {}

  pageCode: string = "BusinessComponent";
  modelName: string = "BusinessAddressDetailsComponent";

  override async onFormReady(): Promise<void> {
    // await this.updateValidation("onInit");
    super.onFormReady();
  }

  override async onBlurEvent(event): Promise<void> {
    // await this.updateValidation(event);
  }

  override async onValueEvent(event): Promise<void> {
    // await this.updateValidation(event);
  }

  async updateValidation(event) {
    const req = {
      form: this.mainForm?.form,
      formConfig: this.formConfig,
      event: event,
      modelName: this.modelName,
      pageCode: this.pageCode,
    };

    const responses = await this.validationSvc.updateValidation(req);
    if (!responses.status && responses.updatedFields.length) {
      await this.mainForm.applyValidationUpdates(responses);
    }

    return responses.status;
  }

  override async onStepChange(quotesDetails: any): Promise<void> {
    super.onStepChange(quotesDetails);
    if (quotesDetails.type !== "tabNav") {
      // var result: any = await this.updateValidation("onSubmit");
      // if (!result?.status) {
      //   this.toasterSvc.showToaster({
      //     severity: "error",
      //     detail: "I7",
      //   });
      // }
    }
  }
}
