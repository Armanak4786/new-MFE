import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { DataService } from 'auro-ui';
import configure from 'src/assets/configure.json';

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

  private readonly defaultWorkflows = [
    { label: 'Quote', amount: 0, count: 0 },
    { label: 'Assessment', amount: 0, count: 0 },
    { label: 'Approved', amount: 0, count: 0 },
    { label: 'With Customer for Signing', amount: 0, count: 0 },
    { label: 'Verification', amount: 0, count: 0 },
    { label: 'Settlement', amount: 0, count: 0 },
    { label: 'Not Tracked', amount: 0, count: 0 },
  ];

  constructor(
    private svc: DashboardService,
    private data: DataService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Keep existing internal-user workflow behavior intact.
    this.workFlow = this.svc.workFlow;

    const accessToken = sessionStorage.getItem('accessToken');
    const decodedToken = this.svc.decodeToken(accessToken);

    if (sessionStorage.getItem('externalUserType') === 'Internal') {
      const request = {
        procedureName: configure.SPWorkflowExtract,
        parameterValues: [
          decodedToken?.sub,
          configure.operatingUnitForWorkflowStatusInternalSales,
          'DO Portal Workflow Steps',
          'Application State',
          'Dashboard Workflow State',
          'Application',
        ],
      };
      this.svc.data.post('LookUpServices/CustomData', request).subscribe((res) => {
        if (res) {
          this.mergeWorkflow(res.data.table);
        }
      });
    } else {
      void this.loadExternalWorkflow(decodedToken);
    }
  }

  private async loadExternalWorkflow(decodedToken: any): Promise<void> {
    const userId = decodedToken?.preferred_username || decodedToken?.sub;
    if (!userId) return;

    const selectedDealerNo = this.svc.onOriginatorChange?.()?.num;
    const sessionDealerNoRaw = sessionStorage.getItem('dealerPartyNumber');
    const sessionDealerNo = sessionDealerNoRaw != null ? Number(sessionDealerNoRaw) : null;
    const dealerId =
      typeof selectedDealerNo === 'number'
        ? selectedDealerNo
        : Number.isFinite(sessionDealerNo as number)
          ? (sessionDealerNo as number)
          : null;

    const payload = { dealerId, userId };

    try {
      const res = await this.svc.getWorkflowStatusOnceAsync(payload);
      // External user: use the previous approach (directly map API response to UI).
      this.workFlow = this.mapToUI(res);
      this.cd.detectChanges();
    } catch {
      // handled by global interceptors / keep default UI state
    }
  }

  mergeWorkflow(apiResponse: any[]) {
    this.workFlow = this.workFlow.map((wf) => {
      const apiMatch = apiResponse.find((r) => r.wf_status === wf.label);

      return apiMatch
        ? {
            label: wf.label,
            amount: apiMatch.amt,
            count: apiMatch.contract_count,
          }
        : wf;
    });
  }

  private mapToUI(apiResponse: any): any[] {
    let rawData: any[] = [];
    if (Array.isArray(apiResponse?.data)) {
      rawData = apiResponse.data;
    } else if (Array.isArray(apiResponse?.data?.table)) {
      rawData = apiResponse.data.table;
    }

    const aggregationMap = new Map<string, { amount: number; count: number }>();
    rawData.forEach((item: any) => {
      const rawKey = item.workflowStatus || item.wf_status || '';
      const normalizedKey = String(rawKey).trim().toLowerCase();

      const current = aggregationMap.get(normalizedKey) || { amount: 0, count: 0 };
      const newItemAmount = item.totalAmount ?? item.amt ?? 0;
      const newItemCount = item.contractCount ?? item.contract_count ?? 0;

      aggregationMap.set(normalizedKey, {
        amount: current.amount + newItemAmount,
        count: current.count + newItemCount,
      });
    });

    return this.defaultWorkflows.map((def) => {
      const lookupKey = def.label.trim().toLowerCase();
      const match = aggregationMap.get(lookupKey);

      return {
        label: def.label,
        amount: match ? match.amount : 0,
        count: match ? match.count : 0,
      };
    });
  }

  toggleViewAll() {
    this.showAll = !this.showAll;
  }
}