import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierBankDetailsComponent } from './supplier-bank-details.component';

describe('SupplierBankDetailsComponent', () => {
  let component: SupplierBankDetailsComponent;
  let fixture: ComponentFixture<SupplierBankDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierBankDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
