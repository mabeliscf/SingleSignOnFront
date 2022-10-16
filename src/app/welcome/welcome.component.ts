import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { Roles } from '../Models/response/Roles';
import { HttpServiceService } from '../Service/http-service.service';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import {  Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import OktaAuth, { AuthState } from '@okta/okta-auth-js';
import { TenantInfo } from '../Models/response/TenantInfo';
import { AuthService } from '../Service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, AfterViewInit {

  isLoggedIn$: Observable<boolean> | undefined;
  public name$!: Observable<string>;


   public userlogin :string ="";

   public roles: Roles[] = [];

   tenantinfo :TenantInfo[]=[];
  constructor(private service : HttpServiceService,private _oktaAuthStateService: OktaAuthStateService,
              private auth : AuthService,  @Inject(OKTA_AUTH) private _oktaAuth: OktaAuth, private router: Router
    ) {

   }

  async ngOnInit(): Promise<void> {
    this.isLoggedIn$ = this.auth.isUserLoggedIn;

    // this.name$ = this._oktaAuthStateService.authState$.pipe(
    //   filter((authState: AuthState) => !!authState && !!authState.isAuthenticated),
    //   map((authState: AuthState) => authState.idToken?.claims.name ?? '')
    // );

    // console.log(this.name$);

    //   this.service.getUserToken(7)
    //     .subscribe(a => {
    //       if (a != undefined) {
    //         console.log("sso -->" + a.token);
    //         //save login and token 
    //         this.auth.login(a);
    //       }
    //     });
   
  }

  ngAfterViewInit(): void {

  }


}
