import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WDrawdownViewRequestComponent } from './w-drawdown-view-request.component';

describe('WDrawdownViewRequestComponent', () => {
  let component: WDrawdownViewRequestComponent;
  let fixture: ComponentFixture<WDrawdownViewRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WDrawdownViewRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WDrawdownViewRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
