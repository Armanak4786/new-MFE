import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestRepaymentComponent } from './request-repayment.component';

describe('RequestRepaymentComponent', () => {
  let component: RequestRepaymentComponent;
  let fixture: ComponentFixture<RequestRepaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestRepaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestRepaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
