import { Component } from '@angular/core';
import { CommonService } from 'auro-ui';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';

@Component({
  selector: 'app-release-security-acknowledgement',
  templateUrl: './release-security-acknowledgement.component.html',
  styleUrl: './release-security-acknowledgement.component.scss',
})
export class ReleaseSecurityAcknowledgementComponent {
  referenceNumber;
  email;
  constructor(
    public svc: CommonService,
    public dynamicDialogConfig: DynamicDialogConfig,
    public commonSetterGetterSvc: CommonSetterGetterService
  ) { }

  ngOnInit(): void {
    this.referenceNumber = this.dynamicDialogConfig.data;
    this.referenceNumber = this.dynamicDialogConfig.data.taskId;
    this.commonSetterGetterSvc.userDetails$.subscribe((user) => {
      this.email = user.email;
    });
  }
}
