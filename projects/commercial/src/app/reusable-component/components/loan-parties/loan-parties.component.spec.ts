import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanPartiesComponent } from './loan-parties.component';

describe('LoanPartiesComponent', () => {
  let component: LoanPartiesComponent;
  let fixture: ComponentFixture<LoanPartiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanPartiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanPartiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
