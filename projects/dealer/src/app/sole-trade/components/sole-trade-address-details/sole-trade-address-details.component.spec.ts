import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SoleTradeAddressDetailsComponent } from './sole-trade-address-details.component';

describe('SoleTradeAddressDetailsComponent', () => {
  let component: SoleTradeAddressDetailsComponent;
  let fixture: ComponentFixture<SoleTradeAddressDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoleTradeAddressDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoleTradeAddressDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
