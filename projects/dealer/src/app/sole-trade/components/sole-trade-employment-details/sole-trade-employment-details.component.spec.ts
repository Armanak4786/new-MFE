import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SoleTradeEmploymentDetailsComponent } from './sole-trade-employment-details.component';





describe('SoleTradeEmploymentDetailsComponent', () => {
  let component: SoleTradeEmploymentDetailsComponent;
  let fixture: ComponentFixture<SoleTradeEmploymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoleTradeEmploymentDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoleTradeEmploymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
