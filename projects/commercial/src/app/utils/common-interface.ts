export interface AssetsParams {
  partyId: number;
  facilityType?: string;
  subFacilityId?: number;
  contractId?: number;
  searchText?: string;
  exculdeDealTypeId?: string;
  exculdeGroupType?: string;
}

export interface AccountForecastParams {
  partyId: number;
  facilityType?: string;
  facilityTypeCFname?: string;
  subFacilityId?: number;
  contractId?: number;
}

export interface PaymentForcastParams {
  facilityTypeCFname?: string;
  partyId: number;
  facilityType: string;
  repaymentFrequency?: string;
  fromDate?: string;
  frequency?: string;
  toDate?: string;
  contractId?: number;
  subFacilityId?: string;
}

export interface LoanParams {
  partyId: number;
  facilityType?: string;
  contractId?: string;
  subFacilityId?: any;
  OperatingLeaseProductGroup?: any;
}

export interface PiScheduleParams {
  partyId: number;
  contractId: number;
}

export interface DocumentsParams {
  partyId?: number;
  contractId?: number;
}

export interface UploadDocsParams {
  partyId?: number;
  contractId?: number;
}
export interface LoanPartiesParams {
  partyId: number;
  contractId?: number;
  leaseId?: number;
}

export interface CurrentPositionParams {
  partyId: number;
  contractId: number;
}

export interface InterestRateParams {
  partyId: number;
  contractId: number;
}
export interface PaymentSummaryParams {
  partyId: number;
  contractId: number;
}

export interface transactionParams {
  partyId: number;
  facility_type?: string;
  facility_type_cf_name?: string;
  floating_floorplan_facility_name?: string;
  credit_line_id?: string;
  subFacilityId?: string;
  contractId?: string;
}

export interface PaymentAllocationParams {
  partyId?: number;
  paymentId: number;
}

export interface TransactionAllocationParams {
  transactionId: number;
  partyId?: number;
}

export interface DocumentByIdParams {
  partyId?: number;
  contractId?: number;
  documentId: number;
}

export interface TaskDocumentByIdParams {
  noteId: number;
  attachmentId: number;
}

export interface LeaseScheduleParams {
  partyId: number;
  leaseId?: number;
  Flag?: Boolean;
}

export interface LeaseParams {
  partyId: number;
  facilityType?: string;
  BuybackfacilityType?: string;
  // leaseId:number;
}

export interface Assetsdata {
  facilityType: string;
  partyId: number;
  assets: Asset[];
  uploadDocuments: Document[];
  remarks: string;
}

interface Asset {
  stockNumber: string;
  description: string;
  purchasePrice: number;
}

interface Document {
  file: Blob;
  category: string;
  name: string;
}

export interface RepaymentObject {
  partyId: number;
  facilityType: string;
  facility: string;
  contractId: number;
  requestType: string;
  requestDetails: {
    paymentAmount: number;
    requestDate: string;
    disburseFundsTo: string;
    paymentDetails: {
      fiBankAccount: string;
      contractId: number;
    };
  };
  uploadDocuments: {
    files: File[];
    remarks: string;
  }[];
}

export interface assetIdArray {
  value: string;
}

export interface releaseReason {
  reason: string;
  amount?: number;
}

export interface GeneratedDoc {
  generatedDocId: number;
  docStatus: string;
}

export interface DocumentUploadRequest {
  file: string; // base64 string
  documentId: number;
  name: string;
  category: string;
  description: string;
  type: string;
  loaded: string; // ISO string format (e.g., new Date().toISOString())
  loadedBy: string;
  source: string;
  isDocumentDeleted: boolean;
  documentProvider: string;
  securityClassification: string;
  reference: string;
  generatedDocs: GeneratedDoc[];
}

export interface FileDetail {
  fileContents: string;
  contentType: string;
  fileDownloadName: string;
}
export interface FiAccountInfo {
  partyId: number;
  // contractId: number;
}

export interface LeaseSummaryParams {
  partyId: number;
  leaseId: number;
}

