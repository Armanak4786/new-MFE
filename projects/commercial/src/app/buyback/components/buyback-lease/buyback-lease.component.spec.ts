import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuybackLeaseComponent } from './buyback-lease.component';

describe('BuybackLeaseComponent', () => {
  let component: BuybackLeaseComponent;
  let fixture: ComponentFixture<BuybackLeaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuybackLeaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuybackLeaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
