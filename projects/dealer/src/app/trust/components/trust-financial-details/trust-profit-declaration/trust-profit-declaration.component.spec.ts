import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustProfitDeclarationComponent } from './trust-profit-declaration.component';

describe('TrustProfitDeclarationComponent', () => {
  let component: TrustProfitDeclarationComponent;
  let fixture: ComponentFixture<TrustProfitDeclarationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustProfitDeclarationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustProfitDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
