import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public auth : AuthService, public router : Router) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
    return this.auth.isUserLoggedIn.pipe(
      take(1),
      map((isLoogedIn:boolean)=> {
        if(!isLoogedIn){
          this.router.navigate(["/login"]);
          return false;
        }
        return true;
      }));
    
  }


    
  
}
