import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeTableEntryComponent } from './free-table-entry.component';

describe('FreeTableEntryComponent', () => {
  let component: FreeTableEntryComponent;
  let fixture: ComponentFixture<FreeTableEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeTableEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeTableEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
