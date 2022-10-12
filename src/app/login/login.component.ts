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
import { OktaUserinfo } from '../Models/response/OktaUserinfo';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public showCreateAccount: boolean=false;
  public isLoggedIn$: Observable<boolean> | undefined;
  public isAuthenticated$!: Observable<boolean>;
  public user : UserLogged={username: '', fullName: "", expiresIn:0, token:"", id:0} ;
  public name$!: Observable<string>;
  public ErrorLogin: string="";
  public isError: boolean=false;

  public login1 : LoginDTO={userName:"", password:""};

  public logindata ? : Subscription;

  
  constructor(private alertConfig: NgbAlertConfig , private service : HttpServiceService, private _router: Router, 
    private _oktaStateService: OktaAuthStateService, private _oktaAuthStateService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private _oktaAuth: OktaAuth, private auth : AuthService) { 

  }

   ngOnInit() {
    

    let aut : boolean=false;
    this.isLoggedIn$ = this.auth.isUserLoggedIn;
   
    this.isAuthenticated$ = this._oktaStateService.authState$.pipe(
      filter((s: AuthState) => !!s),
      map((s: AuthState) => { aut= s.isAuthenticated ?? false; return s.isAuthenticated ?? false;} )
    );
    this.name$ = this._oktaAuthStateService.authState$.pipe(
      filter((authState: AuthState) => !!authState && !!authState.isAuthenticated),
      map((authState: AuthState) => authState.idToken?.claims.name ?? '')
    );


    if(!aut){
      //validate data 
    
        this.service.getUserToken(7)
        .subscribe(a => {
          if (a != undefined) {
            //save login and token 
            this.user.token= a.token;
            this.user.expiresIn= 111111111111111111111;
            console.log(this.user);
            this.auth.login(this.user);
            this._router.navigate(['/z/welcome']);
          }
        });
    }

    //validate if theres any admin root 
    this.service.isAdminCreated().subscribe((data: boolean)=> this.showCreateAccount =data);
  }

  public async signinOkta() : Promise<void> {
    await this._oktaAuth.signInWithRedirect();
  }

  public  getlogin(){
     this.service.loginlocal(this.login1)
      .subscribe(a => {
        if (a != undefined && a != null) {
          //save login and token 
          this.auth.login(a);
        }else {
          //error login 
          this.alertConfig.type="warning";
          this.alertConfig.dismissible=false;
          this.isError= true;
          this.ErrorLogin= "Username or Password incorrect!";
        }
      });
  }

  CreateAccount(){
    //call create form 
    this._router.navigateByUrl("create", {skipLocationChange:false});
  }

  public async signOutOkta(): Promise<void> {
    await this._oktaAuth.signOut().then(_=>    {this._router.navigate(['/']); });
  }

  
}
