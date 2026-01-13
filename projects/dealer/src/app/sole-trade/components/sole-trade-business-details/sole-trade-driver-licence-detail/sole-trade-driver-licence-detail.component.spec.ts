import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoleTradeDriverLicenceDetailComponent } from './sole-trade-driver-licence-detail.component';

describe('SoleTradeDriverLicenceDetailComponent', () => {
  let component: SoleTradeDriverLicenceDetailComponent;
  let fixture: ComponentFixture<SoleTradeDriverLicenceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoleTradeDriverLicenceDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoleTradeDriverLicenceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
