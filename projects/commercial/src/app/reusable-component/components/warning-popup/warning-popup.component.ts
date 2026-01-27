import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-warning-popup',
  // standalone: true,
  // imports: [],
  templateUrl: './warning-popup.component.html',
  styleUrls: ['./warning-popup.component.scss']
})
export class WarningPopupComponent {
  facilityRoute: string = '';
  selectedFacility: string = '';
  selectedSubFacility: string = '';
  messageKey: string = '';

  constructor( 
    private router: Router,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ){}

 ngOnInit() {
    if (this.config?.data) {
      this.facilityRoute = this.config.data.facilityRoute;
      this.messageKey = this.config.data.messageKey;
    }
  }

  onCancel() {
    this.ref.close();
    if (this.facilityRoute) {
      setTimeout(() => {
        this.router.navigate([`${this.facilityRoute}`]);
      }, 0);
    }
  }
 
}
