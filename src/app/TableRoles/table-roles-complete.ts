import {DecimalPipe} from '@angular/common';
import {Component, Output, QueryList, ViewChildren, EventEmitter} from '@angular/core';
import { Data } from '@angular/router';
import {Observable} from 'rxjs';
import { Roles } from '../Models/response/Roles';

import {NgbdSorRoletableHeader, SortEvent} from './sortableroles.directive';
import { TableRolesService } from './tableRoles.service';


@Component(
    {   selector: 'ngbd-table-roles-complete', 
        templateUrl: './table-roles-complete.html', 
        providers: [TableRolesService, DecimalPipe]}
    )
export class NgbdTableRolesComplete {


    @Output() deleteRole : EventEmitter<Roles> = new EventEmitter();
    @Output() updateRole : EventEmitter<Roles>  =new EventEmitter();


  roles$: Observable<Roles[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSorRoletableHeader)
    headers!: QueryList<NgbdSorRoletableHeader>;

  constructor(public service: TableRolesService) {
    this.roles$ = service.roles$;
    this.total$ = service.total$;
  }

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortableR !== column) {
        header.directionR = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  delete(role: Roles){
    this.deleteRole.emit(role);

}
update (role: Roles){
  this.updateRole.emit(role);
}

}
