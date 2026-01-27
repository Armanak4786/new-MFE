import { FacilityAssetsActionsComponent } from '../../reusable-component/components/facility-assets/facility-assets-actions.component';
import { LoanActionComponent } from '../../reusable-component/components/loan-action/loan-action.component';
import { PaymentDetailsComponent } from '../../reusable-component/components/payment-details/payment-details.component';
import { TransactionPayDetailsComponent } from '../../reusable-component/components/transaction-pay-details/transaction-pay-details.component';

export const easylinkFacilityColumnDefs = [
  {
    field: 'facilityName',
    headerName: 'easy_link',
    action: 'onCellClick',
    class: 'text-bold text-primary',
  },
  {
    field: 'limit',
    headerName: 'remaining_limit',
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

export const paymentForecastColumnDefs = [
  {
    field: 'month',
    headerName: 'months',
    sortable: true,
    class: 'text-bold',
  },
  {
    field: 'principal',
    headerName: 'principal_due',
    sortable: true,
    format: '#currency',
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

export const easylinkAccountForcastColumnDefs: any[] = [
  {
    field: 'month',
    headerName: 'month',
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

export const easylinkPaymentForecastColumnDefs = [
  {
    field: 'transformDate',
    headerName: 'months',
    class: 'text-bold',
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
    headerName: 'total_payment',
    format: '#currency',
    sortable: true,
  },
];

export const easylinkInterestOnlyPaymentForecastColumnDefs = [
  {
    field: 'month',
    headerName: 'months',
    class: 'text-bold',
    sortable: true,
  },
  {
    field: 'interest',
    headerName: 'interest_due',
    format: '#currency',
    sortable: true,
  },
];

export const easylinkLoansColumnDefs = [
  {
    field: 'contractId',
    headerName: 'loan_id',
    action: 'onCellClick',
    class: 'text-primary text-left',
    sortable: true,
  },
  {
    field: 'productType',
    headerName: 'product_type',
    class: 'text-left',
    sortable: true,
  },
  {
    field: 'associatedAssets',
    headerName: 'associated_assets',
    action: 'onCellClick',
    class: 'text-bold text-primary text-center',
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
    field: 'principalInterest',
    headerName: 'principal_interest',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'principalBalance',
    headerName: 'principal_balance',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'loanTerm',
    headerName: 'term_to_run',
    sortable: true,
  },
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
    field: 'action',
    headerName: 'Action',
    format: '#icons',
    action: 'onCellClick',
    overlayPanel: LoanActionComponent,
  },
];

export const easylinkFacilityAssetsColumnDefs = [
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
    field: 'lastValuedDate',
    headerName: 'last_valued_date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'valuation',
    headerName: 'valuation',
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

export const easylinkDocumentsColumnDefs = [
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
  { field: 'description', headerName: 'description', sortable: true },
];

export const easylinkAssetReleasecolumnDefs = [
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
    field: 'contractId',
    headerName: 'Loan ID',
    sortable: true,
  },
];

export const easylinkTransactionsColumnDef = [
  {
    field: 'date',
    headerName: 'date',
    sortable: true,
    format: '#date',
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

export const easylinkLoansPaymentColumnDefs = [
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

export const paymentColumnDefs = [
  { field: 'date', headerName: 'date', sortable: true },
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

    class: 'text-primary',
    overlayPanel: PaymentDetailsComponent,
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
  { field: 'description', headerName: 'description', sortable: true },
  { field: 'amount', headerName: 'amount', sortable: true },
  {
    field: 'loanNo',
    headerName: 'loan_no',
    sortable: true,
  },
];