export interface CurtailmentDetailsParams {
  Id: number;
}

export interface NotesDetailsParams {
  ContractId: number;
  CSSNote: Boolean;
}

export interface NotesCommentParams {
  ContractId: number;
  noteId: number;
  CSSNote: Boolean;
}

export interface AssetTransactionParams {
  ContractId: number;
}
export interface AssetDetailsParams {
  id: number;
}

//Common BaseRequest interface using Generics
export interface BaseRequest<T> {
  party: {
    partyNo: number;
  };
  customerName?: string;
  subject?: string;
  status?: string;
  taskType: string;
  comments?: string;
  externalData: T;
  apTaskNoteAttachmentRequest?: ApTaskNoteAttachmentRequest;
}

//Shared fields for all externalData types
export interface BaseExternalData {
  subjectLine?: string;
}

export interface AddAssetsExternalData extends BaseExternalData {
  addAssetsRequest: AddAssetsRequest;
}
export interface RepaymentExternalData extends BaseExternalData {
  repaymentRequest: RepaymentRequestB;
}
export type RepaymentRequestBody = BaseRequest<RepaymentExternalData>;

export interface FloatingRepaymentExternalData extends BaseExternalData {
  floatingfloorplanrepaymentRequest: FloatingFloorplanRepaymentRequest;
}
export type FloatingRepaymentRequestBody =
  BaseRequest<FloatingRepaymentExternalData>;

export interface SettlementQuoteExternalData extends BaseExternalData {
  settlementQuoteRequest: SettlementQuoteReqBody;
}
export type SettlementQuoteRequestBody =
  BaseRequest<SettlementQuoteExternalData>;

// AddAssetsRequestBody = BaseRequest with AddAssetsExternalData
export type AddAssetsRequestBody = BaseRequest<AddAssetsExternalData>;

export interface AddAssetsRequest {
  facilityType: string;
  partyId: number;
  assets: Assets[];
  remarks: string;
  requestNo?: string;
  subject?: string;
  status?: string;
}

export interface Assets {
  stockNumber: string;
  assetDescription: string;
  purchasePrice: number;
}

export interface ApTaskNoteAttachmentRequest {
  comments?: string;
  subject?: string;
  apAttachmentFiles: ApAttachmentFile[];
}

export interface ApAttachmentFile {
  file: string;
  fileName: string;
  fileType: string;
}
export type SameDayPayoutRequestBody = BaseRequest<SameDayPayoutExternalData>;
export interface SameDayPayoutExternalData extends BaseExternalData {
  assetServiceSameDayPayoutRequest: AssetServiceSameDayPayoutRequest;
}
export interface AssetServiceSameDayPayoutRequest {
  facilityType: string;
  subFacility: string;
  requestDate: string;
  assetDetails: SameDayPayoutAssetDetail[];
}
export interface SameDayPayoutAssetDetail {
  IdRef: number;
  AssetDescription: string;
  RegVinSerialChassisNumber: string;
  AssetId: number;
  Balance: number;
  AmountToPay: number;
  Expirydate?: Date;
}

// ReleaseSecurityRequestBody = BaseRequest with ReleaseSecurityExternalData
export type ReleaseSecurityRequestBody =
  BaseRequest<ReleaseSecurityExternalData>;

export interface ReleaseSecurityExternalData extends BaseExternalData {
  releaseSecurityRequest: ReleaseSecurity;
}

export interface ReleaseSecurity {
  partyId: number;
  assetDetails: AssetDetails[]; // List of asset IDs
  paymentOption: string;
  totalPaymentAmount?: number;
  releaseReason: ReleaseReason[];
  remarks?: string;
  facilityType?: string;
  // requestNo?: number;
  // subject?: string;
  // status?: string;
  // contractId?: number;
}
export interface AssetDetails {
  assetId: string;
  assetDescription: string;
  registrationOrSerialOrChassis: string;
  ssv: number;
  loanId: number;
}

