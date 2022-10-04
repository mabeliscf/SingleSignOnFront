import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../Service/http-service.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

   userlogin :string ="";


  constructor(private service : HttpServiceService) {

   }

  ngOnInit(): void {
    this.userlogin = this.service.sharedAccess.username;
  }


}
