import { TestBed } from '@angular/core/testing';

import { AlServiceService } from './al-service.service';

describe('AlServiceService', () => {
  let service: AlServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
