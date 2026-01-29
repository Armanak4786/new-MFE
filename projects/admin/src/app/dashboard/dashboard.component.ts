import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent implements OnInit {
  selectedStatus: string = "quotesAndApps";

  activeIndex = 0;
  previousIndex = 0;

  menu = [
    { label: "Logo and Branding", value: "LOGO_BRANDING" },
    { label: "Legal Messages", value: "LEGAL_MESSAGES" },
    { label: "Error Messages", value: "ERROR_MESSAGES" },
    { label: "Role Base Access", value: "ROLE_BASE_ACCESS" },
    { label: "Banner / Notifications", value: "BANNER_NOTIFICATIONS" },
  ];
  selectedValue = this.menu[0].value;
  previousValue = this.selectedValue;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onStatusTabChange(status: string) {
    this.selectedStatus = status;
  }

  onMenuClick(index: number) {
    if (index === this.activeIndex) {
      return;
    }

    this.previousIndex = this.activeIndex;
    this.previousValue = this.selectedValue;

    this.activeIndex = index;
    this.selectedValue = this.menu[index].value;
  }
}

