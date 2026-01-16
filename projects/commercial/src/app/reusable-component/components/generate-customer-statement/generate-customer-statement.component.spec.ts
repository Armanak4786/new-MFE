import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateCustomerStatementComponent } from './generate-customer-statement.component';

describe('GenerateCustomerStatementComponent', () => {
  let component: GenerateCustomerStatementComponent;
  let fixture: ComponentFixture<GenerateCustomerStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateCustomerStatementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateCustomerStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
