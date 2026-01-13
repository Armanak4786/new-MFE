import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPositionComponent } from './financial-position.component';

describe('FinancialPositionComponent', () => {
  let component: FinancialPositionComponent;
  let fixture: ComponentFixture<FinancialPositionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinancialPositionComponent]
    });
    fixture = TestBed.createComponent(FinancialPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
