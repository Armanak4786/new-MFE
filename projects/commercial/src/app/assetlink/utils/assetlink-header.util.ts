import { FacilityAssetsActionsComponent } from '../../reusable-component/components/facility-assets/facility-assets-actions.component';
import { LoanActionComponent } from '../../reusable-component/components/loan-action/loan-action.component';
import { PaymentDetailsComponent } from '../../reusable-component/components/payment-details/payment-details.component';
import { TransactionPayDetailsComponent } from '../../reusable-component/components/transaction-pay-details/transaction-pay-details.component';

export const accountForcastColumnDefs: any[] = [
  {
    field: 'month',
    headerName: 'month',
    sortable: true,
  },
  {
    field: 'securityValue',
    headerName: 'security_value',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'accountBalance',
    headerName: 'account_balance',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'availableFunds',
    headerName: 'available_funds',
    format: '#currency',
    sortable: true,
  },
];

export const paymentForecastColumnDefs = [
  {
    field: 'transformDate',
    headerName: 'month',
    class: 'text-bold',
    columnHeaderClass: 'text-center',
    sortable: true,
  },
  {
    field: 'principal',
    headerName: 'principal',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'interest',
    headerName: 'interest',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'amount',
    headerName: 'total_payment',
    format: '#currency',
    sortable: true,
  },
];

export const assetlinkLoansColumnDefs = [
  {
    field: 'contractId',
    headerName: 'loan_id',
    action: 'onCellClick',
    sortable: true,
    class: 'text-primary',
    cols: 2,
    width: '10%',
    maxWidth: '10%',
  },
  {
    field: 'productType',
    headerName: 'product_type',
    width: '10%',
    maxWidth: '10%',
    sortable: true,
  },
  {
    field: 'associatedAssets',
    headerName: 'associated_assets',
    headingClass: 'text-white',
    action: 'onCellClick',
    width: '20%',
    maxWidth: '20%',
    sortable: true,
    class: 'text-bold text-primary',
  },
  {
    field: 'startDate',
    width: '10%',
    maxWidth: '10%',
    headerName: 'start_date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'maturityDate',
    headerName: 'maturity_date',
    width: '10%',
    maxWidth: '10%',
    sortable: true,
    format: '#date',
  },
  {
    field: 'nextRepriceDate',
    headerName: 'next_reprice_date',
    sortable: true,
    width: '10%',
    maxWidth: '10%',
    format: '#date',
  },
  {
    field: 'initialLoanAmount',
    headerName: 'amount_financed',
    width: '10%',
    maxWidth: '10%',
    class: 'text-ellipsis',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'principalBalance',
    headerName: 'principal_balance',
    sortable: true,
    width: '10%',
    maxWidth: '10%',
    format: '#currency',
  },
  {
    field: 'interestRate',
    headerName: 'interest_rate',
    sortable: true,
    class: 'text-ellipsis',
    maxWidth: '10%',
    width: '10%',
    format: '#percentage',
  },
  {
    field: 'loanTerm',
    headerName: 'term_to_run',
    width: '10%',
    maxWidth: '10%',
    sortable: true,
  },
  {
    field: 'nextPaymentDate',
    width: '10%',
    maxWidth: '10%',
    headerName: 'next_payment_date',
    sortable: true,
    format: '#date',
  },
  {
    field: 'nextPaymentAmount',
    headerName: 'next_payment_amount',
    width: '10%',
    maxWidth: '10%',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'principalInterest',
    headerName: 'interest',
    sortable: true,
    format: '#currency',
    maxWidth: '20%',
    width: '20%',
    cols: 2,
  },
  {
    field: 'action',
    width: '10%',
    maxWidth: '10%',
    headerName: 'action',
    format: '#icons',
    action: 'onCellClick',
    overlayPanel: LoanActionComponent,
  },
];

export const assetlinkFacilityAssetsColumnDefs = [
  {
    field: 'assetNo',
    headerName: 'asset_no',
    sortable: true,
  },
  { field: 'description', headerName: 'description', sortable: true },
  {
    field: 'identifier',
    headerName: 'registration_number',
    sortable: true,
  },
  {
    field: 'lastValuedDate',
    headerName: 'last_valued_date',
    sortable: true,

    format: '#date',
  },
  {
    field: 'valuation',
    headerName: 'valuation',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'ssv',
    headerName: 'ssv',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'costPrice',
    headerName: 'cost_price',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'contractId',
    headerName: 'loan_id',
    action: 'onCellClick',
    class: 'text-primary',
    cols: 2,
    width: '10%',
    maxWidth: '10%',
    sortable: true,
  },
  {
    field: 'actions',
    headerName: 'Action',
    format: '#icons',
    overlayPanel: FacilityAssetsActionsComponent,
    action: 'onCellClick',
  },
];

export const interestRateColumnDefs = [
  {
    field: 'interestDate',
    headerName: 'interest_date',
    sortable: true,
    format: '#date',
  },
  {
    field: 'interestRate',
    headerName: 'interest_rate',
    sortable: true,
  },
];

export const assetlinkPiScheduleColumnDefs = [
  {
    field: 'date',
    headerName: 'payment_date',
    format: '#date',
    width: '15%',
    sortable: true,
  },
  {
    field: 'principal',
    headerName: 'principal',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'interest',
    headerName: 'interest',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'amount',
    headerName: 'total_paymentPI',
    format: '#currency',
    sortable: true,

    width: '15%',
  },
  {
    field: 'principalBalance',
    headerName: 'principal_balance',
    format: '#currency',
    width: '15%',
    columnHeaderClass: 'table-header',
    class: 'bg-cyan',
  },
  {
    field: 'remainingInterest',
    headerName: 'remaining_interest',
    format: '#currency',
    width: '15%',
    columnHeaderClass: 'table-header',
    class: 'columnColor',
    sortable: true,
  },
];

export const assetlinkDocumentsColumnDefs = [
  {
    field: 'name',
    headerName: 'name',
    sortable: true,
  },
  {
    field: 'category',
    headerName: 'category',
    sortable: true,
  },
  {
    field: 'type',
    headerName: 'type',
    sortable: true,
  },
  {
    field: 'loaded',
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
  {
    field: 'description',
    headerName: 'description',
    sortable: true,
  },
];

export const assetlinkLoansPaymentColumnDefs = [
  { field: 'date', headerName: 'name', sortable: true },
  { field: 'method', headerName: 'payment_method', sortable: true },
  {
    field: 'amountReceived',
    headerName: 'payment_received',
    sortable: true,
  },
  { field: 'reason', headerName: 'reason', sortable: true },
  {
    field: 'allocatedDetails',
    headerName: 'allocation_details',
    class: 'text-primary',
    overlayPanel: PaymentDetailsComponent,
    action: 'onCellClick',
  },
];

export const assetlinkFacilityTypeColumnDefs = [
  {
    field: 'facilityName',
    headerName: 'asset_link',
    class: 'text-bold text-primary',
    columnHeaderClass: 'text-xs',
    action: 'onCellClick',
  },
  {
    field: 'securityValue',
    headerName: 'security_value',
    columnHeaderClass: 'text-xs',
    format: '#currency',
  },
  {
    field: 'limit',
    headerName: 'limit',
    columnHeaderClass: 'text-xs',
    format: '#currency',
  },
  {
    field: 'currentBalance',
    headerName: 'current_balance',
    columnHeaderClass: 'text-xs',
    format: '#currency',
  },
  {
    field: 'availableFunds',
    headerName: 'available_funds',
    columnHeaderClass: 'text-xs',
    format: '#currency',
  },
];

export const assetlinkTransactionsColumnDef = [
  {
    field: 'date',
    headerName: 'date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'type',
    headerName: 'transaction_type',
    class: 'text-bold text-primary',
    sortable: true,
  },
  {
    field: 'status',
    headerName: 'status',
    class: 'text-primary',
    sortable: true,
  },
  {
    field: 'netAmount',
    headerName: 'transition_amount',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'outstandingAmount',
    headerName: 'outstanding',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'paymentDetails',
    headerName: 'payment_details',
    class: 'text-primary',
    overlayPanel: TransactionPayDetailsComponent,
    action: 'onCellClick',
  },
];

export const paymentColumnDefs = [
  { field: 'date', headerName: 'date', format: '#date', sortable: true },
  {
    field: 'method',
    headerName: 'Payment Method',
    sortable: true,
    class: 'text-bold text-primary',
  },
  {
    field: 'amountReceived',
    headerName: 'Payment Received',
    sortable: true,

    class: 'text-primary',
    format: '#currency',
  },
  { field: 'reason', headerName: 'Reason', sortable: true },
  {
    field: 'allocationDetails',
    headerName: 'Allocation Details',
    sortable: true,
    class: 'text-primary',
    overlayPanel: PaymentDetailsComponent,
  },
];
export const assetLinkAllocatedPaymentColumnDefs = [
  { field: 'date', headerName: 'date', sortable: true },
  {
    field: 'description',
    headerName: 'description',
    sortable: true,
  },
  {
    field: 'allocatedAmount',
    headerName: 'allocated',
    class: 'text-primary',
    sortable: true,
  },
];

export const transactionsColumnDef = [
  {
    field: 'date',
    headerName: 'Date',
    sortable: true,
    format: '#date',
  },
  {
    field: 'type',
    headerName: 'Transaction Type',
    sortable: true,
    class: 'text-bold text-primary',
  },
  {
    field: 'status',
    headerName: 'Status',
    sortable: true,
    class: 'text-primary',
  },
  {
    field: 'netAmount',
    headerName: 'Transition Amount',
    sortable: true,
    format: '#currency',
  },
  {
    field: 'outstandingAmount',
    headerName: 'Outstanding',
    sortable: true,
    format: '#currency',
  },
  {
    field: 'paymentDetails',
    headerName: 'Payment Details',
    class: 'text-primary',

    overlayPanel: TransactionPayDetailsComponent,
    action: 'onCellClick',
  },
];

export const assetlinkAssetReleasecolumnDefs = [
  {
    field: 'id',
    headerName: '',
    format: '#checkbox',
    action: 'onCellClick',
  },
  {
    field: 'assetNo',
    headerName: 'asset_no',
    sortable: true,
  },
  {
    field: 'description',
    headerName: 'Description',
    sortable: true,
  },
  {
    field: 'vehicleIdentificationNumber',
    headerName: 'Reg/VIN/Serial/Chassis',
    sortable: true,
  },
  {
    field: 'ssv',
    headerName: 'SSV',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'contractId',
    headerName: 'Loan ID',
    sortable: true,
  },
];

export const requestHistoryColumnDefs = [
  {
    field: 'facilityType',
    headerName: 'facility_type',
    sortable: true,
  },
  {
    field: 'taskId',
    headerName: 'request_no',
    action: 'onCellClick',
    class: 'text-primary',
    sortable: true,
  },
  { field: 'requestType', headerName: 'type', sortable: true },
  {
    field: 'status',
    headerName: 'status',
    class: 'text-primary',
    action: 'onCellClick',
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
    class: 'trim_label',
    tooltipValueGetter: (row, i) =>
      row?.description ? `${row.description}` : 'No amount',
  },
  {
    field: 'amount',
    headerName: 'amount',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'loanNo',
    headerName: 'loan_no',
    action: 'onCellClick',
    class: 'text-primary',
    sortable: true,
  },
];
