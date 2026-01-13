import { Component, Input, ViewEncapsulation } from '@angular/core';
import { BaseIndividualClass } from '../../base-individual.class';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'auro-ui';
import { IndividualService } from '../../services/individual.service';
import { FormBuilder } from '@angular/forms';
import { takeUntil } from 'rxjs';
@Component({
  selector: 'app-financial-position',
  templateUrl: './financial-position.component.html',
  styleUrls: ['./financial-position.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FinancialPositionComponent extends BaseIndividualClass {
  formData: any;
  incomeValue: any;
  assetValue: any;
  totalLiabilites: any; 
  expenditureTotal: any;
  IsSharedFinancialPosition: boolean = true;
  showSSOP: boolean = true;
  // Dynamic maximum value for progress bars
  dynamicMaxValue: number = 10000; // Default fallback
  expenditureMonthly: any;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: IndividualService,
    private fb: FormBuilder
  ) {
    super(route, svc, baseSvc);
  }
override async ngOnInit(): Promise<void> {
  await super.ngOnInit();
  this.baseSvc
    .getBaseDealerFormData()
    .pipe(takeUntil(this.destroy$))
    .subscribe((res) => {
      this.formData = res;
      this.incomeValue = this.calculateIncomeMonthly();
      this.assetValue = this.formData?.totalAsset;
      // Use Balance/Limit total for Liabilities graph (from liabilities component)
      this.totalLiabilites = this.formData?.totalLiabilitiesBalanceLimit || 0;
      
      // Expenditure (Monthly) Graph - ONLY expenditure + recurring (NO liabilities)
      this.expenditureMonthly = this.calculateExpenditureMonthly();
      
      // This condition is for keeping default value as true for IsSharedFinancialPosition instead of undefined
      if (this.formData?.IsSharedFinancialPosition != undefined) {
        this.IsSharedFinancialPosition = this.formData?.IsSharedFinancialPosition;
      }
      
      // Calculate dynamic max whenever values change
      this.calculateDynamicMax();
    });
    
  this.onSharedToggle();
  let sessionStorageCustomerSummary = JSON.parse(sessionStorage?.getItem("updatedCustomerSummary"));
  if (sessionStorageCustomerSummary) {
    const updateSSOPVisibility = sessionStorageCustomerSummary?.find(
      c => c.customerRole == 1 && c.customerType == "Business"
    );
    if (updateSSOPVisibility?.isPartnership) {
      this.showSSOP = false;
      this.IsSharedFinancialPosition = false;
      this.baseSvc.setBaseDealerFormData({
        IsSharedFinancialPosition: this.IsSharedFinancialPosition
      });
    } else {
      this.showSSOP = true;
    }
  }
}
calculateIncomeMonthly(): number {
  let monthlyTotal = 0;
  
  // Get income details from formData
  if (this.formData?.incomeDetails && Array.isArray(this.formData.incomeDetails)) {
    this.formData.incomeDetails.forEach((income: any) => {
      const amount = income.amount || 0;
      const frequency = income.frequency;
      monthlyTotal += this.convertToMonthly(amount, frequency);
    });
  }
  
  return monthlyTotal;
}

/**
 * Calculate Expenditure (Monthly) correctly
 * Must include: Expenditure Amount + Regular Recurring Essential Outgoings Amount
 * ALL amounts must be converted to monthly values using their frequency
 */
calculateExpenditureMonthly(): number {
  let monthlyTotal = 0;
  
  // 1. Expenditure Section - Get monthly-converted total from child component
  const expenditureMonthly = this.formData?.expenditureTotal || 0;
  monthlyTotal += expenditureMonthly;
  
  // 2. Regular Recurring Essential Outgoings - Get monthly-converted total from child component
  const recurringMonthly = this.formData?.totalRegularOutgoings || 0;
  monthlyTotal += recurringMonthly;
  
  // 3. Liabilities Amount (monthly-converted) - Get from liabilities component
  const liabilitiesMonthly = this.formData?.totalLiabilitiesMonthly || 0;
  monthlyTotal += liabilitiesMonthly;
  
  return monthlyTotal;
}

// Extract reusable frequency converter
private convertToMonthly(amount: number, frequency: number): number {
  if (!amount || amount === 0) return 0;
  
  switch (frequency) {
    case 3533: return amount * 4.33;  // Weekly
    case 3534: return amount * 2.17;  // Fortnightly  
    case 3535: return amount;         // Monthly
    case 4017: return amount / 3;     // Quarterly
    default: return amount;
  }
}
calculateDynamicMax(): void {
  // Collect all financial values, filter out invalid ones
  const values = [
    this.assetValue || 0,
    this.totalLiabilites || 0,
    this.incomeValue || 0,
    this.expenditureMonthly || 0  
  ].filter(val => val !== Infinity && !isNaN(val) && isFinite(val));
  
  // If no valid values, use default
  if (values.length === 0) {
    this.dynamicMaxValue = 10000;
    return;
  }
  
  // Find the maximum value from all financial metrics
  const maxValue = Math.max(...values);
  
  // Round up to nearest 5K as per document requirement
  // "Round up to a 'clean' readable number closest 5K range"
  this.dynamicMaxValue = Math.ceil(maxValue / 5000) * 5000;
  
  // Ensure minimum scale of 10000 for better visualization
  if (this.dynamicMaxValue < 10000) {
    this.dynamicMaxValue = 10000;
  }
}


  //  Get safe percentage for progress bar
  getProgressPercentage(value: number): number {
    // Handle invalid values
    if (value === null || value === undefined || isNaN(value)) {
      return 0;
    }
    
    // Handle Infinity
    if (value === Infinity || !isFinite(value)) {
      return 100; // Show full bar for invalid values
    }
    
    // Handle zero or invalid max
    if (this.dynamicMaxValue === 0 || !isFinite(this.dynamicMaxValue)) {
      return 0;
    }
    
    // Calculate percentage and cap at 100
    const percentage = (value / this.dynamicMaxValue) * 100;
    return Math.min(percentage, 100);
  }

  onSharedToggle() {
    // You can add any additional logic here when the switch is toggled

    this.baseSvc.setBaseDealerFormData({
      IsSharedFinancialPosition : this.IsSharedFinancialPosition
    })
  }

  shouldShowFinancialPosition(): boolean {
    // Show financial position if:
    // 1. Role is not 2 i.e Co-Borrower, OR
    // 2. Role is 2 and income is NOT shared
    if(this.showSSOP){
      return this.formData?.role !== 2 || this.IsSharedFinancialPosition == false;
    }
    else{
      return true
    }
  }
  calculateProgressforasset(): any {}
}
