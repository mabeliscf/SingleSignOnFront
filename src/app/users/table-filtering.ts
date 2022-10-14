import { DecimalPipe } from "@angular/common";
import { Component, EventEmitter, Output, PipeTransform } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { Roles } from "../Models/response/Roles";
import { TenantInfo } from "../Models/response/TenantInfo";
import { TENANTINFOTEST } from "../register-user/TENANTINFOTEST";



function search(text: string, pipe: PipeTransform): TenantInfo[] {
    return TENANTINFOTEST.filter(user => {
      const term = text.toLowerCase();
      return user.fullname.toLowerCase().includes(term)
      || user.email.toLowerCase().includes(term)
      || user.username.toLowerCase().includes(term)
      || pipe.transform(user.phone).includes(term)
      || pipe.transform(user.id).includes(term)
      ;
         
    });
  }
  
  @Component({
    selector: 'ngbd-table-users-filtering',
    templateUrl: './table-users.html',
    providers: [DecimalPipe]
  })
  export class NgbdTableUserFiltering {
  
    @Output() editUser : EventEmitter<TenantInfo> = new EventEmitter();

    
    userinfo$: Observable<TenantInfo[]>;
    filter = new FormControl('');
  
    constructor(pipe: DecimalPipe) {
      this.userinfo$ = this.filter.valueChanges.pipe(
        startWith(''),
        map(text => search(text, pipe))
      );
    }

    edit(user : TenantInfo){
        this.editUser.emit(user);

    }
  }