import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TenantInfo } from '../Models/response/TenantInfo';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUpdate$ = new BehaviorSubject<TenantInfo>({});
  selectedUserUpdate$ = this.userUpdate$.asObservable();

  constructor() { }



  setUserUpdate(user : TenantInfo){
    this.userUpdate$.next(user);
  }

}
