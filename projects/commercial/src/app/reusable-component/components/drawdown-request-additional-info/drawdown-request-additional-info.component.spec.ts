import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawdownRequestAdditionalInfoComponent } from './drawdown-request-additional-info.component';

describe('DrawdownRequestAdditionalInfoComponent', () => {
  let component: DrawdownRequestAdditionalInfoComponent;
  let fixture: ComponentFixture<DrawdownRequestAdditionalInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawdownRequestAdditionalInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawdownRequestAdditionalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
