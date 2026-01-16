import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonFacilityLoanRequestCardComponent } from './non-facility-loan-request-card.component';

describe('NonFacilityLoanRequestCardComponent', () => {
  let component: NonFacilityLoanRequestCardComponent;
  let fixture: ComponentFixture<NonFacilityLoanRequestCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonFacilityLoanRequestCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonFacilityLoanRequestCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
