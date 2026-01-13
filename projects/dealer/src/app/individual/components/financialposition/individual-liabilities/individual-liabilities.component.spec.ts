import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualLiabilitiesComponent } from './individual-liabilities.component';

describe('IndividualLiabilitiesComponent', () => {
  let component: IndividualLiabilitiesComponent;
  let fixture: ComponentFixture<IndividualLiabilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualLiabilitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualLiabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
