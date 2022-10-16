import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TenantInfo } from '../Models/response/TenantInfo';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUpdate$ = new BehaviorSubject<TenantInfo>({
    roles: [],
    database: [],
    users: [],
    id: 0,
    firstName: '',
    lastName: '',
    loginType: 0,
    isTenant: false,
    isUser: false,
    tenantFather: 0,
    email: '',
    phone: '',
    username: '',
    isAdmin: false
  });
  selectedUserUpdate$ = this.userUpdate$.asObservable();

  constructor() { }


  setUserUpdate(user : TenantInfo){
    this.userUpdate$.next(user);
  }

}
