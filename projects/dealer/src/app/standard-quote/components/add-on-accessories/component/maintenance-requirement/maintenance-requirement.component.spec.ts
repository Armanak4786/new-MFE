import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceRequirementComponent } from './maintenance-requirement.component';

describe('MaintenanceRequirementComponent', () => {
  let component: MaintenanceRequirementComponent;
  let fixture: ComponentFixture<MaintenanceRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceRequirementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenanceRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
