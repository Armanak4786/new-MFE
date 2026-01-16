import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEasylinkComponent } from './view-easylink.component';

describe('ViewEasylinkComponent', () => {
  let component: ViewEasylinkComponent;
  let fixture: ComponentFixture<ViewEasylinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEasylinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEasylinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
