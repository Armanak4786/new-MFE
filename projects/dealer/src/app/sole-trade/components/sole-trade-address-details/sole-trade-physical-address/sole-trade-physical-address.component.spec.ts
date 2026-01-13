import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SoleTradePhysicalAddressComponent } from './sole-trade-physical-address.component';




describe('SoleTradePhysicalAddressComponent', () => {
  let component: SoleTradePhysicalAddressComponent;
  let fixture: ComponentFixture<SoleTradePhysicalAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoleTradePhysicalAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoleTradePhysicalAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
