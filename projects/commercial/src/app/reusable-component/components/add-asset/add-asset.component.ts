import { Component, Input, OnInit } from '@angular/core';
import { CloseDialogData, CommonService } from 'auro-ui';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonApiService } from '../../../services/common-api.service';
import { BaseCommercialService } from '../../services/base-commercial.service';
import { extractSubjectValue } from '../../../utils/common-utils';
import {
  AddAssetsExternalData,
  AddAssetsRequestBody,
  ApAttachmentFile,
  BaseRequest,
} from '../../../utils/common-interface';
import {
  optionDataForAddAsset,
  taskPostStaticFields,
} from '../../../utils/common-enum';
import { CancelPopupComponent } from '../cancel-popup/cancel-popup.component';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { AcknowledgmentPopupComponent } from '../acknowledgment-popup/acknowledgment-popup.component';

@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.component.html',
  styleUrl: './add-asset.component.scss',
})
export class AddAssetComponent implements OnInit {
  @Input() facilityType;
  formGroup: FormGroup;
  arr: FormArray;
  documents: any;
  optionData = [{ label: 'string', value: 'string' }];
  mainForm: any;
  selectedFacility: string;
  partyId: number = 0;
  showAssetRequiredError = false;
  isFromFacilityContext = false;
  childInput: string = '';
  customerName;
  message;

  constructor(
    public svc: CommonService,
    public route: ActivatedRoute,
    public fb: FormBuilder,
    public ref: DynamicDialogRef,
    public commonApiService: CommonApiService,
    public baseSvc: BaseCommercialService,
    public dynamicDialogConfig: DynamicDialogConfig,
    public commonSetterGetterSvc: CommonSetterGetterService
  ) {}

  ngOnInit() {
    this.optionData = optionDataForAddAsset;
    if (this.dynamicDialogConfig?.data) {
      this.selectedFacility = this.dynamicDialogConfig.data.facilityType;
      this.isFromFacilityContext = !!this.dynamicDialogConfig.data.facilityType;
    }

     const partyData = sessionStorage.getItem('currentParty');
    const partyId = JSON.parse(partyData);
    this.partyId = partyId?.id;
    this.customerName = partyId?.name;
    this.formGroup = this.fb.group({
      facilityType: [this.selectedFacility, Validators.required],
      arr: this.fb.array([this.createItem()]),
    });
    this.formGroup.get('arr').valueChanges.subscribe(() => {
      this.showAssetRequiredError = false;
    });
    // IMPORTANT: If selectedFacility has a value, mark the control as touched and valid
    if (this.selectedFacility) {
      this.formGroup.get('facilityType')?.markAsTouched();
      this.formGroup.get('facilityType')?.updateValueAndValidity();
    }
  }

