import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Offer options
  offerOptions = [
    { label: 'Offer - 001', value: 'offer001' },
    { label: 'Offer - 002', value: 'offer002' },
    { label: 'Offer - 003', value: 'offer003' },
  ];
  selectedOffer: string = 'offer001';

  // Primary checkbox
  isPrimary: boolean = true;

  // Message
  message: string = 'Message1';

  // Image upload
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  isDragOver: boolean = false;

  ngOnInit(): void {
    // Load saved data if any
    const savedImage = localStorage.getItem('notificationImage');
    if (savedImage) {
      this.previewUrl = savedImage;
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
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
    input.value = '';
  }

  handleFile(file: File): void {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPG, PNG, GIF, and BMP are allowed.');
      return;
    }

    const maxSize = 200 * 1024 * 1024; // 200MB
    if (file.size > maxSize) {
      alert('File size exceeds 200MB limit.');
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  clearImage(): void {
    this.previewUrl = null;
    this.selectedFile = null;
    localStorage.removeItem('notificationImage');
  }

  onApply(): void {
    if (this.previewUrl) {
      localStorage.setItem('notificationImage', this.previewUrl);
      alert('Notification image applied successfully!');
    } else {
      alert('Please select an image first.');
    }
  }
}
