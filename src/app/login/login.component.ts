import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { HttpServiceService } from '../Service/http-service.service';
import { Router } from '@angular/router';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth, { AuthState } from '@okta/okta-auth-js';
import {  Observable, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import {  LoginDTO } from '../Models/request/LoginDTO';
import { UserLogged } from '../Models/response/UserLogged';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public isAuthenticated$!: Observable<boolean>;
  

  login1 : LoginDTO={userName:"", password:""};

  logindata ? : Subscription;

  
  constructor(private service : HttpServiceService, private _router: Router, 
    private _oktaStateService: OktaAuthStateService, 
    @Inject(OKTA_AUTH) private _oktaAuth: OktaAuth) { 

    this.service.login$.subscribe(a=> console.log(a));

  }

  ngOnInit(): void {

    this.isAuthenticated$ = this._oktaStateService.authState$.pipe(
      filter((s: AuthState) => !!s),
      map((s: AuthState) => s.isAuthenticated ?? false)
    );

  }

  public async signinOkta() : Promise<void> {
    await this._oktaAuth.signInWithRedirect().then(
       _ => this._router.navigate(['/welcome'])
   
    );
  }

  public async signOutOkta(): Promise<void> {
    await this._oktaAuth.signOut().then(_ => this._router.navigate(['/login']));
  }

   getlogin(){
  
    this.service.loginlocal(this.login1);
      this.service.login$.subscribe(a=> {console.log(a) ; 
      if(a!= undefined){
      //validate login 
      this._router.navigate(['/welcome']);
       
      }

    });
    
  }

  CreateAccount(){
    //call create form 
    this._router.navigateByUrl("create", {skipLocationChange:false});
  }

  // ngOnDestroy(): void{
  //   if(this.logindata){
  //     this.logindata.unsubscribe();

  //   }

  // }
}
