import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-view-request-description',
  //standalone: true,
  //imports: [],
  templateUrl: './view-request-description.component.html',
  styleUrls: ['./view-request-description.component.scss'],
})
export class ViewRequestDescriptionComponent {
  @Input() selectedRequest: any;
  selectedRequestData: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedRequest'] && this.selectedRequest) {
      // Extract the appropriate request data based on subject
      this.selectedRequestData = this.extractRequestData();
    }
  }

  private extractRequestData(): any {
    if (!this.selectedRequest?.externalData) {
      return null;
    }

    const subject = this.selectedRequest.subject;
    const externalData = this.selectedRequest.externalData;

    switch (subject) {
      case 'Add Assets Request':
        return externalData.addAssetsRequest;
      case 'Draw Down Request':
        return externalData.drawdownRequest;
      case 'Repayment Request':
        return externalData.repaymentRequest;
      case 'Release Security Request':
        return externalData.releaseSecurityRequest;
      case 'Settlement Quote Request':
        return externalData.settlementQuoteRequest;
      case 'New Loan Request':
        return externalData.newLoanRequest;
      case 'Asset Service Same Day Payout Request':
        return externalData.assetServiceSameDayPayoutRequest;
      case 'Service Request':
        return externalData.serviceRequestCss;
      default:
        return this.extractNonNullRequestObject(externalData);
    }
  }

  private extractNonNullRequestObject(externalData: Record<string, any>): any {
    return Object.values(externalData).find(
      (value) => value !== null && typeof value === 'object'
    );
  }

  getRequestData(): any {
    return this.selectedRequestData;
  }

  getFacilityType(): string {
    return this.selectedRequestData?.facilityType || '';
  }

  getSubFacility(): string {
    return this.selectedRequestData?.subFacility || '';
  }

  getLoanInfo(): string {
    return this.selectedRequestData?.loan || '';
  }

  hasAssets(): boolean {
    return (
      this.selectedRequestData?.assets &&
      this.selectedRequestData.assets.length > 0
    );
  }

  hasSuppliers(): boolean {
    return (
      this.selectedRequestData?.disbursementInfo?.suppliers &&
      this.selectedRequestData.disbursementInfo.suppliers.length > 0
    );
  }

  hasDisbursementAssetDetails(): boolean {
    return (
      this.selectedRequestData?.disbursementInfo?.assetDetails &&
      this.selectedRequestData.disbursementInfo.assetDetails.length > 0
    );
  }
}
