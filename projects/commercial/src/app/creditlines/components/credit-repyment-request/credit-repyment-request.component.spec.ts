import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditRepymentRequestComponent } from './credit-repyment-request.component';

describe('CreditRepymentRequestComponent', () => {
  let component: CreditRepymentRequestComponent;
  let fixture: ComponentFixture<CreditRepymentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditRepymentRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditRepymentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
