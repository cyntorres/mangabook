import { TestBed } from '@angular/core/testing';

import { Conversor } from './conversor';

describe('Conversor', () => {
  let service: Conversor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Conversor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
