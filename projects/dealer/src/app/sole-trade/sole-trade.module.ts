import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuroUiFrameWork } from 'auro-ui';

import { SoleTradeComponent } from './sole-trade.component';
import { SoleTradeRoutingModule } from './sole-trade-routing.module';
import { SoleTradeRegisterAddressComponent } from './components/sole-trade-address-details/sole-trade-registered-address/sole-trade-registered-address.component';
import { SoleTradeAddressDetailsComponent } from './components/sole-trade-address-details/sole-trade-address-details.component';
import { SoleTradePhysicalAddressComponent } from './components/sole-trade-address-details/sole-trade-physical-address/sole-trade-physical-address.component';
import { SoleTradePostalAddressComponent } from './components/sole-trade-address-details/sole-trade-postal-address/sole-trade-postal-address.component';
import { SoleTradePreviousAddressComponent } from './components/sole-trade-address-details/sole-trade-previous-address/sole-trade-previous-address.component';
import { SoleTradeEmploymentDetailsComponent } from './components/sole-trade-employment-details/sole-trade-employment-details.component';
import { SoleTradeCurrentEmploymentComponent } from './components/sole-trade-employment-details/sole-trade-current-employee/sole-trade-current-employment.component';
import { SoleTradePreviousEmploymentComponent } from './components/sole-trade-employment-details/sole-trade-previous-employee/sole-trade-previous-employee .component';
import { SoleTradeFinancialComponent } from './components/sole-trade-financial/sole-trade-financial.component';
import { SoleTradeBalanceInfoComponent } from './components/sole-trade-financial/sole-trade-balance-info/sole-trade-balance-info.component';
import { SoleTradeLiabilitiesComponent } from './components/sole-trade-financial/sole-trade-liabilities/sole-trade-liabilities.component';
import { SoleTradeProfitDeclarationComponent } from './components/sole-trade-financial/sole-trade-profit-declaration/sole-trade-profit-declaration.component';
import { SoleTradeAssetsComponent } from './components/sole-trade-financial/sole-trade-assets/sole-trade-assets.component';
import { SoleTradeTurnoverInfoComponent } from './components/sole-trade-financial/sole-trade-turnover-info/sole-trade-turnover-info.component';
import { SoleTradeBusinessDetailsComponent } from './components/sole-trade-business-details/sole-trade-business-details/sole-trade-business-details.component';
import { SoleTradeCitizenshipDetailComponent } from './components/sole-trade-business-details/sole-trade-citizenship-detail/sole-trade-citizenship-detail.component';
import { SoleTradeDriverLicenceDetailComponent } from './components/sole-trade-business-details/sole-trade-driver-licence-detail/sole-trade-driver-licence-detail.component';
import { SoleTradePersonalDetailComponent } from './components/sole-trade-business-details/sole-trade-personal-detail/sole-trade-personal-detail.component';
import { TotalPaymentAmountComponent } from './components/sole-trade-financial/total-payment-amount/total-payment-amount.component';
import { SoleTradeBusinessCustomerRoleComponent } from './components/sole-trade-business-details/sole-trade-business-customer-role/sole-trade-business-customer-role.component';
import { SoleTradeEmailContactDetailComponent } from './components/sole-trade-business-details/sole-trade-email-contact-detail/sole-trade-email-contact-detail.component';
import { SoleSolicitorDetailsComponent } from './components/sole-contact-details/solicitor-details/solicitor-details.component';
import { SoleDetailsConfirmationComponent } from './components/sole-contact-details/details-confirmation/details-confirmation.component';
import { SoleCustomerReferenceComponent } from './components/sole-contact-details/customer-reference/customer-reference.component';
import { SoleAccountantDetailsComponent } from './components/sole-contact-details/accountant-details/accountant-details.component';
import { SoleBusinessContactDetailsComponent } from './components/sole-contact-details/business-contact-details/business-contact-details.component';
import { SoleContactDetailsComponent } from './components/sole-contact-details/contact-details.component';
import { SoleTradeBusinessContactDetailComponent } from './components/sole-trade-business-details/sole-trade-business-contact-detail/sole-trade-business-contact-detail.component';
import { SoleTradeBusinessContactDetail2Component } from './components/sole-trade-business-contact-detail/sole-trade-business-contact-detail.component';

@NgModule({
  declarations: [
    SoleTradeComponent,
    SoleTradeAddressDetailsComponent,
    SoleTradeFinancialComponent,
    SoleTradePhysicalAddressComponent,
    SoleTradePostalAddressComponent,
    SoleTradePreviousAddressComponent,
    SoleTradeRegisterAddressComponent,
    SoleTradeEmploymentDetailsComponent,
    SoleTradeCurrentEmploymentComponent,
    SoleTradePreviousEmploymentComponent,
    SoleTradeBalanceInfoComponent,
    SoleTradeLiabilitiesComponent,
    SoleTradeProfitDeclarationComponent,
    SoleTradeAssetsComponent,
    SoleTradeTurnoverInfoComponent,
    SoleTradeBusinessDetailsComponent,
    SoleTradeCitizenshipDetailComponent,
    SoleTradeDriverLicenceDetailComponent,
    SoleTradePersonalDetailComponent,
    SoleTradeBusinessContactDetailComponent,
    SoleTradeBusinessContactDetail2Component,
    TotalPaymentAmountComponent,
    SoleTradeBusinessCustomerRoleComponent,
    SoleTradeEmailContactDetailComponent,
    SoleContactDetailsComponent,
    SoleSolicitorDetailsComponent,
    SoleDetailsConfirmationComponent,
    SoleCustomerReferenceComponent,
    SoleBusinessContactDetailsComponent,
    SoleAccountantDetailsComponent
  ],
  imports: [CommonModule, SoleTradeRoutingModule, AuroUiFrameWork],
})
export class SoleTradeModule {}
