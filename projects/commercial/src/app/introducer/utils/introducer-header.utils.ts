export const introducerColumnDefs = [
  {
    field: 'originatorAccount>',
    headerName: 'introducer_transaction_details',
    headerAction: 'clickData',
    width: '60%',
    class: 'text-right',
  },
  {
    field: 'day',
    headerName: 'next_cycle_date',
    width: '20%',
    columnHeaderClass: 'text-right',
    class: 'text-right',
    format: '#date',
  },
  {
    field: 'currentBalance',
    headerName: 'current_balance',
    width: '20%',
    columnHeaderClass: 'text-right',
    class: 'text-right',
    format: '#currency',
  },
];

export const introducerDocumentsColumnDefs = [
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
    sortable: false,
  },
  {
    field: 'description',
    headerName: 'description',
    sortable: true,
  },
];
