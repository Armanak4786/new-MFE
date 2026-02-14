import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'auro-ui';
import { firstValueFrom } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { EditMessageDialogComponent } from './edit-message-dialog/edit-message-dialog.component';
import { AddMessageTypeDialogComponent } from './add-message-type-dialog/add-message-type-dialog.component';

interface FilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  // Current portal context
  currentPortal: string = 'dealer';
  portalDisplayName: string = 'Dealer Portal';

  // Filter options - will be loaded from API
  messageTypeOptions: FilterOption[] = [{ label: 'All', value: 'all' }];

  statusOptions: FilterOption[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  // Selected filters
  selectedMessageType: string = 'all';
  selectedStatus: string = 'all';

  // Active filter chips
  activeFilters: { key: string; label: string; value: string }[] = [];

  // Table configuration
  columnDefs: any[] = [
    {
      field: 'messageTypeCode',
      headerName: 'MESSAGE TYPE',
      columnBodyClass: 'txt-blue',
      width: '150px',
    },
    {
      field: 'messageTypeCode',
      headerName: 'MESSAGE TITLE',
      columnBodyClass: 'txt-blue',
      width: '150px',
    },
    {
      field: 'description',
      headerName: 'CONTENT PREVIEW',
      width: '250px',
    },
    {
      field: 'isActive',
      headerName: 'STATUS',
      width: '80px',
    },
    {
      field: 'action',
      headerName: 'ACTIONS',
      width: '50px',
      format:
        '<span style="display: inline-flex; align-items: center; gap: 12px; white-space: nowrap;"><i class="fa-solid fa-pencil action-icon edit-icon"></i><i class="fa-solid fa-trash action-icon delete-icon"></i></span>',
      action: 'action',
    },
  ];
  legalMessages: any[] = [];
  allLegalMessages: any[] = [];

  constructor(
    private svc: CommonService,
    private dialogService: DialogService,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    this.detectCurrentPortal();
    await this.loadLegalMessages();
  }

  detectCurrentPortal(): void {
    const url = this.router.url;
    const segments = url.split('/').filter((s) => s);

    if (segments.length > 0) {
      const portal = segments[0].toLowerCase();
      this.currentPortal = portal;

      // Set display name based on portal
      const portalNames: { [key: string]: string } = {
        dealer: 'Dealer Portal',
        retail: 'Retail Portal',
        commercial: 'Commercial Portal',
      };
      this.portalDisplayName = portalNames[portal] || 'Portal';
    }
  }

  async loadLegalMessages(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.svc.data.get(`LegalMessagesAdmin/types`),
      );

      console.log('Current Portal:', this.currentPortal);
      console.log('Total records from API:', response.length);

      // Filter data based on current portal
      const portalFilteredData = response.filter(
        (item: any) => item.portal?.toLowerCase() === this.currentPortal,
      );

      this.allLegalMessages = response.map((item: any) => ({
        legalMessageTypeId: item.legalMessageTypeId,
        messageTypeCode: item.messageTypeCode,
        description: item.description,
        messageTypeName: item.messageTypeName,
        isActive: item.isActive ? 'Active' : 'Inactive',
        displayOrder: item.displayOrder,
        createdBy: item.createdBy,
        createdAt: item.createdAt,
      }));

      this.legalMessages = [...this.allLegalMessages];

      // Use full response to populate message code options
      this.populateMessageTypeOptions(response);
    } catch (error) {
      console.error('Error loading legal messages:', error);
    }
  }

  populateMessageTypeOptions(data: any[]): void {
    const uniqueCodes = new Set<string>();

    data.forEach((item: any) => {
      if (item.messageTypeCode) {
        uniqueCodes.add(item.messageTypeCode);
      }
    });

    this.messageTypeOptions = [{ label: 'All', value: 'all' }];

    uniqueCodes.forEach((code) => {
      this.messageTypeOptions.push({
        label: code,
        value: code,
      });
    });

    console.log('Message Type Options:', this.messageTypeOptions);
  }

  updateActiveFilters(): void {
    this.activeFilters = [];

    if (this.selectedStatus !== 'all') {
      this.activeFilters.push({
        key: 'status',
        label: 'Status',
        value:
          this.selectedStatus.charAt(0).toUpperCase() +
          this.selectedStatus.slice(1),
      });
    }

    if (this.selectedMessageType !== 'all') {
      const selectedType = this.messageTypeOptions.find(
        (opt) => opt.value === this.selectedMessageType,
      );
      if (selectedType) {
        this.activeFilters.push({
          key: 'messageType',
          label: 'Type',
          value: selectedType.label,
        });
      }
    }
  }

  removeFilter(filterKey: string): void {
    if (filterKey === 'status') {
      this.selectedStatus = 'all';
    } else if (filterKey === 'messageType') {
      this.selectedMessageType = 'all';
    }
    this.updateActiveFilters();
    this.applyFilters();
  }

  clearAllFilters(): void {
    this.selectedMessageType = 'all';
    this.selectedStatus = 'all';
    this.activeFilters = [];
    this.legalMessages = [...this.allLegalMessages];
  }

  onFilterChange(): void {
    this.updateActiveFilters();
    this.applyFilters();
  }

  applyFilters(): void {
    let filteredData = [...this.allLegalMessages];

    if (this.selectedMessageType !== 'all') {
      filteredData = filteredData.filter(
        (item) => item.messageTypeCode === this.selectedMessageType,
      );
    }

    if (this.selectedStatus !== 'all') {
      const statusValue =
        this.selectedStatus.charAt(0).toUpperCase() +
        this.selectedStatus.slice(1);
      filteredData = filteredData.filter((item) => item.status === statusValue);
    }

    this.legalMessages = filteredData;
  }

  onCellClick(event: any): void {
    console.log('Cell click event:', event);
    if (event.actionName === 'action') {
      // gen-table passes rowData directly, or use index to get from array
      const rowData = event.rowData || this.legalMessages[event.index];
      console.log('Opening edit dialog with data:', rowData);
      if (rowData) {
        this.openEditDialog(rowData);
      }
    }
  }

  createNewMessage(): void {
    this.openEditDialog(null);
  }

  openEditDialog(data: any): void {
    // Pass current portal context and message code options for new messages
    const dialogData = data
      ? { ...data, messageCodeOptions: this.messageTypeOptions.filter(opt => opt.value !== 'all') }
      : { portal: this.currentPortal, messageCodeOptions: this.messageTypeOptions.filter(opt => opt.value !== 'all') };

    const ref = this.dialogService.open(EditMessageDialogComponent, {
      data: dialogData,
      header: '',
      width: '700px',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      dismissableMask: true,
      styleClass: 'edit-message-modal',
    });

    ref.onClose.subscribe((result: any) => {
      if (result) {
        console.log('Dialog result:', result);
        // Handle save - call API to create/update message
        this.loadLegalMessages(); // Refresh the list
      }
    });
  }

  createNewMessageType(): void {
    const ref = this.dialogService.open(AddMessageTypeDialogComponent, {
      data: { portal: this.currentPortal },
      header: '',
      width: '500px',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      dismissableMask: true,
      styleClass: 'edit-message-modal',
    });

    ref.onClose.subscribe((result: any) => {
      if (result) {
        console.log('New message type:', result);
        // Add the new message type to the dropdown options
        this.messageTypeOptions.push({
          label: result.messageTypeName,
          value: result.messageTypeCode,
        });
        // TODO: Call API to save the new message type with portal: this.currentPortal
      }
    });
  }
}

