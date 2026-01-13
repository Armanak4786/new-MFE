import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualExpenditureComponent } from './individual-expenditure.component';

describe('IndividualExpenditureComponent', () => {
  let component: IndividualExpenditureComponent;
  let fixture: ComponentFixture<IndividualExpenditureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualExpenditureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualExpenditureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
