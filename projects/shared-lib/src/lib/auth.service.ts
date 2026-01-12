import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private userSubject = new BehaviorSubject<User | null>(null);
    public user$ = this.userSubject.asObservable();
    private readonly TOKEN_KEY = 'mfe_token';

    constructor() {
        this.loadUser();
    }

    private loadUser() {
        const token = localStorage.getItem(this.TOKEN_KEY);
        if (token) {
            this.userSubject.next({ id: 1, username: 'User', token });
        }
    }

    public login(username: string): void {
        const token = 'dummy-jwt-token-' + Math.random();
        localStorage.setItem(this.TOKEN_KEY, token);
        this.userSubject.next({ id: 1, username, token });
    }

    public logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        this.userSubject.next(null);
    }

    public getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    public isLoggedIn(): boolean {
        return !!this.userSubject.value;
    }
}
