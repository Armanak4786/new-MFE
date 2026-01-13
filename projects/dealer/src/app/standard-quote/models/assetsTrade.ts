export interface PhysicalAsset {
  id?: number;
  assetId?: string;
  assetPath?: string;
  assetName?: string | null;
  assetType?: {
    assetTypeId?: number,
    assetTypeName?: string,
    assetTypePath?: string
  },
  make?: string;
  model?: string;
  year?: number;
  conditionOfGood?: string;
  variant?: string | null;
  regoNumber?: string;
  vin?: string;
  serialChassisNumber?: string;
  costOfAsset?: number;
  odometer?: number;
  colour?: string;
  ccRating?: string;
  insurer?: string;
  engineNumber?: string;
  chassisNumber?: string | null;
  motivePower?: string;
  countryFirstRegistered?: string,
  location?: string,
  assetLocationOfUse?: string,
  supplierName?: string,
  assetLeased?: string;
  vehicle?: any;
  vehicleClassId?: any;
  features?: any;
  description?: any;
  copyasset?: boolean;
  isEdited?: boolean;
}

export interface Insurance {
  id: number,
  partyId?: number,
  partyNo?:any
  insurer: string,
  broker: string,
  amtNetAnnualPremium: number,
  amtTaxOnAnnualPremium: number,
  grossAnnualPremium: number,
  policyNumber: string,
  sumInsured: number,
  policyExpiryDate: string,
  // mobileNumber: string,
  currency?: any,
  email?: any,
  localNumber?:any,
  phoneCode?:any,
  assetHdrInsuranceId:any
}

export interface TradeAsset {
    id?: number;
  tradeId?: string;
  tradeName?: string;
  tradePath?: string;
  tradeType?: {
    tradeTypeId?: number,
    tradeTypeName?: string,
    tradeTypePath?: string
  },
  tradeAssetValue: string;
  conditionOfGood?: string;
  tradeCCNo: string;
  tradeColour?: string;              // e.g. "White"
  tradeEngineNo: string;            // e.g. "678978"
  tradeMake: string | null;         // e.g. "", nullable
  tradeModel?: string | null;
  tradeMotivePower: string | null;  // e.g. "", nullable
  tradeOdometer: string | null;     // e.g. "", nullable
  tradeRegoNo: string | null;       // e.g. "", nullable
  tradeSerialOrChassisNo: string | null; // e.g. "", nullable
  tradeVariant: string | null;      // e.g. "", nullable
  tradeVinNo: string | null;        // e.g. "", nullable
  tradeYear: string;                // e.g. "1" (consider validating year format)
  tradeSupplierName?: string;
  changeAction?:string
  isExist ? : boolean;
  rowNo ? : number;
  assetTrade?: boolean;
}

export enum TradeInAssetChangeActions {
    create = 'create',
    update = 'update',
    delete='delete',
    none = 'none'
}
