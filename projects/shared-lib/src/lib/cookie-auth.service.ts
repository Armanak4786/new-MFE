import { Injectable } from '@angular/core';

/**
 * Cookie-based Authentication Service for cross-port token sharing.
 * 
 * Since sessionStorage is port-specific (localhost:4200 vs localhost:4201 have different storage),
 * we use cookies to share authentication data across all ports on the same domain.
 * 
 * Flow:
 * 1. After login on host (4200), store auth data in cookies
 * 2. When remote app loads on different port, read from cookies and populate sessionStorage
 */
@Injectable({ providedIn: 'root' })
export class CookieAuthService {

  // Cookie names for auth data
  private readonly ACCESS_TOKEN_COOKIE = 'mfe_access_token';
  private readonly ID_TOKEN_COOKIE = 'mfe_id_token';
  private readonly USER_ROLE_COOKIE = 'mfe_user_role';
  private readonly EXTERNAL_USER_TYPE_COOKIE = 'mfe_external_user_type';
  private readonly DEALER_PARTY_NUMBER_COOKIE = 'mfe_dealer_party_number';
  private readonly DEALER_PARTY_NAME_COOKIE = 'mfe_dealer_party_name';
  private readonly PRODUCT_CODE_COOKIE = 'mfe_product_code';

  // Cookie expiry in days
  private readonly COOKIE_EXPIRY_DAYS = 1;

  /**
   * Store all authentication data from sessionStorage to cookies.
   * Call this after login and before redirecting to a different port.
   */
  storeAuthToCookies(): void {
    const accessToken = sessionStorage.getItem('accessToken');
    const idToken = localStorage.getItem('id_token');
    const userRole = sessionStorage.getItem('user_role');
    const externalUserType = sessionStorage.getItem('externalUserType');
    const dealerPartyNumber = sessionStorage.getItem('dealerPartyNumber');
    const dealerPartyName = sessionStorage.getItem('dealerPartyName');
    const productCode = sessionStorage.getItem('productCode');

    if (accessToken) this.setCookie(this.ACCESS_TOKEN_COOKIE, accessToken);
    if (idToken) this.setCookie(this.ID_TOKEN_COOKIE, idToken);
    if (userRole) this.setCookie(this.USER_ROLE_COOKIE, encodeURIComponent(userRole));
    if (externalUserType) this.setCookie(this.EXTERNAL_USER_TYPE_COOKIE, externalUserType);
    if (dealerPartyNumber) this.setCookie(this.DEALER_PARTY_NUMBER_COOKIE, dealerPartyNumber);
    if (dealerPartyName) this.setCookie(this.DEALER_PARTY_NAME_COOKIE, encodeURIComponent(dealerPartyName));
    if (productCode) this.setCookie(this.PRODUCT_CODE_COOKIE, productCode);

    console.log('[CookieAuth] Auth data stored to cookies');
  }

  /**
   * Restore authentication data from cookies to sessionStorage/localStorage.
   * Call this on app initialization in remote apps.
   */
  restoreAuthFromCookies(): void {
    const accessToken = this.getCookie(this.ACCESS_TOKEN_COOKIE);
    const idToken = this.getCookie(this.ID_TOKEN_COOKIE);
    const userRole = this.getCookie(this.USER_ROLE_COOKIE);
    const externalUserType = this.getCookie(this.EXTERNAL_USER_TYPE_COOKIE);
    const dealerPartyNumber = this.getCookie(this.DEALER_PARTY_NUMBER_COOKIE);
    const dealerPartyName = this.getCookie(this.DEALER_PARTY_NAME_COOKIE);
    const productCode = this.getCookie(this.PRODUCT_CODE_COOKIE);

    // Restore to sessionStorage with 'accessToken' key
    if (accessToken && !sessionStorage.getItem('accessToken')) {
      sessionStorage.setItem('accessToken', accessToken);
      console.log('[CookieAuth] accessToken restored from cookies');
    }
    if (idToken && !localStorage.getItem('id_token')) {
      localStorage.setItem('id_token', idToken);
    }
    if (userRole && !sessionStorage.getItem('user_role')) {
      sessionStorage.setItem('user_role', decodeURIComponent(userRole));
    }
    if (externalUserType && !sessionStorage.getItem('externalUserType')) {
      sessionStorage.setItem('externalUserType', externalUserType);
    }
    if (dealerPartyNumber && !sessionStorage.getItem('dealerPartyNumber')) {
      sessionStorage.setItem('dealerPartyNumber', dealerPartyNumber);
    }
    if (dealerPartyName && !sessionStorage.getItem('dealerPartyName')) {
      sessionStorage.setItem('dealerPartyName', decodeURIComponent(dealerPartyName));
    }
    if (productCode && !sessionStorage.getItem('productCode')) {
      sessionStorage.setItem('productCode', productCode);
    }

    console.log('[CookieAuth] Auth data restored from cookies to sessionStorage');
  }

  /**
   * Check if auth cookies exist
   */
  hasAuthCookies(): boolean {
    return !!this.getCookie(this.ACCESS_TOKEN_COOKIE);
  }

  /**
   * Clear all auth cookies (for logout)
   */
  clearAuthCookies(): void {
    this.deleteCookie(this.ACCESS_TOKEN_COOKIE);
    this.deleteCookie(this.ID_TOKEN_COOKIE);
    this.deleteCookie(this.USER_ROLE_COOKIE);
    this.deleteCookie(this.EXTERNAL_USER_TYPE_COOKIE);
    this.deleteCookie(this.DEALER_PARTY_NUMBER_COOKIE);
    this.deleteCookie(this.DEALER_PARTY_NAME_COOKIE);
    this.deleteCookie(this.PRODUCT_CODE_COOKIE);
    console.log('[CookieAuth] Auth cookies cleared');
  }

  private setCookie(name: string, value: string): void {
    const date = new Date();
    date.setTime(date.getTime() + (this.COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
  }

  private getCookie(name: string): string | null {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length);
      }
    }
    return null;
  }

  private deleteCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
}
