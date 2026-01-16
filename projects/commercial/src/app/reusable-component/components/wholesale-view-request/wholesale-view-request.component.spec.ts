import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WholesaleViewRequestComponent } from './wholesale-view-request.component';

describe('WholesaleViewRequestComponent', () => {
  let component: WholesaleViewRequestComponent;
  let fixture: ComponentFixture<WholesaleViewRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WholesaleViewRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WholesaleViewRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
