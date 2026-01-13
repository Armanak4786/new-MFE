import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelQuoteConfirmationComponent } from './cancel-quote-confirmation.component';

describe('CancelQuoteConfirmationComponent', () => {
  let component: CancelQuoteConfirmationComponent;
  let fixture: ComponentFixture<CancelQuoteConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelQuoteConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelQuoteConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
