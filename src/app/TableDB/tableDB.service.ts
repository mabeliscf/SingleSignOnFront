/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import {Injectable, PipeTransform} from '@angular/core';

import {BehaviorSubject, Observable, of, Subject} from 'rxjs';

import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import {SortColumn, SortDirection} from './sortabledb.directive';
import { Database } from '../Models/response/Database';
import { HttpServiceService } from '../Service/http-service.service';
import { COUNTRIES } from './Country';

interface SearchResult {
  databases: Database[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(databases: Database[], column: SortColumn, direction: string): Database[] {
  if (direction === '' || column === '') {
    return databases;
  } else {
    return [...databases].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(database: Database, term: string, pipe: PipeTransform) {
  return database.dbName.toLowerCase().includes(term.toLowerCase())
    || database.dbSchema.toLowerCase().includes(term.toLowerCase())
    || database.serverName.toLowerCase().includes(term.toLowerCase())
    || database.serverRoute.toLowerCase().includes(term.toLowerCase())
    ;

}

@Injectable({providedIn: 'root'})
export class TableDBService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _databases$ = new BehaviorSubject<Database[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private service :HttpServiceService,  private pipe: DecimalPipe) {
   
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._databases$.next(result.databases);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get databases$() { return this._databases$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    //get all
   // let databaseList : Database[]=[];
    // this.service.getAllDB().subscribe((data: Database[]) => {console.log(data); databaseList= {...data}});
    // 1. sort

    let databases = sort(COUNTRIES, sortColumn, sortDirection);

    // 2. filter
    databases = databases.filter(database => matches(database, searchTerm, this.pipe));
    const total = databases.length;

    // 3. paginate
    databases = databases.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({databases, total});
  }





}

