import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuroUiFrameWork } from 'auro-ui';
import { CommercialModule } from '../commercial.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { ReusableComponentModule } from '../reusable-component/reusable-component.module';
import { IntroducerComponent } from './introducer.component';
import { IntroducerRoutingModule } from './introducer-routing-module';
import { IntroducerPaymentRequestComponent } from './introducer-payment-request/introducer-payment-request.component';

@NgModule({
  declarations: [IntroducerComponent,IntroducerPaymentRequestComponent],
  imports: [
    CommonModule,
    IntroducerRoutingModule,
    AuroUiFrameWork,
    CommercialModule,
    ReactiveFormsModule,
    ChartModule,
    ReusableComponentModule,
  ],
})
export class IntroducerModule {}
