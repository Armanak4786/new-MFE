import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditlineCurrentAccountComponent } from './creditline-current-account.component';

describe('CreditlineCurrentAccountComponent', () => {
  let component: CreditlineCurrentAccountComponent;
  let fixture: ComponentFixture<CreditlineCurrentAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditlineCurrentAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditlineCurrentAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
