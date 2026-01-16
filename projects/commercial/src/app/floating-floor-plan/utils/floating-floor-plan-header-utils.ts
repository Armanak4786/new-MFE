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

export const todaysActivityColDef: any[] = [
  {
    field: 'activityType',
    headerName: 'activity',
    sortable: true,
  },
  {
    field: 'amount',
    headerName: 'amount',
    format: '#currency',
    sortable: true,
  },
];
