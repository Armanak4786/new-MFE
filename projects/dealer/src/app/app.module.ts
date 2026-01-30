import { APP_INITIALIZER, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { AuroUiFrameWork, ConfigService, loadConfigAndSetEnv } from "auro-ui";
import { BrowserModule } from "@angular/platform-browser";
import { LayoutModule } from './layout/layout.module';
import { SharedComponentsModule } from './components/shared-components.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Observable, forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import { JwtModule } from "@auth0/angular-jwt";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService } from 'primeng/dynamicdialog';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { CookieAuthService } from "shared-lib";

// Custom loader that loads from both i18n and api-json folders
export class CustomTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<any> {
    // Map language codes: 'en' -> 'en_US' for api-json
    const apiJsonLang = lang === 'en' ? 'en_US' : lang;
    
    const i18nLoader = new TranslateHttpLoader(this.http, './assets/i18n/', '.json').getTranslation(lang);
    const apiJsonLoader = this.http.get(`./assets/api-json/${apiJsonLang}.json`);
    
    return forkJoin([i18nLoader, apiJsonLoader]).pipe(
      map(([i18nTranslations, apiJsonData]: [any, any]) => {
        // Extract labelData from api-json structure
        const apiJsonTranslations = (apiJsonData as any)?.labelData || {};
        // Merge both translation objects, with api-json taking precedence for duplicate keys
        return { ...i18nTranslations, ...apiJsonTranslations };
      })
    );
  }
}

// Factory function for loading translation files from multiple sources
export function HttpLoaderFactory(http: HttpClient) {
  return new CustomTranslateLoader(http);
}

export function tokenGetter() {
  return localStorage.getItem("id_token");
}

/**
 * Initialize app and restore auth from cookies.
 * When this app is accessed on its port (localhost:4201),
 * it restores auth data from cookies that were set by the host (localhost:4200).
 * If no token is found, redirect to host login page.
 */
export function initializeAppEnv(configService: ConfigService, cookieAuthService: CookieAuthService) {
  return async () => {
    // First, restore auth data from cookies to sessionStorage (key: accessToken)
    cookieAuthService.restoreAuthFromCookies();
    
    // Check if token exists after restoration
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      console.log('[Dealer] No token found, redirecting to login...');
      // Redirect to host login page (port 4200)
      window.location.href = 'http://localhost:4200/login';
      return;
    }
    
    // Then load the app configuration
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
    SharedComponentsModule,

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
