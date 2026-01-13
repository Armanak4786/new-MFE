import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrustPreviousAddressComponent } from './trust-previous-address.component';



describe('TrustPreviousAddressComponent', () => {
  let component: TrustPreviousAddressComponent;
  let fixture: ComponentFixture<TrustPreviousAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustPreviousAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustPreviousAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
