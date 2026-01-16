import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonFacilityLoansComponent } from './non-facility-loans.component';

describe('NonFacilityLoansComponent', () => {
  let component: NonFacilityLoansComponent;
  let fixture: ComponentFixture<NonFacilityLoansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonFacilityLoansComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonFacilityLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
