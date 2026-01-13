import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoleTradeProfitDeclarationComponent } from './sole-trade-profit-declaration.component';

describe('SoleTradeProfitDeclarationComponent', () => {
  let component: SoleTradeProfitDeclarationComponent;
  let fixture: ComponentFixture<SoleTradeProfitDeclarationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoleTradeProfitDeclarationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoleTradeProfitDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
