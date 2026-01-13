import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  InsuranceFinalPopupComponent} from './insurance-final-popup.component';

describe('BorrowersGuarantorsComponent', () => {
  let component:  InsuranceFinalPopupComponent;
  let fixture: ComponentFixture< InsuranceFinalPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ InsuranceFinalPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent( InsuranceFinalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
