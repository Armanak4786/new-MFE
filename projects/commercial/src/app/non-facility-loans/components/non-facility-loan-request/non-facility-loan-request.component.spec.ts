import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonFacilityLoanRequestComponent } from './non-facility-loan-request.component';

describe('NonFacilityLoanRequestComponent', () => {
  let component: NonFacilityLoanRequestComponent;
  let fixture: ComponentFixture<NonFacilityLoanRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonFacilityLoanRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonFacilityLoanRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
