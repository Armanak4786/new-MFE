import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuroUiFrameWork } from 'auro-ui';
import { IndividualRoutingModule } from './individual-routing.module';
import { IndividualComponent } from './individual.component';
import { AddressDetailsComponent } from './components/address-details/address-details.component';
import { PhysicalAddressComponent } from './components/address-details/physical-address/physical-address.component';
import { PostalAddressComponent } from './components/address-details/postal-address/postal-address.component';
import { PreviousAddressComponent } from './components/address-details/previous-address/previous-address.component';
import { CurrentEmploymentComponent } from './components/employment-details/current-employee/current-employment.component';
import { EmploymentDetailsComponent } from './components/employment-details/employment-details.component';
import { PreviousEmploymentComponent } from './components/employment-details/previous-employee/previous-employee .component';
import { FinancialPositionComponent } from './components/financialposition/financial-position.component';
import { IncomeDetailsComponent } from './components/financialposition/income-details/income-details.component';
import { IndividualAssetDetailsComponent } from './components/financialposition/individual-asset-details/individual-asset-details.component';
import { IndividualExpenditureComponent } from './components/financialposition/individual-expenditure/individual-expenditure.component';
import { IndividualLiabilitiesComponent } from './components/financialposition/individual-liabilities/individual-liabilities.component';
import { RegularRecurringFrequencyComponent } from './components/financialposition/regular-recurring-frequency/regular-recurring-frequency.component';
import { PersonalCitizenshipDetailComponent } from './components/personal-details/personal-citizenship-detail/personal-citizenship-detail.component';
import { PersonalContactDetailComponent } from './components/personal-details/personal-contact-detail/personal-contact-detail.component';
import { PersonalDetailsComponent } from './components/personal-details/personal-details/personal-details.component';
import { PersonalDriverLicenceDetailComponent } from './components/personal-details/personal-driver-licence-detail/personal-driver-licence-detail.component';
import { IndividualReferenceConfirmationComponent } from './components/reference-details/individual-reference-confirmation/individual-reference-confirmation.component';
import { ReferenceDetailsComponent } from './components/reference-details/reference-details.component';
import { PersonalDetailEmailContactComponent } from './components/personal-details/personal-detail-email-contact/personal-detail-email-contact.component';
import { GeoapifyGeocoderAutocompleteModule } from '@geoapify/angular-geocoder-autocomplete';
import { BusinessModule } from '../business/business.module';

@NgModule({
  declarations: [
    IndividualComponent,
    AddressDetailsComponent,
    PhysicalAddressComponent,
    PreviousAddressComponent,
    PostalAddressComponent,
    EmploymentDetailsComponent,
    CurrentEmploymentComponent,
    PreviousEmploymentComponent,
    ReferenceDetailsComponent,
    IndividualReferenceConfirmationComponent,
    FinancialPositionComponent,
    IncomeDetailsComponent,
    PreviousEmploymentComponent,
    PersonalCitizenshipDetailComponent,
    PersonalContactDetailComponent,
    PersonalDetailsComponent,
    PersonalDriverLicenceDetailComponent,
    IndividualAssetDetailsComponent,
    IndividualExpenditureComponent,
    IndividualLiabilitiesComponent,
    RegularRecurringFrequencyComponent,
    PersonalDetailEmailContactComponent
  ],
  imports: [
    CommonModule,
    IndividualRoutingModule,
    AuroUiFrameWork,
    GeoapifyGeocoderAutocompleteModule.withConfig('8d7dd86e21f74868ae76774eb61d4a92'),
    BusinessModule,
    ],
})
export class IndividualModule {}
