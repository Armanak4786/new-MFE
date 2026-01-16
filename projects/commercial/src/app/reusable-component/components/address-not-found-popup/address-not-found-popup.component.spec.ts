import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressNotFoundPopupComponent } from './address-not-found-popup.component';

describe('AddressNotFoundPopupComponent', () => {
  let component: AddressNotFoundPopupComponent;
  let fixture: ComponentFixture<AddressNotFoundPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddressNotFoundPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressNotFoundPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