export interface ReleaseReason {
  reason: string;
  amount?: number;
}

export interface uploadedFiles {
  file: string;
  fileName: string;
  fileType: string;
}

export interface RepaymentRequestB {
  partyId?: number;
  facilityType: string;
  subFacility: string;
  loan?: number;
  requestType?: string;
  subject?: string;
  requestNo?: number;
  status?: string;
  repaymentDetails: RequestDetailsForPayments;
  remarks?: string;
}

export interface FloatingFloorplanRepaymentRequest {
  facilityType: string;
  subFacility: string;
  repaymentDetails: RequestDetailsForPayments;
  additionalInfo?: string;
}

export interface RequestDetailsForPayments {
  paymentAmount?: number;
  requestDate: string;
  settlementReason?: string;
  paymentOptions?: string;
  paymentDetails?: PaymentDetails;
}

export interface PaymentDetails {
  nominatedBankAccount?: string;
  fiBankAccount?: string;
  contractId?: number;
}
export interface FacilitySummaryParams {
  partyNo: number;
  facilityType: string;
  subFacilityId?: number;
}

export interface SettlementQuoteReqBody {
  facilityType: string;
  subFacility?: string;
  loan: number;
  requestSettlementDate: string;
  settlementReason?: string;
  paymentOptions: string;
  udcBankAccountDetails?: string;
  paymentReferenceNumber?: number;
  remarks?: string;
}

export interface RequestHistoryParams {
  partyNo?: number;
  contractId?: number;
  taskId?: number;
}

export interface WholesaleRequestHistoryParams {
  partyId?: number;
  contractId?: number;
  taskId?: number;
}

export interface PurchaseAssetRequestBody {
  ids: number[];
}
export interface APAssetServicingRequestReq {
  partyId: number;
  facilityType: string;
  subFacilityId: number | null;
  requestType: string;
  requestDetails: RequestDetails;
}

export interface RequestDetails {
  productTransferTo: string;
  swapTransferTo?: number; // long maps to number in TS
  swapEffectiveDate?: string; // 'YYYY-MM-DD' format
  affectedAssets: AffectedAsset[];
}

export interface AffectedAsset {
  assetNo: number;
  contractId: number;
  currentExpirydate: string; // always string, assign default date if null
  totalDueAmount: number; // always number, assign 0 if null
  newDealTypeId: string;
}

export interface DrawdownRequestBodyExternalData extends BaseExternalData {
  drawdownrequest: DrawdownRequestPostBody;
}

export type DrawdownRequestBody = BaseRequest<DrawdownRequestBodyExternalData>;

export interface DrawdownRequestPostBody {
  facilityType: string;
  subFacility: string;
  loan: string;
  remarks?: string;
  drawdownInfo: DrawdownDetails;
  disbursementInfo: DisbursementDetails;
}

export interface DrawdownDetails {
  purchasePriceOfAssets: number;
  lessDepositTradeIn: number;
  workingCapital: number;
  requestDate: string; // ISO format
  drawdownOutOn: string; // ISO format
  totalDrawdownAmount: number;
}

export interface DisbursementDetails {
  suppliers: Supplier[];
  nominatedBankAccount: {
    amount: number;
  };

  assetDetails: DrawdownAssets[];
  amountToBank: number;
}

export interface Supplier {
  supplierName: string;
  amountToSupplier: number;
}

export interface DrawdownAssets {
  stockNumber: string;
  assetDescription: string;
}

export interface PaymentForcastPrincipalParams {
  partyId: number;
  facilityType: string;
  subFacilityId: string;
}
export interface ContractIdParams {
  contractId: number;
}

export interface NotesDocsParams {
  taskId: number;
}

export interface SearchPurchaseAssetParams {
  PartyNo: number;
  SubfacilityId: number;
}

export interface ClickedSubfacility {
  subFacilityType: string;
  subFacilityId: number;
}
export type NewLoanRequestBody = BaseRequest<NewLoanRequestExternalData>;

