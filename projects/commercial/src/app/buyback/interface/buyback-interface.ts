// Interface for Lease Details
export interface ILeaseDetail {
  leaseId: number;
  productType: string;
  descriptionOfAsset: string; // Note: Removed trailing space for consistency
  serialNumber?: string;
  registrationNumber?: string;
  vehicleIdentificationNumber?: string;
  chassisNumber?: string;
  usagePerAnnum?: string;
  totalRentalAmount?: string;
  startDate?: string;
  endDate?: string; // Note: Removed trailing space for consistency
  leaseTerm?: number;
  assetNumber?: number;
  fullyMaintained?: boolean;
  residualValue?: number;
  gst?: number;
  butBackAmount?: number;
  butBackAmountWithGst?: number;
  originator?: string;
  totalUnitUsage?: string;
  allocatedAmount?: number;
}

// Interface for Warnings
export interface IWarning {
  messageId: string;
  message: string;
  messageArguments: any[]; // Adjust type as needed for message arguments
}

// Interface for Info
export interface IInfo {
  messageId: string;
  message: string;
  messageArguments: any[]; // Adjust type as needed for message arguments
}

// Interface for the Data structure
export interface ILeaseData {
  leaseDetails: ILeaseDetail[];
  warnings?: IWarning[];
  values?: string; // Adjust type if necessary
  info?: IInfo[];
}

// Main Interface for the Leases structure
export interface ILeases {
  data: ILeaseData;
}

export interface IBuyBackFacilityData {
  id: string;
  noOfLeases: string;
  limit: number;
  currentBalance: number;
  availableFunds: number;
  repaymentsAmountDueToday: number;
  newLoanAmountDueToday: number;
}

export interface IBuyBackFacilityResponse {
  data: IBuyBackFacilityData;
}

export interface IBuyBackFacilityDataColumn {
  field: string;
  headerName: string;
  class?: string;
  format?: string;
}
