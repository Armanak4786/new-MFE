import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasylinkDrawdownRequestSubmitConfirmationComponent } from './easylink-drawdown-request-submit-confirmation.component';

describe('EasylinkDrawdownRequestSubmitConfirmationComponent', () => {
  let component: EasylinkDrawdownRequestSubmitConfirmationComponent;
  let fixture: ComponentFixture<EasylinkDrawdownRequestSubmitConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EasylinkDrawdownRequestSubmitConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EasylinkDrawdownRequestSubmitConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
