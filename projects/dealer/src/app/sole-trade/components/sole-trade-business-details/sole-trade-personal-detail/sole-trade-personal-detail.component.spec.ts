import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoleTradePersonalDetailComponent } from './sole-trade-personal-detail.component';

describe('SoleTradePersonalDetailComponent', () => {
  let component: SoleTradePersonalDetailComponent;
  let fixture: ComponentFixture<SoleTradePersonalDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoleTradePersonalDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoleTradePersonalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
