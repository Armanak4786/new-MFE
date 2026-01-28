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
  // Flags to track invalid inputs
  hasInvalidAssetInput: boolean = false;
  hasInvalidIncomeInput: boolean = false;
  hasInvalidLiabilitiesInput: boolean = false;
  hasInvalidExpenditureInput: boolean = false;
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
      
      // Use pre-calculated totalIncome from income-details component (already handles negative values)
      // If totalIncome is not set yet, calculate it but check for negative values
      this.incomeValue = this.formData?.totalIncome !== undefined 
        ? this.formData.totalIncome 
        : this.calculateIncomeMonthly();
      
      // Use pre-calculated totalAsset from asset-details component (already handles negative values)
      this.assetValue = this.formData?.totalAsset || 0;
      
      // Use Balance/Limit total for Liabilities graph (from liabilities component)
      this.totalLiabilites = this.formData?.totalLiabilitiesBalanceLimit || 0;
      
      // Expenditure (Monthly) Graph - ONLY expenditure + recurring (NO liabilities)
      this.expenditureMonthly = this.calculateExpenditureMonthly();
      
      // Track invalid input flags
      this.hasInvalidAssetInput = this.formData?.hasInvalidAssetInput || false;
      this.hasInvalidIncomeInput = this.formData?.hasInvalidIncomeInput || false;
      this.hasInvalidLiabilitiesInput = this.formData?.hasInvalidBalanceLimitInput || false;
      this.hasInvalidExpenditureInput = this.formData?.hasInvalidExpenditureInput || 
                                        this.formData?.hasInvalidRecurringInput || false;
      
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
  // Get income details from formData
  if (this.formData?.incomeDetails && Array.isArray(this.formData.incomeDetails)) {
    // Helper function to check if amount is invalid (>18,2 format OR negative)
    const isInvalidAmount = (amount: any): boolean => {
      if (amount === null || amount === undefined) return false;
      const amountStr = amount.toString();
      const [integerPart, decimalPart] = amountStr.split('.');
      
      // Check if negative
      if (amount < 0) return true;
      
      // Check if integer part exceeds 18 digits
      if (integerPart && integerPart.length > 18) return true;
      
      // Check if decimal part exceeds 2 digits
      if (decimalPart && decimalPart.length > 2) return true;
      
      // Check if total value exceeds the maximum (18,2 format)
      if (parseFloat(amountStr) > 999999999999999999.99) return true;
      
      return false;
    };
    
    // Filter out null/undefined amounts and get valid amounts
    const validIncomes = this.formData.incomeDetails.filter((income: any) => {
      return income.amount !== null && income.amount !== undefined;
    });
    
    if (validIncomes.length === 0) {
      return 0;
    }
    
    // Check if any amount is invalid
    const hasInvalidAmount = validIncomes.some((income: any) => isInvalidAmount(income.amount));
    
    // Filter out invalid amounts for calculation
    const validAmountsForCalculation = validIncomes.filter((income: any) => !isInvalidAmount(income.amount));
    
    if (hasInvalidAmount) {
      // Check if ALL amounts are invalid - if so, return 0
      const allInvalid = validIncomes.every((income: any) => isInvalidAmount(income.amount));
      
      if (allInvalid) {
        return 0; // All values are invalid - reset graph to 0
      }
      
      // Some values are invalid - calculate using only valid positive values
      let monthlyTotal = 0;
      validAmountsForCalculation.forEach((income: any) => {
        const amount = income.amount || 0;
        // Only include positive values in the calculation
        if (amount > 0) {
          const frequency = income.frequency;
          monthlyTotal += this.convertToMonthly(amount, frequency);
        }
      });
      
      return monthlyTotal;
    }
    
    // No invalid amounts - check if ALL amounts are negative
    const allNegative = validIncomes.every((income: any) => {
      return income.amount < 0;
    });
    
    if (allNegative) {
      return 0; // Reset graph to 0 when ALL values are negative
    }
    
    // Calculate total using only positive values (exclude negative values)
    let monthlyTotal = 0;
    validIncomes.forEach((income: any) => {
      const amount = income.amount || 0;
      // Only include positive values in the calculation
      if (amount > 0) {
        const frequency = income.frequency;
        monthlyTotal += this.convertToMonthly(amount, frequency);
      }
    });
    
    return monthlyTotal;
  }
  
  return 0;
}

/**
 * Calculate Expenditure (Monthly) correctly
 * Must include: Expenditure Amount + Regular Recurring Essential Outgoings Amount + Liabilities Amount
 * ALL amounts must be converted to monthly values using their frequency
 * Child components already handle filtering negative values (only gray out if ALL are negative)
 * So we can use the pre-calculated totals from child components
 */
calculateExpenditureMonthly(): number {
  // Use pre-calculated totals from child components
  // These components already handle the logic: only gray out if ALL values are negative,
  // otherwise exclude negative values and use only positive values
  
  // 1. Expenditure Section - Get monthly-converted total from child component
  const expenditureMonthly = this.formData?.expenditureTotal || 0;
  
  // 2. Regular Recurring Essential Outgoings - Get monthly-converted total from child component
  const recurringMonthly = this.formData?.totalRegularOutgoings || 0;
  
  // 3. Liabilities Amount (monthly-converted) - Get from liabilities component
  const liabilitiesMonthly = this.formData?.totalLiabilitiesMonthly || 0;
  
  // Sum all three components
  const monthlyTotal = expenditureMonthly + recurringMonthly + liabilitiesMonthly;
  
  return monthlyTotal;
}

// Extract reusable frequency converter
private convertToMonthly(amount: number, frequency: number): number {
  if (!amount || amount === 0) return 0;
  
  switch (frequency) {
    case 3533: return amount * 4.3333;  // Weekly
    case 3534: return amount * 2.1667;  // Fortnightly  
    case 3535: return amount;         // Monthly
    case 4017: return amount / 3;     // Quarterly
    default: return amount;
  }
}
calculateDynamicMax(): void {
  // Collect all financial values, filter out invalid ones and negative values
  const values = [
    this.assetValue || 0,
    this.totalLiabilites || 0,
    this.incomeValue || 0,
    this.expenditureMonthly || 0  
  ].filter(val => val !== Infinity && !isNaN(val) && isFinite(val) && val >= 0);
  
  // If no valid values, use default
  if (values.length === 0) {
    this.dynamicMaxValue = 10000;
    return;
  }
  
  // Find the maximum value from all financial metrics
  const maxValue = Math.max(...values);
  
  // Round up to nearest 5K as per document requirement
  let roundedMax = Math.ceil(maxValue / 5000) * 5000;
  
  
  // This prevents bars from touching the edge
  if (roundedMax <= maxValue) {
    roundedMax += 5000; // Add one more 5K increment
  }
  
  // Add additional 10% buffer for visual spacing
  this.dynamicMaxValue = Math.ceil((roundedMax * 1.1) / 5000) * 5000;
  
  // Ensure minimum scale of 10000 for better visualization
  if (this.dynamicMaxValue < 10000) {
    this.dynamicMaxValue = 10000;
  }
}

//  method to get display value
getDisplayValue(value: number): number {
  if (value === null || value === undefined || isNaN(value) || value < 0) {
    return 0;
  }
  return value;
}


  //  Get safe percentage for progress bar
  getProgressPercentage(value: number): number {
    // Handle invalid values
    if (value === null || value === undefined || isNaN(value)) {
      return 0;
    }
    
    // Handle negative values - return 0 to show grey/empty bar
    if (value < 0) {
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
