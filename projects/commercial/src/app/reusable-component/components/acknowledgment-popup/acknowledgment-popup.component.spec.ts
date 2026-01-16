import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgmentPopupComponent } from './acknowledgment-popup.component';

describe('AcknowledgmentPopupComponent', () => {
  let component: AcknowledgmentPopupComponent;
  let fixture: ComponentFixture<AcknowledgmentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcknowledgmentPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcknowledgmentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
