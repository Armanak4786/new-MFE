import { Component } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
  selector: "app-add-contacts",
  templateUrl: "./add-contacts.component.html",
  styleUrl: "./add-contacts.component.scss",
})
export class AddContactsComponent {
  parent: any;
  modalType: string;
  rowData: any;
  IndividualformConfig: any;
  BusinessformConfig: any;
  viewMode: any;
  signatoriesData: any;
  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) {}

  async ngOnInit() {
    this.parent = this.config?.data?.parent;

    this.modalType = this.config?.data?.modalType;
    this.rowData = this.config?.data?.rowData;
    this.IndividualformConfig = this.config?.data?.IndividualformConfig;
    this.BusinessformConfig = this.config?.data?.BusinessformConfig;
    this.viewMode = this.config?.data?.viewMode;
    this.signatoriesData = this.config?.data?.signatoriesData;
  }

  onClose() {
    this.ref.close();
  }
}
