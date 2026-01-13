import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuroUiFrameWork } from 'auro-ui';
import { AddSupplierIndividualComponent } from './add-supplier-individual/add-supplier-individual.component';
import { SupplierPersonalDetailsComponent } from './supplier-personal-details/supplier-personal-details.component';
import { SupplierBankDetailsComponent } from './supplier-bank-details/supplier-bank-details.component';
import { SupplierAddressDetailsComponent } from './supplier-address-details/supplier-address-details.component';
import { SupplierRoutingModule } from './supplier-routing.module';
import { AddSupplierBusinessComponent } from './add-supplier-business/add-supplier-business.component';
import { SupplierBusinessPersonalDetailsComponent } from './add-supplier-business/supplier-business-personal-details/supplier-business-personal-details.component';

@NgModule({
  declarations: [
    AddSupplierIndividualComponent,
    SupplierPersonalDetailsComponent,
    SupplierBankDetailsComponent,
    SupplierAddressDetailsComponent,
    AddSupplierBusinessComponent,
    SupplierBusinessPersonalDetailsComponent

  ],
  imports: [
    CommonModule,
    RouterModule,
    AuroUiFrameWork, 
    SupplierRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SupplierModule {}
