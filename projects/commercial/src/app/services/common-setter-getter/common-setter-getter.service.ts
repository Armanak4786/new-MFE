import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ContactItem, CustomerDetails } from '../../utils/common-interface';

@Injectable({
  providedIn: 'root',
})
export class CommonSetterGetterService {
  private loanData;
  private paymentIdSubject = new BehaviorSubject<number>(null);
  public paymentId = this.paymentIdSubject.asObservable();
  private transactionIdSubject = new BehaviorSubject<number>(null);

  // Workaround for Loan in the Request settlement quote
  private contractIdForSettlementQuote = new BehaviorSubject<number>(null);
  contractIdForSettlementQuote$ =
    this.contractIdForSettlementQuote.asObservable();

  private facilityListSubject = new BehaviorSubject<[]>([]);
  private partyDataList = new BehaviorSubject<[]>([]);
  partyList$ = this.partyDataList.asObservable();
  public currentParty = new BehaviorSubject<any>(null);
  public disableParty = new BehaviorSubject<boolean>(true);
  disablePartyDropdown$ = this.disableParty.asObservable();
  party$ = this.currentParty.asObservable();
  facilityList$ = this.facilityListSubject.asObservable();
  public navigateToLoan: boolean = false;
  public navigateToLease: boolean = false;
  private customerNumberSubject = new BehaviorSubject<string>('');
  private userDetailsSubject = new BehaviorSubject<any>(null); // or use a specific interface
  userDetails$ = this.userDetailsSubject.asObservable();
  private originalRequestHistory = new BehaviorSubject<any>(null); // or use a specific interface
  originalRequestHistoryData = this.originalRequestHistory.asObservable();
  private transferRequestContractId = new BehaviorSubject<any>(null); // or use a specific interface
  transferRequestContractIdData = this.transferRequestContractId.asObservable();
  private roleBasedActions = new BehaviorSubject<any>(null); // or use a specific interface
  roleBasedActionsData = this.roleBasedActions.asObservable();

  // Workaround for Facilitytype and subfacility in the Request settlement quote

  private facilityMapSubject = new BehaviorSubject<any>({
    FacilityType: '',
    SubfacilityType: '',
  });
  facilityMap$ = this.facilityMapSubject.asObservable();

  public allProducts = new BehaviorSubject<[]>([]);
  allProductsList = this.allProducts.asObservable();

  private currentComponentSubject = new BehaviorSubject<string>('');
  currentComponent$ = this.currentComponentSubject.asObservable();

  private customerDetailsSubject = new BehaviorSubject<CustomerDetails>({});
  customerDetails$ = this.customerDetailsSubject.asObservable();

  private contactDataSubject = new BehaviorSubject<ContactItem[]>([]);
  contactData$ = this.contactDataSubject.asObservable();

  setContactItems(items: ContactItem[]) {
    this.contactDataSubject.next(items);
  }

  private addressSubject = new BehaviorSubject<{
    physicalAddress: string | null;
    postalAddress: string | null;
    registeredAddress: string | null;
    isIndividualParty: boolean;
  }>({
    physicalAddress: null,
    postalAddress: null,
    registeredAddress: null,
    isIndividualParty: false,
  });

  address$ = this.addressSubject.asObservable();

  public transformFinancialSummary = new BehaviorSubject<any>({
    assetLinkDetails: [],
    easyLinkDetails: [],
    creditlineDetails: [],
    bailmentDetails: [],
    buybackDetails: [],
    fixedFloorplanDetails: [],
    floatingFloorplanDetails: [],
    introducerTransactionDetails: [],
    nonFacilityLoansDetails: [],
    operatingLeaseDetails: [],
  });
  financial = this.transformFinancialSummary.asObservable();
  constructor() {}

  setLoanData(data: any) {
    this.loanData = data;
  }

  setPaymentIdData(id) {
    this.paymentIdSubject.next(id);
  }

  setTransactionIdData(data: any) {
    this.transactionIdSubject.next(data);
  }

