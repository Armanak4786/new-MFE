import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoleTradeBusinessCustomerRoleComponent } from './sole-trade-business-customer-role.component';

describe('SoleTradeBusinessCustomerRoleComponent', () => {
  let component: SoleTradeBusinessCustomerRoleComponent;
  let fixture: ComponentFixture<SoleTradeBusinessCustomerRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoleTradeBusinessCustomerRoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoleTradeBusinessCustomerRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
