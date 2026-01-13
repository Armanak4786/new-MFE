import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigneeDiscloserComponent } from './assignee-discloser.component';

describe('AssigneeDiscloserComponent', () => {
  let component: AssigneeDiscloserComponent;
  let fixture: ComponentFixture<AssigneeDiscloserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssigneeDiscloserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssigneeDiscloserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