export interface NewLoanRequestExternalData extends BaseExternalData {
  newLoanRequest: NewLoanRequestPostBody;
}
export interface NewLoanRequestPostBody {
  facilityType: string;
  subFacility: string;
  loan: string;
  remarks?: string;
  newLoanInfo: NewLoanDetails;
  disbursementInfo: DisbursementDetails;
}
export interface NewLoanDetails {
  purchasePriceOfAssets: number;
  lessDepositTradeIn: number;
  workingCapital: number;
  requestDate: string; // ISO format
  newLoanOutOn: string; // ISO format
  totalNewLoanAmount: number;
}
export interface PartyNo {
  partyNo: number;
}
export interface Program {
  partyId: number;
  subFacilityId: number;
  programId?: number;
}

export interface AssetDrawdownRequestBody {
  programId: number;
  wholesaleAccountId: number;
  isSupplierDisbursement?: boolean;
  drawdownDetails: AssetDrawdownDetails;
  disbursementDetails?: AssetDisbursementDetails;
  assetDetails: AssetDrawdownAssetDetails;
  'FacilityType/WholesaleAccount'?: string;
}
export interface AssetDrawdownDetails {
  invoiceAmount: number;
  gstIncluded: string;
  drawdownAmount: number;
  payDrawdownOutOn: Date;
  disburseFundsTo?: string;
}
export interface AssetDisbursementDetails {
  suppliers: AssetSupplier[];
  nominatedBankAccount: {
    amount: number;
  };
  assets?: AssetDrawdownAssets[];
}
export interface AssetSupplier {
  supplierName: string;
  amount: number;
}
export interface AssetDrawdownAssets {
  stockNumber: string;
  description: string;
}
export interface AssetDrawdownAssetDetails {
  isMultipleAsset?: string;
  singleAsset: SingleAsset;
}
export interface SingleAsset {
  assetType: string;
  registrationNumber: string;
  vehicleIdentificationNumber: string;
  externalVehicleData?: boolean;
  chassisNumber: string;
  color: string;
  make: string;
  model: string;
  year: number;
  registrationDate: string; // ISO date string
  assetId: string;
  multipleAssets?: AssetDrawdownAssets[];
}

export type AssetDrawdownRequestBodyTask =
  BaseRequest<AssetDrawdownRequestBodyExternalData>;

export interface AssetDrawdownRequestBodyExternalData extends BaseExternalData {
  assetDrawdownRequest?: AssetDrawdownRequestPostBody;
}

export interface AssetDrawdownRequestPostBody {
  facilityType?: string;
  floorplanName?: string;
  programName?: string;
  wholesaleAccount?:string;
  drawdownDetails?: AssetDrawdownDetailsTask;
  disbursementDetails?: AssetDisbursementDetailsTask;
  assetDetails?: AssetDetailsTask;
  additionalInformation?: string;
}
export interface AssetDrawdownDetailsTask {
  invoiceAmount: number;
  gst: string;
  advanceAmount: number;
  payDrawdownOutOnDate: string;
  newLoanOutOnDate?: string;
}
export interface AssetDetailsTask {
  multipleAsset?: AssetDrawdownMultipleAssets[];
  singleAsset?: AssetDrawdownSingleAsset;
}
export interface AssetDisbursementDetailsTask {
  to: string;
  suppliers: Supplier[];
  nominatedBankAccount: {
    amountToNominatedBank: number;
  };
}
export interface AssetDrawdownMultipleAssets {
  stockNumber: string;
  assetDescription: string;
}
export interface AssetDrawdownSingleAsset {
  assetType: string;
  registrationNumber: string;
  vehicleIdentificationNumber: string;
  chassisNumber: string;
  color: string;
  make: string;
  model: string;
  year: string;
  registrationDate: string;
  assetId: string;
}

export interface SwapRequestParams {
  inboxViewType: string;
  clientId?:string
}

export interface TransferRequestParams {
  transferRequestId: string;
  action?: string;
}

