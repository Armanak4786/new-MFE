import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrustPostalAddressComponent } from './trust-postal-address.component';



describe('BusinessPostalAddressComponent', () => {
  let component: TrustPostalAddressComponent;
  let fixture: ComponentFixture<TrustPostalAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustPostalAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustPostalAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
