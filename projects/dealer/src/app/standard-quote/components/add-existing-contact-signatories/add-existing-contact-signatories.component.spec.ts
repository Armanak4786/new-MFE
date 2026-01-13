import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExistingContactSignatoriesComponent } from './add-existing-contact-signatories.component';

describe('AddExistingContactSignatoriesComponent', () => {
  let component: AddExistingContactSignatoriesComponent;
  let fixture: ComponentFixture<AddExistingContactSignatoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExistingContactSignatoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExistingContactSignatoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
