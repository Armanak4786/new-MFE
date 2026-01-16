export interface IOperatingLeaseFacilityData {
  id: string;
  noOfLeases: string;
  totalMonthlyPayment: number;
  repaymentsAmountDueToday: number;
  newLoanAmountDueToday: number;
}

export interface IOperatingLeaseFacilityResponse {
  data: IOperatingLeaseFacilityData;
}

export interface IOperatingLeaseFacilityColumn {
  field: string;
  headerName: string;
  class?: string;
  format?: string;
}

interface DocumentDetail {
  id: number;
  name: string;
  category: string;
  type: string;
  partyId: number;
  partyName: string;
  facilityType: string;
  contactId: number;
  loadedOn: string; // You might want to use Date type if you parse this
  loadedBy: string; // Same as above
  source: string;
  status: string;
  warnings: IWarning[];
  values: string;
  info: Info[];
}

interface DocumentsData {
  documentDetails: DocumentDetail[];
  warnings: IWarning[];
  values: string;
  info: Info[];
}
export interface Info {
  messageId: string; // e.g., "12"
  message: string; // e.g., ""
  messageArguments: any[]; // Array of arguments, can be of any type
}

export interface IWarning {
  messageId: string;
  message: string;
  messageArguments: any[]; // Adjust type if you know the specific structure of the arguments
}

export interface IDocuments {
  data: DocumentsData;
}

interface FacilityAssetDetails {
  contractId: number;
  assetNo: number;
  description: string;
  serialNumber: string;
  registrationNumber: string;
  vehicleIdentificationNumber: string;
  chassisNumber: string;
  lastValuedDate: Date; // or string, depending on your date format
  valuation: number;
  ssv: number;
  costPrice: number;
  program: string;
  invoiceDate: Date; // or string, depending on your date format
  make: string;
  model: string;
  expiryDate: Date; // or string, depending on your date format
  currentBalance: number;
  assetStatus: string;
  usageType: number;
  usagePerAnnum: number;
  excessUsageAllowance: number;
  excessUsageCharge: number;
}

export interface IFacilityAssetResponse {
  facilityAssetDetails: FacilityAssetDetails;
  warnings: IWarning[];
  values: string;
  info: Info[];
}

export interface DocumentColumn {
  field: string;
  headerName: string;
  format?: string; // Optional, as not all columns may have a format
  actions?: string; // Optional, as not all columns may have actions
}

export interface InterestRateData {
  revisions: Revision[];
  warnings: IWarning[];
  values: string; // Assuming this can be a string or null
  info: Info[];
}

interface Revision {
  interestRate: number;
  interestDate: string; // ISO 8601 date format
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