export interface PaymentRequestParams {
  paymentRequestId: string;
}
export interface SearchRequestParams {
  typeId: number;
  transferRequestId?: number;
  inboxViewType?: string;
}
export interface FloatingRepaymentRequest {
  facilityType?: string;
  amtRepayment: number;
  // contractId?: number;
  payDrawdownOutOnDt: string;
  contract?:any;
}
export interface ProgramId {
  programId?: number;
}
export interface NotesParams {
  noteId: number;
}
export interface Motocheck {
  registrationPlate?: string;
  vin?: string;
  programId?: string;
}
export interface NotesDocumentParams {
  noteId: number;
  id: string;
}
export interface ContractNoteBody {
  contractId?: number;
  additionalInfo?: string;
  supplierInfo?: AssetSupplier;
  nominatedBankInfo?: NominatedBankInfo;
}
export interface NominatedBankInfo {
  accountNumber?: string;
  amount?: number;
}
export interface ContractNotesParams {
  facilityTypeRequest?: string;
}
export interface CustomerStatementBody{
  fromDate?: string;
  toDate?:string;
  scheduleType?:string;
}

export interface ServiceRequestBodyExternalData extends BaseExternalData {
  serviceRequestCss: serviceRequest;
}
export type ServiceRequestBody = BaseRequest<ServiceRequestBodyExternalData>;

export interface serviceRequest{
      category: {
        updateAddressDetails?: UpdateAddressDetails;
        updateContactDetails?:UpdateContactDetails
      };
}
export interface UpdateContactDetails {
  currentMobileNumber: string | null;
  currentPhone: string | null;
  currentEmail: string | null;
  updatedMobileNumber: string | null;
  updatedPhone: string | null;
  updatedEmail: string | null;
  notes: string | null;
}

export interface UpdateAddressDetails {
  currentAddress: string;
  updatedAddress: string;
  notes: string;
  isSameEmailAndResidentialAddress: boolean;
  physicalAddress?: boolean;
  postalAddress?: boolean;
  registeredAddress?: boolean;
}

export interface CustomerDetails {
  business?: any[];          
  personalDetails?: any[];   
}

export interface FloatingFloorplanDrawdownRequest {
  drawdownRequest: DrawdownRequest;
}
export interface DrawdownRequest {
  externalDt: string;
  internalDt: string;
  comments?: string;
  drawdowns?: Drawdowns[];
}
export interface Drawdowns {
  party?: Party;
  partyAccount?: {
    accountNo?: string;
  };
  drawdownAmt: number;
}
export interface Party {
  partyId?: number;
  partyNo?: string;
  reference?: string;
  extName?: string;
}

export interface FixedFloorPlanDrawdownTaskBodyExternalData
  extends BaseExternalData {
  assetDrawdownRequest: AssetDrawdownRequest;
}
export type FixedFloorPlanDrawdownTaskBody =
  BaseRequest<FixedFloorPlanDrawdownTaskBodyExternalData>;

export interface AssetDrawdownRequest {
  FacilityType: string;
  WholesaleAccount: string;
  floorplanName: string;
  programName: string;
  drawdownDetails: AssetDrawdownDetailsTask;
  disbursementDetails: AssetDisbursementDetailsTask;
  assetDetails: FixedFloorPlanSingleAssetDetails;
}
export interface FixedFloorPlanSingleAssetDetails {
  singleAsset: SingleAssetDetails[];
}
export interface SingleAssetDetails {
  regoNo: string;
  vin: string;
  chassisNo: string;
  colour: string;
  make: string;
  model: string;
  year: number;
  registrationDate: string;
  assetId: string;
}

export interface ContactItem {
  contactName: string;
  contactType: string;
}

export interface ContactUsExternalData
  extends BaseExternalData {
  contactUsRequestCss: contactUsRequestCs;
}
export type ContactUsTaskBody =
  BaseRequest<ContactUsExternalData>;


export interface contactUsRequestCs{
  teamDropdown:string,
	teamName: string,
	subject: string,
	message: string,
  replyTo:string
}