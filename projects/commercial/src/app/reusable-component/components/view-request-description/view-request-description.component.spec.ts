import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRequestDescriptionComponent } from './view-request-description.component';

describe('ViewRequestDescriptionComponent', () => {
  let component: ViewRequestDescriptionComponent;
  let fixture: ComponentFixture<ViewRequestDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRequestDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRequestDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
