import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-address-not-found-popup',
  templateUrl: './address-not-found-popup.component.html',
  styleUrls: ['./address-not-found-popup.component.scss'],
})
export class AddressNotFoundPopupComponent {
  constructor(public router: Router, public ref: DynamicDialogRef) {}
  onBackToHomeClick() {
    this.ref.close();
  }
}
