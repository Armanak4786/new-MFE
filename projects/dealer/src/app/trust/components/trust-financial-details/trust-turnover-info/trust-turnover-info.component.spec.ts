import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustTurnoverInfoComponent } from './trust-turnover-info.component';

describe('TrustTurnoverInfoComponent', () => {
  let component: TrustTurnoverInfoComponent;
  let fixture: ComponentFixture<TrustTurnoverInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustTurnoverInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustTurnoverInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
