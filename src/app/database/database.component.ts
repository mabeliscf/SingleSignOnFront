import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
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


  public showAlert: boolean =false;
  public message:string="";
  public isError : boolean =false;

  public idDB: number=0;

  CreateDBFrom = this.fb.group({
    dbName:["",Validators.required],
    dbSchema: ["",Validators.required],
    serverName: ["",Validators.required],
    serverRoute: ["",Validators.required],
  });

  constructor( private alertConfig: NgbAlertConfig , private fb : FormBuilder, private router: Router, private service : HttpServiceService) {

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
  }

  CreateDB(){
    let db : DatabaseDTO= {
      dbName: this.CreateDBFrom.controls["dbName"].value,
      dbSchema:this.CreateDBFrom.controls["dbSchema"].value,
      idDb:0,
      serverName: this.CreateDBFrom.controls["serverName"].value,
      serverRoute: this.CreateDBFrom.controls["serverRoute"].value
    }
    this.service.createDB(db).subscribe((result: boolean)=> {
      this.showAlert=true;
      if(!result){
       this.error();
      }
      this.success();
    });
  }

  updateDB(){
    let db : DatabaseDTO= {
      dbName: this.CreateDBFrom.controls["dbName"].value,
      dbSchema:this.CreateDBFrom.controls["dbSchema"].value,
      idDb:this.idDB,
      serverName: this.CreateDBFrom.controls["serverName"].value,
      serverRoute: this.CreateDBFrom.controls["serverRoute"].value
    }
    this.service.updateDB(db).subscribe((result: boolean)=> {
      this.showAlert=true;
      if(!result){
       this.error();
      }
      this.success();
    });
  }

  deleteDB(){

  }


  editSelectedDB(id: number){
    //load data in form control 

  }



  success(){
        this.alertConfig.type="success";
        this.message = "Guardado Correctamente";
        this.alertConfig.dismissible= false;
  }

  error(){
    this.alertConfig.type="danger";
    this.message = "Error al guardar";
    this.alertConfig.dismissible= false;
  }
  

}
