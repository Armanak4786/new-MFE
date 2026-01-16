import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WRepaymentViewRequestComponent } from './w-repayment-view-request.component';

describe('WRepaymentViewRequestComponent', () => {
  let component: WRepaymentViewRequestComponent;
  let fixture: ComponentFixture<WRepaymentViewRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WRepaymentViewRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WRepaymentViewRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
