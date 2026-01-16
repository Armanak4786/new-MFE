export interface IWarning {
  messageId?: string;
  message?: string;
  messageArguments?: any[]; // Adjust type if you know the specific structure of the arguments
}

export interface Info {
  messageId: string; // e.g., "12"
  message: string; // e.g., ""
  messageArguments: any[]; // Array of arguments, can be of any type
}

export interface nonFacilityLoan {
  contractId: string;
  id: string;
  noOfLoans: string;
  facilityName: string;
  limit: number;
  currentBalance: number;
  remainingLimit: number;
  repaymentsAmountDueToday: number;
  newLoanAmountDueToday: number;
}

export interface nonFacilityLoanResponse {
  data: nonFacilityLoan;
}

export interface nonFacilityLoanColumn {
  field: string;
  headerName: string;
  class?: string;
  format?: string;
  headerAction?: string;
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
