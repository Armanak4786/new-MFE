import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-lease-schedule',
  //standalone: true,
  //imports: [],
  templateUrl: './lease-schedule.component.html',
  styleUrl: './lease-schedule.component.scss',
})
export class LeaseScheduleComponent {
  @Input() leaseScheduleColumnDefs;
  @Input() leaseScheduleDataList;
}
