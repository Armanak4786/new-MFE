import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusinessAddressDetailsComponent } from './business-address-details.component';




describe('BusinessAddressDetailsComponent', () => {
  let component: BusinessAddressDetailsComponent;
  let fixture: ComponentFixture<BusinessAddressDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessAddressDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessAddressDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
