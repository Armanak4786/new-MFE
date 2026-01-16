import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapViewRequestComponent } from './swap-view-request.component';

describe('SwapViewRequestComponent', () => {
  let component: SwapViewRequestComponent;
  let fixture: ComponentFixture<SwapViewRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwapViewRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwapViewRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
