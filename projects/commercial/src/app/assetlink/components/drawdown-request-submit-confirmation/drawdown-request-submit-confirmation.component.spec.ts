import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawdownRequestSubmitConfirmationComponent } from './drawdown-request-submit-confirmation.component';

describe('DrawdownRequestSubmitConfirmationComponent', () => {
  let component: DrawdownRequestSubmitConfirmationComponent;
  let fixture: ComponentFixture<DrawdownRequestSubmitConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawdownRequestSubmitConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawdownRequestSubmitConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
