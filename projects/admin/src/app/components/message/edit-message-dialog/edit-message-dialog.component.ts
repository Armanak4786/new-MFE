import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-edit-message-dialog',
    templateUrl: './edit-message-dialog.component.html',
    styleUrls: ['./edit-message-dialog.component.scss'],
})
export class EditMessageDialogComponent implements OnInit {
    isEditMode: boolean = false;

    // Form fields
    legalMessageTypeId: number | null = null;
    messageTypeCode: string = '';
    messageTypeName: string = '';
    messageTitle: string = '';
    selectedMessageType: string = 'error';
    description: string = '';
    selectedPortals: string[] = [];
    customContent: string = '';
    isActive: boolean = true;

    // Dropdown options - populated from API via config.data
    messageCodeOptions: { label: string; value: string }[] = [];

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
    ) { }

    ngOnInit(): void {
        console.log('Dialog config data:', this.config.data);
        const data = this.config.data;

        // Populate message code options from passed data
        if (data?.messageCodeOptions && Array.isArray(data.messageCodeOptions)) {
            this.messageCodeOptions = data.messageCodeOptions;
        }

        // Check if it's edit mode by looking for legalMessageTypeId
        if (data && data.legalMessageTypeId) {
            this.isEditMode = true;

            // Populate form fields from passed data
            this.legalMessageTypeId = data.legalMessageTypeId;
            this.messageTypeCode = data.messageTypeCode || '';
            this.messageTypeName = data.messageTypeName || '';
            this.messageTitle = data.messageTypeName || data.messageTypeCode || '';
            this.description = data.description || '';
            this.customContent = data.description || '';
            this.isActive = data.isActive === 'Active' || data.isActive === true;

            // Determine message type from messageTypeName
            if (data.messageTypeName) {
                this.selectedMessageType = data.messageTypeName.toLowerCase().includes('error') ? 'error' : 'legal';
            }

            // Set portals based on data (can be array or single value)
            if (data.portalContexts && Array.isArray(data.portalContexts)) {
                this.selectedPortals = [...data.portalContexts];
            } else if (data.portalContext) {
                this.selectedPortals = [data.portalContext];
            }
        } else {
            // Create mode - set default portal if provided
            this.isEditMode = false;
            if (data?.portal) {
                this.selectedPortals = [data.portal];
            }
        }
    }

    togglePortal(portal: string): void {
        const index = this.selectedPortals.indexOf(portal);
        if (index > -1) {
            this.selectedPortals.splice(index, 1);
        } else {
            this.selectedPortals.push(portal);
        }
    }

    cancel(): void {
        this.ref.close();
    }

    saveChanges(): void {
        const result = {
            legalMessageTypeId: this.legalMessageTypeId,
            messageTypeCode: this.messageTypeCode,
            messageTypeName: this.messageTypeName,
            messageTitle: this.messageTitle,
            messageType: this.selectedMessageType,
            description: this.customContent,
            portalContexts: this.selectedPortals,
            isActive: this.isActive,
        };
        this.ref.close(result);
    }
}

