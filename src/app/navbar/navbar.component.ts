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
  public name$!: Observable<string>;
  public isError : boolean =false;
  public errorMessage : string ="";
  public space :string ="";

  public user : UserLogged={username: '', fullName: "", expiresIn:0, token:"", id:0} ;

  public userData: UsersInfo= {
    idTenantFather: 0,
    roles: [],
    databases: [],
    id: 0,
    firstName : "" ,
    lastName : "",
    isTenant:true,
    isUser:false,
    loginType:1,
    tenantFather:0,
    email: '',
    phone: '',
    username: '',
    isAdmin: false
  };

  constructor( private alertConfig: NgbAlertConfig , private auth : AuthService, private service : HttpServiceService, private router:Router, private _oktaStateService: OktaAuthStateService, 
    @Inject(OKTA_AUTH) private _oktaAuth: OktaAuth ,private _oktaAuthStateService: OktaAuthStateService) { }



  ngOnInit(): void {
      //validate if user is  save in local storage and save it
      this.isLoggedIn$ = this.auth.isUserLoggedIn;

       //TODO get id from claims
       this.name$ = this._oktaAuthStateService.authState$.pipe(
        filter((authState: AuthState) => !!authState && !!authState.isAuthenticated),
        map((authState: AuthState) => authState.idToken?.claims.name ?? '')
      );
   
      //verify if user is auntheticated
      this.isAuthenticated$ = this._oktaStateService.authState$.pipe(
        filter((s: AuthState) => !!s),
        map((s: AuthState) => s.isAuthenticated ?? false)
      );

    //validate if login was with okta and create localstorge with login
    if(this.isAuthenticated$ && !this.isLoggedIn$){

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
    }
    
    //load user data from local storage 
    if(this.isLoggedIn$ ){
      //get id from local storage
      this.userData.id = Number(localStorage.getItem("iduser")?.toString() ) ;
     
  
      ///get data of user, to show in navbar 
      this.service.getUserbyID(this.userData.id)
      .pipe( catchError( e=> throwError( this.HandleError(e.error)) ))
      .subscribe((data: UsersInfo)=> {console.log(data); 
        
        //todo get space name no id 
        this.userData=data;
        if(data.isAdmin){
          this.space= "Admin";
        }else {
          this.space= "Space--> " + this.userData.tenantFather;

        }
      
      });

    }
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
    
    this.isError= false;
    this.errorMessage = error
    this.alertConfig.type="danger"
    this.alertConfig.dismissible=true;
  }



}
