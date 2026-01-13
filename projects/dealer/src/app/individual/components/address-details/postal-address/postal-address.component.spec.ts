import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostalAddressComponent } from './postal-address.component';



describe('PostalAddressComponent', () => {
  let component: PostalAddressComponent;
  let fixture: ComponentFixture<PostalAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostalAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostalAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
