import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalMessagesComponent } from './legal-messages.component';

describe('LegalMessagesComponent', () => {
  let component: LegalMessagesComponent;
  let fixture: ComponentFixture<LegalMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LegalMessagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegalMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
