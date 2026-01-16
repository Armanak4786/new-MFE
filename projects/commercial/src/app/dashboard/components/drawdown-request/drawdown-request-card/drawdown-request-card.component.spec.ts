import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawdownRequestCardComponent } from './drawdown-request-card.component';

describe('DrawdownRequestCardComponent', () => {
  let component: DrawdownRequestCardComponent;
  let fixture: ComponentFixture<DrawdownRequestCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawdownRequestCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawdownRequestCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
