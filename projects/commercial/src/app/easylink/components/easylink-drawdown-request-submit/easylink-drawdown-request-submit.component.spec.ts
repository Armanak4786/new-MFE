import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasylinkDrawdownRequestSubmitComponent } from './easylink-drawdown-request-submit.component';

describe('EasylinkDrawdownRequestSubmitComponent', () => {
  let component: EasylinkDrawdownRequestSubmitComponent;
  let fixture: ComponentFixture<EasylinkDrawdownRequestSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EasylinkDrawdownRequestSubmitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EasylinkDrawdownRequestSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
