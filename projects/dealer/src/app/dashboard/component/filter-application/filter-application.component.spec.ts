import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterApplicationComponent } from './filter-application.component';

describe('FilterApplicationComponent', () => {
  let component: FilterApplicationComponent;
  let fixture: ComponentFixture<FilterApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
