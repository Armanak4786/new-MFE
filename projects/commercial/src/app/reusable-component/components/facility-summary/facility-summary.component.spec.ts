import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilitySummaryComponent } from './facility-summary.component';

describe('FacilitySummaryComponent', () => {
  let component: FacilitySummaryComponent;
  let fixture: ComponentFixture<FacilitySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilitySummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacilitySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
