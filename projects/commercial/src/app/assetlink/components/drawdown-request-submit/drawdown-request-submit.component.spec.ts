import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawdownRequestSubmitComponent } from './drawdown-request-submit.component';

describe('DrawdownRequestSubmitComponent', () => {
  let component: DrawdownRequestSubmitComponent;
  let fixture: ComponentFixture<DrawdownRequestSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawdownRequestSubmitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawdownRequestSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
