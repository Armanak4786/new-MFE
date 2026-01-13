import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceLeaseComponent } from './finance-lease.component';

describe('FinanceLeaseComponent', () => {
  let component: FinanceLeaseComponent;
  let fixture: ComponentFixture<FinanceLeaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceLeaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceLeaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
