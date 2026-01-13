import { Component } from '@angular/core';
import { CommonService, ToasterService } from 'auro-ui';
import { QuickQuoteService } from '../../services/quick-quote.service';
import { jsPDF } from 'jspdf';
import { map, Subscription } from 'rxjs';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-udc-email',
  templateUrl: './udc-email.component.html',
  styleUrl: './udc-email.component.scss',
})
export class UdcEmailComponent {
  value: any;
  constructor(
    private svc: CommonService,
    private pdfService: QuickQuoteService,
    public toasterService: ToasterService,
    public config: DynamicDialogConfig
  ) {}
  fullName: any;
  files: any = [];
  email: string = '';
  emailValid: boolean = true;
  emailTouched: boolean = false;
  capturedImage: string | null = null;
  private capturedImageSubscription: Subscription;

  ngOnInit() {
    this.capturedImageSubscription = this.pdfService.capturedImage$.subscribe(
      (image) => {
        this.capturedImage = image;
        this.value = this.config.data.theData;

        if (this.value == 1) {
          this.files.push(this.config.data.pdfFile);
        } else {
          if (this.capturedImage) {
            this.files = [];
            const doc = new jsPDF();

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            const img = new Image();
            img.src = this.capturedImage;
            img.onload = () => {
              const imgWidth = img.width;
              const imgHeight = img.height;

              const aspectRatio = imgWidth / imgHeight;
              let newWidth = pageWidth;
              let newHeight = pageHeight;

              if (aspectRatio > 1) {
                newHeight = pageWidth / aspectRatio;
              } else {
                newWidth = pageHeight * aspectRatio;
              }

              doc.addImage(
                this.capturedImage,
                'PNG',
                0,
                0,
                newWidth,
                newHeight
              );

              const pdfBlob = doc.output('blob');
              const pdfFile = new File([pdfBlob], 'Quick quote.Pdf', {
                type: 'application/pdf',
              });

              this.files.push({
                file: pdfFile,
                fileDownloadName: 'Quick quote.Pdf',
              });
            };
          }
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.capturedImageSubscription) {
      this.capturedImageSubscription.unsubscribe();
    }
  }

  validateEmail() {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailValid = pattern.test(this.email);
  }

  onBlur() {
    this.emailTouched = true;
    this.validateEmail();
  }

  // onFileSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     this.files.push(input.files[0]);
  //     this.files.forEach((x) => {
  //       if (x.type === 'application/pdf') {
  //       } else {
  //         alert('Please select a valid PDF file.');
  //       }
  //     });
  //     // if (this.files.type === 'application/pdf') {
  //     // } else {
  //     //   alert('Please select a valid PDF file.');
  //     // }
  //   }
  // }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const selectedFile = input.files[0];
      // Check if the selected file is a PDF
      if (selectedFile.type === 'application/pdf') {
        this.files.push({
          file: selectedFile,
          fileDownloadName: 'Quick quote.Pdf',
        });
      } else {
        alert('Please select a valid PDF file.');
      }
    }
  }
  closeDialog(btnType: 'submit' | 'cancel') {
    this.svc.dialogSvc.ref.close({
      // data: this.dynamicDialogConfig?.data,
      btnType: btnType,
    });
  }

  onUploadedPdfDelete(i: any) {
    this.files.splice(i, 1);
  }
  async onEmailSubmit() {
    if (this.emailValid && this.fullNameValid) {
      let IncludeAttachments = this.files.length > 0 ? 'true' : 'false';
      const request = new FormData();
      request.append('CustomerName', this.fullName);
      request.append('To', this.email);
      request.append('IsHtml', 'true');
      request.append('IncludeAttachments', IncludeAttachments);
      // request.append('Attachments',this.files);

      // this.files.forEach((fileObj: any, index: number) => {
      //   if (fileObj.file) {
      //     request.append(`Attachments[${index}]`, fileObj.file, fileObj.fileDownloadName || fileObj.file.name);
      //   }
      // });

      if (this.files.length > 0) {
        const combinedBlob = new Blob(
          this.files.map((fileObj: any) => fileObj.file),
          { type: 'application/pdf' }
        );
        request.append('Attachments', combinedBlob, 'Quick quote.pdf');
      }

      let response = await this.svc.data
        .post(`QuickQuote/SendEmail`, request)
        .pipe(
          map((res) => {
            if (res) {
              this.toasterService.showToaster({
                severity: 'success',
                detail: 'Email request submitted',
              });
              this.closeDialog('submit');
            }
            return res;
          })
        )
        .toPromise();
    } else {
      this.emailTouched = true;
      this.emailTouched = true;
      this.onFullNameBlur();
    }
  }
  fullNameTouched: boolean = false;
  fullNameValid: boolean = false;

  onFullNameBlur() {
    this.fullNameTouched = true;
    this.validateFullName();
  }
  validateFullName() {
    if (this.fullName !== null && this.fullName?.length >= 3) {
      this.fullNameValid = true;
    } else {
      this.fullNameValid = false;
    }
  }
}
