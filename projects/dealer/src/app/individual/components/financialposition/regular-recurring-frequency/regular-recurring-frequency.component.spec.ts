import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularRecurringFrequencyComponent } from './regular-recurring-frequency.component';

describe('RegularRecurringFrequencyComponent', () => {
  let component: RegularRecurringFrequencyComponent;
  let fixture: ComponentFixture<RegularRecurringFrequencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegularRecurringFrequencyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegularRecurringFrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
