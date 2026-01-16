import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingFloorplanComponent } from './floating-floorplan.component';

describe('FloatingFloorplanComponent', () => {
  let component: FloatingFloorplanComponent;
  let fixture: ComponentFixture<FloatingFloorplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingFloorplanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingFloorplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
