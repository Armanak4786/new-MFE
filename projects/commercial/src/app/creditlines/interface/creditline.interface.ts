// account-forecast.interface.ts

export interface IWarning {
  messageId?: string;
  message?: string;
  messageArguments?: any[]; // Adjust type if you know the specific structure of the arguments
}

export interface IAccountForecast {
  month?: string;
  securityValue?: number;
  accountBalance?: number;
  availableFunds?: number;
}

export interface IAccountForecastData {
  lastMonthPrincipal?: number;
  lastMonthInterest?: number;
  accountForecasts?: IAccountForecast[];
  warnings?: IWarning[];
}

export interface IAccountForecastResponse {
  data: IAccountForecastData;
}

export interface AccountForecastColumn {
  field: string;
  headerName: string;
  class?: string; // Optional, as not all columns may have a class
  format?: string; // Optional, as not all columns may have a format
}

export interface PaymentForecastColumn {
  field: string;
  headerName: string;
  headerAction?: string;
  class?: string;
  format?: string;
}

export interface PaymentForecast {
  month: string; // e.g., "2025-03"
  principal: number; // e.g., 123.0
  interest: number; // e.g., 2345.0
  amount: number; // e.g., 4566.8
}

export interface Info {
  messageId: string; // e.g., "12"
  message: string; // e.g., ""
  messageArguments: any[]; // Array of arguments, can be of any type
}

export interface PaymentForecastData {
  paymentForecasts: PaymentForecast[]; // Array of payment forecasts
  warnings?: IWarning[]; // Array of warnings
  values?: string; // e.g., ""
  info?: Info[]; // Array of info messages
}

export interface IPaymentForecastResponse {
  data: PaymentForecastData;
}

interface DocumentDetail {
  id: number;
  name: string;
  category: string;
  type: string;
  partyId: number;
  partyName?: string;
  facilityType?: string;
  contactId: number;
  loadedOn?: string; // You might want to use Date type if you parse this
  loadedBy?: string; // Same as above
  source?: string;
  status?: string;
  warnings?: IWarning[];
  values?: string;
  info?: Info[];
}

interface DocumentsData {
  documentDetails: DocumentDetail[];
  warnings?: IWarning[];
  values: string;
  info: Info[];
}

export interface IDocuments {
  data: DocumentsData;
}

export interface DocumentColumn {
  field: string;
  headerName: string;
  format?: string; // Optional, as not all columns may have a format
  actions?: string; // Optional, as not all columns may have actions
}

interface FacilityAssetDetails {
  contractId: number;
  assetNo: number;
  description?: string;
  serialNumber?: string;
  registrationNumber?: string;
  vehicleIdentificationNumber?: string;
  chassisNumber?: string;
  lastValuedDate?: Date; // or string, depending on your date format
  valuation: number;
  ssv?: number;
  costPrice?: number;
  program: string;
  invoiceDate?: Date; // or string, depending on your date format
  make: string;
  model: string;
  expiryDate: Date; // or string, depending on your date format
  currentBalance: number;
  assetStatus: string;
  usageType?: number;
  usagePerAnnum?: number;
  excessUsageAllowance?: number;
  excessUsageCharge?: number;
}

export interface IFacilityAssetResponse {
  facilityAssetDetails: FacilityAssetDetails;
  warnings: IWarning[];
  values: string;
  info: Info[];
}

interface LoansDetail {
  contractId: number;
  productType: string;
  maturityDate?: string; // Use Date if you want to convert it later
  nextRepriceDate?: string; // Use Date if you want to convert it later
  initialLoanAmount?: number;
  interestRate?: number;
  costPrice?: number;
  principalInterest?: number;
  principalBalance?: number;
  nextPaymentAmount: number;
  startDate?: string; // Use Date if you want to convert it later
  loanDate?: string; // Use Date if you want to convert it later
  loanTerm: number;
  interestCharge: number;
  goodsDescription: string;
  assuredResidualValue: number;
  futureValueAmount?: number;
  futureValueDate?: string; // Use Date if you want to convert it later
  maximumPermitted?: number;
  customerDecision?: string;
  gstExclude?: number;
  gst: number;
  gstInclude: number;
}

