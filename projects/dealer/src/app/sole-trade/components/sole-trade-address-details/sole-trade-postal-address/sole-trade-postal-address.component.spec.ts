import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SoleTradePostalAddressComponent } from './sole-trade-postal-address.component';




describe('SoleTradePostalAddressComponent', () => {
  let component: SoleTradePostalAddressComponent;
  let fixture: ComponentFixture<SoleTradePostalAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoleTradePostalAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoleTradePostalAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
