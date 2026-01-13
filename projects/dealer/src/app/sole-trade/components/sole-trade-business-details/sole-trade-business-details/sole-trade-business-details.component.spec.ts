import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoleTradeBusinessDetailsComponent } from './sole-trade-business-details.component';

describe('SoleTradeBusinessDetailsComponent', () => {
  let component: SoleTradeBusinessDetailsComponent;
  let fixture: ComponentFixture<SoleTradeBusinessDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoleTradeBusinessDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoleTradeBusinessDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
