import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationOutcomeComponent } from './application-outcome.component';

describe('ApplicationOutcomeComponent', () => {
  let component: ApplicationOutcomeComponent;
  let fixture: ComponentFixture<ApplicationOutcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationOutcomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationOutcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
