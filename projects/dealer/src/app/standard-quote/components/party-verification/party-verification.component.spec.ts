import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyVerificationComponent } from './party-verification.component';

describe('PartyVerificationComponent', () => {
  let component: PartyVerificationComponent;
  let fixture: ComponentFixture<PartyVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartyVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
