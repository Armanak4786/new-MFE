import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuroUiFrameWork } from 'auro-ui';

import { CustomerStatementRoutingModule } from './customer-statement-routing.module';
import { CustomerStatementComponent } from './customer-statement.component';
import { PaymentSummaryDetailsComponent } from './components/payment-summary-details/payment-summary-details.component';
import { CurrentPositionComponent } from './components/current-position/current-position.component';
import { StandardQuoteModule } from '../standard-quote/standard-quote.module';
import { CustomerStatmentPaymentScheduleComponent } from './components/customer-statment-payment-schedule/customer-statment-payment-schedule.component';
import { CutomerStatementFooterComponent } from './components/cutomer-statement-footer/cutomer-statement-footer.component';
import { CustomerQuoteComponent } from './components/customer-quote/customer-quote.component';

@NgModule({
  declarations: [
    CustomerStatementComponent,
    PaymentSummaryDetailsComponent,
    CurrentPositionComponent,
    CustomerStatmentPaymentScheduleComponent,
    CutomerStatementFooterComponent,
    CustomerQuoteComponent
    
    
  ],
  imports: [
    CommonModule,
    CustomerStatementRoutingModule,
    AuroUiFrameWork,
    StandardQuoteModule
  ],
})
export class CustomerStatementModule {}
