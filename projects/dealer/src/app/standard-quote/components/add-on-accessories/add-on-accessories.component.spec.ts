import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOnAccessoriesComponent } from './add-on-accessories.component';

describe('AddOnAccessoriesComponent', () => {
  let component: AddOnAccessoriesComponent;
  let fixture: ComponentFixture<AddOnAccessoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOnAccessoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOnAccessoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
