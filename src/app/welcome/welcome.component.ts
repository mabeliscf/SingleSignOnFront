import { Component, OnInit } from '@angular/core';
import { Roles } from '../Models/Roles';
import { HttpServiceService } from '../Service/http-service.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

   public userlogin :string ="";

   public roles: Roles[] = [];

  constructor(private service : HttpServiceService) {

   }

  ngOnInit(): void {
    //show login user name
    this.userlogin = this.service.sharedAccess.username;

    //show roles have access
    this.roles.push({ idRole: 1, roleDescription: "ROL 1",  roleFather: 0 });
    this.roles.push({ idRole: 2, roleDescription: "ROL 2",  roleFather: 0 });
    this.roles.push({ idRole: 3, roleDescription: "ROL 3",  roleFather: 0 });

  }


}
