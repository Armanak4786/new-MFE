import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseSecurityConfirmationComponent } from './release-security-confirmation.component';

describe('ReleaseSecurityConfirmationComponent', () => {
  let component: ReleaseSecurityConfirmationComponent;
  let fixture: ComponentFixture<ReleaseSecurityConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseSecurityConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleaseSecurityConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
