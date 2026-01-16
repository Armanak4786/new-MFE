export const leaseColumnDefs = [
  {
    field: 'leaseId',
    headerName: 'lease_id',
    action: 'onCellClick',
    class: 'text-primary',
    sortable: true,
  },
  {
    field: 'descriptionOfAsset ',
    headerName: 'description_of_asset',
    sortable: true,
  },
  {
    field: 'registrationNumber',
    headerName: 'registration_number',
    sortable: true,
  },
  {
    field: 'butBackAmount',
    headerName: 'buyback_amount_gst_excl',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'butBackAmountWithGst',
    headerName: 'buyback_amount_gst_incl',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'endDate',
    headerName: 'buyback_date',
    sortable: true,
  },
  {
    field: 'originator',
    headerName: 'originator',
    sortable: true,
  },
  {
    field: 'totalUnitUsage',
    headerName: 'total_unit_usage',
    sortable: true,
  },
];

export const buybackPaymentForecastColumnDefs = [
  {
    field: 'transformDate',
    headerName: 'months',
    sortable: true,
  },
  {
    field: 'principal',
    headerName: 'buyback_amount_exc',
    format: '#currency',
    class: 'text-center',
    sortable: true,
  },
  {
    field: 'interest',
    headerName: 'buyback_amount_inc',
    format: '#currency',
    sortable: true,
  },
];

export const buybackAccountForecastColumnDefs = [
  {
    field: 'transformDate',
    headerName: 'month',
    sortable: true,
  },
  {
    field: 'accountBalance',
    headerName: 'current_balance',
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

export const buybackLeasesColumnDefs = [
  {
    field: 'leaseId',
    headerName: 'lease_id',
    action: 'onCellClick',
    class: 'text-primary',
    sortable: true,
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
    field: 'buyBackAmount',
    headerName: 'buyback_gst_exc',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'buyBackAmountWithGst',
    headerName: 'buyback_gst_inc',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'endDate',
    headerName: 'buyback_date',
    format: '#date',
    sortable: true,
  },
  {
    field: 'originator',
    headerName: 'originator',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'usagePerAnnum',
    headerName: 'usage_allowance',
    sortable: true,
  },
];

export const byubackDocumentsColumnDefs = [
  { field: 'name', headerName: 'name', sortable: true },
  { field: 'category', headerName: 'category', sortable: true },
  { field: 'type', headerName: 'type', sortable: true },
  { field: 'description', headerName: 'description', sortable: true },
  { field: 'loadedOn', headerName: 'loadedOn', sortable: true },
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

export const buybackRentalSummaryColumnDefs = [
  {
    field: 'number',
    headerName: 'number',
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
    headerName: 'gst',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'totalAmount',
    headerName: 'total_rental_amount',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'date',
    headerName: 'date',
    format: '#date',
    sortable: true,
  },
];

export const buybackResidualValueColumnDefs = [
  {
    field: 'gstExclude',
    headerName: 'residual_value_exc',
    format: '#currency',
    sortable: true,
  },
  { field: 'gst', headerName: 'gst', format: '#currency', sortable: true },
  {
    field: 'gstInclude',
    headerName: 'residual_value_inc',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'endDate',
    headerName: 'end_date',
    format: '#date',
    sortable: true,
  },
];

export const buybackLeaseScheduleColumnDefs = [
  { field: 'date', headerName: 'date', format: '#date', sortable: true },
  {
    field: 'totalAmount',
    headerName: 'total_rental_amount',
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
    field: 'amount',
    headerName: 'rental_amount',
    format: '#currency',
    sortable: true,
  },
];

export const buybackFacilityDataColumnDefs = [
  {
    field: 'assetNo',
    headerName: 'asset_no',
    sortable: true,
  },
  {
    field: 'description',
    headerName: 'description_of_assets',
    sortable: true,
  },
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
    field: 'buyBackAmount',
    headerName: 'buyback_amount_inc',
    format: '#currency',
    sortable: true,
  },
  {
    field: 'usageType',
    headerName: 'usage_type',
    sortable: true,
  },
  {
    field: 'usagePerAnnum',
    headerName: 'usage_allowance',
    sortable: true,
  },
  {
    field: 'excessUsageAllowance',
    headerName: 'excess_usage_allowance',
    sortable: true,
  },
  {
    field: 'excessUsageCharge',
    headerName: 'excess_usage_charge',
    sortable: true,
  },
  {
    field: 'contractId',
    headerName: 'lease_id',
    sortable: true,
  },
];

export const buyBackFacilityColumnDefs = [
  { field: 'buyBack', headerName: 'view_buyback' },
  {
    field: 'noOfLeases',
    headerName: 'no_of_leases',
    columnHeaderClass: 'text-right',
    class: 'text-right',
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

export const requestHistoryColumnDefs = [
  {
    field: 'facilityType',
    headerName: 'facility',
    class: 'text-primary',
    sortable: true,
  },
  {
    field: 'requestNo',
    headerName: 'request_no',
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
