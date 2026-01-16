import { Injectable } from '@angular/core';
import { CommonApiService } from '../../services/common-api.service';

@Injectable({
  providedIn: 'root',
})
export class NonFaciltyApiService {
  constructor(private commonApiService: CommonApiService) {}

  getGenerateCustomerStatement(
    partyId: string,
    facilityType: string
  ): Promise<any> {
    const params: any = { partyId: partyId, facilityType: facilityType };
    return new Promise((resolve, reject) => {
      this.commonApiService
        .getDataUrl(`ContractCommercial/contract_details`, params)
        .subscribe({
          next: (data) => {
            resolve(data);
          },
          error: (err) => {
            reject(err); // Reject on error
          },
        });
    });
  }

  getLeaseSummaryData(partyId, leaseId): Promise<any> {
    // const params = {partyId: partyId, leaseId: leaseId}
    return new Promise((resolve, reject) => {
      this.commonApiService.getDataUrl(`rental_summary`).subscribe({
        next: (data) => {
          resolve(data.data.rentalSummary); // Resolve the promise with the response data
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  getPaymentsTabData(
    partyId: string,
    facilityType: number,
    contractId?: number
  ): Promise<any> {
    const params: any = {
      partyId: partyId,
      facilityType: facilityType,
      contractId: contractId,
    };
    return new Promise((resolve, reject) => {
      this.commonApiService.getDataUrl(`repayment_history`, params).subscribe({
        next: (data) => {
          const repayments = data.data.repayments;
          data.data.repayments.forEach((doc) => {
            doc.allocationDetails = 'View';
          });
          resolve(repayments); // Resolve with modified contract details
        },
        error: (err) => {
          reject(err); // Reject on error
        },
      });
    });
  }

  getTransactionTabData(
    partyId: string,
    facilityType: number,
    contractId?: number
  ): Promise<any> {
    const params: any = {
      partyId: partyId,
      facilityType: facilityType,
      contractId: contractId,
    };
    return new Promise((resolve, reject) => {
      this.commonApiService
        .getDataUrl(`transaction_statement`, params)
        .subscribe({
          next: (data) => {
            const transactions = data.data.transactions;
            data.data.transactions.forEach((doc) => {
              doc.allocatedDetails = 'View';
            });
            resolve(transactions); // Resolve with modified contract details
          },
          error: (err) => {
            reject(err); // Reject on error
          },
        });
    });
  }

  getPaymentForcastData(
    partyId,
    facilityType,
    fromDate,
    toDate,
    frequency
  ): Promise<any> {
    //const params = {facilityType: facilityType, partyId: partyId, repaymentFrequency: repaymentFrequency, fromDate: fromDate, toDate: toDate }
    return new Promise((resolve, reject) => {
      this.commonApiService.getDataUrl(`repayment_forecast`).subscribe({
        next: (data) => {
          resolve(data.data); // Resolve the promise with the response data
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }
}
