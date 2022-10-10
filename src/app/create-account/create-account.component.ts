import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { skipPartiallyEmittedExpressions } from 'typescript';
import { RegisterDTO } from '../Models/request/RegisterDTO';
import { Tenant } from '../Models/Tenant';
import { HttpServiceService } from '../Service/http-service.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  constructor(private router: Router, private service : HttpServiceService) { }

  register : RegisterDTO ={ username: "",
    fullname: "",
    phone: "",
    email: "",
    password: "",
    logintype : 0,
    isAdmin :false,
    isTenant :false,
    isUser :false};

  user : Tenant = { idTenant : 0,
    fullName : "",
    email : "" ,
    phone : "",
    username: ""  };


  ngOnInit(): void {

    this.service.registerUser(this.register).subscribe((data: Tenant) => {console.log(data); this.user= {
      ...data

    }});
  }

  CreateUser(){

    //once created give access to welcome page 
    this.router.navigateByUrl("welcome", {skipLocationChange:false});
    this.service.sharedAccess.username="test1";
  }

}
