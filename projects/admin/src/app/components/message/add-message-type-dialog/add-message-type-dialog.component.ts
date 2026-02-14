import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-add-message-type-dialog',
  templateUrl: './add-message-type-dialog.component.html',
  styleUrls: ['./add-message-type-dialog.component.scss'],
})
export class AddMessageTypeDialogComponent implements OnInit {
  messageTypeCode: string = '';
  messageTypeName: string = '';
  portal: string = '';

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) {}

  ngOnInit(): void {
    if (this.config.data?.portal) {
      this.portal = this.config.data.portal;
    }
  }

  cancel(): void {
    this.ref.close();
  }

  save(): void {
    if (this.messageTypeName) {
      // Auto-generate code from name (e.g., "Key Disclosure" -> "KEY_DISCLOSURE")
      const generatedCode = this.messageTypeName.toUpperCase().replace(/\s+/g, '_');
      
      const result = {
        messageTypeCode: generatedCode,
        messageTypeName: this.messageTypeName,
        portal: this.portal,
      };
      this.ref.close(result);
    }
  }
}

