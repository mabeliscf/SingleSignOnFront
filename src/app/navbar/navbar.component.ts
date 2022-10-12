import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth, { AuthState } from '@okta/okta-auth-js';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { OktaUserinfo } from '../Models/response/OktaUserinfo';
import { UserLogged } from '../Models/response/UserLogged';
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
  user : UserLogged={username: '', fullName: "", expiresIn:0, token:"", id:0} ;


  constructor(private auth : AuthService, private service : HttpServiceService, private router:Router, private _oktaStateService: OktaAuthStateService, 
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



}
