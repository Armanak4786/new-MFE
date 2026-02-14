import { PaymentDetailsComponent } from '../reusable-component/components/payment-details/payment-details.component';
import { TransactionPayDetailsComponent } from '../reusable-component/components/transaction-pay-details/transaction-pay-details.component';

export const threeDotIcon = [
  {
    icon: 'fa-solid fa-ellipsis',
  },
];

export const loanPartiesColumnDef = [
  {
    field: 'name',
    headerName: 'name',
    class: 'text-bold',
    columnHeaderClass: 'p-1',
  },
  {
    field: 'role',
    headerName: 'role',
    class: 'text-bold',
    columnHeaderClass: 'p-1',
  },
  {
    field: 'type',
    headerName: 'type',
    class: 'text-bold',
    columnHeaderClass: 'p-1',
  },
];

export const paymentColumnDefs = [
  { field: 'date', headerName: 'Date', columnHeaderClass: 'p-1' },
  {
    field: 'method',
    headerName: 'Payment Method',
    columnHeaderClass: 'p-1',
    class: 'text-bold text-primary',
  },
  {
    field: 'amountReceived',
    headerName: 'Payment Received',
    columnHeaderClass: 'p-1',
    class: 'text-primary',
    format: '#currency',
  },
  { field: 'reason', headerName: 'Reason', columnHeaderClass: 'p-1' },
  {
    field: 'allocatedDetails',
    headerName: 'Allocation Details',
    columnHeaderClass: 'p-1',
    class: 'text-primary',
    action: 'onCellClick',
  },
];

export const paymentForecastColumnDefs = [
  {
    field: 'transformDate',
    headerName: 'months',
    class: 'text-bold',
  },
  {
    field: 'principal',
    headerName: 'principal_due',
    format: '#currency',
  },
  {
    field: 'interest',
    headerName: 'interest_due',
    format: '#currency',
  },
  {
    field: 'amount',
    headerName: 'total_payments',
    format: '#currency',
  },
];

export const paymentForecastInterestOnlyColumnDefs = [
  {
    field: 'transformDate',
    headerName: 'months',
    class: 'text-bold',
  },
  {
    field: 'interest',
    headerName: 'interest_due',
    format: '#currency',
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
    action: 'previewDoc',
    name: 'previewDoc',
    icon: 'fa-regular fa-eye',
    color: '--primary-color',
  },
];

// export const notesActions = [
//   {
//     action: 'check',
//     name: 'check',
//     icon: 'fas fa-check outline-icon',
//     color: '--primary-color',
//   },
// ];

export const loanTransactionsColumnDef = [
  {
    field: 'date',
    headerName: 'date',
    format: '#date',
  },
  {
    field: 'type',
    headerName: 'transaction_type',
    class: 'text-bold text-primary',
  },
  {
    field: 'status',
    headerName: 'status',
    class: 'text-primary',
  },
  {
    field: 'netAmount',
    headerName: 'transaction_amt',
    format: '#currency',
  },
  {
    field: 'outstandingAmount',
    headerName: 'outstanding',
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

export const loansPaymentColumnDefs = [
  { field: 'date', headerName: 'date', format: '#date' },
  { field: 'method', headerName: 'payment_method' },
  {
    field: 'amountReceived',
    headerName: 'payment_received',
    format: '#currency',
  },
  { field: 'reason', headerName: 'reason' },
  {
    field: 'allocatedDetails',
    headerName: 'allocation_details',
    class: 'text-primary',
    overlayPanel: PaymentDetailsComponent,
    action: 'onCellClick',
  },
];

export const paymentDetailsColumnDefs: any[] = [
  {
    field: 'date',
    overlayPanelWidth: '300px',
    headerName: 'date',
    format: '#date',
    width: '100px',
    columnHeaderClass: 'p-1',
  },
  {
    field: 'description',
    headerName: 'description',
    width: '100px',
    columnHeaderClass: 'p-1',
  },
  {
    field: 'allocatedAmount',
    headerName: 'allocated',
    format: '#currency',
    width: '100px',
    columnHeaderClass: 'p-1',
  },
];

export const transationPaymentDetailsColumnDefs = [
  {
    field: 'date',
    headerName: 'date',
    width: '100px',
    class: 'text-bold',
    format: '#date',
  },
  {
    field: 'amount',
    headerName: 'amount',
    width: '100px',
    class: 'text-bold',
    format: '#currency',
  },
  {
    field: 'method',
    headerName: 'payment_method',
    width: '100px',
    class: 'text-bold',
    action: 'onCellClick',
  },
];

export const notesColumnDefs = [
  {
    field: 'subject',
    headerName: 'Subject',
    columnHeaderClass: 'p-1',
  },
  {
    field: 'activityType',
    headerName: 'type',
  },
  {
    field: 'activityDt',
    headerName: 'date',
    class: 'text-bold',
    format: '#date',
  },
  {
    field: 'userName',
    headerName: 'user',
  },
  {
    headerName: 'view',
    field: 'action',
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
    icon: 'pi pi-circle-off',
    color: '--primary-color',
  },
];

export const requestHistoryDocs = [
  {
    field: 'fileName',
    headerName: 'name',
  },
  {
    field: 'activityArea',
    headerName: 'category',
  },
  {
    field: 'activityType',
    headerName: 'type',
  },
  {
    field: 'activityDt',
    format: '#date',
    headerName: 'loadedOn',
  },
  {
    field: 'userName',
    headerName: 'loadedBy',
  },
  {
    field: 'source',
    headerName: 'source',
  },
  {
    field: 'actions',
    headerName: 'action',
    format: '#icons',
    actions: 'onCellClick',
  },
];
