import { ChangeDetectorRef, Component } from "@angular/core";
import { Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, ToasterService, ValidationService } from "auro-ui";
import { SoleTradeService } from "../../services/sole-trade.service";
import { BaseSoleTradeClass } from "../../base-sole-trade.class";
import { SearchAddressService } from "../../../standard-quote/services/search-address.service";
import { takeUntil } from "rxjs";

@Component({
  selector: "app-sole-trade-address-details",
  templateUrl: "./sole-trade-address-details.component.html",
  styleUrl: "./sole-trade-address-details.component.scss",
})

export class SoleTradeAddressDetailsComponent extends BaseSoleTradeClass {
  // optionsdata: any[] = ["aa"];
  optionsdata = [{ label: "icashpro", valuue: "icp" }];
  privousChecked: any;
  borrowedAmount: any;
  copyToPreviousAddress: boolean = false;
  copyFromborrowerAddress: boolean = false;
  Operation: boolean = false;
  year: boolean = false;
  params: any;
  role:any;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: SoleTradeService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef,
    private searchAddressService: SearchAddressService
  ) {
    super(route, svc, baseSvc);
  }

  override title: string = "Sole Trade Address Details";

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
      console.log(event);

      this.baseSvc.reusePhysicalAsPrevious.next("undoCopy");
    }
  }
  override async onSuccess(data: any) {}

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

   pageCode: string = "SoleTradeAddressDetailsComponent";
  modelName: string = "SoleTradeAddressDetailsComponent";

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
