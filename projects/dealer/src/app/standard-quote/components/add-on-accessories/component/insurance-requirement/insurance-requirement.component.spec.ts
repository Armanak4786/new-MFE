import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceRequirementComponent } from './insurance-requirement.component';

describe('InsuranceRequirementComponent', () => {
  let component: InsuranceRequirementComponent;
  let fixture: ComponentFixture<InsuranceRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsuranceRequirementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuranceRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
