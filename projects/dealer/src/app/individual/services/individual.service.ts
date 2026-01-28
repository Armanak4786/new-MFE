import { Injectable, OnInit } from "@angular/core";
import { BaseDealerService } from "../../base/base-dealer.service";
import { AbstractControl, ValidatorFn } from "@angular/forms";
import { StandardQuoteService } from "../../standard-quote/services/standard-quote.service";
import { DataService } from "auro-ui";
import { ActivatedRoute } from "@angular/router";
import { forkJoin, from, map, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class IndividualService extends BaseDealerService implements OnInit {
  public patchDataOnPreview = new BehaviorSubject<any>(null);
  public copyBorrowerAddress = new BehaviorSubject<any>(null);
  public copyBorrowerAddress$ = this.copyBorrowerAddress.asObservable();
  public reusePhysicalAsPrevious = new BehaviorSubject<any>(null);
  public previousAddressHiddenStatus$ = new BehaviorSubject<boolean>(null);

  showValidationMessage: boolean = false;
  EmploymentDetailChangedSlider: boolean = false;
  previousAddressComponentStatus: boolean;
  addingExistingCustomer: boolean = false;
  isPreviousEmployeeVisible: boolean;

  componentValidity = {
    "Personal Details": [
      { PersonalDetailsComponent: false },
      { PersonalDriverLicenceDetailComponent: false },
      { PersonalContactDetailComponent: false },
      { PersonalDetailEmailContactComponent: false },
      { PersonalCitizenshipDetailComponent: false },
    ],
    "Address Details": [
      { PhysicalAddressComponent: false },
      { PostalAddressComponent: false },
      { PreviousAddressComponent: true },
    ],
    "Employment Details": [
      { CurrentEmploymentComponent: false },
      { PreviousEmploymentComponent: true },
    ],
    "Financial Position": [
      { IndividualAssetDetailsComponent: false },
      { IncomeDetailsComponent: false },
      { IndividualLiabilitiesComponent: false },
      { IndividualExpenditureComponent: false },
      { RegularRecurringFrequencyComponent: false },
    ],
    "Reference Details": [
      { individualCustomerType: true },
      { businessCustomerType: true },
    ],
  };

  // Subject to emit validity updates
  // public validityUpdate = new BehaviorSubject<any>(null);
  // public validityUpdate$ = this.validityUpdate.asObservable();

  constructor(
    public override data: DataService,
    public override route: ActivatedRoute,
    public standardQuoteSvc: StandardQuoteService
  ) {
    super(data, route);
    this.formDataCacheableRoute([
      "LookUpServices/custom_lookups?LookupSetName=FloorType",
      "LookUpServices/custom_lookups?LookupSetName=UnitType",
      "LookUpServices/custom_lookups?LookupSetName=StreetType",
      "LookUpServices/locations?LocationType=country",
    ]);
  }

  iconfirmCheckbox = new BehaviorSubject<any>(null);
  reusePhysical = new BehaviorSubject<any>(null);
  reusePhysical$ = this.reusePhysical.asObservable();
  public appState = new BehaviorSubject<any>(null);
  override formStatusArr = [];
  role: any;

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

  updateComponentStatus(
    pageName: string,
    componentName: string,
    status: boolean
  ) {
    const controls = this.componentValidity?.[pageName];
    if (!controls) return;

    for (const item of controls) {
      if (item.hasOwnProperty(componentName)) {
        item[componentName] = status;
        // console.log(`Control ${componentName} in ${pageName} updated to: ${status}`);
        this.emitValidityUpdate();
        break; // stop after updating
      }
    }
  }

  private emitValidityUpdate(): void {
    // You can emit this to a service or store it as needed
    // this?.updateComponentValidity?.(this.componentValidity);

    // Check if all components are valid
    const allValid = this.isAllComponentsValid();
    // console.log('All components valid:', allValid);
    // console.log('Current validity state:', this.componentValidity);
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
  sortOptionsWithSelectedOnTop(
    list: any[],
    selectedValue: string | null
  ): any[] {
    if (!list || list.length === 0) return [];

    console.log("Sorting options with selected value:", selectedValue);

    // Determine which property to use for sorting (name, label, or value)
    const sortKey = list[0]?.label ? "label" : list[0]?.name ? "name" : "value";
    const compareKey =
      list[0]?.value !== undefined ? "value" : list[0]?.name ? "name" : "label";

    const sortedList = [...list].sort((a, b) =>
      a[sortKey].localeCompare(b[sortKey], undefined, { sensitivity: "base" })
    );

    if (!selectedValue) return sortedList;

    const selectedIndex = sortedList.findIndex(
      (item) => item[compareKey] === selectedValue
    );

    if (selectedIndex >= 0) {
      const selectedItem = sortedList.splice(selectedIndex, 1)[0];
      sortedList.unshift(selectedItem);
    }

    return sortedList;
  }

  updateDropdownData() {
    return forkJoin({
      floorType: from(
        this.getFormData(
          `LookUpServices/custom_lookups?LookupSetName=FloorType`
        )
      ).pipe(
        map((res: any) =>
          res?.data?.map((item: any) => ({
            label: item.lookupValue,
            value: item.lookupValue,
          }))
        )
      ),

      unitType: from(
        this.getFormData(`LookUpServices/custom_lookups?LookupSetName=UnitType`)
      ).pipe(
        map((res: any) =>
          res?.data?.map((item: any) => ({
            label: item.lookupValue,
            value: item.lookupValue,
          }))
        )
      ),

      streetType: from(
        this.getFormData(
          `LookUpServices/custom_lookups?LookupSetName=StreetType`
        )
      ).pipe(
        map((res: any) =>
          res?.data?.map((item: any) => ({
            label: item.lookupValue,
            value: item.lookupValue,
            lookupCode: item.lookupCode,
          }))
        )
      ),

      country: from
        (this.getFormData(`LookUpServices/locations?LocationType=country`)
      ).pipe(
        map((res: any) => {
      const list = res?.data || [];
      const index = list.findIndex(c => c.name === "New Zealand");
      if (index > -1) {
       list.unshift(list.splice(index, 1)[0]); // move NZ to top
      }
    return list.map((item: any) => ({
            label: item.name,
            value: item.name,
        }));
        })
      ),
      city: from(
        this.getFormData(`LookUpServices/locations?LocationType=City`)
      ).pipe(
        map((res: any) =>
          res?.data?.map((item: any) => ({
            label: item.name,
            value: item.name,
          }))
        )
      ),
    });
  }
}
