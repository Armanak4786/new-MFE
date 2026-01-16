import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseSecurityRequestComponent } from './release-security-request.component';

describe('ReleaseSecurityRequestComponent', () => {
  let component: ReleaseSecurityRequestComponent;
  let fixture: ComponentFixture<ReleaseSecurityRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseSecurityRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleaseSecurityRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
