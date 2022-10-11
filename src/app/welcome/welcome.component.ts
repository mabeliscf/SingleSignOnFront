import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Roles } from '../Models/response/Roles';
import { HttpServiceService } from '../Service/http-service.service';
import { OktaAuthStateService } from '@okta/okta-angular';
import {  Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { AuthState } from '@okta/okta-auth-js';
import { Database } from '../Models/response/Database';
import { TenantInfo } from '../Models/response/TenantInfo';
import { UserLogged } from '../Models/response/UserLogged';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, AfterViewInit {


  public name$!: Observable<string>;


   public userlogin :string ="";

   public roles: Roles[] = [];

   tenantinfo :TenantInfo[]=[];
  constructor(private service : HttpServiceService,private _oktaAuthStateService: OktaAuthStateService) {

   }

  async ngOnInit(): Promise<void> {
    this.name$ = this._oktaAuthStateService.authState$.pipe(
      filter((authState: AuthState) => !!authState && !!authState.isAuthenticated),
      map((authState: AuthState) => authState.idToken?.claims.name ?? '')
    );

       //get user info from api 
       await this.service.getUserToken(7).subscribe((data: UserLogged)=>{  console.log(data);});
  }

  ngAfterViewInit(): void {
         //show login user name
    this.userlogin = this.service.sharedAccess.username;

    //show roles have access
    this.roles.push({ idRole: 1, roleDescription: "ROL 1",  roleFather: 0 });
    this.roles.push({ idRole: 2, roleDescription: "ROL 2",  roleFather: 0 });
    this.roles.push({ idRole: 3, roleDescription: "ROL 3",  roleFather: 0 });

    
 //si es administrador 
 this.service.getAllTenants().subscribe((data: TenantInfo[]) => {console.log(data); this.tenantinfo = {
  ...data

}});
  }


}
