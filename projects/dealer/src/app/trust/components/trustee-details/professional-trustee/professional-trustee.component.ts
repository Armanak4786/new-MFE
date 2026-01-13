import { Component, Input } from "@angular/core";
import { BaseTrustClass } from "../../../base-trust.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig } from "auro-ui";
import { TrustService } from "../../../services/trust.service";

@Component({
  selector: "app-professional-trustee",
  templateUrl: "./professional-trustee.component.html",
  styleUrl: "./professional-trustee.component.scss",
})
export class ProfessionalTrusteeComponent extends BaseTrustClass {
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: TrustService
  ) {
    super(route, svc, baseSvc);
  }

  override async ngOnInit() {
    await super.ngOnInit();
    this.formConfig = this.professionalTrusteeFormConfig;
  }
  @Input() professionalTrusteeFormConfig: GenericFormConfig;
  @Input() index: number;
  @Input() formData: any;

  override onButtonClick(event: any): void {}

  override onChildValueChanges(event: any) {
    this.childValueChanges.emit({
      data: event,
      index: this.index,
    });

    if (event.professionalclassification == "Individual") {
      this.mainForm.updateHidden({
        professionalTrusteesDob: false,
        professionalTrusteesEmail: false,
        professionalTrusteesLastName: false,
        professionalTrusteesFirstName: false,
        professionalTrusteesNumber: false,
        professionalTrusteesCode: false,
        professionalTrusteesAreaCode: false,
        professionalTrusteesPhoneCode: false,
        professionalTrusteesBusinessEmail: true,
        professionalTrusteesBusinessName: true,
        professionalTrusteesBusinessAreaCode: true,
        professionalTrusteesBusinessPhoneCode: true,
        professionalTrusteesBusinessNumber: true,
      });
    } else if (event.professionalclassification == "Business") {
      this.mainForm.updateHidden({
        professionalTrusteesBusinessEmail: false,
        professionalTrusteesBusinessName: false,
        professionalTrusteesBusinessAreaCode: false,
        professionalTrusteesBusinessPhoneCode: false,
        professionalTrusteesBusinessNumber: false,
        professionalTrusteesNumber: true,
        professionalTrusteesCode: true,
        professionalTrusteesPhoneCode: true,
        professionalTrusteesAreaCode: true,
        professionalTrusteesDob: true,
        professionalTrusteesEmail: true,
        professionalTrusteesLastName: true,
        professionalTrusteesFirstName: true,
      });
    }
  }

  override onChildFormEvent(event) {
    this.childFormEvent.emit(event);
  }
}
