import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'auro-ui';

interface Role {
    id: string;
    name: string;
    type: string;
}

interface Permission {
    id: string;
    label: string;
    checked: boolean;
}

interface PermissionCategory {
    id: string;
    title: string;
    icon: string;
    iconColor: string;
    permissions: Permission[];
}

@Component({
    selector: 'app-commercial-role-access',
    templateUrl: './role-access.component.html',
    styleUrls: ['./role-access.component.scss']
})
export class CommercialRoleAccessComponent implements OnInit {

    roles: Role[] = [
        { id: 'ext-sales', name: 'Ext-Sales (External)', type: 'external' },
        { id: 'int-sales', name: 'Int-Sales (Internal)', type: 'internal' },
        { id: 'manager', name: 'Manager', type: 'internal' },
        { id: 'admin', name: 'Administrator', type: 'internal' },
        { id: 'viewer', name: 'Viewer (Read Only)', type: 'external' }
    ];

    selectedRoleId: string = 'ext-sales';
    searchFilter: string = '';

    permissionCategories: PermissionCategory[] = [
        {
            id: 'general',
            title: 'General Permissions',
            icon: 'fa-solid fa-list',
            iconColor: '#3b82f6',
            permissions: [
                { id: 'view-loans', label: 'View Loans', checked: true },
                { id: 'submit-applications', label: 'Submit Applications', checked: true },
                { id: 'generate-statement', label: 'Generate Statement', checked: false },
                { id: 'settlement-quote', label: 'Settlement Quote', checked: true },
                { id: 'dealer-finance-widget', label: 'Dealer Finance Widget', checked: false },
                { id: 'modify-profile', label: 'Modify Profile', checked: false }
            ]
        },
        {
            id: 'widgets',
            title: 'Dashboard Widgets',
            icon: 'fa-solid fa-th-large',
            iconColor: '#f59e0b',
            permissions: [
                { id: 'monthly-volumes', label: 'Monthly Volumes', checked: false },
                { id: 'average-sale-price', label: 'Average Sale Price', checked: false },
                { id: 'average-commission', label: 'Average Commission', checked: false },
                { id: 'amount-financed', label: 'Amount Financed', checked: false },
                { id: 'fees-commission', label: 'Fees & Commission', checked: false },
                { id: 'margins-on-loans', label: 'Margins on Loans', checked: false },
                { id: 'application-outcome', label: 'Application Outcome', checked: false }
            ]
        },
        {
            id: 'listing',
            title: 'Dashboard Listing',
            icon: 'fa-solid fa-table-list',
            iconColor: '#22c55e',
            permissions: [
                { id: 'quote-listings', label: 'Quote Listings', checked: true },
                { id: 'active-loans-listings', label: 'Active Loans Listings', checked: false },
                { id: 'afv-loans-listings', label: 'AFV Loans Listings', checked: false },
                { id: 'expired-quotes-listing', label: 'Expired Quotes Listing', checked: false },
                { id: 'pipeline-overview', label: 'Pipeline Overview', checked: true }
            ]
        }
    ];

    constructor(private breadcrumbService: BreadcrumbService) { }

    ngOnInit(): void {
        this.breadcrumbService.updateCustomBreadcrumb({
            action: 'prepend',
            label: 'Commercial Portal',
            icon: '',
            url: '/',
        });
    }

    getFilteredPermissions(category: PermissionCategory): Permission[] {
        if (!this.searchFilter.trim()) {
            return category.permissions;
        }
        return category.permissions.filter(p => 
            p.label.toLowerCase().includes(this.searchFilter.toLowerCase())
        );
    }

    isAllSelected(category: PermissionCategory): boolean {
        const filtered = this.getFilteredPermissions(category);
        return filtered.length > 0 && filtered.every(p => p.checked);
    }

    toggleSelectAll(category: PermissionCategory): void {
        const filtered = this.getFilteredPermissions(category);
        const allSelected = this.isAllSelected(category);
        filtered.forEach(p => p.checked = !allSelected);
    }

    togglePermission(permission: Permission): void {
        permission.checked = !permission.checked;
    }

    onRoleChange(): void {
        console.log('Role changed to:', this.selectedRoleId);
    }

    exportPermissions(): void {
        console.log('Exporting permissions for Commercial:', {
            role: this.selectedRoleId,
            permissions: this.permissionCategories
        });
    }

    savePermissions(): void {
        console.log('Saving Commercial permissions:', {
            role: this.selectedRoleId,
            permissions: this.permissionCategories
        });
    }
}
