import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-drawdown-request-additional-info',
  templateUrl: './drawdown-request-additional-info.component.html',
  styleUrls: ['./drawdown-request-additional-info.component.scss'],
})
export class DrawdownRequestAdditionalInfoComponent {
  @Input() columns = 120;
}
