import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierBusinessPersonalDetailsComponent } from './supplier-business-personal-details.component';

describe('SupplierBusinessPersonalDetailsComponent', () => {
  let component: SupplierBusinessPersonalDetailsComponent;
  let fixture: ComponentFixture<SupplierBusinessPersonalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierBusinessPersonalDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierBusinessPersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
