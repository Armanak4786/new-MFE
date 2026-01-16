import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WsRequestHistoryActionsComponent } from './ws-request-history-actions.component';

describe('WsRequestHistoryActionsComponent', () => {
  let component: WsRequestHistoryActionsComponent;
  let fixture: ComponentFixture<WsRequestHistoryActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WsRequestHistoryActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WsRequestHistoryActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
