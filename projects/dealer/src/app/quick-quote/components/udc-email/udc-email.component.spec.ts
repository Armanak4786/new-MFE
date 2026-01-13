import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UdcEmailComponent } from './udc-email.component';

describe('UdcEmailComponent', () => {
  let component: UdcEmailComponent;
  let fixture: ComponentFixture<UdcEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UdcEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UdcEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
