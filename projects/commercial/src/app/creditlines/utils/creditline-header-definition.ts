import { LoanActionComponent } from '../../reusable-component/components/loan-action/loan-action.component';
import { PaymentDetailsComponent } from '../../reusable-component/components/payment-details/payment-details.component';
import { TransactionPayDetailsComponent } from '../../reusable-component/components/transaction-pay-details/transaction-pay-details.component';

export const accountForecastColumnDefs = [
  {
    field: 'month',
    headerName: 'month',
    class: 'text-bold',
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
    headerName: 'remaining_limit',
    format: '#currency',
    sortable: true,
  },
];

export const paymentForecastColumnDefs = [
  {
    field: 'transformDate',
    headerName: 'months',
    class: 'text-bold',
    sortable: true,
  },
  {
    field: 'principal',
    headerName: 'principal',
    sortable: true,
    format: '#currency',
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

export const documentsColumnDefs = [
  { field: 'name', headerName: 'name', sortable: true },
  { field: 'category', headerName: 'category', sortable: true },
  { field: 'type', headerName: 'type', sortable: true },
  { field: 'loaded', headerName: 'loadedOn', sortable: true },
  { field: 'loadedBy', headerName: 'loadedBy', sortable: true },
  { field: 'source', headerName: 'source', sortable: true },
  {
    field: 'actions',
    headerName: 'action',
    format: '#icons',
    actions: 'onCellClick',
  },
];

export const documentActions = [
  {
    action: 'download',
    name: 'download',
    icon: 'fas fa-download',
    color: '--primary-color',
  },
  {
    action: 'view',
    name: 'view',
    icon: 'fa-regular fa-eye',
    color: '--primary-color',
  },
];

export const interestRateColumnDefs = [
  {
    field: 'interestDate',
    headerName: 'date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'interestRate',
    headerName: 'interest_rate',
    sortable: true,
  },
];

export const facilityColumnDefs = [
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
    sortable: true,
  },
];

export const loansColumnDefs = [
  {
    field: 'contractId',
    headerName: 'loan_id',
    action: 'onCellClick',
    class: 'text-primary',
    sortable: true,
  },
  {
    field: 'productType',
    headerName: 'product_type',
    sortable: true,
  },
  {
    field: 'associatedAssets',
    headerName: 'associated_assets',
    action: 'onCellClick',
    class: 'text-primary',
  },
  {
    field: 'maturityDate',
    headerName: 'maturity_date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'nextRepriceDate',
    headerName: 'next_reprice_date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'initialLoanAmount',
    headerName: 'initial_loan_amount',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'interestRate',
    headerName: 'interest_rate',
    format: '#percentage',
    sortable: true,
  },
  {
    field: 'costPrice',
    headerName: 'cost_price',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'principalInterest',
    headerName: 'principal_interest',
    format: '#percentage',
    sortable: true,
  },
  {
    field: 'principalBalance',
    headerName: 'principal_balance',
    sortable: true,
    format: '#currency',
  },
  { field: 'loanTerm', headerName: 'loan_term', sortable: true },
  {
    field: 'nextPaymentAmount',
    headerName: 'next_payment_amount',
    sortable: true,
    format: '#currency',
  },
  {
    field: 'nextPaymentDate',
    headerName: 'next_payment_date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'startDate',
    headerName: 'start_date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'principal',
    headerName: 'principal',
    sortable: true,
    format: '#currency',
    maxWidth: '20%',
    width: '20%',
    cols: 2,
  },
  {
    field: 'actions',
    headerName: 'Action',
    format: '#icons',
    overlayPanel: LoanActionComponent,
  },
];

export const leaseScheduleColumnDefs = [
  {
    field: 'date',
    headerName: 'payment_date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'totalAmount',
    headerName: 'total_lease_installment',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'amount',
    headerName: 'principal',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'installmentInterest',
    headerName: 'interest',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'gst',
    headerName: 'gst',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'principalBalance',
    headerName: 'principal_balance',
    format: '#currency',
    sortable: true,
  },
];

export const associatedAssetsColumnDefs = [
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
    field: 'costPrice',
    headerName: 'cost_price',
    sortable: true,
    format: '#currency',
  },
];

