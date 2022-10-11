import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { HttpServiceService } from '../Service/http-service.service';
import { Router } from '@angular/router';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth, { AuthState } from '@okta/okta-auth-js';
import {  Observable, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import {  LoginDTO } from '../Models/request/LoginDTO';
import { UserLogged } from '../Models/response/UserLogged';
import { AuthService } from '../Service/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoggedIn$: Observable<boolean> | undefined;
  public isAuthenticated$!: Observable<boolean>;

  login1 : LoginDTO={userName:"", password:""};
  user : UserLogged={username: '', fullName: "", expiresIn:0, token:"", id:0} ;

  logindata ? : Subscription;

  
  constructor(private service : HttpServiceService, private _router: Router, 
    private _oktaStateService: OktaAuthStateService, 
    @Inject(OKTA_AUTH) private _oktaAuth: OktaAuth, private auth : AuthService) { 

  }

  ngOnInit(): void {
   
    this.user= {username: 'dd', fullName: "ddd", expiresIn:11, token:"dd", id:1 };
    //this.auth.login(this.user);

    this.isAuthenticated$ = this._oktaStateService.authState$.pipe(
      filter((s: AuthState) => !!s),
      map((s: AuthState) => s.isAuthenticated ?? false)
    );

  }

  public async signinOkta() : Promise<void> {
    
    await this._oktaAuth.signInWithRedirect();
  }


  public  getlogin(){
     this.service.loginlocal(this.login1)
      .subscribe(a => {
        if (a != undefined && a != null) {
          console.log("loginlocal -->" + a.token);
          //save login and token 
          this.auth.login(a);
          this._router.navigate(['/welcome']);
        }
      });
  }

  CreateAccount(){
    //call create form 
    this._router.navigateByUrl("create", {skipLocationChange:false});
  }

  public async signOutOkta(): Promise<void> {
    await this._oktaAuth.signOut().then(_ => this._router.navigate(['/login']));
  }

  // ngOnDestroy(): void{
  //   if(this.logindata){
  //     this.logindata.unsubscribe();

  //   }

  // }
}
