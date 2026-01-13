import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargesAddOtherItemsComponent } from './charges-add-other-items.component';

describe('ChargesAddOtherItemsComponent', () => {
  let component: ChargesAddOtherItemsComponent;
  let fixture: ComponentFixture<ChargesAddOtherItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargesAddOtherItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargesAddOtherItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
