import { Component } from "@angular/core";
import { Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig } from "auro-ui";
import { BaseTrustClass } from "../../base-trust.class";
import { TrustService } from "../../services/trust.service";
import { IndividualService } from "../../../individual/services/individual.service";
import { SearchAddressService } from "../../../standard-quote/services/search-address.service";
import { takeUntil } from "rxjs";

@Component({
  selector: "app-trust-address-details",
  templateUrl: "./trust-address-details.component.html",
  styleUrl: "./trust-address-details.component.scss",
})
export class TrustAddressDetailsComponent extends BaseTrustClass {
  optionsdata = [{ name: "icashpro", code: "icp" }];
  copyFromborrowerAddress: boolean = false;
  copyToPreviousAddress: boolean = false;

  privousChecked: any;
  borrowedAmount: any;
  year: boolean;
  params: any
  role:any;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: TrustService,
    public individualSvc: IndividualService,
    private searchAddressService: SearchAddressService


  ) {
    super(route, svc, baseSvc);
  }

  override async ngOnInit(): Promise<void> {
    this.params = this.route.snapshot.params;
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
    //     // console.log('this.basef',res)
    //   });

    this.baseSvc.previousAddressHiddenStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.year = res;
       
      });

      this.role = this.baseFormData.role;  
       this.copyToPreviousAddress = this.baseFormData?.copyToPreviousAddress;
      
  }

  override title: string = "BUsiness Address Details";
  // override formConfig: GenericFormConfig = {
  //   headerTitle: 'Physical Address',
  //   autoResponsive: true,
  //   api: 'physicalAddress',
  //   goBackRoute: 'physicalAddress',
  //   fields: [

  //     {
  //       type: 'text',
  //       placeholder: 'Search',
  //       name:'Search',
  //       className: ' ',
  //       cols: 5,
  //       nextLine:true,
  //       rightIcon:true

  //     },
  //     {
  //       type: 'text',
  //       placeholder: 'Attention',
  //       name:'Attention',
  //       className: ' ',
  //       cols: 5,
  //       nextLine:true,

  //     },
  //     {
  //       type: 'select',
  //       label: 'Residence Type ',
  //       name: 'ResidenceType',
  //       cols: 3,
  //       //Validators: [Validators.required],
  //       nextLine: false,
  //       options: this.optionsdata,
  //     },
  //     {
  //       type: 'text',
  //       label: 'Time at address ',
  //       name: 'Timeataddress',
  //       className:' ',
  //       cols: 3,
  //       //Validators: [Validators.required],
  //       nextLine: false,

  //     },
  //     {
  //       type: 'text',
  //       label: 'Reuse for Postal Addresss ',
  //       name: 'ReuseOf',
  //       className:' ',
  //       cols: 3,
  //       //Validators: [Validators.required],
  //       nextLine: true,

  //     },
  //     {
  //       type: 'text',
  //       label: 'Building Name',
  //       name: 'buildingName',
  //       className:' ',
  //       cols: 3,
  //       //Validators: [Validators.required],
  //       nextLine: false,

  //     },
  //     {
  //       type: 'select',
  //       label: 'Unit/Floor Type',
  //       name: 'floorType',
  //       className:' ',
  //       cols: 3,
  //       options:this.optionsdata,
  //       nextLine:true
  //     },
  //     {
  //       type: 'text',
  //       label: 'Unit/Lot Number',
  //       name: 'unitNumber',
  //       className:' ',
  //       cols: 2,
  //       nextLine: false,

  //     },
  //     {
  //       type: 'text',
  //       label: 'Street Number',
  //       name: 'streetNumber',
  //       className:' ',
  //       cols: 2,
  //       nextLine: false,

  //     },

  //     {
  //       type: 'text',
  //       label: 'Street Name',
  //       name: 'streetName',
  //       className:'',
  //       cols: 2,
  //       nextLine: false,

  //     },
  //     {
  //       type: 'select',
  //       label: 'Street Type',
  //       name: 'streetType',
  //       className:'',
  //       cols: 2,
  //       nextLine: false,
  //       options:this.optionsdata,

  //     },

  //     {
  //       type: 'text',
  //       label: 'Street Direction',
  //       name: 'streetDirection',
  //       className:'',
  //       cols: 2,
  //       nextLine: false,

  //     },
  //     {
  //       type: 'text',
  //       label: 'Rural Delivery',
  //       name: 'ruralDelivery',
  //       className:'',
  //       cols: 2,
  //       nextLine: true,

  //     },
  //     {
  //       type: 'select',
  //       label: 'Suburbs',
  //       name: 'Suburbs',
  //       className:' ',
  //       cols: 2,
  //       options:this.optionsdata,
  //       nextLine:false
  //     },
  //     {
  //       type: 'select',
  //       label: 'City',
  //       name: 'city',
  //       className:' ',
  //       cols: 2,
  //       options:this.optionsdata,
  //       nextLine:false
  //     },
  //     {
  //       type: 'text',
  //       label: 'Postcode',
  //       name: 'Postcode',
  //       className:'',
  //       cols: 2,
  //       nextLine: false,

  //     },
  //     {
  //       type: 'select',
  //       label: 'Country',
  //       name: 'Country',
  //       className:' ',
  //       cols: 2,
  //       options:this.optionsdata,
  //       nextLine:false
  //     },

  //   ],
  // };

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


    if (event?.name == 'copyToPreviousAddress') {
      this.baseSvc?.setBaseDealerFormData({
        copyToPreviousAddress: event?.value,
      });
      if (event.value) {
        this.trustSvc.reusePhysicalAsPrevious.next("copied");
      } else if (!event.value) {
        this.trustSvc.reusePhysicalAsPrevious.next("undoCopy");
      }
    }
    super.onFormEvent(event);
  }

  eventCall(event) {
  }

  getvalue(event) {
    console.log("hjhgjgjgjgj");

    this.baseSvc?.setBaseDealerFormData({
      copyToPreviousAddress: event,
    });
  }
}
