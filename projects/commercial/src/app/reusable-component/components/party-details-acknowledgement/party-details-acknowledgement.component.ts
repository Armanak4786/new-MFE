import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-party-details-acknowledgement',
  templateUrl: './party-details-acknowledgement.component.html',
  styleUrl: './party-details-acknowledgement.component.scss'
})
export class PartyDetailsAcknowledgementComponent {
  requestId;
  isContactUDC:boolean = false
  constructor(public router: Router,public dynamicDialog: DynamicDialogConfig,public ref: DynamicDialogRef){}
  ngOnInit(){
    if(this.dynamicDialog?.data?.requestType){
      this.requestId = this.dynamicDialog?.data?.responseId
      this.isContactUDC = true
    }else{
      this.requestId = this.dynamicDialog?.data;
    }
  }
onOkClick(){
  this.ref.close(); 
    if (this.dynamicDialog?.data?.requestType) {
      this.router.navigateByUrl('/dashboard');
    } else {
      this.router.navigateByUrl('/dashboard/update-party-details');
    }
  }
}
