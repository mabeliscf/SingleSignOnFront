import {DecimalPipe} from '@angular/common';
import {Component, Output, QueryList, ViewChildren, EventEmitter} from '@angular/core';
import { Data } from '@angular/router';
import {Observable} from 'rxjs';
import { Database } from '../Models/response/Database';

import {NgbdSorDBtableHeader, SortEvent} from './sortabledb.directive';
import { TableDBService } from './tableDB.service';



@Component(
    {   selector: 'ngbd-table-DB-complete', 
        templateUrl: './tableDB-complete.html', 
        providers: [TableDBService, DecimalPipe]}
    )
export class NgbdTableDBComplete {


    @Output() deleteDB : EventEmitter<Database> = new EventEmitter();
    @Output() updateDB : EventEmitter<Database>  =new EventEmitter();


  databases$: Observable<Database[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSorDBtableHeader)
    headers!: QueryList<NgbdSorDBtableHeader>;

  constructor(public service: TableDBService) {
    this.databases$ = service.databases$;
    this.total$ = service.total$;
  }

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortableDB !== column) {
        header.directionDB = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  delete(database: Database){
    this.deleteDB.emit(database);

}
update (database: Database){
  this.updateDB.emit(database);
}

}
