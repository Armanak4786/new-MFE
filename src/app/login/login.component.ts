import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService, DataService } from 'auro-ui';
import { environment } from '../../environments/environment.prod';
import { OidcSecurityService } from 'angular-auth-oidc-client';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  pageType: string = "login";

  valCheck: string[] = ["remember"];
  password!: string;
  hidePassword: boolean = true;
  loginForm: FormGroup;

  private readonly oidcSecurityService = inject(OidcSecurityService);

  constructor(
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private dataSvc: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
      remember: [false, [Validators.requiredTrue]],
    });

    setTimeout(() => {
      if (environment.production) {
        if (
          this.router?.url == "/login" ||
          this.router?.url == "/landing"
        ) {
          this.oidcSecurityService
            .checkAuth()
            .subscribe(({ isAuthenticated }) => {
              console.log("welcome isAuthenticated", isAuthenticated);
              if (isAuthenticated) {
                this.router.navigate(["/landing"]);
              } else {
                this.router.navigate(["/login"]);
              }
            });
        }
      } else {
        this.router.navigate(["/landing"]);
      }
    }, 1000);
  }

  loginWithOidc() {
    this.authService.oidcLogin();
  }

  basicAuthentication() {
    if (
      !this.loginForm.controls["username"].value ||
      !this.loginForm.controls["password"].value
    ) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.dataSvc
      .getAccessToken(
        "",
        this.loginForm.controls["username"].value,
        this.loginForm.controls["password"].value
      )
      .subscribe((data: any) => {
        sessionStorage.setItem("accessToken", data?.access_token || null);
        sessionStorage.setItem("refreshToken", data?.refresh_token || null);
        this.router.navigate(["/landing"]);
      });
  }
}