export const leaseSummaryColumnDefs = [
  {
    field: 'date',
    headerName: 'date',
    format: '#date',
    width: '15%',
    sortable: true,
  },
  {
    field: 'numberOfRentals',
    headerName: 'number',
    width: '15%',
    sortable: true,
  },
  {
    field: 'frequency',
    headerName: 'frequency',
    sortable: true,
    width: '15%',
  },
  {
    field: 'amount',
    headerName: 'payment',
    format: '#currency',
    sortable: true,
    width: '15%',
  },
  {
    field: 'gst',
    headerName: 'gst',
    format: '#currency',
    width: '15%',
    sortable: true,
  },
  {
    field: 'totalAmount',
    headerName: 'total_lease_installment',
    format: '#currency',
    width: '15%',
    sortable: true,
  },
  {
    field: 'totalAmount',
    headerName: 'total_paymentPI',
    sortable: true,
  },
];

export const residualValueColumnDefs = [
  {
    field: 'gstExclude',
    headerName: 'gst_exc',
    sortable: true,
    format: '#currency',
  },
  {
    field: 'gst',
    headerName: 'gst',
    sortable: true,
    format: '#currency',
  },
  {
    field: 'gstInclude',
    headerName: 'gst_inc',
    sortable: true,
    format: '#currency',
  },
  {
    field: 'maturityDate',
    headerName: 'end_date',
    format: '#date',
    sortable: true,
  },
];

export const paymentSummaryColumnDefs = [
  {
    field: 'date',
    headerName: 'date',
    format: '#date',
    sortable: true,
  },
  { field: 'number', headerName: 'number', sortable: true },
  {
    field: 'frequency',
    headerName: 'frequency',
    sortable: true,
  },
  {
    field: 'amount',
    headerName: 'amount',
    format: '#currency',
    sortable: true,
  },
];

export const piScheduleColumnDefs = [
  {
    field: 'date',
    headerName: 'payment_date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'principal',
    headerName: 'principal_amount',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'interest',
    headerName: 'interest_payment',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'amount',
    headerName: 'payment_amount',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'principalBalance',
    headerName: 'principal_balance',
    format: '#currency',
    columnHeaderClass: 'table-header',
    class: 'bg-cyan',
    sortable: true,
  },
  {
    field: 'remainingInterest',
    headerName: 'remaining_interest',
    format: '#currency',
    columnHeaderClass: 'table-header',
    class: 'columnColor',
    sortable: true,
  },
];

export const leasePartiesColumnDef = [
  {
    field: 'name',
    headerName: 'name',
    class: 'text-bold',
    sortable: true,
  },
  {
    field: 'role',
    headerName: 'role',
    class: 'text-bold',
    sortable: true,
  },
  {
    field: 'type',
    headerName: 'type',
    class: 'text-bold',
    sortable: true,
  },
];

export const paymentColumnDefs = [
  { field: 'date', headerName: 'date', sortable: true },
  { field: 'method', headerName: 'payment_method', sortable: true },
  {
    field: 'amountReceived',
    headerName: 'payment_received',
    format: '#currency',
    sortable: true,
  },
  { field: 'reason', headerName: 'reason', sortable: true },
  {
    field: 'allocatedDetails',
    headerName: 'allocation_details',
    sortable: true,
    class: 'text-primary',
    action: 'onCellClick',
  },
];

export const paymentDetailsColumnDefs: any[] = [
  {
    field: 'date',
    headerName: 'date',
    class: 'text-bold',
    sortable: true,
  },
  {
    field: 'description',
    headerName: 'description',
    class: 'text-bold',
    sortable: true,
  },
  {
    field: 'allocated',
    headerName: 'allocated',
    sortable: true,
    class: 'text-bold',
    format: '#currency',
  },
];

export const transationPaymentDetailsColumnDefs = [
  {
    field: 'date',
    headerName: 'name',
    sortable: true,
    format: '#date',
  },
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

export const transactionsDataListColumnDef: any[] = [
  { field: 'date', headerName: 'date', sortable: true },
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
    field: 'allocatedDetails',
    headerName: 'payment_details',
    sortable: true,
    class: 'text-primary',
  },
];

