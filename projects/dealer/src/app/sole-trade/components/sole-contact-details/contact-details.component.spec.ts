import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoleContactDetailsComponent } from './contact-details.component';

describe('ContactDetailsComponent', () => {
  let component: SoleContactDetailsComponent;
  let fixture: ComponentFixture<SoleContactDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoleContactDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoleContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
