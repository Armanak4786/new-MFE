import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService, GenericDialogService } from 'auro-ui';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';

@Component({
  selector: 'app-request-acknowledgment',
  //standalone: true,
  //imports: [],
  templateUrl: './request-acknowledgment.component.html',
  styleUrls: ['./request-acknowledgment.component.scss'],
})
export class RequestAcknowledgmentComponent {
  //@Output() returntoDash = new EventEmitter<boolean>();
  subject;
  referenceNumber;
  email;
  constructor(
    public svc: CommonService,
    public dynamicDialogConfig: DynamicDialogConfig,
    public commonSetterGetterSvc: CommonSetterGetterService
  ) {}

  ngOnInit(): void {
    this.referenceNumber = this.dynamicDialogConfig.data.taskId;
    this.subject = this.dynamicDialogConfig.data.subject;
    console.log('typeOfRequest', this.subject);
    this.commonSetterGetterSvc.userDetails$.subscribe((user) => {
      this.email = user.email;
    });
  }
}
