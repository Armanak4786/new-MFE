import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-cancel-popup',
  templateUrl: './cancel-popup.component.html',
  styleUrls: ['./cancel-popup.component.scss'],
})
export class CancelPopupComponent {
  confirmationMsg: any = '';
  constructor(
    public ref: DynamicDialogRef,
    public dynamicDialogConfig: DynamicDialogConfig
  ) {}

  ngOnInit() {
   
    if (this.dynamicDialogConfig?.data) {
      this.confirmationMsg = this.dynamicDialogConfig.data.confirmation;
      
    }
  }

  continue() {
    // this.ref.close({data: 'cancel'});
    this.ref.close({ data: 'cancel' });
  }

  cancel() {
    this.ref.close();
  }
}
