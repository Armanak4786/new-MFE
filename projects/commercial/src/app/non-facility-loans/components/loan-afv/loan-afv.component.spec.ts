import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanAfvComponent } from './loan-afv.component';

describe('LoanAfvComponent', () => {
  let component: LoanAfvComponent;
  let fixture: ComponentFixture<LoanAfvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanAfvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanAfvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
