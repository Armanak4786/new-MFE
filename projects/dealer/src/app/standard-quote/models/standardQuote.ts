// import { PhysicalAsset } from './assetsTrade';

export interface FinancialAsset {
  id: number;
  amtFinancedTotal: number;
  assetDescription: string; // phy
  assetId: number;
  assetName: string;
  assetType: AssetType;
  cashPriceofAnAsset: number;
  colour: string;
  condition: any;
  cost: number;
  serialNo: string;
  taxesAmt: number;
  yearOfManufacture: number;
  assetLeased?: string;
  physicalAsset: PhysicalAsset | {};
  cashDeposit?: number;
  cashDepositId?: number;
  udcEstablishmentFee?: number;
  udcEstablishmentFeeId?: number;
  dealerOriginationFee?: number;
  dealerOriginationFeeId?: number;
  isInputAsPercent?: boolean;
  insuranceDetails?: any;
}

export interface PhysicalAsset {
  id: number;
  assetId: string | null;
  assetName: string;
  make: string;
  model: string;
  category: string;
  bodyInfo: string;
  year: number;
  conditionOfGood: string;
  variant: string | null;
  regoNumber: string;
  vin: string;
  odometer: number;
  serialChassisNumber: string;
  costOfAsset: number;
  ccRating: string;
  engineNumber: string;
  chassisNumber: string | null;
  vehicle: {
    assetClassId: number;
  };
}

export interface AssetType {
  assetTypeId: number;
  assetTypeName: string;
  assetTypePath: string;
}
