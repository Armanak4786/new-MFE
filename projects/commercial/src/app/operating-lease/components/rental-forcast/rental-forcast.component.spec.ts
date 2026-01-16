import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalForcastComponent } from './rental-forcast.component';

describe('RentalForcastComponent', () => {
  let component: RentalForcastComponent;
  let fixture: ComponentFixture<RentalForcastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalForcastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalForcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
