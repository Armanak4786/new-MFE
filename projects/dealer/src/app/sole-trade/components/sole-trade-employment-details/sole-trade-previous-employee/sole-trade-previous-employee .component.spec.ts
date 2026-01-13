import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SoleTradePreviousEmploymentComponent } from './sole-trade-previous-employee .component';





describe('SoleTradePreviousEmploymentComponent', () => {
  let component: SoleTradePreviousEmploymentComponent;
  let fixture: ComponentFixture<SoleTradePreviousEmploymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoleTradePreviousEmploymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoleTradePreviousEmploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
