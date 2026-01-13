import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessFinancialComponent } from './business-financial.component';

describe('BusinessFinancialComponent', () => {
  let component: BusinessFinancialComponent;
  let fixture: ComponentFixture<BusinessFinancialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessFinancialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessFinancialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
