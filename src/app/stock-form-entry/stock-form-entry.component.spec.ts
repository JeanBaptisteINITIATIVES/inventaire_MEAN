import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockFormEntryComponent } from './stock-form-entry.component';

describe('FormEntryComponent', () => {
  let component: StockFormEntryComponent;
  let fixture: ComponentFixture<StockFormEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockFormEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockFormEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
