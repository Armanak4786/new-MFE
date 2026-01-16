import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasylinkDrawdownRequestComponent } from './easylink-drawdown-request.component';

describe('EasylinkDrawdownRequestComponent', () => {
  let component: EasylinkDrawdownRequestComponent;
  let fixture: ComponentFixture<EasylinkDrawdownRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EasylinkDrawdownRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EasylinkDrawdownRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
