import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoleTradeLiabilitiesComponent } from './sole-trade-liabilities.component';

describe('SoleTradeLiabilitiesComponent', () => {
  let component: SoleTradeLiabilitiesComponent;
  let fixture: ComponentFixture<SoleTradeLiabilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoleTradeLiabilitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoleTradeLiabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
