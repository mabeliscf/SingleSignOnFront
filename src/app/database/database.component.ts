import { Component, OnInit } from '@angular/core';
import { DatabaseDTO } from '../Models/request/DatabaseDTO';
import { Database } from '../Models/response/Database';
import { HttpServiceService } from '../Service/http-service.service';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.css']
})
export class DatabaseComponent implements OnInit {

  databases: Database[] | undefined;
  database : Database | undefined;

  constructor(private service : HttpServiceService) {

  }


  ngOnInit(): void {

    //get all
    this.service.getAllDB().subscribe((data: Database[]) => {console.log(data); this.databases= {
      ...data

    }});

    //get by id 
    let idDatabase: Number = 1;
    this.service.getDBbyID(idDatabase).subscribe((data: Database) => {console.log(data); this.database = {
      ...data

    }});

    let databaseDTO :  DatabaseDTO = {idDb:0,  dbSchema:"test", dbName: "testName" , serverRoute: "testrout",  serverName: "testserver"};

    //create 
    this.service.createDB(databaseDTO).subscribe((result: Boolean) => {console.log(result)});

    //update 
    this.service.updateDB(databaseDTO).subscribe((result: Boolean) => {console.log(result)});

    //delete 
    this.service.deleteDB(databaseDTO).subscribe((result: Boolean) => {console.log(result)});

  }

}
