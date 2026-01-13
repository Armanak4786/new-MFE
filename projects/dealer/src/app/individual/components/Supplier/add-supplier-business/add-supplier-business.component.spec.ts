import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSupplierBusinessComponent } from './add-supplier-business.component';

describe('AddSupplierBusinessComponent', () => {
  let component: AddSupplierBusinessComponent;
  let fixture: ComponentFixture<AddSupplierBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSupplierBusinessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSupplierBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
