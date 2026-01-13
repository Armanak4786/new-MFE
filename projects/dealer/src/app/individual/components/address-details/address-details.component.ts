import { ChangeDetectorRef, Component, SimpleChanges } from "@angular/core";
import { BaseIndividualClass } from "../../base-individual.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig } from "auro-ui";
import { IndividualService } from "../../services/individual.service";
import { Validators } from "@angular/forms";
import { takeUntil } from "rxjs";
import { ToasterService, ValidationService } from "auro-ui";
import { SearchAddressService } from "../../../standard-quote/services/search-address.service";

@Component({
  selector: "app-address-details",
  templateUrl: "./address-details.component.html",
  styleUrl: "./address-details.component.scss",
})
export class AddressDetailsComponent extends BaseIndividualClass {
  optionsdata = [{ label: "icashpro", valuue: "icp" }];
  copyToPreviousAddress: boolean = false;
  copyFromborrowerAddress: boolean = false;
  Operation: boolean = false;
  year: boolean = false;
  params: any;
  role:any;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: IndividualService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef,
    private searchAddressService: SearchAddressService
  ) {
    super(route, svc, baseSvc);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();

    // this.baseSvc
    //   .getBaseDealerFormData()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((res) => {
    //     // if (res.copyToPreviousAddress != this.copyToPreviousAddress) {
    //     //   this.copyToPreviousAddress = res?.copyToPreviousAddress;
    //     // }
    //     if (res.physicalYear || res.physicalMonth) {
    //       this.year = (Number(res?.physicalYear) * 12 + Number(res?.physicalMonth)) < 36 ? true : false
    //       console.log('this.year',this.year)
    //     }
    //   });

      this.baseSvc.previousAddressHiddenStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.year = res;
        
      });
        
    this.params = this.route.snapshot.params;
    
    this.role = this.baseFormData.role;  
    this.copyToPreviousAddress = this.baseFormData?.copyToPreviousAddress;
  }

  getvalue(event) {
    this.baseSvc?.setBaseDealerFormData({
      copyToPreviousAddress: event,
    });

    if (event) {
      this.baseSvc.reusePhysicalAsPrevious.next("copied");
    } else if (!event) {
      

      this.baseSvc.reusePhysicalAsPrevious.next("undoCopy");
    }
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (
  //     this.mainForm?.form &&
  //     changes['copyToPreviousAddress'].currentValue !=
  //       changes['copyToPreviousAddress'].previousValue
  //   ) {
  //     this.mainForm.form
  //       .get('copyToPreviousAddress')
  //       .patchValue(changes['copyToPreviousAddress'].currentValue);
  //   }

  //   else if (
  //     this.mainForm?.form &&
  //     changes['copyFromborrowerAddress'].currentValue !=
  //       changes['copyFromborrowerAddress'].previousValue
  //   ) {
  //     this.mainForm.form
  //       .get('copyFromborrowerAddress')
  //       .patchValue(changes['copyFromborrowerAddress'].currentValue);
  //   }

  // }
  override async onSuccess(data: any) { }

  override async onFormEvent(event: any): Promise<void> {
    if (event?.name == 'copyFromborrowerAddress') {
      let params: any = this.route.snapshot.params;
      if (this.copyFromborrowerAddress && (params.contractId || this?.baseFormData?.contractId)) {
        let customerNo = await this.baseSvc.getFormData(
          `CustomerDetails/get_contractSummery?ContractId=${params.contractId || this?.baseFormData?.contractId}`,
          (res) => {
            if (res.data && Array.isArray(res.data)) {
              let obj = res.data?.find((ele) => { return ele?.customerRole == 1 });
              return obj?.customerNo;
            }
          }
        );
        if (customerNo) {
          const customerUrl = `CustomerDetails/get_customer?customerNo=${customerNo}&contractId=${params.contractId || this?.baseFormData?.contractId}`;
          const individualCustomer = await this.baseSvc.getFormData(customerUrl, (res) => res?.data || null);

          const addressData = individualCustomer.addressDetails.find(
            (a) => a.addressType === 'Street' && a.isCurrent
          );
          if (addressData) {
            const mapped = this.searchAddressService.mapAddressJsonToFormControls({ data: addressData }, 'physical');
            this.searchAddressService.setPhysicalAddressData(mapped);
          }
        }
      } else {
        this.searchAddressService.setPhysicalAddressData(null);
      }
    }

    super.onFormEvent(event);
  }
  eventCall(event) {
  }

  pageCode: string = "AddressDetailsComponent";
  modelName: string = "AddressDetailsComponent";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();
  }

  override async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  override async onValueEvent(event): Promise<void> {
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

    const responses = await this.validationSvc.updateValidation(req);
    if (!responses.status && responses.updatedFields.length) {
      await this.mainForm.applyValidationUpdates(responses);
    }

    return responses.status;
  }

  override async onStepChange(quotesDetails: any): Promise<void> {
    super.onStepChange(quotesDetails);
    if (quotesDetails.type !== "tabNav") {
      var result: any = await this.updateValidation("onSubmit");
      // if (!result?.status) {
      //   this.toasterSvc.showToaster({
      //     severity: "error",
      //     detail: "I7",
      //   });
      // }
    }
  }
}
