import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DashboardComponent } from "./dashboard.component";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { AuroUiFrameWork } from "auro-ui";
import { PaginatorModule } from "primeng/paginator";
import { NotificationsComponent } from "./components/notifications/notifications.component";
import { RoleBaseAccessComponent } from "./components/role-base-access/role-base-access.component";
import { ErrorMessagesComponent } from "./components/error-messages/error-messages.component";
import { LegalMessagesComponent } from "./components/legal-messages/legal-messages.component";
import { LogoAndBrandingComponent } from "./components/logo-and-branding/logo-and-branding.component";

@NgModule({
  declarations: [
    DashboardComponent,
    NotificationsComponent,
    RoleBaseAccessComponent,
    ErrorMessagesComponent,
    LegalMessagesComponent,
    LogoAndBrandingComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    AuroUiFrameWork,
    PaginatorModule,
    FormsModule,
  ],
})
export class DashboardModule {}

