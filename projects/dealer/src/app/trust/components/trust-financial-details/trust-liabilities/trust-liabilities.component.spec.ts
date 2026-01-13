import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustLiabilitiesComponent } from './trust-liabilities.component';

describe('TrustLiabilitiesComponent', () => {
  let component: TrustLiabilitiesComponent;
  let fixture: ComponentFixture<TrustLiabilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustLiabilitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustLiabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
