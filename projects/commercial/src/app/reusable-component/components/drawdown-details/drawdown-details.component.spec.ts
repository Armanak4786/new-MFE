import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawdownDetailsComponent } from './drawdown-details.component';

describe('DrawdownDetailsComponent', () => {
  let component: DrawdownDetailsComponent;
  let fixture: ComponentFixture<DrawdownDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawdownDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawdownDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
