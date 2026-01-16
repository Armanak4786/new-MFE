import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardSetterGetterService } from '../../services/dashboard-setter-getter.service';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';

@Component({
  selector: 'app-originator-account',
  templateUrl: './originator-account.component.html',
  styleUrls: ['./originator-account.component.scss'],
})
export class OriginatorAccountComponent {
  @Input() financialSummaryData;
  orinatorDataList = [];
  accessGranted;
  columnDefs: any[] = [
    {
      field: 'originatorAccount',
      headerName: 'introducer_transaction_details',
      headerAction: 'clickData',
      width: '60%',
      class: 'text-right',
    },
    {
      field: 'day',
      headerName: 'next_cycle_date',
      width: '20%',
      format: '#date',
    },
    {
      field: 'currentBalance',
      headerName: 'current_balance',
      width: '20%',
      format: '#currency',
    },
  ];

  constructor(
    private router: Router,
    public dashboardSetterGetterSvc: DashboardSetterGetterService,
    public commonSetterGetterService: CommonSetterGetterService
  ) {}

  ngOnInit() {
    const roleBased = JSON.parse(sessionStorage.getItem('RoleBasedActions'));
    if (
      roleBased &&
      roleBased.functions &&
      typeof roleBased.functions === 'object'
    ) {
      this.accessGranted = Object.keys(roleBased.functions).map((fn) =>
        fn.trim()
      );
    } else {
      this.accessGranted = [];
    }
  }

  ngOnChanges(changes) {
    if (changes['financialSummaryData']) {
      this.orinatorDataList =
        this.financialSummaryData?.introducerTransactionDetails;
    }
  }

  hasAccess(key) {
    if (!this.accessGranted || !Array.isArray(this.accessGranted)) {
      return true;
    }
    return !this.accessGranted?.includes(key);
  }

  clickData() {
    this.commonSetterGetterService.updateSection(
      'introducerTransactionDetails',
      this.orinatorDataList
    );
    this.router.navigate(['/commercial/introducer']);
  }

  onHeaderClick(event) {
    this[event.actionName]();
  }
}
