import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { register } from '@okta/okta-auth-js';
import { cleanOAuthResponseFromUrl } from '@okta/okta-auth-js/types/lib/oidc/parseFromUrl';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DbAccess } from '../Models/DbAccess';
import { RegisterDTO } from '../Models/request/RegisterDTO';
import { RegisterUserDTO } from '../Models/request/RegisterUserDTO';
import { Database } from '../Models/response/Database';
import { GlobalResponse } from '../Models/response/GlobalResponse';
import { Roles } from '../Models/response/Roles';
import { TenantInfo } from '../Models/response/TenantInfo';
import { Tenant } from '../Models/Tenant';
import { TenantRole } from '../Models/TenantRole';
import { HttpServiceService } from '../Service/http-service.service';
import { COUNTRIES } from '../TableDB/Country';
import { ROLES } from '../TableRoles/ROLES';
import { TENANTINFOTEST } from './TENANTINFOTEST';

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
  public action : string ="";

   
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
    idTenantFather: [0]

  },{
    validator: this.ConfirmedValidator("password","passwordRepeat")
  }
  );


  constructor( private alertConfig: NgbAlertConfig , private fb : FormBuilder, private router: Router, private service : HttpServiceService) { }

  ngOnInit(): void { 
      

    this.action="Create";
    
    // //get all get Al DB
    // this.service.getAllDB().subscribe((data: Database[]) => {console.log(data); this.databasesData= {
    //   ...data

    // }});

    // //get all Roles
    // this.service.getAllRole().subscribe((data: Roles[]) => {console.log(data); this.rolesData= {
    //   ...data

    // }});

    // //Get Al tenants
    // this.service.getAllTenants()
    // .pipe(catchError(e=> throwError( this.HandleError( e.error)  )))
    // .subscribe((data: TenantInfo[])=> {console.log(data);   this.tenantsData =data; });


    this.rolesData = ROLES;
    this.databasesData = COUNTRIES;
    this.tenantsData= TENANTINFOTEST; 


   }

 
   //select user 
   userSelected(){
      this.isUserSelected=true;
      this.RegisterUserForm.controls["isTenant"].reset();
   }

   //select tenant 
   tenantSelected(){
    this.isUserSelected=false;
    this.RegisterUserForm.controls["isUser"].reset();
  }
  //login type 
  changeLogintype(select: any)
  {
      this.RegisterUserForm.controls["loginType"].setValue(select.target.selectedOptions[0].index);
  }

  selectTenant(select : any){
    this.RegisterUserForm.controls["idTenantFather"].setValue( this.tenantsData?.find(a=> a.fullname==select.target.selectedOptions[0].text)?.id);
  }
  //select database
  changeDB(select: any)
  {
     this.RegisterUserForm.controls["database"].setValue( this.databasesData?.find(a=> a.dbName==select.target.selectedOptions[0].text)?.idDb);
  }
   //select roles
   changeRole(select: any)
   {
      this.RegisterUserForm.controls["roles"].setValue( this.rolesData?.find(a=> a.roleDescription==select.target.selectedOptions[0].text)?.idRole);
   }


  RegisterUser(){
    console.log(this.RegisterUserForm);
  
    //get db ids
    let getDB:  DbAccess[] =[];
     //get roles and load to model 
     let getrole : TenantRole[]=[];
    
    if(this.isUserSelected){

      let asignDatabases : Database[] | undefined = this.tenantsData?.find(a=> a.id== this.RegisterUserForm.controls["idTenantFather"].value)?.database;
      //asignar id de db a user
      asignDatabases?.forEach(obj => {
        getDB.push({ idDB: obj.idDb, idDbAccess:0, idTenant:this.RegisterUserForm.controls["idTenantFather"].value});
      });

      //assgin roles
      getrole.push({idTenant:this.RegisterUserForm.controls["idTenantFather"].value, idRole:  this.RegisterUserForm.controls["roles"].value ,idTenantRole:0});

    }
    if(!this.isUserSelected){
      
      getDB?.push({idDB: this.RegisterUserForm.controls["database"].value, idDbAccess: 0, idTenant:0});
      //assgin roles
      getrole.push({idTenant:0, idRole:  this.RegisterUserForm.controls["roles"].value ,idTenantRole:0});

    }
    
    let register : RegisterUserDTO ={ 
      firstName: this.RegisterUserForm.controls["name"].value,
      lastname:this.RegisterUserForm.controls["lastname"].value,
      email: this.RegisterUserForm.controls["email"].value,
      username: this.RegisterUserForm.controls["email"].value, //login or username
      phone: this.RegisterUserForm.controls["phone"].value,
      password: this.RegisterUserForm.controls["password"].value,
      logintype :this.RegisterUserForm.controls["loginType"].value,
      isAdmin :false,
      isTenant :!this.isUserSelected,
      isUser :this.isUserSelected,
      databases :getDB,
      roles :getrole,
      idTenantFather :this.RegisterUserForm.controls["idTenantFather"].value,
    };

    console.log(register);
    return register;
  }

   //TODO create model and create update model 
  CreateUser(){
      let dataRequest =  this.RegisterUser();

      //request to create user 
      this.service.registerUser(dataRequest)
      .pipe( catchError( e=> throwError( this.HandleError(e.error)) ))
      .subscribe((data: Tenant)=> {
        console.log(data);
        if(data!=null && data.username == dataRequest.username){
          //once created give access to welcome page 
          //user created, ask to go login 
          this.isCreated=true;
          this.alertConfig.type="success";
          this.alertConfig.dismissible=false;
          this.clearform();
        }else {
         this.HandleError("Error Creating user");
        }
      });
  }

  clearform(){
    this.isError=false;
    this.isCreated= false;
    this.RegisterUserForm.reset();
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

