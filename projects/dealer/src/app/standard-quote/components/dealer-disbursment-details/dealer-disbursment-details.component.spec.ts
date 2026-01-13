import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerDisbursmentDetailsComponent } from './dealer-disbursment-details.component';

describe('DealerDisbursmentDetailsComponent', () => {
  let component: DealerDisbursmentDetailsComponent;
  let fixture: ComponentFixture<DealerDisbursmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealerDisbursmentDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerDisbursmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
