import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankStatementVerificationOptionComponent } from './bank-statement-verification-option.component';

describe('BankStatementVerificationOptionComponent', () => {
  let component: BankStatementVerificationOptionComponent;
  let fixture: ComponentFixture<BankStatementVerificationOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankStatementVerificationOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankStatementVerificationOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
