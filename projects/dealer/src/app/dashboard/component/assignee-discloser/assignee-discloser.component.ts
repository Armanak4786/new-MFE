import { Component } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { CommonService } from 'auro-ui';

@Component({
  selector: 'app-assignee-discloser',
  templateUrl: './assignee-discloser.component.html',
  styleUrl: './assignee-discloser.component.scss'
})
export class AssigneeDiscloserComponent {

  constructor(
    private service: DashboardService,
    public commonSvc: CommonService
  ) {}
closePopup() {
  this.commonSvc.dialogSvc.ngOnDestroy();
}
viewQuote(){
  
}
}
