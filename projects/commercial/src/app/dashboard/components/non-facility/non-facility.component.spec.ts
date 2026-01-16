import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonFacilityLoanComponent } from './non-facility.component';

describe('NonFacilityLoanComponent', () => {
  let component: NonFacilityLoanComponent;
  let fixture: ComponentFixture<NonFacilityLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonFacilityLoanComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NonFacilityLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
