export const creditlineFacilityColumnDefs = [
  {
    field: 'facilityName',
    headerName: 'credit_lines',

    headerAction: 'click',
    class: 'text-bold text-primary',
    width: '40%',
  },
  {
    field: 'limit',
    headerName: 'limit',

    format: '#currency',
    width: '20%',
  },
  {
    field: 'currentBalance',
    headerName: 'current_balance',

    format: '#currency',
    width: '20%',
    iconRight: (rowData) => {
      return [0].includes(rowData.__index)
        ? 'fa-regular fa-circle-info text-primary pl-2'
        : null;
    },
    iconTooltip: (value, rowIndex) => {
      return [0].includes(rowIndex)
        ? 'Principal Balance as at the last payment date'
        : '';
    },
  },
  {
    field: 'availableFunds',
    headerName: 'remaining_limit',

    format: '#currency',
    width: '20%',
    iconRight: (rowData) => {
      return [0].includes(rowData.__index)
        ? 'fa-regular fa-circle-info text-primary pl-2'
        : null;
    },
    iconTooltip: (value, rowIndex) => {
      return [0].includes(rowIndex) ? 'Limit minus Current Balance' : '';
    },
  },
];

export const buybackFacilityColumnDefs = [
  {
    field: 'facilityType',
    headerName: 'buy_back',
    class: 'text-primary',
    headerAction: 'clickData',

    width: '20%',
  },
  {
    field: 'noOfLeases',
    headerName: 'no_of_leases',
    columnHeaderClass: 'text-right',
    class: 'text-right',
    width: '20%',
  },
  {
    field: 'limit',
    headerName: 'limit',

    format: '#currency',
    width: '20%',
  },
  {
    field: 'currentBalance',

    headerName: 'current_balance',
    format: '#currency',
    width: '20%',
  },
  {
    field: 'availableFunds',
    headerName: 'available_funds',

    format: '#currency',
    width: '20%',
  },
];

export const floatingFloorPlanColumnDefs = [
  {
    field: 'facilityName',
    headerName: 'floating_floorplan',
    headerAction: 'clickData',

    class: 'text-bold text-primary',
    width: '40%',
  },
  {
    field: 'limit',
    headerName: 'limit',
    width: '20%',
    format: '#currency',
  },
  {
    field: 'currentBalance',
    headerName: 'current_balance',
    width: '20%',
    format: '#currency',
  },
  {
    field: 'availableFunds',
    headerName: 'available_funds',
    width: '20%',
    format: '#currency',
  },
];

export const nonFacilityLoansColumnDefs = [
  {
    field: 'facilityType',
    headerName: 'non_facility_loan',
    headerAction: 'clickData',

    class: 'text-bold text-primary',
    width: '20%',
  },
  {
    field: 'noOfLoans',
    headerName: 'no_of_loans',
    class: 'text-right',
    columnHeaderClass: 'text-right',
    width: '20%',
  },
  {
    field: 'limit',
    headerName: 'limit',

    format: '#currency',
    width: '20%',
  },
  {
    field: 'currentBalance',
    headerName: 'current_balance',

    format: '#currency',
    width: '20%',
    iconRight: (rowData) => {
      return [0].includes(rowData.__index)
        ? 'fa-regular fa-circle-info text-primary pl-2'
        : null;
    },
    iconTooltip: (value, rowIndex) => {
      return [0].includes(rowIndex)
        ? 'Principal Balance as at the last payment date'
        : '';
    },
  },
  {
    field: 'remainingLimit',
    headerName: 'remaining_limit',

    format: '#currency',
    width: '20%',
  },
];

export const operatingLeaseColumnDefs = [
  {
    field: 'operatingLeaseFacility',
    headerName: 'operating_lease',

    class: 'text-bold text-primary',
    headerAction: 'clickData',
    width: '40%',
  },
  {
    field: 'noOfLeases',
    headerName: 'no_of_leases',
    columnHeaderClass: 'text-right',
    class: 'text-bold text-right',
    width: '20%',
  },
  {
    field: 'totalMonthlyPayment',
    headerName: 'total_monthly_payment',
    class: 'text-bold',

    format: '#currency',
    width: '40%',
  },
];

export const assetlinkColumnDefs = [
  {
    field: 'facilityName',
    headerName: 'asset_link',
    headerAction: 'clickData',
    width: '20%',
    class: 'text-primary',
    headingClass: 'border-right-2',
  },
  {
    field: 'securityValue',
    headerName: 'security_value',
    width: '20%',
    format: '#currency',
  },
  {
    field: 'limit',
    headerName: 'limit',
    width: '20%',
    format: '#currency',
  },
  {
    field: 'currentBalance',
    headerName: 'current_balance',
    width: '20%',
    format: '#currency',
    iconRight: (rowData) => {
      return [0].includes(rowData.__index)
        ? 'fa-regular fa-circle-info text-primary pl-2'
        : null;
    },
    iconTooltip: (value, rowIndex) => {
      return [0].includes(rowIndex)
        ? 'Principal Balance as at the last payment date'
        : '';
    },
  },
  {
    field: 'availableFunds',
    headerName: 'available_funds',
    width: '20%',
    format: '#currency',
    iconRight: (rowData) => {
      return [0].includes(rowData.__index)
        ? 'fa-regular fa-circle-info text-primary pl-2'
        : null;
    },
    iconTooltip: (value, rowIndex) => {
      return [0].includes(rowIndex)
        ? 'The lesser of Security Value or Limit, minus Current Balance.'
        : '';
    },
  },
];

