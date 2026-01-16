import { Component } from '@angular/core';
import { CommonService } from 'auro-ui';
import { GenerateCustomerStatementComponent } from '../generate-customer-statement/generate-customer-statement.component';
import { Router } from '@angular/router';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { OlSetterGetterService } from '../../../operating-lease/services/ol-setter-getter.service';
import { GenerateCustomerStatementParams } from '../../../utils/common-enum';

@Component({
  selector: 'app-loan-action',
  //standalone: true,
  //imports: [],
  templateUrl: './loan-action.component.html',
  styleUrls: ['./loan-action.component.scss'],
})
export class LoanActionComponent {
  facilityType: boolean;
  isCreditline: boolean;
  isOperatingLease: boolean;
  isNonfacility: boolean;
  isAssetlink: boolean;
  isEasylink: boolean;
  toDate;
  fromDate;
  contractId;

  constructor(public svc: CommonService, private router: Router,public commonSetterGetterSvc:CommonSetterGetterService,public olSetterGetterService:OlSetterGetterService) {}

  ngOnInit() {
    this.isCreditline = this.router.url.includes('/creditlines');
    this.isOperatingLease = this.router.url.includes('/operating-lease');
    this.isNonfacility = this.router.url.includes('/non-facility-loan');
    this.isAssetlink = this.router.url.includes('/assetlink');
    this.isEasylink = this.router.url.includes('/easylink');
    if(this.isOperatingLease){
      this.contractId= this.olSetterGetterService.getLeaseData()?.leaseId;
    }else{
      this.commonSetterGetterSvc.contractIdForSettlementQuote$.subscribe((contractId) => {
      this.contractId = contractId;
      });
    }
  }

  showGenerateCustomerPopup() {
    this.svc.dialogSvc
      .show(GenerateCustomerStatementComponent, 'Generate Customer Statement', {
        templates: {
          footer: null,
        },
        data: { contractId:this.contractId},

        width: '40vw',
      })
      .onClose.subscribe((data: any) => {});
  }

  showGeneratePiSchedulePopup() {
    this.svc.dialogSvc
      .show(
        GenerateCustomerStatementComponent,
        'Generate Principal and Interest Schedule',
        {
          templates: {
            footer: null,
          },
          data: {contractId:this.contractId,typeOfStatement:GenerateCustomerStatementParams.GeneratePrincipalandInterestSchedule},

          width: '40vw',
        }
      )
      .onClose.subscribe((data: any) => {});
  }

  showRequestQuotePopup() {
    if (this.router.url.includes('/easylink')) {
      this.router.navigate(['commercial/easylink/requestQuote']);
    } else if (this.router.url.includes('/assetlink')) {
      this.router.navigate(['commercial/assetlink/requestQuote']);
    }
  }
}
