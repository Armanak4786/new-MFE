import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BailmentNotesComponent } from './bailment-notes.component';

describe('BailmentNotesComponent', () => {
  let component: BailmentNotesComponent;
  let fixture: ComponentFixture<BailmentNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BailmentNotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BailmentNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
