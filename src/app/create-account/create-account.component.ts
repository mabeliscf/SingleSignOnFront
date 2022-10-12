import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup,FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterDTO } from '../Models/request/RegisterDTO';
import { Tenant } from '../Models/Tenant';
import { HttpServiceService } from '../Service/http-service.service';
import { Validators } from '@angular/forms';
import { validateToken } from '@okta/okta-auth-js';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  CreateAccountForm = this.fb.group({

    username: ['', Validators.required],
    fullname : ['' , Validators.required],
    phone: ['' , Validators.required],
    email: ['' , Validators.required],
    password:['' , Validators.required],
    passwordRepeat: ['' , Validators.required],

  });

  constructor(private fb : FormBuilder, private router: Router, private service : HttpServiceService) { }

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

    console.log(this.CreateAccountForm);
    //once created give access to welcome page 
    this.router.navigateByUrl("welcome", {skipLocationChange:false});
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
}


