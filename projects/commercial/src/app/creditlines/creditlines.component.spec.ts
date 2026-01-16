import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditlinesComponent } from './creditlines.component';

describe('CreditlinesComponent', () => {
  let component: CreditlinesComponent;
  let fixture: ComponentFixture<CreditlinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditlinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditlinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
