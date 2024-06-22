import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {jwtDecode,JwtPayload} from 'jwt-decode';
import {AppAuthService} from '../auth/app-auth.service'
import { TokenService, UtilsService, NotifyService } from 'abp-ng2-module';
import { AppConsts } from '@shared/AppConsts';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ApplicationRef } from '@angular/core';
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  submitting = false;
  private _auth2: any; 
  public user: BehaviorSubject<any> = new BehaviorSubject(null);
  private baseUrl = 'https://localhost:44311/api/SignByGoogle/googleSign'; 

  constructor(    private appRef: ApplicationRef ,private notify:NotifyService,private router:Router,private http: HttpClient, private _authService: AppAuthService,     private _utilsService: UtilsService,
    private _tokenService: TokenService,) {
    gapi.load('auth2', () => {
      this._auth2 = gapi.auth2.init({
        client_id: '1014379927954-vi5tc5jsv4avgaetocolmrk2rnq85180.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email',
        ux_mode: 'redirect',
        redirect_uri: 'http://localhost:4200/account/auth-callback' 
      });

      this._auth2.isSignedIn.listen(this.updateSigninStatus.bind(this));
    });
  }

  get auth2() {
    return this._auth2;
  }

  public signIn() {

    this.auth2.signIn({
      prompt: 'select_account',
      ux_mode: 'redirect',
      redirect_uri: 'http://localhost:4200/account/auth-callback' 
    }).catch((error: any) => {
      console.error('Google sign-in failed', error);
      this.handleError(error)
    });
  }
  public updateSigninStatus(isSignedIn: boolean) {
      console.log('updateSigninStatus called with isSignedIn:', isSignedIn);
 
    if (isSignedIn) {
      const googleUser = this.auth2.currentUser.get();
      const profile = googleUser.getBasicProfile();
      const idToken = googleUser.getAuthResponse().id_token;
      // const email = profile.getEmail();
      
      this.registerWithGoogle(idToken).subscribe(
        response => {
          this.handleLoginResponse(response.result.token); 
          this.user.next(response.user);
        },
        error => console.error('Registration/Login failed', error)
      );
    }
  }

  public signOut() {
    this.auth2.signOut().then(() => {
      this.user.next(null);
    });
  }

  public registerWithGoogle(token: string): Observable<any> {
  
    const url = `${this.baseUrl}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'text/plain'
    });
    const body = { token };

    return this.http.post<any>(url, body, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error)
        console.error('Registration error:', error);
        return throwError('Registration failed. Please try again later.');
      }),
      map((response: any) => {
  
        this.handleLoginResponse(response.result.token); 
        return response;
      })
   
    );
  }

  private handleLoginResponse(authenticateResult: any): void {
    const tokenExpireDate = new Date(new Date().getTime() + 1000 * this.getExpireInSeconds(authenticateResult));
    this._tokenService.setToken(authenticateResult, tokenExpireDate);
    this._utilsService.setCookieValue(
      AppConsts.authorization.encryptedAuthTokenName,
      authenticateResult,
      tokenExpireDate,
      abp.appPath
    );

   
    // this._authService.authenticate(() => {
    //   this.submitting = false;
    //   this.appRef.tick();
      
    //   this.notify.success('Login Successful');
    // });
  }

  private getExpireInSeconds(token: string): number {
    try {
      const decodedToken: JwtPayload = jwtDecode(token);
      return decodedToken.exp - decodedToken.iat;
    } catch (error) {
      console.error('Error decoding token:', error);
      return 0; 
    }
  }

  private handleError(error: any): void {
    console.error('Registration/Login failed', error);
    this.notify.error('Login failed. Please try again.');
  }

  public handleResponseManually(response: any): void {
    this.handleLoginResponse(response);
    this.user.next(response.user);
    this.appRef.tick();
  }
}