import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaseSummaryComponent } from './lease-summary.component';

describe('LeaseSummaryComponent', () => {
  let component: LeaseSummaryComponent;
  let fixture: ComponentFixture<LeaseSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaseSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaseSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
