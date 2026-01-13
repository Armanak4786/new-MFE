import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrusteeDetailsComponent } from './trustee-details.component';

describe('TrusteeDetailsComponent', () => {
  let component: TrusteeDetailsComponent;
  let fixture: ComponentFixture<TrusteeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrusteeDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrusteeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
