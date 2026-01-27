import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'auro-ui';
import { TransferRequestSubmissionComponent } from '../transfer-request-submission/transfer-request-submission.component';
import { BailmentComponentLoaderService } from '../../services/bailment-component-loader.service';
import { CommonApiService } from '../../../services/common-api.service';
import { requestType } from '../../../utils/common-enum';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import {
  AffectedAsset,
  APAssetServicingRequestReq,
} from '../../../utils/common-interface';
import { WarningPopupComponent } from '../../../reusable-component/components/warning-popup/warning-popup.component';
import { jwtDecode } from 'jwt-decode';
import { CancelPopupComponent } from '../../../reusable-component/components/cancel-popup/cancel-popup.component';
import { clearSession } from '../../../utils/common-utils';

@Component({
  selector: 'app-product-transfer-disclaimer',
  templateUrl: './product-transfer-disclaimer.component.html',
  styleUrls: ['./product-transfer-disclaimer.component.scss'],
})
export class ProductTransferDisclaimerComponent {
  productTransferDisclaimerDataList;
  productTransferResponse;
  filteredProductTransferDisclaimerList;
  receivedData;
  requestType: string = requestType.productTransfer;
  filteredProductTransferResponseList;
  productTransferTo;
  partyDetail;
  partyName;
  searchedBy;
  customerName;
  username;
  systemTime;
  assetServicingRequestResponseProductTransfer;
  constructor(
    private router: Router,
    public svc: CommonService,
    private bailmentComponentLoaderService: BailmentComponentLoaderService,
    private commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService // public ref: DynamicDialogRef,
  ) {}

  ngOnInit() {
    this.productTransferDisclaimerDataList=JSON.parse(sessionStorage.getItem('filteredAssetsDataList') || '[]');
    console.log(
      'this.productTransferDisclaimerDataList',
      this.productTransferDisclaimerDataList
    );
    console.log('productTransferDisclaimerDataList', this.productTransferDisclaimerDataList.length);    
    const storedReceivedData = sessionStorage.getItem('productTransferReceivedData');
    if (storedReceivedData) {
      this.receivedData = JSON.parse(storedReceivedData);
      console.log('this.receivedData (from sessionStorage)', this.receivedData);
    } else {
      this.receivedData = history?.state?.params;
      console.log('this.receivedData (from router state)', this.receivedData);
      if (this.receivedData) {
        sessionStorage.setItem('productTransferReceivedData', JSON.stringify(this.receivedData));
      }
    }    
    if (!this.receivedData || !this.productTransferDisclaimerDataList.length) {
      this.svc.router.navigateByUrl('commercial/bailment');
      return;
    }
    
    this.searchedBy = this.receivedData?.searchedBy;
    if (this.receivedData.exculdeDealTypeId == 'DEMO') {
      this.productTransferTo = 'Demonstrator (DEMO)';
    } else if (this.receivedData.exculdeDealTypeId == 'DPP') {
      this.productTransferTo = 'Delayed Payment Privilege (DPP)';
    }
    // this.commonSetterGetterSvc.partyList$.subscribe((partyDetail) => {
    //   this.partyDetail = partyDetail;
    // });
    this.partyDetail=JSON.parse(sessionStorage.getItem('partyDetails') || '[]');;
    this.partyName = this.partyDetail.find(
      (item) => item.value === this.receivedData.partyId
    );
    // this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
    //   this.customerName = currentParty.name;
    // });
    this.customerName = JSON.parse(sessionStorage.getItem('currentParty'))?.name;
    let decodedToken = sessionStorage.getItem('accessToken');
    this.username = this.decodeToken(decodedToken)?.sub;
    this.newAssetServicingRequest();
    this.initDate();
  }

