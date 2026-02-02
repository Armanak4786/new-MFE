import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'auro-ui';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    pageType: string = "login";

    constructor(
        private authService: AuthenticationService,
    ) { }

    ngOnInit(): void { }

    loginWithOidc() {
        this.authService.oidcLogin();
    }
}
