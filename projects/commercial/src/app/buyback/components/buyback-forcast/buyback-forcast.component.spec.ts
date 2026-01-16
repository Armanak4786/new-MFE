import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuybackForcastComponent } from './buyback-forcast.component';

describe('BuybackForcastComponent', () => {
  let component: BuybackForcastComponent;
  let fixture: ComponentFixture<BuybackForcastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuybackForcastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuybackForcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
