import { ChangeDetectorRef, Component } from '@angular/core';
import {
  BaseFormClass,
  CloseDialogData,
  CommonService,
  GenericFormConfig,
  Mode,
  ToasterService,
} from 'auro-ui';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonApiService } from '../../../services/common-api.service';
import { ServiceRequestBody } from '../../../utils/common-interface';
// import {  DynamicDialogRef } from 'primeng/dynamicdialog';
import { CancelPopupComponent } from '../../../reusable-component/components/cancel-popup/cancel-popup.component';
import { PartyDetailsAcknowledgementComponent } from '../../../reusable-component/components/party-details-acknowledgement/party-details-acknowledgement.component';
import { AddressNotFoundPopupComponent } from '../../../reusable-component/components/address-not-found-popup/address-not-found-popup.component';

@Component({
  selector: 'app-update-address-details',
  templateUrl: './update-address-details.component.html',
  styleUrls: ['./update-address-details.component.scss'],
})
export class UpdateAddressDetailsComponent extends BaseFormClass {
  searchType: any = 'physical';
  physical: any;
  mailing: any;
  addressData: any;
  addressList: any[] = [];
  countryListData = [];
  floorListData = [];
  streetTypeData = [];
  fieldBorder: string;
  addressCheck: boolean = false;
  isMobile: boolean = false;
  cityListData: any[];
  addresses: { [key: string]: any } = {};
  addressDetails: any = {};
  personalData;
  isIndividual;
  // @Output() formSubmit = new EventEmitter<boolean>();
  updateAddressRequest: ServiceRequestBody;
  partyNo: any;
  override formConfig: GenericFormConfig = {
    autoResponsive: true,
    api: 'addressDetail',
    goBackRoute: '',
    cardType: 'non-border',
    fields: [
      // {
      //   type: 'text',
      //   label: 'lbl_search',
      //   name: 'physicalSearchValue',
      //   className: 'col-12 sm:col-6 md:col-2 lg:col-2 mb-5 mr-6',
      //   cols: this.isMobile ? 12 : 2,
      //   rightIcon: true,
      //   inputType: 'vertical',
      // },
      {
        type: 'text',
        label: 'Search',
        mode: Mode.label,
        name: 'search',
        cols: 3,
        className: 'text-sm',
        // className: " text-sm sm:col-6 md:col-3 lg:col-3 ",
        nextLine: true,
        labelClass: 'font-semibold',
      },
      {
        type: 'autoSelect',
        placeholder: 'Search for address results',
        name: 'physicalSearchValue',
        label: '',
        idKey: 'street',
        cols: 3,
        options: [],
        className: 'mb-5 sm:col-6 md:col-6 lg:col-3',
        // className: "mb-5 w-full sm:col-6 md:col-6 lg:col-3",
        nextLine: this.isMobile ? true : false,
      },
      // {
      //   type: "toggle",
      //   label: "lbl_posAddResidental",
      //   name: "addressCheck",
      //   default: false,
      //   cols: this.isMobile ? 12 : 3,
      //   alignmentType: "vertical",
      //   // className: "col-12 sm:col-6 md:col-8 lg:col-6",
      //   onLabel: "",
      //   offLabel: "",
      //   nextLine: true,
      // },
      {
        type: 'toggle',
        label: 'lbl_posAddResidental',
        name: 'addressCheck',
        // className: this.isMobile ? 'mb-2 ml-2 rss-grey' : "lg:col-offset-1 pl-0 mt-3 ml-3 rss-grey",
        offLabel: '',
        onLabel: '',
        default: false,
        cols: 4,
        className: 'ml-4 mt-2 col-12 sm:col-12 md:col-6 lg:col-4',
        nextLine: true,
        labelClass: 'font-semibold',
      },
      {
        type: 'textArea',
        label: 'Type Address Manually',
        name: 'address',
        className: 'col-12 sm:col-6 md:col-12 lg:col-12 mb-2 w-full',
        cols: 3,
        nextLine: true,
        inputType: 'vertical',
        labelClass: 'font-semibold',
        // validators: [Validators.required]
      },
      {
        type: 'textArea',
        label: 'notes',
        name: 'notes',
        // className: 'col-12 sm:col-6 md:col-12 lg:col-12 mb-6 w-full',
        className: 'col-12 sm:col-6 md:col-12 lg:col-12 mb-6 ',
        cols: 3,
        nextLine: false,
        inputType: 'vertical',
        labelClass: 'font-semibold',
      },
    ],
  };

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public toasterSvc: ToasterService,
    // public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef,
    public router: Router,
    private commonSetterGetterService: CommonSetterGetterService,
    public commonApiService: CommonApiService // public ref:DynamicDialogRef
  ) {
    super(route, svc);
  }
  override async ngOnInit() {
    this.commonSetterGetterService.party$.subscribe((currentParty) => {
      this.partyNo = currentParty?.id;
    });
    this.commonSetterGetterService.customerDetails$.subscribe((details) => {
      this.personalData = details;
    });
    this.commonSetterGetterService.address$.subscribe((add) => {
      this.addressData = add;
      this.isIndividual = add?.isIndividualParty;
    });
    this.setAddressData('physicalAddress');
    // this.getAddress();
  }

  override onValueChanges(event: any): void {
    if (event?.physicalSearchValue && event?.physicalSearchValue?.length >= 4) {
      this.fetchSearchAddress(event?.physicalSearchValue);
    }
    if (event.addressCheck === 'true') {
      this.mainForm?.form?.get('addressCheck').patchValue(true);
    }
  }
  async fetchSearchAddress(physicalSearchValue) {
    const data = await this.commonApiService.getSearchAddress(
      physicalSearchValue
    );
    if (!data?.items || data.items.length === 0) {
      this.svc.dialogSvc
        .show(AddressNotFoundPopupComponent, ' ', {
          templates: {
            footer: null,
          },
          data: data?.data?.taskId,
          width: '30vw',
        })
        .onClose.subscribe((data: any) => {});
    } else {
      this.addressList = data.items;
      this.mainForm?.updateList('physicalSearchValue', data.mapped);
    }
  }

  async fetchExternalAddressLookUp(externalAddressLookupKey) {
    const fullAddress =
      await this.commonApiService.postExternalAddressLookupKey(
        externalAddressLookupKey
      );
    this.mainForm?.form?.get('address')?.patchValue(fullAddress);
  }

  setAddressData(type) {
    if (type === 'registeredAddress') {
      this.mainForm?.updateProps('addressCheck', {
        label: 'lbl_regAddResidental',
      });
    } else {
      this.mainForm?.updateProps('addressCheck', {
        label: 'lbl_posAddResidental',
      });
    }
    this.addressDetails = this.addressData?.[type];
  }

  async postAddressTask() {
    let currentAddressType = '';
    let addressFlag: any = {};

    switch (this.searchType) {
      case 'physicalAddress':
        currentAddressType = 'physicalAddress';
        addressFlag = { physicalAddress: true };
        break;

      case 'postalAddress':
        currentAddressType = 'postalAddress';
        addressFlag = { postalAddress: true };
        break;

      case 'registeredAddress':
        currentAddressType = 'registeredAddress';
        addressFlag = { registeredAddress: true };
        break;

      default:
        console.warn('Unknown address type:', this.searchType);
        break;
    }

    this.updateAddressRequest = {
      party: {
        partyNo: this.partyNo,
      },
      subject: '',
      status: 'Not Started',
      comments: '',
      taskType: 'Self Service Request',
      externalData: {
        subjectLine: ``,
        serviceRequestCss: {
          category: {
            updateAddressDetails: {
              currentAddress: this.addressData[currentAddressType],
              updatedAddress: this.mainForm?.get('address').value,
              notes: this.mainForm?.get('notes').value,
              isSameEmailAndResidentialAddress:
                this.mainForm?.get('addressCheck').value || false,
              ...addressFlag,
            },
          },
        },
      },
    };
    const statusInvalid = this.validate();
    if (statusInvalid === 'VALID') {
      const response = await this.commonApiService.postTaskRequest(
        this.updateAddressRequest
      );

      this.svc.dialogSvc
        .show(PartyDetailsAcknowledgementComponent, ' ', {
          templates: {
            footer: null,
          },
          data: response?.taskId,
          width: '50vw',
        })
        .onClose.subscribe((data: any) => {
          this.svc.router.navigateByUrl('/dashboard/update-party-details');
        });
    }
  }

  onCancel() {
    this.svc.dialogSvc
      .show(CancelPopupComponent, '', {
        templates: {
          footer: null,
        },
        data: '',
        width: '30vw',
        height: '16vw',
      })
      .onClose.subscribe((data: any) => {
        if (data?.data == 'cancel') {
          // this.ref.close();
          this.svc.router.navigateByUrl('/dashboard/update-party-details');
        }
      });
  }
  override async onBlurEvent(event): Promise<void> {
    if (event.name == 'physicalSearchValue') {
      let matched = this.addressList?.find(
        (obj) => obj?.addressId === event?.value?.value
      );
      this.fetchExternalAddressLookUp(matched?.externalAddressLookupKey);
    }
  }
}
