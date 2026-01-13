import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSupplierIndividualComponent } from './add-supplier-individual.component';

describe('AddSupplierIndividualComponent', () => {
  let component: AddSupplierIndividualComponent;
  let fixture: ComponentFixture<AddSupplierIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSupplierIndividualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSupplierIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
