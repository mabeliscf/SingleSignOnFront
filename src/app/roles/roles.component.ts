import { Component, OnInit } from '@angular/core';
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
  role : Roles | undefined;


  constructor(private service : HttpServiceService) { }

  ngOnInit(): void {

    //get all
    this.service.getAllRole().subscribe((data: Roles[]) => {console.log(data); this.roles= {
      ...data

    }});

    //get by id 
    let idDatabase: Number = 1;
    this.service.getRolebyID(idDatabase).subscribe((data: Roles) => {console.log(data); this.role = {
      ...data

    }});

    let rolesDTO :  RoleDTO = {idRole:0,  roleDescription:"user role", roleFather: 0};

    //create 
    this.service.createRole(rolesDTO).subscribe((result: Boolean) => {console.log(result)});

    //update 
    this.service.updateRole(rolesDTO).subscribe((result: Boolean) => {console.log(result)});

    //delete 
    this.service.deleteRole(rolesDTO).subscribe((result: Boolean) => {console.log(result)});
  }

}
