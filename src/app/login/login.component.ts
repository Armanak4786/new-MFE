import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService, DataService } from 'auro-ui';

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
