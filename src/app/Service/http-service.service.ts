import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

//get enviroment url 
url : string = environment.apiURl;

  constructor(private http: HttpClient ) { }

  private LoginListener = new Subject<object>();
  login$ = this.LoginListener.asObservable();


//validate login 
GetLogin(){
  this.http.get(this.url + "login" , {responseType: "json"})
  .subscribe(data=> {
  this.LoginListener.next(data);
  console.log(data);
  });
}





}
