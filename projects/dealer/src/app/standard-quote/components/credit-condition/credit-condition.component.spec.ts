import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditConditionComponent } from './credit-condition.component';

describe('CreditConditionComponent', () => {
  let component: CreditConditionComponent;
  let fixture: ComponentFixture<CreditConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditConditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
