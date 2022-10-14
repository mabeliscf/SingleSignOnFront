import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth, { AuthState } from '@okta/okta-auth-js';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { OktaUserinfo } from '../Models/response/OktaUserinfo';
import { UserLogged } from '../Models/response/UserLogged';
import { UsersInfo } from '../Models/response/UsersInfo';
import { AuthService } from '../Service/auth.service';
import { HttpServiceService } from '../Service/http-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLoggedIn$: Observable<boolean> | undefined;
  public isAuthenticated$!: Observable<boolean>;

  public isError : boolean =false;
  public errorMessage : string ="";

  public user : UserLogged={username: '', fullName: "", expiresIn:0, token:"", id:0} ;

  public userData: UsersInfo= {
    idTenantFather: 0,
    roles: [],
    databases: [],
    id: 0,
    fullname: '',
    email: '',
    phone: '',
    username: '',
    isAdmin: ''
  };

  constructor( private alertConfig: NgbAlertConfig , private auth : AuthService, private service : HttpServiceService, private router:Router, private _oktaStateService: OktaAuthStateService, 
    @Inject(OKTA_AUTH) private _oktaAuth: OktaAuth) { }



  ngOnInit(): void {
    this.isLoggedIn$ = this.auth.isUserLoggedIn;

    this.isAuthenticated$ = this._oktaStateService.authState$.pipe(
      filter((s: AuthState) => !!s),
      map((s: AuthState) => s.isAuthenticated ?? false)
    );
    if(this.isAuthenticated$ && !this.isLoggedIn$){

      this.service.getOktaUserInfo().subscribe((data : OktaUserinfo)=> {console.log(data); this.user.username= data.nickname; this.user.fullName= data.name; this.user.id= 7 });

      this.service.getUserToken(this.user.id)
        .subscribe(a => {
          if (a != undefined) {
           
            //save login and token 
            this.user.token= a.token;
            this.user.expiresIn= 111111111111111111111;
            console.log(this.user);
            this.auth.login(this.user);
          }
        });
    }

    ///get all roles 
    this.service.getUserbyID(3)
    .pipe( catchError( e=> throwError( this.HandleError(e.error)) ))
    .subscribe((data: UsersInfo)=> {console.log(data); this.userData=data});
  }


  async logout(){
    //validate if is local login or okta login 
    if(this.isAuthenticated$){
      await this._oktaAuth.signOut().then(_ => { this.auth.logout(); this.isLoggedIn$ = this.auth.isUserLoggedIn;});
    }else {
      this.auth.logout();
      this.isLoggedIn$ = this.auth.isUserLoggedIn;
    }

  }

  HandleError(error: string){
    
    this.isError= true;
    this.errorMessage = error
    this.alertConfig.type="danger"
    this.alertConfig.dismissible=true;
  }



}
