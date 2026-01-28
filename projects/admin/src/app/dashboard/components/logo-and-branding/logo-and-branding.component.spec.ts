import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoAndBrandingComponent } from './logo-and-branding.component';

describe('LogoAndBrandingComponent', () => {
  let component: LogoAndBrandingComponent;
  let fixture: ComponentFixture<LogoAndBrandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogoAndBrandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoAndBrandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
