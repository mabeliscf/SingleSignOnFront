import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RoleDTO } from '../Models/request/RoleDTO';
import { Roles } from '../Models/response/Roles';
import { HttpServiceService } from '../Service/http-service.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {


  roles: Roles[] | undefined;
  role : Roles ={idRole:0, roleDescription:"", roleFather:0};
  resetFormSubject1: Subject<boolean> = new Subject<boolean>();

  public showAlert: boolean =false;
  public message:string="";
  public isError : boolean =false;
  public action : string ="";

  public idRole: number=0;


  roleDescription = new FormControl(null, [ (c: AbstractControl)=> Validators.required(c)]);
  
  CreateRoleFrom = this.fb.group({
    roleDescription:this.roleDescription,
    //roleFather: this.roleFather
  });
 

  constructor(private alertConfig: NgbAlertConfig , private fb : FormBuilder, private router: Router, private service : HttpServiceService) { }

  ngOnInit(): void {

    this.action="Create";
  }


  CreateRoles(){

    let role : RoleDTO= {
      roleDescription: this.CreateRoleFrom.controls["roleDescription"].value,
      idRole:this.role.idRole,
      roleFather: this.role.roleFather
    }

    if(this.role.idRole!=0){
      //update 
      this.service.updateRole(role)
      .pipe(catchError(e=> throwError( this.error( e.error)  )))
      .subscribe((result: Boolean) => {console.log(result)
        if(result){
          this.showAlert=true;
          this.success(this.action + " sucessfull");
          this.clearform();
          this.resetChildForm1();

        }
      });

    }else {
      this.service.createRole(role)
      .pipe(catchError(e=> throwError( this.error( e.error)  )))
      .subscribe((result: number)=> {
        if(result>0){
          this.showAlert=true;
          this.success(this.action + " sucessfull");
          //clean forms 
          this.clearform();
          this.resetChildForm1();
        }
      });
    }
  }


  updateRoleRequest(roles: RoleDTO){
    this.action="Update";
    console.log(roles);
    this.role= roles;
    //load to form
     this.CreateRoleFrom.controls["roleDescription"].setValue(this.role.roleDescription);
  }

  deleteRoleRequest(roles: RoleDTO){
    console.log(roles);
    this.service.deleteRole(roles)
    .pipe(catchError(e=> throwError( this.error( e.error)  )))
    .subscribe((data: boolean)=> {
        this.success("Delete sucessfull");
    });
  }


  clearform(){
    this.action="Create";
    this.CreateRoleFrom.reset();
    this.role= {idRole:0, roleDescription:"", roleFather:0};


  }

  success(message:string){
        this.alertConfig.type="success";
        this.message = message;
        this.alertConfig.dismissible= false;
        //refresh table 
        this.ngOnInit();
  }

  error(error:string){
    this.alertConfig.type="danger";
    this.message = error;
    this.alertConfig.dismissible= false;
  }

resetChildForm1(){
   this.resetFormSubject1.next(true);
}
}
