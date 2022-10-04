import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { skipPartiallyEmittedExpressions } from 'typescript';
import { HttpServiceService } from '../Service/http-service.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  constructor(private router: Router, private service : HttpServiceService) { }

  ngOnInit(): void {
  }

  CreateUser(){

    //once created give access to welcome page 
    this.router.navigateByUrl("welcome", {skipLocationChange:false});
    this.service.sharedAccess.username="test1";
  }

}
