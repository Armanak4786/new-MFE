import { FixedFloorAssetActionComponent } from '../components/fixed-floor-asset-action/fixed-floor-asset-action.component';
export const fixedFloorPlanColumnDefs = [
  {
    field: 'facilityName',
    headerName: 'fixed_floor_plan',
    class: 'text-bold text-primary',
    columnHeaderClass: 'text-xs',
    action: 'onCellClick',
    width: '25%',
  },

  {
    field: 'noOfAssets',
    headerName: 'no_of_assets',
    class: 'text-right',
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
    headerAction: 'test',
    sortable: true,
    class: 'text-bold',
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
    headerName: 'Chassis/Serial No.',
    headerAction: 'test',
    sortable: true,
    class: 'text-bold',
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
    overlayPanel: FixedFloorAssetActionComponent,
    action: 'onCellClick',
  },
];

export const fixedDrawdownColumnDefs = [
  {
    field: 'taskId',
    headerName: 'request_no',
    action: 'onCellClick',
    class: 'text-primary',
    sortable: true,
  },
  { field: 'type', headerName: 'type', sortable: true },
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
    field: 'assetId',
    headerName: 'assetId',
    sortable: true,
  },
  // {
  //   field: 'contractNo',
  //   headerName: 'contract_no',
  //   sortable: true,
  // },
  {
    field: 'status',
    headerName: 'status',
    sortable: true,
  },
];
