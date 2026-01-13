import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusinessPhysicalAddressComponent } from './business-physical-address.component';



describe('BusinessPhysicalAddressComponent', () => {
  let component: BusinessPhysicalAddressComponent;
  let fixture: ComponentFixture<BusinessPhysicalAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessPhysicalAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessPhysicalAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
