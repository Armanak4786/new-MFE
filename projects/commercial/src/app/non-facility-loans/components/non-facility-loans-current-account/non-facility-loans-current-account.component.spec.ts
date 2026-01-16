import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonFacilityLoansCurrentAccountComponent } from './non-facility-loans-current-account.component';

describe('NonFacilityLoansCurrentAccountComponent', () => {
  let component: NonFacilityLoansCurrentAccountComponent;
  let fixture: ComponentFixture<NonFacilityLoansCurrentAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonFacilityLoansCurrentAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonFacilityLoansCurrentAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