  showDialogCancel() {
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
          this.ref.close();
        }
      });
  }

  get f() {
    return this.formGroup.controls;
  }

  createItem(): FormGroup {
    return this.fb.group({
      stockNumber: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)],
      ],
      assetDescription: ['', Validators.required],
      purchasePrice: [
        '',
        [Validators.required, Validators.pattern(/^[1-9]\d*(\.\d+)?$/)],
      ],
    });
  }

  addItem() {
    this.showAssetRequiredError = false;
    this.arr = this.f['arr'] as FormArray;
    this.arr.push(this.createItem());
  }

  removeItem(idx: number): void {
    if (this.arr.length > 1 && idx !== 0) {
      this.arr.removeAt(idx);
    }
  }

  customPatchFormArray(event: any, value: any) {
    console.log('INSIDE custom patch', value);
  }

  onButtonClick(event: any): void {
    if (event?.field?.name == 'addAssets') {
      this.mainForm.addArrayControls(event?.field?.name);
      this.customPatchFormArray(event, event?.templateFormData?.value);
    }
  }

  getUploadedDocs() {
    return this.baseSvc.getBaseCommercialFormData();
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result?.toString().split(',')[1];
        resolve(base64String || '');
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  private async getDocumentData(): Promise<any[]> {
    const files = this.getUploadedDocs().getValue().documentsData || [];

    try {
      const binaryFiles = await Promise.all(
        files.map((file) => this.convertFileToBase64(file.fileData))
      );
      return files.map(
        (file, index): ApAttachmentFile => ({
          file: binaryFiles[index],
          fileName: file.fileData.name,
          fileType: file.type,
        })
      );
    } catch (error) {
      console.error('Error converting files to binary:', error);
      return [];
    }
  }

  async postAsset(assetData: AddAssetsRequestBody) {
    try {
      const res = await this.commonApiService.postAssetData(assetData);
      const taskId = res.taskId;
      // const subject = res.externalData.addAssetsRequest.subject;
      const subject = extractSubjectValue(res?.subject);
      this.message = `Your Request has been submitted to UDC Finance for processing and approval. Request Number is: ${taskId} Add Assets Request.`;

      this.svc.dialogSvc
        .show(AcknowledgmentPopupComponent, ' ', {
          templates: {
            footer: null,
          },
          data: {
            message: this.message,
          },

          height: '25vw',
          width: '50vw',
          contentStyle: { overflow: 'auto' },
          styleClass: 'dialogue-scroll',
          position: 'center',
        })
        .onClose.subscribe((data: CloseDialogData) => {
          this.closePopup();
        });
    } catch (error) {
      this.svc?.ui?.showOkDialog(
        'There was an error submitting your Request. Please try again or contact UDC on 0800 500 832',
        '',
        () => {}
      );
    }
  }
  '';

  closePopup() {
    this.ref.close();
  }

  async submitData() {
    const assets = this.formGroup.get('arr')?.value;

    const hasValue = (value: any) => value && value.toString().trim() !== '';

    let hasPartialAssets = false;
    let hasCompleteAssets = false;

    assets.forEach((asset: any, index: number) => {
      const hasStock = hasValue(asset.stockNumber);
      const hasDesc = hasValue(asset.assetDescription);
      const hasPrice = hasValue(asset.purchasePrice);

      const filledFields = [hasStock, hasDesc, hasPrice].filter(Boolean).length;

      if (filledFields > 0) {
        if (filledFields === 3) {
          hasCompleteAssets = true;
        } else {
          hasPartialAssets = true;
          // Mark the form array control as touched to show validation errors
          const formArray = this.formGroup.get('arr') as FormArray;
          const assetGroup = formArray.at(index) as FormGroup;
          assetGroup.markAllAsTouched();
        }
      }
    });

    // Check if all assets are completely empty
    if (!hasCompleteAssets && !hasPartialAssets) {
      this.showAssetRequiredError = true;
      this.formGroup.markAllAsTouched();
      return;
    }

    // If there are partial assets, show validation errors
    if (hasPartialAssets) {
      this.showAssetRequiredError = false;
      this.formGroup.markAllAsTouched();
      return;
    }

    // Check facility type validation
    if (this.formGroup.get('facilityType')?.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.showAssetRequiredError = false;

    // Filter out completely empty assets before submission
    const validAssets = assets.filter((asset: any) => {
      return (
        hasValue(asset.stockNumber) &&
        hasValue(asset.assetDescription) &&
        hasValue(asset.purchasePrice)
      );
    });

    const uploadDocuments = await this.getDocumentData();
    const request: BaseRequest<AddAssetsExternalData> = {
      party: { partyNo: this.partyId },
      status: taskPostStaticFields.NotStarted,
      taskType: taskPostStaticFields.SelfServiceRequest,
      comments: '',
      customerName: `${this.customerName}`,
      externalData: {
        subjectLine: '',
        addAssetsRequest: {
          facilityType: this.selectedFacility,
          partyId: this.partyId,
          assets: validAssets,
          remarks: this.childInput,
        },
      },
      apTaskNoteAttachmentRequest: {
        apAttachmentFiles: uploadDocuments,
      },
    };
    this.postAsset(request);
  }

  handleChildInput(value: string) {
    this.childInput = value;
  }

  shouldLockDropdown(): boolean {
    return this.isFromFacilityContext;
  }
  onFacilityTypeChange(event) {
    if (!this.shouldLockDropdown()) {
      this.selectedFacility = event.value;
      this.formGroup.get('facilityType')?.setValue(event.value);
      this.formGroup.get('facilityType')?.markAsTouched();
      this.formGroup.get('facilityType')?.updateValueAndValidity();
    }
  }
}
