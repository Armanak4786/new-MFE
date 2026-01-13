import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuickQuoteRoutingModule } from './quick-quote-routing.module';
import { QuickQuoteComponent } from './quick-quote.component';
import { AuroUiFrameWork } from 'auro-ui';
import { CreateQuickQuoteComponent } from './components/create-quick-quote/create-quick-quote.component';
import { UdcEmailComponent } from './components/udc-email/udc-email.component';

@NgModule({
  declarations: [
    QuickQuoteComponent,
    CreateQuickQuoteComponent,
    UdcEmailComponent,
  ],
  imports: [CommonModule, QuickQuoteRoutingModule, AuroUiFrameWork],
})
export class QuickQuoteModule {}
