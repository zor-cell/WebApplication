import { TestBed } from '@angular/core/testing';

import { Connect4Service } from './connect4.service';

describe('Connect4Service', () => {
  let service: Connect4Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Connect4Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
