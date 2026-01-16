import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SameDayPayoutComponent } from './same-day-payout.component';

describe('SameDayPayoutComponent', () => {
  let component: SameDayPayoutComponent;
  let fixture: ComponentFixture<SameDayPayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SameDayPayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SameDayPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
