import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { DataService } from 'auro-ui';
import configure from '../../../../../../../public/assets/configure.json'

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

  constructor(private svc: DashboardService, private data:DataService) {}

  ngOnInit(): void {
    this.workFlow = this.svc.workFlow;
    let accessToken = sessionStorage.getItem("accessToken");
    let decodedToken = this.svc.decodeToken(accessToken);
    if(sessionStorage.getItem("externalUserType")==="Internal"){
    const request = {
      procedureName: configure.SPWorkflowExtract,
      parameterValues: [decodedToken?.sub, configure.operatingUnitForWorkflowStatusInternalSales, "DO Portal Workflow Steps", "Application State", "Dashboard Workflow State", "Application"]
    }
    const response = this.svc.data
      .post("LookUpServices/CustomData", request)
      .subscribe((res) => {
        if (res) {
          this.mergeWorkflow(res.data.table);
        }
      });
    }
  }

  mergeWorkflow(apiResponse: any[]) {
  this.workFlow = this.workFlow.map(wf => {
    const apiMatch = apiResponse.find(
      r => r.wf_status === wf.label
    );

    return apiMatch
      ? {
          label: wf.label,
          amount: apiMatch.amt,
          count: apiMatch.contract_count
        }
      : wf; 
  });
}


   toggleViewAll() {
    this.showAll = !this.showAll;
  }
}
