import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTransferDisclaimerComponent } from './product-transfer-disclaimer.component';

describe('ProductTransferDisclaimerComponent', () => {
  let component: ProductTransferDisclaimerComponent;
  let fixture: ComponentFixture<ProductTransferDisclaimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTransferDisclaimerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductTransferDisclaimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
