import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SoleTradeCurrentEmploymentComponent } from './sole-trade-current-employment.component';





describe('SoleTradeCurrentEmploymentComponent', () => {
  let component: SoleTradeCurrentEmploymentComponent;
  let fixture: ComponentFixture<SoleTradeCurrentEmploymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoleTradeCurrentEmploymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoleTradeCurrentEmploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
