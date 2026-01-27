import { Component, Input } from '@angular/core';
import { CommonService } from 'auro-ui';
import { residualValueColumnDefs } from '../../../creditlines/utils/creditline-header-definition';

@Component({
  selector: 'app-lease-summary',
  //standalone: true,
  //imports: [],
  templateUrl: './lease-summary.component.html',
  styleUrl: './lease-summary.component.scss',
})
export class LeaseSummaryComponent {
  @Input() leaseData;
  @Input() leaseSummaryColumnDefs;
  @Input() leaseSummaryDataList;
  residualValueColumnDefs = residualValueColumnDefs;
  residualValueDataList = [];

  constructor(public svc: CommonService) {}

  ngOnInit() {
    console.log(this.leaseData);
    this.residualValueDataList = this.getResidualValue();
  }

  getResidualValue() {
    return [
      {
        gstExclude: this.leaseData.gstExclude,
        gst: this.leaseData.gst,
        gstInclude: this.leaseData.gstInclude,
        maturityDate: this.leaseData.maturityDate,
      },
    ];
  }
}
