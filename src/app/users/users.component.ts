import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Database } from '../Models/response/Database';
import { Roles } from '../Models/response/Roles';
import { TenantInfo } from '../Models/response/TenantInfo';
import { UsersInfo } from '../Models/response/UsersInfo';
import { TENANTINFOTEST } from '../register-user/TENANTINFOTEST';
import { HttpServiceService } from '../Service/http-service.service';
import { UserService } from '../Service/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {


  userinfo : UsersInfo={
    idTenantFather: 0,
    roles: [],
    databases: [],
    id: 0,
    fullname: '',
    email: '',
    phone: '',
    username: '',
    isAdmin: false
  };
  usersinfo: UsersInfo[]=[];
  roles: Roles[]=[];
  database: Database[]=[];

  tenantinfo :TenantInfo[]=[];

  constructor(private userSelected: UserService, private service : HttpServiceService, private router: Router) { }

  ngOnInit(): void {

    // //get by id 
    // let iduser: Number = 1;
    // this.service.getUserbyID(iduser).subscribe((data: UsersInfo) => {console.log(data); this.userinfo = {
    //   ...data

    // }});
 
    // this.service.getUsersbyTenant(iduser).subscribe((data: UsersInfo[]) => {console.log(data); this.usersinfo = {
    //   ...data

    // }});

    // //si es administrador 
    //this.service.getAllTenants().subscribe((data: TenantInfo[]) => {console.log(data); this.tenantinfo = {  ...data }});
   this.tenantinfo =  TENANTINFOTEST;
  }

  editUserRequest(data: TenantInfo){
    console.log(data);
    //send data to register page 
    this.userSelected.setUserUpdate(data);
    //go to register and edit user info 
    this.router.navigate(['/z/register']);


  }
  LoadRolesRowSelected(data: TenantInfo){
    console.log(data);
    this.roles=[];
    this.database=[];

    this.roles=data.roles;
    this.database=data.database;


  }
}
