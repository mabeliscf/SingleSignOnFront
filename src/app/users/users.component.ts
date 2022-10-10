import { Component, OnInit } from '@angular/core';
import { TenantInfo } from '../Models/response/TenantInfo';
import { UsersInfo } from '../Models/response/UsersInfo';
import { HttpServiceService } from '../Service/http-service.service';

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
    isAdmin: ''
  };
  usersinfo: UsersInfo[]=[];

  tenantinfo :TenantInfo[]=[];

  constructor(private service : HttpServiceService) { }

  ngOnInit(): void {

    //get by id 
    let iduser: Number = 1;
    this.service.getUserbyID(iduser).subscribe((data: UsersInfo) => {console.log(data); this.userinfo = {
      ...data

    }});
 
    this.service.getUsersbyTenant(iduser).subscribe((data: UsersInfo[]) => {console.log(data); this.usersinfo = {
      ...data

    }});

    //si es administrador 
    this.service.getAllTenants().subscribe((data: TenantInfo[]) => {console.log(data); this.tenantinfo = {
      ...data

    }});
   
    
  }

}
