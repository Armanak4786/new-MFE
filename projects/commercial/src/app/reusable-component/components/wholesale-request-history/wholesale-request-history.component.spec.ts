import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WholesaleRequestHistoryComponent } from './wholesale-request-history.component';

describe('WholesaleRequestHistoryComponent', () => {
  let component: WholesaleRequestHistoryComponent;
  let fixture: ComponentFixture<WholesaleRequestHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WholesaleRequestHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WholesaleRequestHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
