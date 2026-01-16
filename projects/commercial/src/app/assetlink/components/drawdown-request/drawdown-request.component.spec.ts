import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawdownRequestComponent } from './drawdown-request.component';

describe('DrawdownRequestComponent', () => {
  let component: DrawdownRequestComponent;
  let fixture: ComponentFixture<DrawdownRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawdownRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawdownRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
