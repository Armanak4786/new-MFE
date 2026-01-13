import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcessAllowanceComponent } from './excess-allowance.component';

describe('ExcessAllowanceComponent', () => {
  let component: ExcessAllowanceComponent;
  let fixture: ComponentFixture<ExcessAllowanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcessAllowanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcessAllowanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
