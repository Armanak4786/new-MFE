import { SwapAssetTransferDescriptionComponent } from '../../reusable-component/components/swap-asset-transfer-description/swap-asset-transfer-description.component';
import { BailmentAssetActionComponent } from '../components/bailment-asset-action/bailment-asset-action.component';

export const bailmentFacilityTypeColumnDefs = [
  {
    field: 'facilityName',
    headerName: 'bailments',
    class: 'text-bold text-primary',
    columnHeaderClass: 'text-xs',
    action: 'onCellClick',
    width: '25%',
  },
  {
    field: 'noOfAssets',
    headerName: 'no_of_assets',
    width: '15%',
  },
  {
    field: 'temporaryLimit',
    headerName: 'temporary_limit',
    format: '#currency',
    width: '15%',
  },
  {
    field: 'limit',
    headerName: 'limit',
    format: '#currency',
    width: '15%',
  },
  {
    field: 'currentBalance',
    headerName: 'current_balance',
    format: '#currency',
    width: '15%',
  },
  {
    field: 'availableFunds',
    headerName: 'available_funds',
    format: '#currency',
    width: '15%',
  },
];
export const bailmentSubFacilityTypeColumnDefs = [
  {
    field: 'facilityName',
    headerName: 'bailments',
    class: 'text-bold text-primary',
    columnHeaderClass: 'text-xs',
    color: '--primary-color',
  },
  {
    field: 'noOfAssets',
    headerName: 'no_of_assets',
  },
  {
    field: 'temporaryLimit',
    headerName: 'temporary_limit',
    format: '#currency',
  },
  {
    field: 'limit',
    headerName: 'limit',
    format: '#currency',
  },
  {
    field: 'currentBalance',
    headerName: 'current_balance',
    format: '#currency',
  },
  {
    field: 'availableFunds',
    headerName: 'available_funds',
    format: '#currency',
  },
];

export const curtailmentPlanColumnDefs = [
  {
    field: 'number',
    headerName: 'number',
    class: 'text-bold',
    sortable: true,
  },
  {
    field: 'basedOn',
    headerName: 'description',
    sortable: true,
  },
  {
    field: 'days',
    headerName: 'days',
    sortable: true,
  },
  {
    field: 'expectedDate',
    headerName: 'expected_date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'amount',
    headerName: 'amount',
    format: '#currency',
    sortable: true,
  },
];

export const subventionColumnDefs = [
  {
    field: 'startDate',
    headerName: 'start_date',
    format: '#date',
    class: 'text-bold',
    sortable: true,
  },
  {
    field: 'maturityDate',
    headerName: 'maturity_date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'days',
    headerName: 'subvention_days',
    sortable: true,
  },
];

export const transactionDetailsColumnDefs = [
  {
    field: 'date',
    headerName: 'date',
    format: '#date',
    class: 'text-bold',
    sortable: true,
  },
  {
    field: 'type',
    headerName: 'lbl_transaction_type',
    sortable: true,
  },
  {
    field: 'amount',
    headerName: 'amount',
    sortable: true,
  },
];

export const bailmentNotesColumnDefs = [
  {
    field: 'subject',
    headerName: 'subject',
    sortable: true,
  },
  {
    field: 'noteType',
    headerName: 'type',
    sortable: true,
  },
  {
    field: 'dateStamp',
    headerName: 'date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'user',
    headerName: 'user',
    sortable: true,
  },
  {
    headerName: 'view',
    field: 'actions',
    action: 'view',
    name: 'view',
    format: '#icons',
    color: '--primary-color',
    actions: 'onCellClick',
  },
];

export const notesActions = [
  {
    action: 'view',
    name: 'view',
    icon: 'pi pi-info-circle',
    color: '--primary-color',
  },
];

export const bailmentProductTransferRequestColumnDefs = [
  {
    field: 'id',
    headerName: ' ',
    format: '#checkbox',
    action: 'onCellClick',
  },
  {
    field: 'contractId',
    headerName: 'id_ref',
    // class: 'text-primary',
    sortable: true,
  },
  {
    field: 'invoiceDate',
    headerName: 'lbl_invoice_date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'make',
    headerName: 'make',
    sortable: true,
  },
  {
    field: 'model',
    headerName: 'model',
    sortable: true,
  },
  {
    field: 'vehicleIdentificationNumber',
    headerName: 'regNo',
    sortable: true,
  },
  {
    field: 'color',
    headerName: 'Colour',
    sortable: true,
  },
  {
    field: 'assetNo',
    headerName: 'asset_id',
    sortable: true,
  },
];

