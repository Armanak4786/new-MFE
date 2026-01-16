import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { GenericFormConfig } from 'auro-ui';

@Component({
  selector: 'app-disbursement-details',
  templateUrl: './disbursement-details.component.html',
  styleUrls: ['./disbursement-details.component.scss']
})
export class DisbursementDetailsComponent {
  constructor(){
   
  }
  formConfig: GenericFormConfig = {
    autoResponsive: true,
    api: ``,
    goBackRoute: '',
    cardType: 'non-border',
    fields: [
      // {
      //   type: 'radio',
      //   label: 'Disburse Funds to',
      //   name: 'disburseFunds',
      //   // validators: [Validators.required],
      //   cols: 12,
      //   options: [
      //     { label: 'Yes', value: 'yes' },
      //     { label: 'No', value: 'no' },
      //   ],
      //   alignmentType: 'horizontal',
      //   labelClass: 'col-5',
      //   inputClass: 'col-3',
      //   nextLine: false,
      // },
      {
        type: 'button',
        submitType: 'internal',
        name: 'assetbtn',
      
        // btnType: 'addBtn',
        // icon: ' pi pi-angle-right text-lg',
        cols: 2,
      },
      {
        type: 'label-only',
        typeOfLabel: 'inline',
        label: 'Disburse Funds to',
        name: 'disburseFundsTo',
        className: 'removePadding text-xs mb-0 pb-0 font-bold mt-1',
        cols: 12,
        hidden: false,
      },
      {
        type: 'radio',
        label: '',
        name: 'disburseFunds',
        // validators: [Validators.required],
        cols:12,
        options: [
          { label: 'supplier', value: 'yes' },
          { label: 'nominatedBankAccount', value: 'no' },
          { label: 'Both', value: 'no' },
        ],
        alignmentType: 'horizontal',

        inputClass: 'col-12',
        nextLine: false,
      },
     
      {
        type: 'label-only',
        typeOfLabel: 'inline',
        label: 'supplier Name',
        name: 'supplierName',
        className: 'removePadding text-xs mb-0 pb-0',
        cols: 6,
        hidden: false,
      },
      {
        type: 'label-only',
        typeOfLabel: 'inline',
        label: 'Amount',
        name: 'amount',
        className: 'removePadding text-xs mb-0 pb-0',
        cols: 6,
        hidden: false,
      },
      {
        type: 'text',
        name: 'supplier',
        cols: 6,
        nextLine: false,
      },
      {
        type: 'text',
        name: 'amt',
        // className: 'mt-0 pt-0',
        cols: 6,
      },
    ],
  };

  onButtonClick($event){

  }

  onFormEvent(event){}
  onValueChanges(event){}
  onFormReady(){}
}
