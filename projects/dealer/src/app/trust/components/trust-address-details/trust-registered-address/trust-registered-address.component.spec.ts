import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrustRegisterAddressComponent } from './trust-registered-address.component';




describe('TrustRegisterAddressComponent', () => {
  let component: TrustRegisterAddressComponent;
  let fixture: ComponentFixture<TrustRegisterAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustRegisterAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustRegisterAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
