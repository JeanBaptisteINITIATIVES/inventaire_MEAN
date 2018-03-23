import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeFormEntryComponent } from './free-form-entry.component';

describe('FreeFormEntryComponent', () => {
  let component: FreeFormEntryComponent;
  let fixture: ComponentFixture<FreeFormEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeFormEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeFormEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
