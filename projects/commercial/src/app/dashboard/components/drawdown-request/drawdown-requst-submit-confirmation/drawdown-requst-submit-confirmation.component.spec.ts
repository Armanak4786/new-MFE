import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawdownRequstSubmitConfirmationComponent } from './drawdown-requst-submit-confirmation.component';

describe('DrawdownRequstSubmitConfirmationComponent', () => {
  let component: DrawdownRequstSubmitConfirmationComponent;
  let fixture: ComponentFixture<DrawdownRequstSubmitConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawdownRequstSubmitConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawdownRequstSubmitConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
