import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EasylinkRoutingModule } from './easylink-routing.module';
import { AuroUiFrameWork } from 'auro-ui';
import { EasylinkComponent } from './easylink.component';
import { ViewEasylinkComponent } from './components/view-easylink/view-easylink.component';
import { ReusableComponentModule } from '../reusable-component/reusable-component.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { EasylinkSubFacilityComponent } from './components/easylink-sub-facility/easylink-sub-facility.component';
import { EasylinkCurrentAccountComponent } from './components/easylink-current-account/easylink-current-account.component';
import { EasylinkDrawdownRequestComponent } from './components/easylink-drawdown-request/easylink-drawdown-request.component';
import { EasylinkDrawdownRequestCardComponent } from './components/easylink-drawdown-request-card/easylink-drawdown-request-card.component';
import { EasylinkDrawdownDetailsComponent } from './components/easylink-drawdown-details/easylink-drawdown-details.component';
import { EasylinkDrawdownRequestSubmitComponent } from './components/easylink-drawdown-request-submit/easylink-drawdown-request-submit.component';

@NgModule({
  declarations: [
    EasylinkComponent,
    ViewEasylinkComponent,
    EasylinkSubFacilityComponent,
    EasylinkCurrentAccountComponent,
    EasylinkDrawdownRequestComponent,
    EasylinkDrawdownDetailsComponent,
    EasylinkDrawdownRequestCardComponent,
    EasylinkDrawdownRequestSubmitComponent,
  ],
  imports: [
    CommonModule,
    EasylinkRoutingModule,
    ReactiveFormsModule,
    AuroUiFrameWork,
    ChartModule,
    ReusableComponentModule,
  ],
})
export class EasylinkModule {}
