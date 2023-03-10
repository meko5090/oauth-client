import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { UserManager, UserManagerSettings, User, OidcClientSettings } from 'oidc-client';
import { BehaviorSubject } from 'rxjs';

import { BaseService } from "../../shared/base.service";
import { ConfigService } from '../../shared/config.service';
import { AuthConfig } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService  {

  // Observable navItem source
  private _authNavStatusSource = new BehaviorSubject<boolean>(false);
  // Observable navItem stream
  authNavStatus$ = this._authNavStatusSource.asObservable();

  private manager = new UserManager(getClientSettings());
  private user: any;

  constructor(private http: HttpClient, private configService: ConfigService) {
    super();

    this.manager.getUser().then(user => {
      this.user = user;
      this._authNavStatusSource.next(this.isAuthenticated());
    });
  }

  login() {
    return this.manager.signinRedirect();
  }

  async completeAuthentication() {
      this.user = await this.manager.signinRedirectCallback();
      this._authNavStatusSource.next(this.isAuthenticated());
  }

  register(userRegistration: any) {
    return this.http.post(this.configService.authApiURI + '/register', userRegistration).pipe(catchError(this.handleError));
  }

  isAuthenticated(): boolean {
    return this.user != null && !this.user.expired;
  }

  get authorizationHeaderValue(): string {
    return `${this.user.token_type} ${this.user.access_token}`;
  }

  get name(): string {
    return this.user != null ? this.user.profile.name : '';
  }

  async signout() {
    await this.manager.signoutRedirect();
  }
}

/* export function getClientSettings(): UserManagerSettings {
  return {
      authority: 'http://localhost:7000',
      client_id: 'angular_spa',
      redirect_uri: 'http://localhost:7200/auth-callback',
      post_logout_redirect_uri: 'http://localhost:7000/',
      response_type:"id_token token",
      scope:"openid profile email api.read",
      filterProtocolClaims: true,
      loadUserInfo: true,
      automaticSilentRenew: true,
      silent_redirect_uri: 'http://localhost:7200/silent-refresh.html'
  };
}
 */

export function getClientSettings():UserManagerSettings {
  return {
      authority: 'https://localhost:7000',
      client_id: 'angular_spa',
      client_secret:"secret",
      redirect_uri: 'http://localhost:4200/auth-callback',
      post_logout_redirect_uri: 'https://localhost:4200/',
      response_type:"id_token token",
      scope:"magic openid",
      filterProtocolClaims: true,
      loadUserInfo: true,
      automaticSilentRenew: true,
      silent_redirect_uri: 'http://localhost:4200/silent-refresh.html'
  }; 

 /*  
export function getClientSettings():AuthConfig {
  return {
      issuer: 'http://localhost:7000',
      clientId: 'angular_spa',
      dummyClientSecret:"secret",
      redirectUri: 'http://localhost:7200/auth-callback',
      postLogoutRedirectUri: 'http://localhost:7000/',
      responseType:"id_token token",
      scope:"magic",

      useSilentRefresh: true, // Needed for Code Flow to suggest using iframe-based refreshes
      silentRefreshTimeout: 5000, // For faster testing
      timeoutFactor: 0.25, // For faster testing
      sessionChecksEnabled: true,
      showDebugInformation: false, // Also requires enabling "Verbose" level in devtools
      clearHashAfterLogin: false, // https://github.com/manfredsteyer/angular-oauth2-oidc/issues/457#issuecomment-431807040,
      nonceStateSeparator: 'semicolon', // Real semicolon gets mangled by Duende ID Server's URI encoding


      silentRefreshRedirectUri: 'http://localhost:7200/silent-refresh.html'
  };
  
 */



}
