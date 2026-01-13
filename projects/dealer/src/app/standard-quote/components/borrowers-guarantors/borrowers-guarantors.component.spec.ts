import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowersGuarantorsComponent } from './borrowers-guarantors.component';

describe('BorrowersGuarantorsComponent', () => {
  let component: BorrowersGuarantorsComponent;
  let fixture: ComponentFixture<BorrowersGuarantorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowersGuarantorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowersGuarantorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
