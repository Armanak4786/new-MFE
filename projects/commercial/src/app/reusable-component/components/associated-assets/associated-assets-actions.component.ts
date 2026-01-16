import { Component } from '@angular/core';

@Component({
  selector: 'app-associated-assets-action',
  template: `
    <div class="flex-column cursor-pointer ">
      <div
        class="py-1 flex justify-content-center action-item p-2 "
        (click)="navigateToReleaseSecurity($event)"
      >
        Release Security
      </div>
      
    </div>
  `,
  styles: [
    `
      .action-item {
        transition: background-color 0.3s, color 0.3s;
        
      }

      .action-item:hover {
        background-color: var(--primary-color); /* Change to your desired background color */
        color: white; /* Change to your desired text color */
      }
    `,
  ],
})
export class AssociatedAssetsActionsComponent {
	navigateToReleaseSecurity( event:any) {
  }

}
