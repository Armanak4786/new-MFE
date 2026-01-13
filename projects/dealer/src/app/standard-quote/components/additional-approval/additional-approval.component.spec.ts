import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalApprovalComponent } from './additional-approval.component';

describe('AdditionalApprovalComponent', () => {
  let component: AdditionalApprovalComponent;
  let fixture: ComponentFixture<AdditionalApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdditionalApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
