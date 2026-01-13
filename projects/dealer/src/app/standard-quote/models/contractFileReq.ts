interface Location {
  locationId: number;
  extName: string;
  locationType: string;
}

interface TaxProfile {
  code: string;
  id: number;
  name: string;
}

interface AssetType {
  assetTypeId: number;
  assetTypePath: string;
  assetTypeName: string;
}

interface FinancialAsset {
  id: number;
  assetId: number;
  assetName: string;
  assetType: AssetType;
  amtFinancedTotal: number;
  taxesAmt: number;
  cost: number;
  serialNo: string;
  assetDescription: string;
  colour: string;
  yearOfManufacture: number;
  condition: string;
  cashPriceofAnAsset: number;
}

interface PhysicalAsset {
  id: number;
  assetId: string;
  assetName: string;
  assetType: AssetType;
  make: string;
  model: string;
  year: number;
  conditionOfGood: string;
  variant: string;
  regoNumber: string;
  vin: string;
  serialChassisNumber: string;
  costOfAsset: number;
}

interface Registration {
  id: number;
  name: string;
  code: string;
  amount: number;
  reference: string;
}

interface ExtendedWarranty {
  id: number;
  months: string;
  amount: number;
  provider: string;
}

interface ServicePlan {
  id: number;
  name: string;
  code: string;
  amount: number;
  reference: string;
}

interface Accessory {
  id: number;
  name: string;
  code: string;
  amount: number;
  reference: string;
}

interface Other {
  id: number;
  name: string;
  code: string;
  amount: number;
}

interface MotorVehicleInsurance {
  id: number;
  months: string;
  amount: number;
  provider: string;
}

interface GuaranteeAssetProtection {
  id: number;
  months: string;
  amount: number;
  provider: string;
}

interface ConsumerCreditInsurance {
  id: number;
  months: string;
  amount: number;
  provider: string;
}

interface MechanicalBreakdownInsurance {
  id: number;
  months: string;
  amount: number;
  provider: string;
}

interface FinancialAssetLease {
  id: number;
  startDate: string;
  matureDate: string;
  balloonDate: string;
  amtFinancedTotal: number;
  totalAmtFinancedTax: number;
  amtBaseRepayment: number;
  amtTotalInterest: number;
  term: number;
  estimatedCommissionSubsidy: number;
  establishmentFeeShare: number;
  balloonAmount: number;
  balloonPct: number;
  fixed: boolean;
  paymentAmount: number;
  residualValue: number;
  paymentSchedule: number;
  totalInterest: number;
  totalCost: number;
  isFixed: boolean;
  udcEstablishmentFee: number;
  dealerOriginationFee: number;
  totalEstablishmentFee: number;
  charges: number;
  tradeAmount: number;
  settlementAmount: number;
  netTradeAmount: number;
  registrations: Registration[];
  extendedWarranty: ExtendedWarranty;
  servicePlan: ServicePlan[];
  subTotalAddOns: number;
  accessories: Accessory[];
  other: Other[];
  motorVehicleInsurance: MotorVehicleInsurance;
  guaranteeAssetProtection: GuaranteeAssetProtection;
  consumerCreditInsurance: ConsumerCreditInsurance;
  mechanicalBreakdownInsurance: MechanicalBreakdownInsurance;
  loanMaintenanceFee: number;
  totalAmountBorrowedIncGST: number;
  totalAmountBorrowed: number;
  interestCharge: number;
}

interface FinancialAssetInsurance {
  id: number;
  insurer: string;
  broker: string;
  sumInsured: number;
  policyNumber: string;
  policyExpiryDate: string;
  mobileNumber: string;
  email: string;
}

interface CustomField {
  name: string;
  value: string;
}

interface CustomFieldGroup {
  name: string;
  items: {
    rowNo: number;
    customFields: CustomField[];
  }[];
}

export interface contractRequestBody {
  isDraft: boolean;
  location: Location;
  taxProfile: TaxProfile;
  product: {
    productId: number;
    productCode: string;
    extName: string;
  };
  program: {
    programId: number;
    programCode: string;
    lookupName: string;
    extName: string;
  };
  calcDt: string;
  financialAssets: FinancialAsset[];
  physicalAsset: PhysicalAsset;
  financialAssetLease: FinancialAssetLease;
  financialAssetInsurance: FinancialAssetInsurance;
  deposit: number;
  loanAmount: number;
  amoutFinanced: number;
  totalAmountBorrowed: number;
  inclOfGST: number;
  frequency: string;
  lastPayment: string;
  promotionQuote: string;
  quoteType: string;
  originatorName: string;
  originatorNumber: string;
  salesPerson: string;
  originatorReference: string;
  baseInterestRate: number;
  estimatedCommissionSubsidy: number;
  establishmentFeeShare: number;
  interestRate: number;
  loanDate: string;
  firstPaymentDate: string;
  paymentStructure: string;
  totalTermMonths: number;
  totalTermDays: number;
  asset: string;
  regoVIN: string;
  value: number;
  insurer: string;
  ppsrPercentage: number;
  extendedWarrantyMonth: number;
  servicePlanMonths: number;
  mechanicalBreakdownMonth: number;
  udcEstablishmentFee: number;
  dealerOriginationFee: number;
  cashDeposit: number;
  tradeAmount: number;
  settlementAmount: number;
  calculateSettlement: number;
  netTradeAmount: number;
  loanMaintenanceFee: number;
  weiveLMF: boolean;
  make: string;
  model: string;
  variant: string;
  conditionOfGood: string;
  motivePower: string;
  countryFirstRegistered: string;
  assetLocationOfUse: string;
  supplierName: string;
  assetInsuranceProvider: string;
  assetInsuranceAmount: number;
  assetInsuranceMonths: number;
  assetInsuranceName: string;
  ppsrCount: number;
  customFieldGroups: CustomFieldGroup[];
}
