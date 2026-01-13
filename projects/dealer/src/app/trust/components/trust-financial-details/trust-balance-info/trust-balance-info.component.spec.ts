import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustBalanceInfoComponent } from './trust-balance-info.component';

describe('TrustBalanceInfoComponent', () => {
  let component: TrustBalanceInfoComponent;
  let fixture: ComponentFixture<TrustBalanceInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustBalanceInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustBalanceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
