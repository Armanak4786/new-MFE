import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-workflow-status',
  templateUrl: './workflow-status.component.html',
  styleUrl: './workflow-status.component.scss',
})
export class WorkflowStatusComponent implements OnInit {
  workFlow: any;
  @Input() isInternalSalesDashboard: boolean;
@Input() isFullWidth: boolean = false;
   showAll: boolean = false; 

  constructor(private svc: DashboardService) {}

  ngOnInit(): void {
    this.workFlow = this.svc.workFlow;
  }

   toggleViewAll() {
    this.showAll = !this.showAll;
  }
}
