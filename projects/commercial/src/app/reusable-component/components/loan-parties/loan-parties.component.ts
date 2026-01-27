import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loan-parties',
  //standalone: true,
  //imports: [],
  templateUrl: './loan-parties.component.html',
  styleUrl: './loan-parties.component.scss',
})
export class LoanPartiesComponent {
  @Input() leasePartiesData;
  @Input() leasePartiesColumnDef;

  columnDefs: any[] = [
    {
      field: 'name',
      headerName: 'Name',
      headerAction: 'text',
      class: 'text-bold',
    },
    {
      field: 'role',
      headerName: 'Role',
      headerAction: 'test',
      class: 'text-bold',
    },
    {
      field: 'type',
      headerName: 'Type',
      headerAction: 'test',
      class: 'text-bold',
    },
  ];
}
