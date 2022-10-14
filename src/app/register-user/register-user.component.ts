import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RegisterDTO } from '../Models/request/RegisterDTO';
import { RegisterUserDTO } from '../Models/request/RegisterUserDTO';
import { Database } from '../Models/response/Database';
import { GlobalResponse } from '../Models/response/GlobalResponse';
import { Roles } from '../Models/response/Roles';
import { TenantInfo } from '../Models/response/TenantInfo';
import { Tenant } from '../Models/Tenant';
import { HttpServiceService } from '../Service/http-service.service';
import { COUNTRIES } from '../TableDB/Country';
import { ROLES } from '../TableRoles/ROLES';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {
  
  public isCreated: boolean =false;
  public isError : boolean =false;
  public errorMessage : string ="";
  public isUserSelected: boolean=false;

   
  response : GlobalResponse = { response:"", responseNumber:0}
  rolesData: Roles[] | undefined;
  databasesData: Database[] | undefined;
  tenantsData: TenantInfo[] | undefined;
  


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

  
  RegisterUserForm = this.fb.group({

    name: this.name,
    lastname : this.lastname,
    phone: this.phone,
    email: this.email, //equals username
    password:this.password ,
    passwordRepeat: this.passwordRepeat ,
    loginType :  [0],
    isTenant: [null],
    isUser: [null],
    database :[0],
    roles : [0],
    idTenantFather: [null]

  },{
    validator: this.ConfirmedValidator("password","passwordRepeat")
  }
  );


  constructor( private alertConfig: NgbAlertConfig , private fb : FormBuilder, private router: Router, private service : HttpServiceService) { }

  ngOnInit(): void { 
    
    // // TODO document why this method 'ngOnInit' is empty
    // this.service.createUsers(this.register).subscribe((data: GlobalResponse) => {console.log(data); this.response= {
    //   ...data

    // }});

    //get all get Al DB
    this.service.getAllDB().subscribe((data: Database[]) => {console.log(data); this.databasesData= {
      ...data

    }});

    //get all Roles
    this.service.getAllRole().subscribe((data: Roles[]) => {console.log(data); this.rolesData= {
      ...data

    }});

    //Get Al tenants
    this.service.getAllTenants()
    .pipe(catchError(e=> throwError( this.HandleError( e.error)  )))
    .subscribe((data: TenantInfo[])=> {console.log(data);   this.tenantsData =data; });


    this.rolesData = ROLES;
    this.databasesData = COUNTRIES;
   // this.tenantsData=null; //TODO: load tenat data


   }

  //TODO: handle radio button and change status
   //show list of tenant 
   userSelected(){

      this.isUserSelected=true;
 
      this.RegisterUserForm.controls["isTenant"].reset();
   }

   tenantSelected(){
    this.isUserSelected=false;
    this.RegisterUserForm.controls["isUser"].reset();

   }

   showRoles(select: any){
    //TODO: show one role or the other
    this.RegisterUserForm.controls["idTenantFather"].setValue(select.target.selectedOptions[0].index);
    console.log(this.tenantsData?.filter(a=> a.id== select.target.selectedOptions[0].index));

   }

 //login type 
 changeLogintype(select: any)
 {
    this.RegisterUserForm.controls["loginType"].setValue(select.target.selectedOptions[0].index);
 }
  //login type 
  changeDB(select: any)
  {
     this.RegisterUserForm.controls["database"].setValue( this.databasesData?.find(a=> a.dbName==select.target.selectedOptions[0].text)?.idDb);
  }
   //login type 
   changeRole(select: any)
   {
      this.RegisterUserForm.controls["roles"].setValue( this.rolesData?.find(a=> a.roleDescription==select.target.selectedOptions[0].text)?.idRole);
   }


   RegisterUser(){
    console.log(this.RegisterUserForm);
   }

   //TODO create model and create update model 
  CreateUser(){

  //   // typeLogin :typeLogin | undefined;
  // register : RegisterUserDTO ={
  //   firstName: '',
  //   lastname: '',
  //   username: "",
  //   phone: "",
  //   email: "",
  //   password: "",
  //   logintype: 0,
  //   isAdmin: false,
  //   isTenant: false,
  //   isUser: false,
  //   databases: [],
  //   roles: [],
  //   idTenantFather: 0,
  
  // };


    ///create user local and in okta 
    let register : RegisterDTO ={ 
      firstName: this.RegisterUserForm.controls["name"].value,
      lastname:this.RegisterUserForm.controls["lastname"].value,
      email: this.RegisterUserForm.controls["email"].value,
      username: this.RegisterUserForm.controls["email"].value, //login or username
      phone: this.RegisterUserForm.controls["phone"].value,
      password: this.RegisterUserForm.controls["password"].value,
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

