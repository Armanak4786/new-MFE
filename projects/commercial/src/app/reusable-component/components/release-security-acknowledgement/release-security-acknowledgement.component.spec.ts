import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseSecurityAcknowledgementComponent } from './release-security-acknowledgement.component';

describe('ReleaseSecurityAcknowledgementComponent', () => {
  let component: ReleaseSecurityAcknowledgementComponent;
  let fixture: ComponentFixture<ReleaseSecurityAcknowledgementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseSecurityAcknowledgementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleaseSecurityAcknowledgementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
