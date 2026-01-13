import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyVolumesComponent } from './monthly-volumes.component';

describe('MonthlyVolumesComponent', () => {
  let component: MonthlyVolumesComponent;
  let fixture: ComponentFixture<MonthlyVolumesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyVolumesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyVolumesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
