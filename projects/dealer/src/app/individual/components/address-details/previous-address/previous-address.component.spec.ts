import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviousAddressComponent } from './previous-address.component';


describe('PreviousAddressComponent', () => {
  let component: PreviousAddressComponent;
  let fixture: ComponentFixture<PreviousAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviousAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviousAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
