import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasylinkComponent } from './easylink.component';

describe('EasylinkComponent', () => {
  let component: EasylinkComponent;
  let fixture: ComponentFixture<EasylinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EasylinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EasylinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
