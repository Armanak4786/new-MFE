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

// Factory function for loading translation files
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function tokenGetter() {
  return localStorage.getItem("id_token");
}

export function initializeAppEnv(configService: ConfigService) {
  return loadConfigAndSetEnv(configService, "assets/config.json");
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
      deps: [ConfigService],
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule { }
