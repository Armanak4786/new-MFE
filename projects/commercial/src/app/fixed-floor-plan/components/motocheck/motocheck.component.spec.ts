import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotocheckComponent } from './motocheck.component';

describe('MotocheckComponent', () => {
  let component: MotocheckComponent;
  let fixture: ComponentFixture<MotocheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotocheckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotocheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
