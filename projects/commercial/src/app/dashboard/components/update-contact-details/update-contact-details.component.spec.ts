import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateContactDetailsComponent } from './update-contact-details.component';

describe('UpdateContactDetailsComponent', () => {
  let component: UpdateContactDetailsComponent;
  let fixture: ComponentFixture<UpdateContactDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateContactDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
