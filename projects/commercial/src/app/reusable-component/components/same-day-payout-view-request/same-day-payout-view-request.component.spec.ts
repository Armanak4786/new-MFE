import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SameDayPayoutViewRequestComponent } from './same-day-payout-view-request.component';

describe('SameDayPayoutViewRequestComponent', () => {
  let component: SameDayPayoutViewRequestComponent;
  let fixture: ComponentFixture<SameDayPayoutViewRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SameDayPayoutViewRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SameDayPayoutViewRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
