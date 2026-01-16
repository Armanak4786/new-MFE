import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BailmentSummaryDashboardComponent } from './bailment-summary-dashboard.component';

describe('BailmentSummaryDashboardComponent', () => {
  let component: BailmentSummaryDashboardComponent;
  let fixture: ComponentFixture<BailmentSummaryDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BailmentSummaryDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BailmentSummaryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
