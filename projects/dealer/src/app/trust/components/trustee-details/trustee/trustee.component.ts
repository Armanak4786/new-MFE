import { Component, Input } from "@angular/core";
import { BaseTrustClass } from "../../../base-trust.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig } from "auro-ui";
import { TrustService } from "../../../services/trust.service";
import { Validators } from "@angular/forms";

@Component({
  selector: "app-trustee",
  templateUrl: "./trustee.component.html",
  styleUrl: "./trustee.component.scss",
})
export class TrusteeComponent extends BaseTrustClass {
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: TrustService
  ) {
    super(route, svc, baseSvc);
  }

  override async ngOnInit() {
    await super.ngOnInit();

    this.formConfig = this.trusteeFormConfig;
  }

  @Input() trusteeFormConfig: GenericFormConfig;
  @Input() index: number;
  @Input() formData: any;

  override onButtonClick(event: any): void {
    if (event.field.name == "trusteeDeleteBtn") {
    }
  }

  override onChildValueChanges(event: any) {
    this.childValueChanges.emit({
      data: event,
      index: this.index,
    });
    if (event.classification == "Individual") {
      this.mainForm.updateHidden({
        trusteesDob: false,
        trusteesEmail: false,
        trusteesLastName: false,
        trusteesFirstName: false,
        trusteeNumber: false,
        trusteeAreaCode: false,
        trusteePhoneCode: false,
        trusteesBusinessEmail: true,
        trusteesBusinessName: true,
        trusteesBusinessAreaCode: true,
        trusteesBusinessPhoneCode: true,
        trusteesBusinessNumber: true,
      });
    } else if (event.classification == "Business") {
      this.mainForm.updateHidden({
        trusteesBusinessEmail: false,
        trusteesBusinessName: false,
        trusteesBusinessAreaCode: false,
        trusteesBusinessPhoneCode: false,
        trusteesBusinessNumber: false,
        trusteesDob: true,
        trusteesEmail: true,
        trusteesLastName: true,
        trusteesFirstName: true,
        trusteeNumber: true,
        trusteeAreaCode: true,
        trusteePhoneCode: true,
      });
    }
  }

  override onChildFormEvent(event) {
    this.childFormEvent.emit(event);
  }
}
