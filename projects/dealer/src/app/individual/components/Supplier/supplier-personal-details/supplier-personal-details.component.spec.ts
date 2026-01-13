import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPersonalDetailsComponent } from './supplier-personal-details.component';

describe('SupplierPersonalDetailsComponent', () => {
  let component: SupplierPersonalDetailsComponent;
  let fixture: ComponentFixture<SupplierPersonalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierPersonalDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierPersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
