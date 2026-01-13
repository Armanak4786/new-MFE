import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  InsuranceDisclosureComponent } from './insurance-disclosure.component';

describe('BorrowersGuarantorsComponent', () => {
  let component:  InsuranceDisclosureComponent;
  let fixture: ComponentFixture< InsuranceDisclosureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ InsuranceDisclosureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent( InsuranceDisclosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
