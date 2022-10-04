import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../Service/http-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private service : HttpServiceService, private router: Router) { 

    this.service.login$.subscribe(a=> console.log(a));

  }

  ngOnInit(): void {
  }


  login(){
    this.router.navigateByUrl("welcome", {skipLocationChange:false});
    this.service.sharedAccess.username="test1";
  }
  ShowGoogleLogin(){
    //once created give access to welcome page 
    
  }
  CreateAccount(){
    this.router.navigateByUrl("create", {skipLocationChange:false});
  }
}
