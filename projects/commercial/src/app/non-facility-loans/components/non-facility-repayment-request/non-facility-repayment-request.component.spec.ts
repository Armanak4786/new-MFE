import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonFacilityRepaymentRequestComponent } from './non-facility-repayment-request.component';

describe('NonFacilityRepaymentRequestComponent', () => {
  let component: NonFacilityRepaymentRequestComponent;
  let fixture: ComponentFixture<NonFacilityRepaymentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonFacilityRepaymentRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonFacilityRepaymentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
