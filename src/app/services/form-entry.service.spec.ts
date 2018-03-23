import { TestBed, inject } from '@angular/core/testing';

import { FormEntryService } from './form-entry.service';

describe('FormEntryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormEntryService]
    });
  });

  it('should be created', inject([FormEntryService], (service: FormEntryService) => {
    expect(service).toBeTruthy();
  }));
});
