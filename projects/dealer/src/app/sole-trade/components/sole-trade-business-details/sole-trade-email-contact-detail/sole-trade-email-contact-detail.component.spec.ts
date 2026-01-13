import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoleTradeEmailContactDetailComponent } from './sole-trade-email-contact-detail.component';

describe('SoleTradeEmailContactDetailComponent', () => {
  let component: SoleTradeEmailContactDetailComponent;
  let fixture: ComponentFixture<SoleTradeEmailContactDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoleTradeEmailContactDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoleTradeEmailContactDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
