import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotocheckTabComponent } from './motocheck-tab.component';

describe('MotocheckTabComponent', () => {
  let component: MotocheckTabComponent;
  let fixture: ComponentFixture<MotocheckTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotocheckTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotocheckTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
