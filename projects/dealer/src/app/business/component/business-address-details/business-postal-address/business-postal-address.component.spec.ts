import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusinessPostalAddressComponent } from './business-postal-address.component';



describe('BusinessPostalAddressComponent', () => {
  let component: BusinessPostalAddressComponent;
  let fixture: ComponentFixture<BusinessPostalAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessPostalAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessPostalAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