export const bailmentSameDayPayoutRequestColumnDefs = [
  {
    field: 'id',
    headerName: ' ',
    format: '#checkbox',
    action: 'onCellClick',
  },
  {
    field: 'contractId',
    headerName: 'id_ref',
    // class: 'text-primary',
    sortable: true,
  },
  {
    field: 'startDate',
    headerName: 'start_date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'make',
    headerName: 'Make',
    sortable: true,
  },
  {
    field: 'model',
    headerName: 'Model',
    sortable: true,
  },
  {
    field: 'vehicleIdentificationNumber',
    headerName: 'regNo',
    sortable: true,
  },
  {
    field: 'color',
    headerName: 'Colour',
    sortable: true,
  },
  {
    field: 'assetNo',
    headerName: 'asset_id',
    sortable: true,
  },
];

export const bailmentProductTransferRequestRegistrationNumberColumnDefs = [
  {
    field: 'id',
    headerName: ' ',
    format: '#checkbox',
    action: 'onCellClick',
  },
  {
    field: 'contractId',
    headerName: 'id_ref',
    sortable: true,
  },
  {
    field: 'invoiceDate',
    headerName: 'Invoice Date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'make',
    headerName: 'Make',
    format: '#date',
    sortable: true,
  },
  {
    field: 'model',
    headerName: 'Model',
    sortable: true,
  },
  {
    field: 'registrationNumber',
    headerName: 'regNo',
    sortable: true,
  },
  {
    field: 'assetNo',
    headerName: 'asset_id',
    sortable: true,
  },
];

export const bailmentSameDayPayoutRequestRegistrationNumberColumnDefs = [
  {
    field: 'id',
    headerName: ' ',
    format: '#checkbox',
    action: 'onCellClick',
  },
  {
    field: 'contractId',
    headerName: 'id_ref',
    sortable: true,
  },
  {
    field: 'invoiceDate',
    headerName: 'Invoice Date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'make',
    headerName: 'make',
    sortable: true,
  },
  {
    field: 'model',
    headerName: 'model',
    sortable: true,
  },
  {
    field: 'registrationNumber',
    headerName: 'regNo',
    sortable: true,
  },
  {
    field: 'assetNo',
    headerName: 'asset_id',
    sortable: true,
  },
];

export const productTransferSubmissionColumnDefs = [
  { field: 'assetNo', headerName: 'assetId', sortable: true },
  { field: 'description', headerName: 'description', sortable: true },
  {
    field: 'vehicleIdentificationNumber',
    headerName: 'regNo',
    sortable: true,
  },
];
export const swaprequestSubmissionColumnDefs = [
  { field: 'assetNo', headerName: 'assetNo', sortable: true },
  { field: 'description', headerName: 'description', sortable: true },
  {
    field: 'vehicleIdentificationNumber',
    headerName: 'regNo',
    sortable: true,
  },
  {
    field: 'requestDate',
    headerName: 'request_date_of_transfer',
    format: '#date',
    sortable: true,
  },
];
export const productTransferRegistrationNumberSubmissionColumnDefs = [
  { field: 'assetNo', headerName: 'assetNo', sortable: true },
  { field: 'description', headerName: 'description', sortable: true },
  {
    field: 'registrationNumber',
    headerName: 'regNo',
    sortable: true,
  },
  {
    field: 'newExpiryDate',
    headerName: 'new_expiry_date',
    format: '#date',
    sortable: true,
  },
];

export const bailmentlinkDocumentsColumnDefs = [
  { field: 'name', headerName: 'name', sortable: true },
  { field: 'category', headerName: 'category', sortable: true },
  { field: 'description', headerName: 'description', sortable: true },
  { field: 'type', headerName: 'type', sortable: true },
  { field: 'loadedOn', headerName: 'loaded_on', sortable: true },
  { field: 'loadedBy', headerName: 'loaded_by', sortable: true },
  { field: 'source', headerName: 'source', sortable: true },
  {
    field: 'actions',
    headerName: 'action',
    format: '#icons',
    actions: 'onCellClick',
  },
];

