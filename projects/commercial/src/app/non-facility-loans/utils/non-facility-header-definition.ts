import { LoanActionComponent } from '../../reusable-component/components/loan-action/loan-action.component';
import {
  nonFacilityLoanColumn,
  PaymentForecastColumn,
} from '../interface/non-facility-loan-interface';

export const loansColumnDefs = [
  {
    field: 'contractId',
    headerName: 'loan_id',
    action: 'onCellClick',
    sortable: true,
    class: 'text-bold text-primary',
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
    class: 'text-bold text-primary',
    sortable: true,
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
    sortable: true,
    format: '#currency',
  },
  {
    field: 'principalBalance',
    headerName: 'principal_balance',
    format: '#currency',
    sortable: true,
  },
  { field: 'loanTerm', headerName: 'loan_term', sortable: true },
  {
    field: 'nextPaymentAmount',
    headerName: 'next_payment_amount',
    format: '#currency',
    sortable: true,
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
    field: 'actions',
    headerName: 'Action',
    format: '#icons',
    overlayPanel: LoanActionComponent,
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
    sortable: true,
    format: '#currency',
  },
];

export const facilityColumnDefs = [
  {
    field: 'assetNo',
    headerName: 'asset_no',
    class: 'text-primary',
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
    class: 'text-primary',
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
    sortable: true,
    columnHeaderClass: 'table-header',
    class: 'bg-cyan',
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

export const documentsColumnDefs = [
  { field: 'name', headerName: 'name', maxWidth: '100px', sortable: true },
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
  { field: 'description', headername: 'description', sortable: true },
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

export const leaseSummaryColumnDefs = [
  {
    field: 'number',
    headerName: 'number',
    class: 'text-primary',
    sortable: true,
  },
  { field: 'frequency', headerName: 'frequency', sortable: true },
  {
    field: 'amount',
    headerName: 'lease_installment',
    sortable: true,
  },
  {
    field: 'gst',
    headerName: 'gst',
    sortable: true,
  },
  {
    field: 'totalAmount',
    headerName: 'total_lease_installment',
    sortable: true,
  },
  {
    field: 'date',
    headerName: 'date',
    format: '#date',
    sortable: true,
  },
];

export const paymentForecastColumnDefs = [
  {
    field: 'month',
    headerName: 'months',
    class: 'text-bold',
    format: '#date',
    sortable: true,
  },
  {
    field: 'principal',
    headerName: 'principal_due',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'interest',
    headerName: 'interest_due',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'amount',
    headerName: 'total_payments',
    format: '#currency',
    sortable: true,
  },
];

export const paymentColumnDefs = [
  { field: 'date', headerName: 'date', format: '#date', sortable: true },
  {
    field: 'method',
    headerName: 'payment_method',
    class: 'text-primary',
    sortable: true,
  },
  {
    field: 'amountReceived',
    headerName: 'payment_received',
    class: 'text-primary',
    format: '#currency',
    sortable: true,
  },
  { field: 'reason', headerName: 'reason', sortable: true },
  {
    field: 'allocationDetails',
    headerName: 'allocation_details',
    class: 'text-primary',
    action: 'onCellClick',
  },
];

export const transactionsDataListColumnDef: any[] = [
  { field: 'date', headerName: 'date', format: '#date', sortable: true },
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
    class: 'text-primary',
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
    class: 'text-primary',
    action: 'onCellClick',
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
    sortable: true,
  },
];
export const NonFacilityLoansColumnDefs = [
  {
    field: 'facilityName',
    headerName: 'view_non-facility_loan',
    class: 'text-bold',
    sortable: true,
  },
  {
    field: 'noOfLoans',
    headerName: 'no_of_loans',
    format: '#currency',
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
    field: 'remainingLimit',
    headerName: 'available_funds',
    format: '#currency',
    sortable: true,
  },
];
