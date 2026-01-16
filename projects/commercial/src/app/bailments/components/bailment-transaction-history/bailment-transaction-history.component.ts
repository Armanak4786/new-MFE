import { Component, Input } from '@angular/core';
import { ComponentLoaderService } from '../../../assetlink/services/component-loader.service';
import { transactionDetailsColumnDefs } from '../../utils/bailment-header.utils';
import { CommonApiService } from '../../../services/common-api.service';
import { InputGroup } from 'primeng/inputgroup';

@Component({
  selector: 'app-bailment-transaction-history',
  // standalone: false,
  // imports: [],
  templateUrl: './bailment-transaction-history.component.html',
  styleUrls: ['./bailment-transaction-history.component.scss']
})
export class BailmentTransactionHistoryComponent {
  @Input() transactionDetailsColumnDefs = transactionDetailsColumnDefs;
  @Input() transactionDetailsData: any[] = [];

  constructor(
      private componentLoaderService: ComponentLoaderService,
      public commonApiService: CommonApiService
    ){}
    
}

