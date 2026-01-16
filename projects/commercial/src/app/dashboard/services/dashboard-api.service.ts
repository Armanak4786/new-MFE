import { Injectable } from '@angular/core';
import { CommonApiService } from '../../services/common-api.service';
import { environment } from '../../../environments/environment';
import { DataService, ToasterService } from 'auro-ui';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardApiService {
  private baseUrls = environment.microservices;
  constructor(
    private commonApiService: CommonApiService,
    private dataService: DataService,
    private toasterService: ToasterService
  ) { }
  getCustomerDetails(customerNo: string): Promise<any> {
    const params: any = { customerNo: customerNo };
    return new Promise((resolve, reject) => {
      this.commonApiService
        .getDataUrl(
          `${this.baseUrls.customerCommercial}/get_commercial_customer`,
          params
        )
        .subscribe({
          next: (data) => {
            if (data.Error) {
              this.toasterService.showToaster({
                severity: 'error',
                detail: data.Error.Message,
              });
            }
            resolve(data?.data); // Resolve with modified contract details
          },
          error: (err) => {
            this.dataService.handleError(err);
            reject(err); // Reject on error
          },
        });
      this.dataService.showLoader();
    });
  }

  getUserInfoData(usercode: any): Promise<any> {
    const params: any = { userCode: usercode };

    return new Promise((resolve, reject) => {
      this.commonApiService
        .getDataUrl(`${this.baseUrls.UserCommercial}/user_info`, params)
        .subscribe({
          next: (data) => {
            const partyDetails = data?.data?.partyDetails;
            if (!partyDetails.length) {
              this.toasterService.showToaster({
                severity: 'error',
                detail: 'partyDetails is null or not present',
              });
              return;
            }
            if (partyDetails && Array.isArray(partyDetails)) {
              const defaultParty = partyDetails.find(
                (party) => party.isDefault === true
              );

              data.data.partyDetail = defaultParty;
              resolve(data.data);
            } else {
              this.toasterService.showToaster({
                severity: 'error',
                detail: 'partyDetails is null or not present',
              });
              resolve(data?.data ?? {});
            }
          },
          error: (err) => {
            console.error('API Error:', err);
            this.dataService.handleError(err);
            reject(err);
          },
        });
    });
  }
  getIntroducerSummaryData(PartyNo: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let queryParam = `${PartyNo}`;
      this.commonApiService
        .postDataUrl(
          `${this.baseUrls.ServicingRequest}/set_introducer?PartyNo=${queryParam}`
        )
        .subscribe({
          next: (data) => resolve(data?.data), // just return response data
          error: reject,
        });
    });
  }

  getRelatedParties(partyNo: string): Promise<any> {
    const params: any = { partyNo: partyNo };
    return new Promise((resolve, reject) => {
      this.commonApiService
        .getDataUrl(
          `${this.baseUrls.WorkFlowsCommercial}/get_related_parties`,
          params
        )
        .subscribe({
          next: (data) => {
            if (data.Error) {
              this.toasterService.showToaster({
                severity: 'error',
                detail: data.Error.Message,
              });
            }
            resolve(data?.items); // Resolve with modified contract details
          },
          error: (err) => {
            this.dataService.handleError(err);
            reject(err); // Reject on error
          },
        });
      this.dataService.showLoader();
    });
  }

  getFinancialSummary(params) {
    return this.commonApiService.getDataUrl(
      `${this.baseUrls.paymentCommercial}/financial_summary`,
      params
    );
  }

  getFinancialSummaryContract(params) {
    return this.commonApiService.getDataUrl(
      `${this.baseUrls.paymentCommercial}/financial_summary_contract`,
      params
    );
  }

  getFinancialSummaryIntroducer(params) {
    return this.commonApiService.getDataUrl(
      `${this.baseUrls.paymentCommercial}/financial_summary_introducer`,
      params
    );
  }

  getFinancialSummaryActivity(params) {
    return this.commonApiService.getDataUrl(
      `${this.baseUrls.paymentCommercial}/financial_summary_activity`,
      params
    );
  }
  getFinancialSummaryData(partyId: string): Promise<any> {
    const params: any = { partyId: partyId };

    return new Promise((resolve, reject) => {
      forkJoin({
        apiFinancialSummary: this.getFinancialSummary(params),
        apiFinancialSummaryContract: this.getFinancialSummaryContract(params),
        apiFinancialSummaryIntroducer: this.getFinancialSummaryIntroducer(params),
        apiFinancialSummaryActivity: this.getFinancialSummaryActivity(params),
      }).subscribe({
        next: (result) => {
          this.checkApiErrors(result);
          const finalSummary = this.combineResults(result);
          resolve(finalSummary?.data);
        },
        error: (err) => {
          this.dataService.handleError(err);
          reject(err);
        },
      });
      this.dataService.showLoader();
    });
  }

  private combineResults(result: any) {
    const apiFinancialSummaryRes = result.apiFinancialSummary?.data || {};
    const apiFinancialSummaryContractRes = result.apiFinancialSummaryContract?.data || {};
    const apiFinancialSummaryIntroducerRes = result.apiFinancialSummaryIntroducer?.data || {};
    const apiFinancialSummaryActivityRes = result.apiFinancialSummaryActivity?.data || {};

    // Extract existing financialSummaryList from API A
    const financialSummaryList = apiFinancialSummaryRes.financialSummaryList || {};

    return {
      data: {
        ...apiFinancialSummaryActivityRes,

        financialSummaryList: {
          ...financialSummaryList,

          operatingLeaseDetails: apiFinancialSummaryContractRes.operatingLeaseDetails || [],

          introducerTransactionDetails: apiFinancialSummaryIntroducerRes.introducerTransactionDetails || [],
        },
      },
    };
  }
  private checkApiErrors(result: any) {
    const apis = [result.apiFinancialSummary, result.apiFinancialSummaryContract, result.apiFinancialSummaryIntroducer, result.apiFinancialSummaryActivity];
    apis.forEach((res: any) => {
      if (res?.error || res?.Error) {
        this.toasterService.showToaster({
          severity: 'error',
          detail: res?.error?.Message || res?.Error?.Message,
        });
      }
    });
  }

}
