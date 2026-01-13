import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-common-dashboard',
  templateUrl: './common-dashboard.component.html',
  styleUrl: './common-dashboard.component.scss'
})
export class CommonDashboardComponent implements OnInit {
   userRole: any = {}; 

   constructor(){
    
   }
   ngOnInit(): void {
    this.userRole = JSON.parse(sessionStorage.getItem("user_role") || "{}");
   }


}
