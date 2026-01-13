import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusinessPreviousAddressComponent } from './business-previous-address.component';



describe('BusinessPreviousAddressComponent', () => {
  let component: BusinessPreviousAddressComponent;
  let fixture: ComponentFixture<BusinessPreviousAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessPreviousAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessPreviousAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
