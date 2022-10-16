import { DecimalPipe } from "@angular/common";
import { Component, EventEmitter, Output, PipeTransform } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { TenantInfo } from "../Models/response/TenantInfo";
import { HttpServiceService } from "../Service/http-service.service";



function search( tenantInfo : TenantInfo[], text: string, pipe: PipeTransform): TenantInfo[] {


    return tenantInfo.filter(user => {
      const term = text.toLowerCase();
      return user.firstName.toLowerCase().includes(term) ||
      user.lastName.toLowerCase().includes(term)
      || user.email.toLowerCase().includes(term)
      || user.username.toLowerCase().includes(term)
      || user.phone.toLowerCase().includes(term)
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
    @Output() selectedRow : EventEmitter<TenantInfo> = new EventEmitter();
    
    
    tenantinfo : TenantInfo[]=[];
    userinfo$: Observable<TenantInfo[]> | undefined;
    filter = new FormControl('');
  
    constructor(pipe: DecimalPipe, private service: HttpServiceService) {
      this.service.getAllTenants().toPromise().then(data=> {
        console.log(data);
        this.tenantinfo= data;
        console.log(this.tenantinfo);

        this.userinfo$ = this.filter.valueChanges.pipe(
          startWith(''),
          map(text => search(this.tenantinfo, text, pipe))
        );

      }); 

      
    




    }

    edit(user : TenantInfo){
        this.editUser.emit(user);

    }
    SelectRow(user : TenantInfo){
      this.selectedRow.emit(user);

    }
  }