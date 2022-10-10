import { Inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import { HttpServiceService } from './http-service.service';

@Injectable({
  providedIn: 'root'
})


export class AuthService {

   jwttoken : string ="";
  constructor(@Inject(OKTA_AUTH) private _oktaAuth: OktaAuth, public jwtHelpar : JwtHelperService, private service : HttpServiceService) { 

    this.service.token$.subscribe(a=> {console.log(a); this.jwttoken=a;});
  }

  public isAuthenticated(): boolean{
      const token = this._oktaAuth.getAccessToken() ==undefined ? this.jwttoken  :  this._oktaAuth.getAccessToken();
      return !this.jwtHelpar.isTokenExpired(token);
  }
}
