import { Inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import { UserLogged } from '../Models/response/UserLogged';
import { HttpServiceService } from './http-service.service';

import * as moment from "moment";
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})


export class AuthService {

   jwttoken : string ="";

   private loggedin = new BehaviorSubject<boolean>(false);
   public name$!: Observable<string>;
   
   get isUserLoggedIn(){
    return this.loggedin.asObservable();
   }

  constructor(@Inject(OKTA_AUTH) private _oktaAuth: OktaAuth, public jwtHelpar : JwtHelperService, private router: Router) { 

   
  }

  // public isAuthenticated(): boolean{
  //   const jwttoken = localStorage.getItem("id_token");  
  //   const token = this._oktaAuth.getAccessToken() ==undefined ? jwttoken?.toString()  :  this._oktaAuth.getAccessToken();
  //     return !this.jwtHelpar.isTokenExpired(token);
  // }

login(data : UserLogged ) {


    this.loggedin.next(true);
    this.saveLoginUser(data);
    this.router.navigate(['/']);
    return this.setSession(data); 
   
}

private saveLoginUser(user : UserLogged){
  localStorage.setItem('username', user.username.toString());
  localStorage.setItem('fullname', user.fullName.toString());
  localStorage.setItem('iduser', user.id.toString());
}
      
private setSession(authResult: UserLogged) {
    const expiresAt = moment().add(authResult.expiresIn,'second');

    localStorage.setItem('id_token', authResult.token.toString());
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
}          

logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem('username');
    localStorage.removeItem('fullname');
    localStorage.removeItem('iduser');
    this.isLoggedIn();
}

public isLoggedIn() {
  this.loggedin.next(moment().isBefore(this.getExpiration()));
    return moment().isBefore(this.getExpiration());
}

isLoggedOut() {
  this.loggedin.next(this.isLoggedIn()); 
    return !this.isLoggedIn();
}

getExpiration() {
    const expiration = localStorage.getItem("expires_at") ;
    const expiresAt = JSON.parse(expiration ==null ? "0" : expiration);
    return moment(expiresAt);
}  




}
