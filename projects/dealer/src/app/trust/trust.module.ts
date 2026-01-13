import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuroUiFrameWork } from "auro-ui";
import { TrustComponent } from "./trust.component";
import { TrustRoutingModule } from "./trust-routing.module";
import { TrustAddressDetailsComponent } from "./components/trust-address-details/trust-address-details.component";
import { TrustPhysicalAddressComponent } from "./components/trust-address-details/trust-physical-address/trust-physical-address.component";
import { TrustPostalAddressComponent } from "./components/trust-address-details/trust-postal-address/trust-postal-address.component";
import { TrustPreviousAddressComponent } from "./components/trust-address-details/trust-previous-address/trust-previous-address.component";
import { TrustRegisterAddressComponent } from "./components/trust-address-details/trust-registered-address/trust-registered-address.component";
import { TrustAccountantDetailsComponent } from "./components/trust-contact-detail/trust-accountant-details/trust-accountant-details.component";
import { TrustContactDetailComponent } from "./components/trust-contact-detail/trust-contact-detail.component";
import { TrustContactDetailsCardComponent } from "./components/trust-contact-detail/trust-contact-details-card/trust-contact-details-card.component";
import { TrustCustomerReferenceComponent } from "./components/trust-contact-detail/trust-customer-reference/trust-customer-reference.component";
import { TrustDetailsConfirmationComponent } from "./components/trust-contact-detail/trust-details-confirmation/trust-details-confirmation.component";
import { TrustSolicitorDetailsComponent } from "./components/trust-contact-detail/trust-solicitor-details/trust-solicitor-details.component";
import { TrustContactDetailsComponent } from "./components/trust-details/trust-contact-details/trust-contact-details.component";
import { TrustDetailComponent } from "./components/trust-details/trust-detail/trust-detail.component";
import { TrustAssetsComponent } from "./components/trust-financial-details/trust-assets/trust-assets.component";
import { TrustBalanceInfoComponent } from "./components/trust-financial-details/trust-balance-info/trust-balance-info.component";
import { TrustFinancialDetailsComponent } from "./components/trust-financial-details/trust-financial-details.component";
import { TrustLiabilitiesComponent } from "./components/trust-financial-details/trust-liabilities/trust-liabilities.component";
import { TrustProfitDeclarationComponent } from "./components/trust-financial-details/trust-profit-declaration/trust-profit-declaration.component";
import { TrustTurnoverInfoComponent } from "./components/trust-financial-details/trust-turnover-info/trust-turnover-info.component";
import { ProfessionalTrusteeComponent } from "./components/trustee-details/professional-trustee/professional-trustee.component";
import { TrusteeDetailsComponent } from "./components/trustee-details/trustee-details.component";
import { TrusteeComponent } from "./components/trustee-details/trustee/trustee.component";
import { TrustEmailContactDetailsComponent } from "./components/trust-details/trust-email-contact-details/trust-email-contact-details.component";
import { GeoapifyGeocoderAutocompleteModule } from "@geoapify/angular-geocoder-autocomplete";
@NgModule({
  declarations: [
    TrustComponent,
    TrustFinancialDetailsComponent,
    TrustProfitDeclarationComponent,
    TrustTurnoverInfoComponent,
    TrustBalanceInfoComponent,
    TrustAssetsComponent,
    TrustLiabilitiesComponent,
    TrustContactDetailComponent,
    TrustContactDetailsCardComponent,
    TrustAccountantDetailsComponent,
    TrustSolicitorDetailsComponent,
    TrustCustomerReferenceComponent,
    TrustDetailsConfirmationComponent,
    TrustLiabilitiesComponent,
    TrustAddressDetailsComponent,
    TrustRegisterAddressComponent,
    TrustPhysicalAddressComponent,
    TrustPreviousAddressComponent,
    TrustPostalAddressComponent,
    TrustPhysicalAddressComponent,
    TrustPreviousAddressComponent,
    TrustPostalAddressComponent,
    TrustContactDetailsComponent,
    TrustDetailComponent,
    TrusteeDetailsComponent,
    TrusteeComponent,
    ProfessionalTrusteeComponent,
    TrustEmailContactDetailsComponent,
  ],
  imports: [
    CommonModule,
    TrustRoutingModule,
    AuroUiFrameWork,
    GeoapifyGeocoderAutocompleteModule.withConfig(
      "8d7dd86e21f74868ae76774eb61d4a92"
    ),
  ],
})
export class TrustModule {}
