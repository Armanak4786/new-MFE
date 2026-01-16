import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAddressDetailsComponent } from './update-address-details.component';

describe('UpdateAddressDetailsComponent', () => {
  let component: UpdateAddressDetailsComponent;
  let fixture: ComponentFixture<UpdateAddressDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateAddressDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAddressDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