export const easylinkFacilityColumnDefs = [
  {
    field: 'facilityName',
    headerName: 'easy_link',
    headerAction: 'clickData',
    width: '40%',
    class: 'text-primary',
    headingClass: 'border-right-2',
  },
  {
    field: 'limit',
    headerName: 'limit',
    format: '#currency',
    width: '20%',
  },
  {
    field: 'currentBalance',
    headerName: 'current_balance',

    format: '#currency',
    width: '20%',
    iconRight: (rowData) => {
      return [0].includes(rowData.__index)
        ? 'fa-regular fa-circle-info text-primary pl-2'
        : null;
    },
    iconTooltip: (value, rowIndex) => {
      return [0].includes(rowIndex)
        ? 'Principal Balance as at the last payment date'
        : '';
    },
  },
  {
    field: 'availableFunds',
    headerName: 'available_funds',

    format: '#currency',
    width: '20%',
    iconRight: (rowData) => {
      return [0].includes(rowData.__index)
        ? 'fa-regular fa-circle-info text-primary pl-2'
        : null;
    },
    iconTooltip: (value, rowIndex) => {
      return [0].includes(rowIndex) ? 'Limit minus Current Balance' : '';
    },
  },
];

export const paymentForcastColumnDefs = [
  {
    field: 'transformDate',
    headerName: 'month',
    width: '50%',
    class: 'text-center',
    columnHeaderClass: 'text-center',
  },
  {
    field: 'amount',
    headerName: 'amount',
    width: '50%',
    format: '#currency',
  },
];

export const frequencyOptionData = [
  { label: 'Monthly', value: 'm' },
  { label: 'Quarterly', value: 'q' },
  { label: 'Daily', value: 'd' },
];

export const facilityFrequencyOptions = [
  { label: 'Monthly', value: 'm' },
  { label: 'Quarterly', value: 'q' },
  { label: 'Yearly', value: 'y' },
];

export const bailmentcolumnDefs = [
  {
    field: 'facilityName',
    headerName: 'bailments',
    headerAction: 'clickData',

    class: 'text-primary',
    width: '20%',
  },
  {
    field: 'noOfAssets',
    headerName: 'no_of_assets',
    width: '20%',
    class: 'text-right',
    columnHeaderClass: 'text-right',
  },
  {
    field: 'limit',
    headerName: 'limit',
    format: '#currency',

    width: '20%',
  },
  {
    field: 'currentBalance',
    headerName: 'current_balance',
    format: '#currency',

    width: '20%',
  },
  {
    field: 'availableFunds',
    headerName: 'available_funds',
    format: '#currency',

    width: '20%',
  },
];

export const fixedFloorPlanColumnDefs = [
  {
    field: 'facilityName',
    headerName: 'fixed_floor_plan',
    headerAction: 'clickData',

    width: '20%',
    class: 'text-bold text-primary',
  },
  {
    field: 'noOfAssets',
    headerName: 'no_of_assets',
    columnHeaderClass: 'text-right',
    class: 'text-right',
    width: '20%',
  },
  {
    field: 'limit',
    headerName: 'limit',

    format: '#currency',
    width: '20%',
  },
  {
    field: 'currentBalance',
    headerName: 'current_balance',

    format: '#currency',
    width: '20%',
  },
  {
    field: 'availableFunds',
    headerName: 'available_funds',

    format: '#currency',
    width: '20%',
  },
];

export const requestHistoryColumnDefs = [
  {
    field: 'facility',
    headerName: 'facility',
  },
  {
    field: 'facilityType',
    headerName: 'facility_type',
  },
  {
    field: 'taskId',
    headerName: 'request_no',
    action: 'onCellClick',
    class: 'text-primary',
  },
  { field: 'requestType', headerName: 'type' },
  {
    field: 'status',
    headerName: 'status',
    class: 'text-primary',
    action: 'onCellClick',
  },
  { field: 'requestDate', headerName: 'request_date', format: '#date' },
  { field: 'description', headerName: 'description', class: 'trim_label' },
  { field: 'amount', headerName: 'amount', format: '#currency' },
  {
    field: 'loanNo',
    headerName: 'loan_no',
    action: 'onCellClick',
    class: 'text-primary',
  },
];
