import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup,FormBuilder, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterDTO } from '../Models/request/RegisterDTO';
import { Tenant } from '../Models/Tenant';
import { HttpServiceService } from '../Service/http-service.service';
import { Validators } from '@angular/forms';
import {NgbAlertConfig} from '@ng-bootstrap/ng-bootstrap';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  public isCreated: boolean =false;
  public isError : boolean =false;
  public errorMessage : string ="";

  password = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.pattern(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
    ),
  ]);
  passwordRepeat = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.pattern( /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/  ),
  ]);

  phone = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.pattern(/[0-9\+\-\ ]/), Validators.minLength(10), Validators.maxLength(10)
  ]);
  email = new FormControl(null, [
    (c: AbstractControl)=> Validators.required(c),
    Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")

  ]);
  name = new FormControl(null, [
    (c: AbstractControl)=> Validators.required(c)]);

lastname = new FormControl(null, [
      (c: AbstractControl)=> Validators.required(c)]);
    
  CreateAccountForm = this.fb.group({

    name: this.name,
    lastname : this.lastname,
    phone: this.phone,
    email: this.email,
    password:this.password ,
    passwordRepeat: this.passwordRepeat ,
  },{
    validator: this.ConfirmedValidator("password","passwordRepeat")
  }
  );

  constructor( private alertConfig: NgbAlertConfig , private fb : FormBuilder, private router: Router, private service : HttpServiceService) { }

  ngOnInit(): void {  }

  CreateUser(){

    ///create user local and in okta 
    let register : RegisterDTO ={ 
      firstName: this.CreateAccountForm.controls["name"].value,
      lastname:this.CreateAccountForm.controls["lastname"].value,
      email: this.CreateAccountForm.controls["email"].value,
      username: this.CreateAccountForm.controls["email"].value, //login or username
      phone: this.CreateAccountForm.controls["phone"].value,
      password: this.CreateAccountForm.controls["password"].value,
      logintype : 0,
      isAdmin :true,
      isTenant :false,
      isUser :false};

      console.log(register);

      //request to create user 
      this.service.registerUser(register)
      .pipe( catchError( e=> throwError( this.HandleError(e.error)) ))
      .subscribe((data: Tenant)=> {
        console.log(data);
        if(data!=null && data.username == register.username){
          //once created give access to welcome page 
          //user created, ask to go login 
          this.isCreated=true;
          this.alertConfig.type="success";
          
          this.alertConfig.dismissible=false;
        }else {
         this.HandleError("Error Creating user");
        }
      });
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmedValidator
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  HandleError(error: string){
    this.isCreated=false;
    this.isError= true;
    this.errorMessage = error
    this.alertConfig.type="danger"
    this.alertConfig.dismissible=true;

  }
}


