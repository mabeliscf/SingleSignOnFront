import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { observable, Observable, of, Subject } from 'rxjs';
import { Database } from '../Models/Database';
import { catchError } from 'rxjs/operators';
import { UserLogged } from '../Models/UserLogged';
import { login } from '../Models/login';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

//get enviroment url 
url : string = environment.apiURl;

  constructor(private http: HttpClient ) { }

  sharedAccess : any = {
    username: "raemil",
    token: "token"
  } ;

  private LoginListener = new Subject<object>();
  login$ = this.LoginListener.asObservable();

  private tokenListener = new Subject<String>();
  token$ = this.tokenListener.asObservable();
 

//validate login 
GetLogin(){
  this.http.post(this.url + "user/authenticate" , {responseType: "json"})
  .subscribe(data=> {
  this.LoginListener.next(data);
  console.log(data);
  });
}
 loginlocal(login: login) {
   this.http.post<UserLogged>(this.url  + "user/authenticate" , login)
   .subscribe(a=>  {
    if(a!=undefined){
      console.log(a.token); 
      this.tokenListener.next(a.token); this.LoginListener.next(a);
      
    }
    });
}


getAllDB (){
  return this.http.get<Database[]>(this.url + "Database/listDB");
}




}
