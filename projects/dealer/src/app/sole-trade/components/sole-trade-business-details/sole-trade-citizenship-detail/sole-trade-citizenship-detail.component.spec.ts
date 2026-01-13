import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoleTradeCitizenshipDetailComponent } from './sole-trade-citizenship-detail.component';

describe('SoleTradeCitizenshipDetailComponent', () => {
  let component: SoleTradeCitizenshipDetailComponent;
  let fixture: ComponentFixture<SoleTradeCitizenshipDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoleTradeCitizenshipDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoleTradeCitizenshipDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
