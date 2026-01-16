import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditLoansComponent } from './credit-loans.component';

describe('CreditLoansComponent', () => {
  let component: CreditLoansComponent;
  let fixture: ComponentFixture<CreditLoansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditLoansComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
