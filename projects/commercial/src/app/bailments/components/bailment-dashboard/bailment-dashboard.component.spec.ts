import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BailmentDashboardComponent } from './bailment-dashboard.component';

describe('BailmentDashboardComponent', () => {
  let component: BailmentDashboardComponent;
  let fixture: ComponentFixture<BailmentDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BailmentDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BailmentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
