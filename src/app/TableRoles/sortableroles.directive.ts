import {Directive, EventEmitter, Input, Output} from '@angular/core';
import { Roles } from '../Models/response/Roles';


export type SortColumn = keyof Roles | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortableR]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdSorRoletableHeader {

  @Input() sortableR: SortColumn = '';
  @Input() directionR: SortDirection = '';
  @Output() sortRole = new EventEmitter<SortEvent>();

  rotate() {
    this.directionR = rotate[this.directionR];
    this.sortRole.emit({column: this.sortableR, direction: this.directionR});
  }
}
