import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrustAddressDetailsComponent } from './trust-address-details.component';




describe('TrustAddressDetailsComponent', () => {
  let component: TrustAddressDetailsComponent;
  let fixture: ComponentFixture<TrustAddressDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustAddressDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustAddressDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
