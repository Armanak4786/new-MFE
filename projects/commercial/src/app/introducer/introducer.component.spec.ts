import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroducerComponent } from './introducer.component';

describe('IntroducerComponent', () => {
  let component: IntroducerComponent;
  let fixture: ComponentFixture<IntroducerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntroducerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntroducerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