export const notesDocs = [
  {
    field: 'fileName',
    headerName: 'name',
    sortable: true,
  },
  {
    field: 'securityClassification',
    headerName: 'category',
    sortable: true,
  },
  {
    field: 'type',
    headerName: 'type',
    sortable: true,
  },
  {
    field: 'loadedOn',
    format: '#date',
    headerName: 'loadedOn',
    sortable: true,
  },
  {
    field: 'loadedBy',
    headerName: 'loadedBy',
    sortable: true,
  },
  {
    field: 'source',
    headerName: 'source',
    sortable: true,
  },
  {
    field: 'actions',
    headerName: 'action',
    format: '#icons',
    actions: 'onCellClick',
  },
];

export const facilityAssetsColumnDefs = [
  {
    field: 'contractId',
    headerName: 'id_ref',
    class: 'text-primary',
    action: 'onCellClick',
    sortable: true,
  },
  {
    field: 'program',
    headerName: 'lbl_program',
    class: 'text-bold',
    width: '500px',
    sortable: true,
  },
  {
    field: 'invoiceDate',
    headerName: 'start_date',
    class: 'text-bold',
    format: '#date',
    sortable: true,
  },
  {
    field: 'assetNo',
    headerName: 'asset_id',
    class: 'text-bold',
    sortable: true,
  },
  {
    field: 'make',
    headerName: 'lbl_make',
    class: 'text-bold',
    sortable: true,
  },
  {
    field: 'model',
    headerName: 'lbl_model',
    class: 'text-bold',
    sortable: true,
  },
  {
    field: 'registrationNumber',
    headerName: 'registration_numb',
    class: 'text-bold',
    sortable: true,
  },
  {
    field: 'vehicleIdentificationNumber',
    headerName: 'vin_number',
    class: 'text-bold',
    sortable: true,
  },
  {
    field: 'chassisNumber',
    headerName: 'chassis_serial_no',
    class: 'text-bold',
    sortable: true,
  },
  {
    field: 'expiryDate',
    headerName: 'lbl_expiry_date',
    class: 'text-bold',
    format: '#date',
    sortable: true,
  },
  {
    field: 'currentBalance',
    headerName: 'current_balance',
    class: 'text-bold',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'status',
    headerName: 'asset_status',
    class: 'text-bold',
    sortable: true,
  },
  {
    field: 'actions',
    headerName: 'action',
    format: '#icons',
    overlayPanel: BailmentAssetActionComponent,
    action: 'onCellClick',
  },
];

export const bailmentFacilitySummaryColumnDefs = [
  { field: 'activity', headerName: 'activity', sortable: true },
  { field: 'noassets', headerName: 'no_of_assets', sortable: true },
  { field: 'amount', headerName: 'amount', sortable: true },
];

export const todaysActivityColDef: any[] = [
  {
    field: 'activityType',
    headerName: 'activity',
    sortable: true,
  },
  {
    field: 'noOfAssets',
    headerName: 'no_of_assets',
    format: '#number',
    class: 'text-left',
    sortable: true,
  },
  {
    field: 'amount',
    headerName: 'amount',
    format: '#currency',
    sortable: true,
  },
];

export const assetSummaryColDef: any[] = [
  {
    field: 'type',
    headerName: 'type',
    sortable: true,
  },
  {
    field: 'noOfAssets',
    headerName: 'no_of_assets',
    format: '#number',
    sortable: true,
  },
  {
    field: 'currentBalance',
    headerName: 'current_balance',
    format: '#currency',
    sortable: true,
  },
];

export const bailmentPurchaseAssetRequestColumnDefs = [
  {
    field: 'partyId',
    headerName: ' ',
    format: '#checkbox',
    action: 'onCellClick',
  },
  {
    field: 'contractId',
    headerName: 'id_ref',
    // class: 'text-primary',
    sortable: true,
  },
  {
    field: 'invoiceDate',
    headerName: 'start_date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'make',
    headerName: 'make',
    sortable: true,
  },
  {
    field: 'model',
    headerName: 'model',
    sortable: true,
  },
  {
    field: 'vehicleIdentificationNumber',
    headerName: 'regNo',
    sortable: true,
  },
  {
    field: 'color',
    headerName: 'colour',
    sortable: true,
  },
  {
    field: 'assetNo',
    headerName: 'asset_id',
    sortable: true,
  },
];

