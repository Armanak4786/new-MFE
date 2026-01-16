import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BailmentCurrentAccountComponent } from './bailment-current-account.component';

describe('BailmentCurrentAccountComponent', () => {
  let component: BailmentCurrentAccountComponent;
  let fixture: ComponentFixture<BailmentCurrentAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BailmentCurrentAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BailmentCurrentAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
