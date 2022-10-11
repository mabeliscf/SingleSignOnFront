import { Inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import { UserLogged } from '../Models/response/UserLogged';
import { HttpServiceService } from './http-service.service';

import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})


export class AuthService {

   jwttoken : string ="";
  constructor(@Inject(OKTA_AUTH) private _oktaAuth: OktaAuth, public jwtHelpar : JwtHelperService) { 

   
  }

  public isAuthenticated(): boolean{
    const jwttoken = localStorage.getItem("id_token");  
    const token = this._oktaAuth.getAccessToken() ==undefined ? jwttoken?.toString()  :  this._oktaAuth.getAccessToken();
      return !this.jwtHelpar.isTokenExpired(token);
  }

login(data : UserLogged ) {
    return this.setSession(data); 
    // this.http.post<User>('/api/login', {email, password})
    //     .do(res => this.setSession) 
    //     .shareReplay();
}
      
private setSession(authResult: UserLogged) {
    const expiresAt = moment().add(authResult.expiresIn,'second');

    localStorage.setItem('id_token', authResult.token.toString());
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
}          

logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
}

public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
}

isLoggedOut() {
    return !this.isLoggedIn();
}

getExpiration() {
    const expiration = localStorage.getItem("expires_at") ;
    const expiresAt = JSON.parse(expiration ==null ? "" : expiration);
    return moment(expiresAt);
}    
}
