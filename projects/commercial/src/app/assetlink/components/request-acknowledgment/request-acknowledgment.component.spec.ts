import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAcknowledgmentComponent } from './request-acknowledgment.component';

describe('RequestAcknowledgmentComponent', () => {
  let component: RequestAcknowledgmentComponent;
  let fixture: ComponentFixture<RequestAcknowledgmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestAcknowledgmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestAcknowledgmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