  getLoanData() {
    return this.loanData;
  }

  getPaymentIdData() {
    return this.paymentIdSubject.asObservable();
  }

  getTransactionIdData() {
    return this.transactionIdSubject.asObservable();
  }

  setAllFacilities(data: any) {
    this.facilityListSubject.next(data);
  }

  getAllFacilities() {
    return this.facilityListSubject.asObservable();
  }

  setPartyData(data: any) {
    this.partyDataList.next(data);
  }

  setDisableParty(data: any) {
    this.disableParty.next(data);
  }

  setCurrentPartyData(data: any) {
    this.currentParty.next(data);
  }

  setCustomerNumber(value: string) {
    this.customerNumberSubject.next(value);
  }

  getCustomerNumber() {
    return this.customerNumberSubject.asObservable();
  }

  setUserDetails(details: any) {
    this.userDetailsSubject.next(details);
  }

  updateSection(section: string, data: any[]) {
    const current = this.transformFinancialSummary.getValue();
    const updated = { ...current, [section]: data };
    this.transformFinancialSummary.next(updated);
  }
  setFacilityMap(facilityType: string, subFacilityType: string) {
    this.facilityMapSubject.next({
      FacilityType: facilityType,
      SubfacilityType: subFacilityType,
    });
  }

  getFacilityMap(): Observable<{ [key: string]: string }> {
    return this.facilityMap$;
  }

  // Setter method
  setContractIdForSettlementQuote(id: number): void {
    this.contractIdForSettlementQuote.next(id);
  }

  // Getter method
  getContractIdForSettlementQuote(): Observable<number> {
    return this.contractIdForSettlementQuote$;
  }

  setAllProductsData(data: any) {
    this.allProducts.next(data);
  }

  setRequestHistory(data: any) {
    this.originalRequestHistory.next(data);
  }

  setTransferRequestContract(data: any) {
    this.transferRequestContractId.next(data);
  }

  clearFacilityMap(): void {
    this.facilityMapSubject.next({
      FacilityType: '',
      SubfacilityType: '',
    });
  }
  clearContractIdForSettlementQuote(): void {
    this.contractIdForSettlementQuote.next(null);
  }

  setCurrentComponent(componentName: string): void {
    this.currentComponentSubject.next(componentName);
  }
  getCurrentComponent(): Observable<string> {
    return this.currentComponent$;
  }

  setCustomerDetails(details: CustomerDetails): void {
    this.customerDetailsSubject.next(details);
  }

  // Get customer details as observable
  getCustomerDetails(): Observable<CustomerDetails> {
    return this.customerDetails$;
  }

  setRoleBasedAction(list) {
    this.roleBasedActions.next(list);
  }

  setFormattedAddresses(addressData: any) {
    this.addressSubject.next(addressData);
  }
  setIndividualPartyFlag(isIndividual: boolean) {
    const currentValue = this.addressSubject.value;
    this.addressSubject.next({
      ...currentValue,
      isIndividualParty: isIndividual,
    });
  }
  // workaround for extended top bar ---> Party details
  private collapsedState = new BehaviorSubject<boolean>(true);

  isCollapsed$: Observable<boolean> = this.collapsedState.asObservable();

  toggleCollapse() {
    this.collapsedState.next(!this.collapsedState.value);
  }

  setCollapsed(state: boolean) {
    this.collapsedState.next(state);
  }

  // workaround for Notification

  public transferRequestsSubject = new BehaviorSubject<{
    pending?: any[];
    declined?: any[];
    completed?: any[];
    countOfNotifi?: number;
    isClearAll?: boolean;
  }>({
    pending: [],
    declined: [],
    completed: [],
    countOfNotifi: 0,
    isClearAll: false,
  });
  transferRequests = this.transferRequestsSubject.asObservable();

  private dashboardRefreshSubject = new Subject<void>();
  dashboardRefresh$ = this.dashboardRefreshSubject.asObservable();

  triggerDashboardRefresh() {
    this.dashboardRefreshSubject.next();
  }
}
