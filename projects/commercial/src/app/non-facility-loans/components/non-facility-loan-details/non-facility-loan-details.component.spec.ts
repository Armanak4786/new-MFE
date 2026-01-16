import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonFacilityLoanDetailsComponent } from './non-facility-loan-details.component';

describe('NonFacilityLoanDetailsComponent', () => {
  let component: NonFacilityLoanDetailsComponent;
  let fixture: ComponentFixture<NonFacilityLoanDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonFacilityLoanDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonFacilityLoanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
