import { Injectable, OnInit } from '@angular/core';
import { BaseDealerService } from '../../base/base-dealer.service';
import { BehaviorSubject } from 'rxjs';
import { DataService } from 'auro-ui';
import { ActivatedRoute } from '@angular/router';
import { StandardQuoteService } from '../../standard-quote/services/standard-quote.service';
import { ValidatorFn, AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class SoleTradeService extends BaseDealerService implements OnInit {
  public copyBorrowerAddress = new BehaviorSubject<any>(null);
  public copyBorrowerAddress$ = this.copyBorrowerAddress.asObservable();
  public reusePhysicalAsPrevious = new BehaviorSubject<any>(null);
  public totalPaymentAmount = new BehaviorSubject<any>(0);
  

  standardQuoteData:any[]=[]
  standardQuoteDataSubject = new BehaviorSubject<any>(this.standardQuoteData);
  
  reusePhysical = new BehaviorSubject<any>(null);
  reusePhysical$ = this.reusePhysical.asObservable();
  role: any;
  public patchDataOnPreview = new BehaviorSubject<any>(null);
    public appState = new BehaviorSubject<any>(null);
      override formStatusArr = [];
  iconfirmCheckbox = new BehaviorSubject<any>(null);
  showValidationMessage : boolean = false;
  EmploymentDetailChangedSlider : boolean = false;
  public previousAddressHiddenStatus$ = new BehaviorSubject<boolean>(null);
  previousAddressComponentStatus : boolean;
  addingExistingCustomer : boolean = false;
  isPreviousEmployeeVisible: boolean;

  
  componentValidity = {
    "Business Individual": [
      { SoleTradeBusinessCustomerRoleComponent: false },
      { SoleTradeBusinessDetailsComponent: true },
      { SoleTradePersonalDetailComponent: false },
      { SoleTradeBusinessContactDetailComponent: false },
      { SoleTradeEmailContactDetailComponent: false },
      { SoleTradeDriverLicenceDetailComponent: false },
      { SoleTradeCitizenshipDetailComponent: false },
    ],
    "Address Details": [
      { SoleTradePhysicalAddressComponent: false },
      { SoleTradePostalAddressComponent: false },
      { SoleTradePreviousAddressComponent: true },
      { SoleTradeRegisterAddressComponent: false },
    ],
    "Employment Details": [
      { SoleTradeCurrentEmploymentComponent: false },
      { SoleTradePreviousEmploymentComponent: true },
    ],
    "Financial Position": [
      { SoleTradeProfitDeclarationComponent: false },
      { SoleTradeTurnoverInfoComponent: false },
      { SoleTradeBalanceInfoComponent: false },
      { SoleTradeAssetsComponent: false },
      { SoleTradeLiabilitiesComponent: false },
    ],
    "Reference Details": [
      { individualCustomerType: true },
      { businessCustomerType: true },
    ]
  };

      constructor(
       public override data: DataService,
       public override route: ActivatedRoute,
      public standardQuoteSvc: StandardQuoteService
     ) {
       super(data, route);
     }
    pastDateValidator(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
        const value = control.value;
  
        if (value) {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          selectedDate.setHours(0, 0, 0, 0);
  
          if (selectedDate >= today) {
            return { pastDate: true };
          }
        }
  
        return null;
      };
    }
  
    resetData() {
      this.role = null;
      this.formStatusArr = null;
    }
sortOptionsWithSelectedOnTop(list: any[], selectedValue: string | null): any[] {
  if (!list || list.length === 0) return [];
  
  console.log('Sorting sole trade options with selected value:', selectedValue);
  
  
  const sortKey = list[0]?.label ? 'label' : (list[0]?.name ? 'name' : 'value');
  const compareKey = list[0]?.value !== undefined ? 'value' : (list[0]?.name ? 'name' : 'label');
  
  const sortedList = [...list].sort((a, b) => 
    a[sortKey].localeCompare(b[sortKey], undefined, { sensitivity: 'base' })
  );
  
  if (!selectedValue) return sortedList;
  
  const selectedIndex = sortedList.findIndex(item => item[compareKey] === selectedValue);
  
  if (selectedIndex >= 0) {
    const selectedItem = sortedList.splice(selectedIndex, 1)[0];
    sortedList.unshift(selectedItem);
  }
  
  return sortedList;
}

  updateComponentStatus(pageName: string, componentName: string, status: boolean) {
    const controls = this.componentValidity?.[pageName];
    if (!controls) return;

    for (const item of controls) {
      if (item.hasOwnProperty(componentName)) {
        item[componentName] = status;
        this.emitValidityUpdate();
        break; // stop after updating
      }
    }
  }

  private emitValidityUpdate(): void {
      // You can emit this to a service or store it as needed
      // this.baseSvc?.updateComponentValidity?.(this.componentValidity);
      
      // Check if all components are valid
      const allValid = this.isAllComponentsValid();
    }

  isAllComponentsValid(): boolean {
    for (const componentName in this.componentValidity) {
      const component = this.componentValidity[componentName];
      for (const control of component) {
        const key = Object.keys(control)[0];
        if (control[key] === "Invalid") {
          return false;
        }
      }
    }
    return true;
  }

    
}
