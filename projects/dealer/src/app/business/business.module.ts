import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuroUiFrameWork } from 'auro-ui';
import { BusinessComponent } from './business.component';
import { BusinessRoutingModule } from './business-routing.module';
import { BusinessAddressDetailsComponent } from './component/business-address-details/business-address-details.component';
import { BusinessPhysicalAddressComponent } from './component/business-address-details/business-physical-address/business-physical-address.component';
import { BusinessPostalAddressComponent } from './component/business-address-details/business-postal-address/business-postal-address.component';
import { BusinessPreviousAddressComponent } from './component/business-address-details/business-previous-address/business-previous-address.component';
import { BusinessRegisterAddressComponent } from './component/business-address-details/business-registered-address/business-registered-address.component';
import { BusinessContactDeatilComponent } from './component/business-detail/business-contact-deatil/business-contact-deatil.component';
import { BusinessDetailsComponent } from './component/business-detail/business-details/business-details.component';
import { BalanceInfomartionComponent } from './component/business-financial/balance-infomartion/balance-infomartion.component';
import { BusinessFinancialComponent } from './component/business-financial/business-financial.component';
import { ProfitDeclarationComponent } from './component/business-financial/profit-declaration/profit-declaration.component';
import { TurnoverInformationComponent } from './component/business-financial/turnover-information/turnover-information.component';
import { AccountantDetailsComponent } from './component/contact-details/accountant-details/accountant-details.component';
import { BusinessContactDetailsComponent } from './component/contact-details/business-contact-details/business-contact-details.component';
import { ContactDetailsComponent } from './component/contact-details/contact-details.component';
import { CustomerReferenceComponent } from './component/contact-details/customer-reference/customer-reference.component';
import { DetailsConfirmationComponent } from './component/contact-details/details-confirmation/details-confirmation.component';
import { SolicitorDetailsComponent } from './component/contact-details/solicitor-details/solicitor-details.component';
import { BusinessEmailContactDetailsComponent } from './component/business-detail/business-email-contact-details/business-email-contact-details.component';
import { BusinessWebsiteContactDetailsComponent } from './component/business-detail/business-website-contact-details/business-website-contact-details.component';
import { GeoapifyGeocoderAutocompleteModule } from '@geoapify/angular-geocoder-autocomplete';

@NgModule({
  declarations: [
    BusinessComponent,
    BusinessDetailsComponent,
    BusinessFinancialComponent,
    ProfitDeclarationComponent,
    TurnoverInformationComponent,
    BalanceInfomartionComponent,
    CustomerReferenceComponent,
    DetailsConfirmationComponent,
    SolicitorDetailsComponent,
    ContactDetailsComponent,
    BusinessContactDetailsComponent,
    AccountantDetailsComponent,
    SolicitorDetailsComponent,
    ContactDetailsComponent,
    AccountantDetailsComponent,
    BusinessAddressDetailsComponent,
    BusinessPostalAddressComponent,
    BusinessPhysicalAddressComponent,
    BusinessPreviousAddressComponent,
    BusinessRegisterAddressComponent,
    BusinessContactDeatilComponent,
    BusinessEmailContactDetailsComponent,
    BusinessWebsiteContactDetailsComponent,
  ],
  imports: [CommonModule, BusinessRoutingModule, AuroUiFrameWork,
     GeoapifyGeocoderAutocompleteModule.withConfig(
          '8d7dd86e21f74868ae76774eb61d4a92'
        ),
  ],

  exports: [
    CustomerReferenceComponent
  ]
})
export class BusinessModule {}