  async newAssetServicingRequest() {
    let productTransferNewAsset = {
      partyId: this.receivedData.partyId,
      subFacilityId: this.receivedData.subFacilityId,
      requestType: requestType.productTransfer,
      requestDetails: {
        productTransferTo: this.receivedData.exculdeDealTypeId,
      },
    };
    this.assetServicingRequestResponseProductTransfer =
      await this.commonApiService.newAssetServicingRequest(
        productTransferNewAsset
      );
  }
  private initDate() {
    const stored = sessionStorage.getItem('cutOffTime');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.systemDateTime) {
        const dateObj = new Date(parsed.systemDateTime);
        // Extract only the date part (yyyy-mm-dd)
        this.systemTime = dateObj.toISOString().slice(0, 10);
        console.log('Effective date set from session:', this.systemTime);
        return;
      }
    }
    // fallback → use system date
    const today = new Date().toISOString().slice(0, 10);
    this.systemTime = today;
  }
  deleteAssets(data, Index) {
    this.productTransferDisclaimerDataList.splice(Index, 1);
    sessionStorage.setItem('filteredAssetsDataList', JSON.stringify(this.productTransferDisclaimerDataList));
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
          clearSession(['productTransferReceivedData', 'filteredAssetsDataList']);
          this.router.navigate(['bailment']);
        }
      });
  }

  async onSubmit() {
    this.filteredProductTransferDisclaimerList =
      this.productTransferDisclaimerDataList.map((item) => ({
        assetNo: item.assetNo,
        contractId: item.contractId,
        currentExpirydate: item.expiryDate,
        totalDueAmount: item.amountToPay,
        newDealTypeId: this.receivedData.exculdeDealTypeId,
      }));

    const sanitizedAffectedAssets: AffectedAsset[] =
      this.filteredProductTransferDisclaimerList.map((asset) => ({
        assetNo: asset.assetNo,
        contractId: asset.contractId,
        currentExpirydate: asset.currentExpirydate,
        totalDueAmount: asset.totalDueAmount ?? 0, // default 0 if null
        newDealTypeId: asset.newDealTypeId,
      }));

    let productTransferRequest: APAssetServicingRequestReq = {
      partyId: this.receivedData.partyId,
      facilityType: this.receivedData.facilityType,
      subFacilityId: this.receivedData.subFacilityId,
      requestType: requestType.productTransfer,
      requestDetails: {
        productTransferTo: this.receivedData.exculdeDealTypeId,
        swapEffectiveDate: this.systemTime,
        affectedAssets: sanitizedAffectedAssets,
      },
    };
    this.router.navigate(['bailment']);
    try {
      // const ServicingRequestResponse =
      //   await this.commonApiService.newAssetServicingRequest(
      //     productTransferRequest
      //   );
      const productTransferPayload = {
        ...productTransferRequest,
        newAssetServicingRequestResult:
          this.assetServicingRequestResponseProductTransfer.data,
      };
      this.productTransferResponse =
        await this.commonApiService.saveAssetServicingRequest(
          productTransferPayload
        );

      const RequestNumber = this.productTransferResponse?.data?.referenceNumber;

      if (!RequestNumber) {
        const errorMsg =
          this.productTransferResponse?.apiError?.errors?.[0]?.message ||
          'There was an error submitting your Product Transfer request.';

        this.svc.dialogSvc.show(WarningPopupComponent, '', {
          templates: {
            footer: null,
          },
          data: {
            title: 'Submission Error',
            messageKey: 'product_transfer_request_error_msg',
            facilityRoute: 'bailments',
          },
          width: '30vw',
          height: 'auto',
        });
        console.error('Product Transfer request error:', errorMsg);
        return;
      }      
      clearSession(['productTransferReceivedData', 'filteredAssetsDataList']);
      
      // if (RequestNumber)
      // this.router.navigate(['commercial/bailments']);
      this.filteredProductTransferResponseList =
        this.productTransferDisclaimerDataList.map((item) => ({
          assetNo: item.assetNo,
          description: item.description,
          vehicleIdentificationNumber: item.vehicleIdentificationNumber,
          registrationNumber: item.registrationNumber,
        }));
      this.svc.dialogSvc
        .show(TransferRequestSubmissionComponent, ' ', {
          templates: {
            footer: null,
          },
          data: {
            filteredProductTransferResponseList:
              this.filteredProductTransferResponseList,
            RequestNumber,
            productTransferTo: this.receivedData.exculdeDealTypeId,
            searchedBy: this.receivedData?.searchedBy,
            pageFrom: 'product-transfer',
          },
          width: '50vw',
          height: '50vw',
        })
        .onClose.subscribe((data: any) => {});
    } catch (error) {
      this.svc?.ui?.showOkDialog(
        'There was an error submitting your Request. Please try again or contact UDC on 0800 500 832. ',
        '',
        () => {}
      );
      console.log('Error release error', error);
    }
  }
  
  ngOnDestroy() {
    clearSession(['productTransferReceivedData', 'filteredAssetsDataList']);
  }
  
  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid Token', error);
      return null;
    }
  }
}
