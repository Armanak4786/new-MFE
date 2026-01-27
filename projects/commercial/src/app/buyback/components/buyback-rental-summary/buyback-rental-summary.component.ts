import { Component, Input } from '@angular/core';
import { buybackResidualValueColumnDefs } from '../../utils/buyback-header.utils';

@Component({
  selector: 'app-buyback-rental-summary',
  //standalone: true,
  //imports: [],
  templateUrl: './buyback-rental-summary.component.html',
  styleUrl: './buyback-rental-summary.component.scss',
})
export class BuybackRentalSummaryComponent {
  @Input() leaseData;
  @Input() leaseSummaryColumnDefs;
  @Input() leaseSummaryDataList;
  residualValueDataList;
  residualValueColumnDefs = buybackResidualValueColumnDefs;

  ngOnInit() {
    this.residualValueDataList = this.getResidualValue();
  }

  getResidualValue() {
    return [
      {
        gstExclude: this.leaseData.residualValue,
        gst: this.leaseData.gst,
        gstInclude: this.leaseData.residualValue + this.leaseData.gst,
        endDate: this.leaseData.endDate,
      },
    ];
  }
}
