import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseSecurityComponent } from './release-security.component';

describe('ReleaseSecurityComponent', () => {
  let component: ReleaseSecurityComponent;
  let fixture: ComponentFixture<ReleaseSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseSecurityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleaseSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
