import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlLeaseDetailsComponent } from './ol-lease-details.component';

describe('OlLeaseDetailsComponent', () => {
  let component: OlLeaseDetailsComponent;
  let fixture: ComponentFixture<OlLeaseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlLeaseDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlLeaseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
