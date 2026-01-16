import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusNoteComponent } from './status-note.component';

describe('StatusNoteComponent', () => {
  let component: StatusNoteComponent;
  let fixture: ComponentFixture<StatusNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusNoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