export const bailmentpurchaseAssetConfirmationColumnDefs = [
  {
    field: 'assetNo',
    headerName: 'Asset ID',
    sortable: true,
  },
  {
    field: 'description',
    headerName: 'description',
    class: 'text-bold',
    sortable: true,
  },
  {
    field: 'vehicleIdentificationNumber',
    headerName: 'regNo',
    sortable: true,
  },
  {
    field: 'expiryDate',
    headerName: 'lbl_expiry_date',
    format: '#date',
    sortable: true,
  },

  {
    field: 'amountToPay',
    headerName: 'total_amount_to_pay',
    sortable: true,
  },
];

export const bailmenSwapRequestColumnDefs = [
  {
    field: 'id',
    headerName: ' ',
    format: '#checkbox',
    action: 'onCellClick',
  },
  {
    field: 'contractId',
    headerName: 'id_ref',
    sortable: true,
  },
  {
    field: 'program',
    headerName: 'program',
    sortable: true,
  },
  {
    field: 'invoiceDate',
    headerName: 'start_date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'make',
    headerName: 'make',
    sortable: true,
  },
  {
    field: 'model',
    headerName: 'model',
    sortable: true,
  },
  {
    field: 'vehicleIdentificationNumber',
    headerName: 'regNo',
    sortable: true,
  },
  {
    field: 'color',
    headerName: 'colour',
    sortable: true,
  },
  {
    field: 'assetNo',
    headerName: 'asset_id',
    sortable: true,
  },
];

export const sameDayPayout_requestHistory_ColumnDefs = [
  {
    field: 'taskId',
    headerName: 'request_no',
    action: 'onCellClick',
    class: 'text-primary',
    sortable: true,
  },
  {
    // field: 'requestStatus',
    field: 'requestType',
    headerName: 'request_type',
    sortable: true,
  },
  {
    field: 'amount',
    headerName: 'amount',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'requestDate',
    headerName: 'request_date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'description',
    headerName: 'description',
    sortable: true,
  },
  {
    field: 'requestDate',
    headerName: 'request_date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'idRef',
    headerName: 'idRef',
    action: 'onCellClick',
    class: 'text-primary',
    sortable: true,
  },
  {
    field: 'assetId',
    headerName: 'asset_id',
    sortable: true,
  },
  {
    field: 'status',
    headerName: 'status',
    sortable: true,
  },
];

export const transferAssetColumnDefs = [
  {
    field: 'assetHdrId',
    headerName: 'asset_id',
    class: 'text-primary',
    overlayPanel: SwapAssetTransferDescriptionComponent,
    action: 'onCellClick',
    sortable: false,
  },
  { field: 'amtFinanced', headerName: 'repayment_amount', sortable: true },
  {
    field: 'effectiveDate',
    headerName: 'request_date_to_transfer',
    format: '#date',
    sortable: true,
  },
  { field: 'programName', headerName: 'program', sortable: true },
];

export const swaprequestAfterSubmissionColumnDefs = [
  { field: 'assetNo', headerName: 'assetNo', sortable: true },
  { field: 'description', headerName: 'description', sortable: true },
  {
    field: 'vehicleIdentificationNumber',
    headerName: 'regNo',
    sortable: true,
  },
  {
    field: 'completedDate',
    headerName: 'processed_date',
    format: '#date',
    sortable: true,
  },
];

export const floatingRepaymentColumnDefs = [
  {
    field: 'taskId',
    headerName: 'request_no',
    action: 'onCellClick',
    class: 'text-primary',
    sortable: true,
  },
  { field: 'facility', headerName: 'contract_no', sortable: true },
  { field: 'type', headerName: 'type', sortable: true },
  {
    field: 'requestDate',
    headerName: 'request_date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'amount',
    headerName: 'amount',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'status',
    headerName: 'status',
    sortable: true,
  },
];

export const purchaseassetrequestSubmissionColumnDefs = [
  { field: 'assetNo', headerName: 'assetNo', sortable: true },
  { field: 'description', headerName: 'description', sortable: true },
  {
    field: 'vehicleIdentificationNumber',
    headerName: 'regNo',
    sortable: true,
  },
  {
    field: 'requestDate',
    headerName: 'new_expiry_date',
    format: '#date',
    sortable: true,
  },
];
