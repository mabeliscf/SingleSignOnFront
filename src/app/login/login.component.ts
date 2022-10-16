import { Component, Inject,  OnInit } from '@angular/core';
import { HttpServiceService } from '../Service/http-service.service';
import { Router } from '@angular/router';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth, { AuthState } from '@okta/okta-auth-js';
import {  Observable, Subscription, throwError } from 'rxjs';
import { map, filter, catchError } from 'rxjs/operators';
import {  LoginDTO } from '../Models/request/LoginDTO';
import { UserLogged } from '../Models/response/UserLogged';
import { AuthService } from '../Service/auth.service';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { OktaUserinfo } from '../Models/response/OktaUserinfo';


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
       //validate if theres any admin root 
       this.service.isAdminCreated().toPromise().then((data: boolean)=> {
         this.showCreateAccount =data;
       });
       
       
       
       //validate if user is  save in local storage and save it
       this.isLoggedIn$ = this.auth.isUserLoggedIn;
      
       //get okta validation
       let autOkta : boolean=false;
       this.isAuthenticated$ = this._oktaStateService.authState$.pipe(
         filter((s: AuthState) => !!s),
         map((s: AuthState) => { autOkta= s.isAuthenticated ?? false; return s.isAuthenticated ?? false;} )
       );
      
   
       //check if user is logged in okta but no in local storage, go and save local storage
       if(autOkta ||  !this.isLoggedIn$ ){
        //get okta user id
        this.name$ = this._oktaAuthStateService.authState$.pipe(
          filter((authState: AuthState) => !!authState && !!authState.isAuthenticated),
          map((authState: AuthState) => authState.idToken?.claims.name ?? '')
        );
     
            //get data from db and generate a new token 
            this.service.getOktaUserInfo().subscribe((data : OktaUserinfo)=> {console.log(data); this.user.username= data.nickname; this.user.fullName= data.name; this.user.id= 7 });

            this.service.getUserToken(this.user.id)
              .subscribe(a => {
                if (a != undefined) {
                  //save login and token 
                  this.user.token= a.token;   this.user.expiresIn= a.expiresIn;  console.log(this.user);
                  //save user data in local storage 
                  this.auth.login(this.user);
                }
              });
      
         //redirect to welcome page 
         this._router.navigate(['/z/welcome']);
      }
}

  public async signinOkta() : Promise<void> {
    await this._oktaAuth.signInWithRedirect();
  }

  public  getlogin(){
      this.service.loginlocal(this.login1)
      .pipe( catchError( e=> throwError( this.errorLogin(e.error)) ))
      .subscribe(a => {
        if (a != undefined && a != null) {
          //save login and token 
          this.auth.login(a);
        }
      });
  }

  cleanError(){
    this.isError= false;
  }
  CreateAccount(){
    //call create form 
    this._router.navigateByUrl("create", {skipLocationChange:false});
  }

  public async signOutOkta(): Promise<void> {
    await this._oktaAuth.signOut().then(_=>    {this._router.navigate(['/']); });
  }

  errorLogin(error : string) {

      //error login 
      this.alertConfig.type="warning";
      this.alertConfig.dismissible=false;
      this.isError= true;
      this.ErrorLogin= error;
  }

  
}
