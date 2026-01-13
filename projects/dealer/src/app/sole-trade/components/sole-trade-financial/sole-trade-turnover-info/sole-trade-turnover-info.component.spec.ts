import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoleTradeTurnoverInfoComponent } from './sole-trade-turnover-info.component';

describe('SoleTradeTurnoverInfoComponent', () => {
  let component: SoleTradeTurnoverInfoComponent;
  let fixture: ComponentFixture<SoleTradeTurnoverInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoleTradeTurnoverInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoleTradeTurnoverInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
