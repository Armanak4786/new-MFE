import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoverInformationComponent } from './turnover-information.component';

describe('TurnoverInformationComponent', () => {
  let component: TurnoverInformationComponent;
  let fixture: ComponentFixture<TurnoverInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnoverInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnoverInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
