import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import {  Observable, Subject } from 'rxjs';
import { Database } from '../Models/response/Database';
import { UserLogged } from '../Models/response/UserLogged';
import { LoginDTO } from '../Models/request/LoginDTO';
import { DatabaseDTO } from '../Models/request/DatabaseDTO';
import { RoleDTO } from '../Models/request/RoleDTO';
import { Roles } from '../Models/response/Roles';
import { RegisterDTO } from '../Models/request/RegisterDTO';
import { Tenant } from '../Models/Tenant';
import { RegisterUserDTO } from '../Models/request/RegisterUserDTO';
import { GlobalResponse } from '../Models/response/GlobalResponse';
import { UsersInfo } from '../Models/response/UsersInfo';
import { TenantInfo } from '../Models/response/TenantInfo';
import { updateUserDTO } from '../Models/request/UpdateUserDTO';
import { AuthService } from './auth.service';
import { OktaUserinfo } from '../Models/response/OktaUserinfo';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

//get enviroment url 
url : string = environment.apiURl;
oktaURL : string = environment.oktaBaseURL;

  constructor(private http: HttpClient , private auth : AuthService) { }

  //---------------------------------LOGIN info ----------------
//login local db
loginlocal(login: LoginDTO) {
   return this.http.post<UserLogged>(this.url  + "user/authenticate" , login).pipe();
  
}
//login sso
getUserToken(userID: number){
  const sendurl = `${this.url  + "User/validateUser?id="}${userID}`;
  return this.http.get<UserLogged>( sendurl).pipe();
  
}



//------------------------------------DATABASE-----------------
getAllDB (){
  return this.http.get<Database[]>(this.url + "Database/listDB");
}
getDBbyID (id:Number){
  const sendurl = `${this.url + "Database/getDB?id="}${id}`;
  return this.http.get<Database>(sendurl);
}
createDB(database :  DatabaseDTO) : Observable<boolean>{
  return this.http.post<boolean>(this.url + "Database/createDB", database)
    .pipe();
}
updateDB(database :  DatabaseDTO) : Observable<boolean>{
  return this.http.post<boolean>(this.url + "Database/updateDB", database)
    .pipe();
}
deleteDB(database :  DatabaseDTO) : Observable<boolean>{
  return this.http.post<boolean>(this.url + "Database/deleteDB", database)
    .pipe();
}

//------------------------------------Roles-----------------
getAllRole (){
  return this.http.get<Roles[]>(this.url + "Roles/listRole");
}
getRolebyID (id:Number){
  const sendurl = `${this.url + "Roles/getRole?id="}${id}`;
  return this.http.get<Roles>(sendurl);
}
createRole(role :  RoleDTO) : Observable<boolean>{
  return this.http.post<boolean>(this.url + "Roles/createRole", role)
    .pipe();
}
updateRole(role :  RoleDTO) : Observable<boolean>{
  return this.http.post<boolean>(this.url + "Roles/updateRole", role)
    .pipe();
}
deleteRole(role :  RoleDTO) : Observable<boolean>{
  return this.http.post<boolean>(this.url + "Roles/deleteRole", role)
    .pipe();
}

//------------------------------------USER-----------------
registerUser(register :  RegisterDTO) : Observable<Tenant>{
  return this.http.post<Tenant>(this.url + "User/register", register)
    .pipe();
}

createUsers(register :  RegisterUserDTO) : Observable<GlobalResponse>{
  return this.http.post<GlobalResponse>(this.url + "User/CreateUsers", register)
    .pipe();
}
getUserbyID(userID :  Number) {
  const sendurl = `${this.url + "User/UserID?id="}${userID}`;
  return this.http.get<UsersInfo>(sendurl);
}
getUsersbyTenant(userID :  Number) {
  const sendurl = `${this.url + "User/TenantUsers?id="}${userID}`;
  return this.http.get<UsersInfo[]>(sendurl);
}

getAllTenants() {
  return this.http.get<TenantInfo[]>(this.url + "User/Tenants");
}

//update user login 
updateUser(update :  updateUserDTO) : Observable<GlobalResponse>{
  return this.http.post<GlobalResponse>(this.url + "User/UpdateUsers", update)
    .pipe();
}

//-------------------------------------------------okta-user info-----------
//get user logeed in info
getOktaUserInfo() {
  return this.http.get<OktaUserinfo>(this.oktaURL + "userinfo");
}



}

