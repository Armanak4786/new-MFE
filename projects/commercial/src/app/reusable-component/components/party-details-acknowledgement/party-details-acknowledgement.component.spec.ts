import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyDetailsAcknowledgementComponent } from './party-details-acknowledgement.component';

describe('PartyDetailsAcknowledgementComponent', () => {
  let component: PartyDetailsAcknowledgementComponent;
  let fixture: ComponentFixture<PartyDetailsAcknowledgementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartyDetailsAcknowledgementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyDetailsAcknowledgementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
