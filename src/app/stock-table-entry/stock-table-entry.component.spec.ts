import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTableEntryComponent } from './stock-table-entry.component';

describe('TableEntryComponent', () => {
  let component: StockTableEntryComponent;
  let fixture: ComponentFixture<StockTableEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockTableEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockTableEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