export const creditlineFacilityColumnDefs = [
  {
    field: 'facilityName',
    headerName: 'credit_lines',
    action: 'onCellClick',
    class: 'text-bold text-primary',
    sortable: true,
  },
  {
    field: 'limit',
    headerName: 'limit',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'currentBalance',
    headerName: 'current_balance',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'availableFunds',
    headerName: 'remaining_limit',
    format: '#currency',
    sortable: true,
  },
];

export const transactionFlowPaymentColumnDefs = [
  {
    field: 'paymentDate',
    headerName: 'date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'paymentMethod',
    headerName: 'payment_method',
    sortable: true,
    class: 'text-bold text-primary',
  },
  {
    field: 'paymentAmountReceived',
    headerName: 'payment_received',
    sortable: true,
    class: 'text-primary',
    format: '#currency',
  },
  { field: 'reason', headerName: 'reason', sortable: true },
  {
    field: 'actions',
    headerName: 'allocation_details',
    format: '#icons',
    action: 'onCellClick',
  },
];

export const TransactionsPaymentsAllocatedAmount = [
  {
    action: 'download',
    name: 'download',
    icon: 'fas fa-download',
    color: '--primary-color',
  },
  {
    action: 'view',
    name: 'view',
    icon: 'fa-regular fa-eye',
    color: '--primary-color',
  },
];

export const transactionFlowTransactionsColumnDefs = [
  {
    field: 'transactionDate',
    headerName: 'date',
    sortable: true,
    format: '#date',
  },
  {
    field: 'transactionType',
    headerName: 'transaction_type',
    sortable: true,
    class: 'text-bold text-primary',
  },
  {
    field: 'status',
    headerName: 'status',
    sortable: true,
    class: 'text-primary',
  },
  {
    field: 'transactionAmount',
    headerName: 'transition_amount',
    sortable: true,
    format: '#currency',
  },
  {
    field: 'overdueAmount',
    headerName: 'outstanding',
    sortable: true,
    format: '#currency',
  },
  {
    field: 'paymentDetails',
    headerName: 'payment_details',
    sortable: true,
    class: 'text-primary',
    action: 'onCellClick',
  },
];

export const transitionPaymentDetailscolumnDefs = [
  {
    field: 'date',
    headerName: 'date',
    sortable: true,
    class: 'text-bold',
  },
  {
    field: 'amount',
    headerName: 'amount',
    sortable: true,
    class: 'text-bold',
    format: '#currency',
  },
  {
    field: 'paymentMethod',
    headerName: 'payment_method',
    sortable: true,
    class: 'text-bold',
  },
];

export const paymentDetailscolumnDefs = [
  {
    field: 'date',
    headerName: 'date',
    sortable: true,
    class: 'text-bold',
  },
  {
    field: 'description',
    headerName: 'description',
    sortable: true,
    class: 'text-bold',
  },
  {
    field: 'allocated',
    headerName: 'allocated',
    sortable: true,
    class: 'text-bold',
    format: '#currency',
  },
];

export const leaseTransactionsColumnDef = [
  {
    field: 'date',
    headerName: 'date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'type',
    headerName: 'transaction_type',
    sortable: true,
  },
  {
    field: 'status',
    headerName: 'status',
    sortable: true,
    class: 'text-primary',
  },
  {
    field: 'netAmount',
    headerName: 'net_amount',
    sortable: true,
    format: '#currency',
  },
  {
    field: 'gst',
    headerName: 'gst',
    sortable: true,
    format: '#currency',
  },
  {
    field: 'grossAmount',
    headerName: 'gross_amount',
    sortable: true,
    format: '#currency',
  },
  {
    field: 'outstandingAmount',
    headerName: 'outstanding',
    sortable: true,
    format: '#currency',
  },
  {
    field: 'paymentDetails',
    headerName: 'payment_details',
    class: 'text-primary',
    overlayPanel: TransactionPayDetailsComponent,
    action: 'onCellClick',
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
    sortable: false,
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
  { field: 'description', headerName: 'description', sortable: true },
  { field: 'amount', headerName: 'amount', sortable: true },
  {
    field: 'loanNo',
    headerName: 'loan_no',
    class: 'text-primary',
    sortable: true,
  },
];
