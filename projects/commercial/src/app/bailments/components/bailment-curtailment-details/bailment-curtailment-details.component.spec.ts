import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BailmentCurtailmentDetailsComponent } from './bailment-curtailment-details.component';

describe('BailmentCurtailmentDetailsComponent', () => {
  let component: BailmentCurtailmentDetailsComponent;
  let fixture: ComponentFixture<BailmentCurtailmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BailmentCurtailmentDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BailmentCurtailmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
