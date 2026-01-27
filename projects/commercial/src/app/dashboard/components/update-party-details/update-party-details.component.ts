import { Component } from '@angular/core';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { CommonService } from 'auro-ui';
import { Router } from '@angular/router';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
  selector: 'app-update-party-details',
  templateUrl: './update-party-details.component.html',
  styleUrls: ['./update-party-details.component.scss'],
})
export class UpdatePartyDetailsComponent {
  accordianValue: number = 0;
  accordianValue2: number = 0;
  name = 'Name ';
  contact = 'Contact';
  address = 'Address';
  personalData: any;
  addressData: any;
  topFields = [];
  bottomFields = [];
  addressFields = [];
  isIndividual;
  constructor(
    private router: Router,
    private svc: CommonService,
    private commonSetterGetterService: CommonSetterGetterService
  ) {}

  ngOnInit() {
    this.commonSetterGetterService.customerDetails$.subscribe((details) => {
      this.personalData = details;
    });
    this.commonSetterGetterService.address$.subscribe((add) => {
      this.addressData = add;
      this.isIndividual = add?.isIndividualParty;
    });
    this.getPersonalDetails();
  }

  async getPersonalDetails() {
    if (this.isIndividual) {
      this.topFields = [
        {
          label: 'First Name',
          value: this.personalData.personalDetails?.firstName || '',
        },
        {
          label: 'Middle Name',
          value: this.personalData.personalDetails?.middleName || '',
        },
        {
          label: 'Last Name',
          value: this.personalData.personalDetails?.lastName || '',
        },
        {
          label: 'Known as',
          value: this.personalData.personalDetails?.knownAs || '',
        },
      ];
      this.bottomFields = [
        {
          label: 'Mobile',
          value: this.personalData.personalDetails?.phone[2].value || '',
        },
        {
          label: 'Phone',
          value: this.personalData.personalDetails?.phone[0].value || '',
        },
        {
          label: 'Email',
          value: this.personalData.personalDetails?.emails[0].value || '',
        },
      ];
      this.addressFields = [
        {
          label: 'lbl_physical',
          value: this.addressData?.physicalAddress || '',
        },
        {
          label: 'lbl_postalAddress',
          value: this.addressData?.postalAddress || '',
        },
      ];
    }
    else {
      this.topFields = [
        {
          label: 'Business Name',
          value: this.personalData?.business?.legalName || '',
        },
      ];
      this.bottomFields = [
        {
          label: 'lbl_mobile',
          value: this.personalData.business?.phone[2].value || '',
        },
        {
          label: 'lbl_phone',
          value: this.personalData.business?.phone[0].value || '',
        },
        {
          label: 'lbl_email',
          value: this.personalData.business?.emails[0].value || '',
        },
      ];

      this.addressFields = [
        {
          label: 'lbl_physical',
          value: this.addressData?.physicalAddress || '',
        },
        {
          label: 'lbl_postalAddress',
          value: this.addressData?.postalAddress || '',
        },
        {
          label: 'lbl_registeredAddress',
          value: this.addressData?.registeredAddress || '',
        },
      ];
    }
  }
  onUpdateClick(event, updateType) {
    if (updateType === 'contact') {
      this.svc.router.navigateByUrl('/dashboard/update-contact-details');
    } else {
      this.svc.router.navigateByUrl('/dashboard/update-address-details');
    }
  }
}
