import { Component } from '@angular/core';
import { RequestAcknowledgmentComponent } from '../../../assetlink/components/request-acknowledgment/request-acknowledgment.component';
import { CommonService } from 'auro-ui';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DashboardApiService } from '../../../dashboard/services/dashboard-api.service';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { CommonApiService } from '../../../services/common-api.service';

@Component({
  selector: 'app-credit-repyment-request',
  //standalone: true,
  //imports: [],
  templateUrl: './credit-repyment-request.component.html',
  styleUrls: ['./credit-repyment-request.component.scss'],
})
export class CreditRepymentRequestComponent {
  udcBankDetails: string = '';
  paymentRefNumber: string = '';
  usercode: any;
  partyId: number;
  bankAccount: number;

  facilityTypeData = [{ label: 'CreditLine Facility', value: 'creditline' }];
  paymentAmt: string;
  loansData = [
    { label: 'Loan 1', value: '1' },
    { label: 'Loan 2', value: '2' },
    { label: 'Loan 3', value: '3' },
  ];
  nominatedBankAccount = [{ label: 'nominatedBankAccount', value: 'debit' }];
  fiBankAccount = [{ label: 'fiBankAccount', value: 'udc' }];
  facilityData;
  repaymentForm: FormGroup;

  constructor(
    private svc: CommonService,
    private fb: FormBuilder,
    public dynamicDialogConfig: DynamicDialogConfig,
    private commonApiService: CommonApiService,
    private dashboardApiService: DashboardApiService,
    private commonSetterGetterService: CommonSetterGetterService
  ) {}

  ngOnInit() {
    this.commonSetterGetterService.getCustomerNumber().subscribe((ref) => {
      this.paymentRefNumber = ref;
    });

    this.commonSetterGetterService.userDetails$.subscribe((userDtl) => {
      if (userDtl) {
        this.paymentRefNumber = userDtl.customerNumber;
        this.repaymentForm?.patchValue({
          bankAccount: userDtl.nominatedBankAccount,
        });
      }
    });

    this.repaymentForm = this.fb.group({
      facilityType: this.fb.control(null),
      facility: this.fb.control(null),
      contractId: this.fb.control(null),
    });

    this.commonSetterGetterService.party$.subscribe((currentParty) => {
      this.partyId = currentParty?.id;
    });
    this.loadFiAccountInfo();

    //  this.repaymentForm = this.fb.group({
    //  facilityType: this.fb.control(null),
    //  });

    if (this.dynamicDialogConfig?.data) {
      this.facilityData = this.getFacilityData(
        this.dynamicDialogConfig?.data.facility
      );
      this.repaymentForm = this.fb.group({
        facilityType: [this.facilityTypeData[0].value],
        facility: this.facilityData?.[2]?.value,
        contractId: ['', Validators.required],
        paymentAmount: ['', [Validators.required, Validators.min(0)]],
        requestDate: ['', Validators.required],
        paymentOption: ['nominatedBankAccount'],
        nominatedBankAccount: [''],
        fiBankAccount: [],
        uploadedDocuments: '', // handle this based on your upload component
        remarks: '',
        bankAccount: '',
      });
    }
  }

  getFacilityData(list) {
    return list.map((item) => ({
      label: item.facilityName,
      value: item.id,
    }));
  }

  onPaymentAmountChange(event) {
    //this.paymentAmt = this.paymentAmt + event.data;
    this.repaymentForm.get('paymentAmount')?.setValue(event.data);
    console.log(event.data);
  }

  onPaymentOptionChange(event) {
    if (event === 'fiBankAccount') {
      this.repaymentForm.get('nominatedBankAccount').setValue('');
      this.repaymentForm.get('fiBankAccount').setValue('fiBankAccount');
    } else {
      this.repaymentForm
        .get('nominatedBankAccount')
        .setValue('nominatedBankAccount');
      this.repaymentForm.get('fiBankAccount').setValue('');
    }
  }

  onFilesUploaded(event) {
    console.log(event);
  }

  showDialogCancel() {
    console.log('Cancel Clicked');
    this.svc?.ui?.showOkDialog(
      'Any details entered will be lost. Are you sure you want to cancel?',
      '',
      () => {}
    );
  }

  onRequestSettlementDateChange(event) {
    console.log(event);
    this.repaymentForm.patchValue({ facilityType: event.detail });
  }

  onFacilityTypeChange(event) {
    console.log(event.value);
    this.repaymentForm.patchValue({ facilityType: event.value.value });
  }

  submitData() {
    console.log('Submit Clicked');
    if (this.repaymentForm.valid) {
      this.paymentAmt = '';
      console.log('Form Submitted', this.repaymentForm.value);
      this.svc.dialogSvc
        .show(RequestAcknowledgmentComponent, ' ', {
          templates: {
            footer: null,
          },
          data: '',

          height: '25vw',
          width: '50vw',
          contentStyle: { overflow: 'auto' },
          styleClass: 'dialogue-scroll',
          position: 'center',
        })
        .onClose.subscribe((data: any) => {});
    } else {
      // Mark all controls as touched to show validation errors
      this.repaymentForm.markAllAsTouched();
      console.log('Form is invalid');
    }
  }

  loadFiAccountInfo() {
    const payload = {
      partyId: this.partyId, //12834
    };
    this.commonApiService
      .getFiAccountInfo(payload)
      .then((data: any) => {
        this.udcBankDetails = data?.data?.bankDetail?.accountNumber;
      })
      .catch((err) => {
        console.error('Error fetching FI account info:', err);
      });
  }
}
