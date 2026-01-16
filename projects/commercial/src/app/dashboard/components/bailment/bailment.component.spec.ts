import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BailmentsComponent } from './bailment.component';

describe('BailmentsComponent', () => {
  let component: BailmentsComponent;
  let fixture: ComponentFixture<BailmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BailmentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BailmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
