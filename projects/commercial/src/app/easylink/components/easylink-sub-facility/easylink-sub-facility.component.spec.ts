import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasylinkSubFacilityComponent } from './easylink-sub-facility.component';

describe('EasylinkSubFacilityComponent', () => {
  let component: EasylinkSubFacilityComponent;
  let fixture: ComponentFixture<EasylinkSubFacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EasylinkSubFacilityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EasylinkSubFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
