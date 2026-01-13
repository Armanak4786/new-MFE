import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustFinancialDetailsComponent } from './trust-financial-details.component';

describe('TrustFinancialDetailsComponent', () => {
  let component: TrustFinancialDetailsComponent;
  let fixture: ComponentFixture<TrustFinancialDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustFinancialDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustFinancialDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
