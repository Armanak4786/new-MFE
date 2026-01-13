import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalAddressComponent } from './physical-address.component';

describe('PhysicalAddressComponent', () => {
  let component: PhysicalAddressComponent;
  let fixture: ComponentFixture<PhysicalAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhysicalAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysicalAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
