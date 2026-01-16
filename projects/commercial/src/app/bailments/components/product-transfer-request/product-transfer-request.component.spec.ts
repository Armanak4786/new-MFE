import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTransferRequestComponent } from './product-transfer-request.component';

describe('ProductTransferRequestComponent', () => {
  let component: ProductTransferRequestComponent;
  let fixture: ComponentFixture<ProductTransferRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTransferRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductTransferRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
