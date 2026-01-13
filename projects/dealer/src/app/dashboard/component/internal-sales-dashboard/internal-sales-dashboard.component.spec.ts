import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalSalesDashboardComponent } from './internal-sales-dashboard.component';

describe('InternalSalesDashboardComponent', () => {
  let component: InternalSalesDashboardComponent;
  let fixture: ComponentFixture<InternalSalesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternalSalesDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternalSalesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
