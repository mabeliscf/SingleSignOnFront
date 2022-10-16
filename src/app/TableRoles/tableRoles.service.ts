/* eslint-disable @typescript-eslint/adjacent-overload-signatures */

import { DecimalPipe } from "@angular/common";
import { Injectable, PipeTransform } from "@angular/core";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { debounceTime, delay, switchMap, tap } from "rxjs/operators";
import { Roles } from "../Models/response/Roles";
import { HttpServiceService } from "../Service/http-service.service";
import { SortColumn, SortDirection } from "./sortableroles.directive";


interface SearchResult {
  roles: Roles[];
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

function sort(roles: Roles[], column: SortColumn, direction: string): Roles[] {
  if (direction === '' || column === '') {
    return roles;
  } else {
    return [...roles].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(role: Roles, term: string, pipe: PipeTransform) {
  return role.roleDescription.toLowerCase().includes(term.toLowerCase())
    || pipe.transform(role.roleFather).includes(term)
    ;

}

@Injectable({providedIn: 'root'})
export class TableRolesService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _roles$ = new BehaviorSubject<Roles[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  public roleslist :Roles[]=[];
  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private service :HttpServiceService,  private pipe: DecimalPipe) {
    this.getDataReload();
  }

  get roles$() { return this._roles$.asObservable(); }
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

    
    // 1. sort

    let roles = sort(this.roleslist, sortColumn, sortDirection);

    // 2. filter
    roles = roles.filter(role => matches(role, searchTerm, this.pipe));
    const total = roles.length;

    // 3. paginate
    roles = roles.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({roles, total});
  }

  getDataReload(){
    this.service.getAllRole().toPromise().then(data=>  {
      this.roleslist= data;

      });
      this._search$.pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      ).subscribe(result => {
        this._roles$.next(result.roles);
        this._total$.next(result.total);
      });
  
      this._search$.next();
  }




}

