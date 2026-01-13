import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitDeclarationComponent } from './profit-declaration.component';

describe('ProfitDeclarationComponent', () => {
  let component: ProfitDeclarationComponent;
  let fixture: ComponentFixture<ProfitDeclarationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfitDeclarationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfitDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
