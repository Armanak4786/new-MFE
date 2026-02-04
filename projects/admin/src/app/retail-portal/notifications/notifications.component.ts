import { Component, OnInit } from '@angular/core';

interface Offer {
    id: string;
    name: string;
}

@Component({
    selector: 'app-retail-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class RetailNotificationsComponent implements OnInit {

    offers: Offer[] = [
        { id: '001', name: 'Offer - 001' },
        { id: '002', name: 'Offer - 002' },
        { id: '003', name: 'Offer - 003' },
        { id: '004', name: 'Offer - 004' },
        { id: '005', name: 'Offer - 005' }
    ];

    selectedOfferId: string = '003';
    isPrimary: boolean = true;
    message: string = '';
    bannerImage: string | null = null;
    bannerFileName: string = '';
    isDragOver: boolean = false;

    constructor() { }

    ngOnInit(): void { }

    onFileSelect(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver = true;
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver = false;
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver = false;

        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            this.processFile(files[0]);
        }
    }

    processFile(file: File): void {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/gif', 'image/bmp', 'image/png', 'application/pdf'];
        const maxSize = 200 * 1024 * 1024; // 200MB

        if (!validTypes.includes(file.type)) {
            alert('Invalid file format. Supported formats: .jpg, .gif, .bmp, .png, .pdf');
            return;
        }

        if (file.size > maxSize) {
            alert('File size exceeds 200MB limit.');
            return;
        }

        this.bannerFileName = file.name;

        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.bannerImage = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    uploadBanner(): void {
        if (!this.bannerImage) {
            alert('Please select an image first');
            return;
        }
        console.log('Uploading banner for Retail:', {
            offerId: this.selectedOfferId,
            isPrimary: this.isPrimary,
            message: this.message,
            fileName: this.bannerFileName
        });
    }

    applyBanner(): void {
        if (!this.bannerImage) {
            alert('Please upload an image first');
            return;
        }
        console.log('Applying banner for Retail:', {
            offerId: this.selectedOfferId,
            isPrimary: this.isPrimary,
            message: this.message,
            bannerImage: this.bannerImage
        });
    }
}
