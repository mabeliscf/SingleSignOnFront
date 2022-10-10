import { Component, Inject, OnInit } from '@angular/core';
import { HttpServiceService } from '../Service/http-service.service';
import { Router } from '@angular/router';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth, { AuthState } from '@okta/okta-auth-js';
import {  Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { login } from '../Models/login';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public isAuthenticated$!: Observable<boolean>;

  
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

  public async signOut(): Promise<void> {
    await this._oktaAuth.signOut();
  }

  getlogin(): void{
    //=  {userName:"rcorniel"; password:"strongpassword";}   ;
    let login1 : login={userName:"rcorniel", password:"strongpassword"};
// login1.userName="rcorniel";
// login1.password="strongpassword";
    this.service.loginlocal(login1).subscribe(data => console.log(data));
    //validate login 
    // this._router.navigateByUrl("welcome", {skipLocationChange:false});
    // this.service.sharedAccess.username="test1";
  }
  ShowGoogleLogin(){
    //show login page of company selected
    //once created give access to welcome page 
    
  }
  CreateAccount(){
    //call create form 
    this._router.navigateByUrl("create", {skipLocationChange:false});
  }
}
