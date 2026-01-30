import { APP_INITIALIZER, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { AuroUiFrameWork, ConfigService, loadConfigAndSetEnv } from "auro-ui";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { JwtModule } from "@auth0/angular-jwt";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService } from 'primeng/dynamicdialog';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { LayoutModule } from './layout/layout.module';
import { CookieAuthService } from "shared-lib";

// Factory function for loading translation files
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function tokenGetter() {
  return localStorage.getItem("id_token");
}

/**
 * Initialize app and restore auth from cookies.
 * If no token is found, redirect to host login page.
 */
export function initializeAppEnv(configService: ConfigService, cookieAuthService: CookieAuthService) {
  return async () => {
    // Restore auth data from cookies to sessionStorage (key: accessToken)
    cookieAuthService.restoreAuthFromCookies();
    
    // Check if token exists after restoration
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      console.log('[Admin] No token found, redirecting to login...');
      // Redirect to host login page (port 4200)
      window.location.href = 'http://localhost:4200/login';
      return;
    }
    
    // Load app configuration
    await loadConfigAndSetEnv(configService, "assets/config.json")();
  };
}


@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    AuroUiFrameWork,
    CurrencyMaskModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'en'
    }),
    LayoutModule,

    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
      },
    }),
  ],
  providers: [
    ConfirmationService,
    MessageService,
    DialogService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppEnv,
      deps: [ConfigService, CookieAuthService],
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule { }
