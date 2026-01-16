import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCreditlineComponent } from './view-creditline.component';

describe('ViewCreditlineComponent', () => {
  let component: ViewCreditlineComponent;
  let fixture: ComponentFixture<ViewCreditlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCreditlineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCreditlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
