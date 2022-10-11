import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { HttpServiceService } from './Service/http-service.service';
import { environment } from 'src/environments/environment';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(@Inject(OKTA_AUTH) private _oktaAuth: OktaAuth, private service : HttpServiceService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(this.addAuthHeaderToAllowedOrigins(request));
  }

  private addAuthHeaderToAllowedOrigins(request: HttpRequest<unknown>): HttpRequest<unknown> {
    let req = request;
    const allowedOrigins = ['http://localhost'];
    const allowOktaorigin= environment.oktaBaseURL;
    //allow everything from same origin  it can be fix to allow a specific oring
    if (!!allowedOrigins.find(origin => request.url.includes(origin.split(":")[0]))) {
      //use jwt token to navigate
      const jwttoken = localStorage.getItem("id_token");
     
      const authToken = jwttoken==""?  this._oktaAuth.getAccessToken() :   jwttoken  ;

      //assign token if we have one
      if(authToken!=undefined){
        req = request.clone({ setHeaders: { 'Authorization': `Bearer ${authToken}` } });

      }
    }
      //add okta token to request
    if(request.url.includes(allowOktaorigin)){
      const oktaToken =this._oktaAuth.getAccessToken();
      req = request.clone({ setHeaders: { 'Authorization': `Bearer ${oktaToken}` } });
      console.log("okta login applied --> " + oktaToken);

    }

    return req;
  }

  
}
