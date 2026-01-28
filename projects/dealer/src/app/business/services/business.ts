import { Injectable, OnInit } from "@angular/core";
import { BaseDealerService } from "../../base/base-dealer.service";
import { DataService } from "auro-ui";
import { ActivatedRoute } from "@angular/router";
import { StandardQuoteService } from "../../standard-quote/services/standard-quote.service";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BusinessService extends BaseDealerService implements OnInit {
  private turnoverLatestDateSource = new Subject<Date>();
  turnoverLatestDate$ = this.turnoverLatestDateSource.asObservable();
  public patchDataOnPreview = new BehaviorSubject<any>(null);
  reusePhysical = new BehaviorSubject<any>(null);
  reusePhysical$ = this.reusePhysical.asObservable();
  reuseRegister = new BehaviorSubject<any>(null);
  reuseRegister$ = this.reuseRegister.asObservable();
  iconfirmCheckbox = new BehaviorSubject<any>(null);
  showValidationMessage: boolean = false;
  previousAddressComponentStatus: boolean;
  public previousAddressHiddenStatus$ = new BehaviorSubject<boolean>(null);
  addingExistingCustomer: boolean = false;

  componentValidity = {
    "Business Details": [
      { BusinessDetailsComponent: false },
      { BusinessContactDeatilComponent: false },
      { BusinessEmailContactDetailsComponent: false },
      { BusinessWebsiteContactDetailsComponent: false },
    ],
    "Address Details": [
      { BusinessPhysicalAddressComponent: false },
      { BusinessPostalAddressComponent: false },
      { BusinessPreviousAddressComponent: true },
      { BusinessRegisterAddressComponent: false },
    ],
    "Financial Accounts": [
      { ProfitDeclarationComponent: false },
      { TurnoverInformationComponent: false },
      { BalanceInfomartionComponent: false },
    ],
    "Contact Details": [
      { individualCustomerType: true },
      { businessCustomerType: true },
    ],
  };

  constructor(
    public override data: DataService,
    public override route: ActivatedRoute,
    public standardQuoteSvc: StandardQuoteService
  ) {
    super(data, route);
  }
  role: any;
  override formStatusArr = [];

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
 setTurnoverLatestDate(date: Date) {
    this.turnoverLatestDateSource.next(date);
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

  public sortNatureOfBusinessOptionsWithSelectedOnTop(
    list: any[],
    selectedValue: string | null
  ): any[] {
    if (!list || list.length === 0) return [];

    const isEq = (a: any, b: any) =>
      String(a).toLowerCase() === String(b).toLowerCase();

    const extractDescriptionText = (label: string): string => {
      const match = String(label).match(/^\d+\s+(.+)$/);
      return match ? match[1].trim() : String(label);
    };

    const alphaByDesc = (a: any, b: any) =>
      extractDescriptionText(a.label).localeCompare(
        extractDescriptionText(b.label),
        undefined,
        { sensitivity: "base" }
      );

    // start from a consistently sorted copy
    const sorted = [...list].sort(alphaByDesc);

    if (selectedValue == null || selectedValue === "") return sorted;

    const idx = sorted.findIndex((opt) => isEq(opt.value, selectedValue));
    if (idx >= 0) {
      const [sel] = sorted.splice(idx, 1);
      sorted.unshift(sel);
    }
    return sorted;
  }

  sortOptionsWithSelectedOnTop(
    list: any[],
    selectedValue: string | null
  ): any[] {
    if (!list || list.length === 0) return [];

    console.log("Sorting business options with selected value:", selectedValue);

    // Determine which property to use for sorting
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
}
