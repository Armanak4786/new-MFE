import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaseStatementComponent } from './lease-statement.component';

describe('LeaseStatementComponent', () => {
  let component: LeaseStatementComponent;
  let fixture: ComponentFixture<LeaseStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaseStatementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaseStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
