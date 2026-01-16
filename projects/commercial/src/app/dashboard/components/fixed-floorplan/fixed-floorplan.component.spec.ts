import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedFloorplanComponent } from './fixed-floorplan.component';

describe('FixedFloorplanComponent', () => {
  let component: FixedFloorplanComponent;
  let fixture: ComponentFixture<FixedFloorplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixedFloorplanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedFloorplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
