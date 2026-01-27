import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonApiService } from '../../../services/common-api.service';

@Component({
  selector: 'app-motocheck',
  templateUrl: './motocheck.component.html',
  styleUrl: './motocheck.component.scss'
})
export class MotocheckComponent {
  registrationplate: string;
  vin: string;
  programid: string;

  searchType: 'rego' | 'vin' = 'vin';
  searchValue: string = '';

  assetDetails: any = null;
  errorMessage: string = '';
  searchError: string = '';


  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    public commonapiService: CommonApiService,
    public ref: DynamicDialogRef
  ) { }

  ngOnInit(): void {
    this.registrationplate = this.dynamicDialogConfig?.data?.registrationPlate;
    this.vin = this.dynamicDialogConfig?.data?.vin;
    this.programid = this.dynamicDialogConfig?.data?.programId;

    if (this.registrationplate) {
      this.searchType = 'rego';
      this.searchValue = this.registrationplate;
    } else if (this.vin) {
      this.searchType = 'vin';
      this.searchValue = this.vin;
    }
  }

  async search() {
    this.searchError = '';

    if (this.searchType === 'rego' && !this.searchValue?.trim()) {
      this.searchError = 'Rego No. must be provided.';
      return;
    }

    if (this.searchType === 'vin') {
      if (!this.searchValue?.trim()) {
        this.searchError = 'VIN must be provided.';
        return;
      }

      const vinPattern = /^[A-Za-z0-9]{17}$/;
      if (!vinPattern.test(this.searchValue.trim())) {
        this.searchError = 'Invalid VIN entered. A valid VIN should have 17 alphanumeric characters.';
        return;
      }
    }

    const params = {
      registrationPlate: this.searchType === 'rego' ? this.searchValue : null,
      vin: this.searchType === 'vin' ? this.searchValue : null,
      programId: String(this.programid)
    };

    try {
      this.assetDetails = await this.commonapiService.getAssetDetails(params);

      if (!this.assetDetails?.responseMessage?.jsoNpayload) {
        this.searchError = 'No matching vehicle record found. Please verify the VIN or Rego number and try again';
      }
    } catch (error) {
      this.searchError = 'Error while fetching data. Please try again.';
    }
  }


  reset() {
    this.assetDetails = null;
    this.errorMessage = '';
    this.searchValue = this.searchType === 'rego' ? this.registrationplate || '' : this.vin || '';
  }

  addMotoDetails() {
    if (!this.assetDetails) return;

    const result = {
      vin: this.assetDetails?.responseMessage?.jsoNpayload?.vehicleDescription?.vin,
      chassisNumber: this.assetDetails?.responseMessage?.jsoNpayload?.vehicleDescription?.chassisNumber,
      colour: this.assetDetails?.responseMessage?.jsoNpayload?.vehicleDescription?.colour,
      make: this.assetDetails?.responseMessage?.jsoNpayload?.vehicleDescription?.make,
      model: this.assetDetails?.responseMessage?.jsoNpayload?.vehicleDescription?.model,
      year: this.assetDetails?.responseMessage?.jsoNpayload?.vehicleDescription?.yearOfManufacture,
      registrationDate: this.assetDetails?.responseMessage?.jsoNpayload?.vehicleLicensingDetails?.registrationDate
    };

    this.ref.close(result);
  }

  showDialogCancel() {
    this.ref.close();
  }

}
