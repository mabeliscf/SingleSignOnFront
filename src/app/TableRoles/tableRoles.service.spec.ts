import { TestBed } from '@angular/core/testing';

import { TableRolesService } from './tableRoles.service';

describe('TableRolesService', () => {
  let service: TableRolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableRolesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
