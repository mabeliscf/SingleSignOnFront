import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
  database : Database = {idDb:0, dbName:"", dbSchema: "", serverName: "" , serverRoute: ""};


  public showAlert: boolean =false;
  public message:string="";
  public isError : boolean =false;
  public action:string="Create";

  public idDB: number=0;



  dbName = new FormControl(null, [ (c: AbstractControl)=> Validators.required(c)]);
  dbSchema = new FormControl(null, [ (c: AbstractControl)=> Validators.required(c)]);
  serverName = new FormControl(null, [ (c: AbstractControl)=> Validators.required(c)]);
  serverRoute = new FormControl(null, [ (c: AbstractControl)=> Validators.required(c)]);

  CreateDBFrom = this.fb.group({
    dbName:this.dbName,
    dbSchema: this.dbSchema,
    serverName: this.serverName,
    serverRoute: this.serverRoute,
  });

  constructor( private alertConfig: NgbAlertConfig , private fb : FormBuilder, private router: Router, private service : HttpServiceService) {

  }


  ngOnInit(): void {

  }

  CreateDB(){
    let db : DatabaseDTO= {
      dbName: this.CreateDBFrom.controls["dbName"].value,
      dbSchema:this.CreateDBFrom.controls["dbSchema"].value,
      idDb:this.database.idDb,
      serverName: this.CreateDBFrom.controls["serverName"].value,
      serverRoute: this.CreateDBFrom.controls["serverRoute"].value
    }

    //update 
    if(this.database.idDb!=0){
      this.service.updateDB(db)
      .pipe(catchError(e=> throwError( this.error( e.error)  )))
      .subscribe((result: boolean)=> {
        if(result){
          this.showAlert=true;
          this.success(this.action +  "  Succesfull");
          this.clearform();
        }
       
      });

    }else {//create
      this.service.createDB(db)
      .pipe(catchError(e=> throwError( this.error( e.error)  )))
      .subscribe((result: boolean)=> {
        if(result){
          this.showAlert=true;
          this.success(this.action +" Succesfull");
          this.clearform();
        }
      });
    }

  }

  updateDBRequest(database: Database){
   
    this.action= "Update";
    this.database= database;
    console.log(database);

    //load form
    this.CreateDBFrom.controls["dbName"].setValue(this.database.dbName);
    this.CreateDBFrom.controls["dbSchema"].setValue(this.database.dbSchema);
    this.CreateDBFrom.controls["serverName"].setValue(this.database.serverName);
    this.CreateDBFrom.controls["serverRoute"].setValue(this.database.serverRoute);

  }

  deleteDBRequest(database: Database){

    console.log(database);
    this.service.deleteDB(database)
    .pipe(catchError(e=> throwError( this.error( e.error)  )))
    .subscribe((data: boolean)=> {
        this.success("Delete Succesfull");
    });
    

  }

 clearform(){
    this.action="Create";
    this.CreateDBFrom.reset();
  }



  success(message:string){
        this.alertConfig.type="success";
        this.message = message;
        this.alertConfig.dismissible= false;
  }

  error(error:string){
    this.alertConfig.type="danger";
    this.message = error;
    this.alertConfig.dismissible= false;
  }
  
  

}
