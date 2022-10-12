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

    this.name$ = this._oktaAuthStateService.authState$.pipe(
      filter((authState: AuthState) => !!authState && !!authState.isAuthenticated),
      map((authState: AuthState) => authState.idToken?.claims.name ?? '')
    );

    console.log(this.name$);

    //  //get user info from local db
    // if(this.name$!=undefined){

    //   //get okta user info 
    //   this.service.getOktaUserInfo().subscribe((data : OktaUserinfo)=> console.log(data));

      this.service.getUserToken(7)
        .subscribe(a => {
          if (a != undefined) {
            console.log("sso -->" + a.token);
            //save login and token 
            this.auth.login(a);
          }
        });
   //  }
  }

  ngAfterViewInit(): void {

    //show roles have access
    this.roles.push({ idRole: 1, roleDescription: "ROL 1",  roleFather: 0 });
    this.roles.push({ idRole: 2, roleDescription: "ROL 2",  roleFather: 0 });
    this.roles.push({ idRole: 3, roleDescription: "ROL 3",  roleFather: 0 });

    //si es administrador 
    this.service.getAllTenants().subscribe((data: TenantInfo[]) => {console.log(data); this.tenantinfo = { ...data }});
  }


}
