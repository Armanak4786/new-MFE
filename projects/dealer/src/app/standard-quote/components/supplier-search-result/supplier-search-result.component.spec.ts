import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierSearchResultComponent } from './supplier-search-result.component';

describe('SupplierSearchResultComponent', () => {
  let component: SupplierSearchResultComponent;
  let fixture: ComponentFixture<SupplierSearchResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierSearchResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
