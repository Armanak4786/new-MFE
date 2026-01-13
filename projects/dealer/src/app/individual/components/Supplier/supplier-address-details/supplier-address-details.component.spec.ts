import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierAddressDetailsComponent } from './supplier-address-details.component';

describe('SupplierAddressDetailsComponent', () => {
  let component: SupplierAddressDetailsComponent;
  let fixture: ComponentFixture<SupplierAddressDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierAddressDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierAddressDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
