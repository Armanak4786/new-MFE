import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SoleTradeRegisterAddressComponent } from './sole-trade-registered-address.component';




describe('SoleTradeRegisterAddressComponent', () => {
  let component: SoleTradeRegisterAddressComponent;
  let fixture: ComponentFixture<SoleTradeRegisterAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoleTradeRegisterAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoleTradeRegisterAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
