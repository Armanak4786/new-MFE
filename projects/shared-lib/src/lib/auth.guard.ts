import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): boolean | UrlTree {
        if (this.authService.isLoggedIn()) {
            return true;
        }
        // Redirect to home or login logic (simplification)
        // In a real app, maybe redirect to login page
        return true; // Allowing for now to test remotes without login UI
    }
}
