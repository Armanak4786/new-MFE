import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferRequestSubmissionComponent } from './transfer-request-submission.component';

describe('TransferRequestSubmissionComponent', () => {
  let component: TransferRequestSubmissionComponent;
  let fixture: ComponentFixture<TransferRequestSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferRequestSubmissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferRequestSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
