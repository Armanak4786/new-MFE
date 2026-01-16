import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasylinkDrawdownRequestCardComponent } from './easylink-drawdown-request-card.component';

describe('EasylinkDrawdownRequestCardComponent', () => {
  let component: EasylinkDrawdownRequestCardComponent;
  let fixture: ComponentFixture<EasylinkDrawdownRequestCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EasylinkDrawdownRequestCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EasylinkDrawdownRequestCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
