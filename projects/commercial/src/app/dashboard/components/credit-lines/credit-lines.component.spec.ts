import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditLinesComponent } from './credit-lines.component';

describe('CreditLinesComponent', () => {
  let component: CreditLinesComponent;
  let fixture: ComponentFixture<CreditLinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditLinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
