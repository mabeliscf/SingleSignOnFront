import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterModule, RouterStateSnapshot, UrlTree } from '@angular/router';
import { OktaAuthStateService } from '@okta/okta-angular';
import { AuthState } from '@okta/okta-auth-js';

import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {




  constructor(public auth : AuthService, public router : Router,  private _oktaStateService: OktaAuthStateService, ) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{

    return  this.auth.isUserLoggedIn.pipe(
      take(1),
      map((isLoogedIn:boolean)=> {
        let  local=isLoogedIn;
        let okta : boolean =false ;
        this._oktaStateService.authState$.pipe(
          filter((s: AuthState) => !!s),
          map((s: AuthState) => okta= s.isAuthenticated ?? false )
            );

            if(!okta && !local &&  !window.location.href.includes("/login/callback")  && !window.location.href.includes("/?code")){
              console.log(okta +  "vs" + local)
              this.router.navigate(["/login"]);
              return false;
            }
            return true;
      }
      ) )

     
    
  }


    
  
}
