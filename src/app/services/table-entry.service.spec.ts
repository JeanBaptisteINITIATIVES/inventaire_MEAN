import { TestBed, inject } from '@angular/core/testing';

import { TableEntryService } from './table-entry.service';

describe('TableEntryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableEntryService]
    });
  });

  it('should be created', inject([TableEntryService], (service: TableEntryService) => {
    expect(service).toBeTruthy();
  }));
});