export interface ILoansResponse {
  loansDetails: LoansDetail[];
  warnings: IWarning[];
  values: string;
  info: Info[];
}

interface Revision {
  interestRate: number;
  interestDate: string; // ISO 8601 date format
}

export interface InterestRateData {
  revisions: Revision[];
  warnings: IWarning[];
  values: string; // Assuming this can be a string or null
  info: Info[];
}

interface PartyDetail {
  id: number;
  name: string;
  role: string;
  type: string;
}

export interface LeasePartiesData {
  partyDetails: PartyDetail[];
  warnings: IWarning[];
  values: string; // Assuming this can be a string or null
  info: Info[];
}

interface Payment {
  id: number;
  date: string; // ISO 8601 date format
  method: string;
  frequency: string;
  amountReceived: number;
  reason: string;
  allocatedAmount: string; // Assuming this can be a string or null
  isRejected: boolean;
}

interface PaymentStatementsData {
  payments: Payment[];
  warnings: IWarning[];
  values: string; // Assuming this can be a string or null
  info: Info[];
}

export interface PaymentStatements {
  data: PaymentStatementsData;
}
export interface ICreditlineFacilityData {
  contractId: string;
  id: string;
  facilityName: string;
  limit: number;
  currentBalance: number;
  availableFunds: number;
}

export interface ICreditlineFacilityResponse {
  data: ICreditlineFacilityData;
}

export interface ICreditlineFacilityColumn {
  field: string;
  headerName: string;
  class?: string;
  format?: string;
  action?: string;
}

export interface transactionFlowPaymentsData {
  paymentDate: string;
  paymentMethod: string;
  paymentAmountReceived: number;
  reason: string;
  allocationDetails: string;
  isRejected: boolean;
  id: number;
}

export interface transactionFlowPaymentsResponse {
  warnings: IWarning[];
  values: string;
  info: Info[];
  data: transactionFlowPaymentsData;
}

export interface transactionFlowPaymentsResponseColumn {
  field: string;
  headerName: string;
  class?: string;
  format?: string;
  action?: string;
  headerAction?: string;
}

export interface transactionFlowTransactions {
  transactionDate: string;
  transactionType: string;
  status: string;
  transactionAmount: number;
  overdueAmount: number;
  paymentDetails: string;
  id: number;
}

export interface transactionFlowTransactionsResponse {
  data: transactionFlowTransactions;
  warnings: IWarning[];
  values: string;
  info: Info[];
}

export interface transactionFlowTransactionsResponseColumn {
  field: string;
  headerName: string;
  class?: string;
  format?: string;
  action?: string;
  headerAction?: string;
}

export interface transactionsallocationData {
  id: number;
  date: string;
  amount: number;
  paymentMethod: string;
}

export interface transactionsallocationResponse {
  data: transactionsallocationData;
  warnings: IWarning[];
  values: string;
  info: Info[];
}

export interface transactionsallocationResponseColumn {
  field: string;
  headerName: string;
  class?: string;
  format?: string;
  headerAction?: string;
}

export interface allocatedTransactionsData {
  id: number;
  date: string;
  description: string;
  allocatedAmount: number;
}

export interface allocatedTransactionsDataResponse {
  data: allocatedTransactionsData;
  warnings: IWarning[];
  values: string;
  info: Info[];
}

export interface allocatedTransactionsResponseColumn {
  field: string;
  headerName: string;
  class?: string;
  format?: string;
  headerAction?: string;
}

export interface newLoanRequestData {
  facilityType: string;
  facility: string;
  partyId: string;
  contractId: string;
  drawdownDetails: {
    purchasePrice: number;
    lessDeposit: number;
    // workingCapital: 232.00,
    requestDate: Date;
    payNewLoanOutOn: Date;
    totalNewLoanAmount: number;
    disburseFundsTo: string;
    disbursementDetails: {
      suppliers: [supplierName: string, amount: number];
      assets: [description: string];
      nominatedBankAccount: {
        accountNumber: string;
        amount: number;
      };
    };
    uploadDocuments: [];
    remarks: string;
  };
}
