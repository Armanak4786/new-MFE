import { ChangeDetectorRef, Component } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { BaseStandardQuoteClass } from "../../../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from "auro-ui";
import { StandardQuoteService } from "../../../../services/standard-quote.service";
import { DashboardService } from "../../../../../dashboard/services/dashboard.service";

@Component({
  selector: "app-charges-add-other-items",
  templateUrl: "./charges-add-other-items.component.html",
  styleUrl: "./charges-add-other-items.component.scss",
})
export class ChargesAddOtherItemsComponent extends BaseStandardQuoteClass {
  chargesForm!: FormGroup;
  charges !: FormArray;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    private cd: ChangeDetectorRef,
    private dashboardSvc: DashboardService,
    private fb : FormBuilder
  ) {
    super(route, svc, baseSvc);

    this.chargesForm = this.fb.group({
      charges: this.fb.array([])   // start with empty array
    });
    this.charges = this.chargesForm.get('charges') as FormArray;
  }

  addCharges() {
    if(this.charges.length < 5){
    const chargeGroup = this.fb.group({
    description: [''],
    amount: ['']
    });

  this.charges.push(chargeGroup);
    }
  }

   removeCharge(index: number) {
    this.charges.removeAt(index);
  }

  get subtotal(): number {
  return this.charges.controls
    .map(control => control.get('amount')?.value || 0)
    .reduce((acc, curr) => acc + Number(curr), 0);
}
}
