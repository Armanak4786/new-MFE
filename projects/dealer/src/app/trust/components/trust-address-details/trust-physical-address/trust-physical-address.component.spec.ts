import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrustPhysicalAddressComponent } from './trust-physical-address.component';



describe('TrustPhysicalAddressComponent', () => {
  let component: TrustPhysicalAddressComponent;
  let fixture: ComponentFixture<TrustPhysicalAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustPhysicalAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustPhysicalAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
