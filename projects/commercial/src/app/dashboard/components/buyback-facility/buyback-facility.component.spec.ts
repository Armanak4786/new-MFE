import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuybackFacilityComponent } from './buyback-facility.component';

describe('BuybackFacilityComponent', () => {
  let component: BuybackFacilityComponent;
  let fixture: ComponentFixture<BuybackFacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuybackFacilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuybackFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
