import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditlineDrawdownRequestComponent } from './creditline-drawdown-request.component';

describe('CreditlineDrawdownRequestComponent', () => {
  let component: CreditlineDrawdownRequestComponent;
  let fixture: ComponentFixture<CreditlineDrawdownRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditlineDrawdownRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditlineDrawdownRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
