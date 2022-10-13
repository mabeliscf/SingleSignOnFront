import {Directive, EventEmitter, Input, Output} from '@angular/core';
import { Database } from '../Models/response/Database';


export type SortColumn = keyof Database | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortableDB]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdSorDBtableHeader {

  @Input() sortableDB: SortColumn = '';
  @Input() directionDB: SortDirection = '';
  @Output() sortDB = new EventEmitter<SortEvent>();

  rotate() {
    this.directionDB = rotate[this.directionDB];
    this.sortDB.emit({column: this.sortableDB, direction: this.directionDB});
  }
}
