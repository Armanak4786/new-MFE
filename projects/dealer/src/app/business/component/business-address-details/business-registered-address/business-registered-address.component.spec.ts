import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusinessRegisterAddressComponent } from './business-registered-address.component';




describe('BusinessRegisterAddressComponent', () => {
  let component: BusinessRegisterAddressComponent;
  let fixture: ComponentFixture<BusinessRegisterAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessRegisterAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessRegisterAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
