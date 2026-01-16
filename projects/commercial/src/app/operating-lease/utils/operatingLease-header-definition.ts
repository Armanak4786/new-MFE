import { LoanActionComponent } from '../../reusable-component/components/loan-action/loan-action.component';
import { PaymentDetailsComponent } from '../../reusable-component/components/payment-details/payment-details.component';
import { TransactionPayDetailsComponent } from '../../reusable-component/components/transaction-pay-details/transaction-pay-details.component';

export const operatingLeasecolumnDefs = [
  {
    field: 'operatingLeaseFacility',
    headerName: 'operating_lease',
    class: 'text-bold text-primary',
  },
  {
    field: 'noOfLeases',
    headerName: 'no_of_leases',
    class: 'text-bold text-right',
  },
  {
    field: 'totalMonthlyPayment',
    headerName: 'total_monthly_payment',
    class: 'text-bold',

    format: '#currency',
  },
];

export const leaseColumnDefs = [
  {
    field: 'leaseId',
    headerName: 'lease_id',
    action: 'onCellClick',
    sortable: true,
    class: 'text-primary',
  },
  {
    field: 'descriptionOfAsset',
    headerName: 'description_of_asset',
    sortable: true,
  },
  {
    field: 'identifier',
    headerName: 'registration_number',
    sortable: true,
  },
  {
    field: 'assetNumber',
    headerName: 'asset_no',
    sortable: true,
  },
  {
    field: 'usagePerAnnum',
    headerName: 'usage_allowance',
    sortable: true,
    format: '#currency',
  },
  {
    field: 'totalRentalAmount',
    headerName: 'total_payment_inc',
    sortable: true,
    format: '#currency',
  },
  {
    field: 'endDate',
    headerName: 'end_date',
    sortable: true,
    format: '#date',
  },
  {
    field: 'action',
    headerName: 'Action',
    format: '#icons',
    overlayPanel: LoanActionComponent,
  },
];

export const assetsColumnDefs = [
  {
    field: 'assetNo',
    headerName: 'asset_no',
    class: 'text-primary',
    sortable: true,
  },
  {
    field: 'description',
    headerName: 'Description of Assets',
    sortable: true,
  },
  {
    field: 'registrationNumber',
    headerName: 'registration_number',
    sortable: true,
  },
  {
    field: 'usageType',
    headerName: 'usage_type',
    sortable: true,
  },
  {
    field: 'usagePerAnnum',
    headerName: 'usage_per_annum',
    format: '#currency',
    sortable: true,
  },

  {
    field: 'excessUsage',
    headerName: 'excess_usage',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'excessUsageCharge',
    headerName: 'excess_usage_charge',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'contractId',
    headerName: 'lease_id',
    class: 'text-primary',
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
    field: 'totalPayment',
    headerName: 'total_payment_gst_exc',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'gst',
    headerName: 'total_gst',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'totalPaymentWithGst',
    headerName: 'total_payments_inc_gst',
    format: '#currency',
    sortable: true,
  },
];

export const rentalSummaryColumnDefs = [
  {
    field: 'date',
    headerName: 'date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'number',
    headerName: 'number_of_rentals',
    sortable: true,
  },
  {
    field: 'frequency',
    headerName: 'frequency',
    sortable: true,
  },
  {
    field: 'amount',
    headerName: 'rental_amount',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'gst',
    headerName: 'gst_upper',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'totalAmount',
    headerName: 'total_rental_amount',
    format: '#currency',
    sortable: true,
  },
];

export const rentalScheduleColumnDefs = [
  {
    field: 'date',
    headerName: 'lbl_payment_date',
    sortable: true,
    format: '#date',
  },
  {
    field: 'totalAmount',
    headerName: 'total_pay',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'amount',
    headerName: 'rental_amount',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'gst',
    headerName: 'gst_upper',
    format: '#currency',
    sortable: true,
  },
];

export const leaseTransactionColumnDefs = [
  { field: 'date', headerName: 'date', format: '#date', sortable: true },
  {
    field: 'type',
    headerName: 'transaction_type',
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
    headerName: 'net_amount',
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
    field: 'grossAmount',
    headerName: 'gross_amount',
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

export const leasePaymentColumnDefs = [
  { field: 'date', headerName: 'date', format: '#date', sortable: true },
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
    class: 'text-primary',
    overlayPanel: PaymentDetailsComponent,
    action: 'onCellClick',
  },
];

export const loansColumnDefs = [
  {
    field: 'contractId',
    headerName: 'loan_id',
    action: 'onCellClick',
    sortable: true,
    class: 'text-primary',
  },
  {
    field: 'productType',
    headerName: 'product_type',
    sortable: true,
  },
  {
    field: 'associatedAssets',
    headerName: 'Associated Assets',
    action: 'onCellClick',
    sortable: false,
    class: 'text-primary',
  },
  {
    field: 'maturityDate',
    headerName: 'maturity_date',
    sortable: true,
    format: '#date',
  },
  {
    field: 'nextRepriceDate',
    headerName: 'next_reprice_date',
    sortable: true,
    format: '#date',
  },
  {
    field: 'initialLoanAmount',
    headerName: 'initial_loan_amount',
    sortable: true,
    format: '#currency',
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

export const operatingLeaseDocumentsColumnDefs = [
  { field: 'name', headerName: 'name', sortable: true },
  { field: 'category', headerName: 'category', sortable: true },
  { field: 'type', headerName: 'type', sortable: true },
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
  { field: 'source', headerName: 'source', sortable: true },
  {
    field: 'actions',
    headerName: 'action',
    format: '#icons',
    actions: 'onCellClick',
  },
  { field: 'description', headerName: 'description', sortable: true },
];
