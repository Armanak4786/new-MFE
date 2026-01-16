import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonService } from 'auro-ui';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-document-view',
  //standalone: true,
  //imports: [],
  templateUrl: './document-view.component.html',
  styleUrls: ['./document-view.component.scss'],
})
export class DocumentViewComponent {
  displayDoc: string;
  displayDocType: string;

  private objectUrl: string;

  constructor(
    public svc: CommonService,
    public dynamicDialogConfig: DynamicDialogConfig
  ) {}

  ngOnInit() {
    if (this.dynamicDialogConfig?.data) {
      this.displayDoc =
        // this.dynamicDialogConfig?.data?.displayDoc?.objectURL?.changingThisBreaksApplicationSecurity;
        this.dynamicDialogConfig?.data?.displayDoc;
      this.displayDocType = this.dynamicDialogConfig?.data?.displayDocType;
    }
  }

  ngOnDestroy() {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl); // Clean up
    }
  }
}
