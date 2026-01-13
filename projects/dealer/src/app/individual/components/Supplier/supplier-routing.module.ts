import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSupplierIndividualComponent } from './add-supplier-individual/add-supplier-individual.component';
import { AddSupplierBusinessComponent } from './add-supplier-business/add-supplier-business.component';

const routes: Routes = [
  {
    path: "add-supplier-individual",
    component: AddSupplierIndividualComponent,
  },
  {
    path:"add-supplier-business",
    component: AddSupplierBusinessComponent,
   
  },
 {
    path: "individual",
    component: AddSupplierIndividualComponent,
  },
  {
    path: "business",
    component: AddSupplierBusinessComponent,
  },
 
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupplierRoutingModule {}
