import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReducingLoansComponent } from './reducing-loans.component';

describe('ReducingLoansComponent', () => {
  let component: ReducingLoansComponent;
  let fixture: ComponentFixture<ReducingLoansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReducingLoansComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReducingLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
