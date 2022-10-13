import { TestBed } from '@angular/core/testing';
import { TableDBService } from './tabledB.service';


describe('TableDBService', () => {
  let service: TableDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
