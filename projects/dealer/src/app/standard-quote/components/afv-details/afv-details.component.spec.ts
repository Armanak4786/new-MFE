import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfvDetailsComponent } from './afv-details.component';

describe('AfvDetailsComponent', () => {
  let component: AfvDetailsComponent;
  let fixture: ComponentFixture<AfvDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfvDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfvDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
