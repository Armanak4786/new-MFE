import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankStatementVerificationComponent } from './bank-statement-verification.component';

describe('BankStatementVerificationComponent', () => {
  let component: BankStatementVerificationComponent;
  let fixture: ComponentFixture<BankStatementVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankStatementVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankStatementVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
