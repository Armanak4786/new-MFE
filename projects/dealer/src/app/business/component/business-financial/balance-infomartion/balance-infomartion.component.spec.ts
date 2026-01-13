import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceInfomartionComponent } from './balance-infomartion.component';

describe('BalanceInfomartionComponent', () => {
  let component: BalanceInfomartionComponent;
  let fixture: ComponentFixture<BalanceInfomartionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceInfomartionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceInfomartionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
