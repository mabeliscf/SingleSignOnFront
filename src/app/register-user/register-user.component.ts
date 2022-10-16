import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { isJSDocThisTag } from 'typescript';
import { DbAccess } from '../Models/DbAccess';
import { RegisterUserDTO } from '../Models/request/RegisterUserDTO';
import { Database } from '../Models/response/Database';
import { GlobalResponse } from '../Models/response/GlobalResponse';
import { Roles } from '../Models/response/Roles';
import { TenantInfo } from '../Models/response/TenantInfo';
import { TenantRole } from '../Models/TenantRole';
import { HttpServiceService } from '../Service/http-service.service';
import { UserService } from '../Service/user.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit, AfterViewInit {
  
  public isCreated: boolean =false;
  public isError : boolean =false;
  public errorMessage : string ="";
  public isUserSelected: boolean=false;
  public action : string ="";

   
  response : GlobalResponse = { response:"", responseNumber:0}
  rolesData: Roles[] | undefined;
  databasesData: Database[] | undefined;
  tenantsData: TenantInfo[] | undefined;
  tenantUpdate : TenantInfo| undefined;
  

  @ViewChild('tenant', { static: false }) tenantRadio: ElementRef | undefined;
  
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


  constructor(private userService : UserService, private alertConfig: NgbAlertConfig , private fb : FormBuilder, private router: Router, private service : HttpServiceService) { }

  ngOnInit(): void { 
      

    this.action="Create";

    
    // //get all get Al DB
    this.service.getAllDB().toPromise().then((data: Database[]) => {console.log(data); this.databasesData= data});

    // //get all Roles
    this.service.getAllRole().toPromise().then((data: Roles[]) => {console.log(data); this.rolesData=data});

    // //Get Al tenants
    this.service.getAllTenants()
    .pipe(catchError(e=> throwError( this.HandleError( e.error,"error")  )))
    .subscribe((data: TenantInfo[])=> {console.log(data);   this.tenantsData =data; });



}

ngAfterViewInit(){

  
//verify is is a update 
this.userService.selectedUserUpdate$.subscribe((data: any)=> {console.log(data); this.tenantUpdate= data;
  if(data.id!=0){
    this.action="Update";
    //fill form with data to update
    this.RegisterUserForm.controls["name"].setValue(this.tenantUpdate?.firstName );
    this.RegisterUserForm.controls["lastname"].setValue(this.tenantUpdate?.lastName);
    this.RegisterUserForm.controls["phone"].setValue(this.tenantUpdate?.phone);
    this.RegisterUserForm.controls["email"].setValue(this.tenantUpdate?.email);
    this.RegisterUserForm.controls["password"].setValue("");
    this.RegisterUserForm.controls["passwordRepeat"].setValue("");
    this.RegisterUserForm.controls["loginType"].setValue(this.tenantUpdate?.loginType);
    this.RegisterUserForm.controls["isTenant"].setValue(this.tenantUpdate?.isTenant ==true ? "tenant" : "");
    this.RegisterUserForm.controls["isUser"].setValue(this.tenantUpdate?.isUser == true ? "user" : "");
    this.RegisterUserForm.controls["database"].setValue(this.tenantUpdate?.database ?  this.tenantUpdate?.database[0].idDb: 0);
    this.RegisterUserForm.controls["roles"].setValue(this.tenantUpdate?.roles ? this.tenantUpdate?.roles[0].idRole : 0);
    this.RegisterUserForm.controls["idTenantFather"].setValue(this.tenantUpdate?.tenantFather);
    this.isUserSelected=this.tenantUpdate?.isUser || false;
  }
});
   

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
    this.RegisterUserForm.controls["idTenantFather"].setValue( this.tenantsData?.find(a=> select.target.selectedOptions[0].text.includes(a.firstName) && select.target.selectedOptions[0].text.includes(a.lastName))?.id);
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
    let logintype:number=0;
    if(this.isUserSelected){

      let asignDatabases : Database[] | undefined = this.tenantsData?.find(a=> a.id== this.RegisterUserForm.controls["idTenantFather"].value)?.database;
      //asignar id de db a user
      asignDatabases?.forEach(obj => {
        getDB.push({ idDB: obj.idDb, idDbAccess:0, idTenant:this.RegisterUserForm.controls["idTenantFather"].value});
      });

      //assgin roles
      getrole.push({idTenant:this.tenantUpdate?.id || 0, idRole:  this.RegisterUserForm.controls["roles"].value ,idTenantRole:0});

      logintype = this.tenantsData?.find(a=> this.RegisterUserForm.controls["idTenantFather"].value==a.id)?.loginType || 0;
    }
    if(!this.isUserSelected){
      
      getDB?.push({idDB: this.RegisterUserForm.controls["database"].value, idDbAccess: 0, idTenant:this.tenantUpdate?.id || 0});
      //assgin roles
      getrole.push({idTenant:this.tenantUpdate?.id || 0, idRole:  this.RegisterUserForm.controls["roles"].value ,idTenantRole:0});

      logintype=this.RegisterUserForm.controls["loginType"].value;
    }
    
    let register : RegisterUserDTO ={ 
      id: this.tenantUpdate?.id || 0,
      firstName: this.RegisterUserForm.controls["name"].value,
      lastname:this.RegisterUserForm.controls["lastname"].value,
      email: this.RegisterUserForm.controls["email"].value,
      username: this.RegisterUserForm.controls["email"].value, //login or username
      phone: this.RegisterUserForm.controls["phone"].value,
      password: this.RegisterUserForm.controls["password"].value,
      logintype :logintype,
      isAdmin :this.tenantUpdate?.isAdmin || false,
      isTenant :!this.isUserSelected,
      isUser :this.isUserSelected,
      databases :getDB,
      roles :getrole,
      idTenantFather :this.RegisterUserForm.controls["idTenantFather"].value,
    };

    console.log(register);
    //add to DB
    this.CreateUser(register);
    return register;
  }

   
  CreateUser( dataRequest: RegisterUserDTO){


      //request to create user or update 
      this.service.createUsers(dataRequest)
      .pipe( catchError( e=> throwError( this.HandleError(e.error,"error")) ))
      .subscribe((data: any)=> {
        console.log(data);
        if(data.responseNumber==1){
          //once created give access to welcome page 
          //user created, ask to go login 
         this.HandleError(data.response,'success');

         
          this.clearform();
        }else {
         this.HandleError("Error Creating user",'error');
        }
      });
  }

  clearform(){
    
    this.action="Create";
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

  HandleError(error: string, ype:string){
    this.isError= true;
    this.errorMessage = error;
    this.alertConfig.type=ype;
    this.alertConfig.dismissible=true;

  }

 
 
}

