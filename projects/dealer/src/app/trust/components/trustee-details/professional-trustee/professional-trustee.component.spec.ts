import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalTrusteeComponent } from './professional-trustee.component';

describe('ProfessionalTrusteeComponent', () => {
  let component: ProfessionalTrusteeComponent;
  let fixture: ComponentFixture<ProfessionalTrusteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessionalTrusteeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessionalTrusteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
