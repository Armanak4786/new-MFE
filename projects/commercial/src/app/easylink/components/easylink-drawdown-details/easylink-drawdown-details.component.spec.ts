import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasylinkDrawdownDetailsComponent } from './easylink-drawdown-details.component';

describe('EasylinkDrawdownDetailsComponent', () => {
  let component: EasylinkDrawdownDetailsComponent;
  let fixture: ComponentFixture<EasylinkDrawdownDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EasylinkDrawdownDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EasylinkDrawdownDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
