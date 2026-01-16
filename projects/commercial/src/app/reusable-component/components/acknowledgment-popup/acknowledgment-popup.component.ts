import { Component, Input } from '@angular/core';
import { CommonService } from 'auro-ui';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';

@Component({
  selector: 'app-acknowledgment-popup',
  // standalone: true,
  // imports: [],
  templateUrl: './acknowledgment-popup.component.html',
  styleUrls: ['./acknowledgment-popup.component.scss']
})
export class AcknowledgmentPopupComponent {
  message;
  email;

  constructor(
    public svc: CommonService,
    public dynamicDialogConfig: DynamicDialogConfig,
    public commonSetterGetterSvc: CommonSetterGetterService
  ) { }

  ngOnInit(): void {

    this.message = this.dynamicDialogConfig?.data.message;

    this.commonSetterGetterSvc.userDetails$.subscribe((user) => {
      this.email = user.email;
    });
  }
}
