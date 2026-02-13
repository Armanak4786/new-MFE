import { Injectable } from '@angular/core';
import { CommonService, DataService, ToasterService } from 'auro-ui';
import { map } from 'rxjs';
import { convertDate, formatDateTime } from '../utils/common-utils';
import {
  AccountForecastParams,
  AssetsParams,
  CurrentPositionParams,
  DocumentByIdParams,
  DocumentsParams,
  FiAccountInfo,
  InterestRateParams,
  LeaseParams,
  LeaseScheduleParams,
  LoanParams,
  LoanPartiesParams,
  PaymentAllocationParams,
  PaymentForcastParams,
  PaymentSummaryParams,
  PiScheduleParams,
  TransactionAllocationParams,
  transactionParams,
  UploadDocsParams,
  LeaseSummaryParams,
  ReleaseSecurityRequestBody,
  AddAssetsRequestBody,
  CurtailmentDetailsParams,
  AssetTransactionParams,
  NotesDetailsParams,
  RepaymentRequestBody,
  FacilitySummaryParams,
  AssetDetailsParams,
  SettlementQuoteRequestBody,
  RequestHistoryParams,
  PurchaseAssetRequestBody,
  DrawdownRequestBody,
  PaymentForcastPrincipalParams,
  ContractIdParams,
  NotesDocsParams,
  NewLoanRequestBody,
  TaskDocumentByIdParams,
  NotesCommentParams,
  SameDayPayoutRequestBody,
  PartyNo,
  FloatingFloorplanRepaymentRequest,
  Program,
  AssetDrawdownRequestBody,
  SearchPurchaseAssetParams,
  AssetDrawdownRequestBodyTask,
  SwapRequestParams,
  TransferRequestParams,
  PaymentRequestParams,
  FloatingRepaymentRequest,
  SearchRequestParams,
  ProgramId,
  Motocheck,
  NotesParams,
  NotesDocumentParams,
  ContractNotesParams,
  CustomerStatementBody,
  ServiceRequestBody,
  FloatingFloorplanDrawdownRequest,
  FixedFloorPlanDrawdownTaskBody,
  ContactUsTaskBody,
} from '../utils/common-interface';
import {
  documentActions,
  notesActions,
  threeDotIcon,
} from '../utils/common-header-definition';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class CommonApiService {
  private baseUrls = environment.microservices;
  constructor(
    private commonSvc: CommonService,
    public dataService: DataService,
    public toasterService: ToasterService
  ) {}

  public getDataUrl(url: string, params?: string) {
    return this.dataService.get(url, params).pipe(
      map((res) => res) // Customize response transformation if needed
    );
  }

  public postDataUrl(url: string, body?: any, header?) {
    return this.commonSvc.data.post(url, body, header).pipe(
      map((res) => res) // Customize response transformation if needed
    );
  }

  getAssetsData(assetParam: AssetsParams): Promise<any> {
    const params: any = {};

    // List of properties to check and add to params
    const keys: (keyof AssetsParams)[] = [
      'partyId',
      'facilityType',
      'subFacilityId',
      'contractId',
      'searchText',
      'exculdeGroupType',
      'exculdeDealTypeId',
    ];

    // Loop through keys and add to params if defined
    keys.forEach((key) => {
      if (assetParam[key] !== undefined) {
        params[key] = assetParam[key];
      }
    });

    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.assetCommercial}/linked_assets`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            const linkedAssets = data?.data?.linkedAssetDetails;

            linkedAssets &&
              linkedAssets.forEach((asset) => {
                asset.identifier =
                  asset.registrationNumber ||
                  asset.vehicleIdentificationNumber ||
                  asset.serialNumber ||
                  asset.chassisNumber ||
                  null;
              });

            linkedAssets &&
              linkedAssets.forEach((asset) => {
                asset.actions = 'Details';
                asset.actions = threeDotIcon;
              });
            resolve(linkedAssets); // Resolve with the specific data
          }
        },
        error: (err) => {
          this.dataService.handleError(err);
          reject(err); // Reject on error
        },
      });
    });
  }

  getAccountForcastData(accountForcast: AccountForecastParams): Promise<any> {
    const params: any = {};
    //${this.baseUrls.paymentCommercial}/
    // List of properties to check and add to params
    const keys: (keyof AccountForecastParams)[] = [
      'partyId',
      'facilityType',
      'subFacilityId',
      'facilityTypeCFname',
    ];

    // Loop through keys and add to params if defined
    keys.forEach((key) => {
      if (accountForcast[key] !== undefined) {
        params[key] = accountForcast[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.paymentCommercial}/account_forecast`,
        params
      ).subscribe({
        next: (data) => {
          //const forecast = data.data;

          //const formattedForecast = formatForecastMonths(forecast);
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            const forecast = data?.data?.accountForecasts;
            // forecast &&
            //   forecast.forEach((asset) => {
            //     asset.transformDate = asset?.month && convertDate(asset.month);
            //   });
            resolve(data.data);
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  postAssetReleaseData(
    assetReleaseData: ReleaseSecurityRequestBody
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.postDataUrl(
        `${this.baseUrls.TaskCommercial}/add_task_details`,
        assetReleaseData
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data.data); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  getPaymentForcastData(paymentParams: PaymentForcastParams): Promise<any> {
    const params: any = {};
    // ${this.baseUrls.paymentCommercial}/

    // List of properties to check and add to params
    const keys: (keyof PaymentForcastParams)[] = [
      'contractId',
      'facilityTypeCFname',
      'partyId',
      'facilityType',
      'repaymentFrequency',
      'fromDate',
      'toDate',
      'subFacilityId',
    ];
    keys.forEach((key) => {
      if (paymentParams[key] !== undefined && paymentParams[key] !== null) {
        params[key] = paymentParams[key];
      }
    });

    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.paymentCommercial}/repayment_forecast`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              this.dataService.handleError.bind(this);
              console.log(error.messageId);
            });
          } else {
            const forecast = data?.data?.paymentForecasts;
            forecast &&
              forecast.forEach((asset) => {
                asset.transformDate = convertDate(asset.month);
              });
            resolve(data.data);
          }
        }, // Resolve the promise with the response data

        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  getRentalForcastData(paymentParams: PaymentForcastParams): Promise<any> {
    const params: any = {};
    //${this.baseUrls.paymentCommercial}
    // List of properties to check and add to params
    const keys: (keyof PaymentForcastParams)[] = [
      'partyId',
      'facilityType',
      'frequency',
      'fromDate',
      'toDate',
      'facilityTypeCFname',
      'contractId',
    ];
    keys.forEach((key) => {
      if (paymentParams[key] !== undefined) {
        params[key] = paymentParams[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.paymentCommercial}/rental_forecast`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            const forecast = data?.data;
            forecast &&
              forecast.forEach((asset) => {
                asset.transformDate = convertDate(asset.month);
              });
            resolve(forecast);
          }
        }, // Resolve the promise with the response data

        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  getLoansData(loanParams: LoanParams): Promise<any> {
    //ContractCommercial/
    const params: any = {};
    // List of properties to check and add to params
    const keys: (keyof any)[] = [
      'partyId',
      'facilityType',
      'subFacilityId',
      'contractId',
      'OperatingLeaseProductGroup',
    ];
    // Loop through keys and add to params if defined
    keys.forEach((key) => {
      if (loanParams[key] !== undefined) {
        params[key] = loanParams[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.contractCommercial}/contract_details`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length != 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            const contractDetails = data.data.contractDetails;
            contractDetails &&
              contractDetails.forEach((loan) => {
                loan.associatedAssets = 'Details';
                loan.action = threeDotIcon;
              });
            resolve(contractDetails); // Resolve with modified contract details
          }
        },
        error: (err) => {
          reject(err); // Reject on error
        },
      });
    });
  }

  getLeasesData(leasesParams: LeaseParams): Promise<any> {
    //ContractCommercial/ ${this.baseUrls.contractCommercial}/
    const params: any = {};
    // List of properties to check and add to params
    //const keys: (keyof LeaseParams)[] = ['partyId', 'facilityType','leaseId];
    const keys: (keyof LeaseParams)[] = [
      'partyId',
      'facilityType',
      'BuybackfacilityType',
    ];
    // Loop through keys and add to params if defined
    keys.forEach((key) => {
      if (leasesParams[key] !== undefined) {
        params[key] = leasesParams[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.contractCommercial}/leases`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            const contractDetails = data?.data?.leaseDetails;
            const leaseDetails = data.data.leaseDetails;
            leaseDetails.forEach((asset) => {
              asset.identifier =
                asset.registrationNumber ||
                asset.vehicleIdentificationNumber ||
                asset.serialNumber ||
                asset.chassisNumber ||
                null;
            });
            contractDetails &&
              contractDetails.forEach((loan) => {
                loan.associatedAssets = 'Details';
                loan.action = threeDotIcon;
              });

            resolve(contractDetails); // Resolve with modified contract details
          }
        },
        error: (err) => {
          reject(err); // Reject on error
        },
      });
    });
  }

  getPiScheduleData(piParams: PiScheduleParams): Promise<any> {
    // ContractCommercial needs to change
    const params: any = {};
    // List of properties to check and add to params
    const keys: (keyof PiScheduleParams)[] = ['partyId', 'contractId'];

    // Loop through keys and add to params if defined
    keys.forEach((key) => {
      if (piParams[key] !== undefined) {
        params[key] = piParams[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.paymentCommercial}/repayment_schedule`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data?.data?.repaymentSchedule); // Resolve with modified contract details
          }
        },
        error: (err) => {
          reject(err); // Reject on error
        },
      });
    });
  }

  getDocumentsData(docParams: DocumentsParams): Promise<any> {
    // const params = {partyId: partyId}
    const params: any = {}; //contractId: 516
    // List of properties to check and add to params
    const keys: (keyof DocumentsParams)[] = ['partyId', 'contractId'];
    // Loop through keys and add to params if defined ${this.baseUrls.paymentCommercial}/
    keys.forEach((key) => {
      if (docParams[key] !== undefined) {
        params[key] = docParams[key];
      }
    });
    params.SecurityClassification = 'General';
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.CommercialDocument}/documents`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            const documentDetails = data?.data;
            documentDetails.forEach((doc) => {
              doc.actions = documentActions;
              if (doc.loaded) {
                //use to transform date to DD/MM/YYYY HH:MM AM/PM
                doc.loaded = formatDateTime(doc.loaded);
              }
            });
            resolve(documentDetails); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  getDocumentById(docParams: DocumentByIdParams): Promise<any> {
    // const params = {partyId: partyId}
    const params: any = {};
    // List of properties to check and add to params
    const keys: (keyof DocumentByIdParams)[] = [
      'partyId',
      'contractId',
      'documentId',
    ];

    // Loop through keys and add to params if defined ${this.baseUrls.paymentCommercial}/
    keys.forEach((key) => {
      if (docParams[key] !== undefined) {
        params[key] = docParams[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.CommercialDocument}/download`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data.data); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }
  getTaskDocumentById(docParams: TaskDocumentByIdParams): Promise<any> {
    const params: any = {};

    const keys: (keyof TaskDocumentByIdParams)[] = ['noteId', 'attachmentId'];

    keys.forEach((key) => {
      if (docParams[key] !== undefined) {
        params[key] = docParams[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.TaskCommercial}/download_attachemnt`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              console.log(error.messageId);
            });
          } else {
            resolve(data.data); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  getNotesByTaskId(notesParams: NotesDocsParams): Promise<any> {
    const params: any = {};
    // List of properties to check and add to params
    const keys: (keyof NotesDocsParams)[] = ['taskId'];

    // Loop through keys and add to params if defined ${this.baseUrls.paymentCommercial}/
    keys.forEach((key) => {
      if (notesParams[key] !== undefined) {
        params[key] = notesParams[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.TaskCommercial}/get_note_attachment_for_task`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              console.log(error.messageId);
            });
          } else {
            const documentDetails = data?.data;
            documentDetails.forEach((doc) => {
              doc.action = notesActions;
              if (doc.loaded) {
                //use to transform date to DD/MM/YYYY HH:MM AM/PM
                doc.loaded = formatDateTime(doc.loaded);
              }
            });
            resolve(data.data); // Resolve the promise with the response data
          }
        },

        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  getLoanPartiesData(loanPartiesParams: LoanPartiesParams): Promise<any> {
    // ContractCommercial needs to change
    const params: any = {};
    // List of properties to check and add to params
    const keys: (keyof LoanPartiesParams)[] = [
      'partyId',
      'contractId',
      'leaseId',
    ];

    // Loop through keys and add to params if defined
    keys.forEach((key) => {
      if (loanPartiesParams[key] !== undefined) {
        params[key] = loanPartiesParams[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.contractCommercial}/parties`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data?.data?.partyDetails); // Resolve with modified contract details
          }
        },
        error: (err) => {
          reject(err); // Reject on error
        },
      });
    });
  }

  getCurrentPositionData(
    currentPositionParams: CurrentPositionParams
  ): Promise<any> {
    const params: any = {};
    // List of properties to check and add to params
    const keys: (keyof CurrentPositionParams)[] = ['partyId', 'contractId'];

    // Loop through keys and add to params if defined
    keys.forEach((key) => {
      if (currentPositionParams[key] !== undefined) {
        params[key] = currentPositionParams[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.contractCommercial}/current_position`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data?.data?.currentPosition); // Resolve with modified contract details
          }
        },
        error: (err) => {
          reject(err); // Reject on error
        },
      });
    });
  }

  getInterestRateData(interestRateParams: InterestRateParams): Promise<any> {
    // ContractCommercial needs to change;
    const params: any = {};
    // List of properties to check and add to params
    const keys: (keyof InterestRateParams)[] = ['partyId', 'contractId'];

    // Loop through keys and add to params if defined
    keys.forEach((key) => {
      if (interestRateParams[key] !== undefined) {
        params[key] = interestRateParams[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.contractCommercial}/interest_rate_revisions`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data?.data?.revisions); // Resolve with modified contract details
          }
        },
        error: (err) => {
          reject(err); // Reject on error
        },
      });
    });
  }

  getPaymentSummaryData(
    paymentSummaryParams: PaymentSummaryParams
  ): Promise<any> {
    // ContractCommercial needs to change
    const params: any = {};
    // List of properties to check and add to params
    const keys: (keyof PaymentSummaryParams)[] = ['partyId', 'contractId'];

    // Loop through keys and add to params if defined
    keys.forEach((key) => {
      if (paymentSummaryParams[key] !== undefined) {
        params[key] = paymentSummaryParams[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.paymentCommercial}/repayment_history`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data?.data.repayments); // Resolve with modified contract details
          }
        },
        error: (err) => {
          reject(err); // Reject on error
        },
      });
    });
  }

  getPaymentsTabData(transactionFlowParams: transactionParams): Promise<any> {
    //ContractCommercial/
    const params: any = {};
    // List of properties to check and add to params
    const keys: (keyof transactionParams)[] = [
      'partyId',
      'contractId',
      'facility_type',
      'facility_type_cf_name',
      'floating_floorplan_facility_name',
      'subFacilityId',
      'credit_line_id',
      'contractId',
    ];

    // Loop through keys and add to params if defined
    keys.forEach((key) => {
      if (transactionFlowParams[key] !== undefined) {
        params[key] = transactionFlowParams[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.paymentCommercial}/payment_statements`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            const payments = data?.data?.payments;
            data?.data?.payments?.forEach((doc) => {
              doc.allocatedDetails = 'View';
            });
            resolve(payments); // Resolve with modified contract details
          }
        },
        error: (err) => {
          reject(err); // Reject on error
        },
      });
    });
  }

  getTransactionsTabData(
    transactionFlowParams: transactionParams
  ): Promise<any> {
    //ContractCommercial/
    const params: any = {};
    // List of properties to check and add to params
    const keys: (keyof transactionParams)[] = [
      'partyId',
      'contractId',
      'facility_type',
      'facility_type_cf_name',
      'floating_floorplan_facility_name',
      'subFacilityId',
      'credit_line_id',
      'contractId',
    ];

    // Loop through keys and add to params if defined
    keys.forEach((key) => {
      if (transactionFlowParams[key] !== undefined) {
        params[key] = transactionFlowParams[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.paymentCommercial}/transaction_statement`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            const transactions = data?.data?.transactions;
            data?.data?.transactions?.forEach((doc) => {
              doc.paymentDetails = 'View';
            });

            resolve(transactions); // Resolve with modified contract details
          }
        },
        error: (err) => {
          reject(err); // Reject on error
        },
      });
    });
  }

  getPaymentAllocatedDetails(
    paymentAllocationParams: PaymentAllocationParams
  ): Promise<any> {
    //ContractCommercial/
    const params: any = {};
    // List of properties to check and add to params
    const keys: (keyof PaymentAllocationParams)[] = ['partyId', 'paymentId'];

    // Loop through keys and add to params if defined
    keys.forEach((key) => {
      if (paymentAllocationParams[key] !== undefined) {
        params[key] = paymentAllocationParams[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.paymentCommercial}/allocated_transactions`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data?.data?.allocatedTransactions); // Resolve with modified contract details
          }
        },
        error: (err) => {
          reject(err); // Reject on error
        },
      });
    });
  }

  getTransactionAllocatedDetails(
    transAllocationParams: TransactionAllocationParams
  ): Promise<any> {
    //ContractCommercial/
    const params: any = {};
    // List of properties to check and add to params
    const keys: (keyof TransactionAllocationParams)[] = [
      'partyId',
      'transactionId',
    ];

    // Loop through keys and add to params if defined
    keys.forEach((key) => {
      if (transAllocationParams[key] !== undefined) {
        params[key] = transAllocationParams[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.paymentCommercial}/transaction_payment_details`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data?.data?.paymentDetails); // Resolve with modified contract details
          }
        },
        error: (err) => {
          reject(err); // Reject on error
        },
      });
    });
  }

  getLeaseScheduleData(leaseScheduleParams: LeaseScheduleParams): Promise<any> {
    //ContractCommercial/
    const params: any = {};
    // List of properties to check and add to params
    const keys: (keyof LeaseScheduleParams)[] = ['partyId', 'leaseId', 'Flag'];

    // Loop through keys and add to params if defined
    keys.forEach((key) => {
      if (leaseScheduleParams[key] !== undefined) {
        params[key] = leaseScheduleParams[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.paymentCommercial}/rental_schedule`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data?.data); // Resolve with modified contract details
          }
        },
        error: (err) => {
          reject(err); // Reject on error
        },
      });
    });
  }

  postAssetData(assetData: AddAssetsRequestBody): Promise<any> {
    return new Promise((resolve, reject) => {
      this.postDataUrl(
        `${this.baseUrls.TaskCommercial}/add_task_details`,
        assetData
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data?.data); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  postTaskRequest(
    requestBody:
      | RepaymentRequestBody
      | SettlementQuoteRequestBody
      | DrawdownRequestBody
      | NewLoanRequestBody
      | SameDayPayoutRequestBody
      | FloatingFloorplanRepaymentRequest
      | AssetDrawdownRequestBodyTask
      | ServiceRequestBody
      | FixedFloorPlanDrawdownTaskBody
      |ContactUsTaskBody
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.postDataUrl(
        `${this.baseUrls.TaskCommercial}/add_task_details`,
        requestBody
      ).subscribe({
        next: (data) => {
          resolve(data?.data); // Resolve the promise with the response data
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  productTransferRequest(productTransferRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      this.postDataUrl(
        `${this.baseUrls.ServicingRequest}/asset_servicing_request`,
        productTransferRequest
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  postDocuments(docParams: UploadDocsParams, documentBody): Promise<any> {
    return new Promise((resolve, reject) => {
      let queryParam = '';
      if (docParams.contractId) {
        queryParam = `?contractId=${docParams.contractId}`;
      } else if (docParams.partyId) {
        queryParam = `?partyId=${docParams.partyId}`;
      }
      const paramBody = {
        documents: documentBody,
      };
      this.postDataUrl(
        `${this.baseUrls.CommercialDocument}/document${queryParam}`,
        paramBody
      ).subscribe({
        next: (data) => resolve(data?.data), // just return response data
        error: reject,
      });
    });
  }

  getFiAccountInfo(fiAccountInfo: FiAccountInfo): Promise<any> {
    const params: any = {};
    const keys: (keyof FiAccountInfo)[] = ['partyId'];

    keys.forEach((key) => {
      if (fiAccountInfo[key] !== undefined) {
        params[key] = fiAccountInfo[key];
      }
    });

    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.LookupCommercial}/fi_account_info`,
        params
      ).subscribe({
        next: (data) => {
          const errors = data?.apiError?.errors;

          if (Array.isArray(errors) && errors.length > 0) {
            errors.forEach((error) => {
              // this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
            resolve(data);
          } else {
            resolve(data);
          }
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  getLeaseSummaryData(LeaseSummaryParams: LeaseSummaryParams): Promise<any> {
    const params: any = {};
    const keys: (keyof LeaseSummaryParams)[] = ['partyId', 'leaseId'];

    keys.forEach((key) => {
      if (LeaseSummaryParams[key] !== undefined) {
        params[key] = LeaseSummaryParams[key];
      }
    });

    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.paymentCommercial}/rental_summary`,
        params
      ).subscribe({
        next: (data) => {
          const errors = data?.apiError?.errors;

          if (Array.isArray(errors) && errors.length > 0) {
            errors.forEach((error) => {
              // this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data.data);
          }
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  getNotesDetails(NotesDetailsParams: NotesDetailsParams): Promise<any> {
    const params: any = {};
    const keys: (keyof NotesDetailsParams)[] = ['ContractId', 'CSSNote'];

    keys.forEach((key) => {
      if (NotesDetailsParams[key] !== undefined) {
        params[key] = NotesDetailsParams[key];
      }
    });

    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.NoteCommercial}/get_all_notes`,
        params
      ).subscribe({
        next: (data) => {
          const errors = data?.apiError?.errors;

          if (Array.isArray(errors) && errors.length > 0) {
            errors.forEach((error) => {
              console.log(error.messageId);
            });
          } else {
            resolve(data.items);
            console.log('Inside common api service', data.items);
          }
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  getNoteComments(NotesCommentParams: NotesCommentParams): Promise<any> {
    const params: any = {};
    const keys: (keyof NotesCommentParams)[] = [
      'ContractId',
      'noteId',
      'CSSNote',
    ];
    keys.forEach((key) => {
      if (NotesCommentParams[key] !== undefined) {
        params[key] = NotesCommentParams[key];
      }
    });

    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.NoteCommercial}/get_note`,
        params
      ).subscribe({
        next: (data) => {
          const errors = data?.apiError?.errors;

          if (Array.isArray(errors) && errors.length > 0) {
            errors.forEach((error) => {
              console.log(error.messageId);
            });
          } else {
            resolve(data.data?.comments);
            console.log('Inside common api service', data.data.comments);
          }
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  getCurtailmentDetails(
    CurtailmentDetailsParams: CurtailmentDetailsParams
  ): Promise<any> {
    const params: any = {};
    const keys: (keyof CurtailmentDetailsParams)[] = ['Id'];

    keys.forEach((key) => {
      if (CurtailmentDetailsParams[key] !== undefined) {
        params[key] = CurtailmentDetailsParams[key];
      }
    });

    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.assetCommercial}/curtailment_details`,
        params
      ).subscribe({
        next: (data) => {
          const errors = data?.apiError?.errors;

          if (Array.isArray(errors) && errors.length > 0) {
            errors.forEach((error) => {
              console.log(error.messageId);
            });
            // resolve(data);
          } else {
            resolve(data.data);
            console.log('Inside common api service', data);
          }
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  getAssetTransactionDetails(
    AssetTransactionParams: AssetTransactionParams
  ): Promise<any> {
    const params: any = {};
    const keys: (keyof AssetTransactionParams)[] = ['ContractId'];

    keys.forEach((key) => {
      if (AssetTransactionParams[key] !== undefined) {
        params[key] = AssetTransactionParams[key];
      }
    });

    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.assetCommercial}/asset_transaction_stat_details`,
        params
      ).subscribe({
        next: (data) => {
          const errors = data?.apiError?.errors;

          if (Array.isArray(errors) && errors.length > 0) {
            errors.forEach((error) => {
              console.log(error.messageId);
            });
            // resolve(data);
          } else {
            resolve(data?.data?.items || []);
            console.log('API data received:', data?.data?.items);
          }
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  getAssetDetail(assetDetailParam: AssetDetailsParams): Promise<any> {
    const params: any = {};

    // Mapping 'id' (contractId passed from UI) to request params
    if (assetDetailParam.id !== undefined) {
      params['id'] = assetDetailParam.id;
    }

    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.assetCommercial}/asset_details_summary`,
        params
      ).subscribe({
        next: (data) => {
          const errors = data?.apiError?.errors;

          if (Array.isArray(errors) && errors.length > 0) {
            errors.forEach((error) => {
              console.error(error.messageId);
            });
          } else {
            resolve(data.data);
          }
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  getFacilitySummary(facilityParams: FacilitySummaryParams): Promise<any> {
    const params: any = {};
    const keys: (keyof FacilitySummaryParams)[] = [
      'partyNo',
      'facilityType',
      'subFacilityId',
    ];
    keys.forEach((key) => {
      if (facilityParams[key] !== undefined && facilityParams[key] !== null) {
        params[key] = facilityParams[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.paymentCommercial}/facility_summary`,
        params
      ).subscribe({
        next: (data) => {
          const errors = data?.apiError?.errors;
          if (Array.isArray(errors) && errors.length > 0) {
            errors.forEach((error) => {
              console.log(error.messageId);
            });
          } else {
            resolve(data?.Data);
            console.log('In common api service', data.Data);
          }
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  getAllProducts(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getDataUrl(`${this.baseUrls.Product}/get_product`).subscribe({
        next: (data) => {
          const errors = data?.apiError?.errors;
          if (Array.isArray(errors) && errors.length > 0) {
            errors.forEach((error) => {
              console.log(error.messageId);
            });
          } else {
            resolve(data.data);
            console.log('Error loading products API', data.Data);
          }
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  getPaymentForcastPrincipalData(
    ForecastPrincipal: PaymentForcastPrincipalParams
  ): Promise<any> {
    const params: any = {};
    // ${this.baseUrls.paymentCommercial}/
    // List of properties to check and add to params
    const keys: (keyof PaymentForcastPrincipalParams)[] = [
      'partyId',
      'facilityType',
      'subFacilityId',
    ];
    keys.forEach((key) => {
      if (
        ForecastPrincipal[key] !== undefined &&
        ForecastPrincipal[key] !== null
      ) {
        params[key] = ForecastPrincipal[key];
      }
    });

    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.paymentCommercial}/account_forecast_principal`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  postPurchaseAssetRequest(
    purchaseAssetsRequest: PurchaseAssetRequestBody
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.postDataUrl(
        `${this.baseUrls.ServicingRequest}/save_purchase_asset`,
        purchaseAssetsRequest
      ).subscribe({
        next: (data) => {
          resolve(data); // Resolve the promise with the response data
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  getRequestHistoryList(reqHistoryParams: RequestHistoryParams): Promise<any> {
    // const params = {partyId: partyId}
    const params: any = {};
    // List of properties to check and add to params
    const keys: (keyof RequestHistoryParams)[] = [
      'partyNo',
      'contractId',
      'taskId',
    ];

    // Loop through keys and add to params if defined ${this.baseUrls.paymentCommercial}/
    keys.forEach((key) => {
      if (reqHistoryParams[key] !== undefined) {
        params[key] = reqHistoryParams[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.TaskCommercial}/get_task_details`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data.data); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  getPurchaseAsset(
    purchaseAssetParam: SearchPurchaseAssetParams
  ): Promise<any> {
    const params: any = {};
    // ${this.baseUrls.paymentCommercial}/
    // List of properties to check and add to params
    const keys: (keyof SearchPurchaseAssetParams)[] = [
      'PartyNo',
      'SubfacilityId',
    ];
    keys.forEach((key) => {
      if (
        purchaseAssetParam[key] !== undefined &&
        purchaseAssetParam[key] !== null
      ) {
        params[key] = purchaseAssetParam[key];
      }
    });

    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.ServicingRequest}/search_purchase_asset`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data.data); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  postNotesDocuments(docParams: NotesDocsParams, documentBody): Promise<any> {
    return new Promise((resolve, reject) => {
      let queryParam = `${docParams.taskId}`;
      this.postDataUrl(
        `${this.baseUrls.TaskCommercial}/note_and_attachment_for_task?TaskId=${queryParam}`,
        documentBody
      ).subscribe({
        next: (data) => resolve(data?.data), // just return response data
        error: reject,
      });
    });
  }

  getWholesaleAccounts(partyNo: PartyNo): Promise<any> {
    return new Promise((resolve, reject) => {
      this.postDataUrl(
        `${this.baseUrls.ServicingRequest}/get_wholesale_accounts`,
        partyNo
      ).subscribe({
        next: (data) => {
          resolve(data?.data); // Resolve the promise with the response data
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }
  getPrograms(programParams: Program): Promise<any> {
    return new Promise((resolve, reject) => {
      this.postDataUrl(
        `${this.baseUrls.ServicingRequest}/reservation_programs`,
        programParams
      ).subscribe({
        next: (data) => {
          resolve(data?.data); // Resolve the promise with the response data
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  assetDrawdownRequest(
    assetDrawdownRequest
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.postDataUrl(
        `${this.baseUrls.ServicingRequest}/submit_asset_drawdown_request`,
        assetDrawdownRequest
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }
  getTaxRate(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.postDataUrl(
        `${this.baseUrls.ServicingRequest}/get_tax_rate`
      ).subscribe({
        next: (data) => {
          resolve(data?.data?.rate); // Resolve the promise with the response data
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }
  getCustomFieldProgram(programParams: Program): Promise<any> {
    return new Promise((resolve, reject) => {
      this.postDataUrl(
        `${this.baseUrls.ServicingRequest}/get_program`,
        programParams
      ).subscribe({
        next: (data) => {
          resolve(data?.data); // Resolve the promise with the response data
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  getSwapRequestTypeList(swapReqParams: SwapRequestParams): Promise<any> {
    // const params = {partyId: partyId}
    const params: any = {};
    // List of properties to check and add to params
    const keys: (keyof SwapRequestParams)[] = ['inboxViewType','clientId'];

    // Loop through keys and add to params if defined ${this.baseUrls.paymentCommercial}/
    keys.forEach((key) => {
      if (swapReqParams[key] !== undefined) {
        params[key] = swapReqParams[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.ServicingRequest}/get_request_type`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError?.errors.length !== 0) {
            data.apiError?.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data.data); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  getSearchRequestTypeList(swapReqParams: SearchRequestParams): Promise<any> {
    // const params = {partyId: partyId}
    const params: any = {};
    // List of properties to check and add to params
    const keys: (keyof SearchRequestParams)[] = [
      'typeId',
      'transferRequestId',
      'inboxViewType',
    ];

    // Loop through keys and add to params if defined ${this.baseUrls.paymentCommercial}/
    keys.forEach((key) => {
      if (swapReqParams[key] !== undefined) {
        params[key] = swapReqParams[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.ServicingRequest}/search_by_request_type`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data.data); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  getTransferRequestList(
    transferReqParams: TransferRequestParams
  ): Promise<any> {
    // const params = {partyId: partyId}
    const params: any = {};
    // List of properties to check and add to params
    const keys: (keyof TransferRequestParams)[] = ['transferRequestId'];

    // Loop through keys and add to params if defined ${this.baseUrls.paymentCommercial}/
    keys.forEach((key) => {
      if (transferReqParams[key] !== undefined) {
        params[key] = transferReqParams[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.ServicingRequest}/get_transfer_request_details`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data.data); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  getPaymentRequestList(paymentReqParams: PaymentRequestParams): Promise<any> {
    // const params = {partyId: partyId}
    const params: any = {};
    // List of properties to check and add to params
    const keys: (keyof PaymentRequestParams)[] = ['paymentRequestId'];

    // Loop through keys and add to params if defined ${this.baseUrls.paymentCommercial}/
    keys.forEach((key) => {
      if (paymentReqParams[key] !== undefined) {
        params[key] = paymentReqParams[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.ServicingRequest}/get_payment_request_details`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data.data); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  getContractForFloatingRepayment(partyNo: PartyNo): Promise<any> {
    const params: any = {};
    const keys: (keyof PartyNo)[] = ['partyNo'];

    keys.forEach((key) => {
      if (partyNo[key] !== undefined) {
        params[key] = partyNo[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.ServicingRequest}/get_contractId`,
        params
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              console.log(error.messageId);
            });
          } else {
            resolve(data?.data); // Resolve with modified contract details
          }
        },
        error: (err) => {
          reject(err); // Reject on error
        },
      });
    });
  }

  postFloatingRepaymentRequest(
    floatingRepaymentBody: FloatingRepaymentRequest
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.postDataUrl(
        `${this.baseUrls.ServicingRequest}/submit_repayment_request`,
        // `${this.baseUrls.ServicingRequest}/repayment_request`,
        floatingRepaymentBody
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }
  floatingDrawdownRequest(
    floatingDrawdownRequest: FloatingFloorplanDrawdownRequest,
    contractId: ContractIdParams
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let queryParam = `${contractId.contractId}`;
      this.postDataUrl(
        `${this.baseUrls.ServicingRequest}/submit_drawdown_request?contractId=${queryParam}`,
        floatingDrawdownRequest
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }
  logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.postDataUrl(
        `${this.baseUrls.ServicingRequest}/origination_logout`
      ).subscribe({
        next: (data) => {
          resolve(data?.data); // Resolve the promise with the response data
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }
  getProgramDefault(programParams): Promise<any> {
    return new Promise((resolve, reject) => {
      this.postDataUrl(
        `${this.baseUrls.ServicingRequest}/get_program_defaults`,
        programParams
      ).subscribe({
        next: (data) => {
          resolve(data?.data); // Resolve the promise with the response data
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  getProgramsParties(programId: ProgramId): Promise<any> {
    const params: any = {};
    // List of properties to check and add to params
    const keys: (keyof ProgramId)[] = ['programId'];

    keys.forEach((key) => {
      if (programId[key] !== undefined) {
        params[key] = programId[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.ServicingRequest}/get_programs_parties`,
        params
      ).subscribe({
        next: (data) => {
          const errors = data?.apiError?.errors;
          if (Array.isArray(errors) && errors.length > 0) {
            errors.forEach((error) => {
              console.log(error.messageId);
            });
          } else {
            resolve(data?.data);
            console.log('In common api service', data.Data);
          }
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  getAssetDetails(motocheckparams: Motocheck): Promise<any> {
    return new Promise((resolve, reject) => {
      this.postDataUrl(
        `${this.baseUrls.Motocheck}/get_motocheck_evaluation`,
        motocheckparams
      ).subscribe({
        next: (data) => {
          resolve(data?.data); // Resolve the promise with the response data
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  getWholesaleRequestHistoryNotes(noteId: NotesParams): Promise<any> {
    const params: any = {};
    // List of properties to check and add to params
    const keys: (keyof NotesParams)[] = ['noteId'];

    keys.forEach((key) => {
      if (noteId[key] !== undefined) {
        params[key] = noteId[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.ServicingRequest}/get_transfer_note_details`,
        params
      ).subscribe({
        next: (data) => {
          const errors = data?.apiError?.errors;
          if (Array.isArray(errors) && errors.length > 0) {
            errors.forEach((error) => {
              console.log(error.messageId);
            });
          } else {
            resolve(data?.data);
            console.log('In common api service', data.Data);
          }
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  downloadWholesaleRequestHistoryDocuments(
    noteId: NotesDocumentParams
  ): Promise<any> {
    const params: any = {};
    // List of properties to check and add to params
    const keys: (keyof NotesDocumentParams)[] = ['id', 'noteId'];

    keys.forEach((key) => {
      if (noteId[key] !== undefined) {
        params[key] = noteId[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.ServicingRequest}/download_transfer_note`,
        params
      ).subscribe({
        next: (data) => {
          const errors = data?.apiError?.errors;
          if (Array.isArray(errors) && errors.length > 0) {
            errors.forEach((error) => {
              console.log(error.messageId);
            });
          } else {
            resolve(data?.data);
            console.log('Unable to download documents', data.Data);
          }
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  uploadWholesaleRequestHistoryDocuments(documentBody): Promise<any> {
    return new Promise((resolve, reject) => {
      this.postDataUrl(
        `${this.baseUrls.ServicingRequest}/upload_transfer_note`,
        documentBody
      ).subscribe({
        next: (data) => resolve(data?.data), // just return response data
        error: reject,
      });
    });
  }

  postContractNotes(
    contractNotesParams: ContractNotesParams,
    contractNoteBody
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let queryParam = `${contractNotesParams.facilityTypeRequest}`;
      this.postDataUrl(
        `${this.baseUrls.contractCommercial}/add_contract_note?noteType=${queryParam}`,
        contractNoteBody
      ).subscribe({
        next: (data) => resolve(data?.data), // just return response data
        error: reject,
      });
    });
  }

  postSwapActOnRequest(transferParams: TransferRequestParams): Promise<any> {
    const params: any = {};
    // List of properties to check and add to params
    const keys: (keyof TransferRequestParams)[] = [
      'transferRequestId',
      'action',
    ];

    keys.forEach((key) => {
      if (transferParams[key] !== undefined) {
        params[key] = transferParams[key];
      }
    });
    return new Promise((resolve, reject) => {
      this.postDataUrl(
        `${this.baseUrls.ServicingRequest}/swap_act_on_request?transferRequestId=${transferParams.transferRequestId}&action=${transferParams.action}`
      ).subscribe({
        next: (data) => {
          resolve(data?.data); // Resolve the promise with the response data
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  generateCustomerStatement(
    generateCustomerStatementParams: AssetTransactionParams,
    customerStatementBody: CustomerStatementBody
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let queryParam = `${generateCustomerStatementParams.ContractId}`;
      this.postDataUrl(
        `${this.baseUrls.CommercialDocument}/Print_Document?ContractId=${queryParam}`,
        customerStatementBody
      ).subscribe({
        next: (data) => resolve(data?.data),
        error: reject,
      });
    });
  }

  getSearchAddress(physicalSearchValue: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!physicalSearchValue || physicalSearchValue.length < 4) {
        resolve([]); // return empty list if input too short
        return;
      }

      this.getDataUrl(
        `${this.baseUrls.customerCommercial}/search_address_commercial?AddressSearch=${physicalSearchValue}`
      ).subscribe({
        next: (data) => {
          const errors = data?.apiError?.errors;
          if (Array.isArray(errors) && errors.length > 0) {
            errors.forEach((error) => console.error(error.messageId));
            reject(errors);
          } else {
            // Assuming your backend returns something like { items: [...] }
            const items = data?.data?.items || data?.items || [];
            const mapped = items.map((ref: any) => ({
              street: ref?.street,
              value: ref?.addressId,
            }));
            resolve({ mapped, items });
          }
        },
        error: (err) => {
          console.error('Error fetching search address:', err);
          reject(err);
        },
      });
    });
  }

  postExternalAddressLookupKey(
    externalAddressLookupKey: string
  ): Promise<string> {
    const params = {
      externalAddressLookupKey: externalAddressLookupKey,
    };

    return new Promise((resolve, reject) => {
      this.postDataUrl(
        `${this.baseUrls.customerCommercial}/external_addresses_commercial`,
        params
      ).subscribe({
        next: (res) => {
          try {
            const addressDetails = res?.data?.data;
            if (!addressDetails) {
              reject('No address details found');
              return;
            }

            const {
              street,
              suburb,
              zipCode,
              city,
              countryRegion,
              addressComponents,
            } = addressDetails;

            // Create a map of components
            const componentMap = new Map<string, string>();
            addressComponents?.forEach((comp) => {
              if (comp?.value?.trim()) {
                componentMap.set(comp.type, comp.value);
              }
            });

            // Build address string from components
            const componentAddress = [
              componentMap.get('BuildingName'),
              componentMap.get('UnitType'),
              componentMap.get('UnitLot'),
              componentMap.get('FloorType'),
              componentMap.get('FloorNo'),
              componentMap.get('StreetNo'),
              componentMap.get('StreetName'),
              componentMap.get('StreetType'),
              componentMap.get('StreetDirection'),
              componentMap.get('RuralDelivery'),
            ]
              .filter(Boolean)
              .join(' ')
              .replace(/\s+/g, ' ')
              .trim();

            // Use street if component-based address is empty
            const finalStreet = componentAddress || street;

            // Build full address
            const fullAddress = [
              finalStreet,
              suburb,
              city?.extName,
              zipCode,
              countryRegion?.extName,
            ]
              .filter(Boolean)
              .join(', ');

            console.log('Full Address:', fullAddress);

            resolve(fullAddress);
          } catch (err) {
            reject('Error while parsing address: ' + err);
          }
        },
        error: (err) => {
          console.error('Error fetching external address:', err);
          reject(err);
        },
      });
    });
  }

  getContractStatus(contractId: AssetTransactionParams): Promise<any> {
    return new Promise((resolve, reject) => {
      let queryParam = `${contractId.ContractId}`;
      this.postDataUrl(
        `${this.baseUrls.ServicingRequest}/get_contract_status?ContractId=${queryParam}`
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  getRoleBasedActions(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getDataUrl(`RolePermissions/RolePermissionsNew`).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data.data); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

    postContractIdForRepayment(
   floatingRepaymentBody
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.postDataUrl(
        `${this.baseUrls.ServicingRequest}/get_repayment_request`,
        floatingRepaymentBody
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data?.data); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

   getContractIdForFloatingFloorPlan(
   floatingDrawdownBody
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.ServicingRequest}/get_drawdown_request`,
        floatingDrawdownBody
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data?.data); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  newAssetDrawdownRequest(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.postDataUrl(
        `${this.baseUrls.ServicingRequest}/new_asset_drawdown_request`
      ).subscribe({
        next: (data) => {
          resolve(data?.data); // Resolve the promise with the response data
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

    newAssetServicingRequest(transferRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      this.postDataUrl(
        `${this.baseUrls.ServicingRequest}/new_asset_servicing_request`,
        transferRequest
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }
   saveAssetServicingRequest(transferRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      this.postDataUrl(
        `${this.baseUrls.ServicingRequest}/save_asset_servicing_request`,
        transferRequest
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }
    searchPaymentRequestAsset(date): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.ServicingRequest}/search_payment_request_asset?date=${date}`
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              console.log(error.messageId);
            });
          } else {
            resolve(data); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }
  saveIntroducerPaymentRequest(paymentRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      this.postDataUrl(
        `${this.baseUrls.ServicingRequest}/save_payment_request`,
        paymentRequest
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              //this.commonSvc?.ui?.showError(error.messageId);
              console.log(error.messageId);
            });
          } else {
            resolve(data); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  getCutOffTimeCompare(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.ServicingRequest}/get_date_time`,
      ).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              console.log(error.messageId);
            });
          } else {
            resolve(data.data); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

   getIntroducerPaymentTransaction(paymentTransParams): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.paymentCommercial}/get_introducer_payment_trans?partyNo=${paymentTransParams}`,
      paymentTransParams).subscribe({
        next: (data) => {
          if (data.apiError.errors.length !== 0) {
            data.apiError.errors.forEach((error) => {
              console.log(error.messageId);
            });
          } else {
            resolve(data.data); // Resolve the promise with the response data
          }
        },
        error: (err) => {
          reject(err); // Reject the promise on error
        },
      });
    });
  }

  getReportParametersById(reportId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getDataUrl(
        `${this.baseUrls.DocumentService}/getDynamicParametersByReportId?ReportId=${reportId}`
      ).subscribe({
        next: (data) => {
          if (data?.apiError?.errors?.length !== 0) {
            data?.apiError?.errors?.forEach((error) => {
              console.log(error.messageId);
            });
          }
          resolve(data?.data);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  getReportsList(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getDataUrl(`${this.baseUrls.DocumentService}/getAccessibleReportList`).subscribe({
        next: (data) => {
          if (data?.apiError?.errors?.length !== 0) {
            data?.apiError?.errors?.forEach((error) => {
              console.log(error.messageId);
            });
          }
          resolve(data?.data);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  downloadReport(payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.postDataUrl(`${this.baseUrls.DocumentService}/reportInvoke`, payload).subscribe({
        next: (data) => {
          if (data?.apiError?.errors?.length !== 0) {
            data?.apiError?.errors?.forEach((error) => {
              console.log(error.messageId);
            });
          }
          resolve(data?.data);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }
}
