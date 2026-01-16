import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditlineFacilityComponent } from './creditline-facility.component';

describe('CreditlineFacilityComponent', () => {
  let component: CreditlineFacilityComponent;
  let fixture: ComponentFixture<CreditlineFacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditlineFacilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditlineFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
