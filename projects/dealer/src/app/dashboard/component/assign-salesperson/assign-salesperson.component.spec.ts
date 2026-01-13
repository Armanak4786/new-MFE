import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSalespersonComponent } from './assign-salesperson.component';

describe('AssignSalespersonComponent', () => {
  let component: AssignSalespersonComponent;
  let fixture: ComponentFixture<AssignSalespersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignSalespersonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignSalespersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
