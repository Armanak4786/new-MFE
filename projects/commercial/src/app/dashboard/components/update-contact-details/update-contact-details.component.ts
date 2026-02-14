import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseFormClass, CommonService, GenericFormConfig } from 'auro-ui';
import { MobileCodes } from '../../../utils/common-enum';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { CancelPopupComponent } from '../../../reusable-component/components/cancel-popup/cancel-popup.component';
import { CommonApiService } from '../../../services/common-api.service';
import { ServiceRequestBody } from '../../../utils/common-interface';
import { PartyDetailsAcknowledgementComponent } from '../../../reusable-component/components/party-details-acknowledgement/party-details-acknowledgement.component';

@Component({
  selector: 'app-update-contact-details',
  templateUrl: './update-contact-details.component.html',
  styleUrl: './update-contact-details.component.scss',
})
export class UpdateContactDetailsComponent extends BaseFormClass {
  pageCode: string = 'ReqdropdownComponent';
  isMobile: boolean = false;
  accordianValue2: number = 0;
  contactDetails: any = {};
  validationConfig: any = [];
  validationResponse: any;
  modelName: string = 'UpdateContactDetails';
  contactData: any = {};
  partyNo: any;
  mobileNumber: any;
  bottomFields = [];

  override formConfig: GenericFormConfig = {
    autoResponsive: true,
    api: 'personalData',
    goBackRoute: '',
    cardType: 'non-border',
    fields: [
      {
        type: 'label-only',
        label: 'Update Contact Details',
        name: 'updateContactDetails',
        typeOfLabel: 'inline',
        className:
          'font-bold col-12 sm:col-6 md:col-2 lg:col-2 mb-4 header-text',
        nextLine: true,
      },
      {
        type: 'number',
        name: 'contactId',
        label: 'contactId',
        // disabled: true,
        cols: 3,
        className: 'my-1',
        hidden: true,
      },
      {
        type: 'text',
        label: 'lbl_mobile',
        name: 'mobile',
        cols: 3,
        className: 'col-12 sm:col-6 md:col-3 lg:col-3 mb-5 mr-7 ml-2',
        inputType: 'vertical',
        nextLine: false,

        regexPattern: '^[0-9+\\(\\)]*$',
      },
      {
        type: 'select',
        label: 'lbl_phone',
        name: 'phone',
        placeholder: 'Code',
        default: '+64',
        labelClass: 'mb-4',
        options: MobileCodes,
        validators: [Validators.required],
        // alignmentType: "vertical",
        className: 'mt-3 pt-3 pb-6',
        cols: 2,
        filter: true,
      },
      {
        type: 'text',
        placeholder: 'Area Code',
        name: 'accountantAreaCode',
        cols: 1,
        maxLength: 4,
        validators: [Validators.pattern('^[0-9]{1,5}$'), Validators.required],
        className: 'mt-3 pt-3',
        // inputType: 'vertical',
        //regexPattern: "^[0-9]{1,5}$*",
      },
      {
        type: 'text',
        name: 'accountantNumberr',
        placeholder: 'Number',
        cols: 1,
        maxLength: 10,
        validators: [Validators.pattern('^[0-9]{1,10}$'), Validators.required],
        className: 'mt-5 pt-0',
        regexPattern: '^[0-9]*$',
      },
      // {
      //   type: 'phone',
      //   label: 'lbl_mobile',
      //   name: 'mobile',
      //   cols: this.isMobile ? 6 : 3,
      //   className: 'col-12 sm:col-6 md:col-3 lg:col-3 mb-5 mr-7 ml-1',
      //   inputType: 'vertical',
      //   validators: [Validators.required]
      // },

      {
        type: 'text',
        label: 'lbl_email',
        name: 'email',
        cols: 3,
        className: 'col-12 sm:col-6 md:col-3 lg:col-3 mb-5 mr-7 ml-7',
        inputType: 'vertical',
        errorMessage: 'Incorrect combination',
        validators: [
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
          ),
        ],
      },
      {
        type: 'textArea',
        label: 'notes',
        name: 'notes',
        labelClass: 'mt-2 rss-grey',
        className: 'col-12 sm:col-6 md:col-12 lg:col-12 mb-3 mt-2',
        cols: 3,
        nextLine: this.isMobile ? true : false,
        inputType: 'vertical',
      },
    ],
  };

  constructor(
    // private apiService: QuotesContractsServiceService,
    // public datasvc: DataService,
    public override svc: CommonService,
    public override route: ActivatedRoute,
    private router: Router,
    private commonSetterGetterService: CommonSetterGetterService,
    public commonApiService: CommonApiService
  ) {
    super(route, svc);
  }
  override async ngOnInit() {
    this.commonSetterGetterService.customerDetails$.subscribe((details) => {
      this.contactData = details.business;
      this.getContactDetails();
    });
    this.commonSetterGetterService.party$.subscribe((currentParty) => {
      this.partyNo = currentParty?.id;
    });
  }
  async getContactDetails() {
    this.bottomFields = [
      {
        label: 'lbl_mobile',
        value: this.contactData?.phone[2]?.value || '',
      },
      {
        label: 'lbl_phone',
        value: this.contactData?.phone[0]?.value || '',
      },
      {
        label: 'lbl_email',
        value: this.contactData?.emails[0]?.value || '',
      },
    ];
  }

  async updateContactDetails() {
    let mobileNumber = this.mainForm?.get('phone')?.value;
    let areaCode = this.mainForm?.get('accountantAreaCode')?.value;
    let accountantNumber = this.mainForm?.get('accountantNumberr')?.value;

    let completeMobileNumber = `${mobileNumber}(${areaCode})${accountantNumber}`;
    const updateContactRequest: ServiceRequestBody = {
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
            updateContactDetails: {
              currentMobileNumber: this.contactData?.phone[2].value,
              currentPhone: this.contactData?.phone[0].value,
              currentEmail: this.contactData?.emails[0].value,
              updatedMobileNumber: this.mainForm?.get('mobile')?.value,
              updatedPhone: completeMobileNumber,
              updatedEmail: this.mainForm?.get('email')?.value,
              notes: this.mainForm?.get('notes')?.value,
            },
          },
        },
      },
    };
    const statusInvalid = this.validate();
    if (statusInvalid === 'VALID') {
      const response = await this.commonApiService.postTaskRequest(
        updateContactRequest
      );
      this.svc.dialogSvc
        .show(PartyDetailsAcknowledgementComponent, ' ', {
          templates: {
            footer: null,
          },
          data: response?.taskId,
          width: '50vw',
        })
        .onClose.subscribe(() => {
          this.router.navigateByUrl('/dashboard/update-party-details');
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
          this.router.navigate(['/commercial/dashboard/update-party-details']);
        }
      });
  }
}
