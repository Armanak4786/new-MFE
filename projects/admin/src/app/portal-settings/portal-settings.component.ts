import { Component, OnInit } from '@angular/core';

interface FeatureItem {
    id: string;
    name: string;
    description: string;
    adminPortal: boolean;
    commercialPortal: boolean;
    retailPortal: boolean;
}

interface FeatureCategory {
    id: string;
    name: string;
    icon: string;
    iconBg: string;
    expanded: boolean;
    items: FeatureItem[];
}

@Component({
    selector: 'app-portal-settings',
    templateUrl: './portal-settings.component.html',
    styleUrls: ['./portal-settings.component.scss']
})
export class PortalSettingsComponent implements OnInit {
    
    systemsSynced: boolean = true;

    featureCategories: FeatureCategory[] = [
        {
            id: 'branding',
            name: 'BRANDING & VISUAL IDENTITY',
            icon: 'fa-solid fa-palette',
            iconBg: '#3b82f6',
            expanded: true,
            items: [
                {
                    id: 'company-logo',
                    name: 'Company Logo',
                    description: 'Manage primary and secondary logo variations.',
                    adminPortal: true,
                    commercialPortal: true,
                    retailPortal: true
                },
                {
                    id: 'brand-assets',
                    name: 'Brand Assets',
                    description: 'Custom iconography and marketing imagery library.',
                    adminPortal: true,
                    commercialPortal: true,
                    retailPortal: false
                },
                {
                    id: 'typography',
                    name: 'Typography',
                    description: 'Global font family and heading styles configuration.',
                    adminPortal: true,
                    commercialPortal: false,
                    retailPortal: false
                }
            ]
        },
        {
            id: 'legal-messages',
            name: 'LEGAL MESSAGES',
            icon: 'fa-solid fa-file-contract',
            iconBg: '#0891b2',
            expanded: false,
            items: [
                {
                    id: 'key-disclosure',
                    name: 'Key Disclosure',
                    description: 'Important disclosure statements and legal notices.',
                    adminPortal: true,
                    commercialPortal: true,
                    retailPortal: true
                },
                {
                    id: 'submission-success',
                    name: 'Application Submission- Success',
                    description: 'Success message displayed after application submission.',
                    adminPortal: true,
                    commercialPortal: true,
                    retailPortal: true
                },
                {
                    id: 'submission-failure',
                    name: 'Application Submission- Failure',
                    description: 'Error message displayed when submission fails.',
                    adminPortal: true,
                    commercialPortal: true,
                    retailPortal: false
                },
                {
                    id: 'drawdown-info',
                    name: 'Drawdown- Additional Info',
                    description: 'Additional information displayed during drawdown process.',
                    adminPortal: true,
                    commercialPortal: true,
                    retailPortal: true
                }
            ]
        },
        {
            id: 'error-messages',
            name: 'ERROR MESSAGES',
            icon: 'fa-solid fa-triangle-exclamation',
            iconBg: '#ef4444',
            expanded: false,
            items: [
                {
                    id: 'edit-payment-schedule',
                    name: 'Edit Payment Schedule',
                    description: 'Error message for payment schedule modifications.',
                    adminPortal: true,
                    commercialPortal: true,
                    retailPortal: true
                },
                {
                    id: 'submission-acknowledgement',
                    name: 'Application Submission- Acknowledgement',
                    description: 'Acknowledgement message after application submission.',
                    adminPortal: true,
                    commercialPortal: true,
                    retailPortal: true
                },
                {
                    id: 'drawdown-warning',
                    name: 'Drawdown Request- Warning',
                    description: 'Warning message displayed during drawdown requests.',
                    adminPortal: true,
                    commercialPortal: true,
                    retailPortal: false
                }
            ]
        },
        {
            id: 'role-base-access',
            name: 'ROLE BASE ACCESS',
            icon: 'fa-solid fa-user-lock',
            iconBg: '#8b5cf6',
            expanded: false,
            items: [
                {
                    id: 'dashboard-listing',
                    name: 'Dashboard Listing',
                    description: 'Control access to dashboard listing views.',
                    adminPortal: true,
                    commercialPortal: true,
                    retailPortal: true
                },
                {
                    id: 'dashboard-widgets',
                    name: 'Dashboard Widgets',
                    description: 'Manage visibility of dashboard widgets and components.',
                    adminPortal: true,
                    commercialPortal: true,
                    retailPortal: false
                }
            ]
        },
        {
            id: 'banner-notifications',
            name: 'BANNER / NOTIFICATIONS',
            icon: 'fa-solid fa-bell',
            iconBg: '#f59e0b',
            expanded: false,
            items: [
                {
                    id: 'banner-notifications-item',
                    name: 'Banner/ Notifications',
                    description: 'Manage system-wide banners and notification settings.',
                    adminPortal: true,
                    commercialPortal: true,
                    retailPortal: true
                }
            ]
        }
    ];

    constructor() { }

    ngOnInit(): void { }

    toggleCategory(category: FeatureCategory): void {
        // Accordion behavior - close others when opening one
        this.featureCategories.forEach(cat => {
            if (cat.id !== category.id) {
                cat.expanded = false;
            }
        });
        category.expanded = !category.expanded;
    }

    onToggleChange(item: FeatureItem, portal: string): void {
        switch (portal) {
            case 'admin':
                item.adminPortal = !item.adminPortal;
                break;
            case 'commercial':
                item.commercialPortal = !item.commercialPortal;
                break;
            case 'retail':
                item.retailPortal = !item.retailPortal;
                break;
        }
        console.log(`${item.name} - ${portal}: toggled`);
    }
}
