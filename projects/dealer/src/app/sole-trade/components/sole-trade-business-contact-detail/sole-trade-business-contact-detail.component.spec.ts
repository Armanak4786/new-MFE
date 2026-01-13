import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoleTradeBusinessContactDetailComponent } from './sole-trade-business-contact-detail.component';

describe('SoleTradeBusinessContactDetailComponent', () => {
  let component: SoleTradeBusinessContactDetailComponent;
  let fixture: ComponentFixture<SoleTradeBusinessContactDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoleTradeBusinessContactDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoleTradeBusinessContactDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
