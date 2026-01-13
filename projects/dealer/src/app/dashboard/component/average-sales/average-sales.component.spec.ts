import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageSalesComponent } from './average-sales.component';

describe('AverageSalesComponent', () => {
  let component: AverageSalesComponent;
  let fixture: ComponentFixture<AverageSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AverageSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AverageSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
