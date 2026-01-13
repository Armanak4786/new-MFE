import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalFundsComponent } from './additional-funds.component';

describe('AdditionalFundsComponent', () => {
  let component: AdditionalFundsComponent;
  let fixture: ComponentFixture<AdditionalFundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdditionalFundsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalFundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
