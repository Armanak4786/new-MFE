import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SoleTradePreviousAddressComponent } from './sole-trade-previous-address.component';




describe('SoleTradePreviousAddressComponent', () => {
  let component: SoleTradePreviousAddressComponent;
  let fixture: ComponentFixture<SoleTradePreviousAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoleTradePreviousAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoleTradePreviousAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
