import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatingLeaseComponent } from './operating-lease.component';

describe('OperatingLeaseComponent', () => {
  let component: OperatingLeaseComponent;
  let fixture: ComponentFixture<OperatingLeaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperatingLeaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperatingLeaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
