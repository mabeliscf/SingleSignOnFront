import { Component, OnInit } from '@angular/core';
import { RegisterDTO } from '../Models/request/RegisterDTO';
import { RegisterUserDTO } from '../Models/request/RegisterUserDTO';
import { Database } from '../Models/response/Database';
import { GlobalResponse } from '../Models/response/GlobalResponse';
import { Roles } from '../Models/response/Roles';
import { HttpServiceService } from '../Service/http-service.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  register : RegisterUserDTO ={
    username: "",
    phone: "",
    email: "",
    password: "",
    logintype: 0,
    isAdmin: false,
    isTenant: false,
    isUser: false,
    databases: [],
    roles: [],
    idTenantFather: 0,
    firstName: '',
    lastname: ''
  };

  response : GlobalResponse = { response:"", responseNumber:0}
  roles: Roles[] | undefined;
  databases: Database[] | undefined;

  

  constructor(private service :HttpServiceService) { /* TODO document why this constructor is empty */  }

  ngOnInit(): void {
    // TODO document why this method 'ngOnInit' is empty
    this.service.createUsers(this.register).subscribe((data: GlobalResponse) => {console.log(data); this.response= {
      ...data

    }});

     //get all
     this.service.getAllDB().subscribe((data: Database[]) => {console.log(data); this.databases= {
      ...data

    }});

      //get all
      this.service.getAllRole().subscribe((data: Roles[]) => {console.log(data); this.roles= {
        ...data
  
      }});
  
  }

}

